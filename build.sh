#!/bin/bash

# Build script for Metro Route Planner Application
# Compiles all Java source files and creates executable JAR

echo "========================================"
echo "Metro Route Planner - Build Script"
echo "========================================"

# Create output directories
mkdir -p bin
mkdir -p dist

echo ""
echo "Step 1: Compiling Java source files..."
echo ""

cd src/main/java
javac -d ../../../bin com/metro/planner/*.java

if [ $? -ne 0 ]; then
    echo "ERROR: Compilation failed!"
    exit 1
fi

echo ""
echo "Step 2: Creating JAR file..."
echo ""

cd ../../../

# Create manifest file
echo "Main-Class: com.metro.planner.Main" > bin/MANIFEST.MF
echo "" >> bin/MANIFEST.MF

# Create JAR file
jar cvfm dist/MetroRoutePlanner.jar bin/MANIFEST.MF -C bin com

if [ $? -ne 0 ]; then
    echo "ERROR: JAR creation failed!"
    exit 1
fi

echo ""
echo "========================================"
echo "Build completed successfully!"
echo "========================================"
echo ""
echo "To run the application:"
echo "  1. Command line: java -jar dist/MetroRoutePlanner.jar"
echo "  2. Or: java -cp bin com.metro.planner.Main"
echo ""
