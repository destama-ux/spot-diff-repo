# spot-diff-repo

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/destama-ux/spot-diff-repo/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/destama-ux/spot-diff-repo/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Moonmarket Twins is an original spot-the-difference game that runs entirely
from static files in a desktop browser — no build step, no network requests.
Two near-identical pictures sit side by side; seven things have changed in
the twin, and the player clicks each one in either picture. Found differences
get a gold ring, a big counter shows how many remain, and the clock, score,
misses and hints all count. Three scenes — the Ember Night Market, the
Harbour at Dusk and the Snowpine Cabin — hold 21 differences in all. Play it
with the mouse or the keyboard (arrow keys move a crosshair, Enter spots),
press M for a magnifier loupe that doubles the picture under the cursor, and
H for a hint that pulses one hiding place. Every picture is drawn by the
game's own canvas code and every sound is synthesized live, so the whole
game is its own original work.

The entrypoint `main.ts` (Node 22) hands the game in: it copies `game/` and
`screenshots/` to the output directory and writes `dossier.json` with the
vendored make.fun library in `vendor/makefun-game.ts`. The screenshots in
`screenshots/` are real renders of the game in headless Chrome, staged by the
`?shot=` states listed in `shots.json`.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

To play the game itself, serve `game/` with any static file server (for
example `npx serve game`) and open `index.html` in a desktop browser.

---

<sub>Entered on [make.fun](https://make.fun/?ref=9sgjf964&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
