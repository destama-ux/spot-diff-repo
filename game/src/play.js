// play.js — the spot-the-difference game itself: state, scoring, input and
// the per-frame drawing of both pictures, their markers and the loupe.
// The scene art is painted once per scene onto offscreen bitmaps; each frame
// then only stamps those bitmaps and draws the moving parts on top.

import { PICTURE_HEIGHT, PICTURE_WIDTH, SCENES } from './scenes.js';
import { drawLoupe } from './loupe.js';
import { playFound, playMiss, playSceneClear } from './sound.js';

export const POINTS_PER_FIND = 100;
export const HINT_COST = 30;
export const MISS_COST = 15;
export const CLEAR_BONUS_CAP = 240;

export class SpotGame {
  /**
   * hooks: { onFound(diff), onMiss(), onHint(diff), onSceneComplete(summary) }
   * — main.js uses them to refresh the HUD, the message line and overlays.
   */
  constructor(leftCtx, rightCtx, hooks) {
    this.ctxs = [leftCtx, rightCtx];
    this.hooks = hooks;
    this.sceneIndex = 0;
    this.score = 0;
    this.cursor = { x: PICTURE_WIDTH / 2, y: PICTURE_HEIGHT / 2, active: false };
    this.pointer = { side: 1, x: 0, y: 0, inside: false };
    this.loupeOn = false;
    this.setScene(0);
  }

  get scene() {
    return SCENES[this.sceneIndex];
  }

  get remaining() {
    return this.scene.differences.length - this.found.size;
  }

  get complete() {
    return this.remaining === 0;
  }

  /** Load a scene fresh: new bitmaps, nothing found, clock at zero, running. */
  setScene(index) {
    this.sceneIndex = index;
    this.found = new Set();
    this.misses = 0;
    this.elapsed = 0;
    this.running = true;
    this.hintPulse = null;
    this.missMarks = [];
    this.lastTick = null;
    this.bitmaps = [false, true].map((altered) => {
      const bitmap = document.createElement('canvas');
      bitmap.width = PICTURE_WIDTH;
      bitmap.height = PICTURE_HEIGHT;
      this.scene.paint(bitmap.getContext('2d'), altered);
      return bitmap;
    });
  }

  /** Restart the current scene, keeping the total score. */
  restart() {
    this.setScene(this.sceneIndex);
  }

  /** Advance the clock; called every animation frame with a timestamp. */
  tick(now) {
    if (this.lastTick === null) this.lastTick = now;
    const dt = Math.min(0.1, (now - this.lastTick) / 1000);
    this.lastTick = now;
    if (this.running && !this.complete) this.elapsed += dt;
  }

  /**
   * A click (or a keyboard spot) at picture coordinates on one side.
   * Returns 'found', 'miss' or 'ignored'.
   */
  handlePoint(side, x, y) {
    if (!this.running || this.complete) return 'ignored';
    const diffs = this.scene.differences;
    for (let i = 0; i < diffs.length; i += 1) {
      if (this.found.has(i)) continue;
      const d = diffs[i];
      const dist = Math.hypot(x - d.x, y - d.y);
      if (dist <= Math.max(d.r, 20)) {
        this.found.add(i);
        this.score += POINTS_PER_FIND;
        playFound();
        this.hooks.onFound(d);
        if (this.complete) {
          this.score += Math.max(0, CLEAR_BONUS_CAP - Math.floor(this.elapsed));
          playSceneClear();
          this.hooks.onSceneComplete(this.summary());
        }
        return 'found';
      }
    }
    this.misses += 1;
    this.score = Math.max(0, this.score - MISS_COST);
    this.missMarks.push({ side, x, y, until: performance.now() + 650 });
    playMiss();
    this.hooks.onMiss();
    return 'miss';
  }

