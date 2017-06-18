import _Default from './Scenes/Default';
import _Audio from './Scenes/Audio';

const
  Default = (...args) => new _Default(...args),
  Audio = (...args) => new _Audio(...args);

export default {
  Default,
  Audio
};
