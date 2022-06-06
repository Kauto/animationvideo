import { ParameterListPositionEvent } from "../Scene.js";
import CameraControl from "./CameraControl.js";
export default class CameraControlSecondButton extends CameraControl {
    mouseUp({ event: e, position: [mx, my], button: i, scene }: ParameterListPositionEvent): void;
    mouseMove({ event: e, position: [mx, my], button: i, scene }: ParameterListPositionEvent): void;
}
