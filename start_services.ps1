# NFT Project Startup Script
Write-Host "🚀 Starting NFT Project Services..." -ForegroundColor Green

# Function to check if a port is in use
function Test-Port {
    param($Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Check if ports are available
if (Test-Port 3000) {
    Write-Host "⚠️  Port 3000 is already in use. Frontend may already be running." -ForegroundColor Yellow
}

if (Test-Port 3002) {
    Write-Host "⚠️  Port 3002 is already in use. Backend may already be running." -ForegroundColor Yellow
}

# Start Backend
Write-Host "📡 Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend'; npm start" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'frontend'; npm start" -WindowStyle Normal

Write-Host "✅ Services started!" -ForegroundColor Green
Write-Host "🌐 Backend: http://localhost:3002" -ForegroundColor White
Write-Host "🎨 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "📱 AI NFT Agent will be available in the frontend" -ForegroundColor White

# Keep the script running
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 