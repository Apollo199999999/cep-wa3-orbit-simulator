import BodyDataControl from "../../ui/components/BodyDataControl.svelte";
import type SimulationPresetDialog from "../../ui/components/SimulationPresetDialog.svelte";
import { Body } from "../p5.js/Body";
import { SimulationVariables } from "../SimulationVariables";
import GraphWindow from "../../ui/components/GraphWindow.svelte";
import { SimulationPresetInitialiser } from "./SimulationPresetInitialiser";

export class RightControlPanelEvents {
    //Variable to store the div for the right control panel, binded from the svelte file
    public static rightControlPanelDiv: HTMLDivElement;

    //Variable to store the input box for inputting the number of bodies, binded from the svelte file
    public static bodiesNumberInput: HTMLInputElement;

    //Variable to store the simulation preset dialog, binded from the svelte file
    public static simulationPresetDialog: SimulationPresetDialog;

    //Event handler after the right control panel loads
    public static rightControlPanelLoaded(element: any) {
        //Start updating the right control panel with the body data
        this.updateRightCtrlPanel();
    }

    //Event handler to open dialog to load new preset
    public static simulationPresetDialogOpen(element: any) {
        //Destroy any open graph window
        if (SimulationVariables.openedGraphWindow != undefined) {
            SimulationVariables.openedGraphWindow.closeWindow(null);
        }

        //Set disableP5Dragging = true to indicate that the dialog is open
        SimulationVariables.disableP5Dragging = true;
    }

    //Event handler after dialog closed
    public static simulationPresetDialogClose(element: any) {
        //Get the selected item in the select element
        let chosenPreset: string = this.simulationPresetDialog.getSelectedPreset();

        //Pause the simulation
        SimulationVariables.simulationRunning = false;

        //Init preset initializer class
        let presetInitialiser: SimulationPresetInitialiser = new SimulationPresetInitialiser();

        //Depending on the selected preset, reinitialise the SimulationVariables.bodies array
        if (chosenPreset === "Sun, Planet") {
            presetInitialiser.initSunPlanet();
        } else if (chosenPreset === "Sun, Planet, Moon") {
            presetInitialiser.initSunPlanetMoon();
        } else if (chosenPreset === "Sun, Planet, Planet") {
            presetInitialiser.initSunPlanetPlanet();
        } else if (chosenPreset === "Gravity Assist") {
            presetInitialiser.initGravityAssist();
        } else if (chosenPreset === "Binary Star") {
            presetInitialiser.initBinaryStar();
        }

        //Remove all bodydatacontrols so that they can be reinitialised next time the "data" page (right control panel) updates
        this.removeAllBodyDataControls();

        //Set disableP5Dragging = false to indicate that the dialog is no longer open
        SimulationVariables.disableP5Dragging = false;
    }

    //Function to add new bodylayoutcontrols
    public static addBodyDataControl(bodyIndex: number, bodyColor: string) {
        //Clone template control
        let bodyDataControl: BodyDataControl = new BodyDataControl({
            target: this.rightControlPanelDiv,
            props: {
                onDataInput: (event) => this.bodyDataInputEditing(event.currentTarget),
                bodyIndex: bodyIndex,
                bodyColor: bodyColor
            }
        });
    }

    //Functions to remove new bodylayoutcontrols
    public static removeLastBodyDataControl() {
        //Remove last bodydatacontrol
        let controls = this.rightControlPanelDiv.querySelectorAll(".bodyDataControl");
        this.rightControlPanelDiv.removeChild(controls[controls.length - 1]);
    }

    public static removeAllBodyDataControls() {
        //Remove all children of datapage with "bodyDataControl" class
        const elementsToRemove = this.rightControlPanelDiv.querySelectorAll(".bodyDataControl");

        elementsToRemove.forEach((element) => {
            element.remove();
        });
    }

    public static initialiseBodyDataControls() {
        //Remove all body data controls
        this.removeAllBodyDataControls();

        //Depending on the number of bodies, add body data controls
        for (let i = 0; i < SimulationVariables.bodies.length; i++) {
            let body: Body = SimulationVariables.bodies[i];
            let bodyColor: string = SimulationVariables.p5Instance.color(body.fillColor[0],
                body.fillColor[1],
                body.fillColor[2]).toString();

            this.addBodyDataControl(i, bodyColor);
        }
    }

