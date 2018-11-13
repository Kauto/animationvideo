import t from"color";import i from"pasition";import e from"eases";export{default as Easing}from"eases";var n=function(t,i,e){var n=this;if(this._output={canvas:null,context:null,w:0,h:0,ratio:1},this._scene=null,this._isSceneInitialized=!1,this._newScene=null,this._lastTimestamp=0,this._timePassed=0,this._referenceRequestAnimationFrame=null,this._output.canvas=t,"object"!=typeof t||null===t||!t.getContext)throw"No context";this._output.context=t.getContext("2d"),this._output.w=this._output.canvas.width,this._output.h=this._output.canvas.height,this._output.ratio=this._output.w/this._output.h,e&&(window.addEventListener("resize",this.maximizeCanvas,!1),window.addEventListener("orientationchange",this.maximizeCanvas,!1),this.resize(),t.addEventListener("click",function(){n._isSceneInitialized&&n._scene.audioElement&&n._scene.audioElement.play()},!1)),this.changeScene(i),this.normalizeContext(this._output.context)};n.prototype.normalizeContext=function(t){t.textBaseline="middle",t.textAlign="center",t.globalAlpha=1,t.globalCompositeOperation="source-over"},n.prototype.getWidth=function(){return this._output.w},n.prototype.getHeight=function(){return this._output.h},n.prototype.maximizeCanvas=function(){var t=self.output.canvas,i=window.innerWidth,e=window.innerHeight;i/e>self.output.ratio?(i=e*self.output.ratio,t.style.height=e+"px",t.style.width=i+"px"):(e=i/self.output.ratio,t.style.width=i+"px",t.style.height=e+"px"),t.style.marginTop=-e/2+"px",t.style.marginLeft=-i/2+"px",$(self.output.canvas).css({width:i,height:e}),$(self.output.canvas).siblings().css({width:i})},n.prototype.changeScene=function(t){this._newScene=t},n.prototype.loadingscreen=function(){var t=this._output.context;t.globalCompositeOperation="source-over",t.globalAlpha=1,t.fillStyle="rgba(0,0,0,0.5)",t.fillRect(0,0,this._output.w,this._output.h),t.font="20px Georgia",t.fillStyle="#FFF";var i=this._isSceneInitialized?this._scene.getPercentLoaded():0;t.textAlign="left",t.textBaseline="bottom",t.fillText("Loading "+i+"%",10+3*Math.random(),this._output.h-10+3*Math.random()),this.normalizeContext(t)},n.prototype.run=function(t){t=t||{},this._referenceRequestAnimationFrame=window.requestAnimationFrame(function i(){if(this._referenceRequestAnimationFrame=window.requestAnimationFrame(i.bind(this)),null!==this._newScene){var e=this._scene?this._scene.destroy(this._output):t;e&&(this._newScene.callInit(this._output,e,this),this._scene=this._newScene,this._newScene=null,this._isSceneInitialized=!1)}var n=this._scene.currentTime();this._timePassed=this._scene.clampTime(n-this._lastTimestamp),this._lastTimestamp=n,this._isSceneInitialized?0!==this._timePassed&&(this._scene.move(this._output,this._timePassed),this._timePassed<0&&(this._timePassed=this._scene.totalTimePassed),this._scene.draw(this._output)):this._isSceneInitialized=this._scene.callLoading(this._output)}.bind(this))},n.prototype.destroy=function(){this._referenceRequestAnimationFrame&&window.cancelAnimationFrame(this._referenceRequestAnimationFrame),this._referenceRequestAnimationFrame=null};var o=function(){};o.add=function(t,i){var e=this||o,n=function(n){e.Images[n]?i&&"function"==typeof i[n]&&i[n](n,e.Images[n]):(e.Images[n]=new window.Image,e.Images[n].onload=function(){e.loaded++,i&&"function"==typeof i?e.isLoaded()&&i():i&&"function"==typeof i[n]&&i[n](n,e.Images[n])},e.Images[n].src=t[n],e.count++)};for(var s in t)n(s);return i&&"function"==typeof i&&e.isLoaded()&&i(),e},o.reset=function(){var t=this||o;return t.Images={},t.count=0,t.loaded=0,t},o.getLoaded=function(){return(this||o).loaded},o.getCount=function(){return(this||o).count},o.isLoaded=function(){var t=this||o;return t.loaded===t.count},o.getImage=function(t){return"object"==typeof t?t:(this||o).Images[t]},o.Images={},o.count=0,o.loaded=0;var s=function(t){this.layer=[],this._cacheLayerIsFunction=[],this.totalTimePassed=0,this.initCallback=null,this.loadingCallback=null,this.destroyCallback=null,this.sceneCallback=null,this.engine=null,this.loadingShow=!0,this.endTime=t,this.additionalModifier=void 0};s.prototype.currentTime=function(){return Date.now()},s.prototype.clampTime=function(t){return t>2e3?2e3:t},s.prototype.init=function(t){return"function"==typeof t?this.initCallback=t:o.add(t),this},s.prototype.callInit=function(t,i,e){this.engine=e,this.initCallback&&this.initCallback(t,i),this.resize(t)},s.prototype.resize=function(t){this.additionalModifier={a:1,x:0,y:0,w:t.w,h:t.h,orgW:t.w,orgH:t.h}},s.prototype.destroy=function(t){return this.destroyCallback=t,this},s.prototype.scene=function(t){return this.sceneCallback=t,this},s.prototype.callDestroy=function(t){return!this.destroyCallback||this.destroyCallback(t)},s.prototype.loadingscreen=function(t,i){var e=t.context,n=Math.max(1,i*t.h);e.globalCompositeOperation="source-over",e.globalAlpha=1,e.clearRect(0,0,t.w,t.h),e.fillStyle="#aaa",e.fillRect(0,t.h/2-n/2,t.w,n),e.font="20px Georgia",e.fillStyle="#fff",e.textAlign="left",e.textBaseline="bottom";var o=i;isNaN(parseFloat(i))||isNaN(i-0)||(o="Loading "+Math.round(100*i)+"%"),e.fillText(o,10+3*Math.random(),t.h-10+3*Math.random()),this.engine&&this.engine.normalizeContext(e)},s.prototype.loading=function(t){return"function"==typeof callback?(this.loadingCallback=callback,this.loadingShow=!0):(this.loadingCallback=null,this.loadingShow=!!t),this},s.prototype.callLoading=function(t){var i=o.getCount()&&o.getLoaded()<o.getCount()&&o.getLoaded()/o.getCount();if(this.loadingShow)if(this.loadingCallback){var e=this.loadingCallback(t,i);if(null===e)return!1;if(!0!==e)return this.loadingscreen(t,e||(i||"Loading...")),!1}else i&&this.loadingscreen(t,i);return!i&&(this.reset(t),!0)},s.prototype.move=function(t,i){var e,n,o,s;for(this.totalTimePassed+=i,i<0?(this.reset(t),i=this.totalTimePassed):this.endTime&&this.endTime<=this.totalTimePassed&&(this.engine.destroy(),i-=this.totalTimePassed-this.endTime,this.totalTimePassed=this.endTime),e=this.layer.length;e--;)for(s=this._cacheLayerIsFunction[e],n=(o=this.layer[e]).length;n--;)s[n]||null===o[n]||o[n].animate(i)&&(this.layer[e][n]=null)},s.prototype.draw=function(t){var i,e,n,o;for(i=this.layer.length;i--;)for(o=this._cacheLayerIsFunction[i],e=(n=this.layer[i]).length;e--;)null!==n[e]&&(o[e]?n[e](t.context,this.totalTimePassed)&&(this.layer[i][e]=null):this.layer[i][e].draw(t.context,this.additionalModifier))},s.prototype.calcLayerIsFunction=function(){for(var t in this._cacheLayerIsFunction=new Array(this.layer.length),this.layer)for(var i in this._cacheLayerIsFunction[t]=new Array(this.layer[t].length),this.layer[t])this._cacheLayerIsFunction[t][i]="function"==typeof this.layer[t][i]},s.prototype.reset=function(t){this.layer=this.sceneCallback(t,[]).reverse(),this.calcLayerIsFunction()};var a=function(t){function i(i){t.call(this),this.audioStartTime=null,this.audioPosition=null,this.enableAndroidHack=!1,this.audioElement=i}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.prototype.currentTime=function(){var i=t.prototype.currentTime.call(this);if(this.audioElement){if(this.enableAndroidHack){if(null===this.audioStartTime)return this.audioStartTime=i,this.audioPosition=this.audioElement.currentTime,1e3*this.audioElement.currentTime;if("playing"===this.audioElement.controller.playbackState){if(this.audioElement.currentTime===this.audioPosition)return 1e3*this.audioPosition+Math.min(260,i-this.audioStartTime);if(this.audioElement.currentTime-this.audioPosition<.5&&this.audioElement.currentTime>this.audioPosition&&i-this.audioStartTime<350)return this.audioStartTime=this.audioStartTime+1e3*(this.audioElement.currentTime-this.audioPosition),this.audioPosition=this.audioElement.currentTime,1e3*this.audioPosition+i-this.audioStartTime}return this.audioStartTime=i,this.audioPosition=this.audioElement.currentTime,1e3*this.audioPosition}return 1e3*this.audioElement.currentTime}return i},i.prototype.clampTime=function(t){return t},i.prototype.init=function(){for(var i=[],e=arguments.length;e--;)i[e]=arguments[e];this.audioElement&&(this.audioElement.canPlayType("audio/mp3").match(/maybe|probably/i),"function"==typeof MediaController&&(this.audioElement.controller=new MediaController,this.enableAndroidHack=!0),this.audioElement.preload="auto",this.audioElement.load());return t.prototype.init.apply(this,i)},i.prototype.callLoading=function(i){var e=t.prototype.callLoading.call(this,i);if(e&&this.audioElement){if(!(this.audioElement.readyState>=this.audioElement.HAVE_ENOUGH_DATA))return this.loadingscreen(i,"Waiting for Audio"),!1;this.audioElement.play(),this.loadingscreen(i,"Click to play")}return e},i}(s);function r(){this.reset()}r.prototype.reset=function(){return this.m=[1,0,0,1,0,0],this},r.prototype.multiply=function(t){var i=this.m[1]*t.m[0]+this.m[3]*t.m[1],e=this.m[0]*t.m[2]+this.m[2]*t.m[3],n=this.m[1]*t.m[2]+this.m[3]*t.m[3],o=this.m[0]*t.m[4]+this.m[2]*t.m[5]+this.m[4],s=this.m[1]*t.m[4]+this.m[3]*t.m[5]+this.m[5];return this.m[0]=this.m[0]*t.m[0]+this.m[2]*t.m[1],this.m[1]=i,this.m[2]=e,this.m[3]=n,this.m[4]=o,this.m[5]=s,this},r.prototype.invert=function(){var t=1/(this.m[0]*this.m[3]-this.m[1]*this.m[2]),i=-this.m[1]*t,e=-this.m[2]*t,n=this.m[0]*t,o=t*(this.m[2]*this.m[5]-this.m[3]*this.m[4]),s=t*(this.m[1]*this.m[4]-this.m[0]*this.m[5]);return this.m[0]=this.m[3]*t,this.m[1]=i,this.m[2]=e,this.m[3]=n,this.m[4]=o,this.m[5]=s,this},r.prototype.rotate=function(t){var i=Math.cos(t),e=Math.sin(t),n=this.m[1]*i+this.m[3]*e,o=this.m[0]*-e+this.m[2]*i,s=this.m[1]*-e+this.m[3]*i;return this.m[0]=this.m[0]*i+this.m[2]*e,this.m[1]=n,this.m[2]=o,this.m[3]=s,this},r.prototype.translate=function(t,i){return this.m[4]+=this.m[0]*t+this.m[2]*i,this.m[5]+=this.m[1]*t+this.m[3]*i,this},r.prototype.scale=function(t,i){return this.m[0]*=t,this.m[1]*=t,this.m[2]*=i,this.m[3]*=i,this},r.prototype.transformPoint=function(t,i){var e=t;return[t=e*this.m[0]+i*this.m[2]+this.m[4],i=e*this.m[1]+i*this.m[3]+this.m[5]]},r.prototype.clone=function(){var t=new r;return t.m=this.m.slice(0),t};var h=function(t){function i(i){t.call(this,i),this.transform=null,this.transformInvert=null}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.prototype._getViewport=function(){if(!this.engine)return new r;if(!this.transform){var t=this.engine._output.w/2,i=this.engine._output.h/2,e=this.engine._output.ratio>1?t:i;this.transform=(new r).translate(t,i).scale(e,e),this.transformInvert=null}return this.transform},i.prototype.resize=function(t){this.transform=void 0,this.additionalModifier={a:1,x:-1,y:-1,w:2,h:2,orgW:t.w,orgH:t.h}},i.prototype.transformPoint=function(t,i){return this.transformInvert||(this.transformInvert=this._getViewport().clone().invert()),this.transformInvert.transformPoint(t,i)},i.prototype.draw=function(i){var e;i.context.save(),(e=i.context).setTransform.apply(e,this._getViewport().m),t.prototype.draw.call(this,i),i.context.restore()},i}(s),l=function(t){function i(i){t.call(this,i)}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.prototype.resize=function(t){this.additionalModifier={a:1,x:-1,y:-1,w:2,h:2,orgW:t.w,orgH:t.h}},i.prototype.draw=function(i){i.context.save(),i.context.translate(i.w/2,i.h/2),i.context.scale(i.w,i.h),i.context.translate(-.5,-.5),t.prototype.draw.call(this,i),i.context.restore()},i}(a),c={Default:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(s,[null].concat(t)))},Audio:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(a,[null].concat(t)))},Norm:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(h,[null].concat(t)))},NormAudio:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(l,[null].concat(t)))}};function u(t,i){return null==t||""===t?i:t}function p(t){for(var i=[],e=arguments.length-1;e-- >0;)i[e]=arguments[e+1];return"function"==typeof t?t.apply(null,i):t}var d=function(t){this.x=u(p(t.x),0),this.y=u(p(t.y),0),this.arc=u(p(t.arc),0),this.scaleX=u(p(t.scaleX),1),this.scaleY=u(p(t.scaleY),1),this.a=u(p(t.a),1),this.alphaMode=u(p(t.alphaMode),"source-over"),this.color=u(p(t.color),"#fff"),this.animation=p(t.animation),this.enabled=u(p(t.enabled),!0)};d.prototype.changeAnimationStatus=function(t){"object"==typeof this.animation&&this.animation.changeAnimationStatus(t)},d.prototype.animate=function(t){return"object"==typeof this.animation&&this.animation.run(this,t,!0)>=0&&(this.enabled=!1,!0)},d.prototype.draw=function(t,i){this.enabled&&(t.globalCompositeOperation=this.alphaMode,t.globalAlpha=this.a*i.a,t.save(),t.translate(this.x,this.y),t.scale(this.scaleX,this.scaleY),t.beginPath(),t.fillStyle=this.color,t.arc(0,0,1,.017453292519943295*(90+this.arc),.017453292519943295*(450-this.arc),!1),t.fill(),t.closePath(),t.restore())};var m=function(t){function i(i){t.call(this,i),this.callback=i.callback}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.prototype.draw=function(t,i){this.enabled&&this.callback(t,i,this)},i}(d),f=function(t){function i(i){t.call(this,i),this.sprite=u(i.sprite,[])}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.prototype.changeAnimationStatus=function(i){for(var e in t.prototype.changeAnimationStatus.call(this,i),this.sprite)this.sprite[e].changeAnimationStatus(i)},i.prototype.animate=function(i){var e=t.prototype.animate.call(this,i),n=!0;if(this.enabled)for(var o in this.sprite)n=this.sprite[o].animate(i)&&n;return this.animation?e:(n&&(this.enabled=!1),n)},i.prototype.draw=function(t,i){if(this.enabled){for(var e in this.a<1&&((i=Object.assign({},i)).a*=this.a),t.save(),t.translate(this.x,this.y),t.scale(this.scaleX,this.scaleY),t.rotate(.017453292519943295*this.arc),this.sprite)this.sprite[e].draw(t,i);t.restore()}},i}(d),y=function(t){function i(i){t.call(this,i),this.width=p(i.width),this.height=p(i.height)}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.prototype.generateTempCanvas=function(t,i){var e=t.canvas.width,n=t.canvas.height;this.temp_canvas=document.createElement("canvas"),this.temp_canvas.width=Math.round(e/this.scaleX),this.temp_canvas.height=Math.round(n/this.scaleY),this.tctx=this.temp_canvas.getContext("2d"),this.tctx.globalCompositeOperation="source-over",this.tctx.globalAlpha=1,this.width||(this.width=i.w),this.height||(this.height=i.h)},i.prototype.draw=function(t,i){if(this.enabled){this.temp_canvas||this.generateTempCanvas(t,i);var e=this.width,n=this.height,o=e/2,s=n/2;for(var a in this.sprite)this.sprite[a].draw(this.tctx,!1);t.save(),t.globalCompositeOperation=this.alphaMode,t.globalAlpha=this.a*i.a,t.translate(this.x+o,this.y+s),t.scale(this.scaleX,this.scaleY),t.rotate(.017453292519943295*this.arc),t.drawImage(this.temp_canvas,0,0,this.temp_canvas.width,this.temp_canvas.height,-o,-s,e,n),t.restore()}},i}(f),g=function(t){function i(i){t.call(this,i.self||{});var e={},n={};for(var o in i)-1===["self","class","count"].indexOf(o)&&("function"==typeof i[o]?n[o]=i[o]:e[o]=i[o]);var s=u(p(i.count),1);this.sprite=[];for(var a=0;a<s;a++){var r=i.class,h={};for(var l in e)h[l]=e[l];for(var c in n)h[c]=n[c].call(null,a);this.sprite[a]=new r(h)}}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i}(f),v=function(t){function i(i){t.call(this,i),this.width=p(i.width),this.height=p(i.height),this.darker=u(p(i.darker),0),this.pixel=u(p(i.pixel),!1),this.clear=u(p(i.clear),!1)}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.prototype.generateTempCanvas=function(t,i){var e=t.canvas.width,n=t.canvas.height;this.temp_canvas=document.createElement("canvas"),this.temp_canvas.width=Math.ceil(e/this.scaleX),this.temp_canvas.height=Math.ceil(n/this.scaleY),this.tctx=this.temp_canvas.getContext("2d"),this.tctx.globalCompositeOperation="source-over",this.tctx.globalAlpha=1,this.x||(this.x=i.x),this.y||(this.y=i.y),this.width||(this.width=i.w),this.height||(this.height=i.h)},i.prototype.draw=function(t,i){if(this.enabled){this.temp_canvas||this.generateTempCanvas(t,i);var e=this.a*i.a,n=this.width,o=this.height,s=Math.round(n*i.orgW/i.w/this.scaleX),a=Math.round(o*i.orgH/i.h/this.scaleY);e>0&&s&&a&&(this.tctx.globalCompositeOperation="copy",this.tctx.globalAlpha=1,this.tctx.drawImage(t.canvas,0,0,t.canvas.width,t.canvas.height,0,0,s,a),this.darker>0&&(this.tctx.globalCompositeOperation=this.clear?"source-atop":"source-over",this.tctx.fillStyle="rgba(0,0,0,"+this.darker+")",this.tctx.fillRect(0,0,s,a)),this.clear&&t.clearRect(this.x,this.y,n,o),t.globalCompositeOperation=this.alphaMode,t.globalAlpha=e,t.imageSmoothingEnabled=!this.pixel,t.drawImage(this.temp_canvas,0,0,s,a,this.x,this.y,n,o),t.imageSmoothingEnabled=!0)}else this.clear&&(this.x||(this.x=i.x),this.y||(this.y=i.y),this.width||(this.width=i.w),this.height||(this.height=i.h),t.clearRect(this.x,this.y,this.width,this.height))},i}(d),b=function(t){function i(e){t.call(this,e),this.image=o.getImage(p(e.image)),this.position=u(p(e.position),i.CENTER),this.frameX=u(p(e.frameX),0),this.frameY=u(p(e.frameY),0),this.frameWidth=u(p(e.frameWidth),0),this.frameHeight=u(p(e.frameHeight),0)}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.prototype.draw=function(t,e){if(this.enabled){var n=this.frameWidth||this.image.width,o=this.frameHeight||this.image.height,s=n*this.scaleX,a=o*this.scaleY;t.globalCompositeOperation=this.alphaMode,t.globalAlpha=this.a*e.a,0==this.arc?this.position===i.LEFT_TOP?t.drawImage(this.image,this.frameX,this.frameY,n,o,this.x,this.y,s,a):t.drawImage(this.image,this.frameX,this.frameY,n,o,this.x-s/2,this.y-a/2,s,a):(t.save(),t.translate(this.x,this.y),t.rotate(.017453292519943295*this.arc),t.drawImage(this.image,this.frameX,this.frameY,n,o,-(s>>1),-(a>>1),s,a),t.restore())}},i}(d);b.LEFT_TOP=0,b.CENTER=1;var w=function(t){function i(e){t.call(this,e),this.text=p(e.text),this.font=u(p(e.font),"26px monospace"),this.position=u(p(e.position),i.CENTER),this.color=p(e.color),this.borderColor=p(e.borderColor),this.lineWidth=u(p(e.lineWidth),1)}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.prototype.draw=function(t,e){this.enabled&&(t.globalCompositeOperation=this.alphaMode,t.globalAlpha=this.a*e.a,t.save(),i.LEFT_TOP&&(t.textAlign="left",t.textBaseline="top"),t.translate(this.x,this.y),t.scale(this.scaleX,this.scaleY),t.rotate(.017453292519943295*this.arc),t.font=this.font,this.color&&(t.fillStyle=this.color,t.fillText(this.text,0,0)),this.borderColor&&(t.strokeStyle=this.borderColor,t.lineWidth=this.lineWidth,t.strokeText(this.text,0,0)),t.restore())},i}(d);w.LEFT_TOP=0,w.CENTER=1;var _=function(i){function e(t){i.call(this,t)}return i&&(e.__proto__=i),(e.prototype=Object.create(i&&i.prototype)).constructor=e,e.getGradientImage=function(t,i,n){var o,s,a=t>>4,r=i>>4,h=n>>4;if(!e.Gradient)for(e.Gradient=new Array(16),o=0;o<e.Gradient.length;o++)for(e.Gradient[o]=new Array(16),s=0;s<e.Gradient[o].length;s++)e.Gradient[o][s]=new Array(16);return e.Gradient[a][r][h]||(e.Gradient[a][r][h]=e.generateGradientImage(a,r,h)),e.Gradient[a][r][h]},e.generateGradientImage=function(t,i,e){var n=document.createElement("canvas");n.width=n.height=64;var o=n.getContext("2d");o.globalAlpha=1,o.globalCompositeOperation="source-over",o.clearRect(0,0,64,64);var s=o.createRadialGradient(32,32,0,32,32,32);return s.addColorStop(0,"rgba("+(16+(t<<4)-1)+","+(16+(i<<4)-1)+","+(16+(e<<4)-1)+",1)"),s.addColorStop(.3,"rgba("+(16+(t<<4)-1)+","+(16+(i<<4)-1)+","+(16+(e<<4)-1)+",0.4)"),s.addColorStop(1,"rgba("+(16+(t<<4)-1)+","+(16+(i<<4)-1)+","+(16+(e<<4)-1)+",0)"),o.fillStyle=s,o.fillRect(0,0,64,64),n},e.prototype.draw=function(i,n){if(this.enabled){this.color&&this.color.color||(this.color=t(this.color).rgb());var o=this.color.color;i.globalCompositeOperation=this.alphaMode,i.globalAlpha=this.a*n.a,i.imageSmoothingEnabled=this.scaleX>64,i.drawImage(e.getGradientImage(o[0],o[1],o[2]),0,0,64,64,this.x-(this.scaleX>>1),this.y-(this.scaleY>>1),this.scaleX,this.scaleY),i.imageSmoothingEnabled=!0}},e}(d);_.Gradient=null;var x=function(t){function i(i){t.call(this,i),this.oldPath=void 0,this.path=p(i.path),this.path2D=new Path2D,this.color=p(i.color),this.borderColor=p(i.borderColor),this.lineWidth=u(p(i.lineWidth),1),this.clip=u(p(i.clip),!1),this.fixed=u(p(i.fixed),!1)}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.prototype.draw=function(t,i){var e=this;if(this.enabled){var n=this.a;this.oldPath!==this.path&&(Array.isArray(this.path)?(this.path2D=new Path2D,this.path.forEach(function(t){e.path2D.moveTo(t[0][0],t[0][1]),t.forEach(function(t){e.path2D.bezierCurveTo(t[2],t[3],t[4],t[5],t[6],t[7])}),e.path2D.closePath()})):this.path2D=new Path2D(this.path),this.oldPath=this.path),i&&(n*=i.a);var o=this.scaleX,s=this.scaleY;for(var a in this.fixed&&(0==o&&(o=1e-10),0==s&&(s=1e-10)),t.globalCompositeOperation=this.alphaMode,t.globalAlpha=n,t.save(),t.translate(this.x,this.y),t.scale(o,s),t.rotate(.017453292519943295*this.arc),this.color&&(t.fillStyle=this.color,t.fill(this.path2D)),this.borderColor&&(t.strokeStyle=this.borderColor,t.lineWidth=this.lineWidth,t.stroke(this.path2D)),this.clip&&(t.clip(this.path2D),this.fixed&&(t.rotate(.017453292519943295*-this.arc),t.scale(1/o,1/s),t.translate(-this.x,-this.y))),this.sprite)this.sprite[a].draw(t,i);t.restore()}},i}(f),T=function(t){function i(i){t.call(this,i),this.width=p(i.width),this.height=p(i.height),this.x=p(i.x),this.y=p(i.y),this.borderColor=p(i.borderColor),this.lineWidth=u(p(i.lineWidth),1)}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.prototype.draw=function(t,i){this.enabled&&(this.width||(this.width=i.w),this.height||(this.height=i.h),void 0===this.x&&(this.x=i.x),void 0===this.y&&(this.y=i.y),t.globalCompositeOperation=this.alphaMode,t.globalAlpha=this.a*i.a,0===this.arc?(t.fillStyle=this.color,t.fillRect(this.x,this.y,this.width,this.height),this.borderColor&&(t.beginPath(),t.lineWidth=this.lineWidth,t.strokeStyle=this.borderColor,t.rect(this.x,this.y,this.width,this.height),t.stroke())):(t.save(),t.translate(this.x+this.width/2,this.y+this.height/2),t.rotate(.017453292519943295*this.arc),t.fillStyle=this.color,t.fillRect(-this.width/2,-this.height/2,this.width,this.height),this.borderColor&&(t.beginPath(),t.lineWidth=this.lineWidth,t.strokeStyle=this.borderColor,t.rect(-this.width/2,-this.height/2,this.width,this.height),t.stroke()),t.restore()))},i}(d),C=function(t){function i(i){var e=p(i.text),n=Array.isArray(e)?e:[].concat(e);t.call(this,Object.assign({},i,{class:w,count:n.length,text:function(t){return n[t]},enabled:function(t){return" "!==n[t]&&p(i.enabled,t)}}))}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i}(g),E=function(t){function i(i){t.call(this,i),this.count=u(p(i.count),40),this.moveX=u(p(i.moveX),0),this.moveY=u(p(i.moveY),0),this.moveZ=u(p(i.moveZ),0),this.lineWidth=p(i.lineWidth),void 0!==this.x&&void 0!==this.y&&this.width&&this.height&&this.lineWidth?this.init():this.centerX=void 0}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.prototype.init=function(){this.centerX=this.width/2+this.x,this.centerY=this.height/2+this.y,this.scaleZ=Math.max(this.width,this.height)/2,this.starsX=[],this.starsY=[],this.starsZ=[],this.starsOldX=[],this.starsOldY=[],this.starsNewX=[],this.starsNewY=[],this.starsEnabled=[],this.starsLineWidth=[];for(var t=0;t<this.count;t++)this.starsX[t]=Math.random()*this.width-this.width/2,this.starsY[t]=Math.random()*this.height-this.height/2,this.starsZ[t]=Math.random()*this.scaleZ},i.prototype.moveStar=function(t,i,e){e&&(this.starsEnabled[t]=!0);for(var n=this.width/2,o=this.height/2,s=this.starsX[t]+this.moveX*i,a=this.starsY[t]+this.moveY*i,r=this.starsZ[t]+this.moveZ*i;s<-n;)s+=this.width,a=Math.random()*this.height-o,this.starsEnabled[t]=!1;for(;s>n;)s-=this.width,a=Math.random()*this.height-o,this.starsEnabled[t]=!1;for(;a<-o;)a+=this.height,s=Math.random()*this.width-n,this.starsEnabled[t]=!1;for(;a>o;)a-=this.height,s=Math.random()*this.width-n,this.starsEnabled[t]=!1;for(;r<=0;)r+=this.scaleZ,s=Math.random()*this.width-n,a=Math.random()*this.height-o,this.starsEnabled[t]=!1;for(;r>this.scaleZ;)r-=this.scaleZ,s=Math.random()*this.width-n,a=Math.random()*this.height-o,this.starsEnabled[t]=!1;var h=this.centerX+s/r*n,l=this.centerY+a/r*o;this.starsEnabled[t]=this.starsEnabled[t]&&h>=this.x&&l>=this.y&&h<this.x+this.width&&l<this.y+this.height,e?(this.starsX[t]=s,this.starsY[t]=a,this.starsZ[t]=r,this.starsNewX[t]=h,this.starsNewY[t]=l):(this.starsOldX[t]=h,this.starsOldY[t]=l,this.starsLineWidth[t]=Math.floor(4*(1-this.starsZ[t]/this.scaleZ))+1)},i.prototype.animate=function(i){var e=t.prototype.animate.call(this,i);if(this.enabled&&void 0!==this.centerX)for(var n=this.count;n--;)this.moveStar(n,i/16,!0),this.starsEnabled[n]&&this.moveStar(n,-5,!1);return e},i.prototype.draw=function(t,i){if(this.enabled){if(void 0===this.centerX)return this.width=this.width||i.w,this.height=this.height||i.h,this.x=void 0===this.x?i.x:this.x,this.y=void 0===this.y?i.y:this.y,this.lineWidth=this.lineWidth||i.h/i.orgH/4,console.log(this.lineWidth),void this.init();if(t.globalCompositeOperation=this.alphaMode,t.globalAlpha=this.a*i.a,0==this.moveY&&0==this.moveZ&&this.moveX<0){t.fillStyle=this.color;for(var e=this.count;e--;)this.starsEnabled[e]&&t.fillRect(this.starsNewX[e],this.starsNewY[e]-this.starsLineWidth[e]*this.lineWidth/2,this.starsOldX[e]-this.starsNewX[e],this.starsLineWidth[e]*this.lineWidth)}else{t.strokeStyle=this.color;for(var n,o=5;--o;){for(t.beginPath(),t.lineWidth=o*this.lineWidth,n=this.count;n--;)this.starsEnabled[n]&&this.starsLineWidth[n]===o&&(t.moveTo(this.starsOldX[n],this.starsOldY[n]),t.lineTo(this.starsNewX[n],this.starsNewY[n]));t.stroke(),t.closePath()}}}},i}(T),S={Callback:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(m,[null].concat(t)))},Canvas:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(y,[null].concat(t)))},Circle:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(d,[null].concat(t)))},Emitter:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(g,[null].concat(t)))},FastBlur:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(v,[null].concat(t)))},Group:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(f,[null].concat(t)))},Image:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(b,[null].concat(t)))},Text:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(w,[null].concat(t)))},Particle:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(_,[null].concat(t)))},Path:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(x,[null].concat(t)))},Rect:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(T,[null].concat(t)))},Scroller:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(C,[null].concat(t)))},StarField:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(E,[null].concat(t)))}},P=function(t,i,e){for(var n in this.loop=t,this.timeWait=u(i,0),this.animation=e||{},this.animationPosition={},this.animation)this.animationPosition[n]={position:0,timelapsed:-p(this.timeWait),object:null,loop:p("object"==typeof t?t[n]:t),enabled:!("object"==typeof t&&!1===p(t[n])||!1===p(t))},this.setObject(n);this.last_timestamp=0,this.hide_vote=!1};P.prototype.setObject=function(t){this.animationPosition[t].position<this.animation[t].length&&null!==this.animation[t][this.animationPosition[t].position]?(this.animationPosition[t].object=this.animation[t][this.animationPosition[t].position],"function"==typeof this.animationPosition[t].object.reset&&this.animationPosition[t].object.reset(),"function"!=typeof this.animationPosition[t].object.run&&(this.animationPosition[t].object={run:this.animationPosition[t].object})):this.animationPosition[t].object=null},P.prototype.changeAnimationStatus=function(t){var i;for(i in t)"object"==typeof this.animationPosition[i]&&(null!==t[i].position&&(this.animationPosition[i].position=t[i].position),null!==t[i].loop&&(this.animationPosition[i].loop=t[i].loop,this.animationPosition[i].enabled=!(!1===t[i].loop)),null!==t[i].timelapsed&&(this.animationPosition[i].timelapsed=t[i].timelapsed),this.setObject(i));for(i in this.animation)"object"==typeof this.animationPosition[i]&&this.animationPosition[i].object instanceof P&&this.animationPosition[i].object.changeAnimationStatus(t)},P.prototype.run=function(t,i,e){var n=i,o=0,s=0,a=0,r=0,h=null;for(var l in e||(n=i-this.last_timestamp,this.last_timestamp=i),this.animation)if(a++,!0===(h=this.animationPosition[l]).enabled)if(r=n,null===h.object)o++,s++,r=0;else if(r>0)for(;r>0;)if(h.timelapsed+=r,h.timelapsed>=0){if(!0===(r=h.object.run(t,h.timelapsed))&&(r=0),r===P.TIMELAPSE_TO_FORCE_DISABLE)return n;r===P.TIMELAPSE_TO_STOP?(h.timelapsed=0,this.setObject(l),h.object=null,r=0):!1!==r&&r>=0&&(h.position++,h.position>=this.animation[l].length&&(!0!==h.loop&&h.loop--,h.loop?h.position=h.position%this.animation[l].length:h.enabled=!1),h.timelapsed=0,this.setObject(l),h.enabled||(h.object=null,h.enabled=!0),null===h.object&&(o++,r=0))}else r=0,s++;else s++;if(a>0){if(o===a)return n;t.enabled&&s===a?(t.enabled=!1,this.hide_vote=!0):this.hide_vote&&s!==a&&(this.hide_vote=!1,t.enabled=!0)}return-1},P.TIMELAPSE_TO_FORCE_DISABLE="FORCE_DISABLE",P.TIMELAPSE_TO_STOP="STOP";var A=function(t,i){this.callback=t,this.duration=u(p(i),void 0),this.initialized=!1};function F(t,i){return i.from+t*i.delta}function O(t,i){for(var e,n=[].concat(i.values),o=n.length;o>1;)for(o--,e=0;e<o;e++)n[e]=n[e]+t*(n[e+1]-n[e]);return n[0]}function I(t,i,e){return i.colorTo.mix(i.colorFrom,t).string()}function M(t,e,n){return i._lerp(e.pathFrom,e.pathTo,t)}A.prototype.reset=function(){this.initialized=!1},A.prototype.run=function(t,i){var e;return void 0!==this.duration?(this.callback(t,Math.min(i,this.duration),!this.initialized),this.initialized=!0,i-this.duration):(e=this.callback(t,i,!this.initialized),this.initialized=!0,e)};var k=function(t,i,e){for(var n in this.initialized=!1,this.changeValues=[],t){var o=t[n],s="color"===n,a="path"===n,r="function"==typeof o,h=!s&&Array.isArray(o);this.changeValues.push({name:n,to:h?o[o.length-1]:p(o,1,{}),bezier:!!h&&o,isColor:s,isPath:a,isFunction:!!r&&o,moveAlgorithm:s?I:a?M:h?O:F})}this.duration=u(p(i),0),this.ease=u(e,function(t){return t})};k.prototype.reset=function(){this.initialized=!1},k.prototype.init=function(e,n){for(var o,s,a,r=this.changeValues.length;r--;)(a=this.changeValues[r]).isFunction?(a.from=e[a.name],a.to=a.isFunction(a.from),a.isColor?(a.colorFrom=t(a.from),a.colorTo=t(a.to),a.moveAlgorithm=I):a.isPath?(o=i._preprocessing(i.path2shapes(a.from),i.path2shapes(a.to)),a.pathFrom=o[0],a.pathTo=o[1],a.moveAlgorithm=M):Array.isArray(a.to)?(a.values=[e[a.name]].concat(a.to),a.moveAlgorithm=O):(a.delta=a.to-a.from,a.moveAlgorithm=F)):a.isColor?(a.colorFrom=t(e[a.name]),a.colorTo=t(a.to)):a.isPath?(s=i._preprocessing(i.path2shapes(e[a.name]),i.path2shapes(a.to)),a.pathFrom=s[0],a.pathTo=s[1]):a.bezier?a.values=[e[a.name]].concat(a.bezier):(a.from=e[a.name],a.delta=a.to-a.from)},k.prototype.run=function(t,i){if(this.initialized||(this.initialized=!0,this.init(t,i)),this.duration<=i)for(var e,n=this.changeValues.length;n--;)t[(e=this.changeValues[n]).name]=e.to;else for(var o,s=this.changeValues.length,a=this.ease(i/this.duration);s--;)t[(o=this.changeValues[s]).name]=o.moveAlgorithm(a,o,t);return i-this.duration};var j=function(){};j.prototype.run=function(t,i){return P.TIMELAPSE_TO_FORCE_DISABLE};var L=function(){};L.prototype.run=function(t,i){return t.enabled=!1,P.TIMELAPSE_TO_FORCE_DISABLE};var W=function(t,i){this.initialized=!1,this.image=p(t),this.durationBetweenFrames=u(p(i),0),Array.isArray(this.image)?this.count=this.image.length:(this.image=[this.image],this.count=1),this.duration=this.count*this.durationBetweenFrames};W.prototype.reset=function(){this.initialized=!1},W.prototype.run=function(t,i){if(this.initialized||(this.initialized=!0,this.current=-1),i>=this.duration)t.image=o.getImage(this.image[this.image.length-1]);else{var e=Math.floor(i/this.durationBetweenFrames);e!==this.current&&(this.current=e,t.image=o.getImage(this.image[this.current]))}return i-this.duration};var X=function(t,i,e){this.initialized=!1,this.frameNumber=p(t),this.framesToRight=u(p(i),!0),this.durationBetweenFrames=u(p(e),0),Array.isArray(this.frameNumber)?this.count=this.frameNumber.length:(this.frameNumber=[this.frameNumber],this.count=1),this.duration=this.count*this.durationBetweenFrames};X.prototype.run=function(t,i){var e=0;return e=i>=this.duration?this.frameNumber[this.frameNumber.length-1]:Math.floor(i/this.durationBetweenFrames),this.framesToRight?t.frameX=t.frameWidth*e:t.frameY=t.frameHeight*e,i-this.duration};var z=function(t){function i(i,e,n,o){t.call(this,{x:i,y:e},0,o),this.speed=p(n)||1}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.prototype.init=function(i,e){if(0==this.speed||this.targetX===i.x&&this.targetY===i.y)this.duration=0;else{var n=this.changeValues[0],o=this.changeValues[1];n.from=i.x,o.from=i.y,n.delta=n.to-n.from,o.delta=o.to-o.from;var s=Math.sqrt(n.delta*n.delta+o.delta*o.delta);this.duration=10*s/this.speed}t.prototype.init.call(this,i,e)},i}(k),Y=function(t,i){this.Aniobject=t,this.times=u(p(i),1)};Y.prototype.run=function(t,i){if(this.times<=0)return i;var e=this.Aniobject.run(t,i);return e>0&&this.times--,e};var D=function(t,i,e){this.duration=u(p(i),1),this.name=p(t),this.loop=p(u(e,1))};D.prototype.run=function(t,i){var e;return i>=this.duration&&t.changeAnimationStatus(((e={})[this.name]={position:0,timelapsed:i-this.duration,loop:this.loop},e)),i-this.duration};var R=function(t,i){this.initialized=!1,this.duration=p(i),this.shakeDiff=p(t),this.shakeDiffHalf=this.shakeDiff/2};R.prototype.reset=function(){this.initialized=!1},R.prototype.run=function(t,i){return this.initialized||(this.initialized=!0,this.x=t.x,this.y=t.y),i>=this.duration?(t.x=this.x,t.y=this.y):(t.x=this.x+Math.random()*this.shakeDiff-this.shakeDiffHalf,t.y=this.y+Math.random()*this.shakeDiff-this.shakeDiffHalf),i-this.duration};var N=function(){this.showOnce=!0};N.prototype.run=function(t,i){return t.enabled=t.enabled&&this.showOnce,this.showOnce=!1,0};var G=function(){};G.prototype.run=function(t,i){return P.TIMELAPSE_TO_STOP};var H=function(t){this.duration=p(t)};H.prototype.run=function(t,i){return this.duration?i-this.duration:-1};var B=function(t){this.duration=p(t)};B.prototype.run=function(t,i){return t.enabled=i>=this.duration,i-this.duration};var Z={Callback:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(A,[null].concat(t)))},ChangeTo:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(k,[null].concat(t)))},End:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(j,[null].concat(t)))},EndDisabled:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(L,[null].concat(t)))},Image:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(W,[null].concat(t)))},ImageFrame:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(X,[null].concat(t)))},Move:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(z,[null].concat(t)))},Once:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(Y,[null].concat(t)))},Play:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(D,[null].concat(t)))},Shake:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(R,[null].concat(t)))},ShowOnce:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(N,[null].concat(t)))},Stop:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(G,[null].concat(t)))},Wait:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(H,[null].concat(t)))},WaitDisabled:function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(B,[null].concat(t)))}},V=function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(n,[null].concat(t)))},q=function(){for(var t=[],i=arguments.length;i--;)t[i]=arguments[i];return new(Function.prototype.bind.apply(P,[null].concat(t)))};export{V as Engine,c as Scenes,o as ImageManager,S as Sprites,q as Sequence,Z as Animations};
//# sourceMappingURL=animationvideo.m.js.map
