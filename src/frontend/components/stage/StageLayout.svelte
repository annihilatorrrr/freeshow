<script lang="ts">
    import { onDestroy } from "svelte"
    import { slide } from "svelte/transition"
    import { OUTPUT } from "../../../types/Channels"
    import { activeStage, activeTimers, allOutputs, currentWindow, dictionary, outputs, playingAudio, playingAudioPaths, stageShows, variables, videosTime } from "../../stores"
    import { send } from "../../utils/request"
    import { clone } from "../helpers/array"
    import { history } from "../helpers/history"
    import Icon from "../helpers/Icon.svelte"
    import { getStageOutputId, getStageResolution } from "../helpers/output"
    import { getStyles } from "../helpers/style"
    import T from "../helpers/T.svelte"
    import Button from "../inputs/Button.svelte"
    import { getStyleResolution } from "../slide/getStyleResolution"
    import Zoomed from "../slide/Zoomed.svelte"
    import Center from "../system/Center.svelte"
    import Snaplines from "../system/Snaplines.svelte"
    import { getSlideTextItems, stageItemToItem, updateStageShow } from "./stage"
    import Stagebox from "./Stagebox.svelte"
    import { getSortedStageItems, shouldItemBeShown } from "../edit/scripts/itemHelpers"

    export let outputId = ""
    export let stageId = ""
    export let preview = false
    export let edit = true

    let lines: [string, number][] = []
    let mouse: any = null
    let newStyles: { [key: string]: number | string } = {}
    $: active = $activeStage.items

    let ratio = 1

    $: {
        if (active.length) {
            if (Object.keys(newStyles).length) setStyles()
        } else newStyles = {}
    }

    function setStyles() {
        let items = $stageShows[$activeStage.id!].items
        let newData: { [key: string]: string } = {}

        active.forEach((id) => {
            let styles = getStyles(items[id].style)
            Object.entries(newStyles).forEach(([key, value]) => (styles[key] = value.toString()))

            let textStyles = ""
            Object.entries(styles).forEach((obj) => (textStyles += obj[0] + ":" + obj[1] + ";"))

            // TODO: move multiple!
            newData[id] = textStyles
        })

        history({ id: "UPDATE", newData: { data: newData, key: "items", subkey: "style", keys: active }, oldData: { id: $activeStage.id }, location: { page: "stage", id: "stage_item_position", override: $activeStage.id + active.join("") } })

        if (!timeout) {
            updateStageShow()
            timeout = setTimeout(() => {
                updateStageShow()
                timeout = null
            }, 500)
        }
    }

    let timeout: NodeJS.Timeout | null = null

    $: stageLayoutId = stageId || $activeStage.id
    $: layout = $stageShows[stageLayoutId || ""] || {}

    // get video time (pre 1.4.0)
    $: if ($currentWindow === "output" && Object.keys(layout.items || {}).find((id) => id.includes("video"))) requestVideoData()
    let interval: NodeJS.Timeout | null = null
    function requestVideoData() {
        if (interval) return
        interval = setInterval(() => send(OUTPUT, ["MAIN_REQUEST_VIDEO_DATA"], { id: outputId }), 1000) // , stageId
    }

    onDestroy(() => {
        if (interval) clearInterval(interval)
    })

    // RESOLUTION

    let width = 0
    let height = 0
    $: stageOutputId = getStageOutputId($outputs)
    $: resolution = getStageResolution(stageOutputId, $outputs)

    // ACTION BAR

    // ZOOM
    let scrollElem: HTMLDivElement | undefined
    let zoom = 1

    // shortcut
    let nextScrollTimeout: NodeJS.Timeout | null = null
    function wheel(e: any) {
        if (!e.ctrlKey && !e.metaKey) return
        if (!edit || nextScrollTimeout) return
        if (!e.target.closest(".stageArea")) return

        zoom = Number(Math.max(0.2, Math.min(4, zoom + (e.deltaY < 0 ? -0.1 : 0.1))).toFixed(2))

        // always center scroll when zooming
        if (zoom < 1) {
            // allow elem to update after zooming
            setTimeout(() => {
                if (!scrollElem) return

                const centerX = (scrollElem.scrollWidth - scrollElem.clientWidth) / 2
                const centerY = (scrollElem.scrollHeight - scrollElem.clientHeight) / 2

                scrollElem.scrollTo({ left: centerX, top: centerY })
            })
        }

        // don't start timeout if scrolling with mouse
        if (e.deltaY >= 100 || e.deltaY <= -100) return
        nextScrollTimeout = setTimeout(() => {
            nextScrollTimeout = null
        }, 500)
    }

    // menu
    let zoomOpened = false
    function mousedown(e: any) {
        if (!edit || e.target.closest(".zoom_container") || e.target.closest("button")) return

        zoomOpened = false
    }

    $: currentOutput = $outputs[outputId] || {}
    $: backgroundColor = currentOutput.transparent ? "transparent" : layout.settings?.color || "#000000"

    $: stageItems = getSortedStageItems(stageLayoutId, $stageShows)

    $: videoTime = $videosTime[outputId] || 0
