import Scene from './Default.mjs';

export default class SceneAudio extends Scene {
  constructor(audioElement) {
    super();
    this.audioStartTime = null;
    this.audioPosition = null;
    this.enableAndroidHack = false;
    this.audioElement = audioElement;
  }

  currentTime() {
    let currentTime = super.currentTime();
    if (this.audioElement) {
      // Android workaround
      if (this.enableAndroidHack) {
        if (this.audioStartTime === null) {
          this.audioStartTime = currentTime;
          this.audioPosition = this.audioElement.currentTime;
          return this.audioElement.currentTime * 1000;
        } else {
          if (this.audioElement.controller.playbackState === 'playing') {
            if (this.audioElement.currentTime === this.audioPosition) {
              return this.audioPosition * 1000 + Math.min(260, currentTime - this.audioStartTime);
            } else if ((this.audioElement.currentTime - this.audioPosition) < 0.5 && (this.audioElement.currentTime > this.audioPosition) && currentTime - this.audioStartTime < 350) {
              this.audioStartTime = this.audioStartTime + (this.audioElement.currentTime - this.audioPosition) * 1000;
              this.audioPosition = this.audioElement.currentTime;
              return this.audioPosition * 1000 + currentTime - this.audioStartTime;
            }
          }
          this.audioStartTime = currentTime;
          this.audioPosition = this.audioElement.currentTime;
          return this.audioPosition * 1000;
        }
      } else {
        return this.audioElement.currentTime * 1000;
      }
    }
    else {
      return currentTime;
    }
  }

  clampTime(timePassed) {
    return timePassed;
  }

  init(...arg) {
    // init audio
    if (this.audioElement) {
      var canPlayType = this.audioElement.canPlayType("audio/mp3");
      if (canPlayType.match(/maybe|probably/i)) {
        //this.audioshift = 1500;
      }
      // Android hack
      if (typeof(MediaController) === 'function') {
        this.audioElement.controller = new MediaController();
        this.enableAndroidHack = true;
      }
      this.audioElement.preload = "auto";
      this.audioElement.load();
    }

    return super.init(...arg);
  }

  callLoading(output) {
    let loaded = super.callLoading(output);

    if (loaded && this.audioElement) {
      if (!(this.audioElement.readyState >= this.audioElement.HAVE_ENOUGH_DATA))
      {
        this.loadingscreen(output, "Waiting for Audio");
        return false;
      } else {
        this.audioElement.play();
        this.loadingscreen(output, "Click to play");
      }
    }

		return loaded;
  }
}