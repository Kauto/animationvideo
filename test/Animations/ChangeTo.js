import ChangeTo from '../../src/lib/Animations/ChangeTo';
import {describe, it, beforeEach} from "mocha";
import {expect} from 'chai';

describe('Animations/ChangeTo', function () {
  let changeTo, sprite;

  beforeEach(() => {
    changeTo = new ChangeTo({
      x: 100,
      y: function (t) {
        return t * 150;
      },
      color: '#F00',
      bezier: [300, 100, 200]
    }, 100);
    sprite = {
      x: 50,
      y: 100,
      color: '#FFF',
      bezier: 0
    };
  });

  it('should create a instance with bezier, function, color and value', function create_test() {
    expect(changeTo.changeValues).to.have.lengthOf(4);
  });

  it('should end with target coordinates and return overtime', function test_end_position() {
    let timeLeft = changeTo.run(sprite, 101);

    expect(sprite.x).to.equal(100);
    expect(sprite.y).to.equal(150);
    expect(sprite.color).to.equal('#F00');
    expect(sprite.bezier).to.equal(200);
    expect(timeLeft).to.equal(1);
  });

  it('should change a color', function test_end_position() {
    changeTo.run(sprite, 0);
    expect(sprite.color).to.equal("rgb(255, 0, 0)");
    changeTo.run(sprite, 25);
    expect(sprite.color).to.equal("rgb(255, 64, 64)");
    changeTo.run(sprite, 50);
    expect(sprite.color).to.equal("rgb(255, 128, 128)");
    changeTo.run(sprite, 75);
    expect(sprite.color).to.equal("rgb(255, 191, 191)");
    changeTo.run(sprite, 100);
    expect(sprite.color).to.equal("rgb(255, 255, 255)");
  });

  it('should follow a value change', function test_change_position() {
    changeTo.run(sprite, 0);
    expect(sprite.x).to.equal(50);
    changeTo.run(sprite, 20);
    expect(sprite.x).to.equal(60);
    changeTo.run(sprite, 50);
    expect(sprite.x).to.equal(75);
    changeTo.run(sprite, 80);
    expect(sprite.x).to.equal(90);
    changeTo.run(sprite, 100);
    expect(sprite.x).to.equal(100);
  });

  it('should follow a function', function test_change_position() {
    changeTo.run(sprite, 0);
    expect(sprite.y).to.equal(0);
    changeTo.run(sprite, 50);
    expect(sprite.y).to.equal(75);
    changeTo.run(sprite, 100);
    expect(sprite.y).to.equal(150);
  });

  it('should follow a bezier curve', function test_change_position() {
    changeTo.run(sprite, 0);
    expect(sprite.bezier).to.equal(0);
    changeTo.run(sprite, 25);
    expect(sprite.bezier).to.equal(143.75);
    changeTo.run(sprite, 50);
    expect(sprite.bezier).to.equal(175);
    changeTo.run(sprite, 75);
    expect(sprite.bezier).to.equal(168.75);
    changeTo.run(sprite, 100);
    expect(sprite.bezier).to.equal(200);
  });
});