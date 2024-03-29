let orbAmounts = [0, 0, 50, 75, 125, 175, 225, 275, 350, 425, 500]
let demonTypes = ["Unknown", "Hard", "Unknown", "Easy", "Medium", "Insane", "Extreme"]
let formTypes = ["Cube", "Ship", "Ball", "UFO", "Wave", "Robot", "Spider", "Swing", "Jetpack"]
let typeColors = {"Daily": "#ff8000", "Weekly": "#da0000", "Gauntlet": "salmon", "Official": "cyan", "Online": "lime"}
let ratingColors = {"Official": "cyan", "Featured": "yellow", "Starred": "#ffffbb", "Rated": "#ffffbb", "Unrated": "white", "Unavailable": "gray",
                    "Epic": "#ff8000", "Legendary": "#FFB4FF", "Mythic": "cyan" }

let keys = {

    "GS_value": "stats",
    "GS_completed": "completedLevels",
    "GS_3": "userCoins",
    "GS_4": "bronzeUserCoins",
    "GS_5": "mapPackStars",
    "GS_6": "shopPurchases",
    "GS_7": "levelProgress",
    "GS_8": "[unused]",
    "GS_9": "levelStars",
    "GS_10": "officialLevelProgress",
    "GS_11": "dailyRewards",
    "GS_12": "quests",
    "GS_13": "[unused]",
    "GS_14": "questRewards",
    "GS_15": "queuedQuests",
    "GS_16": "dailyProgress",
    "GS_17": "dailyStars",
    "GS_18": "gauntletProgress",
    "GS_19": "treasureRoomRewards",
    "GS_20": "totalDemonKeys",
    "GS_21": "rewards",
    "GS_22": "gdWorldRewards",
    "GS_23": "gauntletProgress2",
    "GS_24": "dailyProgress2",
    "GS_25": "weeklyRewards",
    "GS_26": "activePath",
    "GS_27": "completedLists",
    "GS_28": "enabledItems",

    "GLM_01": "officialLevels",
    "GLM_02": "uploadedLevels",
    "GLM_03": "onlineLevels",
    "GLM_04": "starredLevels",
    "GLM_05": "[unused]",
    "GLM_06": "followedAccounts",
    "GLM_07": "recentlyPlayed",
    "GLM_08": "enabledSearchFilters",
    "GLM_09": "availableSearchFilters",
    "GLM_10": "timelyLevels",
    "GLM_11": "dailyID",
    "GLM_12": "likes",
    "GLM_13": "ratedLevels",
    "GLM_14": "reportedLevels",
    "GLM_15": "ratedDemons",
    "GLM_16": "gauntlets",
    "GLM_17": "weeklyID",
    "GLM_18": "levelFolders",
    "GLM_19": "createdLevelFolders",
    "GLM_20": "smartTemplates",

    "GJA_001": "username",
    "GJA_002": "password",
    "GJA_003": "accountID",
    "GJA_004": "sessionID",
    "GJA_005": "newPassword",

    "LLM_01": "localLevels",
    "LLM_02": "binaryVersion",

    "MDLM_001": "songInfo",
    "MDLM_002": "songPriority",

    "KBM_001": "keybinds",
    "KBM_002": "keybinds2",

    "texQuality": "textureQuality",
    "customObjectDict": "customObjects",
    "playerUserID": "playerID",
    "reportedAchievements": "achievements",
    "secretNumber": "cod3breakerSolution",
    "clickedGarage": "clickedIconKit",
    "hasRP": "isMod"
}

let kcekKeys = {
    4: "level",
    6: "song",
    7: "quest",
    8: "reward",
    9: "rewardData",
    10: "smartTemplates",
    12: "lists"
}

