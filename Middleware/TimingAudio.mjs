import TimingDefault from "./TimingDefault.mjs";

export default class TimingAudio extends TimingDefault {
  constructor(configuration = {}) {
    super(configuration);
    this._maxSkippedTickChunk = Number.POSITIVE_INFINITY;
    this._audioStartTime = null;
    this._audioPosition = null;
    this._enableAndroidHack = false;
    this._audioElement = this._configuration.audioElement;
  }

  get audioElement() {
    return this._audioElement;
  }

  init() {
    if (this._audioElement) {
      // Android hack
      if (typeof MediaController === "function") {
        this._audioElement.controller = new MediaController();
        this._enableAndroidHack = true;
      }
      this._audioElement.preload = "auto";
      return new Promise((resolve) => {
        let canplaythrough = () => {
          this._audioElement.removeEventListener(
            "canplaythrough",
            canplaythrough
          );
          let playPromise = this._audioElement.play();
          if (playPromise) {
            playPromise.catch((e) => {});
          }
          resolve();
        };
        this._audioElement.addEventListener("canplaythrough", canplaythrough);
        this._audioElement.load();
      });
    }
  }

  endTime() {
    return this._audioElement.duration * 1000;
  }

  currentTime() {
    let currentTime = super.currentTime();
    if (this._audioElement) {
      const currentAudioTime =
        (this._audioElement.ended
          ? this._audioElement.duration
          : this._audioElement.currentTime) * 1000;
      // Android workaround
      if (this._enableAndroidHack) {
        if (this._audioStartTime === null) {
          this._audioStartTime = currentTime;
          this._audioPosition = currentAudioTime;
          return currentAudioTime;
        } else {
          if (this._audioElement.controller.playbackState === "playing") {
            if (currentAudioTime === this._audioPosition) {
              return (
                this._audioPosition +
                Math.min(260, currentTime - this._audioStartTime)
              );
            } else if (
              currentAudioTime - this._audioPosition < 500 &&
              currentAudioTime > this._audioPosition &&
              currentTime - this._audioStartTime < 350
            ) {
              this._audioStartTime =
                this._audioStartTime + (currentAudioTime - this._audioPosition);
              this._audioPosition = currentAudioTime;
              return this._audioPosition + currentTime - this._audioStartTime;
            }
          }
          this._audioStartTime = currentTime;
          this._audioPosition = currentAudioTime;
          return this._audioPosition;
        }
      } else {
        return currentAudioTime;
      }
    } else {
      return currentTime;
    }
  }

  clampTime({ timePassed }) {
    return timePassed;
  }

  shiftTime() {
    return 0;
  }
}
