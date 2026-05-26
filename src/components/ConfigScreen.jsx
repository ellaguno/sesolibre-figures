import React from 'react';
import logo from '../assets/gemas3.png';
import { FIGURE_SET_OPTIONS } from '../game/figures';
import { TOTAL_MOVES } from '../game/board';

const ConfigScreen = ({ config, setConfig, startGame, highScore }) => {
  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg">
      <img src={logo} alt="Figures" className="max-w-full h-auto" />
      <button
        onClick={startGame}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-2"
      >
        Play
      </button>
      {highScore > 0 && (
        <p className="text-gray-600 mb-4">
          Best score: <strong>{highScore}</strong>
        </p>
      )}
      <hr className="w-full border-t border-gray-300 my-6" />
      <h3 className="text-2xl font-bold mb-4">Options</h3>
      <div className="w-full max-w-md">
        <div className="mb-4 flex justify-between items-center">
          <label className="mr-2">
            <strong>Figures:</strong>
          </label>
          <select
            value={config.figureType}
            onChange={(e) => setConfig({ ...config, figureType: e.target.value })}
            className="p-2 border rounded"
          >
            {FIGURE_SET_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4 flex justify-between items-center">
          <label className="mr-2">Game Mode:</label>
          <select
            value={config.limitedMoves ? 'limited' : 'unlimited'}
            onChange={(e) => setConfig({ ...config, limitedMoves: e.target.value === 'limited' })}
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
            onChange={(e) =>
              setConfig({ ...config, verticalMovement: e.target.value === 'vertical' })
            }
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
            onClick={() => setConfig({ ...config, sound: !config.sound })}
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
          <span className="font-bold">Development</span>{' '}
          <a href="https://sesolibre.com" className="text-blue-500 hover:underline">
            Eduardo Llaguno
          </a>
        </p>
        <p className="mb-2">
          <span className="font-bold">Animals</span> de{' '}
          <a
            href="https://www.freepik.es/vector-gratis/paquete-dibujos-animales_762718.htm"
            className="text-blue-500 hover:underline"
          >
            Freepik
          </a>
        </p>
        <p className="mb-2">
          <span className="font-bold">Numbers</span> Image by{' '}
          <a
            href="https://pixabay.com/users/jackielin1-19315469/"
            className="text-blue-500 hover:underline"
          >
            Jaquelin Lassen
          </a>{' '}
          from{' '}
          <a href="https://pixabay.com/" className="text-blue-500 hover:underline">
            Pixabay
          </a>
        </p>
        <p className="mb-2">
          <span className="font-bold">Letters</span> Image by{' '}
          <a href="https://pixabay.com/users/suxu-269261/" className="text-blue-500 hover:underline">
            Suxu
          </a>{' '}
          from{' '}
          <a href="https://pixabay.com/" className="text-blue-500 hover:underline">
            Pixabay
          </a>
        </p>
        <p className="mb-2">
          <span className="font-bold">Katakana</span>{' '}
          <a
            href="https://commons.wikimedia.org/wiki/File:Katakana_origine.svg"
            className="text-blue-500 hover:underline"
          >
            Wikimedia
          </a>
        </p>
        <p className="mb-2">
          <span className="font-bold">Sound</span>{' '}
          <a href="https://pixabay.com/sound-effects" className="text-blue-500 hover:underline">
            Pixabay Soundeffects
          </a>
        </p>
      </div>
    </div>
  );
};

export default ConfigScreen;
