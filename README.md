# AnimationVideo

AnimationVideo is a javascript library to animate objects inside a canvas. The animation can be perfectly synced to music which can even be sought. Everything works without WebGl.

## Examples

- [Perfect audio sync](https://codesandbox.io/s/eloquent-field-55tk6)
- [Zoom with gloom](https://codesandbox.io/s/quirky-ives-hwqqb)
- [Follow mouse move and feedback effect](https://codesandbox.io/s/infallible-wildflower-w3uo7)
- [Mouse controls to move and zoom](https://codesandbox.io/s/thirsty-https-v26ff)
- [Mouse zoom and mark regions](https://codesandbox.io/s/funny-williams-fhgx6)
- [Screenshot Lightbox](https://codesandbox.io/s/gallant-davinci-ts8v4)

or in the **index.html**.

# Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [General overview](#general-overview)
    - [How to import](#how-to-import)
    - [Example](#example)
    - [Engine](#engine)
        - [Constructor-option "autoSize"](#constructor-option-autosize)
        - [Commands](#commands)
    - [Scenes](#scenes)
        - [Default](#default)
            - [Layers](#layers)
        - [Norm](#norm)
        - [NormCamera](#normcamera)
        - [Timing](#timing)
            - [Audio](#audio)
    - [Sprites](#sprites)
        - [Image](#image)
        - [Rect](#rect)
        - [Circle](#circle)
        - [Path](#path)
        - [Text](#text)
        - [Callback](#callback)
        - [FastBlur](#fastblur)
        - [StarField](#starfield)
        - [Group](#group)
        - [Canvas](#canvas)
        - [Particle](#particle)
        - [Emitter](#emitter)
        - [Scroller](#scroller)
        - [StackBlur](#stackblur)
    - [Animations](#animations)
        - [Sequence](#sequence)
            - [Short form for Sequence](#short-form-for-sequence)
            - [Short form for Wait](#short-form-for-wait)
            - [Labels](#labels)
            - [Parallel sequences](#parallel-sequences)
        - [Loop](#loop)
        - [Forever](#forever)
        - [State](#state)
        - [Wait](#wait)
        - [WaitDisabled](#waitdisabled)
        - [ChangeTo](#changeto)
        - [Move](#move)
        - [Image](#image-1)
        - [ImageFrame](#imageframe)
        - [Shake](#shake)
        - [Callback](#callback-1)
        - [If](#if)
        - [Once](#once)
        - [ShowOnce](#showonce)
        - [End](#end)
        - [EndDisabled](#enddisabled)
        - [Remove](#remove)
        - [Stop](#stop)
        - [StopDisabled](#stopdisabled)
- [TODO](#todo)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

The [Engine](#engine) of AnimationVideo will run [Scenes](#scenes) that consists of [Sprites](#sprites) that can be manipulated with [Animations](#animations).

## How to import

The best way to import components of AnimationVideo is the direct import of the modules.

```js
import Engine from "animationvideo/Engine.mjs";
import Norm from "animationvideo/Scenes/Norm.mjs";
import FastBlur from "animationvideo/Sprites/FastBlur.mjs";
import Image from "animationvideo/Sprites/Image.mjs";
import Forever from "animationvideo/Animations/Forever.mjs";
import ChangeTo from "animationvideo/Animations/ChangeTo.mjs";
import QuadInOut from "eases/quad-in-out";
```

This is possible with [Webpack >= 4](https://webpack.js.org/) and other packers. For older packers you can use the main package and extract the needed components.

```js
import AnimationVideo from "lib/animationvideo";

const {
    Engine,
    Scenes: {Norm},
    Animations: {Forever, ChangeTo},
    Sprites: {Image, FastBlur},
    Easing: {QuadInOut}
} = AnimationVideo;
```

For simple web projects you can include the js-file directly and use the global `AnimationVideo` object.

```html
<script src="dist/animationvideo.umd.js"></script>
<script>
  new AnimationVideo.Engine(document.querySelector("canvas"))
    .switchScene(
      new AnimationVideo.Scenes.Norm({
        reset: () => [
          [
            new AnimationVideo.Sprites.Rect({ clear: true })
          ],
          [
            new AnimationVideo.Sprites.Circle({
              scaleX: 0.5,
              scaleY: 0.5,
              color: "#F00",
              animation: new AnimationVideo.Animations.Forever([
                new AnimationVideo.Animations.ChangeTo(
                  {
                    color: "#00F"
                  },
                  1000
                ),
                new AnimationVideo.Animations.ChangeTo(
                  {
                    color: "#F00"
                  },
                  1000
                )
              ])
            })
          ]
        ]
      })
    )
    .run();
</script>
```

Other examples are in the _index.html_.

## Example

Here is how the code looks like in an example:

```js
import Engine from "animationvideo/Engine.mjs";
import Norm from "animationvideo/Scenes/Norm.mjs";
import FastBlur from "animationvideo/Sprites/FastBlur.mjs";
import Image from "animationvideo/Sprites/Image.mjs";
import Forever from "animationvideo/Animations/Forever.mjs";
import ChangeTo from "animationvideo/Animations/ChangeTo.mjs";
import QuadInOut from "eases/quad-in-out";

// The Engine runs the scene "Norm"
new Engine({
  // automaticly adjust the size of the canvas
  autoSize: true,
  // set the target canvas
  canvas: document.querySelector("canvas"),
  // The Engine uses the scene "Norm"
  scene: new Norm({
    // load images beforehand
    images() {
      return { imageFile: "https://placekitten.com/400/400" };
    },
    // initialisation of the scene with sprites
    reset() {
      // the scene resets with two layers
      return [
        // first layer consits of a Image
        [
          new Image({
            image: "imageFile", // show image "imageFile" that was loaded before
            norm: true, // scale to full size
            animation: new Forever([
              // start animation
              // scale larger for 10 seconds with a easing
              new ChangeTo(
                {
                  scaleX: 1.3,
                  scaleY: 1.3
                },
                10000,
                QuadInOut
              ),
              // scale back smaller for 10 seconds with a easing
              new ChangeTo(
                {
                  scaleX: 1,
                  scaleY: 1
                },
                10000,
                QuadInOut
              )
            ])
          })
        ],
        // second layer consits of a blur effect
        [
          new FastBlur({
            compositeOperation: "lighter", // make a glow
            gridSize: 10, // the glow has the size of 10 times 10
            // pixel: true,
            darker: 0.5, // turn down the glow
            alpha: 0, // not visible
            animation: [
              // blend in the glow for half a second with easing
              new ChangeTo({ alpha: 1 }, 500, QuadInOut)
            ]
          })
        ]
      ];
    }
  })
}).run(); // start the engine
```

[Test code at codesandbox.io](https://codesandbox.io/s/quirky-ives-hwqqb)

## Engine

The Engine is the foundation of AnimationVideo that runs the system. It's a class that needs to be instantiated with `new`. The parameter is an object or a canvas.

```js
import Engine from "animationvideo/Engine.mjs";

// general setup
const engine = new Engine(canvasOrOptions);

// init with canvas
const engine = new Engine(document.querySelector("canvas"));

// init with object
const engine = new Engine({
  // automatic scaling of the canvas - default false
  autoSize: false,
  // the canvas that is used by AnimationVideo
  canvas: null,
  // click event will be added to the canvas and send to an audio-scene
  clickToPlayAudio: false,
  // render only every second frame
  // this is intended for mobile to save energy and prevent heating
  // you could combine this with https://github.com/juliangruber/is-mobile
  reduceFramerate: false,
  // the current scene
  scene: null
});
```

### Constructor-option "autoSize"

This feature will auto scale the canvas. This dynamically creates a balance between quality and performance. You can fine tune the parameter. Setting this to false disable the auto-sizing (this is the default setting). Setting this to true enable the auto-sizing with the default values.

```js
import Engine from "animationvideo/Engine.mjs";

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
import Engine from "animationvideo/Engine.mjs";

// init with canvas
const engine = new Engine(document.querySelector("canvas"));

// "recalculateCanvas" will trigger the scaling system of the auto-size-system
// (this will resize the canvas itself)
// after that it will trigger engine.resize()
engine.recalculateCanvas();

// "resize" will propagade a resize event to the sprite-objects of the current scene
engine.resize();

// "switchScene" will change the scene-object
engine.switchScene(scene);

// "run" starts the engine - returns a promise
/* await */ engine.run(/* optional: object with parameter that are given to the init-function */);

// "destroy" clean up the events, stops the main loop
// that was started with "run" - returns a promise
/* await */ engine.destroy();
```

## Scenes

A scene controls what happens on the screen and in the engine. It uses [Sprites](#sprites) and [Animations](#animations).

### Default

Default descries a Animation without sound on a canvas with a fixed size. In this canvas the coordinates of the top left corner is 0, 0 and the coordinate in the bottom right is the width, height of the canvas in pixels. This is the basic scene. All other scenes are based on this and add something special (f.e. add audio or the coordinates are special).

A scenes main task is to use the given _layerManager_ to first move the objects of the layers and then to draw them.

There are a number of functions that are given to the constructor that are explained in this example. The functions can be combined in a object or a class:

```js
import Engine from 'animationvideo/Engine.mjs'
import SceneDefault from 'animationvideo/Scenes/Default.mjs'
import TimingDefault from 'animationvideo/Timing/Default.mjs'

const engine = new Engine(document.querySelector('canvas'))

const classScene = new SceneDefault(class myScene { /*...same as in object...*/ });

const objectScene = new SceneDefault({
  // "images" is an optional object that returns a list of urls (images) with handlers.
  // The images will be loaded in parallel to calling "init". The scene will start
  // after every image is loaded and init is done.
  // can be a function that returns a object or a fixed object
  images: {
    'handlerName': 'http://image......' // list of images that will be loaded
  }

  // "init" is an optional function or async function and can return a promise.
  // It will be run when the engine sets this scene. The scene will start
  // after every image is loaded and init is done.
  // - engine is the engine object this scene is running in
  // - output is a object with canvas information
  //   output = {
  //     canvas: [],    // the canvas objects
  //     context: [],   // the context2d of the canvases
  //     width: 0,      // the width of the canvas
  //     height: 0,     // the height of the canvas
  //     ratio: 1       // the ratio between width and height
  //   }
  // - scene is the scene object this object is running in
  // - parameter are the parameter that are given from the
  //   last scene or the start parameter. The setup is always {
  //     run: ..., // the parameter given with the run command of the engine
  //     scene: ..., // the parameter given with the scene switch
  //     destroy: ..., // the parameter given from the last scene as return from the destroy function
  //   }
  // - imageManager is the object that loads the images
  async init({ engine, output, scene, parameter, imageManager }) {
    // optional: wait till all images are loaded
    // await imageManager.isLoadedPromise()

    // set events or do precalculation...
    // ...
  }

  // "destroy" is an optional function.
  // It will run when the engine's destroy is called or
  // when the engine switches a scene.
  async destroy({ engine, scene, output }) {
    // clean up code

    // return parameter for the next scene
    return {};
  }

  // "loading" is an optional function that replaces the loading animation
  // can be empty to disable any loading animation. F.e. loading() {}
  loading({ engine, scene, output, timePassed, totalTimePassed, progress, imageManager }) {
    // replace the loading screen
    const ctx = output.context[0];
    const loadedHeight =
      typeof progress === "number"
        ? Math.max(1, progress * output.height)
        : output.height;
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, output.width, output.height);
    ctx.fillStyle = "#aaa";
    ctx.fillRect(
      0,
      output.height / 2 - loadedHeight / 2,
      output.width,
      loadedHeight
    );
    ctx.font = "20px Georgia";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    
    ctx.fillText(
      isNaN(parseFloat(progress))
        ? progress
        : "Loading " + Math.round(100 * progress) + "%",
      10 + Math.random() * 3,
      output.height - 10 + Math.random() * 3
    );
  },

  // "endTime" can set the operational time of the animation in ms.
  // If the scene is running for "endTime" ms the scene
  // will call the function "end".
  // By default the value is undefined and thus "end" will never be triggered.
  endTime: 1000,

  // The function "end" will be triggered if the animation is running
  // for "endTime" ms.
  end({ engine, scene, output, timePassed, totalTimePassed, imageManager }) {
    // f.e. switch scene at the end of a cutscene
  }

  // Timing is completely optional and describes how the time is updated and
  // how often "fixedUpdate" is called
  timing: new DefaultTiming({
    // "tickChunk" will set the interval in ms that will call "fixedUpdate".
    // Default value is 16.66666667.
    // can be a function or a fixed value
    tickChunk: 1000/60,

    // "tickChunk" will set the number of frames
    // that can be skipped while rendering
    // can be a function (evaluated once) or a fixed value
    maxSkippedTickChunk: 3,

    // "tickChunkTolerance" will set the time in ms that will be ignored
    // if a frame misses the target tickChunk-time. Default value is 0.1
    // can be a function (evaluated once) or a fixed value
    tickChunkTolerance: 0.1,
  }),

  // "isDrawFrame" is a optional function that will determine if a scene should be drawn
  // If this function returns true it will still call "update" and "fixedUpdate" but
  // it will not draw the sprites
  // You can also return a frame count. F.e. return 2 will render the next 2 frames.
  // You can return an array too, to give seperate values to different canvas.
  // - engine is the engine object this scene is running in
  // - scene is the scene object this object is running in
  // - layerManager is the object that manages all objects that are in the scene
  // - output is a object with canvas information
  //   output = {
  //     canvas: null,  // the canvas object
  //     context: null, // the context2d of the canvas
  //     width: 0,      // the width of the canvas
  //     height: 0,     // the height of the canvas
  //     ratio: 1       // the ratio between width and height
  //   }
  // - timePassed is the time in ms that has passed since the last frame
  // - totalTimePassed is the time in ms that has passed since the start of the
  //   animation
  // - imageManager is the object that loads the images
  isDrawFrame({ engine, scene, layerManager, output, timePassed, totalTimePassed, imageManager }) {
    // calculation for the draw logic. f.e.
    // return totalTimePassed<=10000 || scene.hasCamChanged();
  }

  // "fixedUpdate" is a optional function that will be
  // called in fixed periodic intervals that is set in "tickChunk"
  // - engine is the engine object this scene is running in
  // - scene is the scene object this object is running in
  // - layerManager is the object that manages all objects that are in the scene
  // - output is a object with canvas information
  //   output = {
  //     canvas: null,  // the canvas object
  //     context: null, // the context2d of the canvas
  //     width: 0,      // the width of the canvas
  //     height: 0,     // the height of the canvas
  //     ratio: 1       // the ratio between width and height
  //   }
  // - timePassed is the time in ms that has passed since the last frame
  // - totalTimePassed is the time in ms that has passed since the start of the
  //   animation
  // - imageManager is the object that loads the images
  fixedUpdate({ engine, scene, layerManager, output, timePassed, totalTimePassed, imageManager }) {
    // do collision
    // logic or handle events f.e.
    // if (keydown) layerManager.getById(0).addElements(this.createExplosion());
  }

  // "update" is a optional function that will be called once per frame
  // how often this function is called depends on the frame rate
  // - engine is the engine object this scene is running in
  // - scene is the scene object this object is running in
  // - layerManager is the object that manages all objects that are in the scene
  // - output is a object with canvas information
  //   output = {
  //     canvas: null,  // the canvas object
  //     context: null, // the context2d of the canvas
  //     width: 0,      // the width of the canvas
  //     height: 0,     // the height of the canvas
  //     ratio: 1       // the ratio between width and height
  //   }
  // - timePassed is the time in ms that has passed since the last frame
  // - totalTimePassed is the time in ms that has passed since the start of the
  //   animation
  // - imageManager is the object that loads the images
  update({ engine, scene, layerManager, output, timePassed, totalTimePassed, imageManager }) {
    // set text of a object - f.e. the score
    // layerManager.getById(0).getById(0).text = this.score;

    // to draw something on the canvas every frame it's better to use
    // a callback/function in a layer of the layerManager
  }

  // "reset" sets the layers of the scene
  // will be called after the initialization and if there is a seek backwards
  reset({ engine, scene, layerManager, output, imageManager }) {
    // - you can directly work with the layerManager
    // layerManager.clear();
    // layerManager.addLayer().addElements([ SPRITES ]);
    // return layerManager;

    // - or you can return a 2d-array that will be converted to layers
    // return [
    //  [ SPRITES IN LAYER 0 ],
    //  [ SPRITES IN LAYER 1 ]
    // ]
  }
});

engine.switchScene(objectScene).run();
```

#### Layers

A scenes main task is to use the given _layerManager_ to first move the objects of the [Layers](#layers) and to draw them.

```js
import Engine from 'animationvideo/Engine.mjs';
import SceneDefault from 'animationvideo/Scenes/Default.mjs';
import Rect from 'animationvideo/Sprites/Rect.mjs';

new Engine({
  canvas: document.querySelector('canvas'),
  scene: new SceneDefault({
    // get the first layerManager at reset
    reset({layerManager}) {

      // --- layerManager functions ---
      // clear all elements
      layerManager.clear();

      // add a layer and save the layer in this object
      this.layerBackground = layerManager.addLayer();

      // add a number of layers
      [this.layerScroll1, this layerScroll2] = layerManager.addLayers(2);

      // add a layer and save the id
      this.layerMainId = layerManager.addLayerId();

      // add more then one layer at the same time and save ids
      // returns an array
      this.layerForgroundIds = layerManager.addLayerIds(3);

      // get a layer by a id
      this.layerMain = layerManager.getById(this.layerMainId);

      // loop through the objects of the layers
      layerManager.forEach(({ element, isFunction, layer, index }) => {
        // element is the current object
        // isFunction is true if element is a function
        // layer is the current layer
        // index is the id/position in the layer
      });

      // give number of layers
      console.log(layerManager.count());


      // --- layer function ---
      // add a sprite to the layer and save it
      this.spriteMainRect = this.layerMain.addElement(new Rect());
      // it can be a function
      this.spriteMainFunction = this.layerMain.addElement(
        function ({ engine, scene, layerManager, layer, output, totalTimePassed }) {
          output.context.drawImage(...)
          // return true will remove this function from the layer
          return totalTimePassed > 1000
        }
      );

      // add a sprite to the layer and return only the id
      const elementId = this.addElementForId(new Rect());


      // add an array of sprites
      [this.spriteMainRect2, this.spriteMainRect3] = this.layerMain.addElements([
        new Rect({...}),
        new Rect({...})
      ]);

      // add array of sprite to the layer and return only the ids
      const elementIds = this.layerMain.addElementsForIds([new Rect(),....]);


      // remove a element of this layer
      this.layerMain.deleteByElement(this.spriteMainRect3);

      // remove a element of this layer by the id of the element
      this.layerMain.deleteById(elementId);


      // loop through the objects of a layer
      this.layerMain.forEach(({ element, isFunction, layer, index }) => {
        // element is the current object
        // isFunction is true if element is a function
        // layer is the current layer
        // index is the id/position in the layer

        // f.e. call all reset methods of the element of the layer
        !isFunction && element.reset && element.reset()
      });

      // get a object by the id from a layer
      this.spriteFirst = this.layerMain.getById(0)

      // get a id by the elment of a layer
      this.spriteFirstID = this.layerMain.getByElement(this.spriteFirst)

      // output the number of elements in the layer
      console.log(this.layerMain.count());

      // empty the layer
      this.layerBackground.clear()

      return layerManager;
    }
  })
}).run()
```

### Norm

This scene is similar to the [Default](#default)-scene. But the coordinates are different: the middle of the canvas will be at 0, 0, left and bottom of the canvas at -1, -1 and the top right is at 1, 1. In addition the Norm has a function named `transformPoint(x,y)` that will transform normal x, y coordinates of the canvas (f.e. mouse position) into Norm-coordinates.

```js
import Animationvideo from "lib/animationvideo";

const {
    Engine,
    Scenes: {Norm},
    Animations: {Forever, ChangeTo},
    Sprites: {Circle, FastBlur},
    Easing: {CubicInOut}
} = Animationvideo;

// The Engine runs the scene "Norm"
new Engine({
    // enable autoSize
    autoSize: true,
    // set canvas
    canvas: document.querySelector("canvas"),
    // The Engine uses the scene "Norm"
    scene: new Norm(
        class myExample {
            // mouse event that we will bind
            eventMouseMove(e) {
                // use transforPoint to transform mouse coordinates to internal Norm-ccordinates
                [this.mx, this.my] = this.scene.transformPoint(e.offsetX, e.offsetY);
            }

            init({engine, output, scene}) {
                // set values we need for position tracking
                this.mx = 1;
                this.my = 0.5;
                this.scene = scene;

                // add mouse move event
                output.canvas.addEventListener(
                    "mousemove",
                    this.eventMouseMove.bind(this)
                );
            }

            destroy({output}) {
                // don't forget to clean up
                output.canvas.removeEventListener("mousemove", this.eventMouseMove);
            }

            reset({layerManager}) {
                // background will be a feedback effect
                layerManager.addLayer().addElement(
                    new FastBlur({
                        alpha: 0.9,
                        scaleX: 10,
                        scaleY: 10,
                        darker: 0.3,
                        clear: true,
                        pixel: true
                    })
                );

                // above is a circle that will move to the mouse every 500ms
                this.layerMove = layerManager.addLayer();
                layerManager.addLayer().addElements([
                    new Circle({
                        x: this.mx,
                        y: this.my,
                        scaleX: 0.1,
                        scaleY: 0.1,
                        color: "#F00",
                        animation: new Forever([
                            new ChangeTo(
                                {
                                    x: () => this.mx,
                                    y: () => this.my
                                },
                                500,
                                CubicInOut
                            )
                        ])
                    })
                ]);
                return layerManager;
            }
        }
    )
}).run(); // start the engine
```

[Test code at codesandbox.io](https://codesandbox.io/s/infallible-wildflower-w3uo7)

### NormCamera

This is a [Norm](#norm)-Scene that has controls for zooming and moving the content of the canvas with a _camera_. There is support for mobile.

```js
import "./styles.css";
import Animationvideo from "lib/animationvideo";

const {
    Engine,
    Scenes: {NormCamera},
    Animations: {Remove, ChangeTo},
    Sprites: {Image, Rect},
    Easing: {QuadOut}
} = Animationvideo;

// The Engine runs the scene "NormCamera"
new Engine({
    autoSize: true,
    canvas: document.querySelector("canvas"),
    // The Engine uses the scene "NormCamera"
    scene: new NormCamera({
        cam: {
            // use alternative camera controls
            // -> you will move the camera with second mouse button/two finger touch
            alternative: true,
            zoomMax: 10, // max zoom factor
            zoomMin: 0.5, // min zoom factor
            zoomFactor: 1.2, // scoll factor of the mouse wheel
            tween: 4, // how fast to interpolate the new position - higher = slower
            registerEvents: true, // let NormCamera be the mouse
            preventDefault: true, // block all other events that are bound
            enabled: true, // enable camera movement - with this you can lock the camera
            callResize: true, // call the resize events of the sprites
            doubleClickDetectInterval: 350 // how long to wait (ms) for double click detection
        },
        // click event
        // x, y is in Norm-space
        click({event, scene, x, y, imageManager}) {
            scene.zoomTo(x - 0.2, y - 0.2, x + 0.2, y + 0.2);
        },
        // double click event
        // x, y is in Norm-space
        doubleClick({event, scene, x, y, imageManager}) {
            scene.zoomTo(-1, -1, 1, 1);
        },
        // event while marking a region - only with alternative camera controls
        // x1,y1 will be the upper left corner, x2,y2 the bottom right corner in Norm Space
        // fromX, fromY is the start position of the region
        // toX, toY is the current position of the region
        regionMove({event, scene, x1, y1, x2, y2, fromX, fromY, toX, toY, imageManager}) {
            this.spriteMarker.enabled = true;
            this.spriteMarker.x = x1;
            this.spriteMarker.y = y1;
            this.spriteMarker.width = x2 - x1;
            this.spriteMarker.height = y2 - y1;
        },
        // event after marking a region - only with alternative camera controls
        // x1,y1 will be the upper left corner, x2,y2 the bottom right corner in Norm Space
        // fromX, fromY is the start position of the region
        // toX, toY is the current position of the region
        region({event, scene, x1, y1, x2, y2, fromX, fromY, toX, toY, imageManager}) {
            this.spriteMarker.enabled = false;
            this.layerOverlay.addElement(
                new Rect({
                    x: x1,
                    y: y1,
                    width: x2 - x1,
                    height: y2 - y1,
                    color: "#fff",
                    compositeOperation: "lighter",
                    animation: [new ChangeTo({alpha: 0}, 3000, QuadOut), new Remove()]
                })
            );
        },
        // event when moving the mouse/finger over the canvas
        mouseMove({event, scene, x, y, imageManager}) {
        },
        // event when start clicking the mouse/touching the finger over the canvas
        mouseDown({event, scene, x, y, imageManager}) {
        },
        // event when end clicking the mouse/touching the finger over the canvas
        mouseUp({event, scene, x, y, imageManager}) {
        },
        // event when moving the mouse out of the canvas
        mouseOut({event, scene, imageManager}) {
        },

        images() {
            return {imageFile: "https://placekitten.com/400/400"};
        },
        reset({layerManager}) {
            layerManager.addLayer().addElement(new Rect({clear: true}));
            layerManager.addLayer().addElement(
                new Image({
                    normCover: true,
                    image: "imageFile"
                })
            );
            this.layerOverlay = layerManager.addLayer();
            this.spriteMarker = this.layerOverlay.addElement(
                new Rect({
                    enabled: false,
                    color: "#fff",
                    norm: false,
                    compositeOperation: "difference"
                })
            );
            return layerManager;
        }
    })
}).run(); // start the engine
```

[Test code at codesandbox.io](https://codesandbox.io/s/funny-williams-fhgx6)

### Timing

Every scene is given a timing, that describes, how time is measured and how often the fixed update function is called. The default timing will measure the time with `performance.now()` and call the fixed update 60 times in a second.

#### Audio

After setting a "**audioElement**" the time for the animation is given by this audio-element. "**end**" of the scene will be automatically called without giving "**endTime**".

```js
import Animationvideo from "lib/animationvideo";

const {
    Engine,
    Scenes: {Default: SceneDefault},
    Timing: {Audio: TimingAudio},
    Animations: {ChangeTo, Wait, Remove},
    Sprites: {Rect, Path, StarField, FastBlur},
    Easing: {QuadInOut, ElasticOut, BounceOut, QuadOut}
} = Animationvideo;

new Engine({
    // clicking on the canvas will start the audio
    clickToPlayAudio: true,
    // the canvas for the animation
    canvas: document.querySelector("canvas"),
    // The Engine uses the scene "Audio"
    scene: new SceneDefault({
        // audio element that plays the music
        timing: new TimingAudio({
            audioElement: document.getElementById('audio')
        }),
        // function that runs when the audio ends
        end() {
            window.alert("audio done");
        },
        // show totalTimePassed
        update({totalTimePassed}) {
            const tickElement = document.getElementById("tick");
            if (tickElement) {
                tickElement.innerText = Math.round(totalTimePassed);
            }
        },
        // initialisation of the scene with sprites
        reset() {
            return [
                // first layer is the background
                [
                    new Rect({
                        color: "#117",
                        animation: [
                            500,
                            new ChangeTo({color: "#88C"}, 1000),
                            new Wait(14500),
                            new ChangeTo({color: "#C88"}, 300),
                            new ChangeTo({color: "#FCC"}, 3000)
                        ]
                    })
                ],
                // effect rects
                [
                    new Rect({
                        color: "#66b",
                        width: 100,
                        x: -100,
                        animation: [
                            500,
                            new ChangeTo({x: 100}, 1000, ElasticOut),
                            new Wait(14500),
                            new ChangeTo({alpha: 0}, 300),
                            new Remove()
                        ]
                    }),
                    new Rect({
                        color: "#66b",
                        width: 100,
                        x: 800,
                        animation: [
                            500,
                            new ChangeTo({x: 600}, 1000, ElasticOut),
                            new Wait(14500),
                            new ChangeTo({alpha: 0}, 300),
                            new Remove()
                        ]
                    }),
                    new Rect({
                        color: "#449",
                        width: 100,
                        x: -100,
                        animation: [
                            500,
                            new ChangeTo({x: 200}, 1000, ElasticOut),
                            new Wait(14500),
                            new ChangeTo({alpha: 0}, 300),
                            new Remove()
                        ]
                    }),
                    new Rect({
                        color: "#449",
                        width: 100,
                        x: 800,
                        animation: [
                            500,
                            new ChangeTo({x: 500}, 1000, ElasticOut),
                            new Wait(14500),
                            new ChangeTo({alpha: 0}, 300),
                            new Remove()
                        ]
                    }),
                    new Rect({
                        color: "#227",
                        width: 100,
                        x: -100,
                        animation: [
                            500,
                            new ChangeTo({x: 300}, 1000, ElasticOut),
                            new Wait(14500),
                            new ChangeTo({alpha: 0}, 300),
                            new Remove()
                        ]
                    }),
                    new Rect({
                        color: "#227",
                        width: 100,
                        x: 800,
                        animation: [
                            500,
                            new ChangeTo({x: 400}, 1000, ElasticOut),
                            new Wait(14500),
                            new ChangeTo({alpha: 0}, 300),
                            new Remove()
                        ]
                    })
                ],
                // logo that morphs
                [
                    new Path({
                        path:
                            "M123.3 5.5c-5.7 1.3-10.9 4.8-14.6 9.8-9 12.1-4.8 31 8.6 37.8L121 55v47.7l-4 3.2c-3.7 3-5.3 3.4-19.9 5.7l-15.9 2.5-3.6-2.5c-8.3-5.6-24.3-6.2-31.6-1.1-2.8 1.9-4.3 3.9-5 6.5l-1 3.7-9.7 1.6c-12 2-16.5 4.8-20.5 12.7-3.5 6.9-4.8 13.8-4.8 25.4 0 10 2.3 16.9 7.2 21.3 2.2 2.1 68.6 37.5 80.3 42.9l5 2.3 36-2.9c19.8-1.6 39.2-3.1 43-3.4 40.2-3.1 37.7-2.8 42.2-6.2 5.5-4.2 7.5-12.4 6.3-25.1-1-9.5-2.5-12.8-20.3-43.8-20.4-35.6-22.3-38.4-29.1-41.9-3.3-1.7-6.9-3.9-8-5-5.8-5.1-13.9-7.1-23.7-5.8l-5.6.8-.6-14c-1.2-25.1-1.3-24.2 3.2-26.5 14.2-7.3 17.6-27.4 6.8-39.7-2.2-2.5-5.1-5.1-6.6-5.8-4.7-2.5-12.2-3.3-17.8-2.1z",
                        color: "#000",
                        borderColor: "#FFF",
                        lineWidth: 3,
                        x: 270,
                        y: 30,
                        alpha: 0,
                        scaleY: 0.7,
                        rotationInDegree: -5,
                        animation: [
                            // wait 2000 ms
                            2000,
                            // intro
                            new ChangeTo(
                                {
                                    rotationInDegree: 0,
                                    scaleY: 1,
                                    alpha: 1
                                },
                                1500,
                                BounceOut
                            ),
                            new Wait(500),
                            new ChangeTo(
                                {
                                    x: 260,
                                    y: 20,
                                    scaleX: 1.1,
                                    scaleY: 1.1
                                },
                                4000,
                                QuadInOut
                            ),
                            new Wait(1000),
                            // morph
                            new ChangeTo(
                                {
                                    path:
                                        "M384,48.734c-70.692,0-128,57.308-128,128c0-70.692-57.308-128-128-128s-128,57.308-128,128c0,137.424,188.048,252.681,241.805,282.821c8.823,4.947,19.567,4.947,28.39,0C323.952,429.416,512,314.158,512,176.734C512,106.042,454.692,48.734,384,48.734z",
                                    scaleX: 0.5,
                                    scaleY: 0.5
                                },
                                1000,
                                BounceOut
                            ),
                            new Wait(6000),
                            new ChangeTo(
                                {
                                    x: 215,
                                    y: -25,
                                    scaleX: 0.7,
                                    scaleY: 0.7
                                },
                                6500,
                                QuadInOut
                            )
                        ]
                    })
                ],
                // effect stars
                [
                    new StarField({
                        moveX: 0,
                        animation: [
                            4000,
                            new ChangeTo({moveY: -4}, 1000, QuadInOut),
                            new Wait(2000),
                            new ChangeTo({moveY: 0}, 200, QuadOut),
                            new Wait(3300),
                            new ChangeTo(
                                {
                                    moveX: 4,
                                    moveY: -2
                                },
                                1000,
                                QuadInOut
                            ),
                            new Wait(3000),
                            new ChangeTo(
                                {
                                    moveX: 0,
                                    moveY: 0
                                },
                                200,
                                QuadOut
                            ),
                            new Remove()
                        ]
                    })
                ],
                // last layer consits of a blur effect
                [
                    new FastBlur({
                        compositeOperation: "lighter", // make a glow
                        gridSize: 10, // the glow has the size of 10 times 10
                        // pixel: true,
                        darker: 0.5, // turn down the glow
                        alpha: 0, // not visible
                        animation: [
                            // wait 2000 ms
                            2000,
                            // blend in the half visible glow
                            new ChangeTo({alpha: 0.4}, 1500, QuadInOut)
                        ]
                    })
                ]
            ];
        }
    })
}).run(); // start the engine
```

[Test code at codesandbox.io](https://codesandbox.io/s/eloquent-field-55tk6)

## Sprites

**Sprites** are the objects that are drawn on the screen. They are the main ingredient of an animation.

### Image

Renders an image to the canvas. Can be a real image or the reference to an image loaded with the _images_ routine of the scene. You can tint an image (give it a color), but this will create a new canvas in the background and can be slow. 

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import Image from "animationvideo/Sprites/Image.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    // load images beforehand
    images() {
      return { imageFile: "https://placekitten.com/400/400" };
    },
    // initialisation of the scene with sprites
    reset() {
      return [
        [
          new Image({
            enabled: true,
            image: "imageFile", // name of the key of the image defined in "images"
            x: 0, // position of the image
            y: 0,
            width: undefined, // width and height of the image. Undefined to take
            height: undefined, // it from the original image.
            rotation: 0, // use rotationInDegree to give values in degree
            scaleX: 1, // scalling of the image
            scaleY: 1,
            alpha: 1, // transparency
            compositeOperation: "source-over",
            position: Image.CENTER, // or Image.LEFT_TOP - pivot of the image
            frameX: 0, // left corner of the sprite that will be cut out from an image
            frameY: 0, // top corner of the sprite that will be cut out from an image
            frameWidth: 0, // width of the sprite that will be cut out from an image
            frameHeight: 0, // height of the sprite that will be cut out from an image
            norm: false, // resize the image, so it hits the corner of the canvas
            normCover: false, // resize the image, so it's completly covering the canvas
            normToScreen: false, // it will be norm-ed to the visible, zoomed out screen, not to the full -1 to 1 canvas
            animation: undefined,
            tint: 0, // tint the image with the color "color". A value between 0 (no tint) and 1 (image is completly in this color)
            color: '#fff' // color for the tint
          })
        ]
      ];
    }
  })
}).run();
```

You can also use Sprite Sheets. You can cut out a single Sprite with _frameX_, _frameY_, _frameWidth_, _frameHeight_. See the [ImageFrame](#imageframe)-Animation for an example.

### Rect

Renders a rectangle in a color. Can be used in a short form to clear the screen.

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import Rect from "animationvideo/Sprites/Rect.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new Rect({
            enabled: true,
            x: undefined, // Position - default upper left corner
            y: undefined,
            width: undefined, // Size - default full screen
            height: undefined,
            rotation: 0, // rotation in radian. Use rotationInDegree to give values in degree
            alpha: 1, // transparency
            compositeOperation: "source-over",
            color: "#fff", // color of the rect
            borderColor: undefined, // optional border color - undefined to disable the border
            lineWidth: 1, // size of the border
            clear: false, // clear the rect instead of filling with color
            // resize the rect, so it hits the corner of the canvas
            // default is true if x, y, width and height is undefined
            norm: false,
            animation: undefined
          })
        ],
        [
          new Rect({ clear: true }) // <- short form to clear the full canvas
        ]
      ];
    }
  })
}).run();
```

### Circle

Renders a circle in a color.

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import Circle from "animationvideo/Sprites/Circle.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new Circle({
            enabled: true,
            x: 0, // Position
            y: 0,
            scaleX: 1, // scalling of the circle
            scaleY: 1,
            rotation: 0, // rotation in radian. Use rotationInDegree to give values in degree
            alpha: 1, // transparency
            compositeOperation: "source-over",
            color: "#fff", // color of the rect
            animation: undefined
          })
        ]
      ];
    }
  })
}).run();
```

### Path

Renders a ["Path"](https://developer.mozilla.org/en-US/docs/Web/API/Path2D/Path2D). With this you can render vector graphics. A special effect is the clipping. This will allow you to render stuff only inside the path.

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import Path from "animationvideo/Sprites/Path.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new Path({
            enabled: true,
            x: 0, // Position
            y: 0,
            scaleX: 1, // scalling of the path
            scaleY: 1,
            rotation: 0, // rotation in radian. Use rotationInDegree to give values in degree
            alpha: 1, // transparency
            compositeOperation: "source-over",
            path: "...", // the svg path or a Path2D-Object
            color: undefined, // color to fill the path
            borderColor: undefined, // color of the border of the path
            lineWidth: 1, // line width of the border
            clip: false, // true will render "sprite" inside the path
            sprite: [], // the sprites that will be rendered inside the path if clip is true
            fixed: false, // the position, rotation and scalling will be the same as the path itself
            animation: undefined, // in the animation you can even morph the path with ChangeTo!
            polyfill: true // "true" will inject a workaround for edge and older browsers if needed
          })
        ]
      ];
    }
  })
}).run();
```

### Text

Renders text at the canvas.

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import Text from "animationvideo/Sprites/Text.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new Text({
            enabled: true,
            x: 0, // Position
            y: 0,
            scaleX: 1, // scalling of the text
            scaleY: 1,
            rotation: 0, // rotation in radian. Use rotationInDegree to give values in degree
            alpha: 1, // transparency
            compositeOperation: "source-over",
            text: undefined, // Text to show
            font: "26px monospace", // font to use
            position: Text.CENTER, // or Text.LEFT_TOP - pivot of the text
            color: undefined, // fill-color of the text
            borderColor: undefined, // border color of the text
            lineWidth: 1, // border size
            animation: undefined
          })
        ]
      ];
    }
  })
}).run();
```

### Callback

Callback that will be called to manually render something on the canvas.

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import SpriteCallback from "animationvideo/Sprites/Callback.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new SpriteCallback({
            enabled: true,
            // set the callback
            callback: function(context, timePassed, additionalParameter, sprite) {
              // in this function you can do whatever you want
              context.drawImage(..);
              ....
            };
            animation: undefined
          })
        ]
      ];
    }
  })
}).run();
```

### FastBlur

Creates a new Canvas and copies the screen on top of it. Because the new canvas is much smaller than the current one, the image will be blurred. You can use it to apply _glow_-effect or to copy the current screen to a part of the screen.

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import SpriteFastBlur from "animationvideo/Sprites/FastBlur.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new SpriteFastBlur({
            enabled: true,
            x: undefined, // Position - default upper left corner
            y: undefined,
            width: undefined,
            height: undefined,
            norm: false, // is true by default if x, y, width and height are undefined. Set the size of the canvas to the original canvas size
            scaleX: 1, // the scalled internal size of the canvas. F.e. if scaleX and scaleY is 2 then the the internal
            scaleY: 1, // canvas has half of the size of the original canvas
            gridSize: undefined, // if defined overrides scaleX and scaleY. The internal width and height of the canvas. Usefull for Norm-Scenes
            alpha: 1, // transparency
            compositeOperation: "source-over", // "lighter" will give you a glow effect
            darker: 0, // makes the picture darker by rendering a black color with alpha over the canvas. Useful for "lighter"
            pixel: false, // will make the image look pixelated. This can be used to create a "censored" effect
            clear: false, // clear the screen before rendering back to the screen from the canvas
            animation: undefined // the animation
          })
        ]
      ];
    }
  })
}).run();
```

### StarField

Renders moving "stars".

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import Rect from "animationvideo/Sprites/Rect.mjs";
import StarField from "animationvideo/Sprites/StarField.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new Rect({color: '#000'})
        ],
        [
          new StarField({
            enabled: true,
            x: undefined, // Position - default upper left corner
            y: undefined,
            width: undefined, // Size - default full screen
            height: undefined,
            // resize, so it hits the corner of the canvas
            // default is true if x, y, width and height is undefined
            norm: false,
            alpha: 1, // transparency
            compositeOperation: "source-over",
            color: "#fff", // color of the rect
            count: 40, // how many stars
            // where the stars moves to - you don't see anything if everything is zero
            moveX: 0.,
            moveY: 0.,
            moveZ: 0.,
            lineWidth: undefined, // size of the stars
            highScale: true // false is faster, but true is needed for "Norm"-scenes
            animation: undefined, // the animation
          })
        ]
      ];
    }
  })
}).run();
```

### Group

Renders a Group of Sprites. This is used to move them together or to apply effects at the same time.

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import Group from "animationvideo/Sprites/Group.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new Group({
            // the sprites that will be rendered inside
            // f.e. [ new Rect({...}), new Image({...})]
            sprite: [],
            enabled: true,
            x: 0, // Position - default upper left corner
            y: 0,
            scaleX: 1, // scalling of the path
            scaleY: 1,
            rotation: 0, // rotation in radian. Use rotationInDegree to give values in degree
            alpha: 1, // transparency
            compositeOperation: "source-over",
            animation: undefined // the animation
          })
        ]
      ];
    }
  })
}).run();
```

### Canvas

Creates a new Canvas and renders sprites on top of it. For pre-rendering and feedback effects.

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import SpriteCanvas from "animationvideo/Sprites/Canvas.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new SpriteCanvas({
            // the sprites that will be rendered inside
            // f.e. [ new Rect({...}), new Image({...})]
            sprite: [],
            enabled: true,
            x: undefined, // Position - default upper left corner
            y: undefined,
            width: undefined,
            height: undefined,
            canvasWidth: undefined, // internal size of the canvas - can not be changed afterwards
            canvasHeight: undefined, // internal size of the canvas - can not be changed afterwards
            isDrawFrame: true, // true - draw all sprites always, false - draw only once, function is allowed too and called by frame
            norm: false, // is true by default if x, y, width and height are undefined. Set the size of the canvas to the original canvas size
            scaleX: 1, // the scalled internal size of the canvas. F.e. if scaleX and scaleY is 2 then the the internal
            scaleY: 1, // canvas has half of the size of the original canvas
            gridSize: undefined, // if defined overrides scaleX and scaleY. The internal width and height of the canvas.
            rotation: 0, // rotation in radian. Use rotationInDegree to give values in degree
            alpha: 1, // transparency
            compositeOperation: "source-over",
            animation: undefined // the animation
          })
        ]
      ];
    }
  })
}).run();
```

### Particle

Renders a transparent colored circle on the screen. Used for particle effects.

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import SpriteParticle from "animationvideo/Sprites/Particle.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new SpriteParticle({
            enabled: true,
            x: 0, // Position
            y: 0,
            scaleX: 1, // scalling/size of the particle
            scaleY: 1,
            alpha: 1, // transparency
            compositeOperation: "source-over", // render effect. Use "lighter" to get a glow.
            color: "#fff", // color of the particle
            animation: undefined
          })
        ]
      ];
    }
  })
}).run();
```

### Emitter

Renders a number of objects at once. All parameters can be modified with a function, so you can create powerful particle effects with one (complex) call.

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import SpriteEmitter from "animationvideo/Sprites/Emitter.mjs";
import SpriteParticle from "animationvideo/Sprites/Particle.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new SpriteEmitter({
            self: {
              // parameter like in group that will be assigned to the emitter itself
            },
            class: SpriteParticle, // default is undefined. The sprite that should be genereated
            count: 1, // number of sprites to generate
            ...
            // each parameter will be part of the generated child
            // if the parameter is a function the index will be given
            // f.e.
            // color: (i)=>`RGBA($(i),255,255,1)`
            // compositeOperation: (i) => i % 2 ? "source-over" : "lighter"
            // animation: (i) => [
            // i * 10,
            // new ChangeTo...
            // ]
          })
        ]
      ];
    }
  })
}).run();
```

### Scroller

Scroller is a [Emitter](#emitter) for [Text](#text). It will cut a full text in it's letters and each letter will be a [Text sprite](#text). A space will be created too but it will be disabled (enabled: false) by default.

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import SpriteScroller from "animationvideo/Sprites/Scroller.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new SpriteScroller({
            self: {
              // parameter like in group that will be assigned to the scroller itself
            },
            text: "...", // the text that should be rendered
            ...
            // each other parameter will be part of the generated child
            // if the parameter is a function the index will be given
            // f.e.
            // color: (i)=>`RGBA($(i),255,255,1)`
            // compositeOperation: (i) => i % 2 ? "source-over" : "lighter"
            // animation: (i) => [
            // i * 10,
            // new ChangeTo...
            // ]
          })
        ]
      ];
    }
  })
}).run();
```

### StackBlur

A better but slower blur than [FastBlur](#fastblur) by [Mario Klingemann](http://incubator.quasimondo.com/processing/fast_blur_deluxe.php). Creates a new Canvas and copies the screen on top of it. Because the new canvas is much smaller than the current one, the image will be blurred. You can use it to apply _glow_-effect or to copy the current screen to a part of the screen.

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import SpriteStackBlur from "animationvideo/Sprites/StackBlur.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new SpriteStackBlur({
            // settings from FastBlur
            enabled: true,
            x: undefined, // Position - default upper left corner
            y: undefined,
            width: undefined,
            height: undefined,
            norm: false, // is true by default if x, y, width and height are undefined. Set the size of the canvas to the original canvas size
            scaleX: 1, // the scalled internal size of the canvas. F.e. if scaleX and scaleY is 2 then the the internal
            scaleY: 1, // canvas has half of the size of the original canvas
            gridSize: undefined, // if defined overrides scaleX and scaleY. The internal width and height of the canvas. Usefull for Norm-Scenes
            alpha: 1, // transparency
            compositeOperation: "source-over", // "lighter" will give you a glow effect
            darker: 0, // makes the picture darker by rendering a black color with alpha over the canvas. Useful for "lighter"
            pixel: false, // will make the image look pixelated. This can be used to create a "censored" effect
            clear: false, // clear the screen before rendering back to the screen from the canvas
            animation: undefined, // the animation
            // Special settings for Stackblur
            onCanvas: false, // will override all other settings and applies the blur directly on the underlying canvas. This is a big performence gain but you will lose some possible effects
            radius: undefined, // the radius of the blur. The more the blurier.
            radiusPart: undefined, // if radiusPart is set it will define radius as a part of the screen. Smaller values give more blur. radius = max(canvasWidth/canvasHeight) / radiusPart
            radiusScale: true // scale the radius with the zoom factor of the cam in NormCamera-Scene and the scene autoSize Factor
          })
        ]
      ];
    }
  })
}).run();
```

## Animations
All sprites have a configuration for animation. This animation will be played back and is very precise, so can be synced to an audio source.

### Sequence
Given an array of animation-commands, `Sequence` will play back the commands one after another. You can define more than one array and they will be played back in parallel. The sequence finish when every array is finished. They don't repeat.
```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import SpriteRect from "animationvideo/Sprites/StackBlurCanvas.mjs";
import Sequence from "animationvideo/Animations/Sequence.mjs";
import ChangeTo from "animationvideo/Animations/ChangeTo.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new SpriteRect({
            color: '#fff',
            animation: new Sequence([
              new ChangeTo({ color:'#f00' }, 1000),
              new ChangeTo({ color:'#00f' }, 1000)
            ])
          })
        ]
      ];
    }
  })
}).run();
```
#### Short form for Sequence
If you only have one array of animation-commands, you can give the array directly to the `animations`-attribute and don't have to create a new [Sequence-Object].(#sequence)
```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import SpriteRect from "animationvideo/Sprites/StackBlurCanvas.mjs";
import ChangeTo from "animationvideo/Animations/ChangeTo.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new SpriteRect({
            color: '#fff',
            animation: [
              new ChangeTo({ color:'#f00' }, 1000),
              new ChangeTo({ color:'#00f' }, 1000)
            ]
          })
        ]
      ];
    }
  })
}).run();
```
#### Short form for Wait
You can add a wait time by giving the Sequence a number as first parameter. This time can even be negative. A negative value will fast forward the animation to the point in time.

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import SpriteRect from "animationvideo/Sprites/StackBlurCanvas.mjs";
import ChangeTo from "animationvideo/Animations/ChangeTo.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new SpriteRect({
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            color: '#fff',
            animation: [
              2500,
              new ChangeTo({ color:'#f00' }, 10000),
              new ChangeTo({ color:'#00f' }, 10000)
            ]
          })
          new SpriteRect({
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            color: '#fff',
            animation: [
              -2500
              new ChangeTo({ color:'#f00' }, 10000),
              new ChangeTo({ color:'#00f' }, 10000)
            ]
          })
        ]
      ];
    }
  })
}).run();
```

#### Labels

#### Parallel sequences

### Loop
`Loop` works like [Sequence](#sequence) but repeats the commands a given amount of time.

```js
import Engine from "animationvideo/Engine.mjs";
import SceneDefault from "animationvideo/Scenes/Default.mjs";
import SpriteRect from "animationvideo/Sprites/StackBlurCanvas.mjs";
import Loop from "animationvideo/Animations/Loop.mjs";
import ChangeTo from "animationvideo/Animations/ChangeTo.mjs";

new Engine({
  canvas: document.querySelector("canvas"),
  scene: new SceneDefault({
    reset() {
      return [
        [
          new SpriteRect({
            color: '#fff',
            animation: new Loop(10, // repeat 10 times and then stop
              new ChangeTo({ color:'#f00' }, 1000),
              new ChangeTo({ color:'#00f' }, 1000)
            )
          })
        ]
      ];
    }
  })
}).run();
```
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

### EndDisabled

### Remove

### Stop

### StopDisabled

# TODO

- more readme
- more tests

# License

[MIT](https://github.com/Kauto/animationvideo/blob/master/LICENSE)
