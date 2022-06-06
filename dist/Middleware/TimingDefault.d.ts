import type { OrFunction } from "../helper";
import type { ConfigurationObject, ParameterList, ParameterListWithoutTime } from "../Scene";
export interface MiddlewareTimingDefaultOptions {
    tickChunk?: OrFunction<number>;
    maxSkippedTickChunk?: OrFunction<number | undefined>;
    tickChunkTolerance?: OrFunction<number | undefined>;
}
export default class TimingDefault implements ConfigurationObject {
    _configuration: MiddlewareTimingDefaultOptions;
    _tickChunk: number;
    _maxSkippedTickChunk: number;
    _tickChunkTolerance: number;
    type: string;
    totalTimePassed: number;
    constructor(configuration?: MiddlewareTimingDefaultOptions);
    init(_params: ParameterListWithoutTime): void;
    currentTime(): number;
    clampTime({ timePassed }: ParameterList): number;
    shiftTime({ timePassed }: ParameterList): number;
    get tickChunk(): number;
    isChunked(): boolean;
    hasOneChunkedFrame({ timePassed }: ParameterList): boolean;
    calcFrames({ timePassed }: ParameterList): number;
}
