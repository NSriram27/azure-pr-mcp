#!/usr/bin/env node

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
  
  server.stdout.on("data", (data) => {
    output += data.toString();
  });

  server.stderr.on("data", (data) => {
    console.log("Server log:", data.toString());
  });

  // Test initialize
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

  // Wait a bit and test tools list
  setTimeout(() => {
    const toolsMessage = JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list"
    });
    
    server.stdin.write(toolsMessage + "\n");
  }, 100);

  // Wait a bit more and test prompts list
  setTimeout(() => {
    const promptsMessage = JSON.stringify({
      jsonrpc: "2.0",
      id: 3,
      method: "prompts/list"
    });
    
    server.stdin.write(promptsMessage + "\n");
  }, 200);

  // Close after testing
  setTimeout(() => {
    server.stdin.end();
    console.log("\nServer output:");
    console.log(output);
    
    if (output.includes("get_test_case") && output.includes("write-new-mcat")) {
      console.log("✅ MCP Server test passed!");
    } else {
      console.log("❌ MCP Server test failed!");
    }
    
    process.exit(0);
  }, 1000);
}

testMcpServer().catch(console.error);
