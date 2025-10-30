<!-- © 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved. -->

# ALI Dev MCP Server (Development README)

## 📋 Project Overview

This repository implements a small Model Context Protocol (MCP) server that exposes Azure DevOps pull-request related utilities over MCP. It provides tools and prompts for inspecting PR file changes and adding inline review comments using Azure DevOps REST APIs and the `@modelcontextprotocol/sdk`.

This README is focused on the actual code in this repository (PR file analysis and PR commenting MCP providers) and removes references to unrelated providers.

## ⚡ Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)

## 🔧 Installation Steps

1. Install Node.js (>= 18). See https://nodejs.org/
2. From the repository root, install dependencies:

   ```powershell
   npm install
   ```

3. Build the TypeScript sources (optional for dev runs using `tsx`):

   ```powershell
   npm run build
   ```

4. Run in dev mode (uses `tsx`):

   ```powershell
   npm run dev
   ```

## ⚙️ Azure DevOps Pipeline

This repository includes `azure-pipelines.yml` for CI. It currently runs install/build steps and can be extended to run tests.

## 📁 Project Structure

```
ali-dev-mcp/
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
├── package.json
├── tsconfig.json
├── azure-pipelines.yml
├── README-DEV.md             # This file
└── README.md
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

1. Clone the repository
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Run in dev mode: `npm run dev`

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

For information on configuring MCP clients (e.g. VS Code integrations), follow the MCP SDK and client docs. This repo expects an MCP client that communicates over stdio by default (see `src/index.ts`).

## Quality gates & notes

- The README was updated to reflect the actual code present in the repository and to remove unrelated MCAT/Snyk content.
- If you want me to add more documentation (examples of tool inputs/outputs, sample prompt payloads, or a quick start script), tell me which examples you'd like included.

## ©️ Copyright

© 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
