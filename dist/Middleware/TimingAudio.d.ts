import { ConfigurationObject, ParameterList, ParameterListInitDestroy } from '../Scene';
import { default as TimingDefault, MiddlewareTimingDefaultOptions } from './TimingDefault';

export interface MiddlewareTimingAudioOptions extends MiddlewareTimingDefaultOptions {
    audioElement: HTMLMediaElement;
}
export default class TimingAudio extends TimingDefault implements ConfigurationObject {
    _maxSkippedTickChunk: number;
    _audioStartTime: number | undefined;
    _audioPosition: number | undefined;
    _enableAndroidHack: boolean;
    _audioElement: undefined | (HTMLMediaElement & {
        controller?: Record<string, unknown>;
    });
    constructor(configuration: MiddlewareTimingAudioOptions);
    get audioElement(): (HTMLMediaElement & {
        controller?: Record<string, unknown>;
    }) | undefined;
    init(_params: ParameterListInitDestroy): Promise<unknown> | undefined;
    endTime(): number;
    currentTime(): number;
    clampTime({ timePassed }: ParameterList): number;
    shiftTime(): number;
}
