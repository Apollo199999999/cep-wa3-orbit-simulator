<script lang="ts">
  import { RightControlPanelEvents } from "../../scripts/ui/RightCtrlPanelEvents";

  export let onDataInput: any;
  export let bodyIndex: number = -1;
  export let bodyColor: string;

  //From the bodyIndex, create a title for the bodyDataControl
  let title = "Body " + (bodyIndex + 1).toString() + " Data";

  //From the bodyColor, create a CSS property setting the background color of the circle as the bodyColor
  let bodyColorCSS = "background-color: " + bodyColor + ";";
</script>

<!-- Template element to show data readouts for each body (cloned in javascript) -->
<div class="collapse collapse-plus bg-base-200 mt-2 bodyDataControl">
  <input type="checkbox" />
  <div class="collapse-title text-xl font-medium">
    <!-- Circle to represent body -->
    <p
      class="body-circle mb-2 h-12 w-12 rounded-full inline-block"
      style={bodyColorCSS} />
    <p class="collapse-title-label">{title}</p>
  </div>
  <div class="collapse-content">
    <!-- Body mass readouts -->
    <p class="text-lg font-semibold">Mass (1-500)</p>
    <input
      class="input input-bordered input-primary mt-3 mb-6 mass"
      style="width: 5.5em"
      on:input={onDataInput}
      type="number"
      step="1"
      min="1"
      data-bodyindex={bodyIndex.toString()} />

    <!-- Body position readouts -->
    <p class="text-lg font-semibold">Position</p>
    <table class="table table-zebra">
      <!-- head -->
      <thead class="text-lg">
        <tr>
          <th>x:</th>
          <th>y:</th>
        </tr>
      </thead>
      <!-- body -->
      <tbody class="text-lg">
        <tr>
          <td>
            <input
              class="input input-bordered input-primary px"
              style="width: 5.5em"
              on:input={onDataInput}
              type="number"
              step="1"
              min="0"
              data-bodyindex={bodyIndex.toString()} />
          </td>
          <td>
            <input
              class="input input-bordered input-primary py"
              style="width: 5.5em"
              on:input={onDataInput}
              type="number"
              step="1"
              min="0"
              data-bodyindex={bodyIndex.toString()} />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Body velocity readouts -->
    <p class="text-lg font-semibold mt-4">Velocity</p>
    <table class="table table-zebra">
      <!-- head -->
      <thead class="text-lg">
        <tr>
          <th>x:</th>
          <th>y:</th>
        </tr>
      </thead>
      <!-- body -->
      <tbody class="text-lg">
        <tr>
          <td>
            <input
              class="input input-bordered input-primary vx"
              style="width: 5.5em"
              on:input={onDataInput}
              type="number"
              step="0.01"
              min="0"
              data-bodyindex={bodyIndex.toString()} />
          </td>
          <td>
            <input
              class="input input-bordered input-primary vy"
              style="width: 5.5em"
              on:input={onDataInput}
              type="number"
              step="0.01"
              min="0"
              data-bodyindex={bodyIndex.toString()} />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Button to open graph window -->
    <div
      class="tooltip tooltip-top w-full"
      data-tip="Show distance/speed graphs">
      <button
        class="btn btn-secondary w-full mt-4"
        data-bodyindex={bodyIndex.toString()}
        on:click={(event) => {
          RightControlPanelEvents.showGraphBtnClicked(event.currentTarget);
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        Show Graphs</button>
    </div>

    <!-- Button to delete body -->
    <!-- Disable the delete button on the first body to prevent the user from deleting all bodies -->
    <div
      class="tooltip tooltip-top w-full"
      data-tip={bodyIndex == 0
        ? "You cannot delete the first body."
        : "Delete this body"}>
      <button
        class="btn btn-error w-full mt-4"
        data-bodyindex={bodyIndex.toString()}
        disabled={bodyIndex == 0}
        on:click={(event) => {
          RightControlPanelEvents.deleteBodyBtnClicked(event.currentTarget);
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        Delete Body</button>
    </div>
  </div>
</div>
