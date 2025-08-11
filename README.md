# MCP Client Configuration

## Prerequisites

Before using the ALI Dev MCP Server, ensure you have:

- **Node.js** version 18.0.0 or higher installed

  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation:

    ```bash
    node --version
    ```

    ```bash
    npm --version
    ```
- **Azure CLI** installed and configured:

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
- **Registry configuration** - Follow these steps to configure the Azure DevOps registry:
- 1. **Install vsts-npm-auth globally:**

     ```powershell
     npm install -g vsts-npm-auth
     ```
  2. **Create .npmrc file in your home directory:**

     **PowerShell:**
     ```powershell
     echo "registry=https://pkgs.dev.azure.com/hexagonPPMInnerSource/_packaging/PPM/npm/registry/" | Out-File -FilePath "$env:USERPROFILE\.npmrc" -Encoding utf8
     echo "always-auth=true" | Out-File -FilePath "$env:USERPROFILE\.npmrc" -Append -Encoding utf8
     ```

     **Command Prompt (cmd):**
     ```cmd
     echo registry=https://pkgs.dev.azure.com/hexagonPPMInnerSource/_packaging/PPM/npm/registry/ > "%USERPROFILE%\.npmrc"
     echo always-auth=true >> "%USERPROFILE%\.npmrc"
     ```

     Or manually create the file at `%USERPROFILE%\.npmrc` with this content:

     ```
     registry=https://pkgs.dev.azure.com/hexagonPPMInnerSource/_packaging/PPM/npm/registry/
     always-auth=true
     ```
  3. **Configure VSTS authentication:**

     ```powershell
     vsts-npm-auth -config .npmrc
     ```

## VS Code GitHub Copilot

To use the ALI Dev MCP Server with VS Code GitHub Copilot, add this configuration to your MCP settings.

**Configuration file location:** `C:\Users\gmuthu\AppData\Roaming\Code\User\mcp.json`

```json
{
  "servers": {
    "ali-dev-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@ppm/ali-dev-mcp"]
    }
  }
}
```

## Troubleshooting

- Verify Node.js version compatibility (18.0.0 or higher)
- Check that the server starts correctly by running `npx -y @ppm/ali-dev-mcp --registry=https://pkgs.dev.azure.com/hexagonPPMInnerSource/_packaging/PPM/npm/registry/` in a terminal
- If you encounter authentication issues, ensure you're logged in to Azure DevOps and have access to the PPM package feed
