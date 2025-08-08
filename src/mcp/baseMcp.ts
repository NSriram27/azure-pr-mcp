import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Abstract base class for MCP functionality
 */
export abstract class BaseMCP {
  protected server: McpServer;

  constructor(server: McpServer) {
    this.server = server;
  }

  /**
   * Instance method to register functionality to the server
   */
  public register(): void {
    this.registerTools();
    this.registerPrompts();
  }

  /**
   * Register tools with the MCP server - must be implemented by subclasses
   */
  protected abstract registerTools(): void;

  /**
   * Register prompts with the MCP server - must be implemented by subclasses
   */
  protected abstract registerPrompts(): void;
}
