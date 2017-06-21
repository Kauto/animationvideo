import calc from '../../func/calc';
import ifNull from '../../func/ifnull';
import EasingLinear from 'eases/linear';
import isArray from 'lodash/isArray';
import Color from 'color';
import pasition from 'pasition';

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
  return data.colorTo.mix(data.colorFrom, progress).string();
}

function movePath(progress, data, sprite) {
  return pasition._lerp(data.pathFrom, data.pathTo, progress);
}

// to values of a object
export default class ChangeTo {

  constructor(changeValues, duration, ease) {
    this.initialized = false;
    this.changeValues = [];
    for (let k in changeValues) {
      let value = changeValues[k],
        isColor = k === 'color',
        isPath = k === 'path',
        isFunction = typeof value === 'function',
        isBezier = !isColor && isArray(value);
      this.changeValues.push({
        name: k,
        to: isBezier ? value[value.length - 1] : calc(value, 1, {}),
        bezier: isBezier ? value : false,
        isColor: isColor,
        isPath: isPath,
        isFunction: isFunction,
        moveAlgorithm: isFunction ? value : isColor ? moveColor : isPath ? movePath : isBezier ? moveBezier : moveDefault
      });
    }
    this.duration = ifNull(calc(duration), 0);
    this.ease = ifNull(ease, EasingLinear);
  }

  reset() {
    this.initialized = false;
  };

  init(sprite, time) {
    var l = this.changeValues.length,
      data;
    while (l--) {
      data = this.changeValues[l];
      if (data.isFunction) {
        data.from = sprite[data.name];
        data.moveAlgorithm(0, data);
        data.to = data.moveAlgorithm(1, data);
      } else if (data.isColor) {
        data.colorFrom = Color(sprite[data.name]);
        data.colorTo = Color(data.to);
      } else if (data.isPath) {
        [data.pathFrom, data.pathTo] = pasition._preprocessing(isArray(sprite[data.name]) ? sprite[data.name] : pasition.path2shapes(sprite[data.name]), isArray(data.to) ? data.to : pasition.path2shapes(data.to));
      } else if (data.bezier) {
        data.values = [sprite[data.name], ...data.bezier];
      } else {
        data.from = sprite[data.name];
        data.delta = data.to - data.from;
      }
    }
  };

  run(sprite, time) {
    if (!this.initialized) {
      this.initialized = true;
      this.init(sprite, time);
    }

    // return time left
    if (this.duration <= time) {
      let l = this.changeValues.length,
        data;

      // prevent round errors by applying end-data
      while (l--) {
        data = this.changeValues[l];
        sprite[data.name] = data.to;
      }
    } else {
      let l = this.changeValues.length,
        progress = this.ease(time / this.duration),
        data;

      while (l--) {
        data = this.changeValues[l];
        sprite[data.name] = data.moveAlgorithm(progress, data, sprite);
      }
    }
    return time - this.duration;
  }

  static createChangeToFunction = (callbackOrValue) => {
    return (progress, data) => {
      if (progress) {
        return data.from + progress * data.delta;
      } else {
          data.to = typeof(callbackOrValue) === 'function' ? callbackOrValue() : callbackOrValue;
          data.delta = data.to - data.from;
          return data.from;
      }
    }
  }

  static createChangeByFunction = (callbackOrValue) => {
    return (progress, data) => {
      if (progress) {
        return data.from + progress * data.delta;
      } else {
        data.delta = typeof(callbackOrValue) === 'function' ? callbackOrValue() : callbackOrValue;
        return data.from;
      }
    }
  }
}