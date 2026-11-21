// scenes.js — the three pictures of Moonmarket Twins and their differences.
// Each scene paints itself twice from the same code: paint(ctx, false) draws
// the original and paint(ctx, true) draws the changed twin, with exactly the
// differences listed in the scene's `differences` array altered. Positions are
// fixed numbers, so both pictures are identical on every run. Picture space
// is 600 by 450 for every scene.

import { disc, gull, lantern, moon, paintSky, pineTree, roundedRect, sparkle, starDot } from './art.js';

const W = 600;
const H = 450;

/* ------------------------------------------------------------------ */
/* Scene 1 — the Ember Night Market                                    */
/* ------------------------------------------------------------------ */

const MARKET_STARS = [
  [36, 40], [150, 26], [228, 52], [300, 30], [392, 44], [452, 24], [548, 96],
  [70, 110], [262, 88], [420, 96], [566, 150], [24, 168], [338, 66], [180, 140],
];

function paintMarket(ctx, altered) {
  paintSky(ctx, W, H, [[0, '#241d47'], [0.45, '#5c3060'], [0.75, '#b3503f'], [1, '#7a3b34']]);
  for (const [x, y] of MARKET_STARS) starDot(ctx, x, y, 1.6, 'rgba(255,244,214,0.85)');
  sparkle(ctx, 452, 130, 7, 'rgba(255,244,214,0.9)');
  if (!altered) sparkle(ctx, 505, 58, 9, '#fff3c4'); // difference 4: the bright star

  // The moon: full in the original, a crescent in the twin. The crescent's
  // shadow is filled with the same sky gradient, so it melts into the sky.
  disc(ctx, 88, 68, 26, '#f7ead0');
  disc(ctx, 80, 62, 5, '#e8d5ae');
  disc(ctx, 96, 76, 4, '#e8d5ae');
  if (altered) {
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#241d47');
    sky.addColorStop(0.45, '#5c3060');
    sky.addColorStop(0.75, '#b3503f');
    sky.addColorStop(1, '#7a3b34');
    ctx.fillStyle = sky;
    ctx.beginPath();
    ctx.arc(102, 58, 23, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rooftop silhouettes on the horizon.
  ctx.fillStyle = '#1d1738';
  ctx.beginPath();
  ctx.moveTo(0, 268);
  ctx.lineTo(0, 232); ctx.lineTo(52, 232); ctx.lineTo(78, 210); ctx.lineTo(104, 232);
  ctx.lineTo(196, 232); ctx.lineTo(224, 216); ctx.lineTo(252, 232); ctx.lineTo(348, 232);
  ctx.lineTo(376, 212); ctx.lineTo(404, 232); ctx.lineTo(492, 232); ctx.lineTo(520, 218);
  ctx.lineTo(548, 232); ctx.lineTo(600, 232); ctx.lineTo(600, 268);
  ctx.closePath();
  ctx.fill();

  // Lantern wire and its five lanterns.
  ctx.strokeStyle = 'rgba(16,12,28,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(28, 58);
  ctx.quadraticCurveTo(300, 128, 572, 52);
  ctx.stroke();
  const wireLanterns = [
    [111, 102, '#e2543e'], [216, 115, '#f2a541'], [316, 117, '#f2a541'],
    [420, 109, '#e2543e'], [513, 92, '#f2a541'],
  ];
  for (const [x, y, colour] of wireLanterns) {
    const shown = altered && x === 316 ? '#35b5ac' : colour; // difference 2: amber turns teal
    lantern(ctx, x, y, shown);
  }

  // Pennant wire with eight flags, sampled along the same sagging curve.
  ctx.beginPath();
  ctx.moveTo(56, 148);
  ctx.quadraticCurveTo(300, 186, 544, 142);
  ctx.stroke();
  const flagColours = ['#e2543e', '#f2c14e', '#3fa7a0', '#e2543e', '#f2c14e', '#3fa7a0', '#e2543e', '#f2c14e'];
  for (let i = 0; i < 8; i += 1) {
    const t = (i + 0.5) / 8;
    const x = (1 - t) * (1 - t) * 56 + 2 * (1 - t) * t * 300 + t * t * 544;
    const y = (1 - t) * (1 - t) * 148 + 2 * (1 - t) * t * 186 + t * t * 142;
    const colour = altered && i === 3 ? '#3d6fd1' : flagColours[i]; // difference 6: red turns blue
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(x - 11, y);
    ctx.lineTo(x + 11, y);
    ctx.lineTo(x, y + 17);
    ctx.closePath();
    ctx.fill();
  }

  paintMarketStall(ctx, 36, '#c9403d', true, altered);
  paintMarketStall(ctx, 368, '#2e7f79', false, altered);

  // A crate of oranges in front of the right stall: five, or four.
  ctx.fillStyle = '#8a5a2c';
  ctx.fillRect(490, 378, 68, 28);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(490, 390, 68, 3);
  const oranges = [[502, 374], [524, 374], [546, 374], [513, 360], [535, 360]];
  oranges.forEach(([ox, oy], i) => {
    if (altered && i === 4) return; // difference 7: one orange is gone
    disc(ctx, ox, oy, 10, '#f08c2e');
    disc(ctx, ox - 3, oy - 3, 3, 'rgba(255,220,160,0.7)');
  });

  // The cat asleep on the left awning (gone in the twin).
  if (!altered) {
    ctx.fillStyle = '#191426';
    ctx.beginPath();
    ctx.ellipse(150, 243, 24, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    disc(ctx, 172, 236, 10, '#191426');
    ctx.beginPath();
    ctx.moveTo(165, 230); ctx.lineTo(163, 219); ctx.lineTo(171, 226);
    ctx.moveTo(176, 228); ctx.lineTo(180, 218); ctx.lineTo(183, 229);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#191426';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(127, 244);
    ctx.quadraticCurveTo(112, 236, 118, 226);
    ctx.stroke();
  }

  // Ground: dark stones with warm light pooled under the stalls.
  ctx.fillStyle = '#241a30';
  ctx.fillRect(0, 372, W, H - 372);
  ctx.fillStyle = 'rgba(255,170,90,0.10)';
  ctx.beginPath();
  ctx.ellipse(140, 396, 130, 22, 0, 0, Math.PI * 2);
  ctx.ellipse(466, 396, 130, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  for (const [x, y] of [[60, 420], [180, 434], [300, 418], [430, 436], [540, 420], [240, 402], [380, 404]]) {
    ctx.beginPath();
    ctx.ellipse(x, y, 16, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** One market stall: striped awning, posts, counter and its goods. */
function paintMarketStall(ctx, x, awning, isLeft, altered) {
  // Awning.
  for (let i = 0; i < 6; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? awning : '#f3e5cf';
    ctx.beginPath();
    ctx.moveTo(x + i * 32, 258);
    ctx.lineTo(x + i * 32 + 32, 258);
    ctx.lineTo(x + i * 32 + 26, 282);
    ctx.lineTo(x + i * 32 + 6, 282);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(x, 280, 192, 4);
  // Posts and counter.
  ctx.fillStyle = '#4a3220';
  ctx.fillRect(x + 6, 282, 8, 92);
  ctx.fillRect(x + 178, 282, 8, 92);
  ctx.fillStyle = '#6b4630';
  ctx.fillRect(x - 4, 330, 200, 14);
  ctx.fillStyle = '#54382a';
  ctx.fillRect(x - 4, 344, 200, 30);
  if (isLeft) {
    // A pyramid of apples and two jars on the left counter.
    const apples = [[26, 322], [48, 322], [70, 322], [37, 306], [59, 306], [48, 290]];
    for (const [ax, ay] of apples) disc(ctx, x + ax, ay, 10, '#c93b3b');
    disc(ctx, x + 37, 300, 3, '#7a4a22');
    for (const jx of [128, 156]) {
      ctx.fillStyle = '#d9a441';
      roundedRect(ctx, x + jx, 300, 20, 30, 4);
      ctx.fill();
      ctx.fillStyle = '#8a5a1d';
      ctx.fillRect(x + jx + 3, 294, 14, 7);
    }
  } else {
    // The right stall: folded cloth bolts, and a teapot that vanishes.
    const bolts = ['#7a4a9e', '#3d6fd1', '#c9403d'];
    bolts.forEach((colour, i) => {
      ctx.fillStyle = colour;
      ctx.save();
      ctx.translate(x + 30 + i * 26, 330);
      ctx.rotate(-0.28);
      ctx.fillRect(-8, -38, 16, 38);
      ctx.restore();
    });
    // The teapot on the counter, there in the original only.
    if (!altered) { // difference 5: the teapot is gone
      const tx = x + 96;
      const ty = 318;
      ctx.fillStyle = '#31435f';
      ctx.beginPath();
      ctx.ellipse(tx, ty, 17, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(tx - 15, ty - 2);
      ctx.lineTo(tx - 26, ty - 10);
      ctx.lineTo(tx - 14, ty + 4);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#31435f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(tx + 19, ty - 1, 7, -1.2, 1.2);
      ctx.stroke();
      ctx.fillRect(tx - 4, ty - 16, 8, 5);
      disc(ctx, tx, ty - 17, 3, '#31435f');
    }
  }
}

/* ------------------------------------------------------------------ */
/* Scene 2 — the Harbour at Dusk                                       */
/* ------------------------------------------------------------------ */

function paintHarbour(ctx, altered) {
  paintSky(ctx, W, H, [[0, '#ffe3ae'], [0.4, '#f9b26b'], [0.62, '#e88ca0'], [0.78, '#8d7bb5'], [1, '#5d5a9e']]);
  // The low sun and its path on the water come later; clouds first.
  cloud(ctx, 300, 58, 1.1, 'rgba(255,246,230,0.95)');
  cloud(ctx, 468, 118, 0.85, 'rgba(255,238,222,0.9)');
  if (!altered) cloud(ctx, 110, 88, 0.8, 'rgba(255,246,230,0.95)'); // difference 6: the small cloud
  disc(ctx, 118, 232, 30, '#ffdf9e');
  disc(ctx, 118, 232, 38, 'rgba(255,205,120,0.35)');

  // The sea.
  const sea = ctx.createLinearGradient(0, 262, 0, H);
  sea.addColorStop(0, '#4a7bab');
  sea.addColorStop(1, '#26466e');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 262, W, H - 262);
  ctx.strokeStyle = 'rgba(255,230,180,0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 9; i += 1) {
    const y = 286 + i * 18;
    const x = 96 + ((i * 53) % 60) - 30;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 44 - i * 2, y);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(220,238,255,0.35)';
  for (const [x, y, len] of [[300, 300, 40], [420, 330, 52], [180, 356, 36], [520, 300, 30], [60, 330, 44], [350, 396, 58], [150, 410, 48]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y);
    ctx.stroke();
  }

  // Distant headland on the left.
  ctx.fillStyle = '#4c4470';
  ctx.beginPath();
  ctx.moveTo(0, 262);
  ctx.lineTo(0, 226);
  ctx.quadraticCurveTo(60, 204, 128, 232);
  ctx.quadraticCurveTo(170, 248, 196, 262);
  ctx.closePath();
  ctx.fill();

  // Rocky point and the lighthouse on the right.
  ctx.fillStyle = '#3d3658';
  ctx.beginPath();
  ctx.moveTo(428, 450);
  ctx.lineTo(452, 330); ctx.lineTo(478, 292); ctx.lineTo(540, 292);
  ctx.lineTo(566, 336); ctx.lineTo(600, 372); ctx.lineTo(600, 450);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  ctx.beginPath();
  ctx.moveTo(478, 292); ctx.lineTo(540, 292); ctx.lineTo(552, 318); ctx.lineTo(466, 318);
  ctx.closePath();
  ctx.fill();
  paintLighthouse(ctx, altered);

  // The sailboat.
  paintSailboat(ctx, altered);

  // A small rowboat.
  ctx.fillStyle = '#7a4a2c';
  ctx.beginPath();
  ctx.moveTo(308, 372);
  ctx.lineTo(366, 372);
  ctx.lineTo(354, 390);
  ctx.lineTo(318, 390);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5d3a20';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(330, 366);
  ctx.lineTo(312, 348);
  ctx.stroke();

  // Gulls.
  gull(ctx, 352, 104, 13, '#fff6e8');
  gull(ctx, 92, 142, 11, '#fff6e8');
  if (!altered) gull(ctx, 300, 80, 12, '#fff6e8'); // difference 4: the high gull

  // The buoy: red in the original, green in the twin.
  ctx.fillStyle = altered ? '#2f9e6e' : '#d23c2e'; // difference 5
  ctx.beginPath();
  ctx.moveTo(380, 356);
  ctx.lineTo(404, 356);
  ctx.lineTo(398, 378);
  ctx.lineTo(386, 378);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2c2c34';
  ctx.fillRect(390, 342, 4, 14);
  disc(ctx, 392, 340, 4, '#ffd76e');
}

/** A puffy cloud drawn from overlapping discs. */
function cloud(ctx, x, y, scale, colour) {
  ctx.fillStyle = colour;
  disc(ctx, x, y, 20 * scale, colour);
  disc(ctx, x + 22 * scale, y + 3 * scale, 15 * scale, colour);
  disc(ctx, x - 22 * scale, y + 4 * scale, 14 * scale, colour);
  disc(ctx, x + 4 * scale, y - 9 * scale, 14 * scale, colour);
}

/** The lighthouse: a tapered tower in five bands, a lamp room and a beam. */
function paintLighthouse(ctx, altered) {
  const cx = 505;
  const top = 150;
  const bottom = 296;
  const widthAt = (y) => 56 - ((y - top) / (bottom - top)) * 22;
  const bands = [
    [150, 186, '#f4efe4'],
    [186, 208, '#d23c2e'],
    [208, 236, '#f4efe4'],
    [236, 258, altered ? '#f4efe4' : '#d23c2e'], // difference 2: the lower red band
    [258, 296, '#f4efe4'],
  ];
  for (const [y0, y1, colour] of bands) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(cx - widthAt(y0) / 2, y0);
    ctx.lineTo(cx + widthAt(y0) / 2, y0);
    ctx.lineTo(cx + widthAt(y1) / 2, y1);
    ctx.lineTo(cx - widthAt(y1) / 2, y1);
    ctx.closePath();
    ctx.fill();
  }
  // A small window.
  ctx.fillStyle = '#31435f';
  roundedRect(ctx, cx - 5, 214, 10, 14, 3);
  ctx.fill();
  // Gallery and lamp room.
  ctx.fillStyle = '#31435f';
  ctx.fillRect(cx - 24, 140, 48, 8);
  ctx.fillRect(cx - 15, 112, 30, 28);
  ctx.beginPath();
  ctx.moveTo(cx - 19, 112);
  ctx.lineTo(cx, 94);
  ctx.lineTo(cx + 19, 112);
  ctx.closePath();
  ctx.fill();
  if (!altered) {
    // Difference 1: the lamp is lit, throwing a beam across the dusk.
    const beam = ctx.createLinearGradient(cx - 14, 126, cx - 210, 100);
    beam.addColorStop(0, 'rgba(255,224,140,0.55)');
    beam.addColorStop(1, 'rgba(255,224,140,0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(cx - 14, 114);
    ctx.lineTo(cx - 214, 82);
    ctx.lineTo(cx - 214, 150);
    ctx.lineTo(cx - 14, 138);
    ctx.closePath();
    ctx.fill();
    disc(ctx, cx, 126, 9, '#ffe98a');
  } else {
    disc(ctx, cx, 126, 9, '#5a6a80');
  }
}

/** The sailboat: hull, mast, two sails and a flag that may vanish. */
function paintSailboat(ctx, altered) {
  const mastX = 176;
  // Hull.
  ctx.fillStyle = '#8a4f2a';
  ctx.beginPath();
  ctx.moveTo(104, 330);
  ctx.lineTo(252, 330);
  ctx.lineTo(232, 356);
  ctx.lineTo(126, 356);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6e3d1f';
  ctx.fillRect(104, 330, 148, 6);
  // Mast and boom.
  ctx.strokeStyle = '#4c3220';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(mastX, 336);
  ctx.lineTo(mastX, 186);
  ctx.stroke();
  // Main sail: plain in the original, striped in the twin.
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath();
  ctx.moveTo(mastX + 5, 196);
  ctx.lineTo(mastX + 5, 322);
  ctx.lineTo(244, 322);
  ctx.closePath();
  ctx.fill();
  if (altered) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(mastX + 5, 196);
    ctx.lineTo(mastX + 5, 322);
    ctx.lineTo(244, 322);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = '#e2703a';
    ctx.fillRect(mastX, 252, 260, 20); // difference 3: the coral stripe
    ctx.restore();
  }
  // Jib.
  ctx.fillStyle = '#f3e2c2';
  ctx.beginPath();
  ctx.moveTo(mastX - 5, 204);
  ctx.lineTo(mastX - 5, 322);
  ctx.lineTo(118, 322);
  ctx.closePath();
  ctx.fill();
  // The flag at the masthead.
  if (!altered) {
    ctx.fillStyle = '#d23c2e';
    ctx.beginPath();
    ctx.moveTo(mastX, 186);
    ctx.lineTo(mastX + 22, 192);
    ctx.lineTo(mastX, 199);
    ctx.closePath();
    ctx.fill(); // difference 7: the flag is gone
  }
}

/* ------------------------------------------------------------------ */
/* Scene 3 — the Snowpine Cabin                                        */
/* ------------------------------------------------------------------ */

const SNOWFALL = [
  [30, 40], [88, 96], [140, 30], [196, 74], [238, 22], [286, 110], [330, 44],
  [372, 88], [418, 26], [462, 70], [506, 120], [556, 40], [590, 96], [64, 170],
  [168, 150], [262, 176], [402, 150], [486, 190], [540, 168], [24, 230],
];

function paintCabin(ctx, altered) {
  paintSky(ctx, W, H, [[0, '#9db9dd'], [0.55, '#c9dcef'], [1, '#e8f1f9']]);
  // A pale winter moon, the same in both pictures.
  disc(ctx, 522, 62, 21, '#f6f9fc');
  disc(ctx, 515, 56, 4, '#dde7f0');
  // Distant pine ridge.
  ctx.fillStyle = '#7d99b8';
  ctx.beginPath();
  ctx.moveTo(0, 312);
  for (let x = 0; x <= W; x += 40) {
    ctx.lineTo(x + 20, 268 + ((x * 37) % 23));
    ctx.lineTo(x + 40, 312);
  }
  ctx.lineTo(W, 312);
  ctx.closePath();
  ctx.fill();
  // Snow ground with soft drifts.
  ctx.fillStyle = '#f4f8fc';
  ctx.fillRect(0, 306, W, H - 306);
  ctx.fillStyle = '#ffffff';
  for (const [x, y, rx] of [[90, 330, 130], [300, 352, 170], [520, 336, 140], [180, 420, 200], [460, 428, 180]]) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(170,195,225,0.5)';
  for (const [x, y] of [[70, 386], [210, 366], [388, 392], [540, 380], [320, 424]]) {
    ctx.beginPath();
    ctx.ellipse(x, y, 22, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  pineTree(ctx, 44, 330, 118, '#2e5d43', true);
  pineTree(ctx, 104, 320, 80, '#35704e', true);
  pineTree(ctx, 508, 318, 62, '#35704e', true);
  pineTree(ctx, 552, 340, 205, '#2e5d43', true);
  // The star crowning the tall pine.
  if (!altered) sparkle(ctx, 552, 122, 11, '#f2c14e'); // difference 5: the star topper

  paintCabinBody(ctx, altered);

  // The deer at the tree line, there in the original only.
  if (!altered) { // difference 3: the deer is gone
    ctx.fillStyle = '#a97c50';
    ctx.beginPath();
    ctx.ellipse(118, 330, 27, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.translate(140, 322);
    ctx.rotate(0.5);
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    disc(ctx, 152, 302, 9, '#a97c50');
    ctx.beginPath();
    ctx.moveTo(146, 298); ctx.lineTo(138, 288); ctx.lineTo(147, 292);
    ctx.moveTo(156, 296); ctx.lineTo(158, 285); ctx.lineTo(162, 294);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#8a6240';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 295); ctx.lineTo(146, 282); ctx.lineTo(140, 278);
    ctx.moveTo(146, 282); ctx.lineTo(150, 276);
    ctx.moveTo(154, 295); ctx.lineTo(156, 281); ctx.lineTo(162, 276);
    ctx.stroke();
    ctx.fillStyle = '#a97c50';
    for (const lx of [100, 112, 128, 138]) ctx.fillRect(lx, 340, 4, 28);
    disc(ctx, 92, 324, 5, '#f4f8fc');
    disc(ctx, 156, 300, 1.8, '#26221e');
  }

  // A fence with a cardinal on it.
  ctx.fillStyle = '#6e5138';
  for (const fx of [16, 52, 88, 124, 160]) ctx.fillRect(fx, 322, 6, 34);
  ctx.fillRect(8, 330, 190, 5);
  ctx.fillRect(8, 344, 190, 5);
  ctx.fillStyle = '#ffffff';
  for (const fx of [16, 52, 88, 124, 160]) ctx.fillRect(fx, 320, 6, 4);
  disc(ctx, 70, 314, 7, '#d23c2e');
  disc(ctx, 75, 307, 5, '#d23c2e');
  ctx.fillStyle = '#d23c2e';
  ctx.beginPath();
  ctx.moveTo(64, 318); ctx.lineTo(54, 326); ctx.lineTo(66, 324);
  ctx.closePath();
  ctx.fill();
  disc(ctx, 76, 306, 1.4, '#26221e');

  // The lamp post by the path: lit in the original, dark in the twin.
  ctx.fillStyle = '#3a3f46';
  ctx.fillRect(428, 250, 6, 118);
  ctx.fillRect(428, 250, 24, 5);
  lantern(ctx, 452, 276, altered ? '#8b98a5' : '#f2a541', !altered); // difference 4

  // The woodpile: three logs, two, and one on top — sometimes.
  const logRows = [
    [[474, 358], [492, 358], [510, 358]],
    [[483, 341], [501, 341]],
    [[492, 324]],
  ];
  logRows.forEach((row, ri) => {
    for (const [lx, ly] of row) {
      if (altered && ri === 2) continue; // difference 6: the top log
      disc(ctx, lx, ly, 9, '#c9a06a');
      ctx.strokeStyle = '#9c7248';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(lx, ly, 6, 0, Math.PI * 2);
      ctx.stroke();
      disc(ctx, lx, ly, 2, '#9c7248');
    }
  });

  // Footprints wandering up to the door.
  if (!altered) { // difference 7: the footprints
    ctx.fillStyle = 'rgba(158,182,208,0.85)';
    for (const [fx, fy, rot] of [[252, 430, 0.4], [266, 412, -0.3], [250, 398, 0.4], [264, 382, -0.3]]) {
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 3.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Falling snow, the same flakes in both pictures.
  for (const [x, y] of SNOWFALL) disc(ctx, x, y, 2, 'rgba(255,255,255,0.85)');
}

/** The cabin itself: log walls, snowy roof, chimney, door and windows. */
function paintCabinBody(ctx, altered) {
  // Chimney and its smoke: three puffs, or two.
  ctx.fillStyle = '#7a7f87';
  ctx.fillRect(344, 168, 24, 48);
  ctx.fillStyle = '#f4f8fc';
  ctx.fillRect(342, 164, 28, 7);
  disc(ctx, 352, 148, 10, 'rgba(255,255,255,0.8)');
  disc(ctx, 361, 128, 13, 'rgba(255,255,255,0.75)');
  if (!altered) disc(ctx, 371, 105, 16, 'rgba(255,255,255,0.65)'); // difference 1: the top puff
  // Roof with snow on its slopes.
  ctx.fillStyle = '#6e4a30';
  ctx.beginPath();
  ctx.moveTo(184, 258);
  ctx.lineTo(290, 194);
  ctx.lineTo(396, 258);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#f7fafc';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(196, 252);
  ctx.lineTo(290, 200);
  ctx.lineTo(384, 252);
  ctx.stroke();
  // Log walls.
  ctx.fillStyle = '#8a6844';
  ctx.fillRect(200, 256, 180, 112);
  ctx.strokeStyle = 'rgba(70,48,26,0.6)';
  ctx.lineWidth = 2;
  for (let y = 272; y < 368; y += 16) {
    ctx.beginPath();
    ctx.moveTo(200, y);
    ctx.lineTo(380, y);
    ctx.stroke();
  }
  ctx.fillStyle = '#75552f';
  ctx.fillRect(200, 256, 8, 112);
  ctx.fillRect(372, 256, 8, 112);
  // Door with a wreath.
  ctx.fillStyle = '#5d3d24';
  ctx.fillRect(272, 296, 36, 72);
  disc(ctx, 302, 334, 2.5, '#f2c14e');
  ctx.strokeStyle = '#2e7d46';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(290, 316, 8, 0, Math.PI * 2);
  ctx.stroke();
  for (const [wx, wy] of [[283, 310], [297, 310], [290, 323]]) disc(ctx, wx, wy, 2.2, '#d23c2e');
  // Windows: the left one always glows; the right one may go dark.
  paintCabinWindow(ctx, 226, true);
  paintCabinWindow(ctx, 330, !altered); // difference 2: the right window
}

/** One cabin window, warm when lit and blue-dark when not. */
function paintCabinWindow(ctx, x, lit) {
  ctx.fillStyle = lit ? '#ffd76e' : '#2c3844';
  ctx.fillRect(x, 288, 30, 34);
  ctx.strokeStyle = '#5d3d24';
  ctx.lineWidth = 3;
  ctx.strokeRect(x, 288, 30, 34);
  ctx.beginPath();
  ctx.moveTo(x + 15, 288);
  ctx.lineTo(x + 15, 322);
  ctx.moveTo(x, 305);
  ctx.lineTo(x + 30, 305);
  ctx.stroke();
  if (lit) {
    ctx.fillStyle = 'rgba(255,160,60,0.25)';
    ctx.beginPath();
    ctx.ellipse(x + 15, 340, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ------------------------------------------------------------------ */
/* The scene registry                                                  */
/* ------------------------------------------------------------------ */

export const PICTURE_WIDTH = W;
export const PICTURE_HEIGHT = H;

export const SCENES = [
  {
    id: 'market',
    name: 'The Ember Night Market',
    tagline: 'Lanterns, market stalls and one very sleepy cat.',
    paint: paintMarket,
    differences: [
      { x: 88, y: 68, r: 30, label: 'the moon turns crescent' },
      { x: 316, y: 117, r: 24, label: 'one lantern turns teal' },
      { x: 150, y: 240, r: 26, label: 'the cat on the awning' },
      { x: 505, y: 58, r: 18, label: 'the brightest star' },
      { x: 464, y: 316, r: 24, label: 'the teapot on the counter' },
      { x: 270, y: 172, r: 18, label: 'one pennant turns blue' },
      { x: 524, y: 374, r: 26, label: 'one orange is missing' },
    ],
  },
  {
    id: 'harbour',
    name: 'The Harbour at Dusk',
    tagline: 'Last light over the water, and the lamp is lit.',
    paint: paintHarbour,
    differences: [
      { x: 505, y: 126, r: 28, label: 'the lighthouse lamp goes out' },
      { x: 505, y: 247, r: 22, label: 'a lighthouse band loses its red' },
      { x: 198, y: 266, r: 34, label: 'a stripe appears on the sail' },
      { x: 300, y: 80, r: 18, label: 'the high gull' },
      { x: 392, y: 360, r: 20, label: 'the buoy turns green' },
      { x: 110, y: 88, r: 28, label: 'the small cloud' },
      { x: 184, y: 192, r: 16, label: 'the masthead flag' },
    ],
  },
  {
    id: 'cabin',
    name: 'The Snowpine Cabin',
    tagline: 'A warm window, deep snow and a quiet visitor.',
    paint: paintCabin,
    differences: [
      { x: 371, y: 105, r: 20, label: 'one puff of chimney smoke' },
      { x: 342, y: 304, r: 20, label: 'the right window goes dark' },
      { x: 122, y: 328, r: 30, label: 'the deer at the tree line' },
      { x: 452, y: 276, r: 20, label: 'the lamp post goes out' },
      { x: 552, y: 122, r: 16, label: 'the star on the tall pine' },
      { x: 492, y: 326, r: 20, label: 'the top log on the woodpile' },
      { x: 256, y: 404, r: 26, label: 'the footprints in the snow' },
    ],
  },
];

