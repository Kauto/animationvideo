import calc from "../func/calc";
import ifNull from "../func/ifnull";
import { TinyColor } from "@ctrl/tinycolor";
import type { IAnimation } from "./Animation";
import type { ISprite } from "../Sprites/Sprite";

const degToRad = Math.PI / 180;

function moveDefault(progress: number, data: IAlgorithmData) {
  return (data.from! as number) + progress * data.delta!;
}

function moveStatic(progress: number, data: IAlgorithmData) {
  return progress >= 0.5 ? data.to : data.from!;
}

function moveBezier(progress: number, data: IAlgorithmData) {
  const copy = [...data.values!];
  let copyLength = copy.length;
  let i;

  while (copyLength > 1) {
    copyLength--;
    for (i = 0; i < copyLength; i++) {
      copy[i] = copy[i] + progress * (copy[i + 1] - copy[i]);
    }
  }
  return copy[0];
}

function moveColor(progress: number, data: IAlgorithmData) {
  return data.colorFrom!.mix(data.colorTo!, progress * 100).toString();
}

function movePath(
  progress: number,
  { pathFrom, pathTo }: IAlgorithmData,
  sprite?: ISprite,
) {
  return sprite!.changeToPath!(progress, {
    pathFrom: pathFrom!,
    pathTo: pathTo!,
  });
}

export type TProperty = number | string;
export type TBezier = number[];
export type TChangeFunction =
  | ((from?: number | undefined) => number)
  | ((from?: string | undefined) => string);
export type TChangeValue = TProperty | TBezier | TChangeFunction;
export interface IChangeValueMeta {
  name: string;
  to: TProperty;
  bezier?: TBezier;
  isColor: boolean;
  isPath: boolean;
  isStatic: boolean;
  isFunction?: TChangeFunction;
  moveAlgorithm: TAlgorithm;
}
export type TAlgorithm = (
  progress: number,
  data: IAlgorithmData,
  sprite?: ISprite,
) => TProperty | number[][][];
export interface IAlgorithmData extends IChangeValueMeta {
  from?: TProperty;
  delta?: number;
  values?: TBezier;
  pathFrom?: number[][][];
  pathTo?: number[][][];
  colorFrom?: TinyColor;
  colorTo?: TinyColor;
}

// to values of a object
export default class ChangeTo implements IAnimation {
  _initialized = false;
  _changeValues: IChangeValueMeta[];
  _duration: number;
  _ease: (t: number) => number;
  constructor(
    changeValues: Record<string, TChangeValue>,
    duration: number,
    ease?: (t: number) => number,
  ) {
    this._changeValues = [];
    for (const k in changeValues) {
      const orgValue = changeValues[k];
      const value =
        k === "rotationInDegree" ? (orgValue as number) * degToRad : orgValue;
      const isColor = k === "color" || k === "borderColor";
      const isPath = k === "path";
      const isStatic = k === "text";
      const isFunction = typeof value === "function";
      const isBezier = !isColor && Array.isArray(value);
      const names =
        k === "scale"
          ? ["scaleX", "scaleY"]
          : k === "rotationInRadian" || k === "rotationInDegree"
            ? ["rotation"]
            : [k];
      for (const name of names) {
        this._changeValues.push({
          name,
          to: isBezier ? value[value.length - 1] : (calc(value) as TProperty),
          bezier: isBezier ? value : undefined,
          isColor,
          isPath,
          isStatic,
          isFunction: isFunction ? value : undefined,
          moveAlgorithm: isColor
            ? moveColor
            : isPath
              ? movePath
              : isBezier
                ? moveBezier
                : isStatic
                  ? moveStatic
                  : moveDefault,
        });
      }
    }
    this._duration = ifNull(calc(duration), 0);
    this._ease = ifNull(ease, (t: number) => t);
  }

  reset() {
    this._initialized = false;
  }

  _init(sprite: ISprite, _time: number) {
    let l = this._changeValues.length;
    while (l--) {
      const data: IAlgorithmData = this._changeValues[l];
      // @ts-expect-error generic property overwrite
      const from = sprite.p[data.name] as unknown as TProperty;
      if (data.isFunction) {
        data.from = from;
        // @ts-expect-error generic property overwrite
        data.to = data.isFunction(data.from);
        if (data.isColor) {
          data.colorFrom = new TinyColor(data.from);
          data.colorTo = new TinyColor(data.to);
          data.moveAlgorithm = moveColor;
        } else if (data.isPath) {
          [data.pathFrom, data.pathTo] = sprite.changeToPathInit!(
            data.from as string,
            data.to as string,
          );
          data.moveAlgorithm = movePath;
        } else if (Array.isArray(data.to)) {
          data.values = [from as number, ...data.to];
          data.moveAlgorithm = moveBezier;
        } else if (!data.isStatic) {
          data.delta = (data.to as number) - (data.from as number);
          data.moveAlgorithm = moveDefault;
        }
      } else if (data.isColor) {
        //
        data.colorFrom = new TinyColor(from as string);
        data.colorTo = new TinyColor(data.to);
      } else if (data.isPath) {
        [data.pathFrom, data.pathTo] = sprite.changeToPathInit!(
          from as string,
          data.to as string,
        );
      } else if (data.bezier) {
        data.values = [from as number, ...data.bezier];
      } else {
        data.from = from as number;
        data.delta = (data.to as number) - data.from;
      }
    }
  }

  run(sprite: ISprite, time: number) {
    if (!this._initialized) {
      this._initialized = true;
      this._init(sprite, time);
    }

    // return time left
    if (this._duration <= time) {
      let l = this._changeValues.length;
      let data;

      // prevent round errors by applying end-data
      while (l--) {
        data = this._changeValues[l];
        // @ts-expect-error generic property overwrite
        sprite.p[data.name] = data.to;
      }
    } else {
      let l = this._changeValues.length;
      let data;
      const progress = this._ease(time / this._duration);

      while (l--) {
        data = this._changeValues[l];
        // @ts-expect-error generic property overwrite
        sprite.p[data.name] = data.moveAlgorithm(progress, data, sprite);
      }
    }
    return time - this._duration;
  }
}
