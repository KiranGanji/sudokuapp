import React from 'react';

interface NumberPadProps {
  onNumberClick: (number: number) => void;
  isDarkMode: boolean;
}

const NumberPad: React.FC<NumberPadProps> = ({ onNumberClick, isDarkMode }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          onClick={() => onNumberClick(num)}
          className={`${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-black'
          } text-base sm:text-lg md:text-xl font-bold aspect-square flex items-center justify-center rounded border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default NumberPad;