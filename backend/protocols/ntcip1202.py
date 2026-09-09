"""
NTCIP 1202 Standard Actuated Signal Controller Simulator.
Implements preemption state machines, safety clearance intervals (Yellow/All-Red),
and failsafe heartbeat watchdogs.
"""

import time
from enum import Enum
from typing import Dict, Any, Optional

class SignalPhase(str, Enum):
    GREEN = "GREEN"
    YELLOW_CLEARANCE = "YELLOW_CLEARANCE"
    ALL_RED = "ALL_RED"
    RED = "RED"

class PreemptionState(str, Enum):
    IDLE = "IDLE"
    PREEMPTION_REQUESTED = "PREEMPTION_REQUESTED"
    SAFETY_TRANSITION = "SAFETY_TRANSITION"
    ACTIVE_GREEN_CORRIDOR = "ACTIVE_GREEN_CORRIDOR"
    HOLD_FOR_CLEARANCE = "HOLD_FOR_CLEARANCE"

class NTCIP1202Controller:
    def __init__(
        self,
        intersection_id: str,
        yellow_clearance_seconds: float = 3.5,
        all_red_seconds: float = 1.5,
        heartbeat_timeout_seconds: float = 5.0,
    ):
        self.intersection_id = intersection_id
        self.yellow_clearance_seconds = yellow_clearance_seconds
        self.all_red_seconds = all_red_seconds
        self.heartbeat_timeout_seconds = heartbeat_timeout_seconds

        # Mainline arterial signal state
        self.mainline_phase = SignalPhase.GREEN
        # Conflicting cross-street signal state
        self.cross_street_phase = SignalPhase.RED

        self.preemption_state = PreemptionState.IDLE
        self.active_preemption_id: Optional[str] = None
        self.last_heartbeat_time = time.time()
        self.state_entered_time = time.time()

    def request_preemption(self, preemption_id: str, priority_level: int = 1) -> Dict[str, Any]:
        """
        NTCIP 1202 Preempt Trap command.
        Transitions conflicting phases through mandatory Yellow and All-Red clearances.
        """
        self.active_preemption_id = preemption_id
        self.last_heartbeat_time = time.time()

        if self.cross_street_phase in (SignalPhase.GREEN, SignalPhase.YELLOW_CLEARANCE):
            # Must safely flush cross-street traffic
            self.preemption_state = PreemptionState.SAFETY_TRANSITION
            self.cross_street_phase = SignalPhase.YELLOW_CLEARANCE
            self.state_entered_time = time.time()
            return {
                "status": "CLEARANCE_INITIATED",
                "phase": "YELLOW_CLEARANCE",
                "estimated_delay_s": self.yellow_clearance_seconds + self.all_red_seconds
            }
        else:
            self.preemption_state = PreemptionState.ACTIVE_GREEN_CORRIDOR
            self.mainline_phase = SignalPhase.GREEN
            self.cross_street_phase = SignalPhase.RED
            self.state_entered_time = time.time()
            return {
                "status": "GREEN_CORRIDOR_ACTIVE",
                "phase": "GREEN",
                "estimated_delay_s": 0.0
            }

    def heartbeat(self) -> bool:
        """Keep-alive heartbeat. Returns True if controller is healthy."""
        self.last_heartbeat_time = time.time()
        return True

    def update_cycle(self, current_time: Optional[float] = None) -> Dict[str, Any]:
        """
        Advances the controller state machine.
        Enforces safety intervals and handles failsafe drops on link timeout.
        """
        now = current_time if current_time is not None else time.time()

        # Watchdog timeout check (fail-safe return to standard cycles)
        if self.preemption_state == PreemptionState.ACTIVE_GREEN_CORRIDOR:
            if (now - self.last_heartbeat_time) > self.heartbeat_timeout_seconds:
                self.release_preemption()
                return {"status": "FAILSAFE_TIMEOUT_RELEASED", "mainline": self.mainline_phase.value}

        # Handle safety transitions
        if self.preemption_state == PreemptionState.SAFETY_TRANSITION:
            elapsed = now - self.state_entered_time
            if elapsed < self.yellow_clearance_seconds:
                self.cross_street_phase = SignalPhase.YELLOW_CLEARANCE
            elif elapsed < (self.yellow_clearance_seconds + self.all_red_seconds):
                self.cross_street_phase = SignalPhase.ALL_RED
                self.mainline_phase = SignalPhase.RED
            else:
                # All conflicting vehicles cleared safely: switch to active corridor
                self.preemption_state = PreemptionState.ACTIVE_GREEN_CORRIDOR
                self.cross_street_phase = SignalPhase.RED
                self.mainline_phase = SignalPhase.GREEN

        return {
            "intersection_id": self.intersection_id,
            "preemption_state": self.preemption_state.value,
            "mainline_phase": self.mainline_phase.value,
            "cross_street_phase": self.cross_street_phase.value,
        }

    def release_preemption(self):
        """Releases preemption control back to localized background cycle."""
        self.preemption_state = PreemptionState.IDLE
        self.active_preemption_id = None
        self.state_entered_time = time.time()
