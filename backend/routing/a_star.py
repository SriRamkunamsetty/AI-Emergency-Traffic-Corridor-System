"""
Congestion-Aware A* Routing Algorithm for Emergency Traffic Corridors.
Minimizes total estimated transit time incorporating live traffic telemetry.
"""

import heapq
from typing import List, Dict, Optional, Tuple
from .graph import RoadNetworkGraph, Node

class AStarRouter:
    def __init__(self, graph: RoadNetworkGraph):
        self.graph = graph

    def heuristic(self, current_node: Node, goal_node: Node) -> float:
        # Lower-bound transit time at max legal speed (80 km/h)
        distance = current_node.distance_to(goal_node)
        max_speed_mps = (80.0 * 1000.0) / 3600.0
        return distance / max_speed_mps

    def find_optimal_corridor(self, start_id: str, goal_id: str) -> Optional[Dict]:
        """
        Executes A* search to calculate the optimal green corridor route.
        Returns path node IDs, total travel time in seconds, and distance in meters.
        """
        if start_id not in self.graph.nodes or goal_id not in self.graph.nodes:
            return None

        start_node = self.graph.nodes[start_id]
        goal_node = self.graph.nodes[goal_id]

        # Priority queue stores (f_score, current_node_id)
        open_set: List[Tuple[float, str]] = []
        heapq.heappush(open_set, (0.0, start_id))

        came_from: Dict[str, str] = {}
        g_score: Dict[str, float] = {node_id: float("inf") for node_id in self.graph.nodes}
        g_score[start_id] = 0.0

        f_score: Dict[str, float] = {node_id: float("inf") for node_id in self.graph.nodes}
        f_score[start_id] = self.heuristic(start_node, goal_node)

        while open_set:
            _, current_id = heapq.heappop(open_set)

            if current_id == goal_id:
                # Reconstruct path
                path = [current_id]
                while current_id in came_from:
                    current_id = came_from[current_id]
                    path.append(current_id)
                path.reverse()

                # Calculate cumulative metrics
                total_distance = 0.0
                for i in range(len(path) - 1):
                    u, v = path[i], path[i + 1]
                    for edge in self.graph.adjacency.get(u, []):
                        if edge.v == v:
                            total_distance += edge.distance_m
                            break

                return {
                    "path": path,
                    "total_time_seconds": round(g_score[goal_id], 1),
                    "total_distance_meters": round(total_distance, 1),
                    "node_count": len(path),
                }

            current_node = self.graph.nodes[current_id]

            for edge in self.graph.adjacency.get(current_id, []):
                tentative_g = g_score[current_id] + edge.travel_time_seconds
                neighbor_id = edge.v

                if tentative_g < g_score[neighbor_id]:
                    came_from[neighbor_id] = current_id
                    g_score[neighbor_id] = tentative_g
                    f_score[neighbor_id] = tentative_g + self.heuristic(self.graph.nodes[neighbor_id], goal_node)
                    heapq.heappush(open_set, (f_score[neighbor_id], neighbor_id))

        return None
