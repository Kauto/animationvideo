import _ChangeTo from './Animations/ChangeTo';
import _End from './Animations/End';
import _EndDisabled from './Animations/EndDisabled';
import _Image from './Animations/Image';
import _Move from './Animations/Move';
import _Once from './Animations/Once';
import _Play from './Animations/Play';
import _Shake from './Animations/Shake';
import _ShowOnce from './Animations/ShowOnce';
import _Stop from './Animations/Stop';
import _Wait from './Animations/Wait';
import _WaitDisabled from './Animations/WaitDisabled';

var ChangeTo = (...args) => new _ChangeTo(...args),
  End = (...args) => new _End(...args),
  EndDisabled = (...args) => new _EndDisabled(...args),
  Image = (...args) => new _Image(...args),
  Move = (...args) => new _Move(...args),
  Once = (...args) => new _Once(...args),
  Play = (...args) => new _Play(...args),
  Shake = (...args) => new _Shake(...args),
  ShowOnce = (...args) => new _ShowOnce(...args),
  Stop = (...args) => new _Stop(...args),
  Wait = (...args) => new _Wait(...args),
  WaitDisabled = (...args) => new _WaitDisabled(...args);

ChangeTo.createChangeToFunction = _ChangeTo.createChangeToFunction;
ChangeTo.createChangeByFunction = _ChangeTo.createChangeByFunction;

export default {
  ChangeTo,
  End,
  EndDisabled,
  Image,
  Move,
  Once,
  Play,
  Shake,
  ShowOnce,
  Stop,
  Wait,
  WaitDisabled
};
