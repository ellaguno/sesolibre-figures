import {
  BOARD_SIZE,
  createBoard,
  findMatches,
  hasMatches,
  swap,
  removeMatches,
  fillEmptySpaces,
  hasValidMove,
  reshuffle,
  areAdjacent,
} from './board';

describe('findMatches', () => {
  const blank = () =>
    Array.from({ length: BOARD_SIZE }, (_, r) =>
      Array.from({ length: BOARD_SIZE }, (_, c) => `x${r}-${c}`)
    );

  test('detects a horizontal run of three', () => {
    const board = blank();
    board[0][0] = board[0][1] = board[0][2] = 'a';
    const matches = findMatches(board);
    expect(matches).toEqual(
      expect.arrayContaining([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ])
    );
    expect(matches).toHaveLength(3);
  });

  test('detects a vertical run of three', () => {
    const board = blank();
    board[0][0] = board[1][0] = board[2][0] = 'b';
    expect(findMatches(board)).toHaveLength(3);
  });

  test('ignores null cells', () => {
    const board = blank();
    board[0][0] = board[0][1] = board[0][2] = null;
    expect(hasMatches(board)).toBe(false);
  });
});

describe('createBoard', () => {
  test('never starts with a pre-existing match and always has a valid move', () => {
    for (let i = 0; i < 20; i++) {
      const board = createBoard('gems');
      expect(hasMatches(board)).toBe(false);
      expect(hasValidMove(board)).toBe(true);
    }
  });
});

describe('swap / areAdjacent', () => {
  test('areAdjacent only for orthogonal neighbours', () => {
    expect(areAdjacent({ row: 0, col: 0 }, { row: 0, col: 1 })).toBe(true);
    expect(areAdjacent({ row: 0, col: 0 }, { row: 1, col: 1 })).toBe(false);
    expect(areAdjacent({ row: 0, col: 0 }, { row: 0, col: 2 })).toBe(false);
  });

  test('swap is immutable and exchanges the two cells', () => {
    const board = createBoard('gems');
    const a = { row: 0, col: 0 };
    const b = { row: 0, col: 1 };
    const original0 = board[0][0];
    const original1 = board[0][1];
    const next = swap(board, a, b);
    expect(next[0][0]).toBe(original1);
    expect(next[0][1]).toBe(original0);
    expect(board[0][0]).toBe(original0); // unchanged
  });
});

describe('fillEmptySpaces', () => {
  test('leaves no empty cells after a vertical fill', () => {
    let board = createBoard('gems');
    board = removeMatches(board, [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
    ]);
    const { board: filled } = fillEmptySpaces(board, true, 'gems');
    expect(filled.flat().some((cell) => cell === null)).toBe(false);
  });

  test('reports the spawned cells', () => {
    let board = createBoard('gems');
    board = removeMatches(board, [{ row: 0, col: 0 }]);
    const { newGems } = fillEmptySpaces(board, true, 'gems');
    expect(newGems.length).toBeGreaterThan(0);
  });
});

describe('reshuffle', () => {
  test('produces a board with a valid move and no immediate matches', () => {
    const board = createBoard('gems');
    const shuffled = reshuffle(board, 'gems');
    expect(hasMatches(shuffled)).toBe(false);
    expect(hasValidMove(shuffled)).toBe(true);
  });
});
