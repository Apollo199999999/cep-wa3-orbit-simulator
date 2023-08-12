<script lang="ts">
  export let onDataInput: any;
  export let bodyIndex: number = -1;
  export let bodyColor: string;

  //From the bodyIndex, create a title for the bodyDataControl
  let title = "Body " + (bodyIndex + 1).toString() + " Data";

  //From the bodyColor, create a CSS property setting the background color as the bodyColor
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
  </div>
</div>
