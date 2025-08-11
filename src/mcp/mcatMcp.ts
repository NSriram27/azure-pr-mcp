import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BaseMCP } from "./baseMcp.js";
import { 
  getStepsFromTestcase, 
  getAutomationDetailsFromWorkItem, 
  updateAutomationDetailsInWorkItem, 
  clearAutomationDetailsInWorkItem 
} from "../helper/azureHelper.js";
import { z } from "zod";

/**
 * MCATMCP class that registers tools and prompts to an existing MCP server
 */
export class MCATMCP extends BaseMCP {
  /**
   * Register MCAT-related tools with the MCP server
   */
  protected registerTools(): void {
    // Register the get_test_case tool
    this.server.registerTool("get_test_case", {
      description: "Fetches a test case from Azure DevOps",
      inputSchema: {
        testid: z.string().describe("The test case ID to fetch")
      }
    }, async ({ testid }) => {
      try {
        const result = await getStepsFromTestcase(testid);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching test case: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });

    // Register the get_automation_details tool
    this.server.registerTool("get_automation_details", {
      description: "Get automation details from an Azure DevOps work item",
      inputSchema: {
        workItemId: z.string().describe("The work item ID to get automation details from")
      }
    }, async ({ workItemId }) => {
      try {
        const result = await getAutomationDetailsFromWorkItem(workItemId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting automation details: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });

    // Register the update_automation_details tool
    this.server.registerTool("update_automation_details", {
      description: "Update automation details in an Azure DevOps work item",
      inputSchema: {
        workItemId: z.string().describe("The work item ID to update"),
        automatedTestId: z.string().optional().describe("The automated test ID (will be used for both ID and name)"),
        automatedTestStorage: z.string().optional().describe("The automated test storage"),
        automationStatus: z.string().optional().describe("The automation status")
      }
    }, async ({ workItemId, automatedTestId, automatedTestStorage, automationStatus }) => {
      try {
        const updates: any = {};
        if (automatedTestId !== undefined) {
          updates.automatedTestId = automatedTestId;
          // Always set automatedTestName to the same value as automatedTestId
          updates.automatedTestName = automatedTestId;
        }
        if (automatedTestStorage !== undefined) updates.automatedTestStorage = automatedTestStorage;
        // Always set automatedTestType to "L2"
        updates.automatedTestType = "L2";
        if (automationStatus !== undefined) updates.automationStatus = automationStatus;

        const success = await updateAutomationDetailsInWorkItem(workItemId, updates);
        return {
          content: [
            {
              type: "text",
              text: success ? 
                `Successfully updated automation details for work item ${workItemId}` : 
                `Failed to update automation details for work item ${workItemId}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error updating automation details: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });

    // Register the clear_automation_details tool
    this.server.registerTool("clear_automation_details", {
      description: "Clear automation details from an Azure DevOps work item",
      inputSchema: {
        workItemId: z.string().describe("The work item ID to clear automation details from")
      }
    }, async ({ workItemId }) => {
      try {
        const success = await clearAutomationDetailsInWorkItem(workItemId);
        return {
          content: [
            {
              type: "text",
              text: success ? 
                `Successfully cleared automation details for work item ${workItemId}` : 
                `Failed to clear automation details for work item ${workItemId}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error clearing automation details: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });
  }

  /**
   * Register MCAT-related prompts with the MCP server
   */
  protected registerPrompts(): void {
    // Register write-new-mcat prompt
    this.server.registerPrompt("write-new-mcat", {
      description: "Generates new MCAT test based on Azure DevOps test case details.",
      argsSchema: {
        testid: z.string().describe("The test case ID to generate MCAT test for")
      }
    }, async ({ testid }) => {
      return {
        description: "Generates new MCAT test based on Azure DevOps test case details.",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Instructions:
         
              Step 1 - Retrieve Test Steps:
              Use the get_test_case tool with the test case ID ${testid} to fetch the associated steps and expected results.
              List down the steps and expected results for clarity.
              
              Step 2 - Search Workspace for Reference Files:
              YOU MUST search the current workspace for reference files and code patterns before generating the MCAT.
              Look for existing MCAT files, helper methods, utility classes, and coding patterns in the workspace.
              Use semantic search or file search to find relevant code examples and patterns.
              Search for files with extensions like .cs, .csproj, and any existing test files.
              This step is REQUIRED before generating any MCAT code.
              
              Step 3 - Generate MCAT:
              Write a new MCAT for the test case using the retrieved steps.
              Ensure all steps are included in the MCAT.
              MANDATORY: Use the patterns, methods, and utilities found in the workspace during Step 2.
              Follow the coding style and structure found in existing MCAT files in the workspace.
              The MCAT must be error-free and follow the correct syntax shown in the reference files.
              Run only "dotnet build ." in Copilot terminal to build. Don't use any other command.
              Before continuing to run the test, ask user whether to change the name of the file. If user gives a name then rename both the class and file. And then build the project before proceeding to next step.

              Step 4 - Run and Validate:
              run "X:\\Container\\Bin\\Assemblies\\Debug\\NetCore\\MCATRunner.exe - testnames testname" in command prompt
              Review the MCATSummary.log for result from temp directory to determine if the test passed or failed.
              
              Step 5 - Debug if Needed:
              If the test fails, identify and fix any errors in the MCAT and build.
              Re-run the test until it passes successfully.
              After completing all the steps show the log file.
              
              IMPORTANT: Do NOT proceed to Step 3 without completing Step 2. You must search the workspace for reference patterns first.`
            }
          }
        ]
      };
    });

    // Register run-and-debug-mcat prompt
    this.server.registerPrompt("run-and-debug-mcat", {
      description: "Run and debug MCAT tests using the specified test name.",
      argsSchema: {
        testname: z.string().describe("The test name to run and debug")
      }
    }, async ({ testname }) => {
      return {
        description: "Run and debug MCAT tests using the specified test name.",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Instructions:
          Run and Validate:
          run "X:\\Container\\Bin\\Assemblies\\Debug\\NetCore\\MCATRunner.exe - testnames ${testname}" in command prompt
          Review the MCATSummary.log for result from temp directory to determine if any tests are passed or failed.
          
          Debug if Needed:
          If any tests fail, identify and fix any errors in all the MCAT and build.
          Re-run the tests until it passes successfully.
          After completing all the steps show the log file.`
            }
          }
        ]
      };
    });
  }
}
