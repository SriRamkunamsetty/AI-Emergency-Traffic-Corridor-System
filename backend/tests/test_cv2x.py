import pytest
from backend.protocols.cv2x_j2735 import (
    SignalRequestMessage,
    SignalStatusMessage,
    BasicVehicleRole,
    PriorityRequestType,
)

def test_srm_serialization_and_deserialization():
    srm = SignalRequestMessage(
        request_id=101,
        vehicle_role=BasicVehicleRole.AMBULANCE,
        intersection_id="DEL-JUNC-04",
        eta_seconds=14.5,
        latitude=28.5684,
        longitude=77.2095,
        speed_mps=15.2,
        heading_deg=180.0,
        request_type=PriorityRequestType.REQUEST,
    )

    serialized = srm.serialize()
    recovered = SignalRequestMessage.deserialize(serialized)

    assert recovered.request_id == 101
    assert recovered.vehicle_role == BasicVehicleRole.AMBULANCE
    assert recovered.intersection_id == "DEL-JUNC-04"
    assert recovered.eta_seconds == 14.5
    assert recovered.latitude == 28.5684

def test_ssm_acknowledges_correct_preemption_window():
    ssm = SignalStatusMessage(
        sequence_number=1,
        intersection_id="DEL-JUNC-04",
        granted_request_id=101,
        vehicle_role=BasicVehicleRole.AMBULANCE,
        green_window_start_s=12.0,
        green_window_duration_s=20.0,
    )

    d = ssm.to_dict()
    assert d["message_type"] == "SAE_J2735_SSM"
    assert d["status"] == "PRIORITY_GRANTED"
    assert d["granted_request_id"] == 101
    assert d["green_window_duration_s"] == 20.0
