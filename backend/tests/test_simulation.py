import pytest
from backend.simulation.metrics import IEEEBenchmarkMetrics
from backend.simulation.sumo_bridge import SUMOMicroscopicBridge

def test_ieee_metrics_calculation():
    # Baseline: 600s (10 min), Green Corridor: 320s (5.33 min)
    res = IEEEBenchmarkMetrics.calculate_corridor_efficiency(
        baseline_travel_time_s=600.0,
        green_corridor_travel_time_s=320.0,
        civilian_cross_traffic_vehicles=40,
        added_cross_street_wait_s=120.0,
    )

    assert res["time_saved_s"] == 280.0
    assert res["att_reduction_pct"] == pytest.approx(46.67, rel=1e-2)
    assert res["side_street_delay_index_s_per_veh"] == 3.0  # 120s / 40 cars = 3s per car
    assert res["fuel_saved_liters"] > 0.10
    assert res["co2_saved_grams"] > 300.0

def test_sumo_bridge_generates_valid_xml():
    bridge = SUMOMicroscopicBridge()
    xml_str = bridge.generate_route_xml(corridor_edges=["edge_1", "edge_2", "edge_3"])

    assert "<routes>" in xml_str
    assert "ambulance" in xml_str
    assert "corridor_route" in xml_str

def test_sumo_step_physics_models_preemption_savings():
    bridge = SUMOMicroscopicBridge()
    dist = 1400.0
    speed = 14.0  # ~50 km/h

    without_preemption = bridge.run_microscopic_step_physics(dist, speed, signals_encountered=4, preempted=False)
    with_preemption = bridge.run_microscopic_step_physics(dist, speed, signals_encountered=4, preempted=True)

    # 4 signals * 24s delay = 96 seconds saved
    assert (without_preemption["transit_time_s"] - with_preemption["transit_time_s"]) == 96.0
