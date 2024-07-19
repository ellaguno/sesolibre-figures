import React, { useState, useCallback, useRef } from 'react';

import logo from './assets/gemas3.png';

import DiamanteSVG from  './assets/diamante.svg';
import CorazonSVG  from './assets/corazon.svg';
import EsmeraldaSVG  from './assets/esmeralda.svg';
import RosaSVG from './assets/rosa.svg';

import RabbitSVG from  './assets/mapache.svg';
import DogSVG  from './assets/zorro.svg';
import DolphinSVG  from './assets/catarina.svg';
import BirdSVG from './assets/oso.svg';

import UnoSVG from './assets/uno.svg';
import DosSVG from './assets/dos.svg';
import TresSVG from './assets/tres.svg';
import CuatroSVG from './assets/cuatro.svg';

import ASVG from './assets/A.svg';
import BSVG from './assets/B.svg';
import CSVG from './assets/C.svg';
import DSVG from './assets/D.svg';

import zeroSVG from './assets/zero.svg';
import oneSVG from './assets/one.svg';
import psiSVG from './assets/psi.svg';
import phiSVG from './assets/phi.svg';

const BOARD_SIZE = 8;
const TOTAL_MOVES = 20;

const gemSVGs = {
  diamante: DiamanteSVG,
  corazon: CorazonSVG,
  esmeralda: EsmeraldaSVG,
  rosa: RosaSVG
};

const matrixSVGs = {
  zero: zeroSVG,
  one: oneSVG,
  phi: phiSVG,
  psi: psiSVG
};

const letterSVGs = {
  A: ASVG,
  B: BSVG,
  C: CSVG,
  D: DSVG
};

const numberSVGs = {
  one: UnoSVG,
  two: DosSVG,
  three: TresSVG,
  four: CuatroSVG
};

const animalSVGs = {
  rabbit: RabbitSVG,
  dog: DogSVG,
  dolphin: DolphinSVG,
  bird: BirdSVG
};

const figureTypes = {
  gems: gemSVGs,
  matrix: matrixSVGs,
  letters: letterSVGs,
  numbers: numberSVGs,
  animals: animalSVGs
};

const Gem = ({ type, figureType, onClick, isDestroying, isSelected, isNew, newPosition, config }) => {
  const animationClass = isNew
    ? config.verticalMovement
      ? 'animate-fall'
      : 'animate-slide'
    : '';

  const style = isNew
    ? config.verticalMovement
      ? { '--fall-start': `${-newPosition * 50}px` }
      : { '--slide-start': `${(BOARD_SIZE - newPosition) * 50}px` }
    : {};

  return (
    <div 
      className={`relative ${isSelected ? 'scale-110 z-10' : ''} transition-transform duration-200 ${animationClass}`}
      onClick={onClick}
      style={style}
    >
      {type && figureTypes[figureType][type] && (
        <img 
          src={figureTypes[figureType][type]}
          alt={type}
          width="40"
          height="40"
          className={`
            ${isDestroying ? 'animate-destruction' : ''}
            ${isSelected ? 'ring-2 ring-blue-500 rounded-lg' : ''}
          `}
        />
      )}
    </div>
  );
};

