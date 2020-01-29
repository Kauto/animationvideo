import _Engine from './Engine.mjs';
import Scenes from './Scenes.mjs';
import ImageManager from './ImageManager.mjs';
import Sprites from './Sprites.mjs';
import Animations from './Animations.mjs';
import Easing from 'eases';
import Default from './Timing/Default.mjs';
import Audio from './Timing/Audio.mjs';

const Engine = (...args) => new _Engine(...args);
const Timing = {
  Default,
  Audio
}

export {
  Engine,
  Scenes,
  ImageManager,
  Sprites,
  Animations,
  Easing,
  Timing
};