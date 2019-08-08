# AnimationVideo

AnimationVideo is a javascript library to animate objects inside a canvas. The animation can be perfectly synced to music which can even be sought. Everything works without WebGl.

For now see the *index.html* for examples.

# Table of Contents

- [Installation](#installation)
- [General overview](#general-overview)
  - [How to import](#how-to-import)
  - [Example](#example)
  - [Engine](#engine)
    - [Constructor option autoSize](#constructor-option-autosize)
    - [Commands](#commands)
  - [Scenes](#scenes)
    - [Default](#default)
      - [Layers](#layers)
    - [Norm](#norm)
    - [Audio](#audio)
    - [NormAudio](#normaudio)
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
  - [Animations](#animations)
    - [Sequence](#sequence)
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
    - [EndDisable](#enddisable)
    - [Remove](#remove)
- [TODO](#todo)
- [License](#license)

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
The [Engine](#engine) of Animationvideo will run [Scenes](#scenes) that consists of [Sprites](#sprites) that can be manipulated with [Animations](#animations).

## How to import
The best way to import components of Animationvideo is the direct import of the modules.
```js
import Engine from 'animationvideo/Engine.mjs'
import Norm from 'animationvideo/Scenes/Norm.mjs'
import FastBlur from 'animationvideo/Sprites/FastBlur.mjs'
import Image from 'animationvideo/Sprites/Image.mjs'
import Forever from 'animationvideo/Animations/Forever.mjs'
import ChangeTo from 'animationvideo/Animations/ChangeTo.mjs'
import QuadInOut from 'eases/quad-in-out'
```
This is possible with [Webpack >= 4](https://webpack.js.org/). For older packer you can use the main package and extract the needed components.
```js
import Animationvideo from "animationvideo";
const {
  Engine,
  Scenes: { Norm },
  Animations: { Forever, ChangeTo },
  Sprites: { Image, FastBlur },
  Easing: { QuadInOut }
} = Animationvideo;
```
For simple web projects you can include the js-file directly
```html
<script src="dist/animationvideo.umd.js"></script>
```
This is done in the *index.html*.


## Example
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
            alphaMode: "lighter", // make a glow
            gridSize: 10, // the glow has the size of 10 times 10
            // pixel: true,
            darker: 0.5, // turn down the glow
            a: 0, // not visible
            animation: [
              // blend in the glow for half a second with easing
              new ChangeTo({ a: 1 }, 500, QuadInOut)
            ]
          })
        ]
      ];
    }
  })
}).run(); // start the engine
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
engine.run( /* optional: object with parameter that are given to the init-function */ );

// "destroy" clean up the events, stops the main loop
// that was started with "run"
engine.destroy();

```

## Scenes
A scene controls what happens on the screen and in the engine. It uses [Sprites](#sprites) and [Animations](#animations). 

### Default
Default descries a Animation without sound on a canvas with a fixed size. In this canvas the coordinates of the top left corner is 0, 0 and the coordinate in the bottom right is the width, height of the canvas in pixels. This is the basic scene. All other scenes are based on this and add something special (f.e. add audio or the coordinates are special).

A scenes main task is to use the given *layerManager* to first move the objects of the layers and then to draw them.

There are a number of functions that are given to the constructor that are explained in this example. The functions can be combined in a object or a class:
```js
import Engine from 'animationvideo/Engine.mjs'
import SceneDefault from 'animationvideo/Scenes/Default.mjs'

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
  //     canvas: null,  // the canvas object
  //     context: null, // the context2d of the canvas
  //     w: 0,          // the width of the canvas
  //     h: 0,          // the height of the canvas
  //     ratio: 1       // the ratio between width and height
  //   }
  // - scene is the scene object this object is running in
  // - parameter are the parameter that are given from the 
  //   last scene or the start parameter
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
  destroy({ engine, scene, output }) {
    // clean up code

    // return parameter for the next scene
    return {};
  }

  // "loading" is an optional function that replaces the loading animation
  // can be empty to disable any loading animation. F.e. loading() {}
  loading({ engine, scene, output, value }) {
    // replace the loading screen
    const ctx = output.context,
          loadedHeight = Math.max(1, progress * output.h);

    // clean the screen
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, output.w, output.h);

    ctx.fillStyle = "#aac";
    ctx.fillRect(0, output.h / 2 - loadedHeight / 2, output.w, loadedHeight);

    ctx.font = "20px Georgia";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    let text = progress;

    // isNumber
    if (!isNaN(parseFloat(progress)) && !isNaN(progress - 0)) {
      text = "Loading " + Math.round(100 * progress) + "%";
    }
    ctx.fillText(
      text,
      10 + Math.random() * 3,
      output.h - 10 + Math.random() * 3
    );

    engine && engine.normalizeContext(ctx);
  },

  // "endTime" can set the operational time of the animation in ms.
  // If the scene is running for "endTime" ms the scene 
  // will call the function "end".
  // By default the value is undefined and thus "end" will never be triggered.
  endTime: 1000,

  // The function "end" will be triggered if the animation is running
  // for "endTime" ms.
  end({ engine, scene, output }) {
    // f.e. switch scene at the end of a cutscene
  }

  // "tickChunk" will set the interval in ms that will call "fixedUpdate".
  // Default value is 16.66666667.
  // can be a function or a fixed value
  tickChunk: 1000/60,

  // "tickChunk" will set the number of frames
  // that can be skipped while rendering
  // can be a function or a fixed value
  maxSkippedTickChunk: 3,

  // "tickChunkTolerance" will set the time in ms that will be ignored
  // if a frame misses the target tickChunk-time. Default value is 0.1
  // can be a function or a fixed value
  tickChunkTolerance: 0.1,
  
  // "fixedUpdate" is a optional function that will be 
  // called in fixed periodic intervals that is set in "tickChunk"
  // - engine is the engine object this scene is running in
  // - scene is the scene object this object is running in
  // - layerManager is the object that manages all objects that are in the scene
  // - output is a object with canvas information
  //   output = {
  //     canvas: null,  // the canvas object
  //     context: null, // the context2d of the canvas
  //     w: 0,          // the width of the canvas
  //     h: 0,          // the height of the canvas
  //     ratio: 1       // the ratio between width and height
  //   }
  // - timepassed is the time in ms that has passed since the last frame
  fixedUpdate({ engine, scene, layerManager, output, timepassed }) {
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
  //     w: 0,          // the width of the canvas
  //     h: 0,          // the height of the canvas
  //     ratio: 1       // the ratio between width and height
  //   }
  // - timepassed is the time in ms that has passed since the last frame
  update({ engine, scene, layerManager, output, timepassed }) {
    // set text of a object - f.e. the score
    // layerManager.getById(0).getById(0).text = this.score;

    // to draw something on the canvas every frame it's better to use
    // a callback/function in a layer of the layerManager
  }

  // "reset" sets the layers of the scene
  // will be called after the initialization and if there is a seek backwards
  reset({ engine, scene, layerManager, output }) {
    // - you can directly work with the layerManager
    // layerManager.clear();
    // layerManager.addLayer().addElements([ SPRITES ]);
    // return layerManager;

    // - or you can return a 2d-array that will converted to layers
    // return [
    //  [ SPRITES IN LAYER 0 ],
    //  [ SPRITES IN LAYER 1 ]
    // ]
  }
});

engine.switchScene(objectScene).run();
```

#### Layers
A scenes main task is to use the given *layerManager* to first move the objects of the *layers* and then to draw them.

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
        function ({ engine, scene, layerManager, layer, output, timepassed }) {
          output.context.drawImage(...)
          // return true will remove this function from the layer
          return timepassed > 1000 
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