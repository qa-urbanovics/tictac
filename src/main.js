import './styles.css';
import { getAiMove } from './ai.js';
import { createGameState, presets, resetRound, applyMove } from './game.js';
import { getStats, recordResult, resetStats } from './storage.js';

const state = createGameState();
const app = document.querySelector('#app');
state.lastMove = null;

const THEME_KEY = 'tictac-theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'auto';
}

function applyTheme(theme) {
  const resolved =
    theme === 'auto'
      ? window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
      : theme;

  document.documentElement.dataset.theme = resolved;
  localStorage.setItem(THEME_KEY, theme);
  state.theme = theme;
}

function themeButton(theme, label) {
  const active = (state.theme || 'auto') === theme ? 'active' : '';
  return `
    <button class="theme-chip ${active}" data-action="set-theme" data-theme="${theme}">
      ${label}
    </button>
  `;
}

function logoMarkup() {
  return `
    <div class="brand-lockup">
      <div class="brand-logo" aria-hidden="true">
        <svg viewBox="0 0 96 96" role="img" class="logo-svg">
          <defs>
            <linearGradient id="logoGradA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--accent)" />
              <stop offset="100%" stop-color="var(--accent-2)" />
            </linearGradient>
            <linearGradient id="logoGradB" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="var(--accent-3)" />
              <stop offset="100%" stop-color="var(--accent)" />
            </linearGradient>
          </defs>

          <rect x="10" y="10" width="76" height="76" rx="24" fill="rgba(255,255,255,0.08)" />
          <path d="M30 30 L66 66 M66 30 L30 66" stroke="url(#logoGradA)" stroke-width="10" stroke-linecap="round" />
          <circle cx="68" cy="28" r="10" fill="none" stroke="url(#logoGradB)" stroke-width="8" />
        </svg>
      </div>

      <div class="brand-copy">
        <h1>TicTac</h1>
        <p class="hero-text">
          Современные крестики-нолики.
        </p>
      </div>
    </div>
  `;
}

function presetCard(preset) {
  const active = state.preset.key === preset.key ? 'active' : '';
  return `
    <button class="select-card ${active}" data-action="set-preset" data-preset="${preset.key}">
      <span class="card-title">${preset.label}</span>
      <span class="card-meta">Поле ${preset.size}x${preset.size} · собрать ${preset.target}</span>
    </button>
  `;
}

function modeCard(mode, title, desc, emoji) {
  const active = state.mode === mode ? 'active' : '';
  return `
    <button class="mode-card ${active}" data-action="set-mode" data-mode="${mode}">
      <span class="mode-icon">${emoji}</span>
      <span class="mode-copy">
        <span class="card-title">${title}</span>
        <span class="card-meta">${desc}</span>
      </span>
    </button>
  `;
}

function renderMenu() {
  const stats = getStats();

  app.innerHTML = `
    <div class="shell">
      <section class="hero hero-ios panel">
        ${logoMarkup()}

        <div class="hero-right"> 
          <div class="theme-switcher">
            ${themeButton('light', '☀')}
            ${themeButton('dark', '🌙')}
            ${themeButton('auto', '🪄')}
          </div>

          <div class="hero-actions">
            <button class="primary-btn" data-action="start-game">Играть</button>
            <button class="ghost-btn" data-action="show-stats">Статистика</button>
          </div>
        </div> 
      </section>

      <section class="grid two-up">
        <article class="panel elevated-panel">
          <div class="section-title">Режим игры</div>
          <div class="cards-stack">
            ${modeCard('pvp', '1 vs 1', 'Два игрока на одном устройстве', '👥')}
            ${modeCard('ai', 'vs Computer', 'Игрок против компьютера', '🤖')}
          </div>
        </article>

        <article class="panel elevated-panel">
          <div class="section-title">Размер поля</div>
          <div class="cards-stack">
            ${presets.map(presetCard).join('')}
          </div>
        </article>
      </section>

      <section class="panel launch-panel">
        <div>
          <div class="section-title">Быстрый старт</div>
          <p class="hero-text small">Выбери режим, тему и размер поля, потом запускай матч.</p>
        </div>
        <div class="hero-actions">
          <button class="primary-btn" data-action="start-game">Начать матч</button>
        </div>
      </section>

      <section class="grid two-up compact-panels">
        <article class="panel stat-panel">
          <div class="section-title">Локальная статистика PvP</div>
          <div class="mini-stats">
            <div><span>X</span><strong>${stats.pvp.x}</strong></div>
            <div><span>O</span><strong>${stats.pvp.o}</strong></div>
            <div><span>Ничьи</span><strong>${stats.pvp.draws}</strong></div>
            <div><span>Игр</span><strong>${stats.pvp.games}</strong></div>
          </div>
        </article>

        <article class="panel stat-panel">
          <div class="section-title">Локальная статистика AI</div>
          <div class="mini-stats">
            <div><span>Игрок</span><strong>${stats.ai.player}</strong></div>
            <div><span>AI</span><strong>${stats.ai.ai}</strong></div>
            <div><span>Ничьи</span><strong>${stats.ai.draws}</strong></div>
            <div><span>Игр</span><strong>${stats.ai.games}</strong></div>
          </div>
        </article>
      </section>
    </div>
  `;
}

