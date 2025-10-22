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
              text: `Generate ATP from test case steps: "${testCaseSteps}"

## Workspace Structure Information:
The workspace contains two key folders:
1. **Middle Folder**: Contains the actual implementation code and APIs that need to be tested
   - Location: Usually under paths like */Middle/ or */SOM/Middle/
   - Contains: Business logic, services, data classes, and core functionality
   - Purpose: Source of truth for what functionality needs ATP coverage

2. **Testing/ATP Folder**: Contains existing ATP test implementations and patterns
   - Location: Usually under paths like */Testing/ATPs/ or */SOM/Testing/
   - Contains: Existing ATP files, test helpers, utilities, and patterns
   - Purpose: Reference for ATP structure, naming conventions, and reusable patterns

## Important: ATP File Creation Location
- **Always create the new ATP file in an existing Testing/ATP project within the current workspace**

## ATP Generation Workflow:

### Step 1 - Prepare ATP Test Case
- **If testCaseSteps parameter is provided**: Use the provided steps directly for ATP implementation
- **If testCaseSteps parameter is empty/null**: 
  1. Try to read src/helper/testcase.txt and extract the Steps section
  2. If file doesn't exist or no valid test case found, ask user to provide test case steps
- **Do not search the workspace if there are no steps available**
- Use the extracted or provided steps for ATP implementation
- Prepare the Test code for the given steps only
- In a new file, create a method that:
  * Adds // <ai generated code> below the copyright

### Step 2 - Search Workspace
- **Analyze Both Folders**: Cross-reference Middle APIs with existing ATP patterns
  - Match test case functionality with Middle layer implementation

### Step 3 - Generate & Build
- **Write ATP Implementation**:
  - Use Middle folder APIs and functionality for the actual test implementation
  - Implement test logic that exercises the Middle layer functionality specified in test case steps

- **Build Validation**:
  - Run dotnet build . until successful
  - Resolve any compilation errors by checking Middle folder API usage

### Step 4 - Run
- **ATP Generation Complete**: The ATP has been successfully generated and built
- **Next Step for User**: Run the ATP using the appropriate executable`
            }
          }
        ]
      };
    });
  }
}