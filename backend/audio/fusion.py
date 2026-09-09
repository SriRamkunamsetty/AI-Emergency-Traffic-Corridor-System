"""
Multi-Modal Sensor Fusion Engine.
Fuses Optical Computer Vision (YOLO) with Acoustic Siren Detection.
"""

from typing import Dict, Any

class SensorFusionEngine:
    def __init__(self, visual_weight: float = 0.60, acoustic_weight: float = 0.40):
        self.visual_weight = visual_weight
        self.acoustic_weight = acoustic_weight

    def fuse(self, visual_detection: Dict[str, Any], acoustic_detection: Dict[str, Any]) -> Dict[str, Any]:
        """
        Fuses visual detection signals with acoustic siren signals.
        Returns unified emergency priority decision and fused confidence.
        """
        visual_conf = visual_detection.get("confidence", 0.0) if visual_detection.get("is_emergency") else 0.0
        acoustic_conf = acoustic_detection.get("confidence", 0.0) if acoustic_detection.get("siren_detected") else 0.0

        # Blind corner / Early alert: Acoustic detected before optical line of sight
        is_blind_corner_approach = (acoustic_conf > 0.75) and (visual_conf < 0.30)

        # Fused confidence calculation
        if is_blind_corner_approach:
            fused_confidence = acoustic_conf * 0.90
            status = "ACOUSTIC_EARLY_WARNING"
            trigger_preemption = True
        elif visual_conf > 0.60 and acoustic_conf > 0.60:
            # Multi-modal agreement boost
            fused_confidence = min(0.99, (visual_conf * self.visual_weight) + (acoustic_conf * self.acoustic_weight) + 0.10)
            status = "DUAL_MODALITY_CONFIRMED"
            trigger_preemption = True
        elif visual_conf > 0.70:
            fused_confidence = visual_conf
            status = "VISUAL_CONFIRMED"
            trigger_preemption = True
        else:
            fused_confidence = max(visual_conf, acoustic_conf)
            status = "NO_EMERGENCY"
            trigger_preemption = False

        return {
            "trigger_preemption": trigger_preemption,
            "status": status,
            "fused_confidence": round(fused_confidence, 3),
            "visual_confidence": round(visual_conf, 3),
            "acoustic_confidence": round(acoustic_conf, 3),
            "is_blind_corner_approach": is_blind_corner_approach,
        }
