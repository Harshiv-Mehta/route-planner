#!/bin/bash

# Run script for Metro Route Planner Application
# Compiles and runs the application

echo "========================================"
echo "Metro Route Planner - Run Script"
echo "========================================"
echo ""

# Create bin directory if it doesn't exist
mkdir -p bin

echo "Compiling Java source files..."
cd src/main/java
javac -d ../../../bin com/metro/planner/*.java

if [ $? -ne 0 ]; then
    echo "ERROR: Compilation failed!"
    exit 1
fi

cd ../../../

echo ""
echo "Starting Metro Route Planner..."
echo ""

java -cp bin com.metro.planner.Main
