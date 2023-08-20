<script>
  import { SimulationVariables } from "../../scripts/SimulationVariables";
</script>

<!-- Custom floating help button at bottom right corner of sktech -->
<details
  class="dropdown dropdown-left dropdown-end absolute drop-shadow-2xl"
  style="bottom: 24px; right: {SimulationVariables.CONTROL_PANEL_WIDTH + 24}px">
  <summary class="btn btn-info">
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
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
    Help
  </summary>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div
    tabindex="0"
    class="dropdown-content z-[1] p-4 mr-2 shadow-2xl bg-base-100 rounded-box w-max border border-info">
    <p class="text-lg font-semibold">Welcome to Orbit Simulator!</p>
    <ul class="list-disc list-outside pl-4">
      <li>To control how the simulation behaves, use the left panel.</li>
      <li>To control the bodies in the simulation, use the right panel.</li>
      <li>
        In the right panel, click on the (+) icon to show more details about a
        body.
      </li>
      <li>You can click and drag on the bodies to change their position.</li>
      <li>
        You can also click and drag on the velocity vector on a body to change
        its velocity.
      </li>
    </ul>
  </div>
</details>
