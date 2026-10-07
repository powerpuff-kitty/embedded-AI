// Explicit geometry-only adapter. No upstream photographic texture assets are loaded or distributed.
export function getBarkTexture(){throw new Error('The geometry fixture must disable bark textures.');}
export function getLeafTexture(){return null;}
