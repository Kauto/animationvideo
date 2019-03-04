import _Callback from './Animations/Callback.mjs';
import _ChangeTo from './Animations/ChangeTo.mjs';
import _End from './Animations/End.mjs';
import _EndDisabled from './Animations/EndDisabled.mjs';
import _Image from './Animations/Image.mjs';
import _ImageFrame from './Animations/ImageFrame.mjs';
import _Move from './Animations/Move.mjs';
import _Once from './Animations/Once.mjs';
import _Play from './Animations/Play.mjs';
import _Shake from './Animations/Shake.mjs';
import _ShowOnce from './Animations/ShowOnce.mjs';
import _Stop from './Animations/Stop.mjs';
import _Wait from './Animations/Wait.mjs';
import _WaitDisabled from './Animations/WaitDisabled.mjs';

const
  Callback = (...args) => new _Callback(...args),
  ChangeTo = (...args) => new _ChangeTo(...args),
  End = (...args) => new _End(...args),
  EndDisabled = (...args) => new _EndDisabled(...args),
  Image = (...args) => new _Image(...args),
  ImageFrame = (...args) => new _ImageFrame(...args),
  Move = (...args) => new _Move(...args),
  Once = (...args) => new _Once(...args),
  Play = (...args) => new _Play(...args),
  Shake = (...args) => new _Shake(...args),
  ShowOnce = (...args) => new _ShowOnce(...args),
  Stop = (...args) => new _Stop(...args),
  Wait = (...args) => new _Wait(...args),
  WaitDisabled = (...args) => new _WaitDisabled(...args);

export default {
  Callback,
  ChangeTo,
  End,
  EndDisabled,
  Image,
  ImageFrame,
  Move,
  Once,
  Play,
  Shake,
  ShowOnce,
  Stop,
  Wait,
  WaitDisabled
};
