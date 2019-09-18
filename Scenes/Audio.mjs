import Scene from "./Default.mjs";

export default class SceneAudio extends Scene {
  constructor(configurationClassOrObject) {
    super(configurationClassOrObject);
    this._audioStartTime = null;
    this._audioPosition = null;
    this._enableAndroidHack = false;
    this._audioElement = this._configuration.audioElement;
  }

  currentTime() {
    let currentTime = super.currentTime();
    if (this._audioElement) {
      const currentAudioTime = (this._audioElement.ended
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
            if (currentAudioTime=== this._audioPosition) {
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
                this._audioStartTime +
                (currentAudioTime - this._audioPosition);
              this._audioPosition = currentAudioTime;
              return (
                this._audioPosition + currentTime - this._audioStartTime
              );
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

  clampTime(timePassed) {
    return timePassed;
  }

  shiftTime(timePassed) {
    return 0;
  }

  callInit(...arg) {
    // init audio
    if (this._audioElement) {
      var canPlayType = this._audioElement.canPlayType("audio/mp3");
      if (canPlayType.match(/maybe|probably/i)) {
        //this.audioshift = 1500;
      }
      // Android hack
      if (typeof MediaController === "function") {
        this._audioElement.controller = new MediaController();
        this._enableAndroidHack = true;
      }
      this._audioElement.preload = "auto";
      this._audioElement.load();
    }

    return super.callInit(...arg);
  }

  callLoading(output) {
    let loaded = super.callLoading(output);

    if (loaded && this._audioElement) {
      if (
        !(this._audioElement.readyState >= this._audioElement.HAVE_ENOUGH_DATA)
      ) {
        this.loadingScreen(output, "Waiting for Audio");
        return false;
      } else {
        let playPromise = this._audioElement.play();
        if (playPromise) {
          playPromise.catch(e => {});
        }
        if (!this._configuration.endTime && this._audioElement.duration > 0) {
          this._configuration.endTime = this._audioElement.duration * 1000;
        }
        this.loadingScreen(output, "Click to play");
      }
    }

    return loaded;
  }
}
