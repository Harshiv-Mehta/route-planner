package com.metro.planner;

import javax.swing.SwingUtilities;


public class Main {

    public static void main(String[] args) {
        
        Graph metroNetwork = new Graph(20);

        
        initializeMetroNetwork(metroNetwork);

        
        SwingUtilities.invokeLater(() -> {
            new MetroRouteGUI(metroNetwork);
        });
    }

    
    private static void initializeMetroNetwork(Graph graph) {
        
        graph.addStation("Central Station");
        graph.addStation("Downtown Hub");
        graph.addStation("Park Avenue");
        graph.addStation("Tech District");
        graph.addStation("University Station");
        graph.addStation("Airport Terminal");
        graph.addStation("Harbor Station");
        graph.addStation("City Museum");

        
        graph.addStation("Industrial Zone");
        graph.addStation("Shopping Mall");
        graph.addStation("Hospital Center");
        graph.addStation("Sports Stadium");

        
        graph.addRoute("Central Station", "Downtown Hub", 3.5, 2.50, 0);
        graph.addRoute("Downtown Hub", "Park Avenue", 2.8, 2.00, 1);
        graph.addRoute("Park Avenue", "Tech District", 4.2, 3.00, 2);

       
        graph.addRoute("Downtown Hub", "University Station", 5.1, 3.50, 2);
        graph.addRoute("University Station", "Airport Terminal", 8.5, 5.50, 3);

       
        graph.addRoute("Central Station", "Harbor Station", 4.3, 3.00, 1);
        graph.addRoute("Harbor Station", "City Museum", 3.2, 2.50, 1);

       
        graph.addRoute("Tech District", "Industrial Zone", 3.8, 2.75, 1);
        graph.addRoute("Industrial Zone", "Shopping Mall", 4.5, 3.00, 2);

       
        graph.addRoute("Park Avenue", "Hospital Center", 2.5, 1.75, 0);
        graph.addRoute("Hospital Center", "Sports Stadium", 3.8, 2.50, 1);

       
        graph.addRoute("Downtown Hub", "Hospital Center", 4.2, 2.75, 1);
        graph.addRoute("Shopping Mall", "University Station", 6.3, 4.00, 2);

        System.out.println("Metro network initialized successfully!");
        System.out.println("Total stations: " + graph.getVertexCount());
    }
}
