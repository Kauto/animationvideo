import ifNull from '../func/ifnull'
import type { ValueOf } from '../helper';
import LayerManager from '../LayerManager';
import type { ConfigurationObject, EventsReturn, ParameterList, ParameterListInitDestroy, ParameterListWithoutTime } from '../Scene';
import Scene from '../Scene';
import { ISpriteFunctionOrSprite } from '../Sprites/Sprite';

export default class Events implements ConfigurationObject {
  type = "events"
  _reseted: boolean = false

  _events: {
    n: HTMLElement,
    e: keyof HTMLElementEventMap
    f: (this: HTMLElement, el: ValueOf<HTMLElementEventMap>) => any
  }[] = []

  _pushEvent(command: "mouseDown" | "mouseUp" | "mouseOut" | "mouseMove" | "mouseWheel", event: Event | TouchEvent | MouseEvent, scene: Scene) {
    if (ifNull<boolean>(scene.value("preventDefault"), true)) {
      event.preventDefault();
    }
    if (!this._reseted) {
      return
    }
    const [mx, my] = this.getMousePosition({ event });
    const [x, y] = scene.transformPoint(mx, my);
    scene.pipeBack(command, {
      event,
      position: [mx, my],
      x,
      y,
      button: this.getMouseButton({ event }),
    });
  }

  events({ scene }: ParameterListInitDestroy) {
    return [
      scene.has("mouseDown") && [
        ["touchstart", "mousedown"],
        (event: TouchEvent | MouseEvent) => this._pushEvent("mouseDown", event, scene),
      ],
      scene.has("mouseUp") && [
        ["touchend", "mouseup"],
        (event: TouchEvent | MouseEvent) => this._pushEvent("mouseUp", event, scene),
      ],
      scene.has("mouseOut") && [
        ["touchendoutside", "mouseout"],
        (event: TouchEvent | MouseEvent) => this._pushEvent("mouseOut", event, scene),
      ],
      scene.has("mouseMove") && [
        ["touchmove", "mousemove"],
        (event: TouchEvent | MouseEvent) => this._pushEvent("mouseMove", event, scene),
      ],
      scene.has("mouseWheel") && [
        ["wheel"],
        (event: Event) => this._pushEvent("mouseWheel", event, scene),
      ],
      (ifNull(scene.value<"preventDefault", boolean>("preventDefault"), true)) && [
        ["contextmenu"],
        (e: Event) => e.preventDefault(),
      ],
    ].filter((v) => v) as EventsReturn
  }

  init({ output, scene }: ParameterListInitDestroy) {
    const element = output.canvas[0];

    const events: (keyof HTMLElementEventMap | [keyof HTMLElementEventMap, (this: HTMLElement, el: ValueOf<HTMLElementEventMap>) => any])[][] = scene.map("events", {});

    this._events = events
      .filter(Array.isArray)
      // flat(1)
      .reduce((acc, cur) => {
        acc.push.apply(acc, cur);
        return acc;
      }, [])
      // convert strings to call to function with the same name
      .map(cur =>
        Array.isArray(cur) ? cur : [[cur], (event: ValueOf<HTMLElementEventMap>) => {
          if (ifNull(scene.value("preventDefault"), true)) event.preventDefault();
          scene.pipeBack(cur, { event });
        }]
      )
      .map(([events, func]) =>
        events.map((e: keyof HTMLElementEventMap) => ({
          n: element,
          e: e,
          f: func,
        }))
      )
      // workaround for .flat(1) for edge
      .reduce((acc, cur) => {
        if (Array.isArray(cur)) {
          acc.push.apply(acc, cur);
        } else {
          acc.push(cur);
        }
        return acc;
      }, []);

    this._events.forEach((v) => {
      v.n.addEventListener(v.e, v.f, true);
    });
  }

  destroy() {
    this._events.forEach((v) => {
      v.n.removeEventListener(v.e, v.f, true);
    });
    this._events = [];
  }

  reset(params: ParameterListWithoutTime, layerManager: LayerManager | ISpriteFunctionOrSprite[][]) {
    this._reseted = true;
    return layerManager;
  }

  getMousePosition({ event: e }: { event: Event | TouchEvent | MouseEvent }) {
    let touches;
    if ((e as TouchEvent).touches && (e as TouchEvent).touches.length > 0) {
      touches = (e as TouchEvent).targetTouches;
    } else if ((e as TouchEvent).changedTouches && (e as TouchEvent).changedTouches.length > 0) {
      touches = (e as TouchEvent).changedTouches;
    }
    if (touches) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const length = touches.length;
      touches = Array.from(touches);
      return [
        touches.reduce((sum, v) => sum + v.pageX, 0) / length - rect.left,
        touches.reduce((sum, v) => sum + v.pageY, 0) / length - rect.top,
      ];
    }
    if ((e as MouseEvent).offsetX === undefined) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      return [(e as MouseEvent).clientX - rect.left, (e as MouseEvent).clientY - rect.top];
    }
    return [(e as MouseEvent).offsetX, (e as MouseEvent).offsetY];
  }

  getMouseButton({ event: e }: { event: Event | TouchEvent | MouseEvent }) {
    return (
      (e as TouchEvent).touches
        ? ((e as TouchEvent).touches.length || (e as TouchEvent).changedTouches.length)
        : ifNull((e as MouseEvent).buttons
          ? (e as MouseEvent).buttons
          : [0, 1, 4, 2][(e as MouseEvent).which], 1)
    );
  }
}
