import pytest
from backend.routing.graph import RoadNetworkGraph
from backend.routing.a_star import AStarRouter

def build_test_grid() -> RoadNetworkGraph:
    # 4-node grid representing AIIMS (A) to Safdarjung (D) with two alternate paths:
    # Path 1: A -> B -> D (direct road, 1000m total)
    # Path 2: A -> C -> D (arterial detour, 1400m total)
    graph = RoadNetworkGraph()
    graph.add_node("A", "AIIMS Gate 1", 28.5670, 77.2100)
    graph.add_node("B", "Aurobindo Marg", 28.5685, 77.2110)
    graph.add_node("C", "Ring Road Flyover", 28.5660, 77.2130)
    graph.add_node("D", "Safdarjung Hospital", 28.5695, 77.2150)

    graph.add_edge("A", "B", distance_m=500.0, speed_limit_kmh=50.0)
    graph.add_edge("B", "D", distance_m=500.0, speed_limit_kmh=50.0)

    graph.add_edge("A", "C", distance_m=700.0, speed_limit_kmh=50.0)
    graph.add_edge("C", "D", distance_m=700.0, speed_limit_kmh=50.0)

    return graph

def test_astar_finds_direct_shortest_corridor():
    graph = build_test_grid()
    router = AStarRouter(graph)

    res = router.find_optimal_corridor("A", "D")
    assert res is not None
    # Under free flow, path A -> B -> D (1000m) should be chosen over A -> C -> D (1400m)
    assert res["path"] == ["A", "B", "D"]
    assert res["total_distance_meters"] == 1000.0

def test_astar_dynamically_reroutes_on_heavy_congestion():
    graph = build_test_grid()
    # Simulate heavy traffic jam (5x delay) on direct path B -> D
    graph.set_congestion("B", "D", congestion_factor=5.0)

    router = AStarRouter(graph)
    res = router.find_optimal_corridor("A", "D")

    assert res is not None
    # Router must dynamically choose alternate corridor A -> C -> D to bypass the jam!
    assert res["path"] == ["A", "C", "D"]
    assert res["total_distance_meters"] == 1400.0
