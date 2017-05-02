import calc from '../func/calc';
import ifNull from '../func/ifnull';

export default class Sequenz {
  static TIMELAPSE_TO_FORCE_DISABLE = null;
  static TIMELAPSE_TO_STOP = false;

  constructor(loop, timeShift, obj) {
    this.loop = loop;
    // Timeshift - put the sprite into the future
    this.timeShift = ifNull(timeShift, 0);
    // Animations
    this.animation = obj || {};
    // init position-array
    this.animationPosition = {};
    for (let i in this.animation) {
      this.animationPosition[i] = {
        position: 0,
        timelapsed: calc(this.timeShift),
        object: calc(this.animation[i][0]),
        loop: (typeof loop === "object") ? calc(loop[i]) : calc(loop),
        enabled: !((typeof loop === "object" && calc(loop[i]) === false) || calc(loop) === false)
      };
    }
    // init time
    this.last_timestamp = 0;

    this.hide_vote = false;
  }

  setObject(i) {
    if (
      this.animationPosition[i].position < this.animation[i].length
      && this.animation[i][this.animationPosition[i].position] !== null
    ) {
      if (typeof this.animation[i][this.animationPosition[i].position] === "function") {
        this.animationPosition[i].object = this.animation[i][this.animationPosition[i].position]();
      }
      else {
        this.animationPosition[i].object = this.animation[i][this.animationPosition[i].position];

        // Reset animation if possible
        if (typeof this.animationPosition[i].object.reset === "function") {
          this.animationPosition[i].object.reset();
        }
      }
    }
    else {
      // No object left
      this.animationPosition[i].object = null;
    }
  };

  changeAnimationStatus(ani) {
    let i;
    // set new parameter
    for (i in ani) {
      if (typeof this.animationPosition[i] === "object") {
        if (ani[i].position !== null) {
          this.animationPosition[i].position = ani[i].position;
        }
        if (ani[i].loop !== null) {
          this.animationPosition[i].loop = ani[i].loop;
          this.animationPosition[i].enabled = !(ani[i].loop === false);
        }
        if (ani[i].timelapsed !== null) {
          this.animationPosition[i].timelapsed = ani[i].timelapsed;
        }
        this.setObject(i);
      }
    }

    // search for additional animations
    for (i in this.animation) {
      if (typeof this.animationPosition[i] === "object" && this.animationPosition[i].object instanceof Sequenz) {
        this.animationPosition[i].object.changeAnimationStatus(ani);
      }
    }
  };

  // call other animations
  run(sprite, time, is_difference) {
    // Calculate timedifference
    let timepassed = time,
      // Vote to disable the sprite
      disable_vote = 0,
      hide_vote = 0,
      animation_count = 0,
      // Loop variables
      timeleft = 0,
      current_animationPosition = null;

    if (!is_difference) {
      timepassed = time - this.last_timestamp;
      this.last_timestamp = time;
    }

    for (let i in this.animation) {
      animation_count++;
      current_animationPosition = this.animationPosition[i];
      if (current_animationPosition.enabled === true) {
        timeleft = timepassed;
        // Valid animation avaible?
        if (current_animationPosition.object === null) {
          disable_vote++;
          hide_vote++;
          timeleft = 0;
        }
        else {
          if (timeleft > 0) {
            while (timeleft > 0) {
              // New time-position in the animation
              current_animationPosition.timelapsed += timeleft;

              // Don't ran future animations
              if (current_animationPosition.timelapsed >= 0) {
                // Do the animation
                timeleft = current_animationPosition.object.run(sprite, current_animationPosition.timelapsed);

                if (timeleft === Sequenz.TIMELAPSE_TO_FORCE_DISABLE) {
                  return timepassed;
                } else if (timeleft === Sequenz.TIMELAPSE_TO_STOP) {
                  // reset current animation for the future
                  current_animationPosition.timelapsed = 0;
                  // create next obj
                  this.setObject(i);
                  // set object to null, so it disable votes every time
                  current_animationPosition.object = null;
                  disable_vote++;
                  timeleft = 0;
                } else if (timeleft >= 0) {
                  // yes, next animation
                  current_animationPosition.position++;
                  // loop animation?
                  if (current_animationPosition.position >= this.animation[i].length) {
                    if (current_animationPosition.loop !== true) {
                      current_animationPosition.loop--;
                    }
                    if (current_animationPosition.loop) {
                      current_animationPosition.position = current_animationPosition.position % this.animation[i].length;
                    }
                    else {
                      current_animationPosition.enabled = false;
                    }
                  }
                  // start from the beginning
                  current_animationPosition.timelapsed = 0;
                  // create next obj
                  this.setObject(i);

                  if (!current_animationPosition.enabled) {
                    current_animationPosition.object = null;
                    current_animationPosition.enabled = true;
                  }

                  if (current_animationPosition.object === null) {
                    disable_vote++;
                    timeleft = 0;
                  }
                }
              }
              else {
                timeleft = 0;
                hide_vote++;
              }
            }
          }
          else {
            hide_vote++;
          }
        }
      }

    }

    if (animation_count > 0) {
      // Vote successful?
      if (disable_vote === animation_count) {
        // disable
        return timepassed;
      }

      // Vote successful?
      if (sprite.enabled && hide_vote === animation_count) {
        // disable
        sprite.enabled = false;
        this.hide_vote = true;
      }
      else if (this.hide_vote && hide_vote !== animation_count) {
        this.hide_vote = false;
        sprite.enabled = true;
      }
    }

    return -1;
  }
}