<!-- © 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved. -->

# S3D Dev MCP Server - Client Configuration

## 📋 Overview

The S3D Dev MCP Server is an intelligent development assistant that **reduces development time by up to 80%** through automated test generation, security vulnerability fixes, and seamless Azure DevOps integration. This Model Context Protocol server works with VS Code GitHub Copilot to transform complex development workflows into simple, automated processes.

**Key Capabilities:**

- 🚀 **Instant MCAT Test Generation** from Azure DevOps test cases
- 🔒 **Automated Security Fixes** for C++ and C# vulnerabilities
- 🔄 **Seamless Azure DevOps Integration** for workflow automation
- 🧪 **Automated ATP Generation** from test case specifications

## ⚡ Prerequisites

Before using the S3D Dev MCP Server, ensure you have:

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
  - Select the Visual Studio Subscription for which you have admin rights. Check you subscriptions [here](https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBladeV2).
- **Snyk CLI** (optional - for users utilizing Snyk security features):

  - For Windows: Download and run the installer or use npm:
  - ```powershell
    npm install -g snyk
    ```
  - Verify installation:
    ```powershell
    snyk --version
    ```
  - Authenticate with Snyk:
    ```powershell
    snyk auth
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

## 💻 VS Code GitHub Copilot

To use the S3D Dev MCP Server with VS Code GitHub Copilot, add this configuration to your MCP settings.

**Configuration file location:** `C:\Users\gmuthu\AppData\Roaming\Code\User\mcp.json`

```json
{
  "servers": {
    "s3d-dev-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@ppm/s3d-dev-mcp"]
    }
  }
}
```

## 🛠️ Available Tools and Prompts

The ALI Dev MCP Server provides several tools and prompts for development workflows:

### MCAT MCP

**Tools:**

- `get_test_case`: Fetches a test case from Azure DevOps.
- `get_automation_details`: Get automation details from an Azure DevOps work item.
- `update_automation_details`: Update automation details in an Azure DevOps work item.
- `clear_automation_details`: Clear automation details from an Azure DevOps work item.

**Prompts:**

- `write-new-mcat`: Generates new MCAT test based on Azure DevOps test case details.
- `run-and-debug-mcat`: Run and debug MCAT tests using the specified test name.

### CreateATP MCP

**Prompts:**

- `generate-atp-from-testcase`: Completes ATP generation workflow from test case.
Testcase can be provided in below ways:
  1.	Directly through prompt 
  2.	By creating TestCase.txt file in the workspace


### Snyk MCP

**Prompts:**

- `fix-snyk-issue-C++`: Fix Snyk issues in the C++ code.
- `fix-snyk-issue-C#`: Fix Snyk issues in the C# code.
- `fix-snyk-issue-C#-withUT`: Fix Snyk issues in the C# code with unit tests.

## 🔧 Troubleshooting

- Verify Node.js version compatibility (18.0.0 or higher)
- Check that the server starts correctly by running `npx -y @ppm/s3d-dev-mcp --registry=https://pkgs.dev.azure.com/hexagonPPMInnerSource/_packaging/PPM/npm/registry/` in a terminal
- If you encounter authentication issues, ensure you're logged in to Azure DevOps and have access to the PPM package feed

## ©️ Copyright

© 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
