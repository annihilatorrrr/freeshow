<script lang="ts">
    import type { Transition } from "../../../../types/Show"
    import { custom } from "../../../utils/transitions"

    export let transition: Transition | undefined = undefined
    export let inTransition: Transition | null = null
    export let outTransition: Transition | null = null

    $: disableTransition = (inTransition?.type || transition?.type) === "none" || (!inTransition?.duration && !transition?.duration)
</script>

<!-- svelte transition bug!!! -->
{#if disableTransition && !inTransition && !outTransition}
    <div class="transitioner">
        <slot />
    </div>
{:else}
    <div class="transitioner" in:custom={inTransition || transition || {}} out:custom={outTransition || transition || {}} on:outrostart>
        <slot />
    </div>
{/if}

<style>
    div {
        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        inset-inline-start: 0;

        pointer-events: none;
    }
</style>
