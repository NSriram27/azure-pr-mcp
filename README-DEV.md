<!-- © 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved. -->

# ALI Dev MCP Server (Development README)

## 📋 Project Overview

This repository implements a small Model Context Protocol (MCP) server that exposes Azure DevOps pull-request related utilities over MCP. It provides tools and prompts for inspecting PR file changes, performing automated code reviews, and posting inline review comments based on that review using Azure DevOps REST APIs and the `@modelcontextprotocol/sdk`.

The server enables AI-powered code reviews through GitHub Copilot, automatically analyzing changed files in pull requests and posting actionable inline comments directly to Azure DevOps PRs.

This README is focused on the actual code in this repository (PR file analysis and PR commenting MCP providers) and removes references to unrelated providers.

## ⚡ Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)
- PowerShell (for running the installation script)
- Azure CLI (recommended for Azure DevOps authentication)

## 🚀 Installation

### Automated Installation (Recommended)

Simply run the batch installer:

1. **Double-click `installer.bat`** in the project root
   
   OR
   
2. **Open Command Prompt** and run:
   ```cmd
   installer.bat
   ```

### What the Installer Does

The batch installer automates the complete setup process:

1. ✅ **Verifies Prerequisites** - Checks for Node.js and PowerShell
2. ✅ **Creates Installation Directory** - Sets up `%USERPROFILE%\.mcp\servers\ALI_DEV_MCP_Server`
3. ✅ **Copies Project Files** - Copies `src/`, `package.json`, `tsconfig.json`, and `.vscode/` to the installation directory
4. ✅ **Installs Dependencies** - Runs `npm install` automatically
5. ✅ **Configures VS Code** - Copies `.vscode/mcp.json` to `%APPDATA%\Code\User\mcp.json` and updates the hardcoded path to the installation directory
6. ✅ **Installs Chatmode** - Adds PR Code Review chatmode to `%APPDATA%\Code\User\prompts\`

### Post-Installation Steps

After installation completes:

1. **Authenticate with Azure DevOps:**
   ```powershell
   az login
   ```

2. **Restart VS Code** to load the new MCP configuration

3. **Test the server** (optional):
   ```powershell
   cd %USERPROFILE%\.mcp\servers\ALI_DEV_MCP_Server
   npx tsx src\index.ts
   ```

4. **Use the PR Code Review chatmode** in GitHub Copilot Chat for automated PR reviews

## ⚙️ Azure DevOps Pipeline

This repository includes `azure-pipelines.yml` for CI. It currently runs install/build steps and can be extended to run tests.

## 📁 Project Structure

```
Ali_Dev_Mcp_Server/
├── src/
│   ├── index.ts              # Main server entry point (registers MCP providers)
│   ├── helper/
│   │   └── azureIdentity.ts    # Azure DevOps helper functions (REST calls)
│   └── mcp/
│       ├── baseMcp.ts        # Base MCP helper class
│       ├── prFilesMcp.ts     # MCP provider: PR file changes and analysis
│       └── prCommentsMcp.ts  # MCP provider: add inline PR comments and review prompts
├── test/
│   ├── azureIdentity.test.ts   # Jest tests for Azure helper functions
│   └── test-server.js        # Simple test harness for the MCP server
├── .vscode/
│   └── mcp.json              # MCP server configuration template
├── .github/
│   └── chatmodes/
│       └── PR Code Review.chatmode.md  # GitHub Copilot chatmode for PR reviews
├── package.json              # npm package configuration
├── tsconfig.json             # TypeScript configuration
├── azure-pipelines.yml       # Azure DevOps CI/CD pipeline
├── installer.bat             # Batch installer (Entry point)
├── install.ps1               # PowerShell installation script
├── INSTALLATION.md           # End-user installation guide
├── README-DEV.md             # This file (Development documentation)
└── README.md                 # User-facing documentation
```

## 📦 Dependencies (from package.json)

### Production Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK for Node.js
- `@azure/identity` - Azure authentication (DefaultAzureCredential used in helpers)
- `azure-devops-node-api` - present as a dependency (helper currently uses direct REST calls but dependency kept for future use)
- `node-fetch` - used for HTTP requests to Azure DevOps REST APIs
- `zod` - runtime validation used in MCP tool/prompt schemas

### Development Dependencies

- `typescript`, `tsx` - TypeScript build/run tools
- `jest`, `ts-jest`, `@jest/globals` - testing framework
- `@types/*` - TypeScript typings

You can inspect `package.json` for exact versions.

## 💻 Development

### For Contributors and Developers

If you're developing this project, follow these steps:

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/NSriram27/azure-pr-mcp.git
   cd Ali_Dev_Mcp_Server
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Build the project:**
   ```powershell
   npm run build
   ```

4. **Run in development mode:**
   ```powershell
   npm run dev
   ```

### Development Workflow

- Make changes to files in `src/`
- Run `npm run dev` to test changes immediately (uses `tsx` for on-the-fly TypeScript execution)
- Run `npm run build` to compile TypeScript to JavaScript
- Add tests in `test/` for new features
- Run `npm test` before committing changes

## 🧪 Testing

### Run Tests

- **Jest Unit Tests**: `npm run test:jest`
- **MCP Server Test harness**: `npm test` (runs `node test/test-server.js`)

### Test Files

- `test/azureIdentity.test.ts` - Unit tests for `src/helper/azureIdentity.ts`
- `test/test-server.js` - Simple MCP server test harness

## 🔌 Add a New MCP Provider

To add a new MCP provider in this codebase:

1. Create a new file in `src/mcp/`, e.g. `myProvider.ts`.
2. Extend `BaseMCP` and implement `registerTools()` and `registerPrompts()`.
3. Create and register an instance in `src/index.ts` (follow existing pattern for `PRFilesMCP` and `PRCommentsMCP`).
4. Add tests under `test/` and run `npm test`.

## 🛠️ Available MCP Providers, Tools and Prompts

This project currently exposes two MCP providers implemented in `src/mcp/`:

- PRFilesMCP (`src/mcp/prFilesMcp.ts`)
  - Tools:
    - `get_pr_latest_iteration` — Get the latest iteration ID for a pull request
    - `get_pr_iteration_changes` — Get file changes for a specific PR iteration
    - `get_pr_file_changes` — Get file changes from the latest iteration (convenience)
  - Prompts:
    - `analyze-pr-changes` — Analyze changed files and give insights (types, patterns, impact)
    - `review-pr-files` — Prompt to review specific files changed in a PR (optionally filter by pattern)

- PRCommentsMCP (`src/mcp/prCommentsMcp.ts`)
  - Tools:
    - `add_pr_inline_comment` — Add an inline review comment to a file/line in a PR
  - Prompts:
    - `add-review-comment` — Helper prompt to craft and add a single inline review comment
    - `review-pr-with-comments` — Comprehensive review prompt that can add multiple inline comments

Note: The Azure DevOps helper (`src/helper/azureIdentity.ts`) implements the REST calls used by these tools (authentication via `@azure/identity` and requests via `fetch`).

## ⚙️ MCP Client Configuration

The batch installer automatically copies and configures the MCP settings:
- **Source:** `.vscode/mcp.json` (in project)
- **Destination:** `%APPDATA%\Code\User\mcp.json`

The installer dynamically updates the hardcoded path in the configuration file to point to the installation directory.

**Configuration after installation:**
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

**Note:** The `ado` server configuration is included by default for convenience. This is the official Azure DevOps MCP server from Microsoft. For more information about this server, visit: https://github.com/microsoft/azure-devops-mcp

### GitHub Copilot Integration

The installer also sets up a custom chatmode for PR code reviews:
- **File:** `%APPDATA%\Code\User\prompts\PR Code Review.chatmode.md`
- **Usage:** Select this chatmode in GitHub Copilot Chat to perform automated PR reviews with inline comments

### Manual Configuration (if needed)

If the automatic configuration fails or you need to reconfigure:

1. Create or edit: `%APPDATA%\Code\User\mcp.json`
2. Copy the content from `.vscode/mcp.json`
3. Update the path in the `ali-dev-mcp` server `args` to match your installation directory
4. Restart VS Code

## Quality gates & notes

- This README reflects the actual code and installation process for the ALI Dev MCP Server
- The batch installer (`installer.bat` + `install.ps1`) automates the complete setup process
- Installation directory: `%USERPROFILE%\.mcp\servers\ALI_DEV_MCP_Server`
- MCP configuration: `%APPDATA%\Code\User\mcp.json`
- Chatmode file: `%APPDATA%\Code\User\prompts\PR Code Review.chatmode.md`
- For end-user installation instructions, see `INSTALLATION.md`
- For usage examples and API documentation, see `README.md`

## ⚠️ Troubleshooting

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

**"Directory already exists"**
- The installer will overwrite existing files
- To do a clean install, delete the directory first:
  ```powershell
  rmdir /s /q "%USERPROFILE%\.mcp\servers\ALI_DEV_MCP_Server"
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

## 📚 Additional Resources

- **Installation Guide:** `INSTALLATION.md` - Detailed end-user installation instructions
- **User Documentation:** `README.md` - Usage examples and API documentation
- **Model Context Protocol:** [MCP Documentation](https://modelcontextprotocol.io/)
- **Azure DevOps API:** [REST API Reference](https://docs.microsoft.com/en-us/rest/api/azure/devops/)
- **Azure Identity SDK:** [@azure/identity Documentation](https://learn.microsoft.com/en-us/javascript/api/@azure/identity/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Commit your changes: `git commit -m "Add your feature"`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Create a Pull Request

## ©️ Copyright

© 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
