"""
Multi-Emergency Conflict Resolution Arbiter.
Resolves simultaneous perpendicular emergency arrivals at traffic junctions.
"""

from enum import IntEnum
from typing import List, Dict, Any, Optional

class EmergencyTier(IntEnum):
    FIRE_ENGINE_HEAVY = 1     # Highest: High momentum, severe hazard
    AMBULANCE_CRITICAL = 2    # Code 3 critical patient
    POLICE_PURSUIT = 3        # Pursuit unit
    AMBULANCE_STANDARD = 4    # Routine emergency

class ApproachingVehicle:
    def __init__(
        self,
        vehicle_id: str,
        tier: EmergencyTier,
        approach_direction: str,  # "NORTH_SOUTH" vs "EAST_WEST"
        eta_seconds: float,
        speed_kmh: float,
    ):
        self.vehicle_id = vehicle_id
        self.tier = tier
        self.approach_direction = approach_direction
        self.eta_seconds = eta_seconds
        self.speed_kmh = speed_kmh

class ConflictResolutionArbiter:
    def __init__(self, clearance_buffer_seconds: float = 4.0):
        self.clearance_buffer_seconds = clearance_buffer_seconds

    def arbitrate(self, vehicles: List[ApproachingVehicle]) -> Dict[str, Any]:
        """
        Resolves conflict between vehicles approaching from conflicting angles.
        Returns scheduled primary and secondary corridors.
        """
        if not vehicles:
            return {"status": "NO_CONFLICT", "active_vehicle": None, "queue": []}

        if len(vehicles) == 1:
            v = vehicles[0]
            return {
                "status": "CLEAR_SINGLE_CORRIDOR",
                "primary_vehicle": v.vehicle_id,
                "primary_direction": v.approach_direction,
                "green_start_s": max(0.0, v.eta_seconds - 3.0),
                "secondary_vehicle": None,
                "secondary_green_start_s": None,
            }

        # Multiple vehicles approaching: Check directional conflict
        directions = {v.approach_direction for v in vehicles}
        has_perpendicular_conflict = len(directions) > 1

        # Sort priority: Tier (lowest IntEnum = highest priority), then ETA (earliest arrival)
        sorted_vehicles = sorted(vehicles, key=lambda v: (v.tier.value, v.eta_seconds))

        primary = sorted_vehicles[0]
        secondary = sorted_vehicles[1]

        if not has_perpendicular_conflict:
            # Same corridor direction: both can pass in same green phase!
            return {
                "status": "COLLINEAR_CONCURRENT_GREEN",
                "primary_vehicle": primary.vehicle_id,
                "primary_direction": primary.approach_direction,
                "secondary_vehicle": secondary.vehicle_id,
                "secondary_direction": secondary.approach_direction,
                "concurrent": True,
            }

        # Staggered perpendicular preemption
        # Primary gets immediate green wave
        primary_start = max(0.0, primary.eta_seconds - 3.0)
        # Secondary gets green after primary has crossed + clearance buffer
        secondary_start = primary.eta_seconds + self.clearance_buffer_seconds

        return {
            "status": "PERPENDICULAR_CONFLICT_RESOLVED",
            "conflict_detected": True,
            "primary_vehicle": primary.vehicle_id,
            "primary_tier": primary.tier.name,
            "primary_direction": primary.approach_direction,
            "primary_green_start_s": round(primary_start, 1),
            "secondary_vehicle": secondary.vehicle_id,
            "secondary_tier": secondary.tier.name,
            "secondary_direction": secondary.approach_direction,
            "secondary_green_start_s": round(secondary_start, 1),
            "safety_buffer_s": self.clearance_buffer_seconds,
        }
