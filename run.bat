@echo off
REM Run script for Metro Route Planner Application
REM Compiles and runs the application

echo ========================================
echo Metro Route Planner - Run Script
echo ========================================
echo.

REM Create bin directory if it doesn't exist
if not exist bin mkdir bin

echo Compiling Java source files...
cd src\main\java
javac -d ..\..\..\bin com\metro\planner\*.java

if %ERRORLEVEL% neq 0 (
    echo ERROR: Compilation failed!
    pause
    exit /b 1
)

cd ..\..\..\

echo.
echo Starting Metro Route Planner...
echo.

java -cp bin com.metro.planner.Main

pause
