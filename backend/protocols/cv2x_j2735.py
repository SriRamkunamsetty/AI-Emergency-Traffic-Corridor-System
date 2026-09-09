"""
SAE J2735 C-V2X (Cellular Vehicle-to-Everything) Priority Protocol.
Implements Signal Request Message (SRM) and Signal Status Message (SSM).
"""

from enum import IntEnum
from typing import Dict, Any, Optional
import time
import json

class BasicVehicleRole(IntEnum):
    NONE = 0
    POLICE = 1
    FIRE = 2
    AMBULANCE = 3
    PUBLIC_TRANSPORT = 4

class PriorityRequestType(IntEnum):
    REQUEST = 1
    REQUEST_UPDATE = 2
    CANCELLATION = 3

class SignalRequestMessage:
    """SAE J2735 SRM - Broadcast by emergency vehicle requesting green corridor."""
    def __init__(
        self,
        request_id: int,
        vehicle_role: BasicVehicleRole,
        intersection_id: str,
        eta_seconds: float,
        latitude: float,
        longitude: float,
        speed_mps: float,
        heading_deg: float,
        request_type: PriorityRequestType = PriorityRequestType.REQUEST,
    ):
        self.request_id = request_id
        self.vehicle_role = vehicle_role
        self.intersection_id = intersection_id
        self.eta_seconds = eta_seconds
        self.latitude = latitude
        self.longitude = longitude
        self.speed_mps = speed_mps
        self.heading_deg = heading_deg
        self.request_type = request_type
        self.timestamp = time.time()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "message_type": "SAE_J2735_SRM",
            "request_id": self.request_id,
            "vehicle_role": self.vehicle_role.name,
            "intersection_id": self.intersection_id,
            "eta_seconds": round(self.eta_seconds, 1),
            "position": {"lat": self.latitude, "lng": self.longitude},
            "speed_mps": round(self.speed_mps, 1),
            "heading_deg": round(self.heading_deg, 1),
            "request_type": self.request_type.name,
            "timestamp": self.timestamp,
        }

    def serialize(self) -> str:
        return json.dumps(self.to_dict())

    @classmethod
    def deserialize(cls, data: str) -> "SignalRequestMessage":
        payload = json.loads(data)
        return cls(
            request_id=payload["request_id"],
            vehicle_role=BasicVehicleRole[payload["vehicle_role"]],
            intersection_id=payload["intersection_id"],
            eta_seconds=payload["eta_seconds"],
            latitude=payload["position"]["lat"],
            longitude=payload["position"]["lng"],
            speed_mps=payload["speed_mps"],
            heading_deg=payload["heading_deg"],
            request_type=PriorityRequestType[payload["request_type"]],
        )

class SignalStatusMessage:
    """SAE J2735 SSM - Broadcast by Roadside Unit (RSU) acknowledging granted priority."""
    def __init__(
        self,
        sequence_number: int,
        intersection_id: str,
        granted_request_id: int,
        vehicle_role: BasicVehicleRole,
        green_window_start_s: float,
        green_window_duration_s: float,
    ):
        self.sequence_number = sequence_number
        self.intersection_id = intersection_id
        self.granted_request_id = granted_request_id
        self.vehicle_role = vehicle_role
        self.green_window_start_s = green_window_start_s
        self.green_window_duration_s = green_window_duration_s
        self.timestamp = time.time()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "message_type": "SAE_J2735_SSM",
            "sequence_number": self.sequence_number,
            "intersection_id": self.intersection_id,
            "granted_request_id": self.granted_request_id,
            "vehicle_role": self.vehicle_role.name,
            "green_window_start_s": round(self.green_window_start_s, 1),
            "green_window_duration_s": round(self.green_window_duration_s, 1),
            "status": "PRIORITY_GRANTED",
            "timestamp": self.timestamp,
        }

    def serialize(self) -> str:
        return json.dumps(self.to_dict())
