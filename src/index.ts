#!/usr/bin/env node

/**
 * © 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { PRFilesMCP } from "./mcp/prFilesMcp.js";
import { PRCommentsMCP } from "./mcp/prCommentsMcp.js";

/**
 * Main entry point for the S3D Dev MCP Server
 */
async function main() {
  // Initialize MCP server
  const server = new McpServer(
    {
      name: "ali-dev-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        prompts: {},
      },
    }
  );

  // Register all functionality to the server

  const prFilesMcp = new PRFilesMCP(server);
  prFilesMcp.register();

  const prCommentsMcp = new PRCommentsMCP(server);
  prCommentsMcp.register();

  // Set up stdio transport
  const transport = new StdioServerTransport();
  
  // Connect server to transport
  await server.connect(transport);

  // Log server start
  console.info("ALI DEV MCP Server running on stdio");
}

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  console.info('Shutting down...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.info('Shutting down...');
  process.exit(0);
});

// Start the server
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
