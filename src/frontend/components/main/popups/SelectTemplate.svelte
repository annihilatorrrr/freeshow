<script lang="ts">
    import { onMount } from "svelte"
    import { activePopup, dictionary, outputs, popupData, styles, templates } from "../../../stores"
    import { translate } from "../../../utils/language"
    import { formatSearch } from "../../../utils/search"
    import Card from "../../drawer/Card.svelte"
    import TemplateSlide from "../../drawer/pages/TemplateSlide.svelte"
    import { clone, keysToID, sortByName } from "../../helpers/array"
    import { getResolution } from "../../helpers/output"
    import T from "../../helpers/T.svelte"
    import CombinedInput from "../../inputs/CombinedInput.svelte"
    import Dropdown from "../../inputs/Dropdown.svelte"
    import TextInput from "../../inputs/TextInput.svelte"
    import Center from "../../system/Center.svelte"
    import Loader from "../Loader.svelte"
    import Button from "../../inputs/Button.svelte"
    import Icon from "../../helpers/Icon.svelte"

    let revert = $popupData.revert

    $: hideIds = $popupData.hideIds || []
    $: sortedTemplates = sortByName(keysToID($templates).filter((a) => !hideIds.includes(a.id)))

    $: defaultTemplates = clone(sortedTemplates)
    $: if (defaultTemplates) search()

    $: active = $popupData.active || ""

    // multiple types (scripture)
    let types: any[] = []
    $: types = $popupData.types || []
    $: values = $popupData.values || []

    let selectedType = types[0]?.id || ""

    $: customTypes = types.length > 1
    $: value = customTypes ? values[types.findIndex((a) => a.id === selectedType)] || "" : active

    let searchedTemplates = clone(defaultTemplates)
    let searchValue = ""
    // let previousSearchValue = ""
    function search(e: any = null) {
        // preloader = true
        // setTimeout(() => (preloader = false), 20)

        searchValue = formatSearch(e?.target?.value || "")

        if (searchValue.length < 2) {
            searchedTemplates = clone(defaultTemplates)
            return
        }

        let currentTemplatesList = clone(defaultTemplates) // searchedTemplates
        // reset if search value changed
        // if (!searchValue.includes(previousSearchValue)) currentTemplatesList = clone(defaultTemplates)

        searchedTemplates = currentTemplatesList.filter((a) => formatSearch(a.name || "").includes(searchValue))

        // previousSearchValue = searchValue
    }

    function selectTemplate(template: any, keyboard = false) {
        if ($popupData.action !== "select_template") return

        let previousValue = value
        // update before closing
        value = template.id

        setTimeout(() => {
            if ($popupData.trigger) {
                $popupData.trigger(value, selectedType)
                // } else {
                //     popupData.set({ ...$popupData, templateId: value })
            }

            if ($popupData.doubleClick && !keyboard && previousValue !== template.id) return

            if (!revert) setTimeout(() => popupData.set({}), 500) // revert after closing
            activePopup.set(revert || null)
        })
    }

    let resolution = getResolution(null, { $outputs, $styles })

    function chooseTemplate(e: any) {
        if (e.key !== "Enter" || !searchValue.length || !searchedTemplates.length) return
        selectTemplate(searchedTemplates[0], true)
    }

    // open drawer tab instantly before content has loaded
    let preloader = true
    onMount(() => setTimeout(() => (preloader = false), 20))
</script>

<svelte:window on:keydown={chooseTemplate} />

{#if revert}
    <Button class="popup-back" title={$dictionary.actions?.back} on:click={() => activePopup.set(revert)}>
        <Icon id="back" size={2} white />
    </Button>
{/if}

<CombinedInput style="border-bottom: 2px solid var(--secondary);">
    <TextInput placeholder={$dictionary.main?.search} value="" on:input={search} autofocus />
</CombinedInput>

{#if customTypes}
    <CombinedInput>
        <p><T id="songbeamer_import.translations" /></p>
        <Dropdown options={types} value={types.find((a) => a.id === selectedType)?.name || ""} on:click={(e) => (selectedType = e.detail.id)} />
    </CombinedInput>
{/if}

<div style="position: relative;height: 100%;width: calc(100vw - (var(--navigation-width) + 20px) * 2);overflow-y: auto;">
    {#if preloader && sortedTemplates.length > 10}
        <Center style="height: 100px;padding-top: 20px;">
            <Loader />
        </Center>
    {:else if searchedTemplates.length}
        <div class="grid">
            {#if customTypes && selectedType !== types[0]?.id}
                <Card active={!value} label={translate("example.default")} icon="star" {resolution} on:click={() => selectTemplate("")}>
                    <!--  -->
                </Card>
            {/if}

            {#each searchedTemplates as template, i}
                <Card preview={!!(searchValue.length && i === 0)} active={value === template.id} label={template.name} color={template.color} {resolution} on:click={() => selectTemplate(template)}>
                    <TemplateSlide templateId={template.id} {template} preview />
                </Card>
            {/each}
        </div>
    {:else}
        <Center size={1.2} faded style="height: 100px;padding-top: 20px;">
            {#if sortedTemplates.length}
                <T id="empty.search" />
            {:else}
                <T id="empty.general" />
            {/if}
        </Center>
    {/if}
</div>

<style>
    .grid {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        padding: 5px;
        place-content: flex-start;
    }
</style>
