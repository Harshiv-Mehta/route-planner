package com.metro.planner;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;


public class Graph {
    private List<Station> stations;                    
    private HashMap<String, Integer> stationMap;       
    private LinkedList<Edge>[] adjacencyList;          
    private int vertexCount;                           

    
    @SuppressWarnings("unchecked")
    public Graph(int capacity) {
        this.vertexCount = 0;
        this.stations = new LinkedList<>();
        this.stationMap = new HashMap<>();
        this.adjacencyList = new LinkedList[capacity];
        
       
        for (int i = 0; i < capacity; i++) {
            adjacencyList[i] = new LinkedList<>();
        }
    }

   
    public int addStation(String stationName) {
        
        if (stationMap.containsKey(stationName)) {
            return -1;  
        }

        int stationIndex = vertexCount++;
        Station station = new Station(stationName, stationIndex);
        stations.add(station);
        stationMap.put(stationName, stationIndex);  

        return stationIndex;
    }

   
    public void addRoute(String source, String destination, double distance, double cost, int stops) {
        Integer sourceIndex = stationMap.get(source);
        Integer destIndex = stationMap.get(destination);

        if (sourceIndex == null || destIndex == null) {
            throw new IllegalArgumentException("Station not found in network");
        }

        
        Edge edge1 = new Edge(destIndex, distance, cost, stops);
        adjacencyList[sourceIndex].add(edge1);

        
        Edge edge2 = new Edge(sourceIndex, distance, cost, stops);
        adjacencyList[destIndex].add(edge2);
    }

   
    public Station getStation(String stationName) {
        Integer index = stationMap.get(stationName);
        if (index != null) {
            return stations.get(index);
        }
        return null;
    }

    
    public int getStationIndex(String stationName) {
        Integer index = stationMap.get(stationName);
        return index != null ? index : -1;
    }

   
    public LinkedList<Edge> getAdjacencies(int stationIndex) {
        if (stationIndex >= 0 && stationIndex < vertexCount) {
            return adjacencyList[stationIndex];
        }
        return null;
    }

    
    public List<Station> getAllStations() {
        return stations;
    }

    
    public int getVertexCount() {
        return vertexCount;
    }

   
    public boolean hasStation(String stationName) {
        return stationMap.containsKey(stationName);
    }

    public String getGraphStructure() {
        StringBuilder sb = new StringBuilder();
        sb.append("Metro Network Graph Structure:\n");
        sb.append("==============================\n");

        for (int i = 0; i < vertexCount; i++) {
            sb.append("Station: ").append(stations.get(i).getName()).append("\n");
            LinkedList<Edge> edges = adjacencyList[i];
            if (edges.isEmpty()) {
                sb.append("  No routes\n");
            } else {
                for (Edge edge : edges) {
                    sb.append("  -> ").append(stations.get(edge.getDestination()).getName())
                            .append(" (Distance: ").append(String.format("%.2f", edge.getDistance()))
                            .append(" km, Cost: $").append(String.format("%.2f", edge.getCost()))
                            .append(")\n");
                }
            }
            sb.append("\n");
        }

        return sb.toString();
    }
}
