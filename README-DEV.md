<!-- © 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved. -->

# S3D Dev MCP Server

## 📋 Project Overview

The S3D Dev MCP Server is a development assistant that significantly **reduces development time** and **streamlines workflows** for S3D development teams. This Model Context Protocol (MCP) server integrates seamlessly with VS Code GitHub Copilot to provide automated assistance.

### 🚀 **Key Benefits:**

- **Accelerated Test Development**: Automatically generates MCAT tests from Azure DevOps test cases, reducing manual test creation time by up to 80%
- **Streamlined Security Management**: Provides intelligent Snyk vulnerability fixes for C++ and C# codebases with context-aware solutions
- **Automated Workflow Integration**: Seamlessly connects with Azure DevOps to fetch, update, and manage test automation details

This server transforms complex, time-consuming development tasks into simple, automated workflows, allowing developers to focus on core business logic rather than boilerplate code and manual processes.

## ⚡ Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)

## 🔧 Installation Steps

1. Download Node.js from the official website: [https://nodejs.org/](https://nodejs.org/)
2. Run the installer and follow the instructions.
3. Verify installation:

   ```bash
   node -v
   npm -v
   ```

## ⚙️ Azure DevOps Pipeline

- The project includes an `azure-pipelines.yml` for CI/CD. It installs dependencies, builds the project, and can be extended for testing and deployment.

## 📁 Project Structure

```
s3d-dev-mcp/
├── src/
│   ├── index.ts              # Main server entry point
│   ├── mcp/
│   │   ├── baseMcp.ts       # Base MCP class
│   │   ├── mcatMcp.ts       # MCAT functionality
│   │   └── snykMcp.ts       # Snyk functionality
│   └── helper/
│       └── azureHelper.ts   # Azure DevOps helper functions
├── test/
│   └── azureHelper.test.ts  # Jest tests for Azure helper functions
│   └── test-server.js       # Test server for MCP functionality
├── jest.config.mjs           # Jest testing configuration
├── azure-pipelines.yml      # CI/CD pipeline configuration
├── README-DEV.md             # Development documentation
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Dependency lock file
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Main project documentation
```

## 📦 Dependencies

### Production Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK for Node.js
- `@azure/identity` - Azure authentication
- `azure-devops-node-api` - Azure DevOps API
- `jsdom` - HTML parsing for test case extraction
- `node-fetch` - HTTP client for API requests
- `zod` - Runtime type validation

### Development Dependencies

- `typescript` - TypeScript compiler
- `tsx` - TypeScript execution for development
- `jest` - Testing framework
- `@jest/globals` - Jest global functions
- `@types/jest` - TypeScript types for Jest
- `ts-jest` - TypeScript support for Jest
- `@types/node` - Node.js TypeScript types
- `@types/jsdom` - JSDOM TypeScript types

## 💻 Development

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

## 🧪 Testing

### Run Tests

- **Jest Unit Tests**: `npm run test:jest`
- **MCP Server Test**: `npm test`

### Test Files

- `test/azureHelper.test.ts` - Unit tests for Azure DevOps helper functions
- `test/test-server.js` - Integration test for the MCP server

### Adding Tests

When adding new helper functions, create corresponding test files in the `test/` directory following the naming convention `[sourceFile].test.ts`.

### 🔌 Add a New MCP Provider

1. Create a new file in `src/mcp/` (e.g., `myMcp.ts`).
2. Extend the `BaseMCP` class and implement `registerTools()` and `registerPrompts()`.
3. Import and register your new MCP in `src/index.ts`.
4. Run `npm test` to verify the new MCP provider is properly integrated and working.

## 🛠️ Available Tools and Prompts

### MCAT MCP

**Tools:**

- `get_test_case`: Fetches a test case from Azure DevOps.
- `get_automation_details`: Get automation details from an Azure DevOps work item.
- `update_automation_details`: Update automation details in an Azure DevOps work item.
- `clear_automation_details`: Clear automation details from an Azure DevOps work item.

**Prompts:**

- `write-new-mcat`: Generates new MCAT test based on Azure DevOps test case details.
- `run-and-debug-mcat`: Run and debug MCAT tests using the specified test name.

### Snyk MCP

**Prompts:**

- `fix-snyk-issue-C++`: Fix Snyk issues in the C++ code.
- `fix-snyk-issue-C#`: Fix Snyk issues in the C# code.
- `fix-snyk-issue-C#-withUT`: Fix Snyk issues in the C# code with unit tests.

## ⚙️ MCP Client Configuration

For information on configuring this server with MCP clients (such as VS Code GitHub Copilot), see [MCP-CLIENT-CONFIG.md](MCP-CLIENT-CONFIG.md).

## ©️ Copyright

© 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
