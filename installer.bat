@echo off
echo ========================================
echo   azdev_prcodereview_mcp MCP Server Installation   
echo ========================================
echo.
echo This will install the azdev_prcodereview_mcp MCP Server
echo.
pause

REM Check if PowerShell is available
powershell -Command "Write-Host 'PowerShell is available'" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PowerShell not found!
    pause
    exit /b 1
)

REM Run the PowerShell script
echo Running installation script...
powershell -ExecutionPolicy Bypass -File "%~dp0install.ps1"

echo.
echo Installation script completed.
pause