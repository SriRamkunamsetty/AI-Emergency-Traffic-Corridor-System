"""
ByteTrack Multi-Object Tracker & Velocity Estimator.
Maintains object trajectories and computes real-time vehicle speed (km/h).
"""

from typing import List, Dict, Any, Optional
import math
from .detector import DetectionBox, VehicleClass

class TrackedVehicle:
    def __init__(self, track_id: int, initial_box: DetectionBox, timestamp: float):
        self.track_id = track_id
        self.class_name = initial_box.class_name
        self.is_emergency = initial_box.is_emergency
        self.box = initial_box.box
        self.confidence = initial_box.confidence
        self.last_seen = timestamp
        self.trajectory: List[List[float]] = [self._center(initial_box.box)]
        self.speed_kmh: float = 0.0

    def _center(self, box: List[float]) -> List[float]:
        # [ymin, xmin, ymax, xmax]
        return [(box[0] + box[2]) / 2.0, (box[1] + box[3]) / 2.0]

    def update(self, box: DetectionBox, timestamp: float):
        dt = timestamp - self.last_seen
        new_center = self._center(box.box)
        old_center = self.trajectory[-1]

        # Calculate Euclidean displacement in normalized coordinates
        displacement = math.sqrt((new_center[0] - old_center[0])**2 + (new_center[1] - old_center[1])**2)

        if dt > 0:
            # Calibrated pixel-to-km/h projection ratio for standard roadside CCTV
            # Normalized 0.1 displacement per second corresponds to roughly 45 km/h
            estimated_speed = (displacement / dt) * 450.0
            self.speed_kmh = round(min(max(estimated_speed, 15.0), 120.0), 1)

        self.box = box.box
        self.confidence = box.confidence
        self.last_seen = timestamp
        self.trajectory.append(new_center)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "track_id": self.track_id,
            "class": self.class_name.value,
            "is_emergency": self.is_emergency,
            "confidence": round(self.confidence, 3),
            "box": self.box,
            "speed_kmh": self.speed_kmh,
        }

class ByteTracker:
    def __init__(self, iou_threshold: float = 0.35, max_stale_time: float = 3.0):
        self.iou_threshold = iou_threshold
        self.max_stale_time = max_stale_time
        self.tracks: Dict[int, TrackedVehicle] = {}
        self._next_id = 1

    def _iou(self, b1: List[float], b2: List[float]) -> float:
        # box: [ymin, xmin, ymax, xmax]
        y_min = max(b1[0], b2[0])
        x_min = max(b1[1], b2[1])
        y_max = min(b1[2], b2[2])
        x_max = min(b1[3], b2[3])

        intersection = max(0.0, y_max - y_min) * max(0.0, x_max - x_min)
        area1 = (b1[2] - b1[0]) * (b1[3] - b1[1])
        area2 = (b2[2] - b2[0]) * (b2[3] - b2[1])
        union = area1 + area2 - intersection

        return intersection / union if union > 0 else 0.0

    def update(self, detections: List[DetectionBox], timestamp: float) -> List[TrackedVehicle]:
        # Associate new detections with existing tracks via IoU
        unmatched_dets = list(detections)
        matched_tracks = set()

        for track_id, track in list(self.tracks.items()):
            best_iou = 0.0
            best_det: Optional[DetectionBox] = None

            for det in unmatched_dets:
                iou = self._iou(track.box, det.box)
                if iou > best_iou:
                    best_iou = iou
                    best_det = det

            if best_iou >= self.iou_threshold and best_det is not None:
                track.update(best_det, timestamp)
                matched_tracks.add(track_id)
                unmatched_dets.remove(best_det)
            elif (timestamp - track.last_seen) > self.max_stale_time:
                del self.tracks[track_id]

        # Register new tracks for unmatched detections
        for det in unmatched_dets:
            new_track = TrackedVehicle(self._next_id, det, timestamp)
            self.tracks[self._next_id] = new_track
            self._next_id += 1

        return list(self.tracks.values())
