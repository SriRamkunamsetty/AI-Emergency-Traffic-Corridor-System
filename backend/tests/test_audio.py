import pytest
from backend.audio.siren_detector import AcousticSirenDetector
from backend.audio.fusion import SensorFusionEngine

def test_siren_detector_positive_wail():
    detector = AcousticSirenDetector(confidence_threshold=0.70)
    # Siren operating at 950 Hz with 78% energy in 500-1500Hz band
    res = detector.detect_siren(dominant_frequency=950.0, spectral_energy_ratio=0.78)

    assert res["siren_detected"] is True
    assert res["confidence"] >= 0.70
    assert res["siren_type"] == "WAIL_OR_YELP"

def test_siren_detector_rejects_traffic_noise():
    detector = AcousticSirenDetector(confidence_threshold=0.70)
    # Low frequency diesel engine rumble (120 Hz) with only 10% in siren band
    res = detector.detect_siren(dominant_frequency=120.0, spectral_energy_ratio=0.10)

    assert res["siren_detected"] is False
    assert res["confidence"] == 0.0

def test_sensor_fusion_handles_blind_corner_early_warning():
    fusion = SensorFusionEngine()
    visual = {"is_emergency": False, "confidence": 0.10}
    acoustic = {"siren_detected": True, "confidence": 0.88}

    res = fusion.fuse(visual, acoustic)
    assert res["trigger_preemption"] is True
    assert res["is_blind_corner_approach"] is True
    assert res["status"] == "ACOUSTIC_EARLY_WARNING"

def test_sensor_fusion_boosts_dual_confirmation():
    fusion = SensorFusionEngine()
    visual = {"is_emergency": True, "confidence": 0.90}
    acoustic = {"siren_detected": True, "confidence": 0.85}

    res = fusion.fuse(visual, acoustic)
    assert res["trigger_preemption"] is True
    assert res["status"] == "DUAL_MODALITY_CONFIRMED"
    assert res["fused_confidence"] >= 0.95
