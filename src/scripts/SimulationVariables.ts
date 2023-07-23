import type { Body } from "./p5.js/Body";

export class SimulationVariables {
    //This file stores all simulation variables, such as whether the simulation is running, and other properties
    //This file will mainly be used to interface between the main sketch.js and the control panel UI

    //Variable for gravitational constant to calculate the gravitational force between two bodies
    //Why 5? Trial and error told me this is a good number to use
    public static readonly GRAVITATIONAL_CONSTANT: number = 5;

    //Control panel width
    public static readonly CONTROL_PANEL_WIDTH: number = 272;

    //Array to store the bodies currently running in the simulation
    public static bodies: Array<Body> = [];

    //Array to save the initial state of the movers, used to reset the simulation
    public static savedBodies: Array<Body> = [];

    //Variable to store whether the simulation is currently running, used for playing/pausing the simulation
    public static simulationRunning: boolean = false;

    //Variable to store the simulation speed
    public static simulationSpeed: number = 1.0;

    //Variable to determine whether to show gravity force
    public static showGravityForce: boolean = true;

    //Variable to determine whether to show velocity vectors
    public static showVelocityVectors: boolean = true

    //Variable to determine whether to draw the path of the bodies
    public static showPath: boolean = true;

    //Variable to determine how magnified the vectors are
    public static vectorMagnification: number = 32;

    //Variable to store if a modal dialog is open, so that we can prevent interaction with the simulation if so
    public static modalDialogOpen: boolean = false;
}