const ConfigScreen = ({ config, setConfig, startGame }) => {
  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg">
      <img src={logo} alt=''/>
      <button 
        onClick={startGame}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-6"
      >
        Play
      </button>
      <hr className="w-full border-t border-gray-300 my-6" />
      <h3 className="text-2xl font-bold mb-4">Options</h3>
      <div className="w-full max-w-md">
        <div className="mb-4 flex justify-between items-center">
          <label className="mr-2"><strong>Figures:</strong></label>
          <select 
            value={config.figureType} 
            onChange={(e) => setConfig({...config, figureType: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="animals">Animals</option>
            <option value="gems">Gems</option>
            <option value="matrix">Katakana</option>
            <option value="letters">Letters</option>
            <option value="numbers">Numbers</option>
          </select>
        </div>
        <div className="mb-4 flex justify-between items-center">
          <label className="mr-2">Game Mode:</label>
          <select 
            value={config.limitedMoves ? 'limited' : 'unlimited'} 
            onChange={(e) => setConfig({...config, limitedMoves: e.target.value === 'limited'})}
            className="p-2 border rounded"
          >
            <option value="limited">{TOTAL_MOVES} Moves</option>
            <option value="unlimited">Unlimited</option>
          </select>
        </div>
        <div className="mb-4 flex justify-between items-center">
          <label className="mr-2">Movement direction:</label>
          <select 
            value={config.verticalMovement ? 'vertical' : 'horizontal'} 
            onChange={(e) => setConfig({...config, verticalMovement: e.target.value === 'vertical'})}
            className="p-2 border rounded"
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>
        <div className="mb-4 flex justify-between items-center">
          <label className="mr-2">Sound:</label>
          <div 
            className={`relative w-14 h-7 flex items-center rounded-full p-1 cursor-pointer ${
              config.sound ? 'bg-green-400' : 'bg-gray-300'
            }`}
            onClick={() => setConfig({...config, sound: !config.sound})}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                config.sound ? 'translate-x-7' : ''
              }`}
            ></div>
          </div>
        </div>
      </div>
      <hr className="w-full border-t border-gray-300 my-6" />
      <div className="text-sm text-gray-600 max-w-md">
        <h3 className="font-bold text-lg mb-2">Credits</h3>
        <p className="mb-2">
          <span className="font-bold">Development</span> <a href='https://sesolibre.com' className="text-blue-500 hover:underline">Eduardo Llaguno</a>
        </p>
        <p className="mb-2">
          <span className="font-bold">Animals</span> de <a href="https://www.freepik.es/vector-gratis/paquete-dibujos-animales_762718.htm#query=animales%20del%20bosque&position=19&from_view=keyword&track=ais_user&uuid=d143c6fa-7ac4-4c9f-894a-4f41c01f9d8e" className="text-blue-500 hover:underline">Freepik</a>
        </p>
        <p className="mb-2">
          <span className="font-bold">Numbers</span> Image by <a href="https://pixabay.com/users/jackielin1-19315469/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7675885" className="text-blue-500 hover:underline">Jaquelin Lassen</a> from <a href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7675885" className="text-blue-500 hover:underline">Pixabay</a>
        </p>
        <p className="mb-2">
          <span className="font-bold">Letters</span> Image by <a href="https://pixabay.com/users/suxu-269261/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1168050" className="text-blue-500 hover:underline">Suxu</a> from <a href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1168050" className="text-blue-500 hover:underline">Pixabay</a>
        </p>
        <p className="mb-2">
          <span className="font-bold">Katakana</span> <a href="https://commons.wikimedia.org/wiki/File:Katakana_origine.svg" className="text-blue-500 hover:underline">Wikimedia</a>
        </p>
        <p className="mb-2">
          <span className="font-bold">Sound</span> <a href="https://pixabay.com/sound-effects" className="text-blue-500 hover:underline">Pixabay Soundeffects</a>
        </p>
      </div>
    </div>
  );
};

const SesoLibreGame = () => {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [destroyingGems, setDestroyingGems] = useState([]);
  const [newGems, setNewGems] = useState([]);
  const [movesLeft, setMovesLeft] = useState(TOTAL_MOVES);
  const [gameOver, setGameOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const [config, setConfig] = useState({
    limitedMoves: true,
    verticalMovement: true,
    sound: true,
    figureType: 'animals'
  });
  const audioRef = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/match.mp3`));

  const playSound = useCallback(() => {
    if (config.sound) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.error('Error playing sound:', error));
    }
  }, [config.sound]);

  const getRandomFigure = useCallback(() => {
    const figures = Object.keys(figureTypes[config.figureType]);
    return figures[Math.floor(Math.random() * figures.length)];
  }, [config.figureType]);

  const initializeBoard = useCallback(() => {
    const newBoard = Array(BOARD_SIZE).fill().map(() =>
      Array(BOARD_SIZE).fill().map(() => getRandomFigure())
    );
    setBoard(newBoard);
    setScore(0);
    setMovesLeft(TOTAL_MOVES);
    setGameOver(false);
    setIsProcessing(false);
    setShowConfig(false);
  }, [getRandomFigure]);

  const handleGemClick = (row, col) => {
    if (gameOver || isProcessing || (config.limitedMoves && movesLeft <= 0)) return;
    
    if (!selected) {
      setSelected({ row, col });
    } else {
      const { row: selectedRow, col: selectedCol } = selected;
      if (
        (Math.abs(row - selectedRow) === 1 && col === selectedCol) ||
        (Math.abs(col - selectedCol) === 1 && row === selectedRow)
      ) {
        swapFigures(selectedRow, selectedCol, row, col);
        if (config.limitedMoves) {
          setMovesLeft(prevMoves => prevMoves - 1);
        }
      }
      setSelected(null);
    }
  };

  const swapFigures = (row1, col1, row2, col2) => {
    setIsProcessing(true);
    const newBoard = JSON.parse(JSON.stringify(board));
    [newBoard[row1][col1], newBoard[row2][col2]] = [newBoard[row2][col2], newBoard[row1][col1]];
    
    const hasMatches = checkMatches(newBoard);
    
    if (!hasMatches) {
      // Roll back the move
      setTimeout(() => {
        [newBoard[row1][col1], newBoard[row2][col2]] = [newBoard[row2][col2], newBoard[row1][col1]];
        setBoard(newBoard);
        setIsProcessing(false);
      }, 500);  // Delay to show the invalid move before rolling back
    } else {
      setBoard(newBoard);
    }
  };

  const checkMatches = (currentBoard) => {
    let matches = [];
    // Check horizontal matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE - 2; col++) {
        if (
          currentBoard[row][col] === currentBoard[row][col + 1] &&
          currentBoard[row][col] === currentBoard[row][col + 2]
        ) {
          matches.push({ row, col }, { row, col: col + 1 }, { row, col: col + 2 });
        }
      }
    }
    // Check vertical matches
    for (let row = 0; row < BOARD_SIZE - 2; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (
          currentBoard[row][col] === currentBoard[row + 1][col] &&
          currentBoard[row][col] === currentBoard[row + 2][col]
        ) {
          matches.push({ row, col }, { row: row + 1, col }, { row: row + 2, col });
        }
      }
    }
    if (matches.length > 0) {
      setDestroyingGems(matches);
      playSound();
      setTimeout(() => removeMatches(currentBoard, matches), 500);
      return true;
    } else {
      if (config.limitedMoves && movesLeft <= 1) {
        setGameOver(true);
      }
      setIsProcessing(false);
      return false;
    }
  };
  

  const removeMatches = (currentBoard, matches) => {
    const newBoard = currentBoard.map(row => [...row]);
    matches.forEach(({ row, col }) => {
      newBoard[row][col] = null;
    });
    setScore(prevScore => prevScore + matches.length);
    setDestroyingGems([]);
    fillEmptySpaces(newBoard);
  };

  const fillEmptySpaces = (currentBoard) => {
    let filledBoard = JSON.parse(JSON.stringify(currentBoard));  // Deep copy
    let newGems = [];
  
    if (config.verticalMovement) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        let emptySpaces = 0;
        for (let row = BOARD_SIZE - 1; row >= 0; row--) {
          if (filledBoard[row][col] === null) {
            emptySpaces++;
          } else if (emptySpaces > 0) {
            filledBoard[row + emptySpaces][col] = filledBoard[row][col];
            filledBoard[row][col] = null;
          }
        }
        for (let row = 0; row < emptySpaces; row++) {
          const newGem = getRandomFigure();
          filledBoard[row][col] = newGem;
          newGems.push({ row, col, type: newGem });
        }
      }
    } else {
      for (let row = 0; row < BOARD_SIZE; row++) {
        let emptySpaces = filledBoard[row].filter(gem => gem === null).length;
        let filledRow = filledBoard[row].filter(gem => gem !== null);
        let newRow = Array(emptySpaces).fill().map(() => {
          const newGem = getRandomFigure();
          newGems.push({ row, col: filledRow.length, type: newGem });
          return newGem;
        });
        filledBoard[row] = [...filledRow, ...newRow];
      }
    }
  
    setBoard(filledBoard);
    setNewGems(newGems);
    setTimeout(() => {
      setNewGems([]);
      checkMatches(filledBoard);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center">
      {showConfig ? (
        <ConfigScreen config={config} setConfig={setConfig} startGame={initializeBoard} />
      ) : (
        <>
 
          
          {gameOver ? (
            <div className="text-center">
              <img src={logo} alt=''/>
              <h3 className="text-xl font-bold mb-2">Game Over!</h3>
              <h3 className="text-2xl mb-4">Your final score is: <strong>{score}</strong></h3>
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={initializeBoard}
              >
                Play Again
              </button>
              <button 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowConfig(true)}
              >
                Options
              </button>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-8 gap-1 bg-gray-200 p-2 rounded mb-4">
                {board.map((row, rowIndex) =>
                  row.map((gem, colIndex) => (
                    <Gem
                      key={`${rowIndex}-${colIndex}`}
                      type={gem}
                      figureType={config.figureType}
                      onClick={() => handleGemClick(rowIndex, colIndex)}
                      isDestroying={destroyingGems.some(g => g.row === rowIndex && g.col === colIndex)}
                      isSelected={selected && selected.row === rowIndex && selected.col === colIndex}
                      isNew={newGems.some(g => g.row === rowIndex && g.col === colIndex)}
                      newPosition={newGems.findIndex(g => g.row === rowIndex && g.col === colIndex)}
                      config={config}
                    />
                  ))
                )}
              </div>
              {<div className="mb-4"><strong><h3>Score: {score}</h3></strong></div>}
              {config.limitedMoves && <div className="mb-6">Remaining Moves: {movesLeft}</div>}
              <button 
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowConfig(true)}
              >
                Options
              </button>
            </>
          )}
        </>
      )}
      <style jsx global>{`
        @keyframes destruction {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
          100% { transform: scale(0); opacity: 0; }
        }
        .animate-destruction {
          animation: destruction 0.5s ease-out;
        }
        @keyframes fall {
          from { transform: translateY(var(--fall-start)); }
          to { transform: translateY(0); }
        }
        .animate-fall {
          animation: fall 0.5s ease-out;
        }
        @keyframes slide {
          from { transform: translateX(var(--slide-start)); }
          to { transform: translateX(0); }
        }
        .animate-slide {
          animation: slide 0.5s ease-out;
        }
      `}</style>
      <hr className="w-full border-t border-gray-300 my-6" />
      <h2 className="text-2xl mb-6">SesoLibre Games</h2>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <SesoLibreGame />
    </div>
  );
}

export default App;