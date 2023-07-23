//Import p5 types for type checking
import type p5 from 'p5';

//Class for drawing stars in the backgound (for looks only)
export class BgStar {
    public x: number;
    public y: number;
    public size: number;
    public fillColor: number;

    constructor(x: number, y: number, size: number, fillColor: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.fillColor = fillColor;
    }

    display(p5Instance: p5) {
        p5Instance.fill(this.fillColor);
        p5Instance.noStroke();
        p5Instance.circle(this.x, this.y, this.size);
    }

}