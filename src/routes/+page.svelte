<script lang="ts">
    import { onMount } from "svelte";
    import "../app.css";
    import LeftControlPanel from "../ui/LeftControlPanel.svelte";
    import { p5Sketch } from "../scripts/p5Sketch";
    import P5 from "p5-svelte"

    //Sketch object for P5 component
    let sketch = p5Sketch;
</script>

<svelte:head>
    <!-- Preload the explosion sound and gif -->
    <link rel="prefetch" href="/explosion.gif" as="image" type="image/gif" />
    <link rel="preload" href="/explosion.gif" as="image" type="image/gif" />

    <link rel="prefetch" href="/explosion.mp3" as="audio" type="audio/mp3" />
    <link rel="preload" href="/explosion.mp3" as="image" type="audio/mp3" />
</svelte:head>

<div class="flex">
    <LeftControlPanel/>
    <div class="relative" style="flex: 0 0 auto;">
        <P5 {sketch} />
    </div>
</div>
