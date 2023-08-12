import { SimulationVariables } from "../SimulationVariables";
import { cloneDeep } from "lodash"

export class LeftControlPanelEvents {
    //Event handler for when the reset button is clicked
    public static resetBtnClicked(element: any) {
        //Stop the simulation
        SimulationVariables.simulationRunning = false;

        //Restore the initial state of the simulation by deep cloning the saved array, saved before running
        SimulationVariables.bodies = cloneDeep(SimulationVariables.savedBodies);
    }

    //Event handler for when the play button is clicked
    public static playBtnClicked(element: any) {
        if (SimulationVariables.simulationRunning == false) {
            //Save the initial state of the simulation before running by deep cloning the SimulationVariables.bodies array
            SimulationVariables.savedBodies = cloneDeep(SimulationVariables.bodies);

            //Run the simulation
            SimulationVariables.simulationRunning = true;
        }
    }

    //Event handler for when the pause button is clicked
    public static pauseBtnClicked(element: any) {
        if (SimulationVariables.simulationRunning == true) {
            //Stop the simulation
            SimulationVariables.simulationRunning = false;
        }
    }

    //Event handler for when the skip one frame button is pressed
    public static forwardOneFrameBtnClicked(element: any) {
        //Run the simulation for 1 frame only
        SimulationVariables.simulationRunning = true;

        setTimeout(() => {
            SimulationVariables.simulationRunning = false;
        }, 1000 / (60 * SimulationVariables.simulationSpeed));
    }

    //Event handler for when the simulation speed slider is dragged
    public static simulationSpeedChanged(element: any) {
        //Cast the element as a HTMLInputElement
        let simulationSpeedSlider: HTMLInputElement = element as HTMLInputElement;

        //Update the simulation speed variable
        SimulationVariables.simulationSpeed = parseFloat(simulationSpeedSlider.value);
    }

    //Event handlers for force, velocity, path checkboxes
    public static showForceCheckboxCheckChanged(element: any) {
        //Get the child checkbox inside the element
        let showForceCheckbox: HTMLInputElement = (element as HTMLElement).querySelector("input") as HTMLInputElement;

        //Update simulation variables depending on check state of checkbox
        SimulationVariables.showGravityForce = showForceCheckbox.checked;
    }

    public static showVelocityCheckboxCheckChanged(element: any) {
        //Get the child checkbox inside the element
        let showVelocityCheckbox: HTMLInputElement = (element as HTMLElement).querySelector("input") as HTMLInputElement;

        //Update simulation variables depending on check state of checkbox
        SimulationVariables.showVelocityVectors = showVelocityCheckbox.checked;
    }

    public static showPathCheckboxCheckChanged(element: any) {
        //Update simulation variables depending on check state of checkbox
        //Get the child checkbox inside the element
        let showPathCheckbox: HTMLInputElement = (element as HTMLElement).querySelector("input") as HTMLInputElement;

        //Update simulation variables depending on check state of checkbox
        SimulationVariables.showPath = showPathCheckbox.checked;
    }

    //Event handler to zoom in/out the canvas
    public static canvasZoomChanged(element: any) {
        //Cast the element as a HTMLInputElement
        let canvasZoomSlider: HTMLInputElement = element as HTMLInputElement;

        //Update simulation variables
        SimulationVariables.canvasZoom = parseFloat(canvasZoomSlider.value);
    }

    //Event handler for zoom slider which controls how magnified the vectors are
    public static vectorZoomChanged(element: any) {
        //Cast the element as a HTMLInputElement
        let vectorZoomSlider: HTMLInputElement = element as HTMLInputElement;

        //Update simulation variables
        SimulationVariables.vectorMagnification = parseFloat(vectorZoomSlider.value);
    }
}