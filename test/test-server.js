#!/usr/bin/env node

/**
 * © 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
 */

import { readFileSync } from "fs";
import { spawn } from "child_process";
import { join } from "path";

async function testMcpServer() {
  console.log("Testing MCP Server...");

  const serverPath = join(process.cwd(), "dist", "index.js");
  
  // Start the server
  const server = spawn("node", [serverPath], {
    stdio: ["pipe", "pipe", "pipe"]
  });

  let output = "";
  let responses = [];
  
  server.stdout.on("data", (data) => {
    const chunk = data.toString();
    output += chunk;
    
    // Parse JSON-RPC responses
    const lines = chunk.split('\n').filter(line => line.trim());
    for (const line of lines) {
      try {
        const response = JSON.parse(line);
        responses.push(response);
        console.log("Received response:", JSON.stringify(response, null, 2));
      } catch (e) {
        // Not JSON, might be log message
        if (line.trim()) {
          console.log("Server log:", line);
        }
      }
    }
  });

  server.stderr.on("data", (data) => {
    console.log("Server error:", data.toString());
  });

  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 500));

  // Test initialize
  console.log("Sending initialize...");
  const initMessage = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {
        roots: { listChanged: true },
        sampling: {},
        experimental: {},
        resources: {}
      },
      clientInfo: {
        name: "test-client",
        version: "1.0.0"
      }
    }
  });

  server.stdin.write(initMessage + "\n");

  // Wait for initialize response
  await new Promise(resolve => setTimeout(resolve, 300));

  // Test tools list
  console.log("Sending tools/list...");
  const toolsMessage = JSON.stringify({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list"
  });
  
  server.stdin.write(toolsMessage + "\n");

  // Wait for tools response
  await new Promise(resolve => setTimeout(resolve, 300));

  // Test prompts list
  console.log("Sending prompts/list...");
  const promptsMessage = JSON.stringify({
    jsonrpc: "2.0",
    id: 3,
    method: "prompts/list"
  });
  
  server.stdin.write(promptsMessage + "\n");

  // Wait for prompts response
  await new Promise(resolve => setTimeout(resolve, 300));

  // Close after testing
  server.stdin.end();
  
  // Wait a bit more for final responses
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log("\nAll responses received:", responses.length);
  console.log("\nFull server output:");
  console.log(output);
  
  // Check if we got the expected tools and prompts
  const toolsResponse = responses.find(r => r.id === 2);
  const promptsResponse = responses.find(r => r.id === 3);
  
  let hasExpectedTools = false;
  let hasExpectedPrompts = false;
  
  if (toolsResponse && toolsResponse.result && toolsResponse.result.tools) {
    const toolNames = toolsResponse.result.tools.map(t => t.name);
    console.log("Found tools:", toolNames);
    hasExpectedTools = toolNames.includes("get_test_case") && toolNames.includes("get_pr_file_changes");
  }
  
  if (promptsResponse && promptsResponse.result && promptsResponse.result.prompts) {
    const promptNames = promptsResponse.result.prompts.map(p => p.name);
    console.log("Found prompts:", promptNames);
    hasExpectedPrompts = promptNames.includes("write-new-mcat") && promptNames.includes("analyze-pr-changes");
  }
  
  if (hasExpectedTools && hasExpectedPrompts) {
    console.log("✅ MCP Server test passed!");
  } else {
    console.log("❌ MCP Server test failed!");
    console.log("Expected tools: get_test_case, get_pr_file_changes");
    console.log("Expected prompts: write-new-mcat, analyze-pr-changes");
  }
  
  server.kill();
  process.exit(0);
}

testMcpServer().catch(console.error);
