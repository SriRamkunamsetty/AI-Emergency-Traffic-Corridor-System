"""
Municipal Road Network Graph Model for Congestion-Aware Routing.
"""

from typing import Dict, List, Optional
import math

class Node:
    def __init__(self, node_id: str, name: str, lat: float, lng: float):
        self.node_id = node_id
        self.name = name
        self.lat = lat
        self.lng = lng

    def distance_to(self, other: "Node") -> float:
        # Haversine distance in meters
        r = 6371000.0  # Earth radius in meters
        dlat = math.radians(other.lat - self.lat)
        dlng = math.radians(other.lng - self.lng)
        a = (math.sin(dlat / 2.0) ** 2 +
             math.cos(math.radians(self.lat)) * math.cos(math.radians(other.lat)) *
             math.sin(dlng / 2.0) ** 2)
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return r * c

class Edge:
    def __init__(self, u: str, v: str, distance_m: float, speed_limit_kmh: float = 50.0):
        self.u = u
        self.v = v
        self.distance_m = distance_m
        self.speed_limit_kmh = speed_limit_kmh
        self.congestion_factor = 1.0  # 1.0 = free flow, 3.0 = heavy gridlock

    @property
    def travel_time_seconds(self) -> float:
        speed_mps = (self.speed_limit_kmh * 1000.0) / 3600.0
        effective_speed = max(speed_mps / self.congestion_factor, 1.0)
        return self.distance_m / effective_speed

class RoadNetworkGraph:
    def __init__(self):
        self.nodes: Dict[str, Node] = {}
        self.adjacency: Dict[str, List[Edge]] = {}

    def add_node(self, node_id: str, name: str, lat: float, lng: float) -> Node:
        node = Node(node_id, name, lat, lng)
        self.nodes[node_id] = node
        if node_id not in self.adjacency:
            self.adjacency[node_id] = []
        return node

    def add_edge(self, u: str, v: str, distance_m: Optional[float] = None, speed_limit_kmh: float = 50.0, bidirectional: bool = True):
        if distance_m is None:
            distance_m = self.nodes[u].distance_to(self.nodes[v])

        edge_fwd = Edge(u, v, distance_m, speed_limit_kmh)
        self.adjacency[u].append(edge_fwd)

        if bidirectional:
            edge_rev = Edge(v, u, distance_m, speed_limit_kmh)
            self.adjacency[v].append(edge_rev)

    def set_congestion(self, u: str, v: str, congestion_factor: float):
        for edge in self.adjacency.get(u, []):
            if edge.v == v:
                edge.congestion_factor = max(1.0, congestion_factor)
