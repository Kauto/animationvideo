import _Default from './Scenes/Default';
import _Audio from './Scenes/Audio';
import _Norm from './Scenes/Norm';
import _NormAudio from './Scenes/NormAudio';

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
