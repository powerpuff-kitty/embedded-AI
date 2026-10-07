#!/usr/bin/env node
/**
 * embedded-AI MCP server.
 *
 * Exposes the catalogue's offline need matcher and metadata search as MCP tools
 * over stdio, so Claude Desktop, Cursor and other MCP clients can query it.
 *
 *   node server.mjs
 *
 * The catalogue data is never fetched or inferred: the tools return exactly the
 * committed metadata, matching the CLI and web explorer.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { needTool, searchTool, getTool, domainsTool, statsTool, entries, coverage, version } from './tools.mjs';

const text = (value) => ({ content: [{ type: 'text', text: String(value) }] });
const safe = (fn) => async (args = {}) => {
  try { return text(await fn(args)); }
  catch (error) { return { content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : error}` }], isError: true }; }
};

const server = new McpServer({ name: 'embedded-ai-catalog', version });

server.registerTool('need', {
  title: 'Match a need',
  description: 'Rank on-device and embedded AI components for a plain-language need. Deterministic and offline. Optional hard constraints: offline, pretrained, model.',
  inputSchema: {
    query: z.string().describe('What you want to do, e.g. "detect people on a camera offline with a tiny model"'),
    limit: z.number().int().min(1).max(50).optional(),
    offline: z.boolean().optional().describe('only entries with offline operation documented'),
    pretrained: z.boolean().optional().describe('only entries with published pretrained weights'),
    model: z.boolean().optional().describe('only models/collections'),
  },
}, safe(needTool));

server.registerTool('search', {
  title: 'Search the catalogue',
  description: 'Metadata search and filtering over id, name, description and tags.',
  inputSchema: {
    query: z.string().optional(),
    domain: z.string().optional(),
    task: z.string().optional(),
    kind: z.enum(['model', 'collection', 'pipeline', 'toolkit', 'primitive']).optional(),
    usage: z.enum(['pretrained', 'requires-training', 'companion', 'unknown']).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  },
}, safe(searchTool));

server.registerTool('get_entry', {
  title: 'Get a catalogue entry',
  description: 'Fetch one catalogue entry by its stable id.',
  inputSchema: { id: z.string().describe('the entry id, e.g. "docling"') },
}, safe(getTool));

server.registerTool('list_domains', {
  title: 'List domains',
  description: 'List every catalogue domain with its entry count.',
  inputSchema: {},
}, safe(domainsTool));

server.registerTool('catalogue_stats', {
  title: 'Catalogue statistics',
  description: 'Totals, kinds and an honest evidence-status summary.',
  inputSchema: {},
}, safe(statsTool));

server.resource('catalogue-json', 'embedded-ai://catalog', { mimeType: 'application/json', description: 'The full catalogue entries as JSON' }, async (uri) => ({
  contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify({ schema_version: 1, version, entries }) }],
}));

server.resource('coverage-json', 'embedded-ai://coverage', { mimeType: 'application/json', description: 'Coverage and evidence-status counts' }, async (uri) => ({
  contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(coverage, null, 2) }],
}));

const transport = new StdioServerTransport();
await server.connect(transport);
