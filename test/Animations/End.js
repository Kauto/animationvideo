import End from '../../src/lib/Animations/End';
import Animation from '../../src/lib/Sequence';
import {describe, it, beforeEach} from "mocha";
import {expect} from 'chai';

describe('Animations/End', function () {
  it('should return an end-code', function () {
    expect((new End()).run({}, 0)).to.equal(Animation._TIMELAPSE_TO_FORCE_DISABLE);
  });
});