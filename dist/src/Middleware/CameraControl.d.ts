import type Scene from "../Scene";
import type { ConfigurationObject, ParameterList, ParameterListFixedUpdate, ParameterListInitDestroy, ParameterListPositionEvent, ParameterListWithoutTime, RectPosition } from "../Scene";
import type { CameraPosition } from "./Camera";
export interface MiddlewareCameraControlOptions {
    zoomMax: number;
    zoomMin: number;
    zoomFactor: number;
    tween: number;
    callResize: boolean;
}
export default class CameraControl implements ConfigurationObject {
    type: string;
    _mousePos: Record<number, {
        x: number;
        y: number;
        _cx: number;
        _cy: number;
        _isDown: boolean;
        _numOfFingers: number;
        _distance: undefined | number;
        _timestamp: number;
        _czoom: undefined | number;
    }>;
    toCam: CameraPosition;
    _config: MiddlewareCameraControlOptions;
    _scene: Scene | undefined;
    _instant: boolean;
    constructor(config?: Partial<MiddlewareCameraControlOptions>);
    init({ scene }: ParameterListInitDestroy): void;
    mouseDown({ event: e, position: [mx, my], button: i }: ParameterListPositionEvent): void;
    mouseUp({ event: e, position: [mx, my], button: i, scene }: ParameterListPositionEvent): void;
    mouseOut({ button: i }: ParameterListPositionEvent): void;
    mouseMove({ event: e, position: [mx, my], button: i, scene }: ParameterListPositionEvent): void;
    mouseWheel({ event: e, position: [mx, my], scene }: ParameterListPositionEvent): void;
    hasCamChanged(): boolean;
    fixedUpdate({ scene, lastCall }: ParameterListFixedUpdate): void;
    update({ scene }: ParameterList): void;
    camInstant(): void;
    resize(args: ParameterListWithoutTime & {
        clampLimits?: RectPosition;
    }): void;
    zoomToNorm(): this;
    zoomIn(): this;
    zoomOut(args: ParameterListWithoutTime & {
        clampLimits?: RectPosition;
    }): this;
    zoomTo(params: ParameterListWithoutTime & RectPosition): void;
}
