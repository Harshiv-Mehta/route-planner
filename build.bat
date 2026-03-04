@echo off
REM Build script for Metro Route Planner Application
REM Compiles all Java source files and creates executable JAR

echo ========================================
echo Metro Route Planner - Build Script
echo ========================================

REM Create output directories
if not exist bin mkdir bin
if not exist dist mkdir dist

echo.
echo Step 1: Compiling Java source files...
echo.

cd src\main\java
javac -d ..\..\..\bin com\metro\planner\*.java

if %ERRORLEVEL% neq 0 (
    echo ERROR: Compilation failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Creating JAR file...
echo.

cd ..\..\..\

REM Create manifest file
(
    echo Main-Class: com.metro.planner.Main
    echo.
) > bin\MANIFEST.MF

REM Create JAR file
jar cvfm dist\MetroRoutePlanner.jar bin\MANIFEST.MF -C bin com

if %ERRORLEVEL% neq 0 (
    echo ERROR: JAR creation failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo To run the application:
echo   1. Command line: java -jar dist\MetroRoutePlanner.jar
echo   2. Or: java -cp bin com.metro.planner.Main
echo.
pause
