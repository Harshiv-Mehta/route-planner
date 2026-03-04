package com.metro.planner;

import java.util.PriorityQueue;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;


public class DijkstraAlgorithm {

    
    private static class PathNode implements Comparable<PathNode> {
        int stationIndex;
        double distance;
        int stops;
        double cost;
        RouteType routeType;

        PathNode(int stationIndex, double distance, int stops, double cost, RouteType routeType) {
            this.stationIndex = stationIndex;
            this.distance = distance;
            this.stops = stops;
            this.cost = cost;
            this.routeType = routeType;
        }

        @Override
        public int compareTo(PathNode other) {
            switch (this.routeType) {
                case SHORTEST_DISTANCE:
                    return Double.compare(this.distance, other.distance);
                case CHEAPEST_FARE:
                    return Double.compare(this.cost, other.cost);
                case LEAST_STOPS:
                    return Integer.compare(this.stops, other.stops);
                default:
                    return Double.compare(this.distance, other.distance);
            }
        }
    }

    
    public enum RouteType {
        SHORTEST_DISTANCE, 
        CHEAPEST_FARE,      
        LEAST_STOPS         
    }

    private Graph graph;                   
    private double[] distances;            
    private double[] costs;                 
    private int[] stopCounts;               
    private int[] previousStations;         
    private boolean[] visited;              

    
    public DijkstraAlgorithm(Graph graph) {
        this.graph = graph;
        int vertexCount = graph.getVertexCount();
        this.distances = new double[vertexCount];
        this.costs = new double[vertexCount];
        this.stopCounts = new int[vertexCount];
        this.previousStations = new int[vertexCount];
        this.visited = new boolean[vertexCount];
    }

   
    public RouteResult findRoute(String sourceStation, String destinationStation, RouteType routeType) {
        
        if (!graph.hasStation(sourceStation) || !graph.hasStation(destinationStation)) {
            return new RouteResult();  
        }

        int sourceIndex = graph.getStationIndex(sourceStation);
        int destIndex = graph.getStationIndex(destinationStation);
        int vertexCount = graph.getVertexCount();

        
        initializeArrays(vertexCount, sourceIndex);

        
        PriorityQueue<PathNode> minHeap = new PriorityQueue<>();
        minHeap.add(new PathNode(sourceIndex, 0, 0, 0, routeType));

        
        while (!minHeap.isEmpty()) {
            PathNode current = minHeap.poll();

            
            if (visited[current.stationIndex]) {
                continue;
            }

            visited[current.stationIndex] = true;

            
            if (current.stationIndex == destIndex) {
                break;
            }

           
            LinkedList<Edge> adjacencies = graph.getAdjacencies(current.stationIndex);
            if (adjacencies != null) {
                for (Edge edge : adjacencies) {
                    int nextStation = edge.getDestination();

                    if (!visited[nextStation]) {
                        
                        double newDistance = distances[current.stationIndex] + edge.getDistance();
                        double newCost = costs[current.stationIndex] + edge.getCost();
                        int newStops = stopCounts[current.stationIndex] + edge.getStops();

                        
                        boolean isBetter = false;
                        switch (routeType) {
                            case SHORTEST_DISTANCE:
                                isBetter = newDistance < distances[nextStation];
                                break;
                            case CHEAPEST_FARE:
                                isBetter = newCost < costs[nextStation];
                                break;
                            case LEAST_STOPS:
                                isBetter = newStops < stopCounts[nextStation];
                                break;
                        }

                        if (isBetter) {
                            distances[nextStation] = newDistance;
                            costs[nextStation] = newCost;
                            stopCounts[nextStation] = newStops;
                            previousStations[nextStation] = current.stationIndex;

                           
                            minHeap.add(new PathNode(nextStation, newDistance, newStops, newCost, routeType));
                        }
                    }
                }
            }
        }

        
        if (!visited[destIndex]) {
            return new RouteResult();  
        }

        
        return reconstructRoute(sourceIndex, destIndex, routeType);
    }

    
    private RouteResult reconstructRoute(int sourceIndex, int destIndex, RouteType routeType) {
        LinkedList<String> path = new LinkedList<>();
        int current = destIndex;

        
        while (current != sourceIndex) {
            path.addFirst(graph.getAllStations().get(current).getName());
            current = previousStations[current];
        }
        path.addFirst(graph.getAllStations().get(sourceIndex).getName());

       
        RouteResult result = new RouteResult(
                path,
                distances[destIndex],
                costs[destIndex],
                stopCounts[destIndex]
        );

        return result;
    }

   
    private void initializeArrays(int vertexCount, int sourceIndex) {
        for (int i = 0; i < vertexCount; i++) {
            distances[i] = Double.MAX_VALUE;
            costs[i] = Double.MAX_VALUE;
            stopCounts[i] = Integer.MAX_VALUE;
            previousStations[i] = -1;
            visited[i] = false;
        }

        
        distances[sourceIndex] = 0;
        costs[sourceIndex] = 0;
        stopCounts[sourceIndex] = 0;
    }

    
    public double[] getAllDistances(String sourceStation) {
        int sourceIndex = graph.getStationIndex(sourceStation);
        if (sourceIndex == -1) {
            return null;
        }

        findRoute(sourceStation, graph.getAllStations().get(0).getName(), RouteType.SHORTEST_DISTANCE);
        return distances.clone();
    }
}
