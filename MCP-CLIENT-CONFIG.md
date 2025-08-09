# MCP Client Configuration

## VS Code GitHub Copilot

To use the ALI Dev MCP Server with VS Code GitHub Copilot, add this configuration to your MCP settings:

```json
{
  "servers": {
    "ali-dev-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["@ppm/ali-dev-mcp"]
    }
  }
}
```

## Troubleshooting

- Ensure the package is installed globally or available in your project's dependencies
- Verify Node.js version compatibility (18.0.0 or higher)
- Check that the server starts correctly by running `npx @ppm/ali-dev-mcp` in a terminal
