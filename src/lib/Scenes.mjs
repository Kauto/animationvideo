import _Default from './Scenes/Default.mjs';
import _Audio from './Scenes/Audio.mjs';
import _Norm from './Scenes/Norm.mjs';
import _NormAudio from './Scenes/NormAudio.mjs';

const
  Default = (...args) => new _Default(...args),
  Norm = (...args) => new _Norm(...args),
  NormAudio = (...args) => new _NormAudio(...args),
  Audio = (...args) => new _Audio(...args);

export default {
  Default,
  Audio,
  Norm,
  NormAudio
};
