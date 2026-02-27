import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = resolve(process.cwd());
const distDir = resolve(rootDir, 'dist');

if (!existsSync(distDir)) {
  throw new Error('dist directory not found. Run `npm run build` first.');
}

const manifestPath = resolve(rootDir, 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

if (manifest?.action?.default_popup) {
  manifest.action.default_popup = manifest.action.default_popup.replace(/^dist\//, '');
}

const srcOutputPath = resolve(distDir, 'src');
const iconsOutputPath = resolve(distDir, 'icons');

mkdirSync(srcOutputPath, { recursive: true });
mkdirSync(iconsOutputPath, { recursive: true });

cpSync(resolve(rootDir, 'src/background'), resolve(srcOutputPath, 'background'), {
  recursive: true,
  force: true,
});

cpSync(resolve(rootDir, 'src/content'), resolve(srcOutputPath, 'content'), {
  recursive: true,
  force: true,
});

cpSync(resolve(rootDir, 'icons'), iconsOutputPath, {
  recursive: true,
  force: true,
});

writeFileSync(resolve(distDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

console.log('Prepared Chrome extension bundle in dist/.');
