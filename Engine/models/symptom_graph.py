import networkx as nx
from itertools import combinations

class SymptomGraph:
    def __init__(self):
        self.graph = nx.Graph()

    def update_graph(self, symptoms, day):
        nodes = [
            s["normalized"]
            for s in symptoms
            if len(s["normalized"].split()) >= 2
        ]

        for node in nodes:
            if not self.graph.has_node(node):
                self.graph.add_node(node, last_seen=day)
            else:
                self.graph.nodes[node]["last_seen"] = day

        for a, b in combinations(nodes, 2):
            if self.graph.has_edge(a, b):
                self.graph[a][b]["weight"] += 1
                self.graph[a][b]["last_seen"] = day
            else:
                self.graph.add_edge(a, b, weight=1, last_seen=day)


    def get_relationships(self, symptom):
        if symptom in self.graph:
            return self.graph[symptom]
        return {}
