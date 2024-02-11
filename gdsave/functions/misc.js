function miscData(d) {

let miscStuff = {
    general: [
        { name: "Username", val: d.playerName },
        { name: "Account ID", val: d.accountID },
        { name: "Player ID", val: d.playerID },
        { name: "UDID", val: d.playerUDID },
        { name: "Music Volume", val: d.bgVolume, type: "percent" },
        { name: "SFX Volume", val: d.sfxVolume, type: "percent" },
        { name: "Menu Song", val: d.customMenuSongID, type: "num", default: "Default" },
        { name: "Practice Song", val: d.customPracticeSongID , type: "num", default: "Default" },
        { name: "Game Bootups", val: d.bootups, type: "num" },
        { name: "Cod3breaker Solution", val: d.cod3breakerSolution },
        { name: "Texture Quality", val: d.textureQuality, arr: ["Low", "Medium", "High"], bump: true },
        { name: "Fullscreen", val: d.settings.fullscreen, type: "bool" },
        { name: "VSync", val: d.settings.vsync, type: "bool" },
        { name: "Unlocked FPS", val: d.customFPSTarget, type: "num" },
        { name: "Mod Permissions", val: d.isMod, arr: ["None", "Moderator", "Elder Moderator"] }
    ],
    
    icons: [
        { name: "Cube", val: d.icons.cube },
        { name: "Ship", val: d.icons.ship },
        { name: "Ball", val: d.icons.ball },
        { name: "UFO", val: d.icons.ufo },
        { name: "Wave", val: d.icons.wave },
        { name: "Robot", val: d.icons.robot },
        { name: "Spider", val: d.icons.spider },
        { name: "Swing", val: d.icons.swing },
        { name: "Jetpack", val: d.icons.jetpack },
        { name: "Color", val: d.icons.color1, type: "num" },
        { name: "Color 2", val: d.icons.color2, type: "num" },
        { name: "Glow Color", val: d.icons.color3, type: "num" },
        { name: "Glow", val: d.icons.glow, type: "bool" },
        { name: "Trail", val: d.icons.trail },
        { name: "Ship Fire", val: d.icons.shipFire },
        { name: "Death Effect", val: d.icons.deathEffect },
        {},
        { name: "Default Mini Icon", val: d.settings.defualtMiniIcon, type: "bool" },
        { name: "Spider Teleport Color", val: d.settings.switchSpiderTeleportColor, arr: ["Col 2", "Col 1"] },
        { name: "Dash Fire Color", val: d.settings.switchDashFireColor, arr: ["Col 2", "Col 1"] },
        { name: "Wave Trail Color", val: d.settings.switchWaveTrailColor, arr: ["Col 1", "Col 2"] },
        { name: "Comment Form", val: d.playerIconType, arr: formTypes }
    ],

    events: [
        { name: "YouTube Chest Unlocked", val: d.events.youtubeChest },
        { name: "Facebook Chest Unlocked", val: d.events.facebookChest },
        { name: "Twitter Chest Unlocked", val: d.events.twitterChest },
        { name: "Twitch Chest Unlocked", val: d.events.twitchChest },
        { name: "Discord Chest Unlocked", val: d.events.discordChest },
        { name: "Reddit Chest Unlocked", val: d.events.redditChest },
        { name: "Online Levels Unlocked (GD World)", val: d.events.gdwOnlineUnlocked },
        {},
        { name: "Shopkeeper Dialogue (500 orbs)", val: d.events.shopkeeperDialogue },
        { name: "Scratch Dialogue", val: d.events.scratchDialogue },
        { name: "Scratch's Shop Unlocked", val: d.events.scratchShopUnlocked },
        { name: "Potbor Dialogue", val: d.events.potborDialogue },
        { name: "Community Shop Unlocked", val: d.events.communityShopUnlocked },
        { name: "Mechanic Dialogue", val: d.events.mechanicDialogue },
        { name: "Mechanic's Shop Unlocked", val: d.events.mechanicUnlocked },
        { name: "Diamond Shopkeeper Dialogue", val: d.events.diamondShopkeeperDialogue },
        { name: "Diamond Shop Unlocked", val: d.events.diamondShopUnlocked },
        { name: "Zolguroth Encountered", val: d.events.zolgurothEncountered },
        {},
        { name: "Explorers unlocked (Keymaster dialogue)", val: d.events.explorersUnlocked },
        { name: "The Challenge unlocked", val: d.events.challengeUnlocked },
        { name: "The Challenge completed", val: d.events.challengeCompleted },
        { name: "Treasure Room unlocked", val: d.events.treasureRoomUnlocked },
        { name: "Gatekeeper Dialogue", val: d.events.gatekeeperDialogue },
        { name: "Chamber of Time discovered", val: d.events.chamberOfTimeDiscovered },
        { name: "Chamber of Time unlocked", val: d.events.chamberOfTimeUnlocked },
        { name: "Glubfub Hint (from Keymaster)", val: d.events.glubfubHint1 },
        { name: "Glubfub Hint (from Spooky)", val: d.events.glubfubHint2 },
        {},
        { name: "Tower Clicked", val: d.events.towerClicked },
        { name: "Tower Entered", val: d.events.towerEntered },
        { name: "Tower Floor 1 Completed", val: d.events.towerFloor1Completed },
        {},
        { name: "Demon Guardian Discovered", val: d.events.monsterEncountered },
        { name: "Demon Guardian Dialogue", val: d.events.monsterDialogue },
        { name: "Demon Guardian Freed", val: d.events.monsterFreed },
        { name: "Blue Key Obtained (Chaos Gauntlet)", val: d.events.demonKey1 },
        { name: "Green Key Obtained (50 Chests)", val: d.events.demonKey2 },
        { name: "Orange Key Obtained (Gatekeeper)", val: d.events.demonKey3 },
        { name: "Master Emblem Obtained", val: d.events.foundMasterEmblem },
    ],

    onetime: [
        { name: "Accepted TOS", val: d.events.acceptedTOS },
        { name: "Accepted Newgrounds TOS", val: d.settings.acceptedSongTOS },
        { name: "Accepted Commenting Rules", val: d.settings.acceptedCommentRules },
        { name: "Clicked Editor", val: d.clickedEditor },
        { name: "Clicked Icon Kit", val: d.clickedIconKit },
        { name: "Clicked Practice Mode", val: d.clickedPractice },
        { name: "Clicked Username", val: d.clickedName },
        { name: "Showed Editor Guide", val: d.showedEditorGuide },
        { name: "Showed Star Rating Popup", val: d.showedRateStarDialog },
        { name: "Showed LDM Popup", val: d.showedLowDetailDialog },
        { name: "Showed Upload Level Popup", val: d.settings.showedUploadPopup },
        { name: "Showed View Profile Text", val: d.settings.showedProfileText },
        { name: "Showed Bronze Coins Popup", val: d.settings.showedUnverifiedCoinsMessage },
        { name: "Showed Unlisted Level Popup", val: d.settings.showedUnlistedLevelMessage },
        { name: "Showed Newgrounds Popup", val: d.settings.showedNGMessage },
        { name: "Rated Game", val: d.hasRatedGame }
        // { name: "Showed Difficulty Rating Popup", val: d.showedRateDiffDialog },  we don't 100% know what this one is
    ],

    editor: [
        { name: "Columns", val: d.settings.editor.columns, type: "val" },
        { name: "Rows", val: d.settings.editor.rows, type: "val" },
        { name: "Delete Filter Type", val: d.settings.editor.deleteFilter, arr: ["All", "Static", "Details", "Custom"] },
        { name: "Delete Filter Object ID", val: d.settings.editor.deleteObjectID, type: "val" },
        { name: "Custom Objects", val: Object.keys(d.customObjects || {}).length, type: "val" },
        {},
        { name: "Swipe", val: d.settings.editor.swipe },
        { name: "Rotate on Placement", val: d.settings.editor.rotateEnabled },
        { name: "Free Move", val: d.settings.editor.freeMove },
        { name: "Snap Free Move", val: d.settings.editor.snapEnabled },
        {},
        { name: "Preview Mode", val: d.settings.editor.previewMode },
        { name: "Show Ground", val: d.settings.editor.showGround },
        { name: "Show Object Info", val: d.settings.editor.showObjectInfo },
        { name: "Show Grid", val: d.settings.editor.showGrid },
        { name: "Show Grid on Top", val: d.settings.editor.gridOnTop },
        { name: "Show Song Lines", val: d.showSongMarkers },
        { name: "Show Trigger Lines", val: d.settings.editor.effectLines },
        { name: "Show Duration Lines", val: d.settings.editor.durationLines },
        { name: "Show Trigger Boxes", val: d.settings.editor.triggerBoxes },
        { name: "Show Hitboxes", val: d.settings.editor.debugDraw },
        { name: "Show Clicks", val: d.settings.editor.showClicks },
        { name: "Hide Path", val: d.settings.editor.hidePath },
        { name: "Hide Background", val: d.settings.editor.hideBackground },
        { name: "Hide Particle Icons", val: d.settings.editor.hideParticleIcons },
        {},
        { name: "Play Music on Test", val: d.settings.editor.playMusic },
        { name: "Hide UI on Test", val: d.settings.editor.hideUIOnTest },
        { name: "Hide Grid on Test", val: d.settings.editor.hideGridOnPlay },
        { name: "Follow Player on Test", val: d.settings.editor.followPlayer },
        { name: "Ignore Damage on Test", val: d.settings.editor.ignoreDamage },
        { name: "Smooth Fix on Test", val: d.settings.editor.editorSmoothFix },
        { name: "Higher Startpos Accuracy", val: d.settings.highStartPosAccuracy },
        { name: "Start Optimization", val: d.settings.editor.startOptimization },
        { name: "Auto Pause on Test", val: d.settings.editor.autoPause },
        {},
        { name: "Hold to Swipe", val: d.settings.editor.holdToSwipe },
        { name: "Swipe Cycle Mode", val: d.settings.editor.swipeCycleMode },
        { name: "Select Filter", val: d.settings.editor.selectFilter },
        { name: "Increased Max Undo", val: d.settings.increaseMaxUndo },
        { name: "Increased Scale limit", val: d.settings.editor.increaseScaleLimit },
        { name: "Disable Paste State Groups", val: d.settings.editor.disablePasteStateGroups },
        { name: "Enable Grouping", val: d.settings.editor.enableLinkControls },
        { name: "Enable Layer Locking", val: d.settings.editor.layerLocking },
        { name: "Editor Practice Music", val: d.settings.editor.unlockPracticeMusic },
    ]
}

Object.keys(miscStuff).forEach(n => {
    miscStuff[n].forEach(x => {
        if (!x.name) return $(`#misc-${n}`).append('<span class="fillerBreak"></span><br>')

        let valStr = x.val
        let isBool = x.type != "val" && (x.type == "bool" || ["onetime", "events", "editor"].includes(n))
        let valCol = "white"

        if (x.arr) valStr = x.arr[(x.val || 0) - (x.bump ? 1 : 0)] || "Unknown"
        else if (x.type == "percent") {
            valStr = Number((x.val * 100).toFixed(2)) + "%"
            let whiteness = 255 - (255 * x.val)
            valCol = `rgb(${whiteness}, 255, ${whiteness})`
        }
        else if (isBool) {
            if (x.val == "0") x.val = 0
            valStr = x.val ? "True" : "False"
            valCol = x.val ? "lime" : "red"
        }

        if (!valStr && valStr != 0) valStr = (x.default || (x.type == "num" ? "0" : "N/A"))

        $(`#misc-${n}`).append(`<span class="miscName">${x.name}:<span class="dotted"></span></span> <b style="color: ${valCol}">${valStr}</b><br>`)
    })
})

$('#forgorPassword').click(function() {
    if (!confirm("Reveal your account password?")) return
    if (!confirm("Are you sure?")) return
    
    let foundPassword = GameManagerXML.match(/<k>GJA_002<\/k><s>(.+?)<\/s>/)
    if (!foundPassword) return alert("Could not find a password!")
    else alert("Your password is: " + foundPassword[1])
})

}