export default class Events {
  enabled = true;
  type = "events";

  init({ output, scene }) {
    const element = output.canvas[0];

    const events = scene.map("events");
    events.push(
      [
        scene.value("preventDefault") && [
          ["contextmenu"],
          e => e.preventDefault()
        ],
        scene.has("mouseDown") && [
          ["touchstart", "mousedown"],
          event => {
            if (scene.value("preventDefault")) event.preventDefault();
            scene.pipeBack("mouseDown", {
              event,
              position: this.getMousePosition({event}),
              button: this.getMouseButton({event})
            });
          }
        ],
        scene.has("mouseUp") && [
          ["touchend", "mouseup"],
          event =>{
            if (scene.value("preventDefault")) event.preventDefault();
            scene.pipeBack("mouseUp", {
              event,
              position: this.getMousePosition({event}),
              button: this.getMouseButton({event})
            })
          }
        ],
        scene.has("mouseOut") && [
          ["touchendoutside", "mouseout"],
          event =>{
            if (scene.value("preventDefault")) event.preventDefault();
            scene.pipeBack("mouseOut", {
              event,
              position: this.getMousePosition({event}),
              button: this.getMouseButton({event})
            })
          }
        ],
        scene.has("mouseMove") && [
          ["touchmove", "mousemove"],
          event =>{
            if (scene.value("preventDefault")) event.preventDefault();
            scene.pipeBack("mouseMove", {
              event,
              position: this.getMousePosition({event}),
              button: this.getMouseButton({event})
            })
          }
        ],
        scene.has("mouseWheel") && [
          ["wheel"],
          event =>{
            if (scene.value("preventDefault")) event.preventDefault();
            scene.pipeBack("mouseWheel", {
              event,
              position: this.getMousePosition({event}),
              button: this.getMouseButton({event})
            })
          }
        ]
      ].filter(v => v)
    );

    this._events = events
      .filter(Array.isArray)
      .reduce((acc, cur) => {
        acc.push.apply(acc, cur);
      }, [])
      .map(([events, func]) =>
        events.map(e => ({
          n: element,
          e: e,
          f: func
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

    this._events.forEach(v => {
      v.n.addEventListener(v.e, v.f, true);
    });
  }

  destroy() {
    this._events.forEach(v => {
      v.n.removeEventListener(v.e, v.f, true);
    });
    this._events = [];
  }

  getMousePosition({event: e}) {
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
        touches.reduce((sum, v) => sum + v.pageY, 0) / length - rect.top
      ];
    }
    if (e.offsetX === undefined) {
      const rect = e.target.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    }
    return [e.offsetX, e.offsetY];
  }

  
  getMouseButton({event: e}) {
    return this.camConfig.alternative
      ? e.which
        ? e.which - 1
        : e.button || 0
      : 0;
  }


}
