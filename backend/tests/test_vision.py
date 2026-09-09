import pytest
from backend.vision.detector import YOLOVehicleDetector, VehicleClass
from backend.vision.tracker import ByteTracker

def test_detector_returns_valid_emergency_detections():
    detector = YOLOVehicleDetector(confidence_threshold=0.7)
    detections = detector.detect_frame(simulated_scenario="emergency_active")

    assert len(detections) >= 1
    ambulance = next((d for d in detections if d.class_name == VehicleClass.AMBULANCE), None)
    assert ambulance is not None
    assert ambulance.is_emergency is True
    assert ambulance.confidence >= 0.7
    assert detector.has_emergency(detections) is True

def test_detector_filters_low_confidence():
    strict_detector = YOLOVehicleDetector(confidence_threshold=0.99)
    detections = strict_detector.detect_frame(simulated_scenario="emergency_active")
    # Confidence is 0.974, so strict 0.99 should filter it out
    assert len(detections) == 0

def test_tracker_tracks_and_estimates_velocity():
    detector = YOLOVehicleDetector()
    tracker = ByteTracker(iou_threshold=0.2)

    # Frame 1
    t1 = 1000.0
    dets1 = detector.detect_frame(simulated_scenario="emergency_active")
    tracks1 = tracker.update(dets1, t1)
    assert len(tracks1) >= 1
    amb_track = next(t for t in tracks1 if t.is_emergency)
    initial_id = amb_track.track_id

    # Frame 2 with slight displacement
    t2 = 1000.2
    dets2 = detector.detect_frame(simulated_scenario="emergency_active")
    # Shift box slightly forward to simulate movement
    dets2[0].box = [0.32, 0.42, 0.72, 0.62]
    tracks2 = tracker.update(dets2, t2)

    updated_amb = next((t for t in tracks2 if t.track_id == initial_id), None)
    assert updated_amb is not None
    assert updated_amb.speed_kmh > 0.0
    assert len(updated_amb.trajectory) == 2
