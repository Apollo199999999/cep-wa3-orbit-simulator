<script lang="ts">
  export let checkboxLabel: string = "";
  export let checkboxSubtextStyle: string = "";
  export let checkboxSubtext: string = "";
  export let onClick: any;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="form-control mt-4" on:click={onClick}>
  <label class="label cursor-pointer">
    <span>
      <span class="text-lg">{checkboxLabel}</span>
      <br />
      <span class={checkboxSubtextStyle}>{checkboxSubtext}</span>
    </span>

    <input type="checkbox" checked={true} class="checkbox checkbox-primary" />
  </label>
</div>
