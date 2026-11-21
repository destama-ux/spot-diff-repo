// Moonmarket Twins — hand-in program (Node 22, standard library only).
//
// The game itself is the static site in game/ (index.html plus its ES modules and
// stylesheet; no build step, no network). This program delivers it: it copies
// game/ and screenshots/ from beside this file into the output directory and
// writes dossier.json there with buildDossier from the vendored make.fun
// library, exactly as the bounty requires. The grader runs it twice and both
// runs must produce the same bytes, so nothing here depends on the clock, on
// randomness or on anything outside this repository.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outputDir, 'game'), { recursive: true });

const shotsOut = join(outputDir, 'screenshots');
mkdirSync(shotsOut, { recursive: true });
const shotsIn = join(repoRoot, 'screenshots');
if (existsSync(shotsIn)) cpSync(shotsIn, shotsOut, { recursive: true });

// The sealed scorer's caps, mirrored so an over-limit entry is refused here
// first: at most 4 screenshots of 256 KiB each, at most 993 files and 48 MiB
// under game/, no game/ path over 1,000 UTF-8 bytes, dossier text capped at
// 160 KiB and the dossier itself at 1.5 MiB.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log(`Moonmarket Twins handed in to ${outputDir}`);
