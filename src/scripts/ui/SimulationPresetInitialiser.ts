import { SimulationVariables } from "../SimulationVariables";
import { Body } from "../p5.js/Body";

export class SimulationPresetInitialiser {
    public constructor() {
        //Clear the SimulationVariables bodies array
        SimulationVariables.bodies = [];
    }

    public initSunPlanet() {
        //Sun
        SimulationVariables.bodies.push(
            new Body(300, SimulationVariables.p5Instance.width / 2, SimulationVariables.p5Instance.height / 2, -0.455, 0, [255, 255, 52])
        );

        //Planet
        SimulationVariables.bodies.push(
            new Body(50, SimulationVariables.p5Instance.width / 2, SimulationVariables.p5Instance.height / 2 - 200, 2.73, 0, [
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
            ])
        );
    }

    public initSunPlanetMoon() {
        //Sun
        SimulationVariables.bodies.push(
            new Body(300, SimulationVariables.p5Instance.width / 2, SimulationVariables.p5Instance.height / 2, -0.35, 0, [255, 255, 52])
        );

        //Planet
        SimulationVariables.bodies.push(
            new Body(50, SimulationVariables.p5Instance.width / 2, SimulationVariables.p5Instance.height / 2 - 200, 2.10, 0, [
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
            ])
        );

        //Moon
        SimulationVariables.bodies.push(
            new Body(5, SimulationVariables.p5Instance.width / 2, SimulationVariables.p5Instance.height / 2 - 175, -0.20, 0, [
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
            ])
        );
    }

    public initSunPlanetPlanet() {
        //Sun
        SimulationVariables.bodies.push(
            new Body(300, SimulationVariables.p5Instance.width / 2, SimulationVariables.p5Instance.height / 2, -0.575, 0, [255, 255, 52])
        );

        //Planet
        SimulationVariables.bodies.push(
            new Body(50, SimulationVariables.p5Instance.width / 2, SimulationVariables.p5Instance.height / 2 - 90, 2.80, 0, [
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
            ])
        );

        //Planet
        SimulationVariables.bodies.push(
            new Body(17, SimulationVariables.p5Instance.width / 2, SimulationVariables.p5Instance.height / 2 - 280, 1.90, 0, [
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
            ])
        );
    }

    public initGravityAssist() {
        //Sun
        SimulationVariables.bodies.push(
            new Body(300, SimulationVariables.p5Instance.width / 2, SimulationVariables.p5Instance.height / 2, 0, 0, [255, 255, 52])
        );

        //Assisted Body
        SimulationVariables.bodies.push(
            new Body(50, SimulationVariables.p5Instance.width / 2 - 350, SimulationVariables.p5Instance.height / 2 + 130, 2.0, 0, [
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
            ])
        );

        //Assisted Body
        SimulationVariables.bodies.push(
            new Body(50, SimulationVariables.p5Instance.width / 2 - 330, SimulationVariables.p5Instance.height / 2 + 200, 4.0, 0, [
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
            ])
        );
    }

    public initBinaryStar() {
        //Star
        SimulationVariables.bodies.push(
            new Body(300, SimulationVariables.p5Instance.width / 2, SimulationVariables.p5Instance.height / 2 - 100, 2.0, 0, [255, 255, 52])
        );

        //Star
        SimulationVariables.bodies.push(
            new Body(300, SimulationVariables.p5Instance.width / 2, SimulationVariables.p5Instance.height / 2 + 100, -2.0, 0, [
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
                SimulationVariables.p5Instance.random(25, 255),
            ])
        );
    }
}