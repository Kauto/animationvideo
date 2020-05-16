import calc from "../func/calc.mjs";
import ifNull from "../func/ifNull.mjs";
import { TinyColor } from "@ctrl/tinycolor";

const degToRad = 0.017453292519943295; //Math.PI / 180;

function moveDefault(progress, data) {
  return data.from + progress * data.delta;
}

function moveBezier(progress, data) {
  var copy = [...data.values],
    copyLength = copy.length,
    i;

  while (copyLength > 1) {
    copyLength--;
    for (i = 0; i < copyLength; i++) {
      copy[i] = copy[i] + progress * (copy[i + 1] - copy[i]);
    }
  }
  return copy[0];
}

function moveColor(progress, data, sprite) {
  return data.colorFrom.mix(data.colorTo, progress * 100).toString();
}

function movePath(progress, data, sprite) {
  return sprite.changeToPath(progress, data, sprite);
}

// to values of a object
export default class ChangeTo {
  constructor(changeValues, duration, ease) {
    this.initialized = false;
    this.changeValues = [];
    for (let k in changeValues) {
      const orgValue = changeValues[k];
      const value = k === "rotationInDegree" ? orgValue * degToRad : orgValue;
      const isColor = k === "color" || k === "borderColor";
      const isPath = k === "path";
      const isFunction = typeof value === "function";
      const isBezier = !isColor && Array.isArray(value);
      const names =
        k === "scale"
          ? ["scaleX", "scaleY"]
          : k === "rotationInRadian" || k === "rotationInDegree"
          ? ["rotation"]
          : [k];
      for (const name of names) {
        this.changeValues.push({
          name,
          to: isBezier ? value[value.length - 1] : calc(value, 1, {}),
          bezier: isBezier ? value : false,
          isColor,
          isPath,
          isFunction: isFunction ? value : false,
          moveAlgorithm: isColor
            ? moveColor
            : isPath
            ? movePath
            : isBezier
            ? moveBezier
            : moveDefault
        });
      }
    }
    this.duration = ifNull(calc(duration), 0);
    this.ease = ifNull(ease, t => t);
  }

  reset() {
    this.initialized = false;
  }

  init(sprite, time) {
    var l = this.changeValues.length,
      data;
    while (l--) {
      data = this.changeValues[l];
      if (data.isFunction) {
        data.from = sprite[data.name];
        data.to = data.isFunction(data.from);
        if (data.isColor) {
          data.colorFrom = new TinyColor(data.from);
          data.colorTo = new TinyColor(data.to);
          data.moveAlgorithm = moveColor;
        } else if (data.isPath) {
          [data.pathFrom, data.pathTo] = sprite.changeToPathInit(
            data.from,
            data.to
          );
          data.moveAlgorithm = movePath;
        } else if (Array.isArray(data.to)) {
          data.values = [sprite[data.name], ...data.to];
          data.moveAlgorithm = moveBezier;
        } else {
          data.delta = data.to - data.from;
          data.moveAlgorithm = moveDefault;
        }
      } else if (data.isColor) {
        data.colorFrom = new TinyColor(sprite[data.name]);
        data.colorTo = new TinyColor(data.to);
      } else if (data.isPath) {
        [data.pathFrom, data.pathTo] = sprite.changeToPathInit(
          sprite[data.name],
          data.to
        );
      } else if (data.bezier) {
        data.values = [sprite[data.name], ...data.bezier];
      } else {
        data.from = sprite[data.name];
        data.delta = data.to - data.from;
      }
    }
  }

  run(sprite, time) {
    if (!this.initialized) {
      this.initialized = true;
      this.init(sprite, time);
    }

    // return time left
    if (this.duration <= time) {
      let l = this.changeValues.length;
      let data;

      // prevent round errors by applying end-data
      while (l--) {
        data = this.changeValues[l];
        sprite[data.name] = data.to;
      }
    } else {
      let l = this.changeValues.length;
      let data;
      const progress = this.ease(time / this.duration);

      while (l--) {
        data = this.changeValues[l];
        sprite[data.name] = data.moveAlgorithm(progress, data, sprite);
      }
    }
    return time - this.duration;
  }
}
