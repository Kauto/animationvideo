import calc from "../func/calc";
import { OrFunction } from "../helper";
import Emitter from "./Emitter";
import Text, { SpriteTextOptions } from "./Text";

export interface SpriteScollerOptions extends SpriteTextOptions {
  text: OrFunction<string | string[]>;
}

export default class Scroller extends Emitter<SpriteTextOptions> {
  constructor(givenParameters: SpriteScollerOptions) {
    const text = calc(givenParameters.text);
    const characterList = Array.isArray(text) ? text : [...text];
    super(
      Object.assign({}, givenParameters, {
        class: Text,
        count: characterList.length,
        text: (index: number) => characterList[index],
        enabled: (index: number) =>
          characterList[index] !== " " && calc(givenParameters.enabled),
      }),
    );
  }
}
