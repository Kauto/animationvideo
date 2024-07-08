import Scene, {
  ConfigurationObject,
  ElementClickInfo,
  ParameterListCanvas,
  ParameterListClickElement,
  ParameterListClickNonElement,
  ParameterListPositionEvent,
} from "../Scene";
import type { ISprite } from "../Sprites/Sprite";

export interface MiddlewareElementOptions {
  doubleClickDetectInterval?: number;
}

interface MousePosition {
  mx: number;
  my: number;
}

export default class Element implements ConfigurationObject {
  _clickIntend: MousePosition | undefined = undefined;
  _hoverIntend: MousePosition | undefined = undefined;
  _hasDetectImage: boolean = false;
  _doubleClickElementTimer: number | undefined = undefined;
  _doubleClickDetectInterval: number;

  constructor({
    doubleClickDetectInterval = 350,
  }: MiddlewareElementOptions = {}) {
    this._doubleClickDetectInterval = doubleClickDetectInterval;
  }

  isDrawFrame() {
    return this._hasDetectImage ? 1 : 0;
  }

  _dispatchEvent(
    scene: Scene,
    isClick: boolean,
    param: ParameterListClickElement,
  ) {
    if (isClick) {
      if (scene.has("doubleClickElement")) {
        if (this._doubleClickElementTimer) {
          window.clearTimeout(this._doubleClickElementTimer);
          this._doubleClickElementTimer = 0;
          scene.map("doubleClickElement", param);
        } else {
          this._doubleClickElementTimer = window.setTimeout(() => {
            this._doubleClickElementTimer = 0;
            scene.map("clickElement", param);
          }, this._doubleClickDetectInterval);
        }
      } else {
        scene.map("clickElement", param);
      }
    } else {
      scene.map("hoverElement", param);
    }
  }

  _dispatchNonEvent(
    scene: Scene,
    isClick: boolean,
    param: ParameterListClickNonElement,
  ) {
    if (isClick) {
      if (scene.has("doubleClickNonElement")) {
        if (this._doubleClickElementTimer) {
          clearTimeout(this._doubleClickElementTimer);
          this._doubleClickElementTimer = undefined;
          scene.map("doubleClickNonElement", param);
        } else {
          this._doubleClickElementTimer = window.setTimeout(() => {
            this._doubleClickElementTimer = undefined;
            scene.map("clickNonElement", param);
          }, this._doubleClickDetectInterval);
        }
      } else {
        scene.map("clickNonElement", param);
      }
    } else {
      scene.map("hoverNonElement", param);
    }
  }

  initSprites(params: ParameterListCanvas) {
    const { scene, output, layerManager, canvasId } = params;
    this._hasDetectImage = false;
    if (this._clickIntend || this._hoverIntend) {
      const isClick = !!this._clickIntend;
      const { mx, my } = this._clickIntend || this._hoverIntend!;
      const scale = scene.additionalModifier.scaleCanvas;
      const ctx = output.context[canvasId || 0];
      const cx = Math.round(mx / scale);
      const cy = Math.round(my / scale);
      const [x, y] = scene.transformPoint(mx, my);

      ctx.save();
      ctx.setTransform(...scene.viewport().m);
      let found: ElementClickInfo | undefined | "c" = undefined;
      layerManager.forEach(({ layerId, element, isFunction, elementId }) => {
        if (!isFunction) {
          const a = (element as ISprite).detect(ctx, cx, cy);
          if (a === "c") {
            found = "c";
          } else if (a) {
            found = { layerId, element: a, elementId };
            return false;
          }
        }
      });
      ctx.restore();

      if (found === "c") {
        this._hasDetectImage = true;
      } else {
        this._clickIntend = undefined;
        this._hoverIntend = undefined;
        const param: ParameterListClickNonElement | ParameterListClickElement =
          Object.assign(
            {
              mx,
              my,
              x,
              y,
            },
            params,
          ) as ParameterListClickNonElement;
        if (found) {
          Object.assign(param, found as ElementClickInfo);
          this._dispatchEvent(scene, isClick, param);
        } else {
          this._dispatchNonEvent(scene, isClick, param);
        }
      }
    }
  }

  draw(params: ParameterListCanvas) {
    const { engine, scene, layerManager, output, canvasId } = params;
    if (!canvasId && this._hasDetectImage) {
      const isClick = !!this._clickIntend;
      const { mx, my } = this._clickIntend || this._hoverIntend!;
      const scale = scene.additionalModifier.scaleCanvas;
      const ctx = output.context[0];
      const cx = Math.round(mx / scale);
      const cy = Math.round(my / scale);
      const [x, y] = scene.transformPoint(mx, my);
      const param: ParameterListClickNonElement | ParameterListClickElement =
        Object.assign(
          {
            mx,
            my,
            x,
            y,
          },
          params,
        ) as ParameterListClickNonElement;

      const oldISE = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();

      ctx.setTransform(...scene.viewport().m);

      layerManager.forEach(({ layerId, element, isFunction, elementId }) => {
        if (!isFunction) {
          const color = `rgb(${elementId & 0xff}, ${
            (elementId & 0xff00) >> 8
          }, ${layerId & 0xff})`;
          (element as ISprite).detectDraw(ctx, color);
        }
      }, 0);
      ctx.restore();
      ctx.imageSmoothingEnabled = oldISE;
      engine.normContext(ctx);

      this._clickIntend = undefined;
      this._hoverIntend = undefined;

      const p = ctx.getImageData(cx, cy, 1, 1).data;
      if (p[3]) {
        const layerId = p[2];
        const elementId = p[0] + (p[1] << 8);
        Object.assign(param, {
          layerId,
          elementId,
          element: layerManager.getById(layerId).getById(elementId),
        });
        this._dispatchEvent(scene, isClick, param);
      } else {
        this._dispatchNonEvent(scene, isClick, param);
      }
    }
  }

  mouseUp({ scene, position: [mx, my], button }: ParameterListPositionEvent) {
    this._clickIntend =
      button === 1 && scene.has("clickElement") ? { mx, my } : undefined;
  }

  mouseMove({ scene, position: [mx, my] }: ParameterListPositionEvent) {
    this._hoverIntend = scene.has("hoverElement") ? { mx, my } : undefined;
  }
}
