declare class ImageManager {
    Images: Record<string, HTMLImageElement>;
    count: number;
    loaded: number;
    _resolve: ((value: unknown) => void)[];
    constructor();
    add<F extends (key: string, image: HTMLImageElement) => void>(Images: string[] | Record<string, string>, Callbacks?: undefined | (() => void) | F[] | Record<string, F>): this;
    reset(): this;
    isLoaded(): boolean;
    getImage(nameOrImage: HTMLImageElement | string): HTMLImageElement;
    isLoadedPromise(): true | Promise<unknown>;
}
declare const _default: ImageManager;
export default _default;
