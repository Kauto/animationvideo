import _Engine from './Engine.mjs';
import Scenes from './Scenes.mjs';
import ImageManager from './ImageManager.mjs';
import Sprites from './Sprites.mjs';
import Animations from './Animations.mjs';
import Easing from 'eases';

var Engine = (...args) => new _Engine(...args);

export {
  Engine,
  Scenes,
  ImageManager,
  Sprites,
  Animations,
  Easing
};