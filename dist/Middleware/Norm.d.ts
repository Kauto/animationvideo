import Transform from '../func/transform';
import type { AdditionalModifier, ConfigurationObject, ParameterListWithoutTime } from '../Scene';
export default class Norm implements ConfigurationObject {
    viewport({ engine }: ParameterListWithoutTime, matrix: Transform): Transform;
    additionalModifier({ engine, output, scene }: ParameterListWithoutTime): AdditionalModifier;
}
