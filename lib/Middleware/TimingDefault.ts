import calc from "../func/calc";
import ifNull from "../func/ifnull";
import type { OrFunction } from "../helper";
import type {
  ConfigurationObject,
  ParameterList,
  ParameterListWithoutTime,
} from "../Scene";

export interface MiddlewareTimingDefaultOptions {
  tickChunk?: OrFunction<number>;
  maxSkippedTickChunk?: OrFunction<number | undefined>;
  tickChunkTolerance?: OrFunction<number | undefined>;
}

export default class TimingDefault implements ConfigurationObject {
  _configuration: MiddlewareTimingDefaultOptions;
  _tickChunk: number;
  _maxSkippedTickChunk: number;
  _tickChunkTolerance: number;

  type = "timing";
  totalTimePassed = 0;

  constructor(configuration: MiddlewareTimingDefaultOptions = {}) {
    this._configuration = configuration;
    this._tickChunk = ifNull(calc(this._configuration.tickChunk), 1000 / 60);
    this._maxSkippedTickChunk = ifNull(
      calc(this._configuration.maxSkippedTickChunk),
      120,
    );
    this._tickChunkTolerance = ifNull(
      calc(this._configuration.tickChunkTolerance),
      0.1,
    );
  }

  init(_params: ParameterListWithoutTime) {}

  currentTime() {
    return window.performance ? window.performance.now() : Date.now();
  }

  clampTime({ timePassed }: ParameterList) {
    const maxTime = this._tickChunk
      ? this._tickChunk * this._maxSkippedTickChunk
      : 2000;
    return timePassed > maxTime ? maxTime : timePassed;
  }

  shiftTime({ timePassed }: ParameterList) {
    return this._tickChunk ? -(timePassed % this._tickChunk) : 0;
  }

  get tickChunk() {
    return this._tickChunk;
  }

  isChunked() {
    return !!this._tickChunk;
  }

  hasOneChunkedFrame({ timePassed }: ParameterList) {
    return timePassed >= this._tickChunk - this._tickChunkTolerance;
  }

  calcFrames({ timePassed }: ParameterList) {
    return Math.min(
      this._maxSkippedTickChunk,
      Math.floor((timePassed + this._tickChunkTolerance) / this._tickChunk),
    );
  }
}
