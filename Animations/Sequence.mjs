import Wait from "./Wait.mjs";

class Sequence {
  constructor(...sequences) {
    let timeWait = 0;
    if (typeof sequences[0] === "number") {
      timeWait = sequences.shift();
    }
    
    // init position-array
    this.sequences = sequences.map(sequence => {
      if (!Array.isArray(sequence)) {
        sequence = [sequence];
      }
      let thisTimeWait = timeWait;
      if (typeof sequence[0] === "number") {
        thisTimeWait = sequence.shift();
      }

      return {
        position: 0,
        timelapsed: -thisTimeWait,
        sequence: sequence
          .map(command =>
            typeof command.run !== "function"
              ? typeof command === "number"
                ? new Wait(command)
                : { run: command }
              : command
          )
          .filter(command => typeof command.run === "function"),
        label: sequence.reduce((arr, command, index) => {
          if (typeof command === "string") {
            arr[command] = index - Object.keys(arr).length;
          }
          return arr;
        }, {}),
        enabled: true
      };
    });
    // init time
    this.lastTimestamp = 0;
    this.enabled = true;
  }

  reset(timelapsed = 0) {
    this.sequences.forEach(sequencePosition => {
      sequencePosition.enabled = true;
      sequencePosition.position = 0;
      sequencePosition.timelapsed = timelapsed;
      sequencePosition.sequence[0] &&
        sequencePosition.sequence[0].reset &&
        sequencePosition.sequence[0].reset(timelapsed);
    });
    this.enabled = true;
  }

  play(label = "", timelapsed = 0) {
    if (label) {
      const b = this.sequences.reduce((b, sequencePosition) => {
        if (sequencePosition.label.hasOwnProperty(label)) {
          b = true;
          sequencePosition.position = sequencePosition.label[label];
          sequencePosition.enabled = true;
          sequencePosition.timelapsed = timelapsed;
          sequencePosition.sequence[sequencePosition.position] &&
            sequencePosition.sequence[sequencePosition.position].reset &&
            sequencePosition.sequence[sequencePosition.position].reset();
        } else {
          b |=
            sequencePosition.sequence.find(seq => {
              return seq.play && seq.play(label, timelapsed);
            }) >= 0;
        }
        return b;
      }, false);
      if (b) {
        this.enabled = true;
      }
      return b;
    } else {
      this.sequences.forEach(
        sequencePosition => (sequencePosition.enabled = true)
      );
      this.enabled = true;
      return true;
    }
  }

  _runSequence(sprite, sequencePosition, timePassed) {
    let timeLeft = timePassed;
    while (
      sequencePosition.sequence[sequencePosition.position] &&
      timeLeft >= 0
    ) {
      sequencePosition.timelapsed += timeLeft;
      if (sequencePosition.timelapsed < 0) {
        return -1;
      }

      timeLeft = sequencePosition.sequence[sequencePosition.position].run(
        sprite,
        sequencePosition.timelapsed
      );

      if (timeLeft === true) {
        timeLeft = 0;
      } else if (timeLeft === false) {
        return -1;
      } else if (timeLeft === Sequence._TIMELAPSE_TO_FORCE_DISABLE) {
        sequencePosition.enabled = false;
        this.enabled = false;
        return timePassed;
      } else if (timeLeft === Sequence._TIMELAPSE_TO_STOP) {
        sequencePosition.enabled = false;
        return timePassed;
      } else if (timeLeft === Sequence._TIMELAPSE_TO_REMOVE) {
        return true;
      }

      if (timeLeft >= 0) {
        // next animation
        sequencePosition.position =
          (sequencePosition.position + 1) % sequencePosition.sequence.length;
        sequencePosition.sequence[sequencePosition.position] &&
          sequencePosition.sequence[sequencePosition.position].reset &&
          sequencePosition.sequence[sequencePosition.position].reset();
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
  run(sprite, time, is_difference) {
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
          timePassed
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

Sequence._TIMELAPSE_TO_FORCE_DISABLE = "F";
Sequence._TIMELAPSE_TO_STOP = "S";
Sequence._TIMELAPSE_TO_REMOVE = "R";
export default Sequence;
