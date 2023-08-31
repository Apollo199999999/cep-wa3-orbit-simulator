import { SimulationVariables } from '../SimulationVariables';

//Class for drawing stars in the backgound (for looks only)
export class BgStar {
    public x: number;
    public y: number;
    public size: number;
    public fillColor: number;

    public constructor(x: number, y: number, size: number, fillColor: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.fillColor = fillColor;
    }

    public display() {
        SimulationVariables.p5Instance.fill(this.fillColor);
        SimulationVariables.p5Instance.noStroke();
        SimulationVariables.p5Instance.circle(this.x, this.y, this.size);
    }

}