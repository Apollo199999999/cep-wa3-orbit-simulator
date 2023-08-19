<script lang="ts">
  import { SimulationVariables } from "../../scripts/SimulationVariables";
  import IconButton from "./IconButton.svelte";
  import { Chart } from "svelte-echarts";
  import type { EChartsOption } from "echarts";
  import { GraphWindowHelper } from "../../scripts/ui/GraphWindowHelper";

  //Allow a bodyIndex property to be inputted as a prop
  export let bodyIndex: number;

  //Stores HTML component for graphWindow (binded from HTML)
  let graphWindowDiv: HTMLDivElement;

  //Stores the tab items to switch between "position" and "velocity" graph
  let positionTab: HTMLAnchorElement;
  let velocityTab: HTMLAnchorElement;

  //Variable to store which graph to show
  let showPositionGraph: boolean = true;

  //Stores the line graph in the canvas
  let options: EChartsOption = {};

  //Create new instance of GraphWindowHelper class
  let graphWindowHelper: GraphWindowHelper = new GraphWindowHelper(bodyIndex);

  //Event that is called when graph window loads
  function onGraphWindowLoaded(element) {
    updateGraph();
  }

  let updateGraph = function () {
    //Start a timer that updates the graph 60x a second
    setTimeout(updateGraph, 1000 / 60);

    if (SimulationVariables.bodies[bodyIndex] != undefined) {
      //Show the correct graph
      if (showPositionGraph == true) {
        options = graphWindowHelper.getPositionGraphOptions();
      } else {
        options = graphWindowHelper.getVelocityGraphOptions();
      }
    }
    else {
      //If body doesnt exist, close this graph window
      closeBtnClicked(null);
    }
  };

  //Event when close button clicked
  function closeBtnClicked(element: any) {
    //Cleanup and remove this element from document
    options = {};
    updateGraph = function () {};
    document.body.removeChild(graphWindowDiv);
  }

  //Event when position tab is clicked
  function positionTabClicked(element: any) {
    //Add/Remove active classes depending on tab
    positionTab.classList.add("tab-active");
    velocityTab.classList.remove("tab-active");

    //Change which graph to show
    showPositionGraph = true;
  }
  function velocityTabClicked(element: any) {
    //Add/Remove active classes depending on tab
    positionTab.classList.remove("tab-active");
    velocityTab.classList.add("tab-active");

    //Change which graph to show
    showPositionGraph = false;
  }

</script>

<!-- Draggable DIV -->
<div
  class="absolute bg-base-100 rounded-md border border-primary"
  style="left: {Math.random() * 100}px; top: {Math.random() * 100}px; width: 40rem;"
  bind:this={graphWindowDiv}>
  <!-- Here's a hacky workaround, since we cant call "onload" for div elements, we add a hidden img element that calls onload instead -->
  <img
    src="/favicon.svg"
    alt=""
    class="hidden"
    on:load={(event) => {
      onGraphWindowLoaded(event.currentTarget);
    }} />

  <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="flex bg-base-200 rounded-t-md text-lg w-full h-12 p-2 items-center"
    on:mousedown={(event) => {
      graphWindowHelper.titleBarOnMouseDown(event, graphWindowDiv);
    }}>
    <IconButton
      toolTipText="Close"
      btnColor="btn-sm"
      svgIconPath="M6 18L18 6M6 6l12 12"
      onClick={(event) => {
        closeBtnClicked(event.currentTarget);
      }} />

    <p class="text-xl ml-2 font-bold">
      {"Graphs for Body " + (bodyIndex + 1).toString()}
    </p>
  </div>

  <!-- svelte-ignore a11y-missing-attribute -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="tabs tabs-boxed border-0 bg-base-100">
    <a
      class="tab tab-active"
      bind:this={positionTab}
      on:click={(event) => {
        positionTabClicked(event.currentTarget);
      }}>Displacement</a>
    <a
      class="tab"
      bind:this={velocityTab}
      on:click={(event) => {
        velocityTabClicked(event.currentTarget);
      }}>Velocity</a>
  </div>

  <div class="w-full h-96 p-2 rounded-b-md bg-base-content overflow-x-scroll">
    <Chart {options} />
  </div>
</div>
