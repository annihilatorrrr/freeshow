<script lang="ts">
    import { dictionary, groups, outputs } from "../../../stores"
    import { getActiveOutputs } from "../../helpers/output"
    import { getGroupName } from "../../helpers/show"
    import { _show } from "../../helpers/shows"

    export let tracker: any
    export let autoSize: number = 0

    let type: "number" | "bar" | "group" = "number"
    $: type = tracker.type || "number"
    $: accent = tracker.accent

    $: outputId = getActiveOutputs()[0]
    $: currentSlideOut = $outputs[outputId]?.out?.slide || null
    $: currentShowId = currentSlideOut?.id || ""
    $: currentShowSlide = currentSlideOut?.index ?? -1
    $: currentLayoutRef = _show(currentShowId).layouts("active").ref()[0] || []
    $: currentShowSlides = _show(currentShowId).get("slides") || {}
    $: slidesLength = currentLayoutRef.length || 0

    // get custom group names
    $: layoutGroups = currentLayoutRef.map((a) => {
        let ref = a.parent || a
        let slide = currentShowSlides[ref.id]
        if (!slide) return { name: "—" }

        let group = slide.group
        if (slide.globalGroup && $groups[slide.globalGroup]) {
            group = $groups[slide.globalGroup].default ? $dictionary.groups?.[$groups[slide.globalGroup].name] : $groups[slide.globalGroup].name
        }

        let name = getGroupName({ show: _show(currentShowId).get(), showId: currentShowId }, ref.id, group, ref.layoutIndex)
        return { name: name || "—", index: ref.layoutIndex, child: a.type === "child" ? (currentLayoutRef[ref.layoutIndex]?.children || []).findIndex((id) => id === a.id) + 1 : 0 }
    })

    let progressElem: any = null
    $: column = progressElem?.offsetWidth < progressElem?.offsetHeight
</script>

<div class="progress" bind:this={progressElem} class:barBG={type === "bar"} style={accent ? "--accent: " + accent : ""}>
    {#if type === "number"}
        <p style={autoSize ? "font-size: " + autoSize + "px" : ""}><span style="color: var(--accent);">{currentShowSlide + 1}</span>/{slidesLength}</p>
    {:else if type === "bar"}
        <!-- progress bar -->
        <div class="bar" style="width: {slidesLength ? ((currentShowSlide + 1) / slidesLength) * 100 : 0}%;"></div>
    {:else if type === "group"}
        <!-- group sequence -->
        <!-- WIP new auto size here -->
        <div class="groups" class:column style={autoSize ? "font-size: " + autoSize / (column ? 1.2 : 2.8) + "px" : ""}>
            {#each layoutGroups as group}
                {#if !group.child}
                    {@const activeGroup = layoutGroups.find((a, i) => a.index === group.index && i === currentShowSlide)}
                    <div class="group" class:active={group.index === layoutGroups.find((_, i) => i === currentShowSlide).index}>
                        {group.name}
                        {#if activeGroup?.child}
                            <span style="opacity: 0.6;color: white;">{activeGroup.child + 1}</span>
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style>
    .progress {
        width: 100%;
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;

        --accent: var(--secondary);
    }

    .progress.barBG {
        justify-content: flex-start;
    }
    .bar {
        height: 100%;
        background-color: var(--accent);
        transition: width 0.5s;
    }

    .groups {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }
    .groups.column {
        flex-direction: column;
        text-align: left;
        width: 100%;
    }
    .group {
        transition: color 0.2s;
    }
    .group.active {
        color: var(--accent);
    }
</style>
