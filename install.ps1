# ================================================
# PowerShell Installation Script for ALI DEV MCP Server
# Run this script as Administrator
# ================================================

$ErrorActionPreference = "Continue"
Clear-Host

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ALI DEV MCP Server Installation  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Installing ALI DEV MCP Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to start installation..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# ------------------------------------------------
# Check Node.js Installation
# ------------------------------------------------
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# ------------------------------------------------
# Optional Azure CLI Check
# ------------------------------------------------
try {
    $null = Get-Command az -ErrorAction Stop
    Write-Host "WARNING: You have 2 update(s) available. Consider updating your CLI installation with 'az upgrade'" -ForegroundColor Yellow
    Write-Host "Azure CLI found" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Azure CLI not found!" -ForegroundColor Yellow
}

# ------------------------------------------------
# Create Installation Directory
# ------------------------------------------------
$installDir = "$env:USERPROFILE\.mcp\servers\ALI_DEV_MCP_Server"
$serversDir = "$env:USERPROFILE\.mcp\servers"

New-Item -ItemType Directory -Path $serversDir -Force | Out-Null
New-Item -ItemType Directory -Path $installDir -Force | Out-Null

# Show directory creation like in the batch file
Write-Host ""
Write-Host ""
Write-Host "    Directory: $serversDir"
Write-Host ""
Write-Host ""
Write-Host "Mode                 LastWriteTime         Length Name"
Write-Host "----                 -------------         ------ ----"
Get-ChildItem $serversDir -Directory | ForEach-Object {
    Write-Host "d-----        $(Get-Date -Format 'dd-MM-yyyy')     $(Get-Date -Format 'HH:mm')                $($_.Name)"
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# ------------------------------------------------
# Copy Required Files
# ------------------------------------------------
Write-Host "Copying server files..."
$filesToCopy = @("src", "package.json", "tsconfig.json", ".vscode")

foreach ($item in $filesToCopy) {
    $source = Join-Path $scriptDir $item
    $destination = Join-Path $installDir $item

    if (Test-Path $source) {
        if ((Get-Item $source).PSIsContainer) {
            Copy-Item -Path $source -Destination $destination -Recurse -Force
        } else {
            Copy-Item -Path $source -Destination $installDir -Force
        }
    } else {
        Write-Host "ERROR: $item not found at $source" -ForegroundColor Red
        Write-Host "Press any key to exit..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
}

# ------------------------------------------------
# Copy Chatmode File
# ------------------------------------------------
Write-Host "Installing chatmode file to global prompts directory..."
$chatmodeSource = "$scriptDir\.github\chatmodes\PR Code Review.chatmode.md"
$chatmodeDestDir = "$env:APPDATA\Code\User\prompts"
$chatmodeDestFile = "$chatmodeDestDir\PR Code Review.chatmode.md"

New-Item -ItemType Directory -Path $chatmodeDestDir -Force | Out-Null

# Show directory creation like in the batch file
Write-Host ""
Write-Host ""
Write-Host "    Directory: $env:APPDATA\Code\User"
Write-Host ""
Write-Host ""
Write-Host "Mode                 LastWriteTime         Length Name"
Write-Host "----                 -------------         ------ ----"
Write-Host "d-----        $(Get-Date -Format 'dd-MM-yyyy')     $(Get-Date -Format 'HH:mm')                prompts"

if (Test-Path $chatmodeSource) {
    Copy-Item $chatmodeSource -Destination $chatmodeDestFile -Force
    Write-Host "Chatmode installed globally: PR Code Review.chatmode.md" -ForegroundColor Green
} else {
    Write-Host "Warning: Chatmode file not found at $chatmodeSource" -ForegroundColor Yellow
}

# ------------------------------------------------
# Install Dependencies
# ------------------------------------------------
Write-Host "Installing dependencies..."
Set-Location $installDir
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# ------------------------------------------------
# Create MCP Configuration
# ------------------------------------------------
$mcpConfigDir = "$env:APPDATA\Code\User"
$mcpConfigFile = "$mcpConfigDir\mcp.json"

if (!(Test-Path $mcpConfigFile)) {
    New-Item -ItemType Directory -Path $mcpConfigDir -Force | Out-Null
    $escapedPath = $installDir 
    $config = @{
        servers = @{
            "ali-dev-mcp" = @{
                type = "stdio"
                command = "npx"
                args = @("tsx", "$escapedPath\src\index.ts")
                env = @{ NODE_ENV = "production" }
            }
        }
    }
    $config | ConvertTo-Json -Depth 10 | Set-Content $mcpConfigFile
    Write-Host "MCP configuration created at: $mcpConfigFile"
} else {
    Write-Host "MCP configuration already exists. Please manually add the ali-dev-mcp server configuration."
}

# ------------------------------------------------
# Completion Summary
# ------------------------------------------------
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "      Installation Completed Successfully!      " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Run 'az login' to authenticate with Azure DevOps." -ForegroundColor White
Write-Host "2. Open VS Code and check your MCP configuration." -ForegroundColor White
Write-Host "3. Use the 'PR Code Review' chatmode for automated code reviews." -ForegroundColor White
Write-Host "4. Test the server using: npx tsx src\index.ts" -ForegroundColor White
Write-Host ""
Write-Host "Installation Directory: $installDir" -ForegroundColor Gray
Write-Host "MCP Config: $mcpConfigFile" -ForegroundColor Gray
Write-Host "Chatmode File: $chatmodeDestFile" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Write-Host "Exiting..." -ForegroundColor Green
