import { default as Transform } from '../func/transform';
import { AdditionalModifier, ConfigurationObject, ParameterListWithoutTime } from '../Scene';

export default class Norm implements ConfigurationObject {
    viewport({ engine }: ParameterListWithoutTime, matrix: Transform): Transform;
    additionalModifier({ engine, output, scene, }: ParameterListWithoutTime): AdditionalModifier;
}
