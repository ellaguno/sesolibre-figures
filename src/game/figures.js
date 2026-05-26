// Figure set definitions. Each SVG is imported as a URL (CRA default) and used
// as an <img> src. Keep the keys stable: they are the cell "type" values stored
// on the board.

import DiamanteSVG from '../assets/diamante.svg';
import CorazonSVG from '../assets/corazon.svg';
import EsmeraldaSVG from '../assets/esmeralda.svg';
import RosaSVG from '../assets/rosa.svg';

import RabbitSVG from '../assets/mapache.svg';
import DogSVG from '../assets/zorro.svg';
import DolphinSVG from '../assets/catarina.svg';
import BirdSVG from '../assets/oso.svg';

import UnoSVG from '../assets/uno.svg';
import DosSVG from '../assets/dos.svg';
import TresSVG from '../assets/tres.svg';
import CuatroSVG from '../assets/cuatro.svg';

import ASVG from '../assets/A.svg';
import BSVG from '../assets/B.svg';
import CSVG from '../assets/C.svg';
import DSVG from '../assets/D.svg';

import zeroSVG from '../assets/zero.svg';
import oneSVG from '../assets/one.svg';
import psiSVG from '../assets/psi.svg';
import phiSVG from '../assets/phi.svg';

const gemSVGs = {
  diamante: DiamanteSVG,
  corazon: CorazonSVG,
  esmeralda: EsmeraldaSVG,
  rosa: RosaSVG,
};

const matrixSVGs = {
  zero: zeroSVG,
  one: oneSVG,
  phi: phiSVG,
  psi: psiSVG,
};

const letterSVGs = {
  A: ASVG,
  B: BSVG,
  C: CSVG,
  D: DSVG,
};

const numberSVGs = {
  one: UnoSVG,
  two: DosSVG,
  three: TresSVG,
  four: CuatroSVG,
};

const animalSVGs = {
  rabbit: RabbitSVG,
  dog: DogSVG,
  dolphin: DolphinSVG,
  bird: BirdSVG,
};

export const figureTypes = {
  gems: gemSVGs,
  matrix: matrixSVGs,
  letters: letterSVGs,
  numbers: numberSVGs,
  animals: animalSVGs,
};

// Selectable figure sets shown in the options screen, in display order.
export const FIGURE_SET_OPTIONS = [
  { value: 'animals', label: 'Animals' },
  { value: 'gems', label: 'Gems' },
  { value: 'matrix', label: 'Katakana' },
  { value: 'letters', label: 'Letters' },
  { value: 'numbers', label: 'Numbers' },
];
