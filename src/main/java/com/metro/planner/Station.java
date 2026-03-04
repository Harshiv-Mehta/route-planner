package com.metro.planner;


public class Station {
    private String name;           
    private int index;             
    private double latitude;       
    private double longitude;      

    
    public Station(String name, int index) {
        this.name = name;
        this.index = index;
        this.latitude = 0.0;
        this.longitude = 0.0;
    }

    
    public Station(String name, int index, double latitude, double longitude) {
        this.name = name;
        this.index = index;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    
    public String getName() {
        return name;
    }

    public int getIndex() {
        return index;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    @Override
    public String toString() {
        return name;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Station station = (Station) obj;
        return index == station.index;
    }

    @Override
    public int hashCode() {
        return index;
    }
}