function statusText() {
  if (state.winner === 'draw') return 'Ничья';
  if (state.winner === 'X') return state.mode === 'ai' ? 'Победил игрок' : 'Победил X';
  if (state.winner === 'O') return state.mode === 'ai' ? 'Победил AI' : 'Победил O';
  if (state.mode === 'ai' && state.currentPlayer === 'O') return 'Ход компьютера…';
  return `Ход: ${state.currentPlayer}`;
}

function winnerTitle() {
  if (state.winner === 'draw') return 'Ничья';
  if (state.mode === 'ai' && state.winner === 'X') return 'Ты победил';
  if (state.mode === 'ai' && state.winner === 'O') return 'Компьютер победил';
  return `Победил ${state.winner}`;
}

function winnerSubtitle() {
  if (state.winner === 'draw') return 'Поле заполнено. Попробуй ещё один раунд.';
  if (state.mode === 'ai' && state.winner === 'X') return 'Отличный ход. Серия собрана идеально.';
  if (state.mode === 'ai' && state.winner === 'O') return 'AI оказался сильнее в этом раунде.';
  return 'Красивое завершение партии.';
}

function syncWinningLine() {
  if (!state.winner || state.winner === 'draw' || !state.winningCells.length) return;

  const layerEl = document.querySelector('.board-layer');
  const boardEl = document.querySelector('.board');
  const lineEl = document.querySelector('.win-line');

  if (!layerEl || !boardEl || !lineEl) return;

  const [startCell] = state.winningCells;
  const endCell = state.winningCells[state.winningCells.length - 1];

  const startEl = boardEl.querySelector(`[data-row="${startCell[0]}"][data-col="${startCell[1]}"]`);
  const endEl = boardEl.querySelector(`[data-row="${endCell[0]}"][data-col="${endCell[1]}"]`);

  if (!startEl || !endEl) return;

  const layerRect = layerEl.getBoundingClientRect();
  const startRect = startEl.getBoundingClientRect();
  const endRect = endEl.getBoundingClientRect();

  const startX = startRect.left - layerRect.left + startRect.width / 2;
  const startY = startRect.top - layerRect.top + startRect.height / 2;
  const endX = endRect.left - layerRect.left + endRect.width / 2;
  const endY = endRect.top - layerRect.top + endRect.height / 2;

  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const thickness = Math.max(4, Math.min(startRect.width, startRect.height) * 0.1);

  lineEl.dataset.winner = state.winner;
  lineEl.style.left = `${startX}px`;
  lineEl.style.top = `${startY}px`;
  lineEl.style.width = `${length}px`;
  lineEl.style.height = `${thickness}px`;
  lineEl.style.transform = `translateY(-50%) rotate(${angle}deg)`;
}

