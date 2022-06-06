import { ISprite } from '../Sprites/Sprite';
import type { IAnimation } from './Animation';
import Sequence from './Sequence';

class State implements IAnimation {
  _states: Record<string, Sequence | State>
  _transitions: Record<string, Sequence | State>
  _currentStateName: string | undefined
  _currentState: Sequence | State | undefined
  _isTransitioningToStateName: string | undefined = undefined

  constructor({
    states = {},
    transitions = {},
    defaultState
  }: {
    states?: Record<string, IAnimation[] | Sequence>
    transitions?: Record<string, IAnimation[] | Sequence>
    defaultState: string
  }) {
    // save possible states
    this._states = Object.fromEntries(Object.entries(states).map(
      ([key, value]) => ([key, Array.isArray(value) ? new Sequence(value) : value])
    ))

    // save transitions
    this._transitions = Object.fromEntries(Object.entries(transitions).map(
      ([key, value]) => ([key, Array.isArray(value) ? new Sequence(value) : value])
    ));
    // set start state
    this._currentStateName = defaultState;
    this._currentState = this._states[defaultState];
  }

  setState(name:string) {
    if (name !== this._currentStateName) {
      this._isTransitioningToStateName = name;
      const UCFirstName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
      const possibleTransitionNames = [
        `${this._currentStateName}To${UCFirstName}`,
        `${this._currentStateName}To`,
        `to${UCFirstName}`
      ];
      const transitionName = possibleTransitionNames.find(
        name => name in this._transitions
      );
      if (transitionName) {
        this._currentStateName = this._isTransitioningToStateName;
        this._currentState = this._transitions[transitionName];
        (this._currentState as Sequence)?.reset?.();
      } else {
        this._currentStateName = this._isTransitioningToStateName;
        this._currentState = this._states[this._currentStateName];
        (this._currentState as Sequence)?.reset?.();
        this._isTransitioningToStateName = undefined;
      }
    }
    // search through transitions
    // delegateTo - search through list
  }

  play(label = "", timelapsed = 0):boolean|undefined {
    return this._currentState?.play?.(label, timelapsed);
  }

  run(sprite: ISprite, time: number, is_difference?: boolean) {
    let timeLeft:ReturnType<IAnimation['run']> = time;
    let isDifference = is_difference;
    if (this._currentState) {
      timeLeft = this._currentState.run(sprite, timeLeft, isDifference);
      if (timeLeft === true) {
        return true
      }
      isDifference = true;
    }
    if (timeLeft >= 0 || !this._currentState) {
      if (this._isTransitioningToStateName) {
        this._currentStateName = this._isTransitioningToStateName;
        this._currentState = this._states[this._currentStateName];
        (this._currentState as Sequence)?.reset?.();
        this._isTransitioningToStateName = undefined;
        timeLeft = this._currentState.run(sprite, timeLeft, isDifference);
        if (timeLeft === true) {
          return true
        }
      } else {
        this._currentState = undefined;
      }
    }
    return -1;
  }
}

export default State;
