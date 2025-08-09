import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BaseMCP } from "./baseMcp.js";
import { z } from "zod";

/**
 * SnykMCP class that registers tools and prompts to an existing MCP server
 */
export class SnykMCP extends BaseMCP {
  /**
   * Register Snyk-related tools with the MCP server
   */
  protected registerTools(): void {
    // No tools to register for Snyk MCP currently
  }

  /**
   * Register Snyk-related prompts with the MCP server
   */
  protected registerPrompts(): void {
    // Register fix-snyk-issue-C++ prompt
    this.server.registerPrompt("fix-snyk-issue-C++", {
      description: "Fix Snyk issues in the C++ code."
    }, async () => {
      return {
        description: "Fix Snyk issues in the C++ code.",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `**Task:**
            Run "snyk code test" on the current project.
            Fix the reported issues. 
            Add only the necessary code changes to fix the issues.
            Make sure the build is successful after making changes using the command
            & "C:\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise\\MSBuild\\Current\\Bin\\MSBuild.exe" <<ProjectFile>> /p:Configuration=Debug /p:Platform=x64 
            Run "snyk code test" again to verify that the issues are resolved.
            Keep the reasoning steps to 5 to 10 words.`
            }
          }
        ]
      };
    });

    // Register fix-snyk-issue-C# prompt
    this.server.registerPrompt("fix-snyk-issue-C#", {
      description: "Fix Snyk issues in the C# code."
    }, async () => {
      return {
        description: "Fix Snyk issues in the C# code.",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `**Task:**
            Run "snyk code test" on the current project.
            Fix the reported issues.
            Add only the necessary code changes to fix the issues.
            Make sure the build is successful after making changes.
            Run "snyk code test" again to verify that the issues are resolved.
            Keep the reasoning steps to 5 to 10 words.`
            }
          }
        ]
      };
    });

    // Register fix-snyk-issue-C#-withUT prompt
    this.server.registerPrompt("fix-snyk-issue-C#-withUT", {
      description: "Fix Snyk issues in the C# code with unit tests."
    }, async () => {
      return {
        description: "Fix Snyk issues in the C# code with unit tests.",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `**Task:**
            **Step 1:**
            Run "snyk code test" on the current project.
            Fix the reported issues.
            Add only the necessary code changes to fix the issues.
            Make sure the build is successful after making changes.
            Remove the profiler environment variables before building the solution to avoid conflicts:
                \`\`\`
                Remove-Item Env:JUSTMOCK_INSTANCE;
                Remove-Item Env:COR_ENABLE_PROFILING;
                Remove-Item Env:COR_PROFILER;
                Remove-Item Env:CORECLR_ENABLE_PROFILING;
                Remove-Item Env:CORECLR_PROFILER;
                \`\`\`
            Run "snyk code test" again to verify that the issues are resolved.
            Keep the reasoning steps to 5 to 10 words.
             
            **Step 2:**
            Update the respective unit tests.
            Run tests to ensure everything is working correctly using below command:
             
                \`\`\`
                $env:JUSTMOCK_INSTANCE=1; 
                $env:COR_ENABLE_PROFILING=1; 
                $env:COR_PROFILER="{{B7ABE522-A68F-44F2-925B-81E7488E9EC0}}"; 
                $env:CORECLR_ENABLE_PROFILING=1; 
                $env:CORECLR_PROFILER="{{B7ABE522-A68F-44F2-925B-81E7488E9EC0}}"; 
                & "C:\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise\\Common7\\IDE\\CommonExtensions\\Microsoft\\TestWindow\\VSTest.Console.exe" /Platform:x64 /inIsolation "X:\\Container\\Bin\\Assemblies\\Debug\\NetCore\\{{ProjectDllPath}}" /Logger:Console /TestCaseFilter:"FullyQualifiedName~{{ClassName}}"
                \`\`\`
             Keep the reasoning steps to 5 to 10 words.`
            }
          }
        ]
      };
    });
  }
}
