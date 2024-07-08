import { ParameterListPositionEvent } from '../Scene.js';
import { default as CameraControl } from './CameraControl.js';

export default class CameraControlSecondButton extends CameraControl {
    mouseUp({ event: e, position: [mx, my], button: i, scene, }: ParameterListPositionEvent): void;
    mouseMove(props: ParameterListPositionEvent): void;
}
