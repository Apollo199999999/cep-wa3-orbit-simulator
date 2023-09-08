import type { Body } from "./p5.js/Body";
import type p5 from 'p5';
import type GraphWindow from "../ui/components/GraphWindow.svelte";

export class SimulationVariables {
    //This file stores all simulation variables, such as whether the simulation is running, and other properties
    //This file will mainly be used to interface between the main sketch.js and the control panel UI

    //Variable for gravitational constant to calculate the gravitational force between two bodies
    //Why 5? Trial and error told me this is a good number to use
    public static readonly GRAVITATIONAL_CONSTANT: number = 5;

    //Control panel width
    public static readonly CONTROL_PANEL_WIDTH: number = 272;

    //Variable to store the p5 Instance from the sketch
    public static p5Instance: p5;

    //Variable to store how much the canvas is zoomed in/out
    public static canvasZoom: number = 1.0;

    //Variables to store the mouseX and mouseY, relative to (0,0) of canvas and AFFECTED BY TRANSLATE AND SCALE (unlike p5 mouseX and mouseY)
    public static mouseX: number;
    public static mouseY: number;

    //Variables to store how much the canvas was translated by when zooming
    public static canvasTranslationX: number;
    public static canvasTranslationY: number;

    //Array to store the bodies currently running in the simulation
    public static bodies: Array<Body> = [];

    //Array to save the initial state of the movers, used to reset the simulation
    public static savedBodies: Array<Body> = [];

    //Variable to store whether the simulation is currently running, used for playing/pausing the simulation
    public static simulationRunning: boolean = false;

    //Variable to store the timestep used for rk4 computation
    public static rk4Timestep: number = 0.005;

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
    public static disableP5Dragging: boolean = false;

    //Variable to store the currently open instance of GraphWindow
    public static openedGraphWindow: GraphWindow | undefined;

}
