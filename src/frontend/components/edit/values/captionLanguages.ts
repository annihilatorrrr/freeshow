// auto get a list with all languages
// let langs = {};
// [...(document.querySelector(".list").children)].forEach(tr => {
//     let name = tr.children[0].innerText
//     let id = tr.children[1].innerText
//     langs[id] = name
// })
// console.log(Object.entries(langs).map(([id, name]) => ({id, name})))

// https://cloud.google.com/speech-to-text/docs/languages
export const captionLanguages = [
    { id: "af-ZA", name: "Afrikaans (South Africa)" },
    { id: "sq-AL", name: "Albanian (Albania)" },
    { id: "am-ET", name: "Amharic (Ethiopia)" },
    { id: "ar-DZ", name: "Arabic (Algeria)" },
    { id: "ar-BH", name: "Arabic (Bahrain)" },
    { id: "ar-EG", name: "Arabic (Egypt)" },
    { id: "ar-IQ", name: "Arabic (Iraq)" },
    { id: "ar-IL", name: "Arabic (Israel)" },
    { id: "ar-JO", name: "Arabic (Jordan)" },
    { id: "ar-KW", name: "Arabic (Kuwait)" },
    { id: "ar-LB", name: "Arabic (Lebanon)" },
    { id: "ar-MR", name: "Arabic (Mauritania)" },
    { id: "ar-MA", name: "Arabic (Morocco)" },
    { id: "ar-OM", name: "Arabic (Oman)" },
    { id: "ar-QA", name: "Arabic (Qatar)" },
    { id: "ar-SA", name: "Arabic (Saudi Arabia)" },
    { id: "ar-PS", name: "Arabic (State of Palestine)" },
    { id: "ar-SY", name: "Arabic (Syria)" },
    { id: "ar-TN", name: "Arabic (Tunisia)" },
    { id: "ar-AE", name: "Arabic (United Arab Emirates)" },
    { id: "ar-YE", name: "Arabic (Yemen)" },
    { id: "hy-AM", name: "Armenian (Armenia)" },
    { id: "az-AZ", name: "Azerbaijani (Azerbaijan)" },
    { id: "eu-ES", name: "Basque (Spain)" },
    { id: "bn-BD", name: "Bengali (Bangladesh)" },
    { id: "bn-IN", name: "Bengali (India)" },
    { id: "bs-BA", name: "Bosnian (Bosnia and Herzegovina)" },
    { id: "bg-BG", name: "Bulgarian (Bulgaria)" },
    { id: "my-MM", name: "Burmese (Myanmar)" },
    { id: "ca-ES", name: "Catalan (Spain)" },
    { id: "cmn-Hans-CN", name: "Chinese (Simplified, China)" },
    { id: "cmn-Hans-HK", name: "Chinese (Simplified, Hong Kong)" },
    { id: "cmn-Hant-TW", name: "Chinese (Traditional, Taiwan)" },
    { id: "yue-Hant-HK", name: "Chinese, Cantonese (Traditional Hong Kong)" },
    { id: "hr-HR", name: "Croatian (Croatia)" },
    { id: "cs-CZ", name: "Czech (Czech Republic)" },
    { id: "da-DK", name: "Danish (Denmark)" },
    { id: "nl-BE", name: "Dutch (Belgium)" },
    { id: "nl-NL", name: "Dutch (Netherlands)" },
    { id: "en-AU", name: "English (Australia)" },
    { id: "en-CA", name: "English (Canada)" },
    { id: "en-GH", name: "English (Ghana)" },
    { id: "en-HK", name: "English (Hong Kong)" },
    { id: "en-IN", name: "English (India)" },
    { id: "en-IE", name: "English (Ireland)" },
    { id: "en-KE", name: "English (Kenya)" },
    { id: "en-NZ", name: "English (New Zealand)" },
    { id: "en-NG", name: "English (Nigeria)" },
    { id: "en-PK", name: "English (Pakistan)" },
    { id: "en-PH", name: "English (Philippines)" },
    { id: "en-SG", name: "English (Singapore)" },
    { id: "en-ZA", name: "English (South Africa)" },
    { id: "en-TZ", name: "English (Tanzania)" },
    { id: "en-GB", name: "English (United Kingdom)" },
    { id: "en-US", name: "English (United States)" },
    { id: "et-EE", name: "Estonian (Estonia)" },
    { id: "fil-PH", name: "Filipino (Philippines)" },
    { id: "fi-FI", name: "Finnish (Finland)" },
    { id: "fr-BE", name: "French (Belgium)" },
    { id: "fr-CA", name: "French (Canada)" },
    { id: "fr-FR", name: "French (France)" },
    { id: "fr-CH", name: "French (Switzerland)" },
    { id: "gl-ES", name: "Galician (Spain)" },
    { id: "ka-GE", name: "Georgian (Georgia)" },
    { id: "de-AT", name: "German (Austria)" },
    { id: "de-DE", name: "German (Germany)" },
    { id: "de-CH", name: "German (Switzerland)" },
    { id: "el-GR", name: "Greek (Greece)" },
    { id: "gu-IN", name: "Gujarati (India)" },
    { id: "iw-IL", name: "Hebrew (Israel)" },
    { id: "hi-IN", name: "Hindi (India)" },
    { id: "hu-HU", name: "Hungarian (Hungary)" },
    { id: "is-IS", name: "Icelandic (Iceland)" },
    { id: "id-ID", name: "Indonesian (Indonesia)" },
    { id: "it-IT", name: "Italian (Italy)" },
    { id: "it-CH", name: "Italian (Switzerland)" },
    { id: "ja-JP", name: "Japanese (Japan)" },
    { id: "jv-ID", name: "Javanese (Indonesia)" },
    { id: "kn-IN", name: "Kannada (India)" },
    { id: "kk-KZ", name: "Kazakh (Kazakhstan)" },
    { id: "km-KH", name: "Khmer (Cambodia)" },
    { id: "rw-RW", name: "Kinyarwanda (Rwanda)" },
    { id: "ko-KR", name: "Korean (South Korea)" },
    { id: "lo-LA", name: "Lao (Laos)" },
    { id: "lv-LV", name: "Latvian (Latvia)" },
    { id: "lt-LT", name: "Lithuanian (Lithuania)" },
    { id: "mk-MK", name: "Macedonian (North Macedonia)" },
    { id: "ms-MY", name: "Malay (Malaysia)" },
    { id: "ml-IN", name: "Malayalam (India)" },
    { id: "mr-IN", name: "Marathi (India)" },
    { id: "mn-MN", name: "Mongolian (Mongolia)" },
    { id: "ne-NP", name: "Nepali (Nepal)" },
    { id: "no-NO", name: "Norwegian Bokmål (Norway)" },
    { id: "fa-IR", name: "Persian (Iran)" },
    { id: "pl-PL", name: "Polish (Poland)" },
    { id: "pt-BR", name: "Portuguese (Brazil)" },
    { id: "pt-PT", name: "Portuguese (Portugal)" },
    { id: "pa-Guru-IN", name: "Punjabi (Gurmukhi India)" },
    { id: "ro-RO", name: "Romanian (Romania)" },
    { id: "ru-RU", name: "Russian (Russia)" },
    { id: "sr-RS", name: "Serbian (Serbia)" },
    { id: "si-LK", name: "Sinhala (Sri Lanka)" },
    { id: "sk-SK", name: "Slovak (Slovakia)" },
    { id: "sl-SI", name: "Slovenian (Slovenia)" },
    { id: "st-ZA", name: "Southern Sotho (South Africa)" },
    { id: "es-AR", name: "Spanish (Argentina)" },
    { id: "es-BO", name: "Spanish (Bolivia)" },
    { id: "es-CL", name: "Spanish (Chile)" },
    { id: "es-CO", name: "Spanish (Colombia)" },
    { id: "es-CR", name: "Spanish (Costa Rica)" },
    { id: "es-DO", name: "Spanish (Dominican Republic)" },
    { id: "es-EC", name: "Spanish (Ecuador)" },
    { id: "es-SV", name: "Spanish (El Salvador)" },
    { id: "es-GT", name: "Spanish (Guatemala)" },
    { id: "es-HN", name: "Spanish (Honduras)" },
    { id: "es-MX", name: "Spanish (Mexico)" },
    { id: "es-NI", name: "Spanish (Nicaragua)" },
    { id: "es-PA", name: "Spanish (Panama)" },
    { id: "es-PY", name: "Spanish (Paraguay)" },
    { id: "es-PE", name: "Spanish (Peru)" },
    { id: "es-PR", name: "Spanish (Puerto Rico)" },
    { id: "es-ES", name: "Spanish (Spain)" },
    { id: "es-US", name: "Spanish (United States)" },
    { id: "es-UY", name: "Spanish (Uruguay)" },
    { id: "es-VE", name: "Spanish (Venezuela)" },
    { id: "su-ID", name: "Sundanese (Indonesia)" },
    { id: "sw-KE", name: "Swahili (Kenya)" },
    { id: "sw-TZ", name: "Swahili (Tanzania)" },
    { id: "ss-Latn-ZA", name: "Swati (Latin, South Africa)" },
    { id: "sv-SE", name: "Swedish (Sweden)" },
    { id: "ta-IN", name: "Tamil (India)" },
    { id: "ta-MY", name: "Tamil (Malaysia)" },
    { id: "ta-SG", name: "Tamil (Singapore)" },
    { id: "ta-LK", name: "Tamil (Sri Lanka)" },
    { id: "te-IN", name: "Telugu (India)" },
    { id: "th-TH", name: "Thai (Thailand)" },
    { id: "ts-ZA", name: "Tsonga (South Africa)" },
    { id: "tn-Latn-ZA", name: "Tswana (Latin, South Africa)" },
    { id: "tr-TR", name: "Turkish (Turkey)" },
    { id: "uk-UA", name: "Ukrainian (Ukraine)" },
    { id: "ur-IN", name: "Urdu (India)" },
    { id: "ur-PK", name: "Urdu (Pakistan)" },
    { id: "uz-UZ", name: "Uzbek (Uzbekistan)" },
    { id: "ve-ZA", name: "Venda (South Africa)" },
    { id: "vi-VN", name: "Vietnamese (Vietnam)" },
    { id: "xh-ZA", name: "Xhosa (South Africa)" },
    { id: "zu-ZA", name: "Zulu (South Africa)" },
]

// https://github.com/mozilla/translate - MPL 2.0 - Mozilla
export const captionTranslateLanguages = [
    // { id: "none", name: "$:main.none:$" },
    { id: "", name: "—" },
    { id: "bg", name: "Bulgarian" },
    { id: "cs", name: "Czech" },
    { id: "nl", name: "Dutch" },
    { id: "en", name: "English" },
    { id: "et", name: "Estonian" },
    { id: "de", name: "German" },
    { id: "fr", name: "French" },
    { id: "is", name: "Icelandic" },
    { id: "it", name: "Italian" },
    { id: "nb", name: "Norwegian Bokmål" },
    { id: "nn", name: "Norwegian Nynorsk" },
    { id: "fa", name: "Persian" },
    { id: "pl", name: "Polish" },
    { id: "pt", name: "Portuguese" },
    { id: "ru", name: "Russian" },
    { id: "es", name: "Spanish" },
    { id: "uk", name: "Ukrainian" },
]
