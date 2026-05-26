import React, { useRef } from 'react';
import { figureTypes } from '../game/figures';

const SWIPE_THRESHOLD = 18; // px of travel before a press counts as a swipe

// A single board cell. A short press/tap selects the cell (classic tap-tap
// swap); a drag past the threshold reports a swipe direction so the board can
// swap with the neighbour in that direction (natural on touch screens).
const Gem = ({
  type,
  figureType,
  isDestroying,
  isSelected,
  isNew,
  newPosition,
  vertical,
  onSelect,
  onSwipe,
}) => {
  const start = useRef(null);

  const handlePointerDown = (e) => {
    start.current = { x: e.clientX, y: e.clientY };
    // Capture so the matching pointerup fires on this same cell even if the
    // finger drifts onto a neighbour.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* not all environments support pointer capture */
    }
  };

  const handlePointerUp = (e) => {
    const origin = start.current;
    start.current = null;
    if (!origin) {
      onSelect();
      return;
    }
    const dx = e.clientX - origin.x;
    const dy = e.clientY - origin.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
      onSelect();
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) {
      onSwipe(dx > 0 ? 'right' : 'left');
    } else {
      onSwipe(dy > 0 ? 'down' : 'up');
    }
  };

  const animationClass = isNew ? (vertical ? 'animate-fall' : 'animate-slide') : '';
  const style = isNew
    ? vertical
      ? { '--fall-start': `${-newPosition * 50}px` }
      : { '--slide-start': `${-newPosition * 50}px` }
    : {};

  return (
    <div
      className={`relative aspect-square select-none touch-none cursor-pointer ${
        isSelected ? 'scale-110 z-10' : ''
      } transition-transform duration-200 ${animationClass}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={style}
    >
      {type && figureTypes[figureType][type] && (
        <img
          src={figureTypes[figureType][type]}
          alt={type}
          draggable={false}
          className={`w-full h-full object-contain pointer-events-none ${
            isDestroying ? 'animate-destruction' : ''
          } ${isSelected ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}
        />
      )}
    </div>
  );
};

export default Gem;
