package com.metro.planner;

import java.util.LinkedList;
import java.util.List;


public class RouteResult {
    private List<String> path;          
    private double totalDistance;       
    private double totalCost;           
    private int totalStops;             
    private boolean pathFound;         

   
    public RouteResult() {
        this.path = new LinkedList<>();
        this.totalDistance = 0.0;
        this.totalCost = 0.0;
        this.totalStops = 0;
        this.pathFound = false;
    }

    
    public RouteResult(List<String> path, double totalDistance, double totalCost, int totalStops) {
        this.path = new LinkedList<>(path);
        this.totalDistance = totalDistance;
        this.totalCost = totalCost;
        this.totalStops = totalStops;
        this.pathFound = !path.isEmpty();
    }

    
    public List<String> getPath() {
        return path;
    }

    public double getTotalDistance() {
        return totalDistance;
    }

    public double getTotalCost() {
        return totalCost;
    }

    public int getTotalStops() {
        return totalStops;
    }

    public boolean isPathFound() {
        return pathFound;
    }

   
    public void addStationToPath(String stationName) {
        path.add(stationName);
    }

    @Override
    public String toString() {
        if (!pathFound) {
            return "No route found between the specified stations.";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("Route Found!\n");
        sb.append("Path: ");
        for (int i = 0; i < path.size(); i++) {
            sb.append(path.get(i));
            if (i < path.size() - 1) {
                sb.append(" -> ");
            }
        }
        sb.append("\n");
        sb.append(String.format("Total Distance: %.2f km\n", totalDistance));
        sb.append(String.format("Total Cost: $%.2f\n", totalCost));
        sb.append(String.format("Number of Stops: %d\n", totalStops));

        return sb.toString();
    }
}
