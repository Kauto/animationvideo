import _Callback from './Animations/Callback';
import _ChangeTo from './Animations/ChangeTo';
import _End from './Animations/End';
import _EndDisabled from './Animations/EndDisabled';
import _Image from './Animations/Image';
import _ImageFrame from './Animations/ImageFrame';
import _Move from './Animations/Move';
import _Once from './Animations/Once';
import _Play from './Animations/Play';
import _Shake from './Animations/Shake';
import _ShowOnce from './Animations/ShowOnce';
import _Stop from './Animations/Stop';
import _Wait from './Animations/Wait';
import _WaitDisabled from './Animations/WaitDisabled';

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
