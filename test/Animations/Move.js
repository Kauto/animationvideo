import Move from '../../src/lib/Animations/Move';
import {describe, it, beforeEach} from "mocha";
import {expect} from 'chai';

describe('Animations/Move', function () {
    let move, sprite;

  beforeEach(() => {
    move = new Move(400, 500, 10);

    sprite = {
      x: 100,
      y: 100
    };
  });

  it('should move in a line at fixed speed', function() {
    move.run(sprite, 0);
    expect(sprite).to.be.deep.equal({
      x: 100,
      y: 100
    });
    move.run(sprite, 250);
    expect(sprite).to.be.deep.equal({
      x: 250,
      y: 300
    });
    move.run(sprite, 500);
    expect(sprite).to.be.deep.equal({
      x: 400,
      y: 500
    });
  });

  it('should move in 500ms', function() {
    let timeLeft = move.run(sprite, 500);
    expect(timeLeft).to.be.equal(0);
  });
});