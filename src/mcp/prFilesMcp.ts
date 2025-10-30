/**
 * © 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BaseMCP } from "./baseMcp.js";
import { 
  getPRLatestIterationId,
  getPRIterationChanges,
  getPRFileChanges,
  PRIterationResult
} from "../helper/azureHelper.js";
import { z } from "zod";

/**
 * PRFilesMCP class that registers PR file changes tools to an existing MCP server
 */
export class PRFilesMCP extends BaseMCP {

  /**
   * Register PR files related tools with the MCP server
   */
  protected registerTools(): void {
    // Register the get_pr_latest_iteration tool
    this.server.registerTool("get_pr_latest_iteration", {
      description: "Get the latest iteration ID for a pull request in Azure DevOps",
      inputSchema: {
        organization: z.string().describe("Azure DevOps organization name").default("hexagonppmcol"),
        project: z.string().describe("Azure DevOps project name"),
        repositoryId: z.string().describe("Repository ID or name"),
        pullRequestId: z.number().describe("Pull request ID")
      }
    }, async ({ organization, project, repositoryId, pullRequestId }) => {
      try {
        const iterationId = await getPRLatestIterationId(
          organization || "hexagonppmcol",
          project,
          repositoryId,
          pullRequestId
        );
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                pullRequestId,
                latestIterationId: iterationId
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting latest iteration ID: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });

    // Register the get_pr_iteration_changes tool
    this.server.registerTool("get_pr_iteration_changes", {
      description: "Get file changes for a specific iteration of a pull request in Azure DevOps",
      inputSchema: {
        organization: z.string().describe("Azure DevOps organization name").default("hexagonppmcol"),
        project: z.string().describe("Azure DevOps project name"),
        repositoryId: z.string().describe("Repository ID or name"),
        pullRequestId: z.number().describe("Pull request ID"),
        iterationId: z.number().describe("Iteration ID")
      }
    }, async ({ organization, project, repositoryId, pullRequestId, iterationId }) => {
      try {
        const result = await getPRIterationChanges(
          organization || "hexagonppmcol",
          project,
          repositoryId,
          pullRequestId,
          iterationId
        );
        
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
              text: `Error getting iteration changes: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });

    // Register the get_pr_file_changes tool (combines both operations)
    this.server.registerTool("get_pr_file_changes", {
      description: "Get file changes from the latest iteration of a pull request in Azure DevOps",
      inputSchema: {
        organization: z.string().describe("Azure DevOps organization name").default("hexagonppmcol"),
        project: z.string().describe("Azure DevOps project name"),
        repositoryId: z.string().describe("Repository ID or name"),
        pullRequestId: z.number().describe("Pull request ID")
      }
    }, async ({ organization, project, repositoryId, pullRequestId }) => {
      try {
        const result = await getPRFileChanges(
          organization || "hexagonppmcol",
          project,
          repositoryId,
          pullRequestId
        );
        
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
              text: `Error getting PR file changes: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });
  }

  /**
   * Register PR files related prompts with the MCP server
   */
  protected registerPrompts(): void {
    // Register analyze-pr-changes prompt
    this.server.registerPrompt("analyze-pr-changes", {
      description: "Analyze file changes in a pull request and provide insights",
      argsSchema: {
        organization: z.string().describe("Azure DevOps organization name"),
        project: z.string().describe("Azure DevOps project name"),
        repositoryId: z.string().describe("Repository ID or name"),
        pullRequestId: z.string().describe("Pull request ID")
      }
    }, async ({ organization, project, repositoryId, pullRequestId }) => {
      return {
        description: "Analyze file changes in a pull request and provide insights",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Analyze the file changes in pull request ${pullRequestId} for project ${project} in organization ${organization}, repository ${repositoryId}.

Instructions:
1. Use the get_pr_file_changes tool to retrieve all file changes from the latest iteration
2. Analyze the changes and provide insights about:
   - Types of files modified (code, config, documentation, etc.)
   - Change patterns (additions, deletions, modifications, renames)
   - Potential impact areas
   - Files that might need additional review
3. Summarize the overall scope and nature of the changes
4. Highlight any notable patterns or concerns

This analysis will help reviewers understand the scope and impact of the pull request changes.`
            }
          }
        ]
      };
    });

    // Register review-pr-files prompt
    this.server.registerPrompt("review-pr-files", {
      description: "Review specific files changed in a pull request",
      argsSchema: {
        organization: z.string().describe("Azure DevOps organization name"),
        project: z.string().describe("Azure DevOps project name"),
        repositoryId: z.string().describe("Repository ID or name"),
        pullRequestId: z.string().describe("Pull request ID"),
        filePattern: z.string().optional().describe("Optional file pattern to filter files (e.g., '*.cs', '*.ts')")
      }
    }, async ({ organization, project, repositoryId, pullRequestId, filePattern }) => {
      return {
        description: "Review specific files changed in a pull request",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Review the files changed in pull request ${pullRequestId} for project ${project} in organization ${organization}, repository ${repositoryId}.

Instructions:
1. Use the get_pr_file_changes tool to get all file changes
2. ${filePattern ? `Filter files matching pattern: ${filePattern}` : 'Review all changed files'}
3. For each relevant file:
   - Read the current content using appropriate tools
   - Analyze the changes in context
   - Check for potential issues, code quality concerns, or improvements
   - Verify adherence to coding standards and best practices
4. Provide detailed feedback on:
   - Code quality and maintainability
   - Potential bugs or issues
   - Performance considerations
   - Security implications
   - Test coverage needs
5. Summarize recommendations for the pull request

This comprehensive review will help ensure code quality and identify areas for improvement.`
            }
          }
        ]
      };
    });
  }
}