function renderBoard() {
  const cellSize =
    state.preset.size >= 10 ? 'compact' : state.preset.size >= 5 ? 'medium' : 'regular';

  const boardHtml = state.board
    .map((row, rowIndex) =>
      row
        .map((cell, colIndex) => {
          const isWinning = state.winningCells.some(([r, c]) => r === rowIndex && c === colIndex);

          const isLastMove =
            state.lastMove && state.lastMove.row === rowIndex && state.lastMove.col === colIndex;

          let markClass = '';
          if (cell === 'X') markClass = 'mark-x';
          if (cell === 'O') markClass = 'mark-o';

          return `
            <button
              class="cell ${cellSize} ${cell ? 'filled' : ''} ${isWinning ? 'winning' : ''} ${isLastMove ? 'last-move' : ''} ${markClass}"
              data-action="move"
              data-row="${rowIndex}"
              data-col="${colIndex}"
              ${cell || state.winner || state.busy ? 'disabled' : ''}
              aria-label="row ${rowIndex + 1} col ${colIndex + 1}"
            ><span class="cell-mark">${cell}</span></button>
          `;
        })
        .join('')
    )
    .join('');

  const lineHtml =
    state.winner && state.winner !== 'draw' && state.winningCells.length
      ? `<div class="win-line"></div>`
      : '';

  const burstHtml =
    state.winner && state.winner !== 'draw'
      ? `<div class="victory-burst" data-winner="${state.winner}"></div>`
      : '';

  const bannerHtml = state.winner
    ? `
      <div class="result-banner ${state.winner === 'draw' ? 'draw' : 'winner'}">
        <div class="result-badge">${state.winner === 'draw' ? 'DRAW' : 'WIN'}</div>
        <div class="result-copy">
          <h3>${winnerTitle()}</h3>
          <p>${winnerSubtitle()}</p>
        </div>
        <div class="result-actions">
          <button class="primary-btn" data-action="play-again">Играть ещё</button>
          <button class="ghost-btn" data-action="back-menu">В меню</button>
        </div>
      </div>
    `
    : '';

  app.innerHTML = `
    <div class="shell game-shell">
      <section class="panel game-topbar ios-bar">
        <div>
          <div class="eyebrow">${state.mode === 'ai' ? 'Player vs Computer' : 'Local 1 vs 1'}</div>
          <h2>${state.preset.label}</h2>
          <p class="hero-text small">${statusText()}</p>
        </div>

        <div class="toolbar">
          <div class="theme-switcher compact">
            ${themeButton('light', '☀')}
            ${themeButton('dark', '🌙')}
            ${themeButton('auto', '🪄')}
          </div>
          <button class="ghost-btn" data-action="back-menu">Меню</button>
          <button class="ghost-btn" data-action="restart">Рестарт</button>
        </div>
      </section>

      ${bannerHtml}

      <section class="panel board-panel board-stage">
        <div class="board-wrap">
          <div class="board-layer">
            <div class="board board-ios" style="--size:${state.preset.size}">
              ${boardHtml}
            </div>
            ${burstHtml}
            ${lineHtml}
          </div>
        </div>
      </section>
    </div>
  `;

  if (state.winner && state.winner !== 'draw' && state.winningCells.length) {
    requestAnimationFrame(() => {
      syncWinningLine();
    });
  }
}

