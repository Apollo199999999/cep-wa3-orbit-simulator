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

    //Function that first initializes distance graph
    public initDistanceGraph(lineChart: ChartXY, lineSeries: LineSeries) {
        //Set graph settings
        lineChart.setTitle(
            "Distance Graph for Body " + (this.bodyIndex + 1).toString()
        );
        lineChart.getDefaultAxisY().setTitle("Distance from (0, 0)");

        //Create an array out of the indices of the body's graphPosition array and reverse it to act as the x axis
        let graphDistanceData = SimulationVariables.bodies[this.bodyIndex].graphDistanceData;
        let axisLabels = Array.from(Array(graphDistanceData.length).keys());

        //Merge the 2 arrays into a key-value pair of {x,y} to be consumed by the lineChart
        let distanceLineSeries = axisLabels.map((v, i) => [v, graphDistanceData[i]]).map(([x, y]) => ({ x, y }));

        //Add the data
        lineSeries.clear();
        lineSeries.add(distanceLineSeries);
    }

    //Function that first initializes speed graph
    public initSpeedGraph(lineChart: ChartXY, lineSeries: LineSeries) {
        //Set graph settings
        lineChart.setTitle(
            "Speed Graph for Body " + (this.bodyIndex + 1).toString()
        );
        lineChart.getDefaultAxisY().setTitle("Speed");

        //Create an array out of the indices of the body's graphPosition array and reverse it to act as the x axis
        let graphSpeedData = SimulationVariables.bodies[this.bodyIndex].graphSpeedData;
        let axisLabels = Array.from(Array(graphSpeedData.length).keys());

        //Merge the 2 arrays into a key-value pair of {x,y} to be consumed by the lineChart
        let speedLineSeries = axisLabels.map((v, i) => [v, graphSpeedData[i]]).map(([x, y]) => ({ x, y }));

        //Add the data
        lineSeries.clear();
        lineSeries.add(speedLineSeries);

    }

    //Function that updates position graph
    public updateDistanceGraph(lineChart: ChartXY, lineSeries: LineSeries) {
        //Set graph settings
        lineChart.setTitle(
            "Distance Graph for Body " + (this.bodyIndex + 1).toString()
        );
        lineChart.getDefaultAxisY().setTitle("Distance from (0, 0)");

        //Create an array out of the indices of the body's graphPosition array and reverse it to act as the x axis
        let graphDistanceData = SimulationVariables.bodies[this.bodyIndex].graphDistanceData;

        //Append the data to the chart
        lineSeries.add({ x: graphDistanceData.length - 1, y: graphDistanceData[graphDistanceData.length - 1] });
    }

    //Function that updates velocity graph
    public updateSpeedGraph(lineChart: ChartXY, lineSeries: LineSeries) {
        //Set graph settings
        lineChart.setTitle(
            "Speed Graph for Body " + (this.bodyIndex + 1).toString()
        );
        lineChart.getDefaultAxisY().setTitle("Speed");

        //Create an array out of the indices of the body's graphPosition array and reverse it to act as the x axis
        let graphSpeedData = SimulationVariables.bodies[this.bodyIndex].graphSpeedData;

        //Append the data to the chart
        lineSeries.add({ x: graphSpeedData.length - 1, y: graphSpeedData[graphSpeedData.length - 1] });
    }
}