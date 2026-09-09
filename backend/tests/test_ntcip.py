import pytest
from backend.protocols.ntcip1202 import NTCIP1202Controller, SignalPhase, PreemptionState

def test_ntcip_immediate_green_when_cross_is_red():
    controller = NTCIP1202Controller("JUNC-01")
    res = controller.request_preemption("EMERGENCY-AMB-1")

    assert res["status"] == "GREEN_CORRIDOR_ACTIVE"
    assert controller.mainline_phase == SignalPhase.GREEN
    assert controller.cross_street_phase == SignalPhase.RED
    assert controller.preemption_state == PreemptionState.ACTIVE_GREEN_CORRIDOR

def test_ntcip_enforces_mandatory_yellow_and_all_red_clearance():
    controller = NTCIP1202Controller(
        "JUNC-02",
        yellow_clearance_seconds=3.0,
        all_red_seconds=1.0
    )
    # Simulate cross-street currently holding Green
    controller.cross_street_phase = SignalPhase.GREEN
    controller.mainline_phase = SignalPhase.RED

    t0 = 1000.0
    res = controller.request_preemption("EMERGENCY-AMB-2")
    controller.state_entered_time = t0
    assert res["status"] == "CLEARANCE_INITIATED"

    # At t = 1.5s: Must be in Yellow Clearance
    state_yellow = controller.update_cycle(current_time=t0 + 1.5)
    assert state_yellow["cross_street_phase"] == SignalPhase.YELLOW_CLEARANCE.value

    # At t = 3.5s: Must be in All-Red Clearance (all directions red)
    state_all_red = controller.update_cycle(current_time=t0 + 3.5)
    assert state_all_red["cross_street_phase"] == SignalPhase.ALL_RED.value
    assert state_all_red["mainline_phase"] == SignalPhase.RED.value

    # At t = 4.2s: Safety intervals completed, Green Corridor granted
    state_green = controller.update_cycle(current_time=t0 + 4.2)
    assert state_green["mainline_phase"] == SignalPhase.GREEN.value
    assert state_green["preemption_state"] == PreemptionState.ACTIVE_GREEN_CORRIDOR.value

def test_ntcip_failsafe_timeout_releases_preemption():
    controller = NTCIP1202Controller("JUNC-03", heartbeat_timeout_seconds=4.0)
    controller.request_preemption("EMERGENCY-AMB-3")
    t0 = 1000.0
    controller.last_heartbeat_time = t0

    # 5 seconds without heartbeat: fail-safe must automatically release preemption
    res = controller.update_cycle(current_time=t0 + 5.0)
    assert res["status"] == "FAILSAFE_TIMEOUT_RELEASED"
    assert controller.preemption_state == PreemptionState.IDLE
