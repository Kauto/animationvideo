import Transform from "../func/transform";
import type { AdditionalModifier, ConfigurationObject, ParameterListWithoutTime, RectPosition } from "../Scene";

export interface CameraPosition {
  zoom: number
  x: number
  y: number
}

export default class Camera implements ConfigurationObject {
  type = "camera"
  cam: CameraPosition
  constructor(config: Partial<CameraPosition> = {}) {
    this.type = "camera";
    this.cam = Object.assign({
      zoom: 1,
      x: 0,
      y: 0,
    }, config);
  }

  viewport({ }:ParameterListWithoutTime, matrix: Transform) {
    return matrix
      .scale(this.cam.zoom, this.cam.zoom)
      .translate(-this.cam.x, -this.cam.y);
  }

  viewportByCam({ engine }: ParameterListWithoutTime, cam: CameraPosition) {
    const hw = engine.getWidth() / 2;
    const hh = engine.getHeight() / 2;
    const scale = engine.getRatio() > 1 ? hw : hh;
    return new Transform()
      .translate(hw, hh)
      .scale(scale, scale)
      .scale(cam.zoom, cam.zoom)
      .translate(-cam.x, -cam.y);
  }

  additionalModifier({ }, additionalModifier: AdditionalModifier) {
    additionalModifier.cam = Object.assign({}, this.cam);
    return additionalModifier;
  }

  clampView(params: ParameterListWithoutTime & { clampLimits?: RectPosition }, cam: CameraPosition) {
    const { engine, scene, clampLimits } = params
    const cl = clampLimits || {
      x1: scene.additionalModifier.x,
      y1: scene.additionalModifier.y,
      x2: scene.additionalModifier.x + scene.additionalModifier.width,
      y2: scene.additionalModifier.y + scene.additionalModifier.height,
    };
    const invert = this.viewportByCam(params, cam).invert();
    const [x1, y1] = invert.transformPoint(0, 0);
    const [x2, y2] = invert.transformPoint(
      engine.getWidth(),
      engine.getHeight()
    );

    // check for x
    // is there a zoom in?
    if (x2 - x1 <= cl.x2 - cl.x1) {
      if (x1 < cl.x1) {
        if (x2 <= cl.x2) {
          cam.x += cl.x1 - x1;
        }
      } else {
        if (x2 > cl.x2) {
          cam.x += cl.x2 - x2;
        }
      }
    } else {
      if (x1 > cl.x1) {
        cam.x += cl.x1 - x1;
      } else {
        if (x2 < cl.x2) {
          cam.x += cl.x2 - x2;
        }
      }
    }

    // check for y
    // zoom in?
    if (y2 - y1 <= cl.y2 - cl.y1) {
      if (y1 < cl.y1) {
        if (y2 <= cl.y2) {
          cam.y += cl.y1 - y1;
        }
      } else {
        if (y2 > cl.y2) {
          cam.y += cl.y2 - y2;
        }
      }
    } else {
      if (y1 > cl.y1) {
        cam.y += cl.y1 - y1;
      } else {
        if (y2 < cl.y2) {
          cam.y += cl.y2 - y2;
        }
      }
    }
    return cam;
  }

  set zoom(value) {
    this.cam.zoom = value;
  }

  set camX(v) {
    this.cam.x = v;
  }

  set camY(v) {
    this.cam.y = v;
  }

  get zoom() {
    return this.cam.zoom;
  }

  get camX() {
    return this.cam.x;
  }

  get camY() {
    return this.cam.y;
  }

  zoomToFullScreen({ scene }: ParameterListWithoutTime) {
    return Math.min(
      scene.additionalModifier.fullScreen.width /
      scene.additionalModifier.width,
      scene.additionalModifier.fullScreen.height /
      scene.additionalModifier.height
    );
  }

  zoomTo(params: ParameterListWithoutTime & RectPosition & {cam? : CameraPosition}) {
    const { scene, engine, cam, x1, y1, x2, y2 } = params
    const scale = scene.additionalModifier.scaleCanvas;
    const invert = this.viewportByCam(params, cam || this.cam).invert();
    const [sx1, sy1] = invert.transformPoint(0, 0);
    const [sx2, sy2] = invert.transformPoint(
      engine.getWidth() * scale,
      engine.getHeight() * scale
    );
    const sw = sx2 - sx1;
    const sh = sy2 - sy1;
    const w = x2 - x1;
    const h = y2 - y1;
    const mx = x1 + w / 2;
    const my = y1 + h / 2;
    const zoomX = sw / w;
    const zoomY = sh / h;
    const ret = {
      x: mx,
      y: my,
      zoom: (cam || this.cam).zoom * Math.max(Math.min(zoomX, zoomY), Number.MIN_VALUE),
    };
    if (cam) {
      cam.x = ret.x;
      cam.y = ret.y;
      cam.zoom = ret.zoom;
    } else {
      this.cam = ret;
    }
  }
}
