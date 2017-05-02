'use strict';

import _Engine from './lib/Engine';
import Scenes from './lib/Scenes';
import ImageManager from './lib/ImageManager';
import Sprites from './lib/Sprites';
import _Sequence from './lib/Sequence';
import Animations from './lib/Animations';
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