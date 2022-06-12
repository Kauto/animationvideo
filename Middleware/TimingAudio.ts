import type { ConfigurationObject, ParameterList, ParameterListInitDestroy } from "../Scene";
import TimingDefault, { MiddlewareTimingDefaultOptions } from "./TimingDefault";

export interface MiddlewareTimingAudioOptions extends MiddlewareTimingDefaultOptions {
  audioElement: HTMLMediaElement
}

export default class TimingAudio extends TimingDefault implements ConfigurationObject {
  _maxSkippedTickChunk: number = Number.POSITIVE_INFINITY
  _audioStartTime: number | undefined = undefined
  _audioPosition: number | undefined = undefined
  _enableAndroidHack: boolean = false
  _audioElement: undefined | HTMLMediaElement & {
    controller?: Record<string, any>
  }

  constructor(configuration: MiddlewareTimingAudioOptions) {
    super({
      ...configuration,
      maxSkippedTickChunk: Number.POSITIVE_INFINITY
    });
    this._audioElement = configuration.audioElement;
  }

  get audioElement() {
    return this._audioElement;
  }

  init(_params: ParameterListInitDestroy) {
    if (this._audioElement) {
      // Android hack
      // @ts-ignore
      if (typeof MediaController === "function") {
        // @ts-ignore
        this._audioElement.controller = new MediaController();
        this._enableAndroidHack = true;
      }
      this._audioElement.preload = "auto";
      return new Promise((resolve, reject) => {
        const canplaythrough = () => {
          this._audioElement!.removeEventListener(
            "canplaythrough",
            canplaythrough
          );
          const playPromise = this._audioElement!.play();
          if (playPromise) {
            playPromise.catch((e) => { });
          }
          resolve(undefined);
        };
        this._audioElement!.addEventListener("canplaythrough", canplaythrough);
        this._audioElement!.onerror = () => {
          this._audioElement = undefined
          resolve(undefined);
        }
        this._audioElement!.load();
      });
    }
  }

  endTime() {
    return this._audioElement ? this._audioElement.duration * 1000 : Number.POSITIVE_INFINITY;
  }

  currentTime() {
    let currentTime = super.currentTime();
    console.log(1);
    if (this._audioElement) {
      if (this._audioElement.ended && this._audioElement.duration) {
        return this._audioElement.duration * 1000;
      }
      const currentAudioTime = this._audioElement.currentTime * 1000;
      // Android workaround
      if (this._enableAndroidHack) {
        if (this._audioStartTime === undefined) {
          this._audioStartTime = currentTime;
          this._audioPosition = currentAudioTime;
          return currentAudioTime;
        } else {
          if (this._audioElement.controller!.playbackState === "playing") {
            if (currentAudioTime === this._audioPosition) {
              return (
                this._audioPosition +
                Math.min(260, currentTime - this._audioStartTime)
              );
            } else if (
              currentAudioTime - this._audioPosition! < 500 &&
              currentAudioTime > this._audioPosition! &&
              currentTime - this._audioStartTime < 350
            ) {
              this._audioStartTime =
                this._audioStartTime + (currentAudioTime - this._audioPosition!);
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

  clampTime({ timePassed }: ParameterList) {
    return timePassed;
  }

  shiftTime() {
    return 0;
  }
}
