// loupe.js — the magnifier: a round lens that follows the mouse over either
// picture and shows that spot at twice the size, so small differences are
// easier to compare. It draws straight onto the picture's own canvas, on top
// of the frame the game just painted.

export const LOUPE_RADIUS = 72;
const ZOOM = 2;

/**
 * Draw the lens on ctx at (x, y), magnifying the cached scene bitmap.
 * bitmap is the offscreen canvas the game rendered the scene to, in the
 * same 600 by 450 picture space the pointer coordinates use.
 */
export function drawLoupe(ctx, bitmap, x, y) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, LOUPE_RADIUS, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#0d0a18';
  ctx.fillRect(x - LOUPE_RADIUS, y - LOUPE_RADIUS, LOUPE_RADIUS * 2, LOUPE_RADIUS * 2);
  const sourceSize = LOUPE_RADIUS / ZOOM;
  ctx.drawImage(
    bitmap,
    x - sourceSize, y - sourceSize, sourceSize * 2, sourceSize * 2,
    x - LOUPE_RADIUS, y - LOUPE_RADIUS, LOUPE_RADIUS * 2, LOUPE_RADIUS * 2,
  );
  ctx.restore();
  // The rim and a fine crosshair.
  ctx.strokeStyle = 'rgba(255, 240, 200, 0.95)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, LOUPE_RADIUS, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(20, 14, 30, 0.55)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x + 10, y);
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x, y + 10);
  ctx.stroke();
}
