import type { ISprite } from "../Sprites/Sprite";
import { SequenceRunCommand } from "./Sequence";
export interface IAnimation {
    run: (sprite: ISprite, time: number, is_difference?: boolean) => number | boolean | SequenceRunCommand;
    reset?: (timelapsed?: number) => void;
    play?: (label: string, timelapsed: number) => void | boolean;
}
