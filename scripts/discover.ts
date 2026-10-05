import fs from 'node:fs/promises';
import path from 'node:path';

/** Only the catalogue's fixed roots; never follow a symlink or evaluate a glob. */
export async function discoverManifests(root: string): Promise<string[]> {
  const found: string[] = [];
  async function visit(relative: string): Promise<void> {
    let children;
    try { children = await fs.readdir(path.join(root, relative), { withFileTypes: true }); }
    catch (error: any) { if (error.code === 'ENOENT') return; throw error; }
    for (const child of children) {
      const name = path.posix.join(relative, child.name);
      if (child.isSymbolicLink()) continue;
      if (child.isDirectory()) await visit(name);
      else if (child.isFile() && child.name.endsWith('.yaml') && !child.name.startsWith('_')) found.push(name);
    }
  }
  for (const directory of ['catalog', 'pipelines', 'primitives']) {
    const stat = await fs.lstat(path.join(root, directory)).catch((e: any) => { if (e.code === 'ENOENT') return null; throw e; });
    if (stat?.isDirectory() && !stat.isSymbolicLink()) await visit(directory);
  }
  return found.sort();
}
