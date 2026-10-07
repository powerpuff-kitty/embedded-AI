# embedded-ai-catalog-mcp

An [MCP](https://modelcontextprotocol.io) server that exposes the **embedded-AI**
catalogue's offline need matcher and metadata search to Claude Desktop, Claude
Code, Cursor and any other MCP client.

Offline and deterministic: it returns exactly the committed catalogue metadata,
with the same rankings as the CLI and the web explorer. No network, no model
inference, no inferred values.

## Tools

| Tool | What it does |
|---|---|
| `need` | Rank on-device/embedded AI for a plain-language need. Optional hard constraints: `offline`, `pretrained`, `model`. |
| `search` | Metadata search/filter by free text, `domain`, `task`, `kind` or `usage`. |
| `get_entry` | Fetch one entry by its stable `id`. |
| `list_domains` | List every domain with its entry count. |
| `catalogue_stats` | Totals, kinds and an honest evidence-status summary. |

## Resources

| URI | Contents |
|---|---|
| `embedded-ai://catalog` | The full catalogue entries as JSON. |
| `embedded-ai://coverage` | Coverage and evidence-status counts. |

## Install

Published alongside the catalogue (publish `embedded-ai-catalog` first):

```sh
npm install -g embedded-ai-catalog-mcp
```

Or run straight from a clone with no install:

```sh
node mcp/server.mjs
```

## Client configuration

Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`
on macOS, `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "embedded-ai": { "command": "npx", "args": ["-y", "embedded-ai-catalog-mcp"] }
  }
}
```

Cursor (`.cursor/mcp.json`) or any client using the same schema:

```json
{
  "mcpServers": {
    "embedded-ai": { "command": "npx", "args": ["-y", "embedded-ai-catalog-mcp"] }
  }
}
```

Point at a local checkout instead:

```json
{ "mcpServers": { "embedded-ai": { "command": "node", "args": ["/path/to/embedded-AI/mcp/server.mjs"] } } }
```

## Example

> "Find a tiny offline wake-word model for a microcontroller."

The `need` tool returns ranked entries with an explicit, auditable `why` for each
match, and reports any matches hidden by constraints rather than dropping them
silently.

## Development

```sh
cd mcp
npm install
npm test        # end-to-end MCP handshake against a spawned server
npm start       # run the server on stdio
```
