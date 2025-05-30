<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte"
    import type { Resolution } from "../../../../types/Settings"
    import Center from "../../../common/components/Center.svelte"
    import { translate } from "../../util/helpers"
    import { GetLayout } from "../../util/output"
    import { activeShow, outShow, styleRes } from "../../util/stores"
    import Slide from "./ShowSlide.svelte"

    export let outSlide: number | null
    export let dictionary: any
    export let columns: number = 2
    let resolution: Resolution = $styleRes || { width: 1920, height: 1080 }

    // $: id = $activeShow!.id
    // $: currentShow = $shows[$activeShow!.id]
    // $: layoutSlides = [$shows[$activeShow!.id].layouts[$shows[$activeShow!.id].settings.activeLayout].slides, GetLayout($activeShow!.id)][1]
    $: layoutSlides = GetLayout($activeShow, $activeShow?.settings?.activeLayout || "")

    // auto scroll
    export let scrollElem: HTMLElement | undefined
    let lastScrollId = "-1"
    $: {
        if (scrollElem?.querySelector(".grid") && outSlide !== null && $outShow?.id === $activeShow?.id) {
            let index = Math.max(0, outSlide)
            if (($outShow?.id || "") + index !== lastScrollId) {
                lastScrollId = ($outShow?.id || "") + index
                let offset = (scrollElem.querySelector(".grid")?.children[index] as HTMLElement)?.offsetTop - scrollElem.offsetTop - 4 - 50
                scrollElem.scrollTo(0, offset)
            }
        }
    }

    let dispatch = createEventDispatcher()
    function click(i: number) {
        dispatch("click", i)
    }

    // pinch zoom
    let scaling: boolean = false
    let initialDistance: number = 0
    let initialColumns: number = columns
    const touchstart = (e: any) => {
        if (e.touches.length === 2) {
            initialDistance = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY)
            initialColumns = columns
            scaling = true
        }
    }

    const margin = 150
    let scaled = 0
    const touchmove = (e: any) => {
        if (scaling) {
            e.preventDefault()
            let dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY)

            let newColumns = 1
            scaled = initialDistance / margin - dist / margin
            if (scaled < 0) newColumns = initialColumns + scaled
            else newColumns = initialColumns + scaled

            columns = Math.min(4, Math.max(1, Math.floor(newColumns)))
        }
    }
    const touchend = () => (scaling = false)

    // open tab instantly before loading content
    let loadingStarted: boolean = false
    onMount(() => setTimeout(() => (loadingStarted = true), 10))
</script>

<div class="grid" on:touchstart={touchstart} on:touchmove={touchmove} on:touchend={touchend}>
    {#if layoutSlides.length}
        {#if layoutSlides.length < 10 || loadingStarted}
            {#each layoutSlides as slide, i}
                <Slide
                    {resolution}
                    media={$activeShow?.media}
                    layoutSlide={slide}
                    slide={$activeShow?.slides[slide.id]}
                    index={i}
                    color={slide.color}
                    active={outSlide === i && $outShow?.id === $activeShow?.id}
                    {columns}
                    on:click={() => {
                        // if (!$outLocked && !e.ctrlKey) {
                        //   outSlide.set({ id, index: i })
                        // }
                        click(i)
                    }}
                />
            {/each}
        {:else}
            <Center faded>{translate("remote.loading", $dictionary)}</Center>
        {/if}
    {:else}
        <Center faded>{translate("empty.slides", $dictionary)}</Center>
    {/if}
</div>

<style>
    /* .scroll {
    padding-bottom: 10px;
  } */

    .grid {
        display: flex;
        flex-wrap: wrap;
        /* gap: 10px; */
        padding: 5px;
        height: 100%;
        align-content: flex-start;
    }
</style>