let statKeys = {
    1: "jumps",
    2: "attempts",
    3: "officialLevelsCompleted",
    4: "onlineLevelsCompleted",
    5: "demons",
    6: "stars",
    7: "mapPacks",
    8: "coins",
    9: "destroyedPlayers",
    10: "likedLevels",
    11: "ratedLevels",
    12: "userCoins",
    13: "diamonds",
    14: "orbs",
    15: "completedDailies",
    16: "fireShards",
    17: "iceShards",
    18: "poisonShards",
    19: "shadowShards",
    20: "lavaShards",
    21: "demonKeys",
    22: "totalOrbs",
    23: "earthShards",
    24: "bloodShards",
    25: "metalShards",
    26: "lightShards",
    27: "soulShards",
    28: "moons",
    29: "spendableDiamonds",
    30: "firePath",
    31: "icePath",
    32: "poisonPath",
    33: "shadowPath",
    34: "lavaPath",
    35: "earthPath",
    36: "bloodPath",
    37: "metalPath",
    38: "lightPath",
    39: "soulPath",
    40: "gauntlets",
    41: "listRewards"
}

let questKeys = {
    1: { name: "itemType", bump: ["orbs", "coins", "stars"] },
    2: "obtainedItems",
    3: "requiredItems",
    4: "diamonds",
    5: "timeLeft",
    6: "active",
    7: "name",
    8: "tier"
}

let songKeys = {
    1: "id",
    2: "name",
    3: "artistID",
    4: "artist",
    5: "size",
    6: "youtubeID",
    7: "youtubeChannel",
    8: "scouted",
    9: "priority",
    10: "url"
}

let chestKeys = {
    1: "id",
    2: { name: "chest", bump: ["small", "large", "1key", "5key", "10key", "25key", "50key", "100key"] },
    3: "rewards"
}

let rewardKeys = {
    1: { name: "item", bump: ["Fire Shard", "Ice Shard", "Poison Shard", "Shadow Shard", "Lava Shard", "Demon Key", "Mana Orbs", "Diamonds", "Icon", "Earth Shard", "Blood Shard", "Metal Shard", "Light Shard", "Soul Shard", "unknown15", "unknown16"] },
    2: "iconID",
    3: "amount",
    4: { name: "iconForm", bump: ["cube", "color1", "color2", "ship", "ball", "ufo", "wave", "robot", "spider", "trail", "deathEffect", "storyItem", "swing", "jetpack", "shipFire"] }
}

let specialItems = {
    1: "blueKey",
    2: "greenKey",
    3: "orangeKey",
    4: "masterEmblem",
    5: "demonGauntletKey",
    6: "firePath",
    7: "icePath",
    8: "poisonPath",
    9: "shadowPath",
    10: "lavaPath",
    11: "earthPath",
    12: "bloodPath",
    13: "metalPath",
    14: "lightPath",
    15: "soulPath",
    16: "musicCustomizer",
    17: "musicUnlocker",
    18: "robotAnimationSlow",
    19: "robotAnimationFast",
    20: "spiderAnimationFast"
}

let starDifficulties = ["Unrated", "Auto", "Easy", "Normal", "Hard", "Hard", "Harder", "Harder", "Insane", "Insane", "Demon"] 

