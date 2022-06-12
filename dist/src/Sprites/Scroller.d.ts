import { OrFunction } from "../helper";
import Emitter from "./Emitter";
import { SpriteTextOptions } from "./Text";
export interface SpriteScollerOptions extends SpriteTextOptions {
    text: OrFunction<string | string[]>;
}
export default class Scroller extends Emitter<SpriteTextOptions> {
    constructor(givenParameters: SpriteScollerOptions);
}
