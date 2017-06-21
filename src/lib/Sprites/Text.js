import ifNull from '../../func/ifnull';
import calc from '../../func/calc';
import Circle from './Circle';

const degToRad = 0.017453292519943295; //Math.PI / 180;

export default class Text extends Circle {
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
        this.position = ifNull(calc(params.position), Text.CENTER);

        this.color = calc(params.color);
        this.borderColor = calc(params.borderColor);
        this.lineWidth = ifNull(calc(params.lineWidth), 1);
    }

    // draw-methode
    draw(context, additionalModifier) {
        if (this.enabled) {
            let a = this.a;
            if (additionalModifier) {
                a *= additionalModifier.a;
            }
            context.globalCompositeOperation = this.alphaMode;
            context.globalAlpha = a;
            context.save();
            if (Text.LEFT_TOP) {
                context.textAlign = 'left';
                context.textBaseline = 'top';
            }
            context.translate(this.x, this.y);
            context.scale(this.scaleX, this.scaleY);
            context.rotate(this.arc * degToRad);
            context.font = this.font;

            if (this.color) {
                context.fillStyle = this.color;
                context.fillText(this.text, 0, 0);
            }

            if (this.borderColor) {
                context.strokeStyle = this.borderColor;
                context.lineWidth = this.lineWidth;
                context.strokeText(this.text, 0, 0);
            }

            context.restore();
        }
    };
}