import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";
import Wait from "./Wait";

export enum SequenceRunCommand {
  FORCE_DISABLE = "F",
  STOP = "S",
  REMOVE = "R",
}

export type TWaitTime = number;
export type TLabel = string;
export type TAnimationFunction = IAnimation["run"];
export type TAnimationSequence = (
  | TWaitTime
  | TLabel
  | TAnimationFunction
  | IAnimation
)[];
export type AnimationSequenceOptions =
  | TAnimationSequence
  | TAnimationSequence[];

interface ISequence {
  position: number;
  timelapsed: number;
  sequence: IAnimation[];
  label: Record<string, number>;
  enabled: boolean;
}

class Sequence implements IAnimation {
  sequences: ISequence[] = [];
  lastTimestamp: number = 0;
  enabled: boolean = true;

  constructor(...sequences: AnimationSequenceOptions) {
    let timeWait = 0;
    if (typeof sequences[0] === "number") {
      timeWait = sequences.shift() as number;
    }

    // init position-array
    this.sequences = sequences.map((sequence) => {
      if (!Array.isArray(sequence)) {
        sequence = [sequence];
      }
      let thisTimeWait: number = timeWait;
      if (typeof sequence[0] === "number") {
        thisTimeWait = sequence.shift() as number;
      }

      return {
        position: 0,
        timelapsed: -thisTimeWait,
        sequence: sequence
          .map((command) =>
            typeof (command as IAnimation).run !== "function"
              ? typeof command === "number"
                ? new Wait(command)
                : ({ run: command } as IAnimation)
              : (command as IAnimation),
          )
          .filter(
            (command) => typeof (command as IAnimation).run === "function",
          ),
        label: sequence.reduce(
          (arr: Record<string, number>, command, index) => {
            if (typeof command === "string") {
              arr[command] = index - Object.keys(arr).length;
            }
            return arr;
          },
          {},
        ),
        enabled: true,
      };
    });
  }

  reset(timelapsed: number = 0) {
    this.sequences.forEach((sequencePosition) => {
      sequencePosition.enabled = true;
      sequencePosition.position = 0;
      sequencePosition.timelapsed = timelapsed;
      sequencePosition.sequence[0]?.reset?.(timelapsed);
    });
    this.enabled = true;
  }

  play(label = "", timelapsed = 0) {
    if (label) {
      const b = this.sequences.reduce((b, sequencePosition) => {
        if (label in sequencePosition.label) {
          b = true;
          sequencePosition.position = sequencePosition.label[label];
          sequencePosition.enabled = true;
          sequencePosition.timelapsed = timelapsed;
          sequencePosition.sequence[sequencePosition.position]?.reset?.();
        } else {
          b =
            b ||
            sequencePosition.sequence.some((seq) =>
              seq.play?.(label, timelapsed),
            );
        }
        return b;
      }, false);
      if (b) {
        this.enabled = true;
      }
      return b;
    } else {
      this.sequences.forEach(
        (sequencePosition) => (sequencePosition.enabled = true),
      );
      this.enabled = true;
      return true;
    }
  }

  _runSequence(
    sprite: ISprite,
    sequencePosition: ISequence,
    timePassed: number,
  ) {
    let timeLeft: number = timePassed;
    while (
      sequencePosition.sequence[sequencePosition.position] &&
      timeLeft >= 0
    ) {
      sequencePosition.timelapsed += timeLeft;
      if (sequencePosition.timelapsed < 0) {
        return -1;
      }

      const res = sequencePosition.sequence[sequencePosition.position].run(
        sprite,
        sequencePosition.timelapsed,
      );

      if (res === true) {
        timeLeft = 0;
      } else if (res === false) {
        return -1;
      } else if (res === SequenceRunCommand.FORCE_DISABLE) {
        sequencePosition.enabled = false;
        this.enabled = false;
        return timePassed;
      } else if (res === SequenceRunCommand.STOP) {
        sequencePosition.enabled = false;
        return timePassed;
      } else if (res === SequenceRunCommand.REMOVE) {
        return true;
      }

      timeLeft = res as number;
      if (timeLeft >= 0) {
        // next animation
        sequencePosition.position =
          (sequencePosition.position + 1) % sequencePosition.sequence.length;
        sequencePosition.sequence[sequencePosition.position]?.reset?.();
        sequencePosition.timelapsed = 0;

        // loop animation?
        if (sequencePosition.position === 0) {
          sequencePosition.enabled = false;
          return timeLeft;
        }
      }
    }
    return timeLeft;
  }

  // call other animations
  run(sprite: ISprite, time: number, is_difference: boolean = false) {
    // Calculate timedifference
    let timePassed = time;
    if (!is_difference) {
      timePassed = time - this.lastTimestamp;
      this.lastTimestamp = time;
    }
    if (!this.enabled) {
      return timePassed;
    }
    const length = this.sequences.length;
    let disableVote = 0;
    let restTime = Infinity;
    for (let i = 0; i < length; i++) {
      if (this.sequences[i].enabled) {
        const timeLeft = this._runSequence(
          sprite,
          this.sequences[i],
          timePassed,
        );
        if (timeLeft === true) {
          return true;
        }
        restTime = Math.min(restTime, timeLeft);
      } else {
        disableVote++;
      }
    }
    if (disableVote === length) {
      this.enabled = false;
      return timePassed;
    }
    return restTime;
  }
}
export default Sequence;
