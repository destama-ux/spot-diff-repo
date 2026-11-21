// shots.js — screenshot staging. With ?shot=play or ?shot=win in the URL the
// game opens on a fixed, frozen mid-game state instead of the start overlay,
// so the maker's screenshots are real renders of the game in known states:
// the same scene, the same differences found, the same clock, every time.
//   ?shot=play&scene=0&found=3   third scene's neighbour states work too
//   ?shot=win&scene=2            the last scene, complete

export function readShotConfig(search) {
  const params = new URLSearchParams(search);
  const shot = params.get('shot');
  if (shot !== 'play' && shot !== 'win') return null;
  const scene = Math.min(2, Math.max(0, Number(params.get('scene') ?? 0) || 0));
  if (shot === 'win') return { scene, found: 7, elapsed: 132, win: true };
  const found = Math.min(6, Math.max(1, Number(params.get('found') ?? 3) || 3));
  return { scene, found, elapsed: 41 + scene * 9 + found * 3, win: false };
}
