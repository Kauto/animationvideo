import _Engine from './lib/Engine.mjs';
import Scenes from './lib/Scenes.mjs';
import ImageManager from './lib/ImageManager.mjs';
import Sprites from './lib/Sprites.mjs';
import _Sequence from './lib/Sequence.mjs';
import Animations from './lib/Animations.mjs';
import Easing from 'eases';

var Engine = (...args) => new _Engine(...args),
  Sequence = (...args) => new _Sequence(...args);

export {
  Engine,
  Scenes,
  ImageManager,
  Sprites,
  Sequence,
  Animations,
  Easing
};