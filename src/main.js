import './styles.css';
import { getAiMove, getAiMoveWithDifficulty } from './ai.js';
import { createGameState, presets, resetRound, applyMove } from './game.js';
import { getStats, recordResult, resetStats } from './storage.js';
import { t, getLang, setLang, getSupportedLangs, getLangLabel } from './i18n.js';

const state = createGameState();
const app = document.querySelector('#app');
state.lastMove = null;
state.difficulty = 'medium';

const THEME_KEY = 'tictac-theme';
const SOUND_KEY = 'tictac-sound';

let audioModule = null;
async function loadAudio() {
  try {
    audioModule = await import('./audio.js');
    const muted = localStorage.getItem(SOUND_KEY) === 'true';
    audioModule.setMuted(muted);
  } catch {}
}
loadAudio();

function playSound(name) {
  if (!audioModule) return;
  try { audioModule[name]?.(); } catch {}
}

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'auto';
}

function applyTheme(theme) {
  const resolved = theme === 'auto'
    ? window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    : theme;

  document.documentElement.dataset.theme = resolved;
  localStorage.setItem(THEME_KEY, theme);
  state.theme = theme;

  const metas = document.querySelectorAll('meta[name="theme-color"]');
  metas.forEach(meta => {
    if (meta.getAttribute('media')?.includes('dark')) {
      meta.content = '#080B14';
    } else if (meta.getAttribute('media')?.includes('light')) {
      meta.content = '#F2F4F8';
    } else {
      meta.content = resolved === 'light' ? '#F2F4F8' : '#080B14';
    }
  });
}

function logoSvg() {
  return `<svg viewBox="0 0 96 96" class="logo-svg">
    <defs>
      <linearGradient id="gX" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--x)"/>
        <stop offset="100%" stop-color="var(--accent)"/>
      </linearGradient>
      <linearGradient id="gO" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--o)"/>
        <stop offset="100%" stop-color="var(--accent)"/>
      </linearGradient>
    </defs>
    <path d="M28 28 L68 68 M68 28 L28 68" stroke="url(#gX)" stroke-width="11" stroke-linecap="round" fill="none"/>
    <circle cx="70" cy="26" r="11" fill="none" stroke="url(#gO)" stroke-width="7"/>
  </svg>`;
}

function renderMenu() {
  const stats = getStats();
  const s = state.mode === 'pvp' ? stats.pvp : stats.ai;
  const isMuted = localStorage.getItem(SOUND_KEY) === 'true';

  const difficultyHtml = state.mode === 'ai' ? `
    <div class="option-group">
      <label class="option-label">${t('difficulty')}</label>
      <div class="difficulty-row">
        <button class="diff-btn ${state.difficulty === 'easy' ? 'active' : ''}" data-action="set-diff" data-diff="easy">${t('easy')}</button>
        <button class="diff-btn ${state.difficulty === 'medium' ? 'active' : ''}" data-action="set-diff" data-diff="medium">${t('medium')}</button>
        <button class="diff-btn ${state.difficulty === 'hard' ? 'active' : ''}" data-action="set-diff" data-diff="hard">${t('hard')}</button>
      </div>
    </div>` : '';

  app.innerHTML = `
    <div class="app-screen menu-screen">
      <div class="menu-top">
        <div class="logo-mark">${logoSvg()}</div>
        <h1 class="title">TicTac<span>Universe</span></h1>
        <p class="subtitle">${state.mode === 'ai' ? t('playerVsAi') : t('twoPlayers')} \u00b7 ${state.preset.label}</p>
      </div>

      <div class="menu-options">
        <div class="option-group">
          <label class="option-label">${t('mode')}</label>
          <div class="toggle-row">
            <button class="toggle-btn ${state.mode === 'pvp' ? 'active' : ''}" data-action="set-mode" data-mode="pvp">1 vs 1</button>
            <button class="toggle-btn ${state.mode === 'ai' ? 'active' : ''}" data-action="set-mode" data-mode="ai">vs AI</button>
          </div>
        </div>

        <div class="option-group">
          <label class="option-label">${t('board')}</label>
          <div class="toggle-row">
            ${presets.map(p => `<button class="toggle-btn ${state.preset.key === p.key ? 'active' : ''}" data-action="set-preset" data-preset="${p.key}">${p.size}\u00d7${p.size}</button>`).join('')}
          </div>
        </div>

        ${difficultyHtml}
      </div>

      <button class="play-btn" data-action="start-game">${t('play')}</button>

      <div class="menu-stats">
        <div class="stat-cell">
          <span class="stat-num">${state.mode === 'pvp' ? s.x : s.player}</span>
          <span class="stat-label">${state.mode === 'pvp' ? 'X' : t('player')}</span>
        </div>
        <div class="stat-cell">
          <span class="stat-num">${s.draws}</span>
          <span class="stat-label">${t('draws')}</span>
        </div>
        <div class="stat-cell">
          <span class="stat-num">${state.mode === 'pvp' ? s.o : s.ai}</span>
          <span class="stat-label">${state.mode === 'pvp' ? 'O' : 'AI'}</span>
        </div>
      </div>

      <div class="menu-bottom">
        <button class="link-btn" data-action="show-rules">${t('rules')}</button>
        <button class="link-btn" data-action="show-stats">${t('stats')}</button>
        <button class="link-btn" data-action="show-settings">${t('settings')}</button>
      </div>
    </div>`;
}

