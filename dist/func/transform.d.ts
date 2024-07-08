export default class Transform {
    m: [number, number, number, number, number, number];
    __constuct(): void;
    reset(): this;
    multiply(matrix: Transform): this;
    invert(): this;
    rotate(rad: number): this;
    translate(x: number, y: number): this;
    scale(sx: number, sy: number): this;
    transformPoint(px: number, py: number): [number, number];
    clone(): Transform;
}