let levelKeys = {
    "k1": "id",
    "k2": "name",
    "k3": { name: "description", b64: true },
    "k4": "levelData",
    "k5": "author",
    "k6": "playerID",
    "k7": { name: "difficulty", bump: ["Easy", "Normal", "Hard", "Harder", "Insane", "Demon"] },
    "k8": "officialSongID",
    "k9": "ratingScore1",
    "k10": "ratingScore2",
    "k11": "downloads",
    "k12": "completions",
    "k13": "editable",
    "k14": "verified",
    "k15": "uploaded",
    "k16": "version",
    "k17": "gameVersion",
    "k18": "attempts",
    "k19": "percentage",
    "k20": "practicePercentage",
    "k21": { name: "levelType", bump: ["official", "local", "saved", "online"] },
    "k22": "likes",
    "k23": { name: "length", arr: ["Tiny", "Short", "Medium", "Long", "XL", "Platformer"] },
    "k24": "dislikes",
    "k25": "demon",
    "k26": "stars",
    "k27": "featuredPosition",
    "k33": "auto",
    "k34": "replayData",
    "k35": "playable",
    "k36": "jumps",
    "k37": "secretCoinsToUnlock",
    "k38": "levelUnlocked",
    "k41": "password",
    "k42": "copiedID",
    "k43": "twoPlayer",
    "k45": "customSongID",
    "k46": "revision",
    "k47": "edited",
    "k48": "objects",
    "k50": "binaryVersion",
    "k60": "accountID",
    "k61": "firstCoinCollected",
    "k62": "secondCoinCollected",
    "k63": "thirdCoinCollected",
    "k64": "totalCoins",
    "k65": "verifiedCoins",
    "k66": "requestedStars",
    "k67": "extraString",
    "k68": "antiCheatTriggered",
    "k69": "large",
    "k71": "manaOrbPercentage",
    "k72": "ldm",
    "k73": "ldmEnabled",
    "k74": "timelyID",
    "k75": { name: "epic", arr: ["None", "Epic", "Legendary", "Mythic"] },
    "k76": "demonType",
    "k77": "isGauntlet",
    "k78": "isGauntlet2",
    "k79": "unlisted",
    "k80": "editorTime",
    "k81": "totalEditorTime",
    "k82": "favorited",
    "k83": "savedLevelIndex",
    "k84": "folder",
    "k85": "clicks",
    "k86": "bestAttemptTime",
    "k87": "seed",
    "k88": "scores",
    "k89": "leaderboardValid",
    "k90": "leaderboardPercentage",
    "k95": "ticksToComplete",
    "k104": "usedSongs",
    "k105": "usedSFX",
    "k107": "bestTime",
    "k108": "bestPoints",
    "k109": "localTimes",
    "k110": "localScores",
    "k112": "disableShake",

    "kI1": "editorCameraX",
    "kI2": "editorCameraY",
    "kI3": "editorCameraZoom",
    "kI4": "editorBuildTabPage",
    "kI5": "editorBuildTabCategory",
    "kI6": "editorRecentPages",
    "kI7": "editorLayer"
}

