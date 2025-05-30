import { get } from "svelte/store"
import { OUTPUT } from "../../types/Channels"
import { Main } from "../../types/IPC/Main"
import type { Dictionary } from "../../types/Settings"
import { sendMain } from "../IPC/main"
import { currentWindow, dictionary, language, localeDirection } from "../stores"
import { replace } from "./languageData"
import { send } from "./request"

// https://medium.com/i18n-and-l10n-resources-for-developers/a-step-by-step-guide-to-svelte-localization-with-svelte-i18n-v3-2c3ff0d645b8
// https://github.com/kaisermann/svelte-i18n/blob/70725828bd3aa2ba77fe37dccb2890c57b27f6e4/src/cli/includes/deepSet.ts#L5
// https://github.com/kaisermann/svelte-i18n/blob/main/docs/Getting%20Started.md
// https://lokalise.com/blog/svelte-i18n/

const defaultPath = "./lang/en.json"

// WIP right to left
// const dir = derived(language, ($locale) => ($locale === "ar" ? "rtl" : "ltr"))

function setLanguage(locale = "", init = false) {
    if (!locale) {
        // locale = getLocaleFromHostname(/^(.*?)\./) || getLocaleFromPathname(/^\/(.*?)\//) || getLocaleFromNavigator() || getLocaleFromHash('lang') || 'en';
        // locale = window.navigator.userLanguage || window.navigator.language || 'en';
        locale = window.navigator.language
        Object.keys(replace).forEach((key) => {
            if (replace[key].includes(locale)) locale = key
        })
    }

    if (!replace[locale]) locale = "en"
    language.set(locale)

    const rtlLanguages = ["ar", "fa", "he", "ur"]
    localeDirection.set(rtlLanguages.includes(locale) ? "rtl" : "ltr")

    const url = defaultPath.replace("en", locale)
    fetch(url)
        .then((response) => response.json())
        .then(returnedFile)

    async function returnedFile(messages: Dictionary) {
        // replace any missing keys in dictionary with fallback english string
        if (locale !== "en") {
            const defaultStrings = await (await fetch(defaultPath)).json()

            Object.keys(defaultStrings).forEach((key) => {
                if (!messages[key]) messages[key] = defaultStrings[key]
                else {
                    Object.keys(defaultStrings[key]).forEach((stringId) => {
                        if (!messages[key]) messages[key] = defaultStrings[key] || {}
                        if (!messages[key]![stringId]) messages[key]![stringId] = defaultStrings[key][stringId]
                    })
                }
            })
        }

        // a new language might have loaded
        if (init && get(language) !== "en" && get(language) !== locale) return

        dictionary.set(messages)
        if (init || get(currentWindow)) return

        language.set(locale)

        const msg = { lang: locale, strings: messages }
        sendMain(Main.LANGUAGE, msg)
        // remoteTalk.ts sends this
        // send(REMOTE, ["LANGUAGE"], msg)
        // wait until loaded
        setTimeout(() => {
            send(OUTPUT, ["LANGUAGE"], locale)
        }, 3000)
    }
}

const translate = (id: string, { parts = false } = {}) => {
    if (typeof id !== "string") return ""

    const d = get(dictionary)

    if (!parts) {
        const splittedKey = id.split(".")
        return d[splittedKey[0]]?.[splittedKey[1]] || ""
    }

    if (!id.includes("$:")) return id

    // TODO: use regex for this
    const pre = id.slice(0, id.indexOf("$:"))
    const suf = id.slice(id.indexOf(":$") + 2, id.length)
    id = id.slice(id.indexOf("$:") + 2, id.indexOf(":$"))

    const category: string = id.slice(0, id.indexOf("."))
    const key = id.slice(id.indexOf(".") + 1, id.length)

    id = d[category]?.[key] || `[${id}]`

    return `${pre}${id}${suf}`
}

export { setLanguage, translate }

// Chinese, Japanese, and Korean should use full width brackets: "（" / "）"
const fullWidth = ["zh", "ja", "ko"]
export const getLeftParenthesis = () => (fullWidth.find((id) => get(language).includes(id)) ? "（" : "(")
export const getRightParenthesis = () => (fullWidth.find((id) => get(language).includes(id)) ? "）" : ")")
