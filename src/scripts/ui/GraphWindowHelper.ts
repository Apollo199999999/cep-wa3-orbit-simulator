import type { EChartsOption } from "echarts";
import { SimulationVariables } from "../SimulationVariables";

export class GraphWindowHelper {
    //Stores the bodyIndex associated with graph window
    public bodyIndex: number;
    //Stores HTML element of graphWindow div
    public graphWindowDiv: HTMLDivElement;

    constructor(bodyIndex, graphWindowDiv) {
        this.bodyIndex = bodyIndex;
        this.graphWindowDiv = graphWindowDiv;

        //Create a resize monitor for the graphWindowDiv to track when its dimensions change
        let resizeObserver = new ResizeObserver((mutations) => {
            this.onGraphWindowResizeStart();
        });

        resizeObserver.observe(this.graphWindowDiv);
    }

    //Function that is triggered when the graph window is resized 
    public onGraphWindowResizeStart() {
        //Resize the echarts graph
        //Looking at the svelte-echarts wrapper, it unfortunately does not expose the internal echarts implementation
        //However, we can see that it has binded the resize() function of the echarts component to the "resize" event of the window,
        //as seen here: https://github.com/search?q=repo%3Abherbruck%2Fsvelte-echarts%20resize&type=code
        //So while this is a bit hacky, to resize the echarts graph, we have to call the window resize event
        window.dispatchEvent(new Event('resize'));

        //Also disable p5js dragging
        SimulationVariables.disableP5Dragging = true;

        //Reenable p5js dragging when the graphwindow is no longer being resized
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
    titleBarOnPointerDown(e) {
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
        //Set disableP5Dragging to false to indicate this window is no longer being dragged
        SimulationVariables.disableP5Dragging = false;

        // stop moving when mouse button is released:
        document.removeEventListener("pointerup", this.pointerUpEvent);
        document.removeEventListener("pointermove", this.pointerMoveEvent);
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
                nameGap: 35,
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
                nameGap: 35,
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
}