# Python Flask App Setup Script
Write-Host "Setting up Face Emotion Detection App..." -ForegroundColor Cyan

# Function to check if Python is installed
function Test-Python {
    try {
        $python = Get-Command python -ErrorAction Stop
        $version = & python --version 2>&1
        Write-Host "Python found: $version" -ForegroundColor Green
        return $true
    } catch {
        return $false
    }
}

# Check if Python is installed
if (-not (Test-Python)) {
    Write-Host "Python is not installed!" -ForegroundColor Yellow
    Write-Host "Please install Python 3.8 or higher from: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Make sure to check 'Add Python to PATH' during installation." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opening Python download page..." -ForegroundColor Cyan
    Start-Process "https://www.python.org/downloads/"
    
    Write-Host ""
    Write-Host "After installing Python, please:" -ForegroundColor Yellow
    Write-Host "1. Close and reopen this terminal" -ForegroundColor Yellow
    Write-Host "2. Run: python -m pip install -r requirements.txt" -ForegroundColor Yellow
    Write-Host "3. Run: python app.py" -ForegroundColor Yellow
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Cyan
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Starting the application..." -ForegroundColor Cyan
    Write-Host "The app will be available at: http://localhost:5000" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    python app.py
} else {
    Write-Host "Error installing dependencies. Please check the error above." -ForegroundColor Red
    exit 1
}

