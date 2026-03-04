package com.metro.planner;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;


public class MetroRouteGUI extends JFrame {
    private Graph metroGraph;
    private DijkstraAlgorithm dijkstra;

    
    private JComboBox<String> sourceCombo;
    private JComboBox<String> destinationCombo;
    private JComboBox<String> routeTypeCombo;
    private JButton findRouteButton;
    private JButton addStationButton;
    private JButton addRouteButton;
    private JTextArea resultArea;
    private JTextArea networkArea;
    private JTabbedPane tabbedPane;

    
    private JTextField newStationField;
    private JTextField sourceStationField;
    private JTextField destStationField;
    private JTextField distanceField;
    private JTextField costField;
    private JTextField stopsField;

    
    public MetroRouteGUI(Graph metroGraph) {
        this.metroGraph = metroGraph;
        this.dijkstra = new DijkstraAlgorithm(metroGraph);

       
        setTitle("Metro Route Planner");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(900, 700);
        setLocationRelativeTo(null);
        setResizable(true);

        
        tabbedPane = new JTabbedPane();
        add(tabbedPane);

        
        tabbedPane.addTab("Route Query", createRouteQueryPanel());
        tabbedPane.addTab("Network Management", createNetworkManagementPanel());
        tabbedPane.addTab("Network Visualization", createNetworkVisualizationPanel());

        setVisible(true);
    }

   
    private JPanel createRouteQueryPanel() {
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

       
        JPanel controlPanel = new JPanel(new GridLayout(5, 2, 10, 10));
        controlPanel.setBorder(BorderFactory.createTitledBorder("Route Query"));

       
        controlPanel.add(new JLabel("From Station:"));
        sourceCombo = new JComboBox<>();
        updateStationCombo(sourceCombo);
        controlPanel.add(sourceCombo);

        
        controlPanel.add(new JLabel("To Station:"));
        destinationCombo = new JComboBox<>();
        updateStationCombo(destinationCombo);
        controlPanel.add(destinationCombo);

        
        controlPanel.add(new JLabel("Optimize By:"));
        routeTypeCombo = new JComboBox<>(new String[]{
                "Shortest Distance",
                "Cheapest Fare",
                "Least Number of Stops"
        });
        controlPanel.add(routeTypeCombo);

        
        findRouteButton = new JButton("Find Route");
        findRouteButton.setFont(new Font("Arial", Font.BOLD, 14));
        findRouteButton.setBackground(new Color(0, 120, 215));
        findRouteButton.setForeground(Color.WHITE);
        findRouteButton.addActionListener(e -> findRoute());
        controlPanel.add(findRouteButton);

        
        JButton refreshButton = new JButton("Refresh Stations");
        refreshButton.addActionListener(e -> {
            updateStationCombo(sourceCombo);
            updateStationCombo(destinationCombo);
        });
        controlPanel.add(refreshButton);

        
        resultArea = new JTextArea();
        resultArea.setEditable(false);
        resultArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        resultArea.setLineWrap(true);
        resultArea.setWrapStyleWord(true);
        JScrollPane resultScroll = new JScrollPane(resultArea);
        resultScroll.setBorder(BorderFactory.createTitledBorder("Route Result"));

        mainPanel.add(controlPanel, BorderLayout.NORTH);
        mainPanel.add(resultScroll, BorderLayout.CENTER);

        return mainPanel;
    }

    
    private JPanel createNetworkManagementPanel() {
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        
        JPanel stationPanel = new JPanel(new GridLayout(3, 1, 5, 5));
        stationPanel.setBorder(BorderFactory.createTitledBorder("Add New Station"));

        JPanel stationInputPanel = new JPanel(new BorderLayout(5, 5));
        stationInputPanel.add(new JLabel("Station Name:"), BorderLayout.WEST);
        newStationField = new JTextField(15);
        stationInputPanel.add(newStationField, BorderLayout.CENTER);

        addStationButton = new JButton("Add Station");
        addStationButton.setBackground(new Color(34, 177, 76));
        addStationButton.setForeground(Color.WHITE);
        addStationButton.addActionListener(e -> addNewStation());
        stationInputPanel.add(addStationButton, BorderLayout.EAST);

        stationPanel.add(stationInputPanel);

        
        JPanel routePanel = new JPanel(new GridLayout(7, 2, 5, 5));
        routePanel.setBorder(BorderFactory.createTitledBorder("Add New Route"));

        routePanel.add(new JLabel("From Station:"));
        sourceStationField = new JTextField(15);
        routePanel.add(sourceStationField);

        routePanel.add(new JLabel("To Station:"));
        destStationField = new JTextField(15);
        routePanel.add(destStationField);

        routePanel.add(new JLabel("Distance (km):"));
        distanceField = new JTextField(15);
        routePanel.add(distanceField);

        routePanel.add(new JLabel("Cost ($):"));
        costField = new JTextField(15);
        routePanel.add(costField);

        routePanel.add(new JLabel("Number of Stops:"));
        stopsField = new JTextField(15);
        routePanel.add(stopsField);

        addRouteButton = new JButton("Add Route");
        addRouteButton.setBackground(new Color(34, 177, 76));
        addRouteButton.setForeground(Color.WHITE);
        addRouteButton.addActionListener(e -> addNewRoute());
        routePanel.add(addRouteButton);

        JPanel topPanel = new JPanel(new GridLayout(1, 2, 10, 10));
        topPanel.add(stationPanel);
        topPanel.add(routePanel);

        mainPanel.add(topPanel, BorderLayout.NORTH);

        return mainPanel;
    }

    
    private JPanel createNetworkVisualizationPanel() {
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        networkArea = new JTextArea();
        networkArea.setEditable(false);
        networkArea.setFont(new Font("Monospaced", Font.PLAIN, 11));
        networkArea.setLineWrap(true);
        networkArea.setWrapStyleWord(true);
        JScrollPane networkScroll = new JScrollPane(networkArea);
        networkScroll.setBorder(BorderFactory.createTitledBorder("Network Structure"));

        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 10));
        JButton refreshNetworkButton = new JButton("Refresh Network View");
        refreshNetworkButton.setBackground(new Color(0, 120, 215));
        refreshNetworkButton.setForeground(Color.WHITE);
        refreshNetworkButton.addActionListener(e -> refreshNetworkView());
        buttonPanel.add(refreshNetworkButton);

        mainPanel.add(networkScroll, BorderLayout.CENTER);
        mainPanel.add(buttonPanel, BorderLayout.SOUTH);

       
        refreshNetworkView();

        return mainPanel;
    }

   
    private void findRoute() {
        String source = (String) sourceCombo.getSelectedItem();
        String destination = (String) destinationCombo.getSelectedItem();

        if (source == null || destination == null || source.equals(destination)) {
            resultArea.setText("Error: Please select different source and destination stations.");
            return;
        }

        
        int routeTypeIndex = routeTypeCombo.getSelectedIndex();
        DijkstraAlgorithm.RouteType routeType;

        switch (routeTypeIndex) {
            case 0:
                routeType = DijkstraAlgorithm.RouteType.SHORTEST_DISTANCE;
                break;
            case 1:
                routeType = DijkstraAlgorithm.RouteType.CHEAPEST_FARE;
                break;
            case 2:
                routeType = DijkstraAlgorithm.RouteType.LEAST_STOPS;
                break;
            default:
                routeType = DijkstraAlgorithm.RouteType.SHORTEST_DISTANCE;
        }

        
        RouteResult result = dijkstra.findRoute(source, destination, routeType);

        
        if (result.isPathFound()) {
            resultArea.setText(result.toString());
        } else {
            resultArea.setText("No route found between " + source + " and " + destination);
        }
    }

    
    private void addNewStation() {
        String stationName = newStationField.getText().trim();

        if (stationName.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter a station name.", "Input Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        int result = metroGraph.addStation(stationName);

        if (result == -1) {
            JOptionPane.showMessageDialog(this, "Station already exists.", "Error", JOptionPane.ERROR_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(this, "Station '" + stationName + "' added successfully.", "Success", JOptionPane.INFORMATION_MESSAGE);
            newStationField.setText("");
            updateStationCombo(sourceCombo);
            updateStationCombo(destinationCombo);
            refreshNetworkView();
        }
    }

    
    private void addNewRoute() {
        try {
            String source = sourceStationField.getText().trim();
            String destination = destStationField.getText().trim();
            double distance = Double.parseDouble(distanceField.getText().trim());
            double cost = Double.parseDouble(costField.getText().trim());
            int stops = Integer.parseInt(stopsField.getText().trim());

            if (source.isEmpty() || destination.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Please enter station names.", "Input Error", JOptionPane.ERROR_MESSAGE);
                return;
            }

            if (distance < 0 || cost < 0 || stops < 0) {
                JOptionPane.showMessageDialog(this, "Distance, cost, and stops must be non-negative.", "Input Error", JOptionPane.ERROR_MESSAGE);
                return;
            }

            metroGraph.addRoute(source, destination, distance, cost, stops);

            JOptionPane.showMessageDialog(this, "Route added successfully.", "Success", JOptionPane.INFORMATION_MESSAGE);
            sourceStationField.setText("");
            destStationField.setText("");
            distanceField.setText("");
            costField.setText("");
            stopsField.setText("");
            refreshNetworkView();

        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Please enter valid numeric values.", "Input Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    
    private void updateStationCombo(JComboBox<String> comboBox) {
        comboBox.removeAllItems();
        for (Station station : metroGraph.getAllStations()) {
            comboBox.addItem(station.getName());
        }
    }

    
    private void refreshNetworkView() {
        networkArea.setText(metroGraph.getGraphStructure());
    }
}
