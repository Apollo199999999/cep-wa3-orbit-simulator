<script lang="ts">
  import { LeftControlPanelEvents } from "../scripts/LeftCtrlPanelEvents";
  import IconButton from "./components/IconButton.svelte";
  import VisibilityCheckbox from "./components/VisibilityCheckbox.svelte";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- Left control panel (previously "Controls" tab) -->
<div
  id="controlsPage"
  class="bg-base-100 flex-1 p-4 max-h-screen overflow-y-auto overflow-x-hidden">

  <p class="text-xl font-semibold">Simulation Controls</p>

  <!-- Simulation play/pause panel -->
  <div class="flex gap-2 mt-4">
    <!-- Reset button -->
    <IconButton
      toolTipText="Reset"
      btnColor="btn-neutral"
      svgIconPath="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
      onClick={(event) => LeftControlPanelEvents.resetBtnClicked(event.currentTarget)} />

    <!-- Play button -->
    <IconButton
      toolTipText="Play"
      btnColor="btn-primary"
      svgIconPath="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
      onClick={(event) => LeftControlPanelEvents.playBtnClicked(event.currentTarget)}/>

    <!-- Pause button -->
    <IconButton
      toolTipText="Pause"
      btnColor="btn-neutral"
      svgIconPath="M15.75 5.25v13.5m-7.5-13.5v13.5"
      onClick={(event) => LeftControlPanelEvents.pauseBtnClicked(event.currentTarget)} />

    <!-- Forward 1 frame button -->
    <IconButton
      toolTipText="Forward 1 frame"
      btnColor="btn-neutral"
      svgIconPath="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
      onClick={(event) => LeftControlPanelEvents.forwardOneFrameBtnClicked(event.currentTarget)} />
  </div>

  <!-- Simulation speed section -->
  <p class="text-xl font-semibold mt-10">Simulation Speed</p>

  <input
    on:input={(event) => {
      LeftControlPanelEvents.simulationSpeedChanged(event.currentTarget);
    }}
    id="simulationSpeedSlider"
    type="range"
    min="0.5"
    max="3.0"
    value="1.0"
    step="0.5"
    class="range range-primary mt-4" />

  <!-- Simulation appearance section -->
  <p class="text-xl font-semibold mt-10">Simulation Appearance</p>

  <!-- Show Force Checkbox -->
  <VisibilityCheckbox
    checkboxLabel="Show gravity force"
    checkboxSubtextStyle="text-4xl text-blue-500"
    checkboxSubtext="&#10230;"
    onClick={(event) => LeftControlPanelEvents.showForceCheckboxCheckChanged(event.currentTarget)} />

  <!-- Show velocity vectors checkbox -->
  <VisibilityCheckbox
    checkboxLabel="Show velocity vectors"
    checkboxSubtextStyle="text-4xl text-yellow-500"
    checkboxSubtext="&#10230;"
    onClick={(event) => LeftControlPanelEvents.showVelocityCheckboxCheckChanged(event.currentTarget)} />

  <!-- Show path checkbox -->
  <VisibilityCheckbox
    checkboxLabel="Show path"
    checkboxSubtextStyle="text-4xl text-green-500"
    checkboxSubtext="---------"
    onClick={(event) => LeftControlPanelEvents.showPathCheckboxCheckChanged(event.currentTarget)} />

  <!-- Zoom slider to control how magnified the vectors are -->
  <div class="form-control mt-4 py-2 px-1 mb-4">
    <span class="text-lg">Vector zoom</span>
    <input
      on:input={(event) => {
        LeftControlPanelEvents.zoomChanged(event.currentTarget);
      }}
      id="zoomSlider"
      type="range"
      min="1"
      max="100"
      value="32"
      step="1"
      class="range range-primary mt-4" />
  </div>
</div>
