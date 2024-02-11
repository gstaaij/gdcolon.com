    function clean(text) {return text.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\=/g, "&#61;").replace(/\"/g, "&quot;").replace(/\'/g, "&apos;")}
    function urlB64(str) { return Base64.atob(str.replace(/_/g, '/').replace(/-/g, '+')) }
    function commafy(num, locale="en-US") { return (num == "" || (isNaN(num) && num !== undefined)) ? num : (+num || 0).toLocaleString(locale, { maximumFractionDigits: 10 }) }

    let iconColors = {}
    function getColorFromID(id) {
        let c = iconColors[+id]
        if (!c) return "255, 255, 255"
        else return `${c.r}, ${c.g}, ${c.b}`
    }

    let reader = new FileReader()
    let parser = new DOMParser()
    let allowUploading = true
    let downloadMode = false
    let GameManagerXML

    let difficultyList = { 0: 'Unrated', 10: 'Easy', 20: 'Normal', 30: 'Hard', 40: 'Harder', 50: 'Insane' }

    // read uploaded file

    const fileInput = document.getElementById("fileInput");
    fileInput.addEventListener("change", function() {
        let selectedFile = this.files[0]
        readUploadedFile(selectedFile)
    }, false);

    function rejectInput(msg, extra) {
        if (extra) console.log(extra)
        $('#errorMsg').text(msg).show()
        $('#uploadMain').show()
        $('#inputLabel').removeClass('inactive')
        $('#uploadLoading').hide()
        $('#headsUp').hide()
        $('#inputLabel').removeClass('inactive')
        allowUploading = true
    }

    function downloadFile(dl, filename, hidePass, hideData) {
        if (hidePass) dl = dl.replace(/<k>GJA_002<\/k><s>(.+?)<\/s>/g, "<k>GJA_002</k><s></s>").replace(/<k>GJA_005<\/k><s>(.+?)<\/s>/g, "<k>GJA_005</k><s></s>")
        if (hideData) dl = dl.replace(/<k>k4<\/k><s>(.+?)<\/s>/g, "<k>k4</k><s></s>")
        let textFile = new Blob([dl], {type: 'text/txt'});
        let downloader = document.createElement('a');
        downloader.href = URL.createObjectURL(textFile)
        downloader.dataset.downloadurl = ['text/txt', downloader.download, downloader.href].join(':');
        downloader.style.display = "none";
        downloader.download = filename
        downloader.target = "_blank"
        document.body.appendChild(downloader);
        downloader.click();
        document.body.removeChild(downloader);
    }

    function readUploadedFile(gameManagerFile) {
        if (!allowUploading) return
        allowUploading = false
        if (gameManagerFile.size / 1024 / 1024 >= 100) return rejectInput(msg)
        $('#uploadMain').hide()
        $('#inputLabel').addClass('inactive')
        $('#uploadLoading').show()
        reader.readAsArrayBuffer(gameManagerFile)
        reader.onload = function(gameManager) {
            let decoded = decode(gameManager.target.result, 11, true)
            if (!decoded) return rejectInput(`Error decoding file! Are you sure this is a valid GD save?`)

            decoded = decoded
            .replace(/&(?!amp;)/g, "&amp;") // escape ampersands
            .replace(/<k>GLM_09<\/k><d>(.|\n)+?<\/d>/g, "") // remove GLM_09 (corrupted on lots of saves)
            .replace(/[^\x00-\x7F]/g, "?").replace(/[\0-\37]/g, "") // replace weird characters

            if (downloadMode) {
                downloadFile(decoded, "CCGameManager.xml", true)
                return $('#loadTxt').text("Save data downloaded!").css("color", "yellow").css("font-weight", "normal")
            }
 
            try { kowalskiAnalysis(decoded) }
            catch(e) {
                console.log(e)
                $('#loadTxt').hide()
                $('#oopsieWoopsie').show()
                $('#errorInfo').show().text(e.message ? `${e.name}: ${e.message}` : "Unknown error")
            }
        }
    }

// defined here so it can be accessed from console

    let data = {}
    let rawData = {}
    let levelData = []
    let levels = []
    let rawLevelData = {}

    let page = 1
    let pageSize = 20

    let chestPage = 1
    let chestPageSize = 100

    let searchTable = []
    let chestTable = []
    let allowedChests = []
    let loading = false

    //kowalskiAnalysis(CCGameManager)

async function kowalskiAnalysis(CCGameManager) {

    GameManagerXML = CCGameManager
    let saveData = parser.parseFromString(CCGameManager, "text/xml")
    if (!saveData || !saveData.children || !saveData.children.length) return rejectInput("Error parsing XML file! Are you sure this is your save data?", saveData)
    saveData = saveData.children[0].children[0]
    if (saveData.children[0].innerHTML.startsWith("LLM")) return levelAnalysis(saveData)
    if (saveData.tagName == "parsererror") return rejectInput("Error parsing save file! It may contain some corrupt data.", saveData)
    else if (saveData.tagName != "dict") return rejectInput("Error parsing save file! Are you sure this is your save data?", saveData)

    iconColors = await fetch("resources/colors.json").then(res => res.json())

    // parse!!
    data = parseXML(saveData)
    
    if (!data.playerUDID || !data.playerFrame || !data.binaryVersion) return rejectInput("Valid XML file, but probably not a GD save. Try again silly.")
    
    if (!data.levelStars) data.levelStars = {}

    // construct data.stats

    let betterStats = {collectedCoins: {}}
    Object.keys(data.stats || {}).forEach(x => {
        let keyName = statKeys[x] || x
        if (keyName.includes("unique")) {
            let coinData = keyName.split("_")
            let coinCollected = data.stats[x] == "1"
            if (!Number(coinData[1])) betterStats.collectedCoins[coinData[1]] = coinCollected
            else {
                if (!betterStats.collectedCoins[coinData[1]]) betterStats.collectedCoins[coinData[1]] = []
                betterStats.collectedCoins[coinData[1]][+coinData[2] - 1] = coinCollected
            }
        }
        else betterStats[keyName] = data.stats[x]
    })
    data.stats = betterStats

    // we only need the keys for these ezpz

    let keysOnly = ["followedAccounts", "reportedLevels", "userCoins", "bronzeUserCoins", "completedLevels", "ratedDemons", "ratedLevels", "recentlyPlayed", "likes"]
    keysOnly.forEach(x => { data[x] = Object.keys(data[x] || {}) })


    // liked and disliked levels
    let betterLikes = { levels: [], comments: [], accountComments: [] }
    data.likes.forEach(x => {
        let lk = x.split("_")
        let likeObj = {id: lk[2], liked: lk[3] == 1, disliked: lk[3] == 0}
        if (lk[1] == 2) likeObj.levelID = lk[4]
        else if (lk[1] == 3) likeObj.commentID = lk[4]
        betterLikes[lk[1] == 1 ? "levels" : lk[1] == 2 ? "comments" : "accountComments"].push(likeObj)
    })
    data.likes = betterLikes


    // user coins
    data.userCoins = coinObject(data.userCoins)
    data.bronzeUserCoins = coinObject(data.bronzeUserCoins).online

    // level info

    let levelTypes = ["Official", "Online", "Daily", "Gauntlet"]
    let levelInfo = ["officialLevels", "onlineLevels", "timelyLevels", "gauntlets"]
    levelInfo.forEach((x, y) => {
        data[x] = arrLabelObject(data[x], levelKeys, null, y)
        data[x].forEach(x => {

            x.type = levelTypes[y]
            
            if (x.stars) x.estimatedDifficulty = x.difficulty || starDifficulties[x.stars]
            if (x.demonType) x.demonDifficulty = demonTypes[x.demonType]

            if (!x.difficulty && x.ratingScore2) {
                if (x.auto) x.difficulty = "Auto"
                else if (x.demon) x.difficulty = (x.demonDifficulty ? x.demonDifficulty + " Demon" : "Demon")
                else x.difficulty = difficultyList[x.ratingScore2]
            }

            x.liked = !!data.likes.levels.find(y => x.id == y.id && y.liked)
            x.disliked = !!data.likes.levels.find(y => x.id == y.id && y.disliked)
            x.starRated = !!data.ratedLevels.includes(String(x.id))
            x.demonRated = !!data.ratedDemons.includes(String(x.id))
            x.reported = !!data.reportedLevels.includes(String(x.id))
            
            x.platformer = x.length == "Platformer"

            if (x.type == "Official") x.collectedCoins = data.stats.collectedCoins[x.id]
            else x.collectedCoins = data.userCoins[x.type.toLowerCase()][x.id] || data.bronzeUserCoins[x.id]
            if (!x.collectedCoins) delete x.collectedCoins

            if (x.type == "Daily" && x.timelyID >= 100000) x.type = "Weekly"
            if (x.levelData) {
                x.hasLevelData = true
                x.rawSaveIndex = `${x.id}_${y}`
                delete x.levelData
            }
        })
        levels = levels.concat(data[x])
    })

    // misc key names

    data.songInfo = superLabelObject(data.songInfo, songKeys)
    data.quests = arrLabelObject(data.quests, questKeys)
    data.queuedQuests = arrLabelObject(data.queuedQuests, questKeys)
    if (data.activePath) data.activePath = statKeys[data.activePath]

    // valueKeeper - contains settings + unlocked icons

    data.settings = { editor: {}, parental: {} }
    data.unlockedIcons = { "primaryColors": [], "secondaryColors": [], "cubes": [], "ships": [], "balls": [],
                  "ufos": [], "waves": [], "robots": [], "spiders": [], "swings": [], "jetpacks": [],
                  "trails": [], "deathEffects": [], "misc": [] }
    Object.keys(data.valueKeeper || {}).forEach(x => {
        let val = x.split("_")
        let valID = +val[1]
        let v = data.valueKeeper[x]
        let vb = v == "1"
        if (val[0] != "gv" && v == "0") return
        switch (val[0]) {
            case "gv": 
                let settingName = gameVariables[val[1]] || val[1]
                let settingType = settingName.split(".")
                if (["editor", "parental"].includes(settingType[0])) return data.settings[settingType[0]][settingType[1]] = v
                else return data.settings[settingName] = v
            case "c0": return data.unlockedIcons.primaryColors.push(valID)
            case "c1": return data.unlockedIcons.secondaryColors.push(valID)
            case "i": return data.unlockedIcons.cubes.push(valID)
            case "ship": return data.unlockedIcons.ships.push(valID)
            case "ball": return data.unlockedIcons.balls.push(valID)
            case "bird": return data.unlockedIcons.ufos.push(valID)
            case "dart": return data.unlockedIcons.waves.push(valID)
            case "robot": return data.unlockedIcons.robots.push(valID)
            case "spider": return data.unlockedIcons.spiders.push(valID)
            case "swing": return data.unlockedIcons.swings.push(valID)
            case "jetpack": return data.unlockedIcons.jetpacks.push(valID)
            case "special": return data.unlockedIcons.trails.push(valID)
            case "death": return data.unlockedIcons.deathEffects.push(valID)
            default: return data.unlockedIcons.misc.push(x)
        }
    })

    // unlockValueKeeper (game events)

    data.events = {}
    Object.keys(data.unlockValueKeeper || {}).forEach(x => {
        let eventName = gameEvents[x.split("_")[1]] || x.split("_")[1]
        data.events[eventName] = data.unlockValueKeeper[x] == "1"
    })
    delete data.valueKeeper
    delete data.unlockValueKeeper

    if (!data.shopPurchases) data.shopPurchases = {}

    // sort data.unlockedIcons for neatness

    Object.keys(data.unlockedIcons || {}).forEach(x => { data.unlockedIcons[x] = data.unlockedIcons[x].sort((a, b) => a - b) })

    // icon object

    data.icons = {}
    let icons = {
        cube: "playerFrame",
        ship: "playerShip",
        ball: "playerBall",
        ufo: "playerBird",
        wave: "playerDart",
        robot: "playerRobot",
        spider: "playerSpider",
        swing: "playerSwing",
        jetpack: "playerJetpack",
        trail: "playerStreak",
        shipFire: "playerShipStreak",
        deathEffect: "playerDeathEffect",
        color1: "playerColor",
        color2: "playerColor2",
        color3: "playerColor3",
        glow: "playerGlow",
    }

    data.selectedForm = (formTypes[data.playerIconType || 0] || formTypes[0]).toLowerCase()

    Object.keys(icons).forEach(x => {
        data.icons[x] = data[icons[x]]
        delete data[icons[x]] 
    })

    $('#username').html(data.playerName)
    $('#gdIcon').attr('src', `https://gdbrowser.com/iconkit/premade/${data.selectedForm == "cube" ? "icon" : data.selectedForm}_${data.icons[data.selectedForm]}.png`)

    // keybinds??? idk
        if (!data.keybinds) delete data.keybinds
        if (!data.keybinds2) delete data.keybinds2

    // map pack stars
    let mpRewards = {}
    Object.keys(data.mapPackStars || {}).forEach(x => {
        mpRewards[x.slice(5)] = data.mapPackStars[x]
    })
    data.mapPackStars = mpRewards

    // diamond rewards
    data.diamondRewards = { daily: {}, quests: {} }
    Object.keys(data.questRewards || {}).forEach(x => {
        data.diamondRewards[x[0] == "c" ? "quests" : "daily"][x.slice(1)] = data.questRewards[x]
    })
    delete data.questRewards

    // daily chests

    let betterRewards = { small: [], large: [] }
    Object.keys(data.dailyRewards || {}).forEach(x => {
        let rewardObj = rewardObject(data.dailyRewards[x], "daily")
        if (rewardObj.chest) betterRewards[rewardObj.chest].push(rewardObj)
    })
    data.dailyRewards = betterRewards

    // treasure chests

    let treasureRewards = { "1key": [], "5key": [], "10key": [], "25key": [], "50key": [], "100key": [] }
    Object.keys(data.treasureRoomRewards || {}).forEach(x => {
        let rewardObj = rewardObject(data.treasureRoomRewards[x], "treasureRoom")
        if (rewardObj.chest) {
            if (!treasureRewards[rewardObj.chest]) treasureRewards[rewardObj.chest] = [rewardObj]
            else treasureRewards[rewardObj.chest].push(rewardObj)
        }
    })
    data.treasureRoomRewards = treasureRewards

    // weekly demon rewards

    let weeklyRewards = []
    Object.keys(data.weeklyRewards || {}).forEach(x => {
        let rewardObj = rewardObject(data.weeklyRewards[x], "weekly")
        rewardObj.id = String(Number(x.slice(1)) - 100000)
        weeklyRewards.push(rewardObj)
    })
    data.weeklyRewards = weeklyRewards

    // misc + gauntlet rewards

    let miscRewards = []
    let gauntletRewards = []
    let pathRewards = []
    Object.keys(data.rewards || {}).forEach(x => {
        let rewardType = "special"
        let rewardTarget = miscRewards
        if (x.startsWith("g_")) { rewardType = "gauntlet"; rewardTarget = gauntletRewards }
        if (x.startsWith("pr_")) { rewardType = "path"; rewardTarget = pathRewards }
        let rewardObj = rewardObject(data.rewards[x], rewardType)
        rewardObj.id = x
        rewardTarget.push(rewardObj)
    })
    data.rewards = miscRewards
    data.gauntletRewards = gauntletRewards
    data.pathRewards = pathRewards

    $('.chestType').each(function() { allowedChests.push($(this).attr('chest')) })

    // FAQ
    FAQ.forEach(x => {
        $('#questions').append(`<div><img src="assets/${x.i}.png"><h2>${x.q}</h2></div><p>${x.a}</p><br><br>`)
    })

    // display stats

    addStatDiv("Basic Stats", [
        [data.stats.stars, "Stars", "star"],
        [data.stats.moons, "Moons", "moon"],
        [data.stats.diamonds, "Diamonds", "diamond"], [],
        [data.stats.mapPacks, "Map Packs", "folder"],
        [data.stats.gauntlets, "Gauntlets", "gauntlet"],
        [data.stats.listRewards, "List Rewards", "list"], [],
        [data.stats.jumps, "Jumps", "jumps"],
        [data.stats.attempts, "Attempts", "attempts"],
        [data.stats.destroyedPlayers, "Menu Icons Destroyed", "death"],
    ])

    addStatDiv("Coins", [
        [data.stats.coins, "Secret Coins", "coin"],
        [data.stats.userCoins, "User Coins", "silvercoin"],
        [Object.values(data.bronzeUserCoins || {}).flat().filter(x => x).length, "Unverified User Coins", "browncoin"],
    ])

    addStatDiv("Currencies", [
        [`${commafy(data.stats.orbs)} / ${commafy(data.stats.totalOrbs)}`, "Mana Orbs", "orbs"], [],
        [`${commafy(data.stats.spendableDiamonds)} / ${commafy(data.stats.diamonds)}`, "Spendable Diamonds", "diamond_diamond"], [],
        [`${commafy(data.stats.demonKeys)} / ${commafy(data.totalDemonKeys)}`, "Demon Keys", "key"],
    ])

    data.stats.bonusShards = Math.min(...[data.stats.fireShards, data.stats.iceShards, data.stats.poisonShards, data.stats.shadowShards, data.stats.lavaShards])
    data.stats.bonusShards2 = Math.min(...[data.stats.earthShards, data.stats.bloodShards, data.stats.metalShards, data.stats.lightShards, data.stats.soulShards])
    addStatDiv("Shards", [
        [data.stats.fireShards, "Fire Shards", "shards/fire"],
        [data.stats.iceShards, "Ice Shards", "shards/ice"],
        [data.stats.poisonShards, "Poison Shards", "shards/poison"], [],
        [data.stats.shadowShards, "Shadow Shards", "shards/shadow"],
        [data.stats.lavaShards, "Lava Shards", "shards/lava"],
        [data.stats.bonusShards, "Bonus Shards", "shards/bonus"], [],

        [data.stats.earthShards, "Earth Shards", "shards/earth"],
        [data.stats.bloodShards, "Blood Shards", "shards/blood"],
        [data.stats.metalShards, "Metal Shards", "shards/metal"], [],
        [data.stats.lightShards, "Light Shards", "shards/light"],
        [data.stats.soulShards, "Soul Shards", "shards/soul"],
        [data.stats.bonusShards2, "Bonus Shards 2", "shards/bonus2"],
    ])

    addStatDiv("Paths", [
        [data.stats.firePath, "Fire Path", "paths/fire"],
        [data.stats.icePath, "Ice Path", "paths/ice"],
        [data.stats.poisonPath, "Poison Path", "paths/poison"],
        [data.stats.shadowPath, "Shadow Path", "paths/shadow"], [],
        [data.stats.lavaPath, "Lava Path", "paths/lava"],
        [data.stats.earthPath, "Earth Path", "paths/earth"],
        [data.stats.bloodPath, "Blood Path", "paths/blood"],
        [data.stats.metalPath, "Metal Path", "paths/metal"], [],
        [data.stats.lightPath, "Light Path", "paths/light"],
        [data.stats.soulPath, "Soul Path", "paths/soul"],
    ])

    let completedLevels = levels.filter(x => x.type != "Official" && x.percentage >= 100)
    addStatDiv("Online Levels", [
        [completedLevels.filter(x => x.stars == 1).length, "Auto, 1*", "diff/1"],
        [completedLevels.filter(x => x.stars == 2).length, "Easy, 2*", "diff/2"],
        [completedLevels.filter(x => x.stars == 3).length, "Normal, 3*", "diff/3"],
        [completedLevels.filter(x => x.stars == 4).length, "Hard, 4*", "diff/4"], [],
        [completedLevels.filter(x => x.stars == 5).length, "Hard, 5*", "diff/5"],
        [completedLevels.filter(x => x.stars == 6).length, "Harder, 6*", "diff/6"],
        [completedLevels.filter(x => x.stars == 7).length, "Harder, 7*", "diff/7"],
        [completedLevels.filter(x => x.stars == 8).length, "Insane, 8*", "diff/8"], [],
        [completedLevels.filter(x => x.stars == 9).length, "Insane, 9*", "diff/9"],
        [completedLevels.filter(x => x.stars == 10).length, "Demon, 10*", "diff/10"],
        [completedLevels.filter(x => !x.stars).length, "Unrated", "nostar"]
    ])

    addStatDiv("Completed Demons", [
        [data.officialLevels.filter(x => x.demon && x.percentage >= 100).length, "Official Demons", "official"],
        [completedLevels.filter(x => x.demon && x.demonType == 3).length, "Easy Demons", "demons/easy"],
        [completedLevels.filter(x => x.demon && x.demonType == 4).length, "Medium Demons", "demons/medium"], [],
        [completedLevels.filter(x => x.demon && (x.demonType == 1 || !x.demonType)).length, "Hard/Unknown Demons", "demons/hard"],
        [completedLevels.filter(x => x.demon && x.demonType == 5).length, "Insane Demons", "demons/insane"],
        [completedLevels.filter(x => x.demon && x.demonType == 6).length, "Extreme Demons", "demons/extreme"],
    ])

    let dailies = data.timelyLevels.filter(x => x.timelyID < 100000)
    let weeklies = data.timelyLevels.filter(x => x.timelyID >= 100000)

    addStatDiv("Completed Level Types", [
        [levels.filter(x => x.type == "Official" && x.percentage >= 100).length, "Official Levels", "official"],
        [completedLevels.filter(x => x.type == "Online").length, "Online Levels", "online"],
        [completedLevels.filter(x => x.type == "Gauntlet").length, "Gauntlet Levels", "gauntlet"], [],
        [`${commafy(dailies.filter(x => x.percentage == "100").length)}/${commafy(dailies.length)}`, "Daily Levels", "daily"],
        [`${commafy(weeklies.filter(x => x.percentage == "100").length)}/${commafy(weeklies.length)}`, "Weekly Levels", "weekly"],
    ])

    let specialItems = []
    if (data.events.demonKey1) specialItems.push(["", "Demon Key 1", "items/blueKey"])
    if (data.events.demonKey2) specialItems.push(["", "Demon Key 2", "items/greenKey"])
    if (data.events.demonKey3) specialItems.push(["", "Demon Key 3", "items/orangeKey"])
    if (data.events.monsterFreed) specialItems.push(["", "Demon Gauntlet", "items/demonGauntletKey"])
    if (data.events.foundMasterEmblem) specialItems.push(["", "Master Emblem", "items/masterEmblem"])
    if (data.shopPurchases[187]) specialItems.push(["", "Menu Music Customizer", "items/musicCustomizer"])
    if (data.shopPurchases[188]) specialItems.push(["", "Practice Music Unlocker", "items/musicUnlocker"])
    if (data.shopPurchases[244]) specialItems.push(["", "Robot Animation (Slow)", "items/robotAnimationSlow"])
    if (data.shopPurchases[245]) specialItems.push(["", "Robot Animation (Fast)", "items/robotAnimationFast"])
    if (data.shopPurchases[246]) specialItems.push(["", "Spider Animation (Fast)", "items/spiderAnimationFast"])
    addStatDiv("Special Items", specialItems, "specialItems")

    addStatDiv("Level Interactions", [
        [data.stats.likedLevels, "Liked Levels", "buttons/vote"],
        [data.stats.ratedLevels, "Rated Levels", "buttons/rate"],
        [data.ratedDemons.length, "Rated Demons", "buttons/demon"],
        [data.reportedLevels.length, "Reported Levels", "buttons/report"], [],
        [levels.filter(x => x.practicePercentage > 0).length, "Practiced Levels", "buttons/practice"],
        [levels.filter(x => x.leaderboardPercentage > 0).length, "Leaderboard Submissions", "buttons/score"],
        [levels.filter(x => x.favorited).length, "Favorited Levels", "heart"],
        [levels.filter(x => x.folder > 0).length, "Levels in Folders", "folder"],
    ])
    
    addStatDiv("Chests Opened", [
        [data.dailyRewards.small.length, "Small Daily Chests", "chests/small"],
        [data.dailyRewards.large.length, "Large Daily Chests", "chests/large"], [],
        [data.treasureRoomRewards["1key"].length, "1-key Chests", "chests/demon1"],
        [data.treasureRoomRewards["5key"].length, "5-key Chests", "chests/demon5"],
        [data.treasureRoomRewards["10key"].length, "10-key Chests", "chests/demon10"], [],
        [data.treasureRoomRewards["25key"].length, "25-key Chests", "chests/demon25"],
        [data.treasureRoomRewards["50key"].length, "50-key Chests", "chests/demon50"],
        [data.treasureRoomRewards["100key"].length, "100-key Chests", "chests/demon100"],
    ])

    // let passwordStuff = zxcvbn(data.password || "")
    // let passwordDays = passwordStuff.guesses / 86400
    // let passwordYears = passwordDays / 365.25
    // passwordYears = (Math.round(passwordYears) <= 5 ? `${Math.round(passwordDays)} days` : passwordYears >= 99999 ? "99999+ years" : `${Math.round(passwordYears)} years`)

    addStatDiv("Account", [
    [data.accountID || "0", "Account ID", "profile", true],
    [data.playerID || "0", "Player ID", "profile2", true], [],
    // [data.password ? `${["Awful", "Cringe", "Risky", "Decent", "Secure"][passwordStuff.score]} (${passwordYears})` : "No Password", "Password Strength", "lock", true], [],
    ])
    // passwordStuff = null

    if (data.password) $('#forgorPassword').show()
    delete data.password
    delete data.newPassword

    $(".statsDiv span").hover(function() { 
        $(this).parent().parent().find('h2').text($(this).attr('title')).addClass('helpTitle')
    }, function() {
        let statHeader = $(this).parent().parent().find('h2')
        statHeader.text(statHeader.attr('stats')).removeClass('helpTitle')
    })

    data.allRewards = data.dailyRewards.large
    .concat(data.dailyRewards.small)
    .concat(data.treasureRoomRewards["1key"])
    .concat(data.treasureRoomRewards["5key"])
    .concat(data.treasureRoomRewards["10key"])
    .concat(data.treasureRoomRewards["25key"])
    .concat(data.treasureRoomRewards["50key"])
    .concat(data.treasureRoomRewards["100key"])
    .concat(data.pathRewards)
    .concat(data.gauntletRewards)
    .concat(data.weeklyRewards)
    .concat(data.rewards)

    appendToTable([...levels])
    appendRewards([...data.allRewards])
    buildDiffTable()
    buildAchList()
    appendQuests()
    miscData(data)
    loadButtons()

    $('#uploadDiv').hide()
    $('#gdstats').show()

}