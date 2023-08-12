//Import p5 classes
import p5 from 'p5';
import { SimulationVariables } from '../SimulationVariables';
import type { Body } from "./Body";


export class RK4Utils {
    //In this whole class, exertingBody refers to the body that exerts the force,
    //while appliedBody refers to the body that the force is applied to

    //Global variables to store the exertingBody and appliedBody
    public exertingBody: Body;
    public appliedBody: Body;

    //Constructor
    public constructor(exertingBody: Body, appliedBody: Body) {
        //Assign the exertingBody and appliedBody to global variables so that we can call them from all functions        
        this.exertingBody = exertingBody;
        this.appliedBody = appliedBody
    }

    //A function that uses RK4 to calculate the velocity and position of the body after gravitational force has been applied
    public RK4UpdateBodyAfterForce() {
        //RK4 code adapted from here: http://web.archive.org/web/20100807111842/http://gafferongames.wordpress.com/game-physics/integration-basics/
        //For more info, visit
        //https://matthiaswang.notion.site/CEP-WA3-Orbit-Simulator-Portfolio-8c97f163c6104dd5821dd76d57a3eb98#8c803ec607de450facb3efb9cb1eb035
        //under "T3W5 Monday"

        //Integrate velocity and position simultaneously using RK4
        //For ease of typing, the derivative of velocity will be referred to as "dv" and the derivative of position will be referred to as "dx"
        let k1_dx: p5.Vector = this.appliedBody.velocity;
        let k1_dv: p5.Vector = this.calculateGravitationalAcceleration(this.appliedBody.position);

        let k2_dx: p5.Vector = p5.Vector.add(this.appliedBody.velocity, p5.Vector.mult(k1_dv, 0.5));
        let k2_dv: p5.Vector = this.calculateGravitationalAcceleration(p5.Vector.add(this.appliedBody.position, p5.Vector.mult(k1_dx, 0.5)));

        let k3_dx: p5.Vector = p5.Vector.add(this.appliedBody.velocity, p5.Vector.mult(k2_dv, 0.5));
        let k3_dv: p5.Vector = this.calculateGravitationalAcceleration(p5.Vector.add(this.appliedBody.position, p5.Vector.mult(k2_dx, 0.5)));

        let k4_dx: p5.Vector = p5.Vector.add(this.appliedBody.velocity, p5.Vector.mult(k3_dv, 1));
        let k4_dv: p5.Vector = this.calculateGravitationalAcceleration(p5.Vector.add(this.appliedBody.position, p5.Vector.mult(k3_dx, 1)));

        //Create a new vector to store the calculated rk4 position and velocity
        let rk4Position = SimulationVariables.p5Instance.createVector(0, 0);
        rk4Position.add(k1_dx).add(k2_dx.mult(2)).add(k3_dx.mult(2)).add(k4_dx).mult(1 / 6);

        let rk4Velocity = SimulationVariables.p5Instance.createVector(0, 0);
        rk4Velocity.add(k1_dv).add(k2_dv.mult(2)).add(k3_dv.mult(2)).add(k4_dv).mult(1 / 6);

        //Assign rk4Position and rk4Velocity to the appliedBody
        this.appliedBody.rk4Position = rk4Position;
        this.appliedBody.rk4Velocity = rk4Velocity;

        //Push the applied force to the appliedBody's appliedForces array
        this.appliedBody.appliedForces.push(p5.Vector.mult(this.calculateGravitationalAcceleration(this.appliedBody.position), this.appliedBody.mass))
    }


    //A function that uses Newton's Gravitational Law to calculate the gravitational acceleration between 2 bodies
    //Only the applied body position is supplied as an argument to make things easier for RK4
    //Returns acceleration, not force.
    public calculateGravitationalAcceleration(appliedBodyPosition: p5.Vector) {
        // Calculate distance between bodies
        let distance = p5.Vector.sub(this.exertingBody.position, appliedBodyPosition).mag();

        // Calculate direction of force
        let force = p5.Vector.sub(this.exertingBody.position, appliedBodyPosition);

        // Normalize vector
        force.normalize();

        // Calculate gravitional force magnitude
        let strength =
            (SimulationVariables.GRAVITATIONAL_CONSTANT * this.exertingBody.mass * this.appliedBody.mass) /
            (distance * distance);

        // Get force vector --> magnitude * direction
        force.mult(strength);

        //Get the acceleration by dividing force by mass of applied body
        return p5.Vector.div(force, this.appliedBody.mass);
    }

}