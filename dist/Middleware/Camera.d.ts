import { default as Transform } from '../func/transform';
import { AdditionalModifier, ConfigurationObject, ParameterListWithoutTime, RectPosition } from '../Scene';

export interface CameraPosition {
    zoom: number;
    x: number;
    y: number;
}
export default class Camera implements ConfigurationObject {
    type: string;
    cam: CameraPosition;
    constructor(config?: Partial<CameraPosition>);
    viewport(_: ParameterListWithoutTime, matrix: Transform): Transform;
    viewportByCam({ engine }: ParameterListWithoutTime, cam: CameraPosition): Transform;
    additionalModifier(_: ParameterListWithoutTime, additionalModifier: AdditionalModifier): AdditionalModifier;
    clampView(params: ParameterListWithoutTime & {
        clampLimits?: RectPosition;
    }, cam: CameraPosition): CameraPosition;
    set zoom(value: number);
    set camX(v: number);
    set camY(v: number);
    get zoom(): number;
    get camX(): number;
    get camY(): number;
    zoomToFullScreen({ scene }: ParameterListWithoutTime): number;
    zoomTo(params: ParameterListWithoutTime & RectPosition & {
        cam?: CameraPosition;
    }): void;
}
