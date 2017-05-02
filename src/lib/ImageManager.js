import isString from 'lodash/isString';

class ImageManager {
  static Images = {};
  static count = 0;
  static loaded = 0;

  static add(Images, Callbacks) {
    const self = this || ImageManager;
    for (let i in Images) {
      if (!self.Images[i]) {
        self.Images[i] = new window.Image();
        self.Images[i].onload = function () {
          self.loaded++;
          if (Callbacks && typeof(Callbacks) === "function") {
            if (self.isLoaded()) {
              Callbacks();
            }
          } else if (Callbacks && typeof(Callbacks[i]) === "function") {
            Callbacks[i](i, self.Images[i]);
          }
        };
        self.Images[i].src = Images[i];
        self.count++;
      } else {
        if (Callbacks && typeof(Callbacks[i]) === "function") {
          Callbacks[i](i, self.Images[i]);
        }
      }
    }
    if (Callbacks && typeof(Callbacks) === "function" && self.isLoaded()) {
      Callbacks();
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
    return (self.loaded === self.count);
  }

  static getImage(nameOrImage) {
    return isString(nameOrImage) ? (this || ImageManager).Images[nameOrImage] : nameOrImage;
  }
}

export default ImageManager;