function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function minimaxMove(board, aiSymbol = 'O', humanSymbol = 'X') {
  const size = board.length;
  if (size !== 3) return null;

  function emptyCells(state) {
    const cells = [];
    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        if (!state[r][c]) cells.push([r, c]);
      }
    }
    return cells;
  }

  function checkWinner(state) {
    const lines = [];
    for (let i = 0; i < 3; i += 1) {
      lines.push([[i, 0], [i, 1], [i, 2]]);
      lines.push([[0, i], [1, i], [2, i]]);
    }
    lines.push([[0, 0], [1, 1], [2, 2]]);
    lines.push([[0, 2], [1, 1], [2, 0]]);

    for (const line of lines) {
      const values = line.map(([r, c]) => state[r][c]);
      if (values[0] && values.every((v) => v === values[0])) return values[0];
    }

    return emptyCells(state).length === 0 ? 'draw' : null;
  }

  function score(winner, depth) {
    if (winner === aiSymbol) return 10 - depth;
    if (winner === humanSymbol) return depth - 10;
    return 0;
  }

  function recurse(state, isMaximizing, depth) {
    const winner = checkWinner(state);
    if (winner) return { score: score(winner, depth) };

    const cells = emptyCells(state);
    let best = { score: isMaximizing ? -Infinity : Infinity, move: null };

    for (const [r, c] of cells) {
      state[r][c] = isMaximizing ? aiSymbol : humanSymbol;
      const result = recurse(state, !isMaximizing, depth + 1);
      state[r][c] = '';

      if (isMaximizing) {
        if (result.score > best.score) {
          best = { score: result.score, move: [r, c] };
        }
      } else if (result.score < best.score) {
        best = { score: result.score, move: [r, c] };
      }
    }

    return best;
  }

  const result = recurse(board.map((row) => [...row]), true, 0);
  return result.move;
}

function getAvailableMoves(board) {
  const moves = [];
  for (let r = 0; r < board.length; r += 1) {
    for (let c = 0; c < board.length; c += 1) {
      if (!board[r][c]) moves.push([r, c]);
    }
  }
  return moves;
}

function countDirection(board, row, col, dr, dc, symbol) {
  let total = 0;
  let r = row + dr;
  let c = col + dc;
  while (board[r] && board[r][c] === symbol) {
    total += 1;
    r += dr;
    c += dc;
  }
  return total;
}

function scoreMove(board, row, col, target, symbol) {
  const directions = [
    [[0, 1], [0, -1]],
    [[1, 0], [-1, 0]],
    [[1, 1], [-1, -1]],
    [[1, -1], [-1, 1]]
  ];

  let best = 0;

  for (const [a, b] of directions) {
    const total = 1
      + countDirection(board, row, col, a[0], a[1], symbol)
      + countDirection(board, row, col, b[0], b[1], symbol);
    if (total >= target) return 100000;
    best = Math.max(best, total);
  }

  return best * best;
}

function proximityScore(board, row, col) {
  let score = 0;
  for (let r = Math.max(0, row - 1); r <= Math.min(board.length - 1, row + 1); r += 1) {
    for (let c = Math.max(0, col - 1); c <= Math.min(board.length - 1, col + 1); c += 1) {
      if (board[r][c]) score += 2;
    }
  }

  const center = (board.length - 1) / 2;
  const distance = Math.abs(row - center) + Math.abs(col - center);
  score += Math.max(0, board.length - distance);
  return score;
}

export function heuristicMove(board, target, aiSymbol = 'O', humanSymbol = 'X') {
  const moves = getAvailableMoves(board);
  if (moves.length === 0) return null;

  let bestScore = -Infinity;
  let bestMoves = [];

  for (const [row, col] of moves) {
    const attack = scoreMove(board, row, col, target, aiSymbol);
    const defense = scoreMove(board, row, col, target, humanSymbol);
    const position = proximityScore(board, row, col);
    const score = attack * 1.15 + defense + position;

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [[row, col]];
    } else if (score === bestScore) {
      bestMoves.push([row, col]);
    }
  }

  return randomItem(bestMoves);
}

function heuristicMoveEasy(board, target, aiSymbol = 'O', humanSymbol = 'X') {
  const moves = getAvailableMoves(board);
  if (moves.length === 0) return null;

  let bestScore = -Infinity;
  let bestMoves = [];

  for (const [row, col] of moves) {
    const attack = scoreMove(board, row, col, target, aiSymbol);
    const defense = scoreMove(board, row, col, target, humanSymbol);
    const score = attack * 0.8 + defense;

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [[row, col]];
    } else if (score === bestScore) {
      bestMoves.push([row, col]);
    }
  }

  return randomItem(bestMoves);
}

function canWinNextMove(board, target, symbol) {
  const moves = getAvailableMoves(board);
  for (const [row, col] of moves) {
    board[row][col] = symbol;
    const s = scoreMove(board, row, col, target, symbol);
    board[row][col] = '';
    if (s >= 100000) return [row, col];
  }
  return null;
}

function heuristicMoveHard(board, target, aiSymbol = 'O', humanSymbol = 'X') {
  const threatBlock = canWinNextMove(board, target, humanSymbol);
  if (threatBlock) {
    board[threatBlock[0]][threatBlock[1]] = aiSymbol;
    const selfWin = scoreMove(board, threatBlock[0], threatBlock[1], target, aiSymbol);
    board[threatBlock[0]][threatBlock[1]] = '';
  }

  const winMove = canWinNextMove(board, target, aiSymbol);
  if (winMove) return winMove;

  if (threatBlock) return threatBlock;

  return heuristicMove(board, target, aiSymbol, humanSymbol);
}

function minimaxWithRandomness(board, randomChance, aiSymbol, humanSymbol) {
  if (Math.random() < randomChance) {
    const moves = getAvailableMoves(board);
    if (moves.length > 0) return randomItem(moves);
  }
  return minimaxMove(board, aiSymbol, humanSymbol);
}

export function getAiMoveWithDifficulty(board, target, difficulty = 'hard', aiSymbol = 'O', humanSymbol = 'X') {
  const is3x3 = board.length === 3;

  if (difficulty === 'easy') {
    if (is3x3) {
      return minimaxWithRandomness(board, 0.4, aiSymbol, humanSymbol)
        || heuristicMoveEasy(board, target, aiSymbol, humanSymbol);
    }
    return heuristicMoveEasy(board, target, aiSymbol, humanSymbol);
  }

  if (difficulty === 'medium') {
    if (is3x3) {
      return minimaxWithRandomness(board, 0.15, aiSymbol, humanSymbol)
        || heuristicMove(board, target, aiSymbol, humanSymbol);
    }
    return heuristicMove(board, target, aiSymbol, humanSymbol);
  }

  if (is3x3) {
    return minimaxMove(board, aiSymbol, humanSymbol)
      || heuristicMove(board, target, aiSymbol, humanSymbol);
  }
  return heuristicMoveHard(board, target, aiSymbol, humanSymbol);
}

export function getAiMove(board, target, aiSymbol = 'O', humanSymbol = 'X') {
  return getAiMoveWithDifficulty(board, target, 'hard', aiSymbol, humanSymbol);
}
