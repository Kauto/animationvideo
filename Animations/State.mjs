import Sequence from './Sequence.mjs';

class State {
  constructor({
    states = {},
    transitions = {},
    default: defaultState = undefined,
    delegateTo = undefined
  } = {}) {
    // save possible states
    this.states = states;
    Object.keys(this.states).forEach(i => {
      if (Array.isArray(this.states[i])) {
        this.states[i] = new Sequence(this.states[i])
      }
    });
    // save transitions
    this.transitions = transitions;
    // save delegateTo
    this.delegateTo = delegateTo;
    // set start state
    this.currentStateName = defaultState;
    this.currentState = this.states[defaultState];
    this.isTransitioningToStateName = undefined;
  }

  setState(name, options) {
    if (name !== this.currentStateName) {
      this.isTransitioningToStateName = name;
      const UCFirstName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
      const possibleTransitionNames = [
        `${this.currentStateName}To${UCFirstName}`,
        `${this.currentStateName}To`,
        `to${UCFirstName}`
      ];
      const transitionName = possibleTransitionNames.find(
        name => this.transitions[name]
      );
      if (transitionName) {
        this.currentStateName = this.isTransitioningToStateName;
        this.currentState = this.transitions[transitionName];
        this.currentState && this.currentState.reset && this.currentState.reset();
      } else {
        this.currentStateName = this.isTransitioningToStateName;
        this.currentState = this.states[this.currentStateName];
        this.currentState && this.currentState.reset && this.currentState.reset();
        this.isTransitioningToStateName = undefined;
      }
    }
    // search through transitions
    // delegateTo - search through list
  }

  play(label = "", timelapsed = 0) {
    this.currentState.play && this.currentState.play(label, timelapsed);
  }

  run(sprite, time, is_difference) {
    let timeLeft = time;
    let isDifference = is_difference;
    if (this.currentState) {
      timeLeft = this.currentState.run(sprite, timeLeft, isDifference);
      if (timeLeft === true) {
        return true
      }
      isDifference = true;
    }
    if (timeLeft >= 0 || !this.currentState) {
      if (this.isTransitioningToStateName) {
        this.currentStateName = this.isTransitioningToStateName;
        this.currentState = this.states[this.currentStateName];
        this.currentState && this.currentState.reset && this.currentState.reset();
        this.isTransitioningToStateName = undefined;
        timeLeft = this.currentState.run(sprite, timeLeft, isDifference);
        if (timeLeft === true) {
          return true
        }
      } else {
        this.currentState = undefined;
      }
    }
    return -1;
  }
}

export default State;
