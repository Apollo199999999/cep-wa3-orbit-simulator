<script lang="ts">
  import { SimulationVariables } from "../../scripts/SimulationVariables";
  import IconButton from "./IconButton.svelte";
  import { GraphWindowHelper } from "../../scripts/ui/GraphWindowHelper";
  import {
    ChartXY,
    lightningChart,
    LineSeries,
    type LightningChart,
    AxisScrollStrategies,
  } from "@arction/lcjs";
  import { RightControlPanelEvents } from "../../scripts/ui/RightCtrlPanelEvents";

  //Allow a bodyIndex property to be inputted as a prop
  export let bodyIndex: number;

  //Stores HTML component for graphWindow (binded from HTML)
  let graphWindowDiv: HTMLDivElement;

  //Stores the div to store the chart
  let chartDiv: HTMLDivElement;

  //Variable to store chart object
  let lineChart: ChartXY;

  //Variable to store lineseries for chart
  let lineSeries: LineSeries;

  //Stores the tab items to switch between "position" and "velocity" graph
  let positionTab: HTMLAnchorElement;
  let velocityTab: HTMLAnchorElement;

  //Variable to store which graph to show
  let showPositionGraph: boolean = true;

  //Create new instance of GraphWindowHelper class
  let graphWindowHelper: GraphWindowHelper;

  //Loaded variable to store if the graphwindow has completed its loading function
  let loaded: boolean = false;

  //Event that is called when graph window loads
  function onGraphWindowLoaded(element) {
    //Create new graph
    const container = chartDiv as HTMLDivElement;
    lineChart = lightningChart().ChartXY({ container });
    lineChart.setMouseInteractions(false);
    lineChart
      .getDefaultAxisX()
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setTitle("Frames elapsed")
      .setInterval({ start: 0, end: 600, stopAxisAfter: false });
    lineSeries = lineChart.addLineSeries({
      dataPattern: { pattern: "ProgressiveX", regularProgressiveStep: true },
    });
    lineSeries.setEffect(false);

    //Init GraphWindowHelper class
    //The GraphWindowHelper class is used to handle all the basic functions to make this component act like a window,
    //i.e., handling resize events and such
    //It also handles creating graph options to be displayed
    graphWindowHelper = new GraphWindowHelper(bodyIndex, graphWindowDiv);

    //Init dist graph
    graphWindowHelper.initDistanceGraph(lineChart, lineSeries);

    //Update graph
    updateGraph();

    //Set loaded to true
    loaded = true;
  }

  //Function to check if the graphWindow is loaded, which is exported as a prop
  export function checkLoaded() {
    return loaded;
  }

  //Function to reset the graphWindow
  export function resetGraph() {
    //Reset graph interval
    lineChart
      .getDefaultAxisX()
      .setInterval({ start: 0, end: 600, stopAxisAfter: false });
      
    //Reinit graph
    if (showPositionGraph == true) {
      graphWindowHelper.initDistanceGraph(lineChart, lineSeries);
    } else {
      graphWindowHelper.initSpeedGraph(lineChart, lineSeries);
    }
  }

  export function updateGraph() {
    //The graph is updated in the draw() loop in p5Sketch
    if (SimulationVariables.bodies[bodyIndex] != undefined) {
      //Show the correct graph
      if (showPositionGraph == true) {
        graphWindowHelper.updateDistanceGraph(lineChart, lineSeries);
      } else {
        graphWindowHelper.updateSpeedGraph(lineChart, lineSeries);
      }
    } else {
      //If body doesnt exist, close this graph window
      closeWindow(null);
    }
  }

  //Event when close button clicked
  export function closeWindow(element: any) {
    //Cleanup and remove this element from document
    SimulationVariables.openedGraphWindow = undefined;
    document.body.removeChild(graphWindowDiv);
  }

  //Event when position tab is clicked
  function positionTabClicked(element: any) {
    //Add/Remove active classes depending on tab
    positionTab.classList.add("tab-active");
    velocityTab.classList.remove("tab-active");

    //Re init graph
    graphWindowHelper.initDistanceGraph(lineChart, lineSeries);

    //Change which graph to show
    showPositionGraph = true;
  }
  function velocityTabClicked(element: any) {
    //Add/Remove active classes depending on tab
    positionTab.classList.remove("tab-active");
    velocityTab.classList.add("tab-active");

    //Re init graph
    graphWindowHelper.initSpeedGraph(lineChart, lineSeries);

    //Change which graph to show
    showPositionGraph = false;
  }
</script>

<!-- Main div for the window, remember to set min/max width and height so user cannot break stuff by resizing the window too small/big -->
<!-- (ying jie im looking at you) -->
<div
  class="flex flex-col absolute z-[999] overflow-hidden resize bg-base-100 rounded-md border border-primary w-[40rem] h-96 min-w-[35rem] min-h-[22rem] max-w-5xl max-h-[40rem]"
  style="left: {Math.random() * 100}px; top: {Math.random() * 100}px;"
  bind:this={graphWindowDiv}>
  <!-- Here's a hacky workaround, since we cant call "onload" for div elements, we add a hidden img element that calls onload instead -->
  <img
    src="/favicon.svg"
    alt=""
    class="hidden"
    on:load={(event) => {
      onGraphWindowLoaded(event.currentTarget);
    }} />

  <!-- Draggable titlebar, bind the pointerdown event to graphwindowhelper function -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="flex bg-base-200 rounded-t-md text-lg w-full h-12 p-2 items-center"
    on:pointerdown={(event) => {
      graphWindowHelper.titleBarOnPointerDown(event);
    }}>
    <IconButton
      toolTipText="Close"
      btnColor="btn-sm"
      svgIconPath="M6 18L18 6M6 6l12 12"
      onClick={(event) => {
        closeWindow(event.currentTarget);
      }} />

    <p class="text-xl ml-2 font-bold">
      {"Graphs for Body " + (bodyIndex + 1).toString()}
    </p>
  </div>

  <!-- Tabs -->
  <!-- svelte-ignore a11y-missing-attribute -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="tabs tabs-boxed border-0 bg-base-100">
    <a
      class="tab tab-active"
      bind:this={positionTab}
      on:click={(event) => {
        positionTabClicked(event.currentTarget);
      }}>Distance</a>
    <a
      class="tab"
      bind:this={velocityTab}
      on:click={(event) => {
        velocityTabClicked(event.currentTarget);
      }}>Speed</a>
  </div>

  <!-- Chart -->
  <div
    class="flex-auto p-1 rounded-b-md bg-base-content"
    bind:this={chartDiv} />
</div>