    public static bodiesNumberEditing(element: any) {
        //Only update the list if the value of the "number of bodies" input box is not null (duh)
        if (this.bodiesNumberInput.value != null && this.bodiesNumberInput.value != "") {

            //Limit the value in the input box between 1 and 5, while also rounding it
            let limitedNumber = Math.max(1, Math.round(parseFloat(this.bodiesNumberInput.value)))
            limitedNumber = Math.min(limitedNumber, 5);
            this.bodiesNumberInput.value = Math.round(limitedNumber).toString();

            //Get the number of bodies inputted by user
            let bodiesNumberInputValue = parseInt(this.bodiesNumberInput.value);

            //Push/Remove bodies from the sv_bodies array
            if (bodiesNumberInputValue > SimulationVariables.bodies.length) {
                //Add bodies
                //Find out how many bodies we need to add
                let addBodies = bodiesNumberInputValue - SimulationVariables.bodies.length;

                for (let i = 0; i < addBodies; i++) {
                    //Create a new color for the body
                    let bodyColorArray = [
                        SimulationVariables.p5Instance.random(25, 255),
                        SimulationVariables.p5Instance.random(25, 255),
                        SimulationVariables.p5Instance.random(25, 255),
                    ];

                    //Add a new body
                    SimulationVariables.bodies.push(
                        new Body(
                            Math.round(SimulationVariables.p5Instance.random(10, 50)),
                            Math.round(SimulationVariables.p5Instance.random(50, SimulationVariables.p5Instance.width - 50)),
                            Math.round(SimulationVariables.p5Instance.random(SimulationVariables.p5Instance.height)),
                            SimulationVariables.p5Instance.random(2.5),
                            SimulationVariables.p5Instance.random(2.5),
                            bodyColorArray
                        )
                    );

                    //Add a new control
                    this.addBodyDataControl(
                        SimulationVariables.bodies.length - 1,
                        SimulationVariables.p5Instance.color(bodyColorArray[0], bodyColorArray[1], bodyColorArray[2]).toString()
                    );
                }

            } else if (bodiesNumberInputValue < SimulationVariables.bodies.length) {
                //Remove bodies
                //Find out how many bodies we need to remove
                let removeBodies = SimulationVariables.bodies.length - bodiesNumberInputValue;
                for (let i = 0; i < removeBodies; i++) {
                    SimulationVariables.bodies.pop();

                    //Remove a body data control as well
                    this.removeLastBodyDataControl();
                }
            }

            //Pause the simulation
            SimulationVariables.simulationRunning = false;
        }
    }

    public static bodyDataInputEditing(element: any) {
        //Cast the calling element
        let bodyDataInput = element as HTMLInputElement;

        //User is inputting data
        if (bodyDataInput.value != null && bodyDataInput.value != "" && bodyDataInput.dataset.bodyindex != undefined) {
            //Retrieve the index of the corresponding body
            let bodyIndex = parseInt(bodyDataInput.dataset.bodyindex);

            //Retrieve the corresponding body
            let body = SimulationVariables.bodies[bodyIndex];

            //Now, depending if the input box is a mass, position, or velocity input box, update the properties of the bodies
            //Remember to round the value in the input box before updating
            //(except for velocity input boxes, because we cant exactly round a number to 2dp while the user is inputting)
            //(however, for ints, we can just disallow decimal points, which is what Math.round does)

            if (bodyDataInput.classList.contains("mass")) {
                //Limit what the user can input as mass to between 1-500
                let limitedMass = Math.max(1, Math.round(parseFloat(bodyDataInput.value)));
                limitedMass = Math.min(limitedMass, 500);
                //Set the input value as the limited mass;
                bodyDataInput.value = Math.round(limitedMass).toString();
                body.mass = parseInt(bodyDataInput.value);
            } else if (bodyDataInput.classList.contains("px")) {
                bodyDataInput.value = Math.round(parseFloat(bodyDataInput.value)).toString();
                body.position.x = parseInt(bodyDataInput.value);
            } else if (bodyDataInput.classList.contains("py")) {
                bodyDataInput.value = Math.round(parseFloat(bodyDataInput.value)).toString();
                body.position.y = parseInt(bodyDataInput.value);
            } else if (bodyDataInput.classList.contains("vx")) {
                //Rounding is more messy than it needs to be, because JavaScript returns a damn string when rounding with .toFixed().
                body.velocity.x = parseFloat(parseFloat(bodyDataInput.value).toFixed(2));
            } else if (element.classList.contains("vy")) {
                //Rounding is more messy than it needs to be, because JavaScript returns a damn string when rounding with .toFixed().
                body.velocity.y = parseFloat(parseFloat(bodyDataInput.value).toFixed(2));
            }
        }
    }

