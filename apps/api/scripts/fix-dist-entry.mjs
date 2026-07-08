import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shim = join(root, 'dist', 'main.js');

writeFileSync(
  shim,
  "// Nest monorepo build shim — real entry is nested under dist/apps/api/src/\nrequire('./apps/api/src/main');\n",
);
