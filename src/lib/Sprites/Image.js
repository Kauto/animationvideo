import ifNull from '../../func/ifnull';
import calc from '../../func/calc';
import ImageManager from '../ImageManager';
import Circle from './Circle';

const degToRad = 0.017453292519943295; //Math.PI / 180;

// Sprite
// Draw a Image
export default class Image extends Circle {
    // const
    static LEFT_TOP = 0;
    static CENTER = 1;

    constructor(params) {
        super(params);
        // Image
        this.image = ImageManager.getImage(calc(params.image));
        // relativ position
        this.position = ifNull(calc(params.position), Image.CENTER);
    }

    // Draw-Funktion
    draw(context, additionalModifier) {
        if (this.enabled) {
            let a = this.a,
                sX = this.image.width * this.scaleX,
                sY = this.image.height * this.scaleY;
            if (additionalModifier) {
                a *= additionalModifier.a;
            }
            context.globalCompositeOperation = this.alphaMode;
            context.globalAlpha = a;
            if (this.arc == 0) {
                if (this.position === Image.LEFT_TOP) {
                    context.drawImage(
                        this.image,
                        this.x,
                        this.y,
                        sX,
                        sY
                    );
                }
                else {
                    context.drawImage(
                        this.image,
                        this.x - sX / 2,
                        this.y - sY / 2,
                        sX,
                        sY
                    );
                }
            }
            else {
                context.save();
                context.translate(this.x, this.y);
                context.rotate(this.arc * degToRad);
                context.drawImage(
                    this.image,
                    -(sX >> 1),
                    -(sY >> 1),
                    sX,
                    sY
                );
                context.restore();

            }
        }
    };
}