# Metro Route Planner Application

A comprehensive Java application for finding optimal routes in a metro/railway network. The application uses advanced data structures and algorithms to provide multiple route optimization options.

## Features

- **Shortest Distance Route**: Find the route with minimum total distance
- **Cheapest Fare Path**: Find the most economical route
- **Least Number of Stops**: Find the route with fewest stops
- **Network Management**: Add new stations and routes dynamically
- **Network Visualization**: View the complete metro network structure
- **User-Friendly Swing GUI**: Intuitive interface for route queries

## Architecture & Data Structures

### Core Components

1. **Graph Class** - Metro network representation
   - Uses **Hash Table (HashMap)** for O(1) station name-to-index lookup
   - Uses **Adjacency List (LinkedList)** for efficient route storage
   - Total complexity: O(1) average case for lookups, O(E) for getting adjacencies

2. **DijkstraAlgorithm Class** - Path finding algorithm
   - Uses **Min-Heap (Priority Queue)** for node selection
   - Time Complexity: O((V + E) log V) where V = stations, E = routes
   - Space Complexity: O(V)
   - Supports three optimization criteria

3. **Station Class** - Represents individual metro stations
   - Stores station metadata (name, geographic coordinates)

4. **Edge Class** - Represents routes between stations
   - Stores route parameters (distance, cost, number of stops)

5. **RouteResult Class** - Encapsulates route query results

## Algorithm Details

### Dijkstra's Algorithm Implementation

The application uses Dijkstra's algorithm optimized for different metrics:

```
Algorithm: Dijkstra's Shortest Path
Input: Graph G, Source station S, Destination D, Optimization Type T
Output: Shortest path from S to D

1. Initialize distances, costs, stops to infinity for all vertices
2. Set source metrics to 0
3. Create Min-Heap with source station (priority based on T)
4. While Min-Heap not empty:
   a. Extract vertex U with minimum metric
   b. If U is destination, terminate early
   c. For each neighbor V of U:
      - Calculate new metrics via edge E(U, V)
      - If new metric is better than current best for V:
        * Update metrics for V
        * Add V to Min-Heap with new priority
5. Reconstruct path from previousStations array
```

## Time & Space Complexities

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Adding Station | O(1) average | O(1) |
| Adding Route | O(1) average | O(1) |
| Finding Route | O((V + E) log V) | O(V) |
| Station Lookup | O(1) average | - |
| Network Traversal | O(V + E) | O(1) |

## Project Structure

```
src/
├── main/
│   └── java/
│       └── com/metro/planner/
│           ├── Main.java                  # Application entry point
│           ├── Station.java               # Station data model
│           ├── Edge.java                  # Route/Edge data structure
│           ├── Graph.java                 # Graph implementation
│           ├── DijkstraAlgorithm.java    # Path finding algorithm
│           ├── RouteResult.java           # Result model
│           └── MetroRouteGUI.java         # Swing GUI
└── test/
    └── (Test files go here)
```

## Requirements

- Java 8 or higher
- No external dependencies (uses only Java standard library)

## Compilation

### Using Command Line

```bash
# Navigate to project directory
cd "c:\Users\Admin\Desktop\ds-2 metro"

# Compile all Java files
javac -d bin src/main/java/com/metro/planner/*.java

# Run the application
java -cp bin com.metro.planner.Main
```

### Using IDE (IntelliJ IDEA, Eclipse, VSCode)

1. Import the project as a Java project
2. Mark `src/main/java` as source root
3. Right-click on `Main.java`
4. Select "Run Main.main()"

## Usage Guide

### Running the Application

1. Execute the Main class (see Compilation section)
2. The Swing GUI window will open with three tabs:
   - **Route Query**: Find routes between stations
   - **Network Management**: Add new stations and routes
   - **Network Visualization**: View network structure

### Finding a Route

1. Go to the "Route Query" tab
2. Select source station from "From Station" dropdown
3. Select destination station from "To Station" dropdown
4. Choose optimization criteria from "Optimize By" dropdown
5. Click "Find Route" button
6. View the result in the result area showing:
   - Complete path with all stops
   - Total distance in kilometers
   - Total cost in currency units
   - Number of stops

### Adding a New Station

1. Go to the "Network Management" tab
2. Enter the station name in the "Station Name" field
3. Click "Add Station" button
4. Station appears immediately in all dropdowns

### Adding a New Route

1. Go to the "Network Management" tab
2. Enter source and destination station names
3. Enter distance (in km), cost (in currency units), and number of stops
4. Click "Add Route" button
5. Route is added to both directions (bidirectional network)

### Viewing Network Structure

1. Go to the "Network Visualization" tab
2. Click "Refresh Network View" to update
3. View all stations and their connections

## Sample Metro Network

The application comes pre-loaded with a sample network containing:

- **Main Line (RED)**: Central → Downtown → Park → Tech
- **Secondary Line (BLUE)**: Downtown → University → Airport
- **Green Line**: Central → Harbor → Museum
- **Yellow Line**: Tech → Industrial → Shopping
- **Purple Line**: Park → Hospital → Sports
- **Cross-connections**: For realistic network topology

## Algorithm Optimization Examples

### Shortest Distance Example
- From: Downtown Hub
- To: Airport Terminal
- Route Type: Shortest Distance
- Result: Optimal route based on total kilometers

### Cheapest Fare Example
- From: Downtown Hub
- To: Airport Terminal
- Route Type: Cheapest Fare
- Result: Most economical route (may have more stops)

### Least Stops Example
- From: Downtown Hub
- To: Airport Terminal
- Route Type: Least Stops
- Result: Route with minimum number of intermediate stops

## Design Patterns

- **Observer Pattern**: GUI components reactive to data changes
- **Strategy Pattern**: Different route optimization strategies in Dijkstra
- **Model-View Separation**: Separation between graph logic and GUI
- **Singleton-like Pattern**: Single graph instance throughout application

## Performance Considerations

1. **Efficient Station Lookup**: O(1) average lookup using HashMap
2. **Lazy Route Computation**: Routes computed only when queried
3. **Heap-Based Algorithm**: Min-Heap ensures we always process most promising nodes first
4. **Early Termination**: Algorithm stops when destination is reached

## Extensibility

The application is designed for easy extension:

1. **Adding New Metrics**: Extend RouteType enum and modify comparator in Dijkstra
2. **Data Persistence**: Save/load graph from files or database
3. **Advanced Visualization**: Use graphics libraries for map visualization
4. **Real-time Updates**: Support dynamic network changes
5. **Mobile Support**: Adapt GUI for mobile interfaces

## Future Enhancements

- Integration with real metro/railway databases
- Real-time traffic and delay updates
- Mobile application version
- Advanced visualization with actual map display
- Machine learning for predictive routing
- Multi-criteria optimization
- Route history and user preferences
- Integration with ticketing systems

## Author Notes

This application demonstrates:
- Proper use of data structures (Hash Tables, Linked Lists, Priority Queues)
- Implementation of well-known algorithms (Dijkstra's)
- Clean code principles and OOP design
- Comprehensive GUI development with Swing
- Performance optimization techniques

## License

Open source - free to use and modify.

## Contact & Support

For questions or issues, review the code comments or check the algorithm documentation.
