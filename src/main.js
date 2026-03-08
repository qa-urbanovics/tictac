// src/main.js

import './styles.css';
import { getAiMove } from './ai.js';
import { createGameState, presets, resetRound, applyMove } from './game.js';
import { getStats, recordResult, resetStats } from './storage.js';

const state = createGameState();
const app = document.querySelector('#app');

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function presetCard(preset) {
  const active = state.preset.key === preset.key ? 'active' : '';

  return `
    <button class="select-card ${active}" data-action="set-preset" data-preset="${preset.key}">
      <span class="card-title">${escapeHtml(preset.label)}</span>
      <span class="card-meta">Поле ${preset.size}x${preset.size} · собрать ${preset.target}</span>
    </button>
  `;
}

function modeCard(mode, title, desc, emoji) {
  const active = state.mode === mode ? 'active' : '';

  return `
    <button class="select-card ${active}" data-action="set-mode" data-mode="${mode}">
      <span class="card-title">${emoji} ${escapeHtml(title)}</span>
      <span class="card-meta">${escapeHtml(desc)}</span>
    </button>
  `;
}

function getStatusMeta() {
  if (state.winner === 'draw') {
    return {
      text: 'Ничья',
      className: 'draw',
    };
  }

  if (state.winner === 'X') {
    return {
      text: state.mode === 'ai' ? 'Победил игрок' : 'Победил X',
      className: 'win',
    };
  }

  if (state.winner === 'O') {
    return {
      text: state.mode === 'ai' ? 'Победил AI' : 'Победил O',
      className: 'win',
    };
  }

  if (state.mode === 'ai' && state.currentPlayer === 'O') {
    return {
      text: 'Ход компьютера…',
      className: 'busy',
    };
  }

  return {
    text: `Ход: ${state.currentPlayer}`,
    className: '',
  };
}

function renderMenu() {
  const stats = getStats();

  app.innerHTML = `
    <div class="shell menu-shell">
      <section class="panel hero-panel">
        <div class="eyebrow">Local-first • GitHub Pages ready</div>
        <h1>TicTac Universe</h1>
        <p class="hero-copy">
          Стильные современные крестики-нолики для браузера:
          локальный PvP, игра против AI, большие поля и аккуратный адаптивный интерфейс.
        </p>

        <div class="hero-actions">
          <button class="primary-btn" data-action="start-game">Играть</button>
          <button class="secondary-btn" data-action="show-stats">Статистика</button>
        </div>
      </section>

      <section class="grid two-up">
        <article class="panel section-card">
          <div class="section-title">Режим игры</div>
          <div class="choice-grid modes">
            ${modeCard('pvp', '1 vs 1', 'Два игрока на одном устройстве', '⚔️')}
            ${modeCard('ai', 'vs Computer', 'Игрок против компьютера', '🤖')}
          </div>
        </article>

        <article class="panel section-card">
          <div class="section-title">Размер поля</div>
          <div class="choice-grid presets">
            ${presets.map(presetCard).join('')}
          </div>
        </article>
      </section>

      <section class="grid two-up">
        <article class="panel section-card">
          <div class="section-title">Быстрый старт</div>
          <p class="hero-text small">
            Выбери режим, размер поля и начни матч. Все результаты сохраняются локально в браузере.
          </p>
          <div class="hero-actions">
            <button class="primary-btn" data-action="start-game">Начать матч</button>
          </div>
        </article>

        <article class="panel section-card">
          <div class="section-title">Локальная статистика PvP</div>
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-label">X</div>
              <div class="stat-value">${stats.pvp.x}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">O</div>
              <div class="stat-value">${stats.pvp.o}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Ничьи</div>
              <div class="stat-value">${stats.pvp.draws}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Игр</div>
              <div class="stat-value">${stats.pvp.games}</div>
            </div>
          </div>

          <div class="section-title" style="margin-top:20px;">Локальная статистика AI</div>
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-label">Игрок</div>
              <div class="stat-value">${stats.ai.player}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">AI</div>
              <div class="stat-value">${stats.ai.ai}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Ничьи</div>
              <div class="stat-value">${stats.ai.draws}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Игр</div>
              <div class="stat-value">${stats.ai.games}</div>
            </div>
          </div>
        </article>
      </section>
    </div>
  `;
}

function getCellSizeClass() {
  if (state.preset.size >= 10) return 'compact';
  if (state.preset.size >= 5) return 'medium';
  return 'regular';
}

function getCellMarkClass(cell) {
  if (cell === 'X') return 'mark-x';
  if (cell === 'O') return 'mark-o';
  return '';
}

