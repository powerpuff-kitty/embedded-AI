import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function connect() {
  const transport = new StdioClientTransport({ command: process.execPath, args: [fileURLToPath(new URL('./server.mjs', import.meta.url))] });
  const client = new Client({ name: 'embedded-ai-mcp-test', version: '0.0.0' });
  await client.connect(transport);
  return client;
}

test('MCP server exposes its tools, resources and answers a need', async () => {
  const client = await connect();
  try {
    const tools = await client.listTools();
    assert.deepEqual(tools.tools.map((t) => t.name).sort(), ['catalogue_stats', 'get_entry', 'list_domains', 'need', 'search']);

    const need = await client.callTool({ name: 'need', arguments: { query: 'offline wake word on a microcontroller', limit: 2 } });
    assert.match(need.content[0].text, /Matches for/);

    const entry = await client.callTool({ name: 'get_entry', arguments: { id: 'docling' } });
    assert.match(entry.content[0].text, /Docling/);

    const missing = await client.callTool({ name: 'get_entry', arguments: { id: 'nope' } });
    assert.match(missing.content[0].text, /No entry with id/);

    const resources = await client.listResources();
    assert.ok(resources.resources.some((r) => r.uri === 'embedded-ai://catalog'));
    const read = await client.readResource({ uri: 'embedded-ai://catalog' });
    const parsed = JSON.parse(read.contents[0].text);
    assert.ok(Array.isArray(parsed.entries) && parsed.entries.length > 500);
  } finally {
    await client.close();
  }
});
