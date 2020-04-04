export default class Element {
  enabled = true;
  /*
  _clickIntend = false;
  _hoverIntend = false;
  _hasDetectImage = false;
  _doubleClickElementTimer = undefined;
  */
  constructor({ doubleClickDetectInterval = 350 }) {
    this._doubleClickDetectInterval = doubleClickDetectInterval;
  }

  isDrawFrame() {
    return this._hasDetectImage ? 1 : 0;
  }

  _dispatchEvent(scene, isClick, param) {
    if (isClick) {
      if (scene.has('doubleClickElement')) {
        if (this._doubleClickElementTimer) {
          clearTimeout(this._doubleClickElementTimer);
          this._doubleClickElementTimer = 0;
          scene.map('doubleClickElement', param);
        } else {
          this._doubleClickElementTimer = setTimeout(() => {
            this._doubleClickElementTimer = 0;
            scene.map('clickElement', param);
          }, this._doubleClickDetectInterval);
        }
      } else {
        scene.map('clickElement', param);
      }
    } else {
      scene.map('hoverElement', param);
    }
  }

  _dispatchNonEvent(scene, isClick, param) {
    if (isClick) {
      if (scene.has('doubleClickNonElement')) {
        if (this._doubleClickElementTimer) {
          clearTimeout(this._doubleClickElementTimer);
          this._doubleClickElementTimer = undefined;
          scene.map('doubleClickNonElement', param);
        } else {
          this._doubleClickElementTimer = setTimeout(() => {
            this._doubleClickElementTimer = undefined;
            scene.map('clickNonElement', param);
          }, this._doubleClickDetectInterval);
        }
      } else {
        scene.map('clickNonElement', param);
      }
    } else {
      scene.map('hoverNonElement', param);
    }
  }

  initSprite({ scene, output, layerManager, canvasId }) {
    this._hasDetectImage = false;
    if (this._clickIntend || this._hoverIntend) {
      const isClick = !!this._clickIntend;
      const { mx, my } = this._clickIntend || this._hoverIntend;
      const scale = scene.additionalModifier.scaleCanvas;
      const ctx = output.context[canvasId];
      const cx = Math.round(mx / scale);
      const cy = Math.round(my / scale);
      const [x, y] = scene.transformPoint(mx, my);

      ctx.save();
      ctx.setTransform(...scene.viewport().m);
      let found = 0;
      layerManager.forEach(
        ({ layerId, element, isFunction, elementId }) => {
          if (!isFunction) {
            const a = element.detect(ctx, cx, cy);
            if (a === "c") {
              found = "c";
            } else if (a) {
              found = { layerId, element: a, elementId };
              return false;
            }
          }
        }
      );
      ctx.restore();

      if (found === "c") {
        this._hasDetectImage = true;
      } else {
        this._clickIntend = false;
        this._hoverIntend = false;
        const param = {
          mx,
          my,
          x,
          y
        };
        if (found) {
          Object.assign(param, found);
          this._dispatchEvent(scene, isClick, param);
        } else {
          this._dispatchNonEvent(scene, isClick, param);
        }
      }
    }
  }

  draw({
    engine,
    scene,
    layerManager,
    output,
    canvasId
  }) {
    if (!canvasId && this._hasDetectImage) {
      const isClick = !!this._clickIntend;
      const { mx, my } = this._clickIntend || this._hoverIntend;
      const scale = scene.additionalModifier.scaleCanvas;
      const ctx = output.context[canvasId];
      const cx = Math.round(mx / scale);
      const cy = Math.round(my / scale);
      const [x, y] = this.transformPoint(mx, my);
      const param = {
        mx,
        my,
        x,
        y
      };

      const oldISE = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();

      ctx.setTransform(...scene.viewport().m);

      layerManager.forEach(({ layerId, element, isFunction, elementId }) => {
        if (!isFunction) {
          const color = `rgb(${elementId & 0xff}, ${(elementId & 0xff00) >>
            8}, ${layerId & 0xff})`;
          element.detectDraw(ctx, color);
        }
      }, 0);
      ctx.restore();
      ctx.imageSmoothingEnabled = oldISE;
      engine.normContext(ctx);

      this._clickIntend = false;
      this._hoverIntend = false;

      const p = ctx.getImageData(cx, cy, 1, 1).data;
      if (p[3]) {
        param.layerId = p[2];
        param.elementId = p[0] + (p[1] << 8);
        param.element = layerManager
          .getById(param.layerId)
          .getById(param.elementId);
        this._dispatchEvent(scene, isClick, param);
      } else {
        this._dispatchNonEvent(scene, isClick, param);
      }
    }
  }

  mouseUp({scene, position: [mx, my]}) {
    this._clickIntend = scene.has('clickElement') && { mx, my };
  }

  mouseMove({scene, position: [mx, my]}) {
    this._hoverIntend = scene.has('hoverElement') && { mx, my };
  }
}
