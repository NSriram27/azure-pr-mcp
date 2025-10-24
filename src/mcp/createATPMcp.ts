/**
 * © 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BaseMCP } from "./baseMcp.js";
import { z } from "zod";

/**
 * CreateATPMCP class that registers ATP creation prompt to an existing MCP server
 */
export class CreateATPMCP extends BaseMCP {
  /**
   * Register tools - empty implementation as we only use prompts
   */
  protected registerTools(): void {
    // No tools registered - using prompts for ATP creation workflows
  }
  
  protected registerPrompts(): void {
    // Register generate-atp-from-testcase prompt
    this.server.registerPrompt("generate-atp-from-testcase", {
      description: "Generates ATP from test case steps using workspace patterns",
      argsSchema: {
        testCaseSteps: z.string().describe("Test case steps")
      }
    }, async ({ testCaseSteps }) => {
      return {
        description: "Generate ATP using workspace patterns",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Generate an Automated Test Procedure (ATP) file using the provided test case steps: "${testCaseSteps}"

## Workspace Structure Overview:
The workspace contains two key folders:

1. **Middle Folder** (e.g., */Middle/, */SOM/Middle/):
   - Contains implementation code, APIs, business logic, services, and data classes.
   - Serves as the source of truth for functionality requiring ATP coverage.

2. **Testing/ATP Folder** (e.g., */Testing/ATPs/, */SOM/Testing/):
   - Contains existing ATP implementations, test helpers, utilities, and reusable patterns.
   - Use this folder to reference naming conventions and structure.

## ATP File Creation Rule:
- Always create the new ATP file inside an existing Testing/ATP project within the current workspace.

## ATP Generation Workflow:

### Step 1: Prepare Test Case
- If testCaseSteps parameter is provided, use it directly.
- If not provided:
  1. Attempt to read testcase.txt from workspace and extract the "Steps" section.
  2. If the file is missing or invalid, prompt the user to supply test case steps.
- Do not search the workspace if no steps are available.
- Use only the extracted or provided steps to generate the ATP.
- In the new ATP file, add the comment // <ai generated code> below the copyright.

### Step 2: Analyze Workspace
- Cross-reference Middle folder APIs with existing ATP patterns.
- Match the functionality described in the test case steps with the Middle layer implementation.

### Step 3: Generate & Build
- Implement the ATP using Middle folder APIs.
- Ensure the test logic exercises the relevant functionality.
- Run dotnet build until successful.
- Resolve any compilation errors by verifying API usage.

### Step 4: Finalize
- Confirm ATP generation and successful build.
- Instruct the user to run the ATP using the appropriate executable.`
            }
          }
        ]
      };
    });
  }
}