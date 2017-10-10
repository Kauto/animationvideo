import calc from '../../func/calc';
import ChangeTo from './ChangeTo';

const DURATION_FOR_1PX = 10;

export default class Move extends ChangeTo {
  constructor(x, y, speed, ease) {
    super({
      x,
      y
    }, 0, ease);
    this.speed = calc(speed) || 1;
  }

  init(sprite, time) {
    if (this.speed == 0 || (this.targetX === sprite.x && this.targetY === sprite.y)) {
      this.duration = 0;
    }
    else {
      let x = this.changeValues[0],
        y = this.changeValues[1];

      x.from = sprite.x;
      y.from = sprite.y;

      x.delta = x.to - x.from;
      y.delta = y.to - y.from;

      const hypotenuse = Math.sqrt(x.delta * x.delta + y.delta * y.delta);

      this.duration = hypotenuse * DURATION_FOR_1PX / this.speed;
    }

    super.init(sprite, time);
  };
}
