<script lang="ts">
  import { drawSettings, drawTool } from "../../stores"
  import T from "../helpers/T.svelte"
  import Color from "../inputs/Color.svelte"
  import NumberInput from "../inputs/NumberInput.svelte"

  const input = (e: any, key: string) => update(key, e.target.value)
  const change = (e: any, key: string) => update(key, e.detail)
  const check = (e: any, key: string) => update(key, e.target.checked)

  const update = (key: string, value: any) => {
    drawSettings.update((ds: any) => {
      ds[$drawTool][key] = value
      return ds
    })
  }
</script>

<div class="main">
  {#key $drawTool}
    <h6><T id="draw.{$drawTool}" /></h6>
  {/key}
  <div style="display: flex;gap: 10px;">
    <span class="titles">
      {#each Object.keys($drawSettings[$drawTool]) as key}
        <p><T id="draw.{key}" /></p>
      {/each}
    </span>

    <span style="flex: 1;">
      {#each Object.entries($drawSettings[$drawTool]) as [key, value]}
        {#if key === "color"}
          <Color {value} on:input={(e) => input(e, key)} />
        {:else if key === "glow" || key === "hold" || key === "rainbow"}
          <input type="checkbox" checked={value} on:change={(e) => check(e, key)} />
        {:else if key === "opacity"}
          <NumberInput {value} step={0.1} decimals={1} max={1} inputMultiplier={10} on:change={(e) => change(e, key)} />
        {:else}
          <NumberInput {value} max={2000} on:change={(e) => change(e, key)} />
        {/if}
      {/each}
    </span>
  </div>
</div>

<style>
  .main {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    padding: 10px;
    border-top: 2px solid var(--primary-lighter);
  }

  h6 {
    color: var(--text);
    text-transform: uppercase;
    text-align: center;
    font-size: 0.9em;
    margin: 20px 0;
  }

  .titles {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  p {
    width: 100%;
    opacity: 0.8;
    align-self: center;
    /* font-weight: bold; */
    /* text-transform: uppercase; */
    font-size: 0.9em;
  }
</style>