"""
Acoustic Siren Detector for Emergency Vehicle Preemption.
Analyzes audio spectrum (500 Hz - 1,500 Hz) to detect sirens before vehicles enter visual range.
"""

import math
from typing import List, Dict, Any, Optional

SIREN_MIN_FREQ = 500.0   # Hz
SIREN_MAX_FREQ = 1500.0  # Hz

class AcousticSirenDetector:
    def __init__(self, sample_rate: int = 16000, confidence_threshold: float = 0.70):
        self.sample_rate = sample_rate
        self.confidence_threshold = confidence_threshold
        self.frequency_history: List[float] = []

    def compute_energy_in_band(self, frequencies: List[float], magnitudes: List[float]) -> float:
        """Calculates proportion of spectral energy contained within siren frequency band."""
        total_energy = sum(magnitudes)
        if total_energy <= 0.0:
            return 0.0

        band_energy = sum(
            mag for freq, mag in zip(frequencies, magnitudes)
            if SIREN_MIN_FREQ <= freq <= SIREN_MAX_FREQ
        )
        return band_energy / total_energy

    def detect_siren(self, dominant_frequency: float, spectral_energy_ratio: float) -> Dict[str, Any]:
        """
        Evaluates current audio frame.
        dominant_frequency: Current peak harmonic frequency in Hz.
        spectral_energy_ratio: Proportion of total energy concentrated in the siren band.
        """
        self.frequency_history.append(dominant_frequency)
        if len(self.frequency_history) > 20:
            self.frequency_history.pop(0)

        is_in_siren_band = SIREN_MIN_FREQ <= dominant_frequency <= SIREN_MAX_FREQ
        is_concentrated = spectral_energy_ratio >= 0.55

        # Check frequency modulation variance typical of wail/yelp sirens
        freq_variance = 0.0
        if len(self.frequency_history) >= 4:
            mean_f = sum(self.frequency_history) / len(self.frequency_history)
            freq_variance = sum((f - mean_f) ** 2 for f in self.frequency_history) / len(self.frequency_history)

        has_modulation = freq_variance > 1500.0 or len(self.frequency_history) < 4

        confidence = 0.0
        if is_in_siren_band and is_concentrated:
            confidence = min(0.60 + (spectral_energy_ratio * 0.35), 0.99)
            if has_modulation:
                confidence = min(confidence + 0.05, 0.99)

        siren_detected = confidence >= self.confidence_threshold

        return {
            "siren_detected": siren_detected,
            "confidence": round(confidence, 3),
            "dominant_frequency_hz": dominant_frequency,
            "band_energy_ratio": round(spectral_energy_ratio, 3),
            "siren_type": "WAIL_OR_YELP" if siren_detected else "NONE",
        }
