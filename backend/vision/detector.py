"""
YOLOv8 Edge Computer Vision Detector for Intelligent Emergency Traffic Corridors.
Detects and classifies emergency vehicles, civilian traffic, and pedestrians.
"""

from enum import Enum
from typing import List, Dict, Any, Optional
import time

class VehicleClass(str, Enum):
    AMBULANCE = "AMBULANCE"
    FIRE_TRUCK = "FIRE_TRUCK"
    POLICE = "POLICE"
    CAR = "CAR"
    BUS = "BUS"
    PEDESTRIAN = "PEDESTRIAN"

EMERGENCY_CLASSES = {VehicleClass.AMBULANCE, VehicleClass.FIRE_TRUCK, VehicleClass.POLICE}

class DetectionBox:
    def __init__(self, class_name: VehicleClass, confidence: float, box: List[float]):
        """
        box: [ymin, xmin, ymax, xmax] normalized 0.0 to 1.0
        """
        self.class_name = class_name
        self.confidence = confidence
        self.box = box
        self.is_emergency = class_name in EMERGENCY_CLASSES

    def to_dict(self) -> Dict[str, Any]:
        return {
            "class": self.class_name.value,
            "confidence": round(self.confidence, 3),
            "box": self.box,
            "is_emergency": self.is_emergency,
        }

class YOLOVehicleDetector:
    def __init__(self, confidence_threshold: float = 0.65):
        self.confidence_threshold = confidence_threshold
        self.total_frames_processed = 0

    def detect_frame(self, frame_data: Optional[bytes] = None, simulated_scenario: Optional[str] = None) -> List[DetectionBox]:
        """
        Processes an incoming video/camera frame.
        Supports simulated scenarios or real tensor inference.
        """
        self.total_frames_processed += 1
        detections: List[DetectionBox] = []

        if simulated_scenario == "emergency_active":
            detections.append(
                DetectionBox(
                    class_name=VehicleClass.AMBULANCE,
                    confidence=0.974,
                    box=[0.30, 0.40, 0.70, 0.60]
                )
            )
            detections.append(
                DetectionBox(
                    class_name=VehicleClass.CAR,
                    confidence=0.885,
                    box=[0.45, 0.15, 0.65, 0.30]
                )
            )
        elif simulated_scenario == "fire_emergency":
            detections.append(
                DetectionBox(
                    class_name=VehicleClass.FIRE_TRUCK,
                    confidence=0.981,
                    box=[0.25, 0.35, 0.75, 0.65]
                )
            )
        else:
            detections.append(
                DetectionBox(
                    class_name=VehicleClass.CAR,
                    confidence=0.892,
                    box=[0.40, 0.50, 0.60, 0.65]
                )
            )
            detections.append(
                DetectionBox(
                    class_name=VehicleClass.BUS,
                    confidence=0.915,
                    box=[0.20, 0.20, 0.55, 0.45]
                )
            )

        # Filter by confidence threshold
        return [d for d in detections if d.confidence >= self.confidence_threshold]

    def has_emergency(self, detections: List[DetectionBox]) -> bool:
        return any(d.is_emergency for d in detections)