function statusText() {
  if (state.winner === 'draw') return { main: t('draw'), sub: t('boardFull') };
  if (state.winner === 'X') {
    const label = state.mode === 'ai' ? t('youWin') : t('xWins');
    return { main: label, sub: '' };
  }
  if (state.winner === 'O') {
    const label = state.mode === 'ai' ? t('aiWins') : t('oWins');
    return { main: label, sub: '' };
  }
  if (state.mode === 'ai' && state.currentPlayer === 'O') {
    return { main: t('aiThinking'), sub: state.preset.label };
  }
  const mark = state.currentPlayer;
  return {
    main: mark === 'X' ? t('xTurn') : t('oTurn'),
    sub: state.preset.label
  };
}

function resultIcon() {
  if (state.winner === 'draw') return '\u{1F91D}';
  if (state.mode === 'ai' && state.winner === 'X') return '\u{1F3C6}';
  if (state.mode === 'ai' && state.winner === 'O') return '\u{1F916}';
  return '\u{2728}';
}

function resultTitle() {
  if (state.winner === 'draw') return t('draw');
  if (state.mode === 'ai' && state.winner === 'X') return t('youWin');
  if (state.mode === 'ai' && state.winner === 'O') return t('aiWins');
  return state.winner === 'X' ? t('xWins') : t('oWins');
}

function resultSub() {
  if (state.winner === 'draw') return t('worthyGame');
  if (state.mode === 'ai' && state.winner === 'X') return t('greatGame');
  if (state.mode === 'ai' && state.winner === 'O') return t('tryAgain');
  return t('goodMatch');
}

function renderBoard() {
  const cellSize = state.preset.size >= 10 ? 'sz-compact' : state.preset.size >= 5 ? 'sz-medium' : 'sz-regular';

  const boardHtml = state.board.map((row, ri) =>
    row.map((cell, ci) => {
      const isWinning = state.winningCells.some(([r, c]) => r === ri && c === ci);
      const isLast = state.lastMove && state.lastMove.row === ri && state.lastMove.col === ci;
      let cls = `cell ${cellSize}`;
      if (cell) cls += ` filled mark-${cell.toLowerCase()}`;
      if (isWinning) cls += ' winning';
      if (isLast) cls += ' last-move';

      return `<button class="${cls}" data-action="move" data-row="${ri}" data-col="${ci}"
        ${cell || state.winner || state.busy ? 'disabled' : ''}
        aria-label="row ${ri + 1} col ${ci + 1}"><span class="cell-mark">${cell}</span></button>`;
    }).join('')
  ).join('');

  const lineHtml = state.winner && state.winner !== 'draw' && state.winningCells.length
    ? '<div class="win-line"></div>' : '';

  const burstHtml = state.winner && state.winner !== 'draw'
    ? `<div class="victory-burst" data-winner="${state.winner}"></div>` : '';

  const st = statusText();
  const isLoss = state.mode === 'ai' && state.winner === 'O';
  const shakeClass = isLoss ? ' shake' : '';

  const bannerHtml = state.winner ? `
    <div class="result-card">
      <div class="result-icon">${resultIcon()}</div>
      <div class="${state.winner !== 'draw' ? 'result-winner-' + state.winner.toLowerCase() : ''}">
        <h2>${resultTitle()}</h2>
      </div>
      <p class="result-sub">${resultSub()}</p>
      <div class="result-buttons">
        <button class="btn-primary" data-action="play-again">${t('playAgain')}</button>
        <button class="btn-ghost" data-action="back-menu">${t('menu')}</button>
      </div>
    </div>` : '';

  app.innerHTML = `
    <div class="app-screen game-screen">
      <header class="game-bar">
        <button class="icon-btn" data-action="back-menu" aria-label="Back">\u2190</button>
        <div class="game-status">
          <div class="status-main">${st.main}</div>
          ${st.sub ? `<div class="status-sub">${st.sub}</div>` : ''}
        </div>
        <div class="game-bar-right">
          <button class="icon-btn" data-action="restart" aria-label="Restart">\u21BB</button>
        </div>
      </header>

      <main class="board-area">
        <div class="board-container${shakeClass}">
          <div class="board" style="--size:${state.preset.size}">
            ${boardHtml}
          </div>
          ${burstHtml}
          ${lineHtml}
        </div>
      </main>

      ${bannerHtml}
    </div>`;

  if (state.winner && state.winner !== 'draw' && state.winningCells.length) {
    requestAnimationFrame(() => syncWinningLine());
  }

  if (!state.winner && !state.busy) {
    addCellHoverPreview();
  }
}

