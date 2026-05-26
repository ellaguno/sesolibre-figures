import React, { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';

import logo from './assets/gemas3.png';
import Gem from './components/Gem';
import ConfigScreen from './components/ConfigScreen';
import {
  BOARD_SIZE,
  TOTAL_MOVES,
  createBoard,
  areAdjacent,
  swap,
  findMatches,
  removeMatches,
  fillEmptySpaces,
  hasValidMove,
  reshuffle,
} from './game/board';

const HIGH_SCORE_KEY = 'sesolibre-figures-highscore';
const MATCH_ANIM_MS = 500; // keep in sync with the destruction/fall keyframes
const INVALID_REVERT_MS = 350;

const DIRECTION_DELTA = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

const loadHighScore = () => {
  const stored = Number(localStorage.getItem(HIGH_SCORE_KEY));
  return Number.isFinite(stored) ? stored : 0;
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
  const [reshuffled, setReshuffled] = useState(false);
  const [highScore, setHighScore] = useState(loadHighScore);
  const [config, setConfig] = useState({
    limitedMoves: true,
    verticalMovement: true,
    sound: true,
    figureType: 'animals',
  });

  const audioRef = useRef(null);
  // Mirror moves/score in refs so the async cascade chain reads fresh values
  // instead of values captured in a stale render closure.
  const movesLeftRef = useRef(TOTAL_MOVES);
  const scoreRef = useRef(0);

  useEffect(() => {
    audioRef.current = new Audio(`${process.env.PUBLIC_URL}/sounds/match.mp3`);
  }, []);

  const playSound = useCallback(() => {
    if (config.sound && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => console.error('Error playing sound:', error));
    }
  }, [config.sound]);

  const initializeBoard = useCallback(() => {
    setBoard(createBoard(config.figureType));
    setScore(0);
    scoreRef.current = 0;
    setMovesLeft(TOTAL_MOVES);
    movesLeftRef.current = TOTAL_MOVES;
    setGameOver(false);
    setIsProcessing(false);
    setSelected(null);
    setShowConfig(false);
    setReshuffled(false);
  }, [config.figureType]);

  const canInteract = !gameOver && !isProcessing && !(config.limitedMoves && movesLeft <= 0);

  const finishGame = useCallback(() => {
    setGameOver(true);
    setIsProcessing(false);
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
      localStorage.setItem(HIGH_SCORE_KEY, String(scoreRef.current));
    }
  }, [highScore]);

  // Settles all chain reactions for a move, then decides game-over / reshuffle.
  const resolve = useCallback(
    (currentBoard) => {
      const matches = findMatches(currentBoard);

      if (matches.length === 0) {
        if (config.limitedMoves && movesLeftRef.current <= 0) {
          finishGame();
          return;
        }
        if (!hasValidMove(currentBoard)) {
          setBoard(reshuffle(currentBoard, config.figureType));
          setReshuffled(true);
          setTimeout(() => setReshuffled(false), 1500);
        }
        setIsProcessing(false);
        return;
      }

      setDestroyingGems(matches);
      playSound();
      setTimeout(() => {
        const cleared = removeMatches(currentBoard, matches);
        scoreRef.current += matches.length;
        setScore(scoreRef.current);
        setDestroyingGems([]);
        const { board: filled, newGems: spawned } = fillEmptySpaces(
          cleared,
          config.verticalMovement,
          config.figureType
        );
        setBoard(filled);
        setNewGems(spawned);
        setTimeout(() => {
          setNewGems([]);
          resolve(filled);
        }, MATCH_ANIM_MS);
      }, MATCH_ANIM_MS);
    },
    [config.limitedMoves, config.verticalMovement, config.figureType, playSound, finishGame]
  );

  const trySwap = useCallback(
    (a, b) => {
      const swapped = swap(board, a, b);
      const matches = findMatches(swapped);

      if (matches.length === 0) {
        // Invalid: briefly show the swap, then revert.
        setIsProcessing(true);
        setBoard(swapped);
        setTimeout(() => {
          setBoard(board);
          setIsProcessing(false);
        }, INVALID_REVERT_MS);
        return;
      }

      setIsProcessing(true);
      if (config.limitedMoves) {
        movesLeftRef.current -= 1;
        setMovesLeft(movesLeftRef.current);
      }
      setBoard(swapped);
      resolve(swapped);
    },
    [board, config.limitedMoves, resolve]
  );

  const handleSelect = (row, col) => {
    if (!canInteract) return;
    if (!selected) {
      setSelected({ row, col });
      return;
    }
    if (selected.row === row && selected.col === col) {
      setSelected(null);
      return;
    }
    if (areAdjacent(selected, { row, col })) {
      const from = selected;
      setSelected(null);
      trySwap(from, { row, col });
    } else {
      setSelected({ row, col });
    }
  };

  const handleSwipe = (row, col, direction) => {
    if (!canInteract) return;
    setSelected(null);
    const delta = DIRECTION_DELTA[direction];
    const target = { row: row + delta.row, col: col + delta.col };
    if (target.row < 0 || target.row >= BOARD_SIZE || target.col < 0 || target.col >= BOARD_SIZE) {
      return;
    }
    trySwap({ row, col }, target);
  };

  const outOfMoves = config.limitedMoves && movesLeft <= 0;

  return (
    <div className="flex flex-col items-center px-2 py-4 w-full">
      {showConfig ? (
        <ConfigScreen
          config={config}
          setConfig={setConfig}
          startGame={initializeBoard}
          highScore={highScore}
        />
      ) : gameOver ? (
        <div className="text-center">
          <img src={logo} alt="Figures" className="max-w-full h-auto mx-auto" />
          <h3 className="text-xl font-bold mb-2">Game Over!</h3>
          <h3 className="text-2xl mb-2">
            Your final score is: <strong>{score}</strong>
          </h3>
          <p className="text-gray-600 mb-4">
            Best score: <strong>{highScore}</strong>
            {score >= highScore && score > 0 ? ' — New record! 🎉' : ''}
          </p>
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
          <div className="w-full max-w-md aspect-square">
            <div className="grid grid-cols-8 gap-1 bg-gray-200 p-2 rounded mb-4 w-full">
              {board.map((row, rowIndex) =>
                row.map((gem, colIndex) => (
                  <Gem
                    key={`${rowIndex}-${colIndex}`}
                    type={gem}
                    figureType={config.figureType}
                    vertical={config.verticalMovement}
                    onSelect={() => handleSelect(rowIndex, colIndex)}
                    onSwipe={(direction) => handleSwipe(rowIndex, colIndex, direction)}
                    isDestroying={destroyingGems.some(
                      (g) => g.row === rowIndex && g.col === colIndex
                    )}
                    isSelected={selected && selected.row === rowIndex && selected.col === colIndex}
                    isNew={newGems.some((g) => g.row === rowIndex && g.col === colIndex)}
                    newPosition={newGems.findIndex(
                      (g) => g.row === rowIndex && g.col === colIndex
                    )}
                  />
                ))
              )}
            </div>
          </div>
          <div className="mb-1">
            <strong>
              <h3>Score: {score}</h3>
            </strong>
          </div>
          <div className="mb-1 text-gray-600">Best: {highScore}</div>
          {config.limitedMoves && <div className="mb-2">Remaining Moves: {movesLeft}</div>}
          {reshuffled && <div className="mb-2 text-blue-600 font-semibold">No moves left — board reshuffled!</div>}
          {outOfMoves && <div className="mb-2 text-gray-600">No moves remaining.</div>}
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowConfig(true)}
          >
            Options
          </button>
        </>
      )}
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
