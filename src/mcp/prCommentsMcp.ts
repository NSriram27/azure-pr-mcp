/**
 * © 2025, Hexagon AB and/or its subsidiaries and affiliates. All rights reserved.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BaseMCP } from "./baseMcp.js";
import { addPRInlineComment, PRCommentThread } from "../helper/azureHelper.js";
import { z } from "zod";

/**
 * PRCommentsMCP class that registers PR comment threads tools to an existing MCP server
 */
export class PRCommentsMCP extends BaseMCP {

  /**
   * Register PR comments related tools with the MCP server
   */
  protected registerTools(): void {
    // Register the add_pr_inline_comment tool
    this.server.registerTool("add_pr_inline_comment", {
      description: "Add an inline comment to a specific line in a file within a pull request in Azure DevOps",
      inputSchema: {
        organization: z.string().describe("Azure DevOps organization name").default("hexagonppmcol"),
        project: z.string().describe("Azure DevOps project name"),
        repositoryId: z.string().describe("Repository ID or name"),
        pullRequestId: z.number().describe("Pull request ID"),
        filePath: z.string().describe("Path to the file in the repository (e.g., /src/Services/MyFile.cs)"),
        lineNumber: z.number().describe("Line number in the file where the comment should be added"),
        commentText: z.string().describe("The comment text to add")
      }
    }, async ({ organization, project, repositoryId, pullRequestId, filePath, lineNumber, commentText }) => {
      try {
        const result = await addPRInlineComment(
          organization || "hexagonppmcol",
          project,
          repositoryId,
          pullRequestId,
          filePath,
          lineNumber,
          commentText
        );
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                threadId: result.id,
                filePath,
                lineNumber,
                commentText,
                createdDate: result.publishedDate,
                status: result.status
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error adding PR inline comment: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });
  }

  /**
   * Register PR comments related prompts with the MCP server
   */
  protected registerPrompts(): void {
    // Register add-review-comment prompt
    this.server.registerPrompt("add-review-comment", {
      description: "Add a review comment to a specific line in a pull request file",
      argsSchema: {
        organization: z.string().describe("Azure DevOps organization name"),
        project: z.string().describe("Azure DevOps project name"),
        repositoryId: z.string().describe("Repository ID or name"),
        pullRequestId: z.string().describe("Pull request ID"),
        filePath: z.string().describe("Path to the file in the repository"),
        lineNumber: z.string().describe("Line number where to add the comment"),
        reviewFocus: z.string().optional().describe("Specific focus area for the review (e.g., 'security', 'performance', 'logic')")
      }
    }, async ({ organization, project, repositoryId, pullRequestId, filePath, lineNumber, reviewFocus }) => {
      return {
        description: "Add a review comment to a specific line in a pull request file",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Add a review comment to line ${lineNumber} in file ${filePath} for pull request ${pullRequestId} in project ${project}, organization ${organization}, repository ${repositoryId}.

Instructions:
1. First, read the content of the file at the specified line to understand the context
2. Analyze the code around line ${lineNumber} for potential issues${reviewFocus ? ` with focus on: ${reviewFocus}` : ''}
3. Provide constructive feedback focusing on:
   - Code quality and best practices
   - Potential bugs or logical issues
   - Security considerations
   - Performance implications
   - Maintainability concerns
4. Use the add_pr_inline_comment tool to add the comment with clear, actionable feedback
5. Ensure the comment is professional, specific, and helpful for the developer

The comment should help improve code quality and provide valuable insights for the pull request review process.`
            }
          }
        ]
      };
    });

    // Register review-pr-with-comments prompt
    this.server.registerPrompt("review-pr-with-comments", {
      description: "Perform a comprehensive review of a pull request and add inline comments where needed",
      argsSchema: {
        organization: z.string().describe("Azure DevOps organization name"),
        project: z.string().describe("Azure DevOps project name"),
        repositoryId: z.string().describe("Repository ID or name"),
        pullRequestId: z.string().describe("Pull request ID"),
        reviewCriteria: z.string().optional().describe("Specific review criteria (e.g., 'security-focused', 'performance', 'code-style')")
      }
    }, async ({ organization, project, repositoryId, pullRequestId, reviewCriteria }) => {
      return {
        description: "Perform a comprehensive review of a pull request and add inline comments where needed",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Perform a comprehensive review of pull request ${pullRequestId} for project ${project} in organization ${organization}, repository ${repositoryId}.

Instructions:
1. Use the get_pr_file_changes tool to get all files changed in the PR
2. For each changed file:
   - Read the file content to understand the changes
   - Analyze the code for issues based on ${reviewCriteria || 'general best practices'}
   - Identify specific lines that need attention
3. Use the add_pr_inline_comment tool to add comments for:
   - Code quality issues
   - Potential bugs or logical problems
   - Security vulnerabilities
   - Performance concerns
   - Best practice violations
   - Missing error handling
4. Provide a summary of all comments added and overall assessment
5. Focus on constructive, actionable feedback that helps improve the code

This comprehensive review will help ensure high code quality and catch potential issues before merge.`
            }
          }
        ]
      };
    });
  }
}