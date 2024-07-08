import Transform from "../func/transform";
import type {
  AdditionalModifier,
  ConfigurationObject,
  ParameterListWithoutTime,
} from "../Scene";

export default class Norm implements ConfigurationObject {
  viewport({ engine }: ParameterListWithoutTime, matrix: Transform) {
    const hw = engine.getWidth() / 2;
    const hh = engine.getHeight() / 2;
    const scale = engine.getRatio() > 1 ? hw : hh;
    return matrix.translate(hw, hh).scale(scale, scale);
  }

  additionalModifier({
    engine,
    output,
    scene,
  }: ParameterListWithoutTime): AdditionalModifier {
    scene.cacheClear();

    const [x1, y1] = scene.transformPoint(0, 0, 1);
    const [x2, y2] = scene.transformPoint(output.width, output.height, 1);

    const hw = engine.getWidth() / 2;
    const hh = engine.getHeight() / 2;
    const scale = engine.getRatio() > 1 ? hw : hh;
    const transformInvert = new Transform()
      .translate(hw, hh)
      .scale(scale, scale)
      .invert();
    const [sx1, sy1] = transformInvert.transformPoint(0, 0);
    const [sx2, sy2] = transformInvert.transformPoint(
      output.width,
      output.height,
    );

    return {
      alpha: 1,
      x: -1,
      y: -1,
      width: 2,
      height: 2,
      widthInPixel: output.width,
      heightInPixel: output.height,
      scaleCanvas: output.width / output.canvas[0].clientWidth,
      visibleScreen: {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1,
      },
      fullScreen: {
        x: sx1,
        y: sy1,
        width: sx2 - sx1,
        height: sy2 - sy1,
      },
    };
  }
}
