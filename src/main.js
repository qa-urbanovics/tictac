import './styles.css';
import { getAiMove } from './ai.js';
import { createGameState, presets, resetRound, applyMove } from './game.js';
import { getStats, recordResult, resetStats } from './storage.js';

const state = createGameState();
const app = document.querySelector('#app');

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
      <section class="hero panel">
        <div>
          <div class="eyebrow">Local-first • GitHub Pages ready</div>
          <h1>TicTac Universe</h1>
          <p class="hero-text">
            Современные крестики-нолики для браузера: локальный PvP, игра против AI,
            большие поля и чистый адаптивный интерфейс.
          </p>
        </div>

        <div class="hero-actions">
          <button class="primary-btn" data-action="start-game">Играть</button>
          <button class="ghost-btn" data-action="show-stats">Статистика</button>
        </div>
      </section>

      <section class="grid two-up">
        <article class="panel">
          <div class="section-title">Режим игры</div>
          <div class="cards-stack">
            ${modeCard('pvp', '1 vs 1', 'Два игрока на одном устройстве', '👥')}
            ${modeCard('ai', 'vs Computer', 'Игрок против компьютера', '🤖')}
          </div>
        </article>

        <article class="panel">
          <div class="section-title">Размер поля</div>
          <div class="cards-stack">
            ${presets.map(presetCard).join('')}
          </div>
        </article>
      </section>

      <section class="panel" style="padding: 24px; margin-top: 20px;">
        <div class="section-title">Быстрый старт</div>
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

function renderBoard() {
  const cellSize =
    state.preset.size >= 10 ? 'compact' : state.preset.size >= 5 ? 'medium' : 'regular';

  const boardHtml = state.board
    .map((row, rowIndex) =>
      row
        .map((cell, colIndex) => {
          const isWinning = state.winningCells.some(
            ([r, c]) => r === rowIndex && c === colIndex
          );

          return `
            <button
              class="cell ${cellSize} ${cell ? 'filled' : ''} ${isWinning ? 'winning' : ''}"
              data-action="move"
              data-row="${rowIndex}"
              data-col="${colIndex}"
              ${cell || state.winner || state.busy ? 'disabled' : ''}
            >${cell}</button>
          `;
        })
        .join('')
    )
    .join('');

  app.innerHTML = `
    <div class="shell game-shell">
      <section class="panel game-topbar">
        <div>
          <div class="eyebrow">${state.mode === 'ai' ? 'Player vs Computer' : 'Local 1 vs 1'}</div>
          <h2>${state.preset.label}</h2>
          <p class="hero-text small">${statusText()}</p>
        </div>

        <div class="toolbar">
          <button class="ghost-btn" data-action="back-menu">Меню</button>
          <button class="ghost-btn" data-action="restart">Рестарт</button>
          ${state.winner ? '<button class="primary-btn" data-action="play-again">Еще раз</button>' : ''}
        </div>
      </section>

      <section class="panel board-panel">
        <div class="board" style="--size:${state.preset.size}">
          ${boardHtml}
        </div>
      </section>

      <section class="grid two-up compact-panels">
        <article class="panel note-panel">
          <div class="section-title">Правила матча</div>
          <p>
            Поле ${state.preset.size}x${state.preset.size}. Чтобы победить, нужно собрать
            ${state.preset.target} символа подряд по горизонтали, вертикали или диагонали.
          </p>
        </article>

        <article class="panel note-panel">
          <div class="section-title">Управление</div>
          <p>
            Кликни или тапни по свободной клетке. Игра оптимизирована под мобильный браузер
            и отлично подходит для GitHub Pages.
          </p>
        </article>
      </section>
    </div>
  `;
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
      applyMove(state, row, col);

      if (state.winner) {
        handleRoundEnd();
      } else {
        updateScreen();
      }
    } else {
      state.busy = false;
      updateScreen();
    }
  }, 250);
}

function handleMove(row, col) {
  if (!applyMove(state, row, col)) return;

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
      closeModal();
      updateScreen();
      return;
    }

    if (action === 'restart') {
      resetRound(state);
      updateScreen();
      maybeAiTurn();
      return;
    }

    if (action === 'play-again') {
      const starter = state.winner === 'draw' ? 'X' : state.winner;
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
}

wireEvents();
updateScreen();