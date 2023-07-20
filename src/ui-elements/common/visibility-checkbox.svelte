<script lang="ts">
  export let checkboxLabel = "";
  export let checkboxSubtextStyle = "";
  export let checkboxSubtext="";
  export let clickEvent : void;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="form-control mt-4"
  on:click={() => {clickEvent}}>
  <label class="label cursor-pointer">
    <span>
      <span class="text-lg">{checkboxLabel}</span>
      <br />
      <span class={checkboxSubtextStyle}>{checkboxSubtext}</span>
    </span>

    <input
      id="showForceCheckbox"
      type="checkbox"
      checked={true}
      class="checkbox checkbox-primary" />
  </label>
</div>
