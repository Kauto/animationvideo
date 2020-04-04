import calc from "../func/calc.mjs";
import ifNull from "../func/ifNull.mjs";

export default class TimingDefault {
  enabled = true;
  type = "timing";

  constructor(configuration = {}) {
    this._configuration = configuration;
    this._tickChunk = ifNull(calc(this._configuration.tickChunk), 100 / 6);
    this._maxSkippedTickChunk = ifNull(
      calc(this._configuration.maxSkippedTickChunk),
      120
    );
    this._tickChunkTolerance = ifNull(
      calc(this._configuration.tickChunkTolerance),
      0.1
    );

    this.totalTimePassed = 0;
  }

  init() {}

  currentTime() {
    return window.performance ? performance.now() : Date.now();
  }

  clampTime({ timePassed }) {
    const maxTime = this._tickChunk
      ? this._tickChunk * this._maxSkippedTickChunk
      : 2000;
    if (timePassed > maxTime) {
      return maxTime;
    }
    return timePassed;
  }

  shiftTime({ timePassed }) {
    return this._tickChunk ? -(timePassed % this._tickChunk) : 0;
  }

  get tickChunk() {
    return this._tickChunk;
  }

  isChunked() {
    return this._tickChunk;
  }

  hasOneChunkedFrame({ timePassed }) {
    return timePassed >= this._tickChunk - this._tickChunkTolerance;
  }

  calcFrames({ timePassed }) {
    return Math.min(
      this._maxSkippedTickChunk,
      Math.floor((timePassed + this._tickChunkTolerance) / this._tickChunk)
    );
  }
}
