// main.js — boots Moonmarket Twins: builds the game over the two canvases,
// wires mouse, touch and keyboard input, keeps the HUD honest and runs the
// frame loop. Also stages the frozen states the screenshots are taken from
// when the page is opened with a ?shot= query (see shots.js).

import { SpotGame } from './play.js';
import { SCENES } from './scenes.js';
import { readShotConfig } from './shots.js';
import { playGameClear } from './sound.js';

const $ = (id) => document.getElementById(id);
const leftCanvas = $('leftPicture');
const rightCanvas = $('rightPicture');

const hud = {
  scene: $('hudScene'),
  found: $('hudFound'),
  toGo: $('hudToGo'),
  time: $('hudTime'),
  score: $('hudScore'),
  misses: $('hudMisses'),
  name: $('sceneName'),
  tag: $('sceneTag'),
  message: $('message'),
};

let scenesCleared = 0;

const game = new SpotGame(leftCanvas.getContext('2d'), rightCanvas.getContext('2d'), {
  onFound(diff) {
    say(`Found one — ${diff.label}. ${game.remaining} to go.`);
    refreshHud();
  },
  onMiss() {
    say('Not a difference — look again. A miss costs 15 points.');
    refreshHud();
  },
  onHint() {
    say('A difference hides inside the pulsing rings. A hint costs 30 points.');
    refreshHud();
  },
  onSceneComplete() {
    scenesCleared += 1;
    refreshHud();
    if (game.sceneIndex === SCENES.length - 1) {
      $('gameOverlayText').textContent =
        `All three scenes cleared. Final score ${game.score} — thanks for playing Moonmarket Twins.`;
      show('gameOverlay');
      playGameClear();
    } else {
      $('sceneOverlayText').textContent =
        `${game.scene.name} cleared with ${game.misses} miss${game.misses === 1 ? '' : 'es'}. Score so far: ${game.score}.`;
      show('sceneOverlay');
    }
  },
});

function say(text) {
  hud.message.textContent = text;
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function refreshHud() {
  const s = game.summary();
  hud.scene.textContent = `Scene ${s.sceneIndex + 1} of ${SCENES.length}`;
  hud.found.textContent = `Found ${s.found} of ${s.total}`;
  hud.toGo.textContent = `${s.remaining} TO GO`;
  hud.score.textContent = `Score ${s.score}`;
  hud.misses.textContent = `Misses ${s.misses}`;
  hud.name.textContent = s.sceneName;
  hud.tag.textContent = game.scene.tagline;
  document.querySelectorAll('.scene-dot').forEach((dot, i) => {
    dot.classList.toggle('current', i === s.sceneIndex);
  });
}

function show(id) {
  for (const overlay of ['startOverlay', 'sceneOverlay', 'gameOverlay']) {
    $(overlay).classList.toggle('visible', overlay === id);
  }
}

function hideOverlays() {
  show('none');
}

/* ---------------- input: mouse and touch ---------------- */

function pictureCoords(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
}

for (const [side, canvas] of [[0, leftCanvas], [1, rightCanvas]]) {
  canvas.addEventListener('pointermove', (event) => {
    const { x, y } = pictureCoords(canvas, event);
    game.pointer = { side, x, y, inside: true };
  });
  canvas.addEventListener('pointerleave', () => {
    game.pointer.inside = false;
  });
  canvas.addEventListener('pointerdown', (event) => {
    const { x, y } = pictureCoords(canvas, event);
    game.handlePoint(side, x, y);
    refreshHud();
  });
}

/* ---------------- input: keyboard ---------------- */

window.addEventListener('keydown', (event) => {
  const step = event.shiftKey ? 24 : 10;
  switch (event.key) {
    case 'ArrowLeft': game.moveCursor(-step, 0); break;
    case 'ArrowRight': game.moveCursor(step, 0); break;
    case 'ArrowUp': game.moveCursor(0, -step); break;
    case 'ArrowDown': game.moveCursor(0, step); break;
    case 'Enter':
    case ' ':
      game.spotAtCursor();
      refreshHud();
      break;
    case 'h': case 'H': game.useHint(); break;
    case 'm': case 'M': toggleLoupe(); break;
    case 'r': case 'R': game.restart(); say('Scene restarted.'); refreshHud(); break;
    case 'n': case 'N': goNext(); break;
    default: return;
  }
  if (event.key.startsWith('Arrow') || event.key === ' ') event.preventDefault();
});

/* ---------------- buttons and overlays ---------------- */

function toggleLoupe() {
  game.loupeOn = !game.loupeOn;
  $('loupeButton').classList.toggle('active', game.loupeOn);
  say(game.loupeOn ? 'Magnifier on — move the mouse over a picture.' : 'Magnifier off.');
}

function goNext() {
  if (game.sceneIndex < SCENES.length - 1) {
    game.setScene(game.sceneIndex + 1);
    hideOverlays();
    say(`Scene ${game.sceneIndex + 1}: ${game.scene.name}. Find the 7 differences.`);
    refreshHud();
  }
}

$('hintButton').addEventListener('click', () => game.useHint());
$('loupeButton').addEventListener('click', toggleLoupe);
$('restartButton').addEventListener('click', () => { game.restart(); say('Scene restarted.'); refreshHud(); });
$('startButton').addEventListener('click', () => { hideOverlays(); say('Find the 7 differences between the two pictures.'); });
$('nextButton').addEventListener('click', goNext);
$('againButton').addEventListener('click', () => {
  scenesCleared = 0;
  game.score = 0;
  game.setScene(0);
  hideOverlays();
  say('A fresh run. Find the 7 differences.');
  refreshHud();
});
document.querySelectorAll('.scene-dot').forEach((dot, i) => {
  dot.addEventListener('click', () => {
    game.setScene(i);
    hideOverlays();
    say(`Scene ${i + 1}: ${game.scene.name}. Find the 7 differences.`);
    refreshHud();
  });
});

/* ---------------- screenshot staging, then the frame loop ---------------- */

const shot = readShotConfig(window.location.search);
if (shot) {
  game.setScene(shot.scene);
  game.stageFound(shot.found, shot.elapsed);
  if (shot.win) {
    scenesCleared = SCENES.length;
    $('gameOverlayText').textContent =
      `All three scenes cleared. Final score ${game.score} — thanks for playing Moonmarket Twins.`;
    show('gameOverlay');
  } else {
    hideOverlays();
    say(`${shot.found} differences already found — ${game.remaining} to go.`);
  }
} else {
  show('startOverlay');
}
refreshHud();

function frame(now) {
  game.tick(now);
  game.draw(now);
  hud.time.textContent = `Time ${formatTime(Math.floor(game.elapsed))}`;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
