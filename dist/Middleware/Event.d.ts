import type { ValueOf } from '../helper';
import LayerManager from '../LayerManager';
import type { ConfigurationObject, EventsReturn, ParameterListInitDestroy, ParameterListWithoutTime } from '../Scene';
import Scene from '../Scene';
import { ISpriteFunctionOrSprite } from '../Sprites/Sprite';
export default class Events implements ConfigurationObject {
    type: string;
    _reseted: boolean;
    _events: {
        n: HTMLElement;
        e: keyof HTMLElementEventMap;
        f: (this: HTMLElement, el: ValueOf<HTMLElementEventMap>) => any;
    }[];
    _pushEvent(command: "mouseDown" | "mouseUp" | "mouseOut" | "mouseMove" | "mouseWheel", event: Event | TouchEvent | MouseEvent, scene: Scene): void;
    events({ scene }: ParameterListInitDestroy): EventsReturn;
    init({ output, scene }: ParameterListInitDestroy): void;
    destroy(): void;
    reset(params: ParameterListWithoutTime, layerManager: LayerManager | ISpriteFunctionOrSprite[][]): LayerManager | ISpriteFunctionOrSprite[][];
    getMousePosition({ event: e }: {
        event: Event | TouchEvent | MouseEvent;
    }): number[];
    getMouseButton({ event: e }: {
        event: Event | TouchEvent | MouseEvent;
    }): number;
}
