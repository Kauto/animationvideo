import type { ConfigurationObject, ParameterListPositionEvent } from "../Scene";
import type { MiddlewareElementOptions } from "./Element";

export default class Click implements ConfigurationObject {
  _doubleClickElementTimer: undefined | number;
  _doubleClickDetectInterval: number;

  constructor({
    doubleClickDetectInterval = 350,
  }: MiddlewareElementOptions = {}) {
    this._doubleClickDetectInterval = doubleClickDetectInterval;
  }

  mouseUp(param: ParameterListPositionEvent) {
    const { scene, button } = param;
    if (button === 1) {
      if (scene.has("doubleClick")) {
        if (this._doubleClickElementTimer) {
          clearTimeout(this._doubleClickElementTimer);
          this._doubleClickElementTimer = 0;
          scene.map("doubleClick", param);
        } else {
          this._doubleClickElementTimer = window.setTimeout(() => {
            this._doubleClickElementTimer = 0;
            scene.map("click", param);
          }, this._doubleClickDetectInterval);
        }
      } else {
        scene.map("click", param);
      }
    }
  }
}
