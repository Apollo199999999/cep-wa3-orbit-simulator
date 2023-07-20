<script lang="ts">
  export let toolTipText = "";
  export let btnColor = "";
  export let svgIconPath = "";
  export let clickEvent: void;
</script>

<div class="tooltip tooltip-bottom" data-tip={toolTipText}>
  <button class="btn btn-square {btnColor}" on:click={() => {clickEvent}}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d={svgIconPath} />
    </svg>
  </button>
</div>
