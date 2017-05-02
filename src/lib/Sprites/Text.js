import ifNull from '../../func/ifnull';
import calc from '../../func/calc';
import Circle from './Circle';

const degToRad = 0.017453292519943295; //Math.PI / 180;

export default class Letter extends Circle {
    // const
    static LEFT_TOP = 0;
    static CENTER = 1;

    constructor(params) {
        super(params);
        // Sprite
        this.text = calc(params.text);
        // font
        this.font = ifNull(calc(params.font), '26px monospace');
        // position
        this.position = ifNull(calc(params.position), Letter.CENTER);
    }

    // draw-methode
    draw(context, additionalModifier) {
        if (this.enabled) {
            let a = this.a,
                size = -this.size >> 1;
            if (additionalModifier) {
                a *= additionalModifier.a;
            }
            context.globalCompositeOperation = this.alphaMode;
            context.globalAlpha = a;
            context.save();
            if (Letter.LEFT_TOP) {
                context.textAlign = 'left';
                context.textBaseline = 'top';
            }
            context.translate(this.x, this.y);
            context.scale(this.scaleX, this.scaleY);
            context.rotate(this.arc * degToRad);
            context.font = this.font;
            context.fillStyle = this.color;
            context.fillText(this.text, 0, 0);
            context.restore();
        }
    };
}