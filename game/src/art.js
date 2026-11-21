// art.js — small canvas drawing helpers shared by every scene painter.
// Everything is drawn with plain Canvas 2D shapes in fixed positions, so a
// scene renders identically on every run and on every machine.

/** Fill the whole picture with a vertical gradient through the given stops. */
export function paintSky(ctx, width, height, stops) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  for (const [at, colour] of stops) gradient.addColorStop(at, colour);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/** A filled circle. */
export function disc(ctx, x, y, radius, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/** A four-point sparkle star, the kind that twinkles in a night sky. */
export function sparkle(ctx, x, y, radius, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);
  ctx.quadraticCurveTo(x, y, x - radius, y);
  ctx.quadraticCurveTo(x, y, x, y - radius);
  ctx.fill();
}

/** A tiny round star dot. */
export function starDot(ctx, x, y, radius, colour) {
  disc(ctx, x, y, radius, colour);
}

/** The moon: phase 0 is a full disc, phase 1 a crescent cut by the sky colour. */
export function moon(ctx, x, y, radius, crescent, skyColour) {
  disc(ctx, x, y, radius, '#f7ead0');
  disc(ctx, x - radius * 0.28, y - radius * 0.18, radius * 0.14, '#e8d5ae');
  disc(ctx, x + radius * 0.3, y + radius * 0.32, radius * 0.1, '#e8d5ae');
  if (crescent) {
    disc(ctx, x + radius * 0.52, y - radius * 0.22, radius * 0.86, skyColour);
  }
}

/** A hanging paper lantern on a short string, glowing when lit. */
export function lantern(ctx, x, y, colour, lit = true) {
  ctx.strokeStyle = 'rgba(20,16,32,0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 26);
  ctx.lineTo(x, y - 12);
  ctx.stroke();
  if (lit) {
    const glow = ctx.createRadialGradient(x, y, 2, x, y, 30);
    glow.addColorStop(0, 'rgba(255,214,140,0.55)');
    glow.addColorStop(1, 'rgba(255,214,140,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#3a2b20';
  ctx.fillRect(x - 7, y - 15, 14, 5);
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, 13, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(58,32,16,0.55)';
  ctx.lineWidth = 1;
  for (const off of [-7, 0, 7]) {
    ctx.beginPath();
    ctx.ellipse(x + off, y, 5.5, 15.4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#3a2b20';
  ctx.fillRect(x - 7, y + 13, 14, 4);
  ctx.strokeStyle = '#c9403d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + 17);
  ctx.lineTo(x, y + 24);
  ctx.stroke();
}

/** A simple seagull: two arcs meeting at the body. */
export function gull(ctx, x, y, size, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - size * 0.55, y, size * 0.55, Math.PI * 1.15, Math.PI * 1.95);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + size * 0.55, y, size * 0.55, Math.PI * 1.05, Math.PI * 1.85);
  ctx.stroke();
}

/** A pine tree with three layered tiers; snow dusts the tiers when snowy. */
export function pineTree(ctx, x, groundY, height, green, snowy) {
  const width = height * 0.52;
  ctx.fillStyle = '#5a4230';
  ctx.fillRect(x - height * 0.035, groundY - height * 0.12, height * 0.07, height * 0.12);
  for (let tier = 0; tier < 3; tier += 1) {
    const tierWidth = width * (1 - tier * 0.24);
    const tierTop = groundY - height * (0.32 + tier * 0.24);
    const tierBottom = groundY - height * (0.06 + tier * 0.2);
    ctx.fillStyle = green;
    ctx.beginPath();
    ctx.moveTo(x, tierTop);
    ctx.lineTo(x - tierWidth / 2, tierBottom);
    ctx.lineTo(x + tierWidth / 2, tierBottom);
    ctx.closePath();
    ctx.fill();
    if (snowy) {
      ctx.fillStyle = 'rgba(245,249,252,0.9)';
      ctx.beginPath();
      ctx.moveTo(x, tierTop);
      ctx.lineTo(x - tierWidth * 0.2, tierTop + height * 0.13);
      ctx.lineTo(x + tierWidth * 0.2, tierTop + height * 0.13);
      ctx.closePath();
      ctx.fill();
    }
  }
}

/** Path for a rectangle with rounded corners (fill or stroke afterwards). */
export function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
