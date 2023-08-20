<script>
  import { RightControlPanelEvents } from "../scripts/ui/RightCtrlPanelEvents";
  import SimulationPresetDialog from "./components/SimulationPresetDialog.svelte";

  //Dialog id to open/close simulation preset dialog
  let simulationDialogId = "simulationPresetDialog";
</script>

<!-- Simulation presets dialog -->
<SimulationPresetDialog
  dialogId={simulationDialogId}
  onDialogClose={(event) => {
    RightControlPanelEvents.simulationPresetDialogClose(event.currentTarget);
  }}
  bind:this={RightControlPanelEvents.simulationPresetDialog} />

<!-- Right control panel (previously "Data" tab) -->
<div
  id="rightControlPanel"
  class="block bg-base-100 flex-1 p-4 pr-3 overflow-y-auto h-screen box-border"
  bind:this={RightControlPanelEvents.rightControlPanelDiv}>
  <!-- Here's a hacky workaround, since we cant call "onload" for div elements, we add a hidden img element that calls onload instead -->
  <img
    src="/favicon.svg"
    alt=""
    class="hidden"
    on:load={(event) => {
      RightControlPanelEvents.rightControlPanelLoaded(event.currentTarget);
    }} />

  <!-- Simulation preset options -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <label
    class="btn btn-primary w-full"
    for={simulationDialogId}
    on:click={(event) => {
      RightControlPanelEvents.simulationPresetDialogOpen(event.currentTarget);
    }}>Load Simulation Preset</label>

  <!-- Number of bodies section -->
  <p class="text-xl font-semibold mt-10">Number of bodies (1-5)</p>
  <input
    id="bodiesNumberInput"
    on:input={(event) => {
      RightControlPanelEvents.bodiesNumberEditing(event.currentTarget);
    }}
    bind:this={RightControlPanelEvents.bodiesNumberInput}
    class="input input-bordered input-primary mt-4 mb-8 w-20"
    type="number"
    value="2"
    min="1"
    max="5"
    step="1" />
</div>
