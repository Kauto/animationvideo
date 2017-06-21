import _Callback from './Sprites/Callback';
import _Canvas from './Sprites/Canvas';
import _Circle from './Sprites/Circle';
import _Emitter from './Sprites/Emitter';
import _FastBlur from './Sprites/FastBlur';
import _Group from './Sprites/Group';
import _Image from './Sprites/Image';
import _Text from './Sprites/Text';
import _Particle from './Sprites/Particle';
import _Path from './Sprites/Path';
import _Rect from './Sprites/Rect';
import _Scroller from './Sprites/Scroller';
import _StarField from './Sprites/StarField';

const
  Callback = (...args) => new _Callback(...args),
  Canvas = (...args) => new _Canvas(...args),
  Circle = (...args) => new _Circle(...args),
  Emitter = (...args) => new _Emitter(...args),
  FastBlur = (...args) => new _FastBlur(...args),
  Group = (...args) => new _Group(...args),
  Image = (...args) => new _Image(...args),
  Text = (...args) => new _Text(...args),
  Particle = (...args) => new _Particle(...args),
  Path = (...args) => new _Path(...args),
  Rect = (...args) => new _Rect(...args),
  Scroller = (...args) => new _Scroller(...args),
  StarField = (...args) => new _StarField(...args);

Path.path2shapes = _Path.path2shapes;

export default {
  Callback,
  Canvas,
  Circle,
  Emitter,
  FastBlur,
  Group,
  Image,
  Text,
  Particle,
  Path,
  Rect,
  Scroller,
  StarField
};
