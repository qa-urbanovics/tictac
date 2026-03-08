export const presets = [
  { key: 'classic', label: 'Classic 3x3', size: 3, target: 3 },
  { key: 'extended', label: 'Extended 5x5', size: 5, target: 4 },
  { key: 'pro', label: 'Pro 10x10', size: 10, target: 5 }
];

export function createBoard(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => ''));
}

export function createGameState({ mode = 'pvp', preset = presets[0] } = {}) {
  return {
    screen: 'menu',
    mode,
    preset,
    board: createBoard(preset.size),
    currentPlayer: 'X',
    winner: null,
    moves: 0,
    busy: false,
    winningCells: []
  };
}

export function resetRound(state, nextStarter = 'X') {
  state.board = createBoard(state.preset.size);
  state.currentPlayer = nextStarter;
  state.winner = null;
  state.moves = 0;
  state.busy = false;
  state.winningCells = [];
}

export function applyMove(state, row, col) {
  if (state.winner || state.busy) return false;
  if (state.board[row][col]) return false;

  state.board[row][col] = state.currentPlayer;
  state.moves += 1;

  const result = getGameResult(state.board, state.preset.target);
  if (result.winner) {
    state.winner = result.winner;
    state.winningCells = result.cells;
  } else if (state.moves >= state.preset.size * state.preset.size) {
    state.winner = 'draw';
    state.winningCells = [];
  } else {
    state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
  }

  return true;
}

function inside(size, row, col) {
  return row >= 0 && col >= 0 && row < size && col < size;
}

export function getGameResult(board, target) {
  const size = board.length;
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const symbol = board[row][col];
      if (!symbol) continue;

      for (const [dr, dc] of directions) {
        const prevRow = row - dr;
        const prevCol = col - dc;
        if (inside(size, prevRow, prevCol) && board[prevRow][prevCol] === symbol) {
          continue;
        }

        const cells = [[row, col]];
        let r = row + dr;
        let c = col + dc;
        while (inside(size, r, c) && board[r][c] === symbol) {
          cells.push([r, c]);
          if (cells.length === target) {
            return { winner: symbol, cells };
          }
          r += dr;
          c += dc;
        }
      }
    }
  }

  return { winner: null, cells: [] };
}
