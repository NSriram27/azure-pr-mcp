# ALI Dev MCP Server

## Project Overview

A Model Context Protocol server for ALI development workflows (MCAT, Snyk, Unit Test, etc.)

## Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)

## Installation Steps

1. Download Node.js from the official website: [https://nodejs.org/](https://nodejs.org/)
2. Run the installer and follow the instructions.
3. Verify installation:

   ```bash
   node -v
   npm -v
   ```

## Azure DevOps Pipeline

- The project includes an `azure-pipelines.yml` for CI/CD. It installs dependencies, builds the project, and can be extended for testing and deployment.

## Project Structure

```
ali-dev-mcp-nodejs/
├── src/
│   ├── index.ts              # Main server entry point
│   ├── mcp/
│   │   ├── baseMcp.ts       # Base MCP class
│   │   ├── mcatMcp.ts       # MCAT functionality
│   │   └── snykMcp.ts       # Snyk functionality
│   └── helper/
│       └── azureGetTestcase.ts # Azure DevOps test case helper
├── .vscode/
│   └── mcp.json             # MCP configuration for VS Code
├── dist/                     # Compiled JavaScript (generated)
├── test-server.js            # Test server for MCP functionality
├── azure-pipelines.yml      # CI/CD pipeline configuration
├── MCP-CLIENT-CONFIG.md      # MCP client configuration guide
├── package.json
├── tsconfig.json
└── README.md
```

## Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK for Node.js
- `@azure/identity` - Azure authentication
- `azure-devops-node-api` - Azure DevOps API
- `jsdom` - HTML parsing for test case extraction

## Development

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```
3. Build:

   ```bash
   npm run build
   ```
4. Run in dev mode:

   ```bash
   npm run dev
   ```

### Add a New MCP Provider

1. Create a new file in `src/mcp/` (e.g., `myMcp.ts`).
2. Extend the `BaseMCP` class and implement `registerTools()` and `registerPrompts()`.
3. Import and register your new MCP in `src/index.ts`.
4. Run `npm test` to verify the new MCP provider is properly integrated and working.

## Available Tools and Prompts

### MCAT MCP

**Tools:**

- `get_test_case`: Fetches a test case from Azure DevOps.

**Prompts:**

- `write-new-mcat`: Generates new MCAT test based on Azure DevOps test case details.
- `run-and-debug-mcat`: Run and debug MCAT tests using the specified test name.

### Snyk MCP

**Prompts:**

- `fix-snyk-issue-C++`: Fix Snyk issues in the C++ code.
- `fix-snyk-issue-C#`: Fix Snyk issues in the C# code.
- `fix-snyk-issue-C#-withUT`: Fix Snyk issues in the C# code with unit tests.

## MCP Client Configuration

For information on configuring this server with MCP clients (such as VS Code GitHub Copilot), see [MCP-CLIENT-CONFIG.md](MCP-CLIENT-CONFIG.md).

## Copyright

© 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
