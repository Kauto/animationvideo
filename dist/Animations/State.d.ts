import { ISprite } from '../Sprites/Sprite';
import { IAnimation } from './Animation';
import { default as Sequence, TAnimationSequence } from './Sequence';

declare class State implements IAnimation {
    _states: Record<string, Sequence | State>;
    _transitions: Record<string, Sequence | State>;
    _currentStateName: string | undefined;
    _currentState: Sequence | State | undefined;
    _isTransitioningToStateName: string | undefined;
    constructor({ states, transitions, defaultState, }: {
        states?: Record<string, TAnimationSequence>;
        transitions?: Record<string, TAnimationSequence>;
        defaultState: string;
    });
    setState(name: string): void;
    play(label?: string, timelapsed?: number): boolean | undefined;
    run(sprite: ISprite, time: number, is_difference?: boolean): true | -1;
}
export default State;
