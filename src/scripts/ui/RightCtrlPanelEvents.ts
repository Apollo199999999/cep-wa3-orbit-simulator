import { SimulationVariables } from "../SimulationVariables";

export class RightControlPanelEvents {
    //Event handler to open dialog to load new preset
    public static simulationPresetDialogOpen(element: any) {
        //Set modalDialogOpen = true to indicate that the dialog is open
        SimulationVariables.modalDialogOpen = true;
    }

    //Event handler after dialog closed
    public static simulationPresetDialogClose(element: any) {
        //Set modalDialogOpen = false to indicate that the dialog is no longer open
        SimulationVariables.modalDialogOpen = false;
    }

    public static bodiesNumberEditing(element: any) {

    }
}