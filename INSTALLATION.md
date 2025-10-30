# Installation Scripts for S3D Dev MCP Server

This folder contains automated installation scripts to set up the S3D Dev MCP Server with all necessary dependencies and configurations.

## 📁 Installation Files

- **`install.bat`** - Windows Batch installation script
- **`install.ps1`** - PowerShell installation script (recommended)
- **`uninstall.bat`** - Removal script for clean uninstallation

## 🚀 Quick Installation

### Option 1: PowerShell Script (Recommended)

1. **Right-click on `install.ps1`** and select **"Run with PowerShell"**
   
   OR
   
2. **Open PowerShell as Administrator** and run:
   ```powershell
   cd "C:\path\to\your\project"
   .\install.ps1
   ```

### Option 2: Batch Script

1. **Double-click `install.bat`**
   
   OR
   
2. **Open Command Prompt as Administrator** and run:
   ```cmd
   cd "C:\path\to\your\project"
   install.bat
   ```

## ⚙️ What the Installation Scripts Do

### Automated Setup Process:

1. **✅ System Requirements Check**
   - Verifies Node.js 18.0.0+ installation
   - Checks npm availability
   - Validates Azure CLI (optional)

2. **🔧 Registry Configuration**
   - Configures npm registry for Azure DevOps packages
   - Sets up authentication for private package feed
   - Creates/updates `.npmrc` file

3. **📦 Authentication Setup**
   - Installs `vsts-npm-auth` globally
   - Configures Azure DevOps authentication
   - Handles authentication prompts

4. **🔨 Project Build**
   - Installs all npm dependencies
   - Compiles TypeScript to JavaScript
   - Creates distribution files in `dist/` folder

5. **🧪 Testing & Verification**
   - Runs MCP server tests
   - Verifies package can be executed globally
   - Validates installation success

6. **⚡ VS Code Integration**
   - Creates VS Code MCP configuration file
   - Sets up GitHub Copilot integration
   - Configures the proper MCP server connection

## 📍 Configuration Files Created

| File | Location | Purpose |
|------|----------|---------|
| `.npmrc` | `%USERPROFILE%\.npmrc` | npm registry configuration for Azure DevOps |
| `mcp.json` | `%APPDATA%\Code\User\mcp.json` | VS Code MCP server configuration |

## 🔄 PowerShell Script Parameters

The PowerShell script supports optional parameters:

```powershell
# Skip Azure CLI check
.\install.ps1 -SkipAzureCLI

# Skip Snyk setup
.\install.ps1 -SkipSnyk

# Quiet mode (minimal prompts)
.\install.ps1 -Quiet

# Combine parameters
.\install.ps1 -SkipAzureCLI -Quiet
```

## 🗑️ Uninstallation

To remove the S3D Dev MCP Server:

1. **Double-click `uninstall.bat`**
2. Follow the prompts to:
   - Remove VS Code MCP configuration
   - Restore original `.npmrc` file
   - Clean npm cache and global packages
   - Remove local project files (optional)

## 🔧 Manual Installation Steps

If you prefer manual installation, follow these steps:

<details>
<summary>Click to expand manual installation steps</summary>

1. **Install Node.js 18.0.0+** from [nodejs.org](https://nodejs.org/)

2. **Configure npm registry:**
   ```powershell
   echo "registry=https://pkgs.dev.azure.com/hexagonPPMInnerSource/_packaging/PPM/npm/registry/" > "$env:USERPROFILE\.npmrc"
   echo "always-auth=true" >> "$env:USERPROFILE\.npmrc"
   ```

3. **Install authentication tool:**
   ```powershell
   npm install -g vsts-npm-auth
   vsts-npm-auth -config "$env:USERPROFILE\.npmrc"
   ```

4. **Install and build project:**
   ```powershell
   npm install
   npm run build
   ```

5. **Create VS Code MCP configuration:**
   - Create file: `%APPDATA%\Code\User\mcp.json`
   - Add content:
     ```json
     {
       "servers": {
         "s3d-dev-mcp": {
           "type": "stdio",
           "command": "npx",
           "args": ["-y", "@ppm/ali-dev-mcp"]
         }
       }
     }
     ```

</details>

## ⚠️ Troubleshooting

### Common Issues:

1. **"Node.js not found"**
   - Install Node.js 18.0.0+ from [nodejs.org](https://nodejs.org/)
   - Restart command prompt/PowerShell after installation

2. **"Permission denied"**
   - Run script as Administrator
   - Check Windows execution policy for PowerShell scripts

3. **"Authentication failed"**
   - Ensure you have access to Azure DevOps organization
   - Run `az login` to authenticate with Azure
   - Check your Azure DevOps permissions

4. **"Build failed"**
   - Check internet connection
   - Verify Azure DevOps package feed access
   - Run `npm install` manually to see detailed errors

5. **"VS Code doesn't recognize MCP server"**
   - Restart VS Code completely
   - Check `mcp.json` file location: `%APPDATA%\Code\User\mcp.json`
   - Verify GitHub Copilot is enabled in VS Code

### Getting Help:

- Check the main **README.md** for detailed usage information
- Review **README-DEV.md** for development and troubleshooting
- Verify all prerequisites are met before installation

## 🎯 Next Steps After Installation

1. **Restart VS Code** to load the new MCP configuration
2. **Test the integration:**
   ```
   @copilot Use get_pr_file_changes tool for PR 12345 in project myproject, repository myrepo
   ```
3. **Authenticate with services:**
   - Azure: `az login`
   - Snyk (optional): `snyk auth`

## 📚 Additional Resources

- [VS Code GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Azure DevOps API Documentation](https://docs.microsoft.com/en-us/rest/api/azure/devops/)

---

© 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.