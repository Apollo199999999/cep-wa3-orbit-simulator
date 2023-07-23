<script lang="ts">
  export let dialogId: string = "";
  export let onDialogClose: any;
</script>

<!-- Simulation presets dialog -->
<input type="checkbox" id={dialogId} class="modal-toggle" />
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
        for={dialogId}
        on:click={onDialogClose}
        class="btn btn-primary">Apply</label>
    </div>
  </div>
</div>
