import React, { useEffect, useRef } from 'react';

interface SudokuBoardProps {
  board: number[][];
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
  isDarkMode: boolean;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ board, selectedCell, onCellClick, isDarkMode }) => {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const [currentRow, currentCol] = selectedCell;
      let newRow = currentRow;
      let newCol = currentCol;

      switch (e.key) {
        case 'ArrowUp':
          newRow = Math.max(0, currentRow - 1);
          break;
        case 'ArrowDown':
          newRow = Math.min(8, currentRow + 1);
          break;
        case 'ArrowLeft':
          newCol = Math.max(0, currentCol - 1);
          break;
        case 'ArrowRight':
          newCol = Math.min(8, currentCol + 1);
          break;
        default:
          return;
      }

      if (newRow !== currentRow || newCol !== currentCol) {
        e.preventDefault();
        onCellClick(newRow, newCol);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, onCellClick]);

  useEffect(() => {
    if (selectedCell && boardRef.current) {
      const cellElement = boardRef.current.children[selectedCell[0] * 9 + selectedCell[1]] as HTMLElement;
      cellElement.focus();
    }
  }, [selectedCell]);

  return (
    <div
      ref={boardRef}
      className={`grid grid-cols-9 gap-0 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} p-0.5 border ${isDarkMode ? 'border-gray-500' : 'border-gray-400'}`}
      role="grid"
      aria-label="Sudoku Board"
      style={{ aspectRatio: '1 / 1', width: '100%', maxWidth: '500px' }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`aspect-square flex items-center justify-center text-sm sm:text-base md:text-lg font-bold cursor-pointer
              ${cell === 0 ? (isDarkMode ? 'bg-gray-700' : 'bg-white') : (isDarkMode ? 'bg-gray-600' : 'bg-gray-100')}
              ${selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex ? 'ring-2 ring-blue-500' : ''}
              ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-gray-400' : 'border-b border-gray-300'}
              ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-gray-400' : 'border-r border-gray-300'}
              ${isDarkMode ? 'text-white' : 'text-black'}
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            onClick={() => onCellClick(rowIndex, colIndex)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onCellClick(rowIndex, colIndex);
              }
            }}
            tabIndex={0}
            role="gridcell"
            aria-rowindex={rowIndex + 1}
            aria-colindex={colIndex + 1}
            aria-selected={selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex}
            aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}, ${cell === 0 ? 'Empty' : cell}`}
          >
            {cell !== 0 ? cell : ''}
          </div>
        ))
      )}
    </div>
  );
};

export default SudokuBoard;