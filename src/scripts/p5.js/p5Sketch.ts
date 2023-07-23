import type { Sketch } from "p5-svelte";
import { SimulationVariables } from "../SimulationVariables";
import { BgStar } from "./BgStar"
import { Body } from "./Body"
import { cloneDeep } from "lodash"

//You might be wondering why I don't have to initialise the UI class to attach event handlers or something
//Well, all the methods for the event handlers are static, so they can be referenced from HTML easily!
//So, no need for initialisation

//Array to store stars that will be drawn in the background
let bgStars: Array<BgStar> = [];

export const p5Sketch: Sketch = (p5) => {
    p5.setup = () => {
        //Create canvas, leaving space for the control panels on the left and right
        p5.createCanvas(p5.windowWidth - 2 * SimulationVariables.CONTROL_PANEL_WIDTH, p5.windowHeight);

        //Manually control the frame rate of the draw function, so we don't use p5.js automatic loop
        p5.noLoop();

        //Populate bgStars array
        for (let i = 0; i < 100; i++) {
            bgStars.push(
                new BgStar(p5.random(p5.width), p5.random(p5.height), p5.random(1, 5), p5.random(255))
            );
        }

        //Initialise 2 bodies at the start of the simulation
        //First body should be spawned at the center, with a yellow color
        SimulationVariables.bodies.push(new Body(p5, 300, p5.width / 2, p5.height / 2, -0.5, 0, [255, 255, 52]));
        //Second body is to be spawned in a stable orbit, with random color
        SimulationVariables.bodies.push(
            new Body(p5, 50, p5.width / 2, p5.height / 2 - 150, 3.0, 0, [
                p5.random(25, 255),
                p5.random(25, 255),
                p5.random(25, 255),
            ])
        );


        //Save the SimulationVariables.bodies array, in case of reset
        SimulationVariables.savedBodies = cloneDeep(SimulationVariables.bodies);
    };
    p5.draw = () => {
        //Controls how often draw is called, to determine how fast the simulation runs
        setTimeout(p5.draw, 1000 / (60 * SimulationVariables.simulationSpeed));

        //Configure background
        p5.background(20);
        drawBackgroundStars();

        //Always update the bodies, but the bodies should not apply forces if the simulation is paused
        updateBodies(SimulationVariables.simulationRunning);

        displayBodies();
    };

    //Function to draw stars in the background
    function drawBackgroundStars() {
        for (let i = 0; i < bgStars.length; i++) {
            bgStars[i].display(p5);
        }
    }

    //Function to calculate force between bodies and update the bodies
    function updateBodies(updatePosition: boolean) {
        //This function consists of 3 for loops
        //1st for loop => apply forces between bodies and check for collisions
        //2nd for loop => update the position and velocity of the bodies (if applicable), and check if bodies are offscreen
        //3rd for loop => shift the position of the bodies all of them are offscreen

        //Calculate force between each body and apply the force
        //Iterate backwards, since there is a possibility that we are removing bodies
        for (let i = SimulationVariables.bodies.length - 1; i >= 0; i--) {
            //Clear the applied force array of before applying new forces
            //Also clear the forces in case there is only one object left after a collision
            SimulationVariables.bodies[i].appliedForces = [];

            for (let j = SimulationVariables.bodies.length - 1; j >= 0; j--) {
                if (i !== j) {
                    let force = SimulationVariables.bodies[j].calculateAttraction(SimulationVariables.bodies[i]);
                    SimulationVariables.bodies[i].applyForce(p5, force);

                    //Check if the 2 bodies have collided
                    SimulationVariables.bodies[i].checkCollision(p5, SimulationVariables.bodies[j]);
                }
            }
        }

        //Update the bodies
        //Create an arrays to store if a body is off screen
        //If all bodies are off screen, we move all of them to the other side of the sketch
        let bodiesOffScreen: Array<boolean> = [];

        for (let i = 0; i < SimulationVariables.bodies.length; i++) {
            //Update bodies with applied force
            SimulationVariables.bodies[i].update(p5, updatePosition);

            //Update the offscreen array with whether this body is off screen
            bodiesOffScreen.push(SimulationVariables.bodies[i].checkOffScreen(p5));
        }

        //Shift the position of all bodies if all bodies are off screen, to make them reenter from the opposite side of the screen
        if (bodiesOffScreen.every((e) => e === true)) {
            for (let i = 0; i < SimulationVariables.bodies.length; i++) {
                let body = SimulationVariables.bodies[i];

                if (body.position.x < 0) {
                    body.position.x += p5.width;
                }
                if (body.position.x > p5.width) {
                    body.position.x -= p5.width;
                }
                if (body.position.y < 0) {
                    body.position.y += p5.height;
                }
                if (body.position.y > p5.height) {
                    body.position.y -= p5.height;
                }

                //Clear the prevpos array for each body so that object trails are redrawn after the body is teleported
                body.prevPos = [];
            }
        }
    }

    //Function to display the bodies
    function displayBodies() {
        //Display the bodies
        for (let i = 0; i < SimulationVariables.bodies.length; i++) {
            SimulationVariables.bodies[i].display(p5);
        }
    }

    //Functions to control the dragging of bodies using the mouse
    p5.mouseDragged = () => {
        //To avoid dragging if mouse is over control panel, or if a dialog is currently open
        if (p5.mouseX < p5.width && p5.mouseY < p5.height && SimulationVariables.modalDialogOpen == false) {
            for (let i = 0; i < SimulationVariables.bodies.length; i++) {
                if (
                    SimulationVariables.bodies[i].startDraggingVelocityVector(p5) == true ||
                    SimulationVariables.bodies[i].startDraggingBody(p5) == true
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