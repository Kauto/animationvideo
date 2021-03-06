class ImageManager {
  constructor() {
    this.Images = {};
    this.count = 0;
    this.loaded = 0;
  }

  static add(Images, Callbacks) {
    const self = this || ImageManager;
    for (const i in Images) {
      if (!self.Images[i]) {
        self.Images[i] = new window.Image();
        self.Images[i].onload = function() {
          self.loaded++;
          if (Callbacks && typeof Callbacks === "function") {
            if (self.isLoaded()) {
              Callbacks();
            }
          } else if (Callbacks && typeof Callbacks[i] === "function") {
            Callbacks[i](i, self.Images[i]);
          }
          if (self.resolve && self.isLoaded()) {
            self.resolve();
            self.resolve = null;
          }
        };
        // crossOrigin makes more trouble in the browser and seems to cause slow downs
        // self.Images[i].crossOrigin = "anonymous";
        if (Images[i].substr(0, 4) === "<svg") {
          const DOMURL = window.URL || window.webkitURL || window;
          const svg = new window.Blob([Images[i]], { type: "image/svg+xml" });
          self.Images[i].src = DOMURL.createObjectURL(svg);
        } else {
          if (/^(https?:)?\/\//.test(Images[i])) {
            self.Images[i].onerror = () => {
              // load again without crossOrigin
              const img = new window.Image();
              img.onload = self.Images[i].onload;
              self.Images[i] = img;
              self.Images[i].src = Images[i];
            };
            self.Images[i].crossOrigin = "anonymous";
          }
          self.Images[i].src = Images[i];
        }
        self.count++;
      } else {
        if (Callbacks && typeof Callbacks[i] === "function") {
          Callbacks[i](i, self.Images[i]);
        }
      }
    }
    if (Callbacks && typeof Callbacks === "function" && self.isLoaded()) {
      Callbacks();
    }
    if (self.resolve && self.isLoaded()) {
      self.resolve();
      self.resolve = null;
    }
    return self;
  }

  static reset() {
    const self = this || ImageManager;
    self.Images = {};
    self.count = 0;
    self.loaded = 0;
    return self;
  }

  static getLoaded() {
    return (this || ImageManager).loaded;
  }

  static getCount() {
    return (this || ImageManager).count;
  }

  static isLoaded() {
    const self = this || ImageManager;
    return self.loaded === self.count;
  }

  static getImage(nameOrImage) {
    return typeof nameOrImage === "object"
      ? nameOrImage
      : (this || ImageManager).Images[nameOrImage];
  }

  static isLoadedPromise() {
    const self = this || ImageManager;
    return self.isLoaded()
      ? true
      : new Promise((resolve, reject) => {
          self.resolve = resolve;
        });
  }
}

ImageManager.Images = {};
ImageManager.count = 0;
ImageManager.loaded = 0;

export default ImageManager;