  /** Pulse the first unfound difference on both pictures, for a price. */
  useHint() {
    if (!this.running || this.complete) return;
    const next = this.scene.differences.findIndex((_, i) => !this.found.has(i));
    if (next === -1) return;
    this.score = Math.max(0, this.score - HINT_COST);
    this.hintPulse = { index: next, until: performance.now() + 1600 };
    this.hooks.onHint(this.scene.differences[next]);
  }

  /** Move the keyboard crosshair; it is mirrored on both pictures. */
  moveCursor(dx, dy) {
    this.cursor.active = true;
    this.cursor.x = Math.min(PICTURE_WIDTH - 4, Math.max(4, this.cursor.x + dx));
    this.cursor.y = Math.min(PICTURE_HEIGHT - 4, Math.max(4, this.cursor.y + dy));
  }

  /** Spot at the keyboard crosshair (judged on the changed twin). */
  spotAtCursor() {
    this.cursor.active = true;
    return this.handlePoint(1, this.cursor.x, this.cursor.y);
  }

  /** Stage a screenshot state: some differences already found, clock frozen. */
  stageFound(count, elapsedSeconds) {
    this.found = new Set();
    for (let i = 0; i < count; i += 1) this.found.add(i);
    this.elapsed = elapsedSeconds;
    this.running = false;
    this.score = count * POINTS_PER_FIND;
  }

  /** A plain summary of where the player stands, for the HUD and overlays. */
  summary() {
    return {
      sceneIndex: this.sceneIndex,
      sceneName: this.scene.name,
      found: this.found.size,
      total: this.scene.differences.length,
      remaining: this.remaining,
      misses: this.misses,
      score: this.score,
      elapsed: Math.floor(this.elapsed),
      complete: this.complete,
    };
  }

  /** Draw both pictures and everything that moves on top of them. */
  draw(now) {
    for (let side = 0; side < 2; side += 1) {
      const ctx = this.ctxs[side];
      ctx.drawImage(this.bitmaps[side], 0, 0);
      this.drawMarkers(ctx, now);
      this.drawMissMarks(ctx, now);
      if (this.hintPulse && now < this.hintPulse.until) this.drawHintPulse(ctx, now);
      if (this.cursor.active) this.drawCursor(ctx);
      if (this.loupeOn && this.pointer.inside && this.pointer.side === side) {
        drawLoupe(ctx, this.bitmaps[side], this.pointer.x, this.pointer.y);
      }
    }
  }

  /** Gold rings around every difference found so far. */
  drawMarkers(ctx, now) {
    const pulse = Math.sin(now / 300) * 1.6;
    for (const i of this.found) {
      const d = this.scene.differences[i];
      ctx.strokeStyle = 'rgba(24,16,8,0.75)';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r + 4 + pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#ffd23e';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r + 4 + pulse, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  /** Red crosses where the player clicked wrong, fading out. */
  drawMissMarks(ctx, now) {
    this.missMarks = this.missMarks.filter((m) => now < m.until);
    for (const m of this.missMarks) {
      const ctxForSide = this.ctxs[m.side];
      if (ctxForSide !== ctx) continue;
      const alpha = Math.min(1, (m.until - now) / 650);
      ctx.strokeStyle = `rgba(230, 52, 44, ${alpha})`;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(m.x - 10, m.y - 10);
      ctx.lineTo(m.x + 10, m.y + 10);
      ctx.moveTo(m.x + 10, m.y - 10);
      ctx.lineTo(m.x - 10, m.y + 10);
      ctx.stroke();
    }
  }

  /** Expanding rings that give away one difference's neighbourhood. */
  drawHintPulse(ctx, now) {
    const d = this.scene.differences[this.hintPulse.index];
    const phase = 1 - (this.hintPulse.until - now) / 1600;
    for (const extra of [0, 14]) {
      ctx.strokeStyle = 'rgba(64, 200, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r + 6 + phase * 26 + extra, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  /** The keyboard crosshair: a fine circle with a dot. */
  drawCursor(ctx) {
    const { x, y } = this.cursor;
    ctx.strokeStyle = 'rgba(255, 240, 200, 0.95)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 13, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 240, 200, 0.95)';
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}
