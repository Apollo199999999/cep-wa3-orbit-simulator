import { SimulationVariables } from "../SimulationVariables";
import type { ChartXY, LineSeries } from "@arction/lcjs";

export class GraphWindowHelper {
    //Stores the bodyIndex associated with graph window
    public bodyIndex: number;
    //Stores HTML element of graphWindow div
    public graphWindowDiv: HTMLDivElement;

    constructor(bodyIndex: number, graphWindowDiv: HTMLDivElement) {
        this.bodyIndex = bodyIndex;
        this.graphWindowDiv = graphWindowDiv;

        //Disable p5js dragging if the user is interacting with the graph window
        this.graphWindowDiv.addEventListener("pointerdown", (e) => SimulationVariables.disableP5Dragging = true);
        this.graphWindowDiv.addEventListener("pointerup", (e) => SimulationVariables.disableP5Dragging = false);
    }
    
    //CODE TO ALLOW USER TO DRAG THE GRAPHWINDOW
    //Code adapted from here: https://www.w3schools.com/howto/howto_js_draggable.asp
    //Position of window
    public pos1: number = 0;
    public pos2: number = 0;
    public pos3: number = 0;
    public pos4: number = 0;

    //Stores mouseup and mousemove events for dragging
    public pointerUpEvent: (e: any) => void;
    public pointerMoveEvent: (e: any) => void;

    //OnMouseDown event binded from html
    public titleBarOnPointerDown(e) {
        //Set disableP5Dragging to true to prevent us from accidentally dragging a body while moving this window
        SimulationVariables.disableP5Dragging = true;

        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;

        //Add event listners for mouseup and mousemove
        this.pointerUpEvent = (e) => this.closeDragElement(e);
        this.pointerMoveEvent = (e) => this.elementDrag(e);
        document.addEventListener("pointerup", this.pointerUpEvent);
        document.addEventListener("pointermove", this.pointerMoveEvent);
    }

    public elementDrag(e: PointerEvent) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        // set the element's new position, preventing the div from being dragged outside the screen area
        let top: number = Math.max(this.graphWindowDiv.offsetTop - this.pos2, 0);
        let left: number = Math.max(this.graphWindowDiv.offsetLeft - this.pos1, 0)
        top = Math.min(top, window.innerHeight - 100);
        left = Math.min(left, window.innerWidth - 100);
        this.graphWindowDiv.style.top = top + "px";
        this.graphWindowDiv.style.left = left + "px";
    }

    public closeDragElement(e: PointerEvent) {
        //Set disableP5Dragging to false to indicate this window is no longer being dragged
        SimulationVariables.disableP5Dragging = false;

        // stop moving when mouse button is released:
        document.removeEventListener("pointerup", this.pointerUpEvent);
        document.removeEventListener("pointermove", this.pointerMoveEvent);
    }

    //Function that first initializes position graph
    public initPositionGraph(lineChart: ChartXY, lineSeries: LineSeries) {
        //Set graph settings
        lineChart.setTitle(
            "Distance Graph for Body " + (this.bodyIndex + 1).toString()
        );
        lineChart.getDefaultAxisY().setTitle("Distance from (0, 0)");

        //Create an array out of the indices of the body's graphPosition array and reverse it to act as the x axis
        let graphPositionData = SimulationVariables.bodies[this.bodyIndex].graphPositionData;
        let axisLabels = Array.from(Array(graphPositionData.length).keys());

        //Merge the 2 arrays into a key-value pair of {x,y} to be consumed by the lineChart
        let displacementLineSeries = axisLabels.map((v, i) => [v, graphPositionData[i]]).map(([x, y]) => ({ x, y }));

        //Add the data
        lineSeries.clear();
        lineSeries.add(displacementLineSeries);
    }

    //Function that first initializes velocity graph
    public initVelocityGraph(lineChart: ChartXY, lineSeries: LineSeries) {
        //Set graph settings
        lineChart.setTitle(
            "Speed Graph for Body " + (this.bodyIndex + 1).toString()
        );
        lineChart.getDefaultAxisY().setTitle("Speed");

        //Create an array out of the indices of the body's graphPosition array and reverse it to act as the x axis
        let graphVelocityData = SimulationVariables.bodies[this.bodyIndex].graphVelocityData;
        let axisLabels = Array.from(Array(graphVelocityData.length).keys());

        //Merge the 2 arrays into a key-value pair of {x,y} to be consumed by the lineChart
        let velocityLineSeries = axisLabels.map((v, i) => [v, graphVelocityData[i]]).map(([x, y]) => ({ x, y }));

        //Add the data
        lineSeries.clear();
        lineSeries.add(velocityLineSeries);

    }

    //Function that updates position graph
    public updatePositionGraph(lineChart: ChartXY, lineSeries: LineSeries) {
        //Set graph settings
        lineChart.setTitle(
            "Distance Graph for Body " + (this.bodyIndex + 1).toString()
        );
        lineChart.getDefaultAxisY().setTitle("Distance from (0, 0)");

        //Create an array out of the indices of the body's graphPosition array and reverse it to act as the x axis
        let graphPositionData = SimulationVariables.bodies[this.bodyIndex].graphPositionData;

        //Append the data to the chart
        lineSeries.add({ x: graphPositionData.length - 1, y: graphPositionData[graphPositionData.length - 1] });
    }

    //Function that updates velocity graph
    public updateVelocityGraph(lineChart: ChartXY, lineSeries: LineSeries) {
        //Set graph settings
        lineChart.setTitle(
            "Speed Graph for Body " + (this.bodyIndex + 1).toString()
        );
        lineChart.getDefaultAxisY().setTitle("Speed");

        //Create an array out of the indices of the body's graphPosition array and reverse it to act as the x axis
        let graphVelocityData = SimulationVariables.bodies[this.bodyIndex].graphVelocityData;

        //Append the data to the chart
        lineSeries.add({ x: graphVelocityData.length - 1, y: graphVelocityData[graphVelocityData.length - 1] });
    }
}