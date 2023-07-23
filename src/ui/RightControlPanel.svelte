<script>
  import { RightControlPanelEvents } from "../scripts/ui/RightCtrlPanelEvents";
</script>

<!-- Simulation presets dialog -->
<input type="checkbox" id="simulationPresetDialog" class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <h1 class="font-bold text-lg">Load Simulation Preset</h1>
    <p class="py-4">Select a preset:</p>
    <select class="select select-primary w-full text-lg" id="presetSelector">
      <option selected>Sun, Planet</option>
      <option>Sun, Planet, Moon</option>
      <option>Sun, Planet, Planet</option>
      <option>Gravity Assist</option>
      <option>Binary Star</option>
    </select>
    <div class="modal-action">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <label
        for="simulationPresetDialog"
        on:click={(event) => {
          RightControlPanelEvents.simulationPresetDialogClose(
            event.currentTarget
          );
        }}
        class="btn btn-primary">Apply</label>
    </div>
  </div>
</div>

<!-- Right control panel (previously "Data" tab) -->
<div
  id="dataPage"
  class="bg-base-100 flex-1 p-4 pr-3 max-h-screen overflow-y-auto overflow-x-hidden">
  <!-- Simulation preset options -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <label
    class="btn btn-primary w-full"
    for="simulationPresetDialog"
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
    class="input input-bordered input-primary mt-4 mb-8 w-20"
    type="number"
    value="2"
    min="1"
    max="5"
    step="1" />
</div>
