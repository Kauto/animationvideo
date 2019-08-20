import _Callback from './Animations/Callback.mjs';
import _ChangeTo from './Animations/ChangeTo.mjs';
import _End from './Animations/End.mjs';
import _EndDisabled from './Animations/EndDisabled.mjs';
import _Forever from './Animations/Forever.mjs';
import _If from './Animations/If.mjs';
import _Image from './Animations/Image.mjs';
import _ImageFrame from './Animations/ImageFrame.mjs';
import _Loop from './Animations/Loop.mjs';
import _Move from './Animations/Move.mjs';
import _Remove from './Animations/Remove.mjs';
import _Sequence from './Animations/Sequence.mjs';
import _Once from './Animations/Once.mjs';
import _Shake from './Animations/Shake.mjs';
import _ShowOnce from './Animations/ShowOnce.mjs';
import _State from './Animations/State.mjs';
import _Stop from './Animations/Stop.mjs';
import _StopDisabled from './Animations/StopDisabled.mjs';
import _Wait from './Animations/Wait.mjs';
import _WaitDisabled from './Animations/WaitDisabled.mjs';

const
  Callback = (...args) => new _Callback(...args),
  ChangeTo = (...args) => new _ChangeTo(...args),
  End = (...args) => new _End(...args),
  EndDisabled = (...args) => new _EndDisabled(...args),
  Forever = (...args) => new _Forever(...args),
  If = (...args) => new _If(...args),
  Image = (...args) => new _Image(...args),
  ImageFrame = (...args) => new _ImageFrame(...args),
  Loop = (...args) => new _Loop(...args),
  Move = (...args) => new _Move(...args),
  Once = (...args) => new _Once(...args),
  Remove = (...args) => new _Remove(...args),
  Sequence = (...args) => new _Sequence(...args),
  Shake = (...args) => new _Shake(...args),
  ShowOnce = (...args) => new _ShowOnce(...args),
  State = (...args) => new _State(...args),
  Stop = (...args) => new _Stop(...args),
  StopDisabled = (...args) => new _StopDisabled(...args),
  Wait = (...args) => new _Wait(...args),
  WaitDisabled = (...args) => new _WaitDisabled(...args);

export default {
  Callback,
  ChangeTo,
  End,
  EndDisabled,
  Forever,
  If,
  Image,
  ImageFrame,
  Loop,
  Move,
  Once,
  Remove,
  Sequence,
  Shake,
  ShowOnce,
  State,
  Stop,
  StopDisabled,
  Wait,
  WaitDisabled
};
