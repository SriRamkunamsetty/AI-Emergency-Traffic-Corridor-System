"""
IEEE ITS Empirical Benchmark Metrics Calculator.
Evaluates Average Travel Time (ATT), Side-Street Delay (SSDI), and Emission Reductions.
"""

from typing import Dict, Any

# EPA / CMEM Emission Constants for Light-Duty Emergency Diesel/Gasoline Vehicles
IDLE_FUEL_RATE_L_PER_HOUR = 1.80       # Liters / hour during red-light idling
IDLE_CO2_RATE_G_PER_SECOND = 1.15      # Grams of CO2 / second idling

class IEEEBenchmarkMetrics:
    @staticmethod
    def calculate_corridor_efficiency(
        baseline_travel_time_s: float,
        green_corridor_travel_time_s: float,
        civilian_cross_traffic_vehicles: int,
        added_cross_street_wait_s: float,
    ) -> Dict[str, Any]:
        """
        Computes benchmark metrics for IEEE conference / journal publications.
        """
        time_saved_s = max(0.0, baseline_travel_time_s - green_corridor_travel_time_s)
        att_reduction_pct = (time_saved_s / baseline_travel_time_s * 100.0) if baseline_travel_time_s > 0 else 0.0

        # Side-Street Delay Index (SSDI): Average delay penalty per non-priority car
        ssdi = added_cross_street_wait_s / max(civilian_cross_traffic_vehicles, 1)

        # Environmental impact: Fuel and CO2 saved by eliminating red-light stops
        fuel_saved_liters = (time_saved_s / 3600.0) * IDLE_FUEL_RATE_L_PER_HOUR
        co2_saved_grams = time_saved_s * IDLE_CO2_RATE_G_PER_SECOND

        return {
            "baseline_travel_time_s": round(baseline_travel_time_s, 1),
            "green_corridor_travel_time_s": round(green_corridor_travel_time_s, 1),
            "time_saved_s": round(time_saved_s, 1),
            "att_reduction_pct": round(att_reduction_pct, 2),
            "side_street_delay_index_s_per_veh": round(ssdi, 2),
            "fuel_saved_liters": round(fuel_saved_liters, 3),
            "co2_saved_grams": round(co2_saved_grams, 1),
        }
