class ImageManager {
  Images:Record<string, HTMLImageElement>
  count: number
  loaded: number
  _resolve: ((value:unknown)=>void)[] = []

  constructor() {
    this.Images = {};
    this.count = 0;
    this.loaded = 0;
  }

  add<
  F extends (key:string, image:HTMLImageElement)=>void
  >(
    Images: string[]|Record<string,string>, 
    Callbacks: undefined|(()=>void)|F[]|Record<string,F> = undefined
    ) {
    const self = this;
    for (const key in Images) {
      if (!self.Images[key]) {
        const imageSrc = (Images as Record<string,string>)[key];
        self.Images[key] = new window.Image();
        self.Images[key].onload = function() {
          self.loaded++;
          if (Callbacks && typeof Callbacks === "function") {
            if (self.isLoaded()) {
              Callbacks();
            }
          } else if (Callbacks && typeof (Callbacks as Record<string,F>)[key] === "function") {
            (Callbacks as Record<string,F>)[key](key, self.Images[key]);
          }
          if (self._resolve && self.isLoaded()) {
            self._resolve.forEach(c => c(undefined));
            self._resolve = [];
          }
        };
        // crossOrigin makes more trouble in the browser and seems to cause slow downs
        // self.Images[key].crossOrigin = "anonymous";
        if (imageSrc.substr(0, 4) === "<svg") {
          const DOMURL = window.URL || window.webkitURL;
          const svg = new window.Blob([imageSrc], { type: "image/svg+xml" });
          self.Images[key].src = DOMURL.createObjectURL(svg);
        } else {
          if (/^(https?:)?\/\//.test(imageSrc)) {
            self.Images[key].onerror = () => {
              // load again without crossOrigin
              const img = new window.Image();
              img.onload = self.Images[key].onload;
              self.Images[key] = img;
              self.Images[key].src = imageSrc;
            };
            self.Images[key].crossOrigin = "anonymous";
          }
          self.Images[key].src = imageSrc;
        }
        self.count++;
      } else {
        if (Callbacks && typeof (Callbacks as Record<string,F>)[key] === "function") {
          (Callbacks as Record<string,F>)[key](key, self.Images[key]);
        }
      }
    }
    if (Callbacks && typeof Callbacks === "function" && self.isLoaded()) {
      Callbacks();
    }
    if (self._resolve && self.isLoaded()) {
      self._resolve.forEach(c => c(undefined));
      self._resolve = [];
    }
    return self;
  }

  reset() {
    this.Images = {};
    this.count = 0;
    this.loaded = 0;
    return this;
  }

  isLoaded() {
    return this.loaded === this.count;
  }

  getImage(nameOrImage:HTMLImageElement|string) {
    return typeof nameOrImage === "object"
      ? nameOrImage
      : this.Images[nameOrImage];
  }

  isLoadedPromise() {
    return this.isLoaded()
      ? true
      : new Promise((resolve, reject) => {
          this._resolve.push(resolve);
        });
  }
}

export default new ImageManager();
