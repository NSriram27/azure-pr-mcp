# Installation Guide for ALI Dev MCP Server

This guide provides detailed installation instructions for setting up the ALI Dev MCP Server with all necessary dependencies and configurations.

## 📁 Installation Files

- **`installer.bat`** - Windows Batch installation script (entry point)
- **`install.ps1`** - PowerShell installation script (main installer)

## 🚀 Quick Installation

### Automated Installation (Recommended)

1. **Double-click `installer.bat`** in the project root
   
   OR
   
2. **Open Command Prompt** and run:
   ```cmd
   installer.bat
   ```

The batch installer will automatically run the PowerShell script with the proper execution policy.

## ⚙️ What the Installation Script Does

### Automated Setup Process:

1. **Verifies Prerequisites**
   - Checks for Node.js installation
   - Verifies PowerShell availability
   - Validates system requirements

2. **Creates Installation Directory**
   - Sets up `%USERPROFILE%\.mcp\servers\ALI_DEV_MCP_Server`
   - Copies project files (`src/`, `package.json`, `tsconfig.json`)

3. **Installs Dependencies**
   - Runs `npm install` in the installation directory
   - Installs all required packages from `package.json`

4. **Configures VS Code**
   - Copies `.vscode/mcp.json` to `%APPDATA%\Code\User\mcp.json`
   - Updates hardcoded paths to point to the installation directory
   - **Note:** If `mcp.json` already exists, you'll need to manually merge the configuration

5. **Installs Chatmode**
   - Copies PR Code Review chatmode to `%APPDATA%\Code\User\prompts\`
   - Enables automated PR reviews in GitHub Copilot Chat

6. **Verifies Installation**
   - Confirms all files are copied successfully
   - Displays installation summary and next steps

## 📍 Configuration Files Created/Modified

| File | Location | Purpose |
|------|----------|---------|
| `mcp.json` | `%APPDATA%\Code\User\mcp.json` | VS Code MCP server configuration |
| `PR Code Review.chatmode.md` | `%APPDATA%\Code\User\prompts\` | GitHub Copilot chatmode for PR reviews |
| ALI_DEV_MCP_Server/ | `%USERPROFILE%\.mcp\servers\` | Installed server files |

## 📋 Prerequisites

Before running the installer, ensure you have:

- **Node.js** version 18.0.0 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version` and `npm --version`

- **PowerShell** (included with Windows)

- **Azure CLI** (recommended for Azure DevOps authentication)
  - Download from [Microsoft Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows)
  - Verify: `az --version`

## 🔧 Manual Installation Steps

If you prefer manual installation or the automated installer fails, follow these steps:

<details>
<summary>Click to expand manual installation steps</summary>

