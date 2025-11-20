@echo off
echo Setting up Face Emotion Detection App...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed!
    echo Please install Python 3.8 or higher from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    start https://www.python.org/downloads/
    pause
    exit /b 1
)

echo Python found!
echo.

REM Install dependencies
echo Installing dependencies...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

if errorlevel 1 (
    echo Error installing dependencies.
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo Starting the application...
echo The app will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

python app.py

