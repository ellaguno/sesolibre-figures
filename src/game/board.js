// Pure, side-effect-free match-3 board logic. Everything here returns new data
// structures so it can be unit tested and reasoned about independently from the
// React rendering / animation layer.

import { figureTypes } from './figures';

export const BOARD_SIZE = 8;
export const TOTAL_MOVES = 20;

export function figureKeys(figureType) {
  return Object.keys(figureTypes[figureType]);
}

export function randomFigure(figureType) {
  const keys = figureKeys(figureType);
  return keys[Math.floor(Math.random() * keys.length)];
}

// Returns the list of matched cells ({row, col}) for runs of 3+ in a row/column.
// Uses a Set so a cell that belongs to both a horizontal and vertical match is
// only reported once.
export function findMatches(board) {
  const matched = new Set();
  const add = (row, col) => matched.add(`${row},${col}`);

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE - 2; col++) {
      const v = board[row][col];
      if (v != null && v === board[row][col + 1] && v === board[row][col + 2]) {
        add(row, col);
        add(row, col + 1);
        add(row, col + 2);
      }
    }
  }
  for (let row = 0; row < BOARD_SIZE - 2; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const v = board[row][col];
      if (v != null && v === board[row + 1][col] && v === board[row + 2][col]) {
        add(row, col);
        add(row + 1, col);
        add(row + 2, col);
      }
    }
  }

  return [...matched].map((key) => {
    const [row, col] = key.split(',').map(Number);
    return { row, col };
  });
}

export function hasMatches(board) {
  return findMatches(board).length > 0;
}

// Builds a fresh board guaranteed to have no pre-existing matches (so the game
// never starts with free, un-clearable lines) while still containing at least
// one valid move.
export function createBoard(figureType) {
  let board;
  do {
    board = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => randomFigure(figureType))
    );
    // Re-roll any cell that completes a run as we go: cheap and avoids deadlocks.
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const forbidden = new Set();
        if (col >= 2 && board[row][col - 1] === board[row][col - 2]) {
          forbidden.add(board[row][col - 1]);
        }
        if (row >= 2 && board[row - 1][col] === board[row - 2][col]) {
          forbidden.add(board[row - 1][col]);
        }
        if (forbidden.has(board[row][col])) {
          const choices = figureKeys(figureType).filter((k) => !forbidden.has(k));
          board[row][col] = choices[Math.floor(Math.random() * choices.length)];
        }
      }
    }
  } while (!hasValidMove(board));

  return board;
}

export function areAdjacent(a, b) {
  return (
    (Math.abs(a.row - b.row) === 1 && a.col === b.col) ||
    (Math.abs(a.col - b.col) === 1 && a.row === b.row)
  );
}

export function swap(board, a, b) {
  const next = board.map((row) => [...row]);
  [next[a.row][a.col], next[b.row][b.col]] = [next[b.row][b.col], next[a.row][a.col]];
  return next;
}

export function removeMatches(board, matches) {
  const next = board.map((row) => [...row]);
  matches.forEach(({ row, col }) => {
    next[row][col] = null;
  });
  return next;
}

// Collapses empty (null) cells and refills with new figures. `vertical` controls
// whether gravity pulls down (true) or sideways from the right (false), matching
// the two movement modes. Returns the filled board plus the list of newly
// spawned cells (for the entrance animation).
export function fillEmptySpaces(board, vertical, figureType) {
  const next = board.map((row) => [...row]);
  const newGems = [];

  if (vertical) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      let empty = 0;
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (next[row][col] === null) {
          empty++;
        } else if (empty > 0) {
          next[row + empty][col] = next[row][col];
          next[row][col] = null;
        }
      }
      for (let row = 0; row < empty; row++) {
        const gem = randomFigure(figureType);
        next[row][col] = gem;
        newGems.push({ row, col, type: gem });
      }
    }
  } else {
    for (let row = 0; row < BOARD_SIZE; row++) {
      const survivors = next[row].filter((gem) => gem !== null);
      const emptyCount = BOARD_SIZE - survivors.length;
      const spawned = Array.from({ length: emptyCount }, () => randomFigure(figureType));
      next[row] = [...spawned, ...survivors];
      spawned.forEach((gem, index) => newGems.push({ row, col: index, type: gem }));
    }
  }

  return { board: next, newGems };
}

// True if at least one adjacent swap would create a match. Used to decide when
// the board must be reshuffled.
export function hasValidMove(board) {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (col < BOARD_SIZE - 1) {
        const trial = swap(board, { row, col }, { row, col: col + 1 });
        if (hasMatches(trial)) return true;
      }
      if (row < BOARD_SIZE - 1) {
        const trial = swap(board, { row, col }, { row: row + 1, col });
        if (hasMatches(trial)) return true;
      }
    }
  }
  return false;
}

// Randomly permutes all cells until the result has no immediate matches but at
// least one valid move. Falls back to a fresh board if a good shuffle isn't
// found quickly (extremely unlikely).
export function reshuffle(board, figureType) {
  const flat = board.flat();
  for (let attempt = 0; attempt < 50; attempt++) {
    for (let i = flat.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [flat[i], flat[j]] = [flat[j], flat[i]];
    }
    const candidate = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      candidate.push(flat.slice(row * BOARD_SIZE, (row + 1) * BOARD_SIZE));
    }
    if (!hasMatches(candidate) && hasValidMove(candidate)) {
      return candidate;
    }
  }
  return createBoard(figureType);
}
