<!-- © 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved. -->

# ALI Dev MCP Server

Easily install the ALI Dev MCP Server for VS Code:

[![Install with NPX in VS Code](https://img.shields.io/badge/VS_Code-Install_ALI DEV_MCP_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=azure-pr-mcp&config=%7B%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22azure-pr-mcp%22%5D%7D)

This TypeScript project provides a local MCP server for Azure DevOps, enabling you to perform Azure DevOps pull request analysis and code review tasks directly from your code editor.

## 📋 Overview

The ALI Dev MCP Server is a Model Context Protocol (MCP) server that provides Azure DevOps pull request utilities for AI-powered code reviews. It integrates with GitHub Copilot to enable automated PR analysis and inline code review comments directly in Azure DevOps.

**Key Capabilities:**

- **PR File Analysis** - Inspect and analyze file changes in Azure DevOps pull requests
- **Inline PR Comments** - Post automated review comments directly to PR files
- **AI-Powered Reviews** - Leverage GitHub Copilot for intelligent code analysis
- **Iteration Tracking** - Track and review changes across PR iterations

## ⚡ Prerequisites

Before using the ALI Dev MCP Server, ensure you have:

- **Node.js** version 18.0.0 or higher installed
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation:
    ```powershell
    node --version
    npm --version
    ```

- **Azure CLI** installed and configured (recommended for Azure DevOps authentication):
  - Download from [Microsoft Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows)
  - For Windows: Download and run the MSI installer
  - Verify installation:
    ```powershell
    az --version
    ```
  - Login to Azure:
    ```powershell
    az login
    ```

- **PowerShell** (for running the installation script on Windows)

## 🚀 Installation

For detailed installation instructions, see [INSTALLATION.md](./INSTALLATION.md).

### Quick Install

1. **Download or clone this repository:**
   ```powershell
   git clone https://github.com/NSriram27/azure-pr-mcp.git
   cd Ali_Dev_Mcp_Server
   ```

2. **Run the installer:**
   ```cmd
   installer.bat
   ```

3. **Authenticate with Azure DevOps:**
   ```powershell
   az login
   ```

4. **Restart VS Code** to load the new MCP configuration

The installer will:
- ✅ Install the server to `%USERPROFILE%\.mcp\servers\ALI_DEV_MCP_Server`
- ✅ Configure VS Code MCP settings
- ✅ Install the PR Code Review chatmode
- ✅ Set up all dependencies

## 💻 VS Code GitHub Copilot Configuration

The installer automatically configures the MCP server in VS Code. The configuration is added to:

**Configuration file location:** `%APPDATA%\Code\User\mcp.json`

**If you already have an existing `mcp.json` file**, the installer will prompt you to manually add the configuration. Add the following servers to your existing configuration:

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

**Note:** 
- If you already have other MCP servers configured, merge the `ali-dev-mcp` and `ado` entries into your existing `servers` section
- Add the `ado_org` input to your existing `inputs` array if you don't already have it
- The `ado` server configuration is included by default for convenience. This is the official Azure DevOps MCP server from Microsoft. For more information, visit: https://github.com/microsoft/azure-devops-mcp

## 🛠️ Available Tools and Prompts

The ALI Dev MCP Server provides two main MCP providers for Azure DevOps pull request workflows:

### PR Files MCP

**Tools:**

- `get_pr_latest_iteration`: Get the latest iteration ID for a pull request in Azure DevOps
- `get_pr_iteration_changes`: Get file changes for a specific iteration of a pull request
- `get_pr_file_changes`: Get file changes from the latest iteration of a pull request (convenience tool)

**Prompts:**

- `analyze-pr-changes`: Analyze file changes in a pull request and provide insights (types, patterns, impact)
- `review-pr-files`: Review specific files changed in a pull request with optional filtering by pattern

### PR Comments MCP

**Tools:**

- `add_pr_inline_comment`: Add an inline review comment to a specific file and line in a pull request

**Prompts:**

- `add-review-comment`: Helper prompt to craft and add a single inline review comment
- `review-pr-with-comments`: Comprehensive review prompt that can analyze PR changes and add multiple inline comments

## 💬 GitHub Copilot Chat Integration

The installer sets up a custom chatmode for PR code reviews:
- **File:** `%APPDATA%\Code\User\prompts\PR Code Review.chatmode.md`
- **Usage:** Select this chatmode in GitHub Copilot Chat to perform automated PR reviews with inline comments

**Example Chat Commands:**

```
@copilot Use get_pr_file_changes tool for PR 12345 in project MyProject, repository MyRepo
@copilot Use analyze-pr-changes prompt for PR 12345 in project MyProject, repository MyRepo  
@copilot Use review-pr-with-comments prompt for PR 12345 in project MyProject, repository MyRepo
```

## 🔧 Troubleshooting

### Installation Issues

**"Node.js not found"**
- Install Node.js 18.0.0+ from [nodejs.org](https://nodejs.org/)
- Restart your terminal/command prompt after installation
- Verify installation: `node --version`

**"PowerShell execution error"**
- The batch installer runs PowerShell with `-ExecutionPolicy Bypass`
- If you encounter issues, run as Administrator
- Alternatively, run PowerShell script directly:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
  .\install.ps1
  ```

**"Failed to install dependencies"**
- Check your internet connection
- Verify npm is working: `npm --version`
- Try manual installation:
  ```powershell
  cd %USERPROFILE%\.mcp\servers\ALI_DEV_MCP_Server
  npm install
  ```

### VS Code Integration Issues

**"VS Code doesn't recognize MCP server"**
- Verify `mcp.json` exists at `%APPDATA%\Code\User\mcp.json`
- Check the file content matches the expected configuration
- Restart VS Code completely (close all windows)
- Check VS Code Output panel for MCP-related errors

**"GitHub Copilot Chat doesn't show chatmode"**
- Verify chatmode file exists at `%APPDATA%\Code\User\prompts\PR Code Review.chatmode.md`
- Restart VS Code
- Check that GitHub Copilot extension is installed and enabled

### Azure DevOps Authentication Issues

**"Authentication failed"**
- Run `az login` to authenticate with Azure DevOps
- Ensure you have access to the target Azure DevOps organization
- Verify your Azure DevOps permissions for the target project/repository
- Check that `@azure/identity` can access Azure credentials

**"Cannot access pull request"**
- Verify the project, repository, and PR ID are correct
- Ensure you have read permissions for the repository
- Check that the PR exists and is not deleted

### Testing the Server

To verify the server is working correctly:

```powershell
cd %USERPROFILE%\.mcp\servers\ALI_DEV_MCP_Server
npx tsx src\index.ts
```

The server should start without errors. Press `Ctrl+C` to stop it.

## 📚 Additional Resources

- **Installation Guide:** [INSTALLATION.md](./INSTALLATION.md) - Detailed installation instructions
- **Development Guide:** [README-DEV.md](./README-DEV.md) - For contributors and developers
- **Model Context Protocol:** [MCP Documentation](https://modelcontextprotocol.io/)
- **Azure DevOps API:** [REST API Reference](https://docs.microsoft.com/en-us/rest/api/azure/devops/)
- **Azure DevOps MCP Server:** [Official Microsoft Server](https://github.com/microsoft/azure-devops-mcp)

## 🤝 Contributing

Contributions are welcome! Please see [README-DEV.md](./README-DEV.md) for development setup and guidelines.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Commit your changes: `git commit -m "Add your feature"`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Create a Pull Request

## ©️ Copyright

© 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