function getWinningLineStyle() {
  const cells = state.winningCells;

  if (!Array.isArray(cells) || cells.length < 2) {
    return '';
  }

  const first = cells[0];
  const last = cells[cells.length - 1];
  const size = state.preset.size;

  if (!first || !last || !size) {
    return '';
  }

  const [r1, c1] = first;
  const [r2, c2] = last;

  const percentPerCell = 100 / size;
  const centerOffset = percentPerCell / 2;

  const startX = c1 * percentPerCell + centerOffset;
  const startY = r1 * percentPerCell + centerOffset;
  const endX = c2 * percentPerCell + centerOffset;
  const endY = r2 * percentPerCell + centerOffset;

  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  const centerX = (startX + endX) / 2;
  const centerY = (startY + endY) / 2;

  return `
    --line-left:${centerX}%;
    --line-top:${centerY}%;
    --line-width:calc(${length}% + 10px);
    --line-rotation:${angle}deg;
  `;
}

function renderBoard() {
  const cellSize = getCellSizeClass();
  const status = getStatusMeta();

  const boardHtml = state.board
    .map((row, rowIndex) =>
      row
        .map((cell, colIndex) => {
          const isWinning = state.winningCells.some(
            ([r, c]) => r === rowIndex && c === colIndex
          );

          const classes = [
            'board-cell',
            cellSize,
            getCellMarkClass(cell),
            isWinning ? 'winning' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return `
            <button
              class="${classes}"
              data-action="move"
              data-row="${rowIndex}"
              data-col="${colIndex}"
              ${cell || state.winner || state.busy ? 'disabled' : ''}
              aria-label="Клетка ${rowIndex + 1}-${colIndex + 1}"
            >${escapeHtml(cell)}</button>
          `;
        })
        .join('')
    )
    .join('');

  const showWinLine =
    state.winner && state.winner !== 'draw' && state.winningCells.length >= 2;

  app.innerHTML = `
    <div class="shell game-shell">
      <section class="panel game-topbar">
        <div>
          <div class="eyebrow">${state.mode === 'ai' ? 'Player vs Computer' : 'Local 1 vs 1'}</div>
          <h2>${escapeHtml(state.preset.label)}</h2>
          <div class="status-badge ${status.className}">
            ${escapeHtml(status.text)}
          </div>
        </div>

        <div class="toolbar">
          <button class="ghost-btn" data-action="back-menu">Меню</button>
          <button class="ghost-btn" data-action="restart">Рестарт</button>
          ${state.winner ? '<button class="primary-btn" data-action="play-again">Еще раз</button>' : ''}
        </div>
      </section>

      <section class="panel board-panel">
        <div class="board-wrap">
          <div class="board" style="--size:${state.preset.size}">
            ${boardHtml}
          </div>
          ${showWinLine ? `<div class="win-line" style="${getWinningLineStyle()}"></div>` : ''}
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
            Кликни или тапни по свободной клетке. Размер клеток теперь фиксирован,
            поэтому поле выглядит стабильнее и не дергается при ходе.
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
    <div class="modal" role="dialog" aria-modal="true" aria-label="Статистика">
      <div class="modal-head">
        <div>
          <div class="eyebrow">Local stats</div>
          <h2>Статистика</h2>
        </div>
        <button class="icon-btn" data-action="close-modal" aria-label="Закрыть">✕</button>
      </div>

      <div class="modal-grid">
        <section class="modal-section">
          <h3>PvP</h3>
          <div class="modal-stats">
            <div class="modal-stat"><span>Победы X</span><strong>${stats.pvp.x}</strong></div>
            <div class="modal-stat"><span>Победы O</span><strong>${stats.pvp.o}</strong></div>
            <div class="modal-stat"><span>Ничьи</span><strong>${stats.pvp.draws}</strong></div>
            <div class="modal-stat"><span>Всего игр</span><strong>${stats.pvp.games}</strong></div>
          </div>
        </section>

        <section class="modal-section">
          <h3>AI</h3>
          <div class="modal-stats">
            <div class="modal-stat"><span>Победы игрока</span><strong>${stats.ai.player}</strong></div>
            <div class="modal-stat"><span>Победы AI</span><strong>${stats.ai.ai}</strong></div>
            <div class="modal-stat"><span>Ничьи</span><strong>${stats.ai.draws}</strong></div>
            <div class="modal-stat"><span>Всего игр</span><strong>${stats.ai.games}</strong></div>
          </div>
        </section>
      </div>

      <div class="modal-actions">
        <button class="secondary-btn" data-action="reset-stats">Сбросить</button>
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
    return;
  }

  renderBoard();
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
  if (state.mode !== 'ai' || state.currentPlayer !== 'O' || state.winner) {
    return;
  }

  state.busy = true;
  updateScreen();

  window.setTimeout(() => {
    const [row, col] = getAiMove(state.board, state.preset.target, 'O', 'X') || [];

    state.busy = false;

    if (row !== undefined && col !== undefined) {
      applyMove(state, row, col);

      if (state.winner) {
        handleRoundEnd();
      } else {
        updateScreen();
      }

      return;
    }

    updateScreen();
  }, 260);
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
    if (event.key === 'Escape') {
      closeModal();
    }

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