    public static updateRightCtrlPanel() {
        //Repeatedly call this function
        setTimeout(() => {
            this.updateRightCtrlPanel();
        }, 1000 / 60);

        //Update the number of bodyDataControls if there is a mismatch between that and the number of bodies
        //This acts as a failsafe in case something went wrong when adding/removing bodies
        //or when 2 bodies have collided
        if (
            SimulationVariables.bodies.length !=
            this.rightControlPanelDiv.querySelectorAll(".bodyDataControl").length
        ) {
            this.initialiseBodyDataControls();

            //Close any open graph windows
            if (SimulationVariables.openedGraphWindow != undefined) {
                SimulationVariables.openedGraphWindow.closeWindow(null);
            }

            //Update the "number of bodies" input box
            this.bodiesNumberInput.value = SimulationVariables.bodies.length.toString();
        }

        //Update the "number of bodies" input box, if the user is not editing it
        if (document.activeElement != this.bodiesNumberInput) {
            this.bodiesNumberInput.value = SimulationVariables.bodies.length.toString();
        }

        //Update the bodydatacontrols with the mass, position, velocity of their corresponding bodies
        let bodyDataControls = this.rightControlPanelDiv.querySelectorAll(".bodyDataControl");
        for (let i = 0; i < bodyDataControls.length; i++) {
            let bodyDataControl = bodyDataControls[i];
            let body = SimulationVariables.bodies[i];

            //Get relevant controls to update
            let massInput: HTMLInputElement = bodyDataControl.querySelector(".mass") as HTMLInputElement;
            let posXInput: HTMLInputElement = bodyDataControl.querySelector(".px") as HTMLInputElement;
            let posYInput: HTMLInputElement = bodyDataControl.querySelector(".py") as HTMLInputElement;
            let velocityXInput: HTMLInputElement = bodyDataControl.querySelector(".vx") as HTMLInputElement;
            let velocityYInput: HTMLInputElement = bodyDataControl.querySelector(".vy") as HTMLInputElement;

            //Update control values if the user is not editing them (aka they do not have focus)
            //This is quite the chain of if statements, but I have no idea how else to do this
            if (document.activeElement != massInput) {
                massInput.value = body.mass.toFixed(0);
            }

            if (document.activeElement != posXInput) {
                posXInput.value = body.position.x.toFixed(0);
            }

            if (document.activeElement != posYInput) {
                posYInput.value = body.position.y.toFixed(0);
            }

            if (document.activeElement != velocityXInput) {
                velocityXInput.value = body.velocity.x.toFixed(2);
            }

            if (document.activeElement != velocityYInput) {
                velocityYInput.value = body.velocity.y.toFixed(2);
            }
        }
    }

    //Event handler when "show graph" button is clicked
    public static showGraphBtnClicked(element: any) {
        //Cast the calling element
        let showGraphBtn: HTMLButtonElement = element as HTMLButtonElement;
        let bodyIndex = showGraphBtn.dataset.bodyindex;

        if (bodyIndex != undefined) {
            //Create new graph window after destroying any open graph windows
            if (SimulationVariables.openedGraphWindow != undefined) {
                SimulationVariables.openedGraphWindow.closeWindow(null);
            }
            SimulationVariables.openedGraphWindow = new GraphWindow({
                target: document.body,
                props: {
                    bodyIndex: parseInt(bodyIndex)
                }
            });

        }
    }

    //Event handler when "delete body" button is clicked
    public static deleteBodyBtnClicked(element: any) {
        //Cast the calling element
        let deleteBodyBtn: HTMLButtonElement = element as HTMLButtonElement;
        let bodyIndex = deleteBodyBtn.dataset.bodyindex;

        if (bodyIndex != undefined) {
            //Remove body
            SimulationVariables.bodies.splice(parseInt(bodyIndex), 1);
        }
    }

}