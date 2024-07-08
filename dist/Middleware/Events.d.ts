import { default as Scene, ConfigurationObject, EventsReturn, ParameterListInitDestroy, ParameterListWithoutTime } from '../Scene';
import { ValueOf } from '../helper';
import { default as LayerManager } from '../LayerManager';
import { ISpriteFunctionOrSprite } from '../Sprites/Sprite';

export default class Events implements ConfigurationObject {
    type: string;
    _reseted: boolean;
    _events: {
        n: HTMLElement;
        e: keyof HTMLElementEventMap;
        f: (this: HTMLElement, el: ValueOf<HTMLElementEventMap>) => unknown;
    }[];
    _pushEvent(command: "mouseDown" | "mouseUp" | "mouseOut" | "mouseMove" | "mouseWheel", event: Event | TouchEvent | MouseEvent, scene: Scene): void;
    events({ scene }: ParameterListWithoutTime): EventsReturn;
    init({ output, scene }: ParameterListInitDestroy): void;
    destroy(): void;
    reset(_params: ParameterListWithoutTime, layerManager: LayerManager | ISpriteFunctionOrSprite[][]): LayerManager | ISpriteFunctionOrSprite[][];
    getMousePosition({ event: e }: {
        event: Event | TouchEvent | MouseEvent;
    }): number[];
    getMouseButton({ event: e }: {
        event: Event | TouchEvent | MouseEvent;
    }): number;
}
