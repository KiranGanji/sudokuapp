import React, { useState, useEffect, useCallback } from 'react';
import { Clock, RefreshCw, Lightbulb, Undo2, Eraser, Play, Pause } from 'lucide-react';
import SudokuBoard from './components/SudokuBoard';
import NumberPad from './components/NumberPad';
import ThemeToggle from './components/ThemeToggle';
import { generateSudoku, solveSudoku } from './utils/sudokuGenerator';
import { DifficultyLevel } from './types';

function App() {
  const [board, setBoard] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Easy');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key >= '1' && event.key <= '9') {
        handleNumberInput(parseInt(event.key));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell, board, solution]);

  const handleCellClick = useCallback((row: number, col: number) => {
    setSelectedCell([row, col]);
  }, []);

  const startNewGame = () => {
    const { puzzle, solution } = generateSudoku(difficulty);
    setBoard(puzzle);
    setSolution(solution);
    setMistakes(0);
    setTime(0);
    setIsRunning(false);
    setSelectedCell(null);
  };

  const handleNumberInput = (number: number) => {
    if (selectedCell && board[selectedCell[0]][selectedCell[1]] === 0) {
      const newBoard = [...board];
      newBoard[selectedCell[0]][selectedCell[1]] = number;
      setBoard(newBoard);

      if (number !== solution[selectedCell[0]][selectedCell[1]]) {
        setMistakes((prev) => prev + 1);
        if (mistakes + 1 >= 3) {
          setIsRunning(false);
          alert('Game Over! You made 3 mistakes.');
        }
      }

      if (JSON.stringify(newBoard) === JSON.stringify(solution)) {
        setIsRunning(false);
        alert('Congratulations! You solved the puzzle!');
      }
    }
  };

  const handleUndo = () => {
    if (selectedCell && board[selectedCell[0]][selectedCell[1]] !== 0) {
      const newBoard = [...board];
      newBoard[selectedCell[0]][selectedCell[1]] = 0;
      setBoard(newBoard);
    }
  };

  const handleErase = () => {
    if (selectedCell) {
      const newBoard = [...board];
      newBoard[selectedCell[0]][selectedCell[1]] = 0;
      setBoard(newBoard);
    }
  };

  const handleHint = () => {
    if (selectedCell) {
      const newBoard = [...board];
      newBoard[selectedCell[0]][selectedCell[1]] = solution[selectedCell[0]][selectedCell[1]];
      setBoard(newBoard);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} flex flex-col items-center justify-center p-4`}>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Simple Sudoku</h1>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg w-full max-w-md md:max-w-2xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center mb-2 md:mb-0">
            <label htmlFor="difficulty" className="mr-2 text-sm md:text-base">Difficulty:</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className={`p-1 md:p-2 border rounded text-sm md:text-base ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Extreme">Extreme</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-base md:text-xl mr-4">Mistakes: {mistakes}/3</span>
            <Clock className="mr-2" size={16} />
            <span className="text-base md:text-xl">{formatTime(time)}</span>
            <button
              onClick={toggleTimer}
              className={`ml-2 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white px-2 py-1 rounded hover:bg-blue-600`}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={startNewGame}
              className={`${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-blue-600 text-sm md:text-base`}
            >
              <RefreshCw className="inline-block mr-2" size={16} />
              New Game
            </button>
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="mb-4 md:mb-0 w-full md:w-auto">
            <SudokuBoard board={board} selectedCell={selectedCell} onCellClick={handleCellClick} isDarkMode={isDarkMode} />
          </div>
          <div className="flex flex-col justify-between">
            <div className="mb-4 flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
              <button
                onClick={handleUndo}
                className={`${isDarkMode ? 'bg-yellow-600' : 'bg-yellow-500'} text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-yellow-600 text-sm md:text-base flex-1 md:flex-none`}
              >
                <Undo2 className="inline-block mr-2" size={16} />
                Undo
              </button>
              <button
                onClick={handleErase}
                className={`${isDarkMode ? 'bg-red-600' : 'bg-red-500'} text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-red-600 text-sm md:text-base flex-1 md:flex-none`}
              >
                <Eraser className="inline-block mr-2" size={16} />
                Erase
              </button>
              <button
                onClick={handleHint}
                className={`${isDarkMode ? 'bg-green-600' : 'bg-green-500'} text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-green-600 text-sm md:text-base flex-1 md:flex-none`}
              >
                <Lightbulb className="inline-block mr-2" size={16} />
                Hint
              </button>
            </div>
            <NumberPad onNumberClick={handleNumberInput} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;