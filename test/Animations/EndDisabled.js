import EndDisabled from '../../src/lib/Animations/EndDisabled';
import Animation from '../../src/lib/Sequence';
import {describe, it, beforeEach} from "mocha";
import {expect} from 'chai';

describe('Animations/EndDisabled', function () {
  it('should return an end-code', function () {
    expect((new EndDisabled()).run({}, 0)).to.equal(Animation.TIMELAPSE_TO_FORCE_DISABLE);
  });

  it('should disable the sprite', function () {
    let sprite = {
      enabled: true
    };

    // run animation
    (new EndDisabled()).run(sprite, 0);

    // sprite should now be disabled
    expect(sprite.enabled).to.be.false;
  });
});