function addCellHoverPreview() {
  const cells = document.querySelectorAll('.cell:not(.filled)');
  const previewClass = `preview-${state.currentPlayer.toLowerCase()}`;
  cells.forEach(cell => {
    cell.addEventListener('pointerenter', () => cell.classList.add(previewClass));
    cell.addEventListener('pointerleave', () => cell.classList.remove(previewClass));
  });
}

function syncWinningLine() {
  if (!state.winner || state.winner === 'draw' || !state.winningCells.length) return;
  const container = document.querySelector('.board-container');
  const boardEl = document.querySelector('.board');
  const lineEl = document.querySelector('.win-line');
  if (!container || !boardEl || !lineEl) return;

  const [startCell] = state.winningCells;
  const endCell = state.winningCells[state.winningCells.length - 1];
  const startEl = boardEl.querySelector(`[data-row="${startCell[0]}"][data-col="${startCell[1]}"]`);
  const endEl = boardEl.querySelector(`[data-row="${endCell[0]}"][data-col="${endCell[1]}"]`);
  if (!startEl || !endEl) return;

  const containerRect = container.getBoundingClientRect();
  const startRect = startEl.getBoundingClientRect();
  const endRect = endEl.getBoundingClientRect();

  const startX = startRect.left - containerRect.left + startRect.width / 2;
  const startY = startRect.top - containerRect.top + startRect.height / 2;
  const endX = endRect.left - containerRect.left + endRect.width / 2;
  const endY = endRect.top - containerRect.top + endRect.height / 2;

  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const thickness = Math.max(3, Math.min(startRect.width, startRect.height) * 0.08);

  lineEl.dataset.winner = state.winner;
  lineEl.style.left = `${startX}px`;
  lineEl.style.top = `${startY}px`;
  lineEl.style.width = `${length}px`;
  lineEl.style.height = `${thickness}px`;
  lineEl.style.transform = `translateY(-50%) rotate(${angle}deg)`;
}

function winRatePercent(wins, total) {
  if (total === 0) return '0%';
  return Math.round((wins / total) * 100) + '%';
}

