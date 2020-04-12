import ifNull from '../func/ifNull.mjs'

export default class Events {
  constructor() {
    this.type = "events";
  }

  _pushEvent(command, event, scene) {
    if (ifNull(scene.value("preventDefault"), true)) event.preventDefault();
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

  init({ output, scene }) {
    const element = output.canvas[0];

    const events = scene.map("events");
    events.push(
      [
        scene.has("mouseDown") && [
          ["touchstart", "mousedown"],
          (event) => this._pushEvent("mouseDown", event, scene),
        ],
        scene.has("mouseUp") && [
          ["touchend", "mouseup"],
          (event) => this._pushEvent("mouseUp", event, scene),
        ],
        scene.has("mouseOut") && [
          ["touchendoutside", "mouseout"],
          (event) => this._pushEvent("mouseOut", event, scene),
        ],
        scene.has("mouseMove") && [
          ["touchmove", "mousemove"],
          (event) => this._pushEvent("mouseMove", event, scene),
        ],
        scene.has("mouseWheel") && [
          ["wheel"],
          (event) => this._pushEvent("mouseWheel", event, scene),
        ],
        (scene.value("preventDefault") ?? true) && [
          ["contextmenu"],
          (e) => e.preventDefault(),
        ],
      ].filter((v) => v)
    );

    this._events = events
      .filter(Array.isArray)
      .reduce((acc, cur) => {
        acc.push.apply(acc, cur);
        return acc;
      }, [])
      .map(([events, func]) =>
        events.map((e) => ({
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

  getMousePosition({ event: e }) {
    let touches;
    if (e.touches && e.touches.length > 0) {
      touches = e.targetTouches;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      touches = e.changedTouches;
    }
    if (touches) {
      const rect = e.target.getBoundingClientRect();
      const length = touches.length;
      touches = Array.from(touches);
      return [
        touches.reduce((sum, v) => sum + v.pageX, 0) / length - rect.left,
        touches.reduce((sum, v) => sum + v.pageY, 0) / length - rect.top,
      ];
    }
    if (e.offsetX === undefined) {
      const rect = e.target.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    }
    return [e.offsetX, e.offsetY];
  }

  getMouseButton({ event: e }) {
    return (
      e.touches
        ? (e.touches.length || e.changedTouches.length)
        : ifNull(e.buttons
        ? e.buttons
        : [0, 1, 4, 2][e.which], 1)
    );
  }
}
