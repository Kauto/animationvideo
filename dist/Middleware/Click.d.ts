import { ConfigurationObject, ParameterListPositionEvent } from '../Scene';
import { MiddlewareElementOptions } from './Element';

export default class Click implements ConfigurationObject {
    _doubleClickElementTimer: undefined | number;
    _doubleClickDetectInterval: number;
    constructor({ doubleClickDetectInterval, }?: MiddlewareElementOptions);
    mouseUp(param: ParameterListPositionEvent): void;
}
