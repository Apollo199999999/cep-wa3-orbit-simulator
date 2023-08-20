import type { EChartsOption } from "echarts";
import { SimulationVariables } from "../SimulationVariables";

export class GraphWindowHelper {
    //Stores the bodyIndex associated with graph window
    public bodyIndex: number;

    constructor(bodyIndex) {
        this.bodyIndex = bodyIndex;
    }

    //Function that returns position graph options
    getPositionGraphOptions() {
        let options: EChartsOption = {
            animation: false,

            title: {
                text: "Displacement Graph for Body " + (this.bodyIndex + 1).toString(),
            },
            tooltip: {
                trigger: "axis",
            },
            xAxis: {
                name: "Number of frames before current frame",
                axisLabel: {
                    interval: 99,
                },
                nameLocation: "middle",
                nameGap: 30,
                data: Array.from(
                    Array(
                        SimulationVariables.bodies[this.bodyIndex].graphPositionData.length
                    ).keys()
                ).reverse(),
            },
            yAxis: {
                name: "Displacement from (0, 0)",
                nameLocation: "middle",
                nameGap: 40,
                scale: true,
            },
            series: [
                {
                    name: "Position",
                    type: "line",
                    data: SimulationVariables.bodies[this.bodyIndex].graphPositionData,
                },
            ],
        };

        return options;
    }

    //Function that returns velocity graph options
    getVelocityGraphOptions() {
        let options: EChartsOption = {
            animation: false,

            title: {
                text: "Velocity Graph for Body " + (this.bodyIndex + 1).toString(),
            },
            tooltip: {
                trigger: "axis",
            },
            xAxis: {
                name: "Number of frames before current frame",
                axisLabel: {
                    interval: 99,
                },
                nameLocation: "middle",
                nameGap: 30,
                data: Array.from(
                    Array(
                        SimulationVariables.bodies[this.bodyIndex].graphVelocityData.length
                    ).keys()
                ).reverse(),
            },
            yAxis: {
                name: "Magnitude of Velocity",
                nameLocation: "middle",
                nameGap: 40,
                scale: true,
            },
            series: [
                {
                    name: "Velocity",
                    type: "line",
                    data: SimulationVariables.bodies[this.bodyIndex].graphVelocityData,
                },
            ],
        };

        return options;
    }

    //CODE TO ALLOW USER TO DRAG THE GRAPHWINDOW

    //Code adapted from here: https://www.w3schools.com/howto/howto_js_draggable.asp
    //Position of window
    public pos1: number = 0;
    public pos2: number = 0;
    public pos3: number = 0;
    public pos4: number = 0;

    //Stores HTML element of graphWindow div
    public graphWindowDiv: HTMLDivElement;

    //Stores mouseup and mousemove events for dragging
    public pointerUpEvent: (e: any) => void;
    public pointerMoveEvent: (e: any) => void;

    //OnMouseDown event binded from html
    titleBarOnPointerDown(e, graphWindowDiv: HTMLDivElement) {
        //Set modaldialogopen to true
        SimulationVariables.modalDialogOpen = true;

        //Assign graphWindowDiv
        this.graphWindowDiv = graphWindowDiv as HTMLDivElement;

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

    elementDrag(e: PointerEvent) {
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

    closeDragElement(e: PointerEvent) {
        //Set modaldialogopen to false
        SimulationVariables.modalDialogOpen = false;

        // stop moving when mouse button is released:
        document.removeEventListener("pointerup", this.pointerUpEvent);
        document.removeEventListener("pointermove", this.pointerMoveEvent);
    }
}