import _Callback from './Sprites/Callback.mjs';
import _Canvas from './Sprites/Canvas.mjs';
import _Circle from './Sprites/Circle.mjs';
import _Emitter from './Sprites/Emitter.mjs';
import _FastBlur from './Sprites/FastBlur.mjs';
import _Group from './Sprites/Group.mjs';
import _Image from './Sprites/Image.mjs';
import _Text from './Sprites/Text.mjs';
import _Particle from './Sprites/Particle.mjs';
import _Path from './Sprites/Path.mjs';
import _Rect from './Sprites/Rect.mjs';
import _Scroller from './Sprites/Scroller.mjs';
import _StackBlur from './Sprites/StackBlur.mjs';
import _StarField from './Sprites/StarField.mjs';

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
  StackBlur = (...args) => new _StackBlur(...args);
  StarField = (...args) => new _StarField(...args);

Image.LEFT_TOP = _Image.LEFT_TOP
Image.CENTER = _Image.CENTER
Text.LEFT_TOP = _Text.LEFT_TOP
Text.CENTER = _Text.CENTER

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
  StackBlur,
  StarField
};
