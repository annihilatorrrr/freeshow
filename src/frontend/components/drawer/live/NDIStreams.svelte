<script lang="ts">
    import { onDestroy } from "svelte"
    import { NDI } from "../../../../types/Channels"
    import { outLocked, outputs } from "../../../stores"
    import { destroy, receive, send } from "../../../utils/request"
    import { getActiveOutputs, setOutput } from "../../helpers/output"
    import NDIStream from "./NDIStream.svelte"
    import { clearBackground } from "../../output/clear"
    import Center from "../../system/Center.svelte"
    import T from "../../helpers/T.svelte"

    let sources: any[] = []

    $: currentOutput = $outputs[getActiveOutputs()[0]] || {}

    const receiveNDI: any = {
        RECEIVE_LIST: (msg) => {
            if (!msg || sources.length) return

            sources = JSON.parse(msg).map(({ name, urlAddress }) => ({ name, id: urlAddress }))
        },
    }

    send(NDI, ["RECEIVE_LIST"])
    receive(NDI, receiveNDI, "NDI_CAPTURE")
    onDestroy(() => destroy(NDI, "NDI_CAPTURE"))
</script>

{#if sources.length}
    {#each sources as screen}
        <NDIStream
            {screen}
            on:click={(e) => {
                if ($outLocked || e.ctrlKey || e.metaKey) return
                if (currentOutput.out?.background?.id === screen.id) clearBackground()
                else setOutput("background", { id: screen.id, type: "ndi" })
            }}
        />
    {/each}
{:else}
    <Center faded>
        <T id="empty.general" />
    </Center>
{/if}
