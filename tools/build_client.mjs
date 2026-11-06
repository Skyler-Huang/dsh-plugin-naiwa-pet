import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'src', 'client.js');
const assetPath = path.join(root, 'assets', 'naiwa.webp');
const cssPath = path.join(root, 'src', 'pet.css');
const outputPath = path.join(root, 'client.js');

const source = fs.readFileSync(sourcePath, 'utf8');
const asset = fs.readFileSync(assetPath);
const css = fs.readFileSync(cssPath, 'utf8');
const assetUri = `data:image/webp;base64,${asset.toString('base64')}`;

if (!source.includes('__NAIWA_ASSET__') || !source.includes('__NAIWA_CSS__')) {
  throw new Error('src/client.js is missing an asset or stylesheet placeholder');
}

const output = source
  .replace('__NAIWA_ASSET__', JSON.stringify(assetUri))
  .replace('__NAIWA_CSS__', JSON.stringify(css));

fs.writeFileSync(outputPath, output);
console.log(`built client.js: ${Buffer.byteLength(output)} bytes (asset ${asset.length} B, css ${Buffer.byteLength(css)} B)`);
