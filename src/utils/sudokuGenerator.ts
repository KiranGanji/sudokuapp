import { DifficultyLevel } from '../types';

const EMPTY_CELL = 0;

function generateSudoku(difficulty: DifficultyLevel): { puzzle: number[][], solution: number[][] } {
  const solution = generateSolution();
  const puzzle = removeCells(solution, difficulty);
  return { puzzle, solution };
}

function generateSolution(): number[][] {
  const board = Array(9).fill(null).map(() => Array(9).fill(EMPTY_CELL));
  solveSudoku(board);
  return board;
}

function solveSudoku(board: number[][]): boolean {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) return true;

  const [row, col] = emptyCell;
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudoku(board)) return true;
      board[row][col] = EMPTY_CELL;
    }
  }

  return false;
}

function findEmptyCell(board: number[][]): [number, number] | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === EMPTY_CELL) return [row, col];
    }
  }
  return null;
}

function isValid(board: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }

  return true;
}

function removeCells(board: number[][], difficulty: DifficultyLevel): number[][] {
  const puzzle = board.map(row => [...row]);
  const cellsToRemove = getDifficultyRemovalCount(difficulty);

  for (let i = 0; i < cellsToRemove; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    } while (puzzle[row][col] === EMPTY_CELL);

    puzzle[row][col] = EMPTY_CELL;
  }

  return puzzle;
}

function getDifficultyRemovalCount(difficulty: DifficultyLevel): number {
  switch (difficulty) {
    case 'Easy': return 30;
    case 'Medium': return 40;
    case 'Hard': return 50;
    case 'Extreme': return 60;
    default: return 30;
  }
}

export { generateSudoku, solveSudoku };