function renderStatsModal() {
  closeModal();
  const stats = getStats();
  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  const pvpTotal = stats.pvp.games;
  const aiTotal = stats.ai.games;

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-head">
        <h3>${t('statsTitle')}</h3>
        <button class="modal-close" data-action="close-modal">\u2715</button>
      </div>

      <div class="stats-section">
        <div class="stats-section-title">${t('pvp')}</div>
        <div class="stats-row">
          <div class="stats-item"><span class="s-num">${stats.pvp.x}</span><span class="s-label">X</span></div>
          <div class="stats-item"><span class="s-num">${stats.pvp.o}</span><span class="s-label">O</span></div>
          <div class="stats-item"><span class="s-num">${stats.pvp.draws}</span><span class="s-label">${t('draws')}</span></div>
          <div class="stats-item"><span class="s-num">${pvpTotal}</span><span class="s-label">${t('games')}</span></div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title">${t('vsAi')}</div>
        <div class="stats-row">
          <div class="stats-item"><span class="s-num">${stats.ai.player}</span><span class="s-label">${t('player')}</span></div>
          <div class="stats-item"><span class="s-num">${stats.ai.ai}</span><span class="s-label">AI</span></div>
          <div class="stats-item"><span class="s-num">${stats.ai.draws}</span><span class="s-label">${t('draws')}</span></div>
          <div class="stats-item"><span class="s-num">${aiTotal}</span><span class="s-label">${t('games')}</span></div>
        </div>
        ${aiTotal > 0 ? `<div class="stats-winrate">${t('winRate')}: ${winRatePercent(stats.ai.player, aiTotal)}</div>` : ''}
      </div>

      <div class="modal-footer">
        <button class="btn-ghost" data-action="reset-stats">${t('reset')}</button>
        <button class="btn-primary" data-action="close-modal">${t('close')}</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
}

function renderSettingsModal() {
  closeModal();
  const isMuted = localStorage.getItem(SOUND_KEY) === 'true';
  const currentTheme = state.theme || 'auto';
  const currentLang = getLang();
  const langs = getSupportedLangs();

  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-head">
        <h3>${t('settingsTitle')}</h3>
        <button class="modal-close" data-action="close-modal">\u2715</button>
      </div>

      <div class="settings-group">
        <label class="settings-label">${t('language')}</label>
        <div class="toggle-row">
          ${langs.map(lang => `<button class="toggle-btn ${currentLang === lang ? 'active' : ''}" data-action="set-lang" data-lang="${lang}">${getLangLabel(lang)}</button>`).join('')}
        </div>
      </div>

      <div class="settings-group">
        <label class="settings-label">${t('theme')}</label>
        <div class="toggle-row">
          <button class="toggle-btn ${currentTheme === 'dark' ? 'active' : ''}" data-action="set-theme" data-theme="dark">${t('dark')}</button>
          <button class="toggle-btn ${currentTheme === 'light' ? 'active' : ''}" data-action="set-theme" data-theme="light">${t('light')}</button>
          <button class="toggle-btn ${currentTheme === 'auto' ? 'active' : ''}" data-action="set-theme" data-theme="auto">${t('auto')}</button>
        </div>
      </div>

      <div class="settings-group">
        <label class="settings-label">${t('sound')}</label>
        <div class="toggle-row">
          <button class="toggle-btn ${!isMuted ? 'active' : ''}" data-action="set-sound" data-muted="false">${t('on')}</button>
          <button class="toggle-btn ${isMuted ? 'active' : ''}" data-action="set-sound" data-muted="true">${t('off')}</button>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-primary modal-full-btn" data-action="close-modal">${t('close')}</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
}

function renderRulesModal() {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  const rules = [
    { title: t('rule1title'), text: t('rule1text') },
    { title: t('rule2title'), text: t('rule2text') },
    { title: t('rule3title'), text: t('rule3text') },
    { title: t('rule4title'), text: t('rule4text') },
    { title: t('rule5title'), text: t('rule5text') },
  ];

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-head">
        <h3>${t('rulesTitle')}</h3>
        <button class="modal-close" data-action="close-modal">\u2715</button>
      </div>

      <p class="rules-intro">${t('rulesIntro')}</p>

      <div class="rules-list">
        ${rules.map(r => `
          <div class="rule-item">
            <div class="rule-title">${r.title}</div>
            <div class="rule-text">${r.text}</div>
          </div>
        `).join('')}
      </div>

      <div class="modal-footer">
        <button class="btn-primary modal-full-btn" data-action="close-modal">${t('gotIt')}</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
}

function closeModal() {
  document.querySelector('.overlay')?.remove();
}

function updateScreen() {
  if (state.screen === 'menu') renderMenu();
  else renderBoard();
}

function startGame() {
  state.screen = 'game';
  state.lastMove = null;
  resetRound(state);
  playSound('playClick');
  updateScreen();
}

function choosePreset(key) {
  const preset = presets.find(p => p.key === key);
  if (!preset) return;
  state.preset = preset;
  playSound('playClick');
  updateScreen();
}

function chooseMode(mode) {
  state.mode = mode;
  playSound('playClick');
  updateScreen();
}

