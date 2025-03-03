export type SaveList = SaveListSettings | SaveListSyncedSettings | "themes" | "events" | "templates" | "overlays" | "driveKeys"

export type SaveListSyncedSettings =
    | "categories"
    | "drawSettings"
    | "overlayCategories"
    | "templateCategories"
    | "timers"
    | "variables"
    | "triggers"
    | "audioStreams"
    | "audioPlaylists"
    | "scriptures"
    | "scriptureSettings"
    | "groups"
    | "midiIn"
    | "emitters"
    | "playerVideos"
    | "videoMarkers"
    | "mediaTags"
    | "actionTags"
    | "customizedIcons"
    | "companion"
    | "globalTags"
    | "customMetadata"

export type SaveListSettings =
    | "initialized"
    | "activeProject"
    | "alertUpdates"
    | "audioFolders"
    | "autoOutput"
    | "autosave"
    | "timeFormat"
    | "showsPath"
    | "dataPath"
    | "lockedOverlays"
    | "drawer"
    | "drawerTabsData"
    | "groupNumbers"
    | "fullColors"
    | "formatNewShow"
    | "labelsDisabled"
    | "language"
    | "maxConnections"
    | "mediaFolders"
    | "mediaOptions"
    | "openedFolders"
    | "outputs"
    | "sorted"
    | "styles"
    | "outLocked"
    | "ports"
    | "disabledServers"
    | "serverData"
    | "remotePassword"
    | "resized"
    | "slidesOptions"
    | "splitLines"
    | "theme"
    | "transitionData"
    | "volume"
    | "gain"
    | "driveData"
    | "calendarAddShow"
    | "metronome"
    | "special"