</script>

<svelte:window on:mousedown={mousedown} on:wheel={wheel} />

<div class="stageArea">
    <!-- <Main slide={stageShowId ? show : null} let:width let:height let:resolution> -->
    <div class="parent" class:noOverflow={zoom >= 1} bind:this={scrollElem} bind:offsetWidth={width} bind:offsetHeight={height}>
        {#if stageLayoutId}
            <!-- TODO: stage resolution... -->
            <Zoomed background={backgroundColor} style={getStyleResolution(resolution, width, height, "fit", { zoom })} {resolution} id={stageOutputId} bind:ratio isStage disableStyle hideOverflow={!edit} center={zoom >= 1}>
                <!-- TODO: snapping to top left... -->
                {#if edit}
                    <Snaplines bind:lines bind:newStyles bind:mouse {ratio} {active} isStage />
                {/if}
                {#key stageLayoutId}
                    {#each stageItems as item}
                        {#if (item.type || item.enabled !== false) && (edit || shouldItemBeShown(stageItemToItem(item), item.type === "slide_text" ? getSlideTextItems(layout, item, $outputs || $allOutputs) : [], { type: "stage" }, { $activeTimers, $variables, $playingAudio, $playingAudioPaths, videoTime }))}
                            <Stagebox {edit} stageLayout={edit ? null : layout} id={item.id} item={clone(item)} {ratio} {preview} bind:mouse />
                        {/if}
                    {/each}
                {/key}
            </Zoomed>
        {:else if edit}
            <Center size={2} faded>
                <T id="empty.layout" />
            </Center>
        {/if}
    </div>
    <!-- </Main> -->

    <!-- <div class="bar">
        <T id="settings.connections" />: {Object.keys($connections.STAGE || {}).length}
    </div> -->

    {#if edit && stageLayoutId}
        <div class="actions" style="width: 100%;gap: 10px;">
            <div class="leftActions"></div>

            <div class="actions" style="height: 100%;justify-content: end;">
                <!-- <div class="seperator" /> -->

                <Button on:click={() => (zoomOpened = !zoomOpened)} title={$dictionary.actions?.zoom}>
                    <Icon size={1.3} id="zoomIn" white />
                </Button>
                {#if zoomOpened}
                    <div class="zoom_container" transition:slide={{ duration: 150 }}>
                        <Button style="padding: 0 !important;width: 100%;" on:click={() => (zoom = 1)} bold={false} center>
                            <p class="text" title={$dictionary.actions?.resetZoom}>{(100 / zoom).toFixed()}%</p>
                        </Button>
                        <Button disabled={zoom <= 0.2} on:click={() => (zoom = Number((zoom - 0.1).toFixed(2)))} title={$dictionary.actions?.zoomIn}>
                            <Icon size={1.3} id="add" white />
                        </Button>
                        <Button disabled={zoom >= 4} on:click={() => (zoom = Number((zoom + 0.1).toFixed(2)))} title={$dictionary.actions?.zoomOut}>
                            <Icon size={1.3} id="remove" white />
                        </Button>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .stageArea {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        /* overflow: hidden; */
    }

    .parent {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        /* padding: 10px; */
        overflow: auto;
    }

    .parent.noOverflow {
        overflow: hidden;
    }

    /* .bar {
        display: flex;
        justify-content: center;
        padding: 2px;
        width: 100%;
        background-color: var(--primary);
        border-top: 2px solid var(--primary-lighter);
    } */

    /* ACTION BAR */
    .actions {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--primary-darkest);
        /* border-top: 3px solid var(--primary-lighter); */
    }

    .actions :global(button.chordsActive) {
        background-color: var(--focus);
    }

    .leftActions {
        display: flex;
        overflow-x: auto;
        width: 100%;
    }

    /* fixed height for consistent heights */
    .actions :global(button) {
        min-height: 28px;
        padding: 0 0.8em !important;
    }

    /* .seperator {
        width: 2px;
        height: 100%;
        background-color: var(--primary);
    } */

    .text {
        opacity: 0.8;
        text-align: center;
        padding: 0.5em 0;
    }

    .zoom_container {
        position: absolute;
        inset-inline-end: 0;
        top: 0;
        transform: translateY(-100%);
        overflow: hidden;
        z-index: 30;

        flex-direction: column;
        width: auto;
        /* border-left: 3px solid var(--primary-lighter);
        border-top: 3px solid var(--primary-lighter); */
        background-color: inherit;
    }
</style>