let gameVariables = {
    "0001": "editor.followPlayer",
    "0002": "editor.playMusic",
    "0003": "editor.swipe",
    "0004": "editor.freeMove",
    "0005": "editor.deleteFilter",
    "0006": "editor.deleteObjectID",
    "0007": "editor.rotateEnabled",
    "0008": "editor.snapEnabled",
    "0009": "editor.ignoreDamage",
    "0010": "flip2PlayerControls",
    "0011": "alwaysLimitControls",
    "0012": "acceptedCommentRules",
    "0013": "increaseMaxUndo",
    "0014": "disableExplosionShake",
    "0015": "flipPauseButton",
    "0016": "acceptedSongTOS",
    "0018": "noSongLimit",
    "0019": "loadSongsToMemory",
    "0022": "higherAudioQuality",
    "0023": "smoothFix",
    "0024": "showCursor",
    "0025": "fullscreen",
    "0026": "autoRetry",
    "0027": "autoCheckpoints",
    "0028": "disableThumbstick",
    "0029": "showedUploadPopup",
    "0030": "vsync",
    "0033": "changeSongLocation",
    "0034": "gameCenter",
    "0036": "editor.previewMode",
    "0037": "editor.showGround",
    "0038": "editor.showGrid",
    "0039": "editor.gridOnTop",
    "0040": "showPercentage",
    "0041": "editor.showObjectInfo",
    "0042": "increaseMaxLevels",
    "0043": "editor.effectLines",
    "0044": "editor.triggerBoxes",
    "0045": "editor.debugDraw",
    "0046": "editor.hideUIOnTest",
    "0047": "showedProfileText",
    "0049": "editor.columns",
    "0050": "editor.rows",
    "0051": "showedNGMessage",
    "0052": "fastRespawn",
    "0053": "showedFreeGamesPopup",
    "0056": "disableHighObjectAlert",
    "0057": "editor.holdToSwipe",
    "0058": "editor.durationLines",
    "0059": "editor.swipeCycleMode",
    "0060": "defaultMiniIcon",
    "0061": "switchSpiderTeleportColor",
    "0062": "switchDashFireColor",
    "0063": "showedUnverifiedCoinsMessage",
    "0064": "editor.selectFilter",
    "0065": "enableMoveOptimization",
    "0066": "highCapacityMode",
    "0067": "highStartPosAccuracy",
    "0068": "quickCheckpointMode",
    "0069": "commentMode",
    "0070": "showedUnlistedLevelMessage",
    "0072": "disableGravityEffect",
    "0073": "newCompletedFilter",
    "0074": "showRestartButton",
    "0075": "parental.disableComments",
    "0076": "parental.disableAccountComments",
    "0077": "parental.featuredLevelsOnly",
    "0078": "editor.hideBackground",
    "0079": "editor.hideGridOnPlay",
    "0081": "disableShake",
    "0082": "disableHighObjectAlert",
    "0083": "disableSongAlert",
    "0084": "manualOrder",
    "0088": "compactComments",
    "0089": "extendedInfoMode",
    "0090": "autoLoadComments",
    "0091": "createdLevelFolder",
    "0092": "savedLevelFolder",
    "0093": "increaseLevelsPerPage",
    "0094": "moreComments",
    "0094": "doNot",
    "0096": "switchWaveTrailColor",
    "0097": "editor.enableLinkControls",
    "0098": "levelLeaderboardType",
    "0099": "showLeaderboardPercent",
    "0100": "practiceDeathEffect",
    "0101": "forceSmoothFix",
    "0102": "editor.editorSmoothFix",
    "0103": "editor.layerLocking",
    "0108": "autoEnableLowDetail",
    "0112": "editor.increaseScaleLimit",
    "0119": "dontSaveLevels",
    "0125": "editor.unlockPracticeMusic",
    "0126": "decimalPercentage",
    "0127": "saveGauntletLevels",
    "0129": "disablePortalLabels",
    "0130": "enableOrbLabels",
    "0134": "hideAttemptsPractice",
    "0135": "hideAttempts",
    "0136": "extraLDM",
    "0137": "editor.hideParticleIcons",
    "0140": "disableOrbScale",
    "0141": "disableTriggerOrbScale",
    "0142": "reduceAudioQuality",
    "0149": "editor.showClicks",
    "0150": "editor.autoPause",
    "0151": "editor.startOptimization",
    "0152": "editor.hidePath",
    "0155": "disableShaderAntiAliasing",
    "0156": "editor.disablePasteStateGroups",
    "0159": "audioFix01"
}

let gameEvents = {
    "1": "challengeUnlocked",
    "2": "glubfubHint1",
    "3": "glubfubHint2",
    "4": "challengeCompleted",
    "5": "treasureRoomUnlocked",
    "6": "chamberOfTimeUnlocked",
    "7": "chamberOfTimeDiscovered",
    "8": "foundMasterEmblem",
    "9": "gatekeeperDialogue",
    "10": "scratchDialogue",
    "11": "scratchShopUnlocked",
    "12": "monsterDialogue",
    "13": "monsterFreed",
    "14": "demonKey1",
    "15": "demonKey2",
    "16": "demonKey3",
    "17": "shopkeeperDialogue",
    "18": "gdwOnlineUnlocked",
    "19": "monsterEncountered",
    "20": "communityShopUnlocked",
    "21": "potborDialogue",
    "22": "youtubeChest",
    "23": "facebookChest",
    "24": "twitterChest",
    "25": "explorersUnlocked",
    "26": "twitchChest",
    "27": "discordChest",
    "28": "towerClicked",
    "29": "towerEntered",
    "30": "acceptedTOS",
    "31": "zolgurothEncountered",
    "32": "redditChest",
    "33": "towerFloor1Completed",
    "34": "diamondShopUnlocked",
    "35": "mechanicUnlocked",
    "36": "mechanicDialogue",
    "37": "diamondShopkeeperDialogue"
}