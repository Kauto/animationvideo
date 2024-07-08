class ImageManager {
  Images: Record<string, HTMLImageElement>;
  count: number;
  loaded: number;
  _resolve: ((value: unknown) => void)[] = [];

  constructor() {
    this.Images = {};
    this.count = 0;
    this.loaded = 0;
  }

  add<F extends (key: string, image: HTMLImageElement) => void>(
    Images: string[] | Record<string, string>,
    Callbacks: undefined | (() => void) | F[] | Record<string, F> = undefined,
  ) {
    for (const key in Images) {
      if (!this.Images[key]) {
        const imageSrc = (Images as Record<string, string>)[key];
        this.Images[key] = new window.Image();
        this.Images[key].onload = () => {
          this.loaded++;
          if (Callbacks && typeof Callbacks === "function") {
            if (this.isLoaded()) {
              Callbacks();
            }
          } else if (
            Callbacks &&
            typeof (Callbacks as Record<string, F>)[key] === "function"
          ) {
            (Callbacks as Record<string, F>)[key](key, this.Images[key]);
          }
          if (this._resolve && this.isLoaded()) {
            this._resolve.forEach((c) => c(undefined));
            this._resolve = [];
          }
        };
        // crossOrigin makes more trouble in the browser and seems to cause slow downs
        // self.Images[key].crossOrigin = "anonymous";
        if (imageSrc.substr(0, 4) === "<svg") {
          const DOMURL = window.URL || window.webkitURL;
          const svg = new window.Blob([imageSrc], { type: "image/svg+xml" });
          this.Images[key].src = DOMURL.createObjectURL(svg);
        } else {
          if (/^(https?:)?\/\//.test(imageSrc)) {
            this.Images[key].onerror = () => {
              // load again without crossOrigin
              const img = new window.Image();
              img.onload = this.Images[key].onload;
              this.Images[key] = img;
              this.Images[key].src = imageSrc;
            };
            this.Images[key].crossOrigin = "anonymous";
          }
          this.Images[key].src = imageSrc;
        }
        this.count++;
      } else {
        if (
          Callbacks &&
          typeof (Callbacks as Record<string, F>)[key] === "function"
        ) {
          (Callbacks as Record<string, F>)[key](key, this.Images[key]);
        }
      }
    }
    if (Callbacks && typeof Callbacks === "function" && this.isLoaded()) {
      Callbacks();
    }
    if (this._resolve && this.isLoaded()) {
      this._resolve.forEach((c) => c(undefined));
      this._resolve = [];
    }
    return this;
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

  getImage(nameOrImage: HTMLImageElement | string) {
    return typeof nameOrImage === "object"
      ? nameOrImage
      : this.Images[nameOrImage];
  }

  isLoadedPromise() {
    return this.isLoaded()
      ? true
      : new Promise((resolve, _reject) => {
          this._resolve.push(resolve);
        });
  }
}

export default new ImageManager();
