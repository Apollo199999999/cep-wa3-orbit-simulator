import type { Sketch } from "p5-svelte";
import { SimulationVariables } from "../SimulationVariables";
import { BgStar } from "./BgStar"
import { Body } from "./Body"
import { cloneDeep } from "lodash"
import { RK4Utils } from "./RK4Utils";

//You might be wondering why I don't have to initialise the UI class to attach event handlers or something
//Well, all the methods for the event handlers are static, so they can be referenced from HTML easily!
//So, no need for initialisation

//Array to store stars that will be drawn in the background
let bgStars: Array<BgStar> = [];

export const p5Sketch: Sketch = (p5) => {
    p5.setup = () => {
        //Create canvas, leaving space for the control panels on the left and right
        p5.createCanvas(p5.windowWidth - 2 * SimulationVariables.CONTROL_PANEL_WIDTH, p5.windowHeight);

        //Store the p5 instance in simulation variables
        SimulationVariables.p5Instance = p5;

        //Populate bgStars array
        for (let i = 0; i < 100; i++) {
            bgStars.push(
                new BgStar(p5.random(p5.width), p5.random(p5.height), p5.random(1, 5), p5.random(50, 255))
            );
        }

        //Initialise 2 bodies at the start of the simulation
        //First body should be spawned at the center, with a yellow color
        SimulationVariables.bodies.push(new Body(300, p5.width / 2, p5.height / 2, -0.455, 0, [255, 255, 52]));
        //Second body is to be spawned in a stable orbit, with random color
        SimulationVariables.bodies.push(
            new Body(50, p5.width / 2, p5.height / 2 - 200, 2.73, 0, [
                p5.random(25, 255),
                p5.random(25, 255),
                p5.random(25, 255),
            ])
        );


        //Save the SimulationVariables.bodies array, in case of reset
        SimulationVariables.savedBodies = cloneDeep(SimulationVariables.bodies);

        //Call the updateBodies() function once, which uses setTimeout to update in the background
        updateBodies();
    };

    p5.draw = () => {
        //Store the p5 instance in simulation variables
        SimulationVariables.p5Instance = p5;

        //Configure background
        p5.background(20);
        drawBackgroundStars();

        p5.push();

        //Zoom the canvas
        zoomCanvas(SimulationVariables.canvasZoom);

        //Bodies are updated in a separate function updateBodies() that is controlled by settimeout()
        //Display bodies
        displayBodies();

        p5.pop();

        //Update any open graph windows
        if (SimulationVariables.openedGraphWindow != undefined
            && SimulationVariables.openedGraphWindow.checkLoaded() == true
            && SimulationVariables.simulationRunning == true) {
            SimulationVariables.openedGraphWindow.updateGraph();
        }
    };


    //Function to calculate force between bodies and update the bodies
    function updateBodies() {
        //Controls how often updateBodies() is called, to determine how fast the simulation runs
        setTimeout(updateBodies, 1000 / (60 * SimulationVariables.simulationSpeed));

        //Run this whole chunk of rk4 updating multiple times to account for our rk4 timestep
        for (let i = 0; i < 1 / SimulationVariables.rk4Timestep; i++) {
            //First, clear the appliedforces array for every body
            for (let k = 0; k < SimulationVariables.bodies.length; k++) {
                SimulationVariables.bodies[k].appliedForces = [];
            }

            //Calculate force between each body and apply the force
            //Iterate backwards, since there is a possibility that we are removing bodies
            for (let i = SimulationVariables.bodies.length - 1; i >= 0; i--) {
                for (let j = SimulationVariables.bodies.length - 1; j >= 0; j--) {
                    //Add a undefined check as well to make sure the 2 bodies being checked aren't undefined after a possible collision
                    if (i !== j && SimulationVariables.bodies[i] != undefined && SimulationVariables.bodies[j] != undefined) {
                        //Calculate and apply gravitational force between the 2 bodies using RK4
                        let rk4: RK4Utils = new RK4Utils(SimulationVariables.bodies[i], SimulationVariables.bodies[j]);
                        rk4.RK4UpdateBodyAfterForce();

                        //Check if the 2 bodies have collided
                        SimulationVariables.bodies[i].checkCollision(SimulationVariables.bodies[j]);
                    }
                }
            }

            for (let i = 0; i < SimulationVariables.bodies.length; i++) {
                //Update body with applied force
                SimulationVariables.bodies[i].updateBody(SimulationVariables.simulationRunning);
            }
        }

        //Place this outside the rk4 loop so it only gets called once
        for (let i = 0; i < SimulationVariables.bodies.length; i++) {
            //Update object trails
            SimulationVariables.bodies[i].updateTrails();

            //Update graphs for each body
            if (SimulationVariables.simulationRunning == true) {
                //Update body with applied force
                SimulationVariables.bodies[i].updateGraphs();
            }
        }


    }

    //Function to display the bodies
    function displayBodies() {
        //Display the bodies
        for (let i = 0; i < SimulationVariables.bodies.length; i++) {
            SimulationVariables.bodies[i].display();
        }
    }

    function zoomCanvas(scale: number) {
        //Translate the canvas
        let remainingWidth: number = p5.windowWidth - 2 * SimulationVariables.CONTROL_PANEL_WIDTH - p5.width * scale;
        let remainingHeight: number = p5.windowHeight - p5.height * scale;
        p5.translate(remainingWidth / 2, remainingHeight / 2);

        //Save the translations to SimulationVariables
        SimulationVariables.canvasTranslationX = remainingWidth / 2;
        SimulationVariables.canvasTranslationY = remainingHeight / 2;

        //Apply scaling on the canvas
        p5.scale(scale);

        //Apply these transformations to mouseX and mouseY as well
        SimulationVariables.mouseX = (p5.mouseX - remainingWidth / 2) / scale;
        SimulationVariables.mouseY = (p5.mouseY - remainingHeight / 2) / scale;
    }

    //Function to draw stars in the background
    function drawBackgroundStars() {
        for (let i = 0; i < bgStars.length; i++) {
            bgStars[i].display();
        }
    }
    //Functions to control the dragging of bodies using the mouse
    p5.mouseDragged = () => {
        //To avoid dragging if mouse is over control panel, or if a dialog is currently open
        //We use p5 mouseX and mouseY instead of SimulationVariables mouseX and mouseY as we do not want the mouseX and mouseY to be affected
        //by translate() and scale() in this case.
        if (p5.mouseX < p5.width && p5.mouseX > 0 && p5.mouseY > 0 && p5.mouseY < p5.height && SimulationVariables.disableP5Dragging == false) {
            for (let i = 0; i < SimulationVariables.bodies.length; i++) {
                if (
                    SimulationVariables.bodies[i].startDraggingVelocityVector() == true ||
                    SimulationVariables.bodies[i].startDraggingBody() == true
                ) {
                    //User is in the process of dragging a body/velocity vector, so there's no need to check the other bodies anymore.
                    break;
                }
            }
        }
    }

    p5.mouseReleased = () => {
        for (let i = 0; i < SimulationVariables.bodies.length; i++) {
            //Stop dragging
            SimulationVariables.bodies[i].stopDragging();
        }
    }
}