function renderStatsModal() {
  closeModal();

  const stats = getStats();
  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  overlay.innerHTML = `
    <div class="modal panel">
      <div class="modal-header">
        <h3>Статистика</h3>
        <button class="icon-btn" data-action="close-modal">✕</button>
      </div>

      <div class="stats-grid">
        <div class="stats-card">
          <div class="section-title">PvP</div>
          <div class="stats-list">
            <div><span>Победы X</span><strong>${stats.pvp.x}</strong></div>
            <div><span>Победы O</span><strong>${stats.pvp.o}</strong></div>
            <div><span>Ничьи</span><strong>${stats.pvp.draws}</strong></div>
            <div><span>Всего игр</span><strong>${stats.pvp.games}</strong></div>
          </div>
        </div>

        <div class="stats-card">
          <div class="section-title">AI</div>
          <div class="stats-list">
            <div><span>Победы игрока</span><strong>${stats.ai.player}</strong></div>
            <div><span>Победы AI</span><strong>${stats.ai.ai}</strong></div>
            <div><span>Ничьи</span><strong>${stats.ai.draws}</strong></div>
            <div><span>Всего игр</span><strong>${stats.ai.games}</strong></div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="ghost-btn" data-action="reset-stats">Сбросить</button>
        <button class="primary-btn" data-action="close-modal">Закрыть</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function closeModal() {
  document.querySelector('.overlay')?.remove();
}

function updateScreen() {
  if (state.screen === 'menu') {
    renderMenu();
  } else {
    renderBoard();
  }
}

function startGame() {
  state.screen = 'game';
  state.lastMove = null;
  resetRound(state);
  updateScreen();
}

function choosePreset(key) {
  const preset = presets.find((item) => item.key === key);
  if (!preset) return;
  state.preset = preset;
  updateScreen();
}

function chooseMode(mode) {
  state.mode = mode;
  updateScreen();
}

function handleRoundEnd() {
  if (!state.winner) return;
  recordResult(state.mode, state.winner);
  updateScreen();
}

function maybeAiTurn() {
  if (state.mode !== 'ai' || state.currentPlayer !== 'O' || state.winner) return;

  state.busy = true;
  updateScreen();

  window.setTimeout(() => {
    const [row, col] = getAiMove(state.board, state.preset.target, 'O', 'X') || [];

    if (row !== undefined && col !== undefined) {
      state.busy = false;
      const playerBeforeMove = state.currentPlayer;

      applyMove(state, row, col);

      state.lastMove = {
        row,
        col,
        player: playerBeforeMove,
      };

      if (state.winner) {
        handleRoundEnd();
      } else {
        updateScreen();
      }
    } else {
      state.busy = false;
      updateScreen();
    }
  }, 280);
}

function handleMove(row, col) {
  const playerBeforeMove = state.currentPlayer;

  if (!applyMove(state, row, col)) return;

  state.lastMove = {
    row,
    col,
    player: playerBeforeMove,
  };

  if (state.winner) {
    handleRoundEnd();
    return;
  }

  updateScreen();
  maybeAiTurn();
}

function wireEvents() {
  document.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-action]');
    if (!actionTarget) return;

    const action = actionTarget.dataset.action;

    if (action === 'start-game') {
      startGame();
      maybeAiTurn();
      return;
    }

    if (action === 'set-mode') {
      chooseMode(actionTarget.dataset.mode);
      return;
    }

    if (action === 'set-preset') {
      choosePreset(actionTarget.dataset.preset);
      return;
    }

    if (action === 'set-theme') {
      applyTheme(actionTarget.dataset.theme);
      updateScreen();
      return;
    }

    if (action === 'show-stats') {
      renderStatsModal();
      return;
    }

    if (action === 'close-modal') {
      closeModal();
      return;
    }

    if (action === 'reset-stats') {
      resetStats();
      closeModal();
      updateScreen();
      return;
    }

    if (action === 'back-menu') {
      state.screen = 'menu';
      state.lastMove = null;
      closeModal();
      updateScreen();
      return;
    }

    if (action === 'restart') {
      state.lastMove = null;
      resetRound(state);
      updateScreen();
      maybeAiTurn();
      return;
    }

    if (action === 'play-again') {
      const starter = state.winner === 'draw' ? 'X' : state.winner;
      state.lastMove = null;
      resetRound(state, starter === 'draw' ? 'X' : starter);
      updateScreen();
      maybeAiTurn();
      return;
    }

    if (action === 'move') {
      handleMove(Number(actionTarget.dataset.row), Number(actionTarget.dataset.col));
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();

    if (event.key.toLowerCase() === 'n' && state.screen === 'game') {
      resetRound(state);
      updateScreen();
      maybeAiTurn();
    }
  });

  document.addEventListener('dblclick', (event) => {
    if (event.target.classList.contains('overlay')) {
      closeModal();
    }
  });

  window.addEventListener('resize', () => {
    if (state.screen === 'game' && state.winner && state.winner !== 'draw') {
      requestAnimationFrame(() => {
        syncWinningLine();
      });
    }
  });

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    if ((state.theme || 'auto') === 'auto') {
      applyTheme('auto');
      updateScreen();
    }
  });
}

state.theme = getStoredTheme();
applyTheme(state.theme);
wireEvents();
updateScreen();