1. **Install Node.js 18.0.0+** from [nodejs.org](https://nodejs.org/)

2. **Create installation directory:**
   ```powershell
   mkdir "$env:USERPROFILE\.mcp\servers\ALI_DEV_MCP_Server"
   ```

3. **Copy project files:**
   ```powershell
   # Copy source files
   xcopy /E /I src "$env:USERPROFILE\.mcp\servers\ALI_DEV_MCP_Server\src"
   
   # Copy configuration files
   copy package.json "$env:USERPROFILE\.mcp\servers\ALI_DEV_MCP_Server\"
   copy tsconfig.json "$env:USERPROFILE\.mcp\servers\ALI_DEV_MCP_Server\"
   ```

4. **Install dependencies:**
   ```powershell
   cd "$env:USERPROFILE\.mcp\servers\ALI_DEV_MCP_Server"
   npm install
   ```

5. **Create VS Code MCP configuration:**
   - Create file: `%APPDATA%\Code\User\mcp.json`
   - Add content (or merge with existing configuration):
     ```json
     {
       "servers": {
         "ado": {
           "type": "stdio",
           "command": "npx",
           "args": ["-y", "@azure-devops/mcp", "${input:ado_org}"]
         },
         "ali-dev-mcp": {
           "type": "stdio",
           "command": "npx",
           "args": ["tsx", "%USERPROFILE%\\.mcp\\servers\\ALI_DEV_MCP_Server\\src\\index.ts"],
           "env": { "NODE_ENV": "production" }
         }
       },
       "inputs": [
         {
           "id": "ado_org",
           "type": "promptString",
           "description": "Azure DevOps organization name (e.g. 'contoso')"
         }
       ]
     }
     ```

6. **Install chatmode (optional but recommended):**
   ```powershell
   # Create prompts directory if it doesn't exist
   mkdir "$env:APPDATA\Code\User\prompts" -ErrorAction SilentlyContinue
   
   # Copy chatmode file
   copy ".github\chatmodes\PR Code Review.chatmode.md" "$env:APPDATA\Code\User\prompts\"
   ```

7. **Authenticate with Azure DevOps:**
   ```powershell
   az login
   ```

8. **Restart VS Code** to load the new configuration

</details>

## 🔄 Handling Existing MCP Configuration

If you already have an `mcp.json` file at `%APPDATA%\Code\User\mcp.json`:

1. **Open your existing `mcp.json` file**

2. **Add the ALI Dev MCP server** to your existing `servers` section:
   ```json
   "ali-dev-mcp": {
     "type": "stdio",
     "command": "npx",
     "args": ["tsx", "%USERPROFILE%\\.mcp\\servers\\ALI_DEV_MCP_Server\\src\\index.ts"],
     "env": { "NODE_ENV": "production" }
   }
   ```

3. **Optionally add the ADO server** (official Microsoft Azure DevOps MCP server):
   ```json
   "ado": {
     "type": "stdio",
     "command": "npx",
     "args": ["-y", "@azure-devops/mcp", "${input:ado_org}"]
   }
   ```

4. **Add the input** to your existing `inputs` array (if not already present):
   ```json
   {
     "id": "ado_org",
     "type": "promptString",
     "description": "Azure DevOps organization name (e.g. 'contoso')"
   }
   ```

5. **Save the file and restart VS Code**

## ⚠️ Troubleshooting

### Installation Issues

1. **"Node.js not found"**
   - Install Node.js 18.0.0+ from [nodejs.org](https://nodejs.org/)
   - Restart terminal/command prompt after installation
   - Verify: `node --version`

2. **"PowerShell execution error"**
   - The batch installer runs PowerShell with `-ExecutionPolicy Bypass`
   - If issues persist, run as Administrator
   - Or run PowerShell script directly:
     ```powershell
     Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
     .\install.ps1
     ```

3. **"Failed to install dependencies"**
   - Check internet connection
   - Verify npm is working: `npm --version`
   - Try manual installation:
     ```powershell
     cd %USERPROFILE%\.mcp\servers\ALI_DEV_MCP_Server
     npm install
     ```

4. **"Directory already exists"**
   - The installer will overwrite existing files
   - For a clean install, delete the directory first:
     ```powershell
     rmdir /s /q "%USERPROFILE%\.mcp\servers\ALI_DEV_MCP_Server"
     ```

### VS Code Integration Issues

5. **"VS Code doesn't recognize MCP server"**
   - Verify `mcp.json` exists at `%APPDATA%\Code\User\mcp.json`
   - Check the file content matches expected configuration
   - Restart VS Code completely (close all windows)
   - Check VS Code Output panel for MCP-related errors

6. **"GitHub Copilot Chat doesn't show chatmode"**
   - Verify chatmode file exists at `%APPDATA%\Code\User\prompts\PR Code Review.chatmode.md`
   - Restart VS Code
   - Ensure GitHub Copilot extension is installed and enabled

### Azure DevOps Authentication Issues

7. **"Authentication failed"**
   - Run `az login` to authenticate with Azure DevOps
   - Ensure access to the target Azure DevOps organization
   - Verify Azure DevOps permissions for the project/repository
   - Check that `@azure/identity` can access Azure credentials

8. **"Cannot access pull request"**
   - Verify project, repository, and PR ID are correct
   - Ensure you have read permissions for the repository
   - Check that the PR exists and is not deleted

### Testing the Installation

To verify the server is working:

```powershell
cd %USERPROFILE%\.mcp\servers\ALI_DEV_MCP_Server
npx tsx src\index.ts
```

The server should start without errors. Press `Ctrl+C` to stop it.

## 🎯 Post-Installation Steps

After the installation completes successfully:

1. **Authenticate with Azure DevOps:**
   ```powershell
   az login
   ```

2. **Restart VS Code** to load the new MCP configuration

3. **Verify the installation** (optional):
   ```powershell
   cd %USERPROFILE%\.mcp\servers\ALI_DEV_MCP_Server
   npx tsx src\index.ts
   ```
   The server should start without errors. Press `Ctrl+C` to stop it.

4. **Test GitHub Copilot integration:**
   - Open VS Code
   - Open GitHub Copilot Chat
   - Try a command like:
     ```
     @copilot Use get_pr_file_changes tool for PR 12345 in project MyProject, repository MyRepo
     ```

5. **Use the PR Code Review chatmode** in GitHub Copilot Chat for automated PR reviews

## 🛠️ Available Tools After Installation

Once installed, you'll have access to:

### PR Files MCP Tools:
- `get_pr_latest_iteration` - Get latest iteration ID for a PR
- `get_pr_iteration_changes` - Get file changes for a specific iteration
- `get_pr_file_changes` - Get file changes from the latest iteration

### PR Comments MCP Tools:
- `add_pr_inline_comment` - Add inline review comments to PR files

### Prompts:
- `analyze-pr-changes` - Analyze PR file changes
- `review-pr-files` - Review specific files in a PR
- `add-review-comment` - Add a single review comment
- `review-pr-with-comments` - Comprehensive PR review with comments

## 📚 Additional Resources

- **User Guide:** [README.md](./README.md) - Usage examples and configuration
- **Development Guide:** [README-DEV.md](./README-DEV.md) - For contributors and developers
- **Model Context Protocol:** [MCP Documentation](https://modelcontextprotocol.io/)
- **Azure DevOps API:** [REST API Reference](https://docs.microsoft.com/en-us/rest/api/azure/devops/)
- **Azure DevOps MCP Server:** [Official Microsoft Server](https://github.com/microsoft/azure-devops-mcp)

## 🤝 Getting Help

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review the main [README.md](./README.md) for usage information
3. See [README-DEV.md](./README-DEV.md) for development documentation
4. Verify all prerequisites are met before installation

---

© 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
