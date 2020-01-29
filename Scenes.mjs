import _Default from './Scenes/Default.mjs';
import _Norm from './Scenes/Norm.mjs';
import _NormCamera from './Scenes/NormCamera.mjs';

const
  Default = (...args) => new _Default(...args),
  Norm = (...args) => new _Norm(...args),
  NormCamera = (...args) => new _NormCamera(...args);

export default {
  Default,
  Norm,
  NormCamera
};
