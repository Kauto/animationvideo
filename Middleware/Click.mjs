export default class Click {
  /*
    _doubleClickElementTimer = undefined;
  */
  constructor({ doubleClickDetectInterval = 350 } = {}) {
    this._doubleClickDetectInterval = doubleClickDetectInterval;
  }

  mouseUp(param) {
    const { scene, button } = param;
    if (button === 1) {
      if (scene.has("doubleClick")) {
        if (this._doubleClickElementTimer) {
          clearTimeout(this._doubleClickElementTimer);
          this._doubleClickElementTimer = 0;
          scene.map("doubleClick", param);
        } else {
          this._doubleClickElementTimer = setTimeout(() => {
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
