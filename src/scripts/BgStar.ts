//Import p5 types for type checking
import type p5 from 'p5';

//Class for drawing stars in the backgound (for looks only)
export class BgStar {
    public p5: p5;
    public x: number;
    public y: number;
    public size: number;
    public fillColor: number;

    constructor(p5: p5, x: number, y: number, size: number, fillColor: number) {
        //p5 instance passed from sketch
        this.p5 = p5;
        this.x = x;
        this.y = y;
        this.size = size;
        this.fillColor = fillColor;
    }

    display() {
        this.p5.fill(this.fillColor);
        this.p5.noStroke();
        this.p5.circle(this.x, this.y, this.size);
    }

}