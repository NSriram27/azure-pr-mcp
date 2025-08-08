# ALI Dev MCP Server

## Project Overview

A Model Context Protocol server for ALI development workflows (MCAT, Snyk, Unit Test, etc.)

## Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)

**Installation Steps for Node.js:**

1. Download Node.js from the official website: [https://nodejs.org/](https://nodejs.org/)
2. Run the installer and follow the instructions.
3. Verify installation:

```bash
  node -v
  npm -v
```

**Register and Authenticate to npm Registry:**

1. Create or edit a `.npmrc` file in your project root.
2. Add your registry URL and authentication settings, for example:

```
  registry=https://pkgs.dev.azure.com/hexagonPPMInnerSource/_packaging/PPM/npm/registry/ 
  always-auth=true
```

3. Install vsts-npm-auth globally:

```bash
  npm install -g vsts-npm-auth
```

4. Authenticate using a tool like `vsts-npm-auth` (for Azure DevOps):

```bash
  vsts-npm-auth -config .npmrc
```

5. Verify authentication by running:

```bash
  npm whoami --registry=https://pkgs.dev.azure.com/hexagonPPMInnerSource/_packaging/PPM/npm/registry/
```

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
├── dist/                     # Compiled JavaScript (generated)
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

## MCP Config for VS Code GitHub Copilot

Add this to your MCP configuration:

```json
{
  "servers": {
    "ali-dev-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["@ppm/ali-dev-mcp"]
    }
  }
}
```

## Copyright

© 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
