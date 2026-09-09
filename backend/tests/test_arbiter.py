import pytest
from backend.core.conflict_arbiter import (
    ConflictResolutionArbiter,
    ApproachingVehicle,
    EmergencyTier,
)

def test_arbiter_prioritizes_fire_engine_over_standard_ambulance():
    arbiter = ConflictResolutionArbiter(clearance_buffer_seconds=4.0)

    ambulance = ApproachingVehicle(
        vehicle_id="AMB-101",
        tier=EmergencyTier.AMBULANCE_STANDARD,
        approach_direction="NORTH_SOUTH",
        eta_seconds=10.0,
        speed_kmh=50.0,
    )
    fire_truck = ApproachingVehicle(
        vehicle_id="FIRE-202",
        tier=EmergencyTier.FIRE_ENGINE_HEAVY,
        approach_direction="EAST_WEST",
        eta_seconds=12.0,
        speed_kmh=60.0,
    )

    decision = arbiter.arbitrate([ambulance, fire_truck])

    assert decision["status"] == "PERPENDICULAR_CONFLICT_RESOLVED"
    # Fire Engine must receive primary priority despite having slightly higher ETA
    assert decision["primary_vehicle"] == "FIRE-202"
    assert decision["primary_direction"] == "EAST_WEST"
    assert decision["secondary_vehicle"] == "AMB-101"
    # Secondary gets green after fire truck passes (12.0s + 4.0s = 16.0s)
    assert decision["secondary_green_start_s"] == 16.0

def test_arbiter_allows_concurrent_green_for_collinear_vehicles():
    arbiter = ConflictResolutionArbiter()

    v1 = ApproachingVehicle("AMB-1", EmergencyTier.AMBULANCE_CRITICAL, "NORTH_SOUTH", 8.0, 50.0)
    v2 = ApproachingVehicle("POLICE-2", EmergencyTier.POLICE_PURSUIT, "NORTH_SOUTH", 12.0, 60.0)

    decision = arbiter.arbitrate([v1, v2])
    assert decision["status"] == "COLLINEAR_CONCURRENT_GREEN"
    assert decision["concurrent"] is True