function handleRoundEnd() {
  if (!state.winner) return;
  recordResult(state.mode, state.winner);

  if (state.winner === 'draw') playSound('playDraw');
  else if (state.mode === 'ai' && state.winner === 'O') playSound('playLose');
  else playSound('playWin');

  updateScreen();
}

function maybeAiTurn() {
  if (state.mode !== 'ai' || state.currentPlayer !== 'O' || state.winner) return;

  state.busy = true;
  updateScreen();

  window.setTimeout(() => {
    const move = getAiMoveWithDifficulty(state.board, state.preset.target, state.difficulty, 'O', 'X');
    const [row, col] = move || [];

    if (row !== undefined && col !== undefined) {
      state.busy = false;
      const playerBefore = state.currentPlayer;
      applyMove(state, row, col);
      state.lastMove = { row, col, player: playerBefore };
      playSound('playMove');
      if (state.winner) handleRoundEnd();
      else updateScreen();
    } else {
      state.busy = false;
      updateScreen();
    }
  }, 300);
}

function handleMove(row, col) {
  const playerBefore = state.currentPlayer;
  if (!applyMove(state, row, col)) return;
  state.lastMove = { row, col, player: playerBefore };
  playSound('playMove');

  if (state.winner) { handleRoundEnd(); return; }
  updateScreen();
  maybeAiTurn();
}

function wireEvents() {
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const action = t.dataset.action;

    if (action === 'start-game') { startGame(); maybeAiTurn(); return; }
    if (action === 'set-mode') { chooseMode(t.dataset.mode); return; }
    if (action === 'set-preset') { choosePreset(t.dataset.preset); return; }
    if (action === 'set-diff') { state.difficulty = t.dataset.diff; playSound('playClick'); updateScreen(); return; }
    if (action === 'set-theme') {
      applyTheme(t.dataset.theme);
      playSound('playClick');
      const modal = document.querySelector('.modal');
      if (modal) renderSettingsModal();
      else updateScreen();
      return;
    }
    if (action === 'set-lang') {
      setLang(t.dataset.lang);
      playSound('playClick');
      renderSettingsModal();
      return;
    }
    if (action === 'set-sound') {
      const muted = t.dataset.muted === 'true';
      localStorage.setItem(SOUND_KEY, muted);
      if (audioModule) audioModule.setMuted(muted);
      playSound('playClick');
      renderSettingsModal();
      return;
    }
    if (action === 'show-stats') { renderStatsModal(); return; }
    if (action === 'show-settings') { renderSettingsModal(); return; }
    if (action === 'show-rules') { renderRulesModal(); return; }
    if (action === 'close-modal') { closeModal(); updateScreen(); return; }
    if (action === 'reset-stats') { resetStats(); closeModal(); updateScreen(); return; }
    if (action === 'toggle-sound') {
      const muted = localStorage.getItem(SOUND_KEY) !== 'true';
      localStorage.setItem(SOUND_KEY, muted);
      if (audioModule) audioModule.setMuted(muted);
      updateScreen();
      return;
    }
    if (action === 'back-menu') { state.screen = 'menu'; state.lastMove = null; closeModal(); updateScreen(); return; }
    if (action === 'restart') { state.lastMove = null; resetRound(state); playSound('playClick'); updateScreen(); maybeAiTurn(); return; }
    if (action === 'play-again') {
      const starter = state.winner === 'draw' ? 'X' : state.winner;
      state.lastMove = null;
      resetRound(state, starter === 'draw' ? 'X' : starter);
      playSound('playClick');
      updateScreen();
      maybeAiTurn();
      return;
    }
    if (action === 'move') { handleMove(Number(t.dataset.row), Number(t.dataset.col)); }
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('overlay')) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key.toLowerCase() === 'n' && state.screen === 'game') {
      resetRound(state);
      updateScreen();
      maybeAiTurn();
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (state.screen === 'game' && state.winner && state.winner !== 'draw') {
        requestAnimationFrame(() => syncWinningLine());
      }
    }, 100);
  });

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    if ((state.theme || 'auto') === 'auto') {
      applyTheme('auto');
      updateScreen();
    }
  });
}

document.documentElement.lang = getLang();
state.theme = getStoredTheme();
applyTheme(state.theme);
wireEvents();
updateScreen();
