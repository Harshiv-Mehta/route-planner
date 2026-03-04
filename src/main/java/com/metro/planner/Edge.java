package com.metro.planner;


public class Edge {
    private int destination;       
    private double distance;       
    private double cost;           
    private int stops;             

   
    public Edge(int destination, double distance, double cost, int stops) {
        this.destination = destination;
        this.distance = distance;
        this.cost = cost;
        this.stops = stops;
    }

    
    public int getDestination() {
        return destination;
    }

    public double getDistance() {
        return distance;
    }

    public double getCost() {
        return cost;
    }

    public int getStops() {
        return stops;
    }

    @Override
    public String toString() {
        return String.format("To Station[%d]: Distance=%.2f km, Cost=$%.2f, Stops=%d",
                destination, distance, cost, stops);
    }
}
