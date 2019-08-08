# Table of Contents

- [Installation](#installation)
- [General overview](#general-overview)
  - [Engine](#engine)
  - [Sprites](#sprites)
  - [Animations](#animations)
- [TODO](#todo)
- [License](#license)

# AnimationVideo

AnimationVideo is a javascript library to animate objects inside a canvas. The animation can be perfectly synced to music which can even be sought. Everything works without WebGl.

For now see the *index.html* for examples.

# Installation

Install it for example with

```bash
npm i animationvideo
```

or include the `dist/animationvideo.umd.js` directly into your project. It's recommended to import each needed component separately. Then you will need to install [eases](https://www.npmjs.com/package/eases). You can install both together:

```bash
npm i animationvideo eases
```

# General overview
The [Engine](#engine) of Animationvideo will run [Scenes](#scenes) that consists of [Sprites](#sprites) that can be manipulated with [Animations](#Animations).

Here is how it looks like in an example:
```js
import Engine from 'animationvideo/Engine.mjs'
import Norm from 'animationvideo/Scenes/Norm.mjs'
import FastBlur from 'animationvideo/Sprites/FastBlur.mjs'
import Image from 'animationvideo/Sprites/Image.mjs'
import Forever from 'animationvideo/Animations/Forever.mjs'
import ChangeTo from 'animationvideo/Animations/ChangeTo.mjs'
import QuadInOut from 'eases/quad-in-out'

// The Engine runs the scene "Norm"
const engine = new Engine({
  canvas: document.querySelector('canvas'),
  // The Engine uses the scene "Norm"
  scene: new Norm({
    // load images beforehand
    images () {
      return { imageFile: 'https://via.placeholder.com/150' }
    },
    // initialisation of the scene with sprites
    reset () {
      // the scene resets with two layers
      return [
        // first layer consits of a Image
        [
          new Image({
            image: 'imageFile', // show image "imageFile" that was loaded before
            norm: true, // scale to full size
            animation: new Forever( // start animation
              [
                // scale larger for 60 seconds with a easing
                new ChangeTo({
                  scaleX: 1.1,
                  scaleY: 1.1
                }, 60000, QuadInOut),
                // scale back smaller for 60 seconds with a easing
                new ChangeTo({
                  scaleX: 1,
                  scaleY: 1
                }, 60000, QuadInOut)
              ]
            )
          })
        ],
        // second layer consits of a blur effect
        [
          new FastBlur({
            alphaMode: 'lighter', // make a glow
            gridSize: 10, // the glow has the size of 10 times 10
            darker: 0.5, // turn down the glow
            a: 0, // not visible
            animation: [
              // blend in the half visible glow for half a second with easing
              new ChangeTo({ a: 0.5 }, 500, QuadInOut)
            ]
          })
        ]
      ]
    }
  })
}).run() // start the engine
```
[Test code at codesandbox.io](https://codesandbox.io/s/quirky-ives-hwqqb?fontsize=14)

## Engine

The Engine is the foundation of Animationvideo that runs the system. It's a class that needs to be instantiated with `new`. The parameter is an object or a canvas.

```js
import Engine from 'animationvideo/Engine.mjs'

// general setup
const engine = new Engine(canvasOrOptions);

// init with canvas 
const engine = new Engine(document.querySelector('canvas'));

// init with object
const engine = new Engine({
  // automatic scaling of the canvas - default false
  autoSize: false,
  // the canvas that is used by Animationvideo
  canvas: null,
  // click event will be added to the canvas and send to an audio-scene
  clickToPlayAudio: false
  // the current scene
  scene: null,
});
```

### Constructor option autoSize
This feature will auto scale the canvas. This dynamically creates a balance between quality and performance. You can fine tune the parameter. Setting this to false disable the auto-sizing (this is the default setting). Setting this to true enable the auto-sizing with the default values.
```js
import Engine from 'animationvideo/Engine.mjs'

const engine = new Engine({
  // automatic scaling of the canvas - default false
  // can be true to set default values
  autoSize: {
    // enable/disable this feature
    enabled: true,
    // Best scaling factor (1 = size of drawable canvas is the size of the visible canvas)
    scaleLimitMin: 1,
    // Worst possible scaling factor
    scaleLimitMax: 8,
    // a value > 1. Larger values change the scale faster. 
    scaleFactor: 1.1,  
    // function that gets the visible width of the canvas in pixel
    referenceWidth: () => canvas.clientWidth, 
    // function that gets the visible height of the canvas in pixel
    referenceHeight: () => canvas.clientHeight, 
    // the current scale / the start scale
    currentScale: 1,
    // the time that the system stays at least in the current scale in ms
    waitTime: 800,
    // how many ms the system must be too slow till the scale gets worse (higher)
    offsetTimeLimitUp: 300,
    // how many ms the system must be too fast till the scale gets better (lower)
    offsetTimeLimitDown: 300,
    // the target time - how much time a frame of the main loop should take
    offsetTimeTarget: 1000 / 60,
    // if the time of a frame of the main loop is different than the "offsetTimeTarget",
    // it must be greater than "offsetTimeDelta" to be registered from the system
    offsetTimeDelta: 3,
    // adds events to recalculate the canvas size when the window
    // resizes/orientation changes
    registerResizeEvents: true,
    // adds events to disable the auto-size-system if the window/tab losses focus
    registerVisibilityEvents: true,
    // sets canvas width and height by setting the style attribute of the canvas
    setCanvasStyle: false,
    // start values for the waitTime and the offsetTime
    currentWaitedTime: 0,
    currentOffsetTime: 0
  },
  // don't forget to set canvas, scene...
  canvas: null //...
});
```
### Commands
The instance of Engine has some functions to change the scenes.
```js
import Engine from 'animationvideo/Engine.mjs'

// init with canvas 
const engine = new Engine(document.querySelector('canvas'));

// "recalculateCanvas" will trigger the scaling system of the auto-size-system
// (this will resize the canvas itself)
// after that it will trigger engine.resize()
engine.recalculateCanvas();

// "resize" will propagade a resize event to the sprite-objects of the current scene
engine.resize();

// "switchScene" will change the scene-object
engine.switchScene(scene);

// "run" starts the engine
engine.run();

// "destroy" clean up the events, stops the main loop
// that was started with "run"
engine.destroy();

```

## Scenes
### Default
### Norm
### Audio
### NormAudio
## Sprites
### Image
### Rect
### Circle
### Path
### Text
### Callback
### FastBlur
### StarField
### Group
### Canvas
### Particle
### Emitter
### Scroller
## Animations
### Sequence
### Loop
### Forever
### State
### Wait
### WaitDisabled
### ChangeTo
### Move
### Image
### ImageFrame
### Shake
### Callback
### If
### Once
### ShowOnce
### End
### EndDisable
### Remove

# TODO
* write demo with audio
* more tests
* debug error messages in console log

# License

[MIT](https://github.com/Kauto/animationvideo/blob/master/LICENSE)