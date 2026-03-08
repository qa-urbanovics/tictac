const STATS_KEY = 'ttu_stats_v1';
const SETTINGS_KEY = 'ttu_settings_v1';

const defaultStats = {
  pvp: { x: 0, o: 0, draws: 0, games: 0 },
  ai: { player: 0, ai: 0, draws: 0, games: 0 }
};

const defaultSettings = {
  theme: 'neon-dark'
};

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function getStats() {
  const stats = safeParse(localStorage.getItem(STATS_KEY), defaultStats);
  return structuredClone ? structuredClone(stats) : JSON.parse(JSON.stringify(stats));
}

export function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordResult(mode, winner) {
  const stats = getStats();
  const bucket = mode === 'pvp' ? stats.pvp : stats.ai;
  bucket.games += 1;

  if (winner === 'draw') {
    bucket.draws += 1;
  } else if (mode === 'pvp') {
    if (winner === 'X') bucket.x += 1;
    if (winner === 'O') bucket.o += 1;
  } else {
    if (winner === 'X') bucket.player += 1;
    if (winner === 'O') bucket.ai += 1;
  }

  saveStats(stats);
  return stats;
}

export function resetStats() {
  saveStats(defaultStats);
  return getStats();
}

export function getSettings() {
  const settings = safeParse(localStorage.getItem(SETTINGS_KEY), defaultSettings);
  return { ...defaultSettings, ...settings };
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...getSettings(), ...settings }));
}
