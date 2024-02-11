function countRewards(lvlData) {
    let totalOrbs = lvlData.demon ? 500 : lvlData.type == "Official" ? ((lvlData.stars + 1) * 20 * 1.25) : orbAmounts[lvlData.stars]
    let orbReward = totalOrbs * 0.8
    let currentOrbs = lvlData.manaOrbPercentage >= 100 ? totalOrbs : Math.floor(orbReward * ((lvlData.manaOrbPercentage || 0) / 100))

    let hasDiamonds = ["Daily", "Weekly", "Gauntlet"].includes(lvlData.type)
    let diamondCount = hasDiamonds ? lvlData.stars + 2 : 0
    let currentDiamonds = Math.ceil(diamondCount * ((lvlData.manaOrbPercentage || 0) / 100))

    return {
        orbs: {total: totalOrbs, reward: orbReward, current: currentOrbs},
        diamonds: {total: diamondCount, current: currentDiamonds}
    }
}

let pageCache = []
function appendToTable(lvlList) {

    if (loading) return
    loading = true
    if (lvlList) {
        let i1 = false
        pageCache = [] // clear cache
        searchTable = lvlList.filter(x => {
            let weird = (x.type == "Official" && x.name == "Stereo Madness")
            if (weird) {
                if (i1) return false
                else i1 = true
            }
            return true
        }) // remove broken ids
    }
    else lvlList = searchTable

    let maxPages = maxPage(searchTable, pageSize)
    if (page <= 0) page = 1
    if (page > maxPages) page = maxPages
    $('#pageNumber').attr('max', maxPages)
    $('#totalPages').text(maxPages)

    lvlList = lvlList.slice((page-1)*pageSize, (page-1)*pageSize + pageSize)

    if (page == 1) { $('#pageappendtotabLeft').addClass('greyed'); $('#pageStart').addClass('greyed') }
    else { $('#pageLeft').removeClass('greyed'); $('#pageStart').removeClass('greyed') }

    if (page == maxPages) { $('#pageRight').addClass('greyed'); $('#pageEnd').addClass('greyed') }
    else { $('#pageRight').removeClass('greyed'); $('#pageEnd').removeClass('greyed') }

    let levelIDs = lvlList.filter(x => x.type != "Official").map(x => x.id)
    if (!levelIDs.length || pageCache[page]) return appendLevels(lvlList, pageCache[page])

    let lowestID = Math.min(...levelIDs)
    levelIDs = levelIDs.map(x => x - lowestID)

    appendLevels(lvlList)
}

function appendLevels(lvlList, res=[]) {

        $('.levelRow').remove()
        $('#pageNumber').val(page)

        lvlList.forEach(x => {

           if (!x.id && !x.percentage) return

           let official = x.type == "Official"
           let isTimely = ["Daily", "Weekly"].includes(x.type)
           let coinColor = official ? "" : (x.verifiedCoins || data.userCoins.online[x.id]) ? "silver" : "brown"
           let levelRating =
                official ? "Official" :
                (x.epic && x.epic != "None") ? x.epic :
                (x.featured || x.featuredPosition) ? "Featured" :
                x.stars ? (!x.name ? "Rated" : "Starred") : (x.name ? "Unrated" : "Unavailable")
           let hideStuff = ";display: none;"   

           let difficultyFace = "unrated"
           if (official) difficultyFace = `${x.difficulty.toLowerCase()}-featured`
           else difficultyFace = `${!x.demon ? (x.difficulty || x.estimatedDifficulty || "Unrated").toLowerCase() : `demon-${(x.demonDifficulty || "hard").toLowerCase().split(' ')[0]}`}${x.epic ? '-epic' : `${x.featuredPosition ? '-featured' : ''}`}`
        
           let diffFace = `https://gdbrowser.com/assets/difficulties/${difficultyFace}.png` 

           let ratings = {
                liked: !!x.liked,
                disliked: !!x.disliked,
                stars: !!x.starRated,
                demon: !!x.demonRated,
                reported: !!x.reported,
                favorited: !!x.favorited
            }

            let hasDiamonds = ["Daily", "Weekly", "Gauntlet"].includes(x.type)
            let starCount = official ? x.stars : data.levelStars[x.id]
            let rewards = countRewards(x)
            let foundCoins = x.collectedCoins || []

            let typeStr = x.type + " Level"
            if (isTimely) typeStr = `${x.type} #${x.type == "Weekly" ? x.timelyID - 100000 : x.timelyID}`

            let isCringe = (x.likes || 1) < 0

            let coinCount = x.totalCoins || (x.collectedCoins || []).length

            let ratingStuff = ""
            Object.keys(ratings).forEach(z => { if (ratings[z]) ratingStuff += `<img height="40px" style="margin: 5px 5px 5px 5px" src="assets/ratings/${z}.png">` })

            $('#levelTable').append(`
            <tr class="levelRow"><td>
                <p style="color: ${x.percentage == 100 ? "lime" : x.practicePercentage == 100 ? "cyan" : "white"}">${x.name || "(not saved)"}</p>
                <p ${x.author ? "" : 'style="display: none"'}>By ${official ? "RobTop" : x.author || "[unknown]"}</p>
                ${official ? `<p>ID: ${x.id || "N/A"}</p>` : `<p>ID: <a style="color: aqua !important" href="https://gdbrowser.com/${x.id}" target="_blank">${x.id}</a></p>`}
                ${x.hasLevelData ? `<p style="color: lime"><span class="downloadGMD" downloadID="${x.rawSaveIndex}" style="text-decoration: underline; text-decoration-thickness: 1px; cursor: pointer">Download .gmd</span> (v${x.version || 0})</p>` : ""}
            </td>
            <td>
                <p style="color: lime">     <img src="assets/play.png">${x.percentage || 0}%</p>
                <p style="color: yellow${official ? hideStuff : ""}">   <img src="assets/buttons/score.png">${x.leaderboardPercentage || 0}%</p>
                <p style="color: aqua">     <img src="assets/buttons/practice.png">${x.practicePercentage || 0}%</p>
            </td>
            <td>
                <p style="color: white">    <img src="${diffFace}">${x.difficulty || x.estimatedDifficulty || "Unknown"}</p>
                <p style="color: ${ratingColors[levelRating]}${official ? hideStuff : ""}">   <img src="assets/quality.png">${levelRating}</p>
                <p style="color: ${typeColors[x.type]}">   <img src="assets/cp.png">${typeStr}</p>
            </td>
            <td>
                <p style="color: lime${official || !x.downloads ? hideStuff : ""}">     <img src="assets/download.png">${commafy(x.downloads || "?")}</p>
                <p style="color: ${isCringe ? "salmon" : "yellow"}${official || !x.downloads ? hideStuff : ""}">   <img src="assets/${isCringe ? "dis" : ""}like.png">${commafy(x.likes || "?")}</p>
                <p style="color: white${official || !x.length ? hideStuff : ""}">    <img src="assets/time.png">${x.length || "Unknown"}</p>
                ${x.secretCoinsToUnlock ? `<p style="color: yellow"><img src="assets/coin.png">${x.secretCoinsToUnlock} required</p>` : ""}
            </td>
            <td>
                <p style="color: ${x.percentage == 100 ? "yellow" : "white"}${starCount ? "" : hideStuff}">          <img src="assets/${x.platformer ? "moon" : "star"}.png">${starCount ? `${x.percentage == "100" ? starCount : 0}/${starCount}` : 0}</p>
                <p style="color: ${x.manaOrbPercentage == 100 ? "cyan" : "white"}${starCount ? "" : hideStuff}">     <img src="assets/orbs.png">${rewards.orbs.current || 0}/${rewards.orbs.total}</p>
                <p style="color: ${x.manaOrbPercentage == 100 ? "cyan" : "white"}${hasDiamonds ? "" : hideStuff}">   <img src="assets/diamond.png">${rewards.diamonds.current}/${rewards.diamonds.total}</p>
            </td>
            <td>
                <p style="color: white${coinCount < 1 ? hideStuff : ""}"><img src="assets/${foundCoins[0] ? "" : "dark"}${coinColor}coin.png">1 ${foundCoins[0] ? "✔" : "⨯"}</p>
                <p style="color: white${coinCount < 2 ? hideStuff : ""}"><img src="assets/${foundCoins[1] ? "" : "dark"}${coinColor}coin.png">2 ${foundCoins[1] ? "✔" : "⨯"}</p>
                <p style="color: white${coinCount < 3 ? hideStuff : ""}"><img src="assets/${foundCoins[2] ? "" : "dark"}${coinColor}coin.png">3 ${foundCoins[2] ? "✔" : "⨯"}</p>
            </td>
            <td>
                <p style="color: white"><img src="assets/attempts.png">${commafy(x.attempts)}</p>
                <p style="color: white"><img src="assets/jumps.png">${commafy(x.jumps)}</p>
                <p style="display: none; color: white"><img src="assets/clicks.png">${commafy(x.clicks || "N/A")}</p>
            </td>
            <td class="center">${ratingStuff}</td>
            </tr>`)
        })
        loading = false
}

$('#pageRight').click(function() {
    page = Math.min(maxPage(searchTable, pageSize), page + 1)
    appendToTable()
})

$('#pageLeft').click(function() {
    page--
    appendToTable()
})

$('#pageStart').click(function() {
    page = 1
    appendToTable()
})

$('#pageEnd').click(function() {
    page = maxPage(searchTable, pageSize)
    appendToTable()
})

$('#pageNumber').change(function() {
    page = +$(this).val()
    appendToTable()
})


$("#levelTable").on('click', '.downloadGMD', function (e) {
    let levelID = $(this).attr('downloadID')
    let rawKeys = rawLevelData[levelID]

    if (!rawKeys) return

    let xmlData = `<d><k>kCEK</k><i>4</i>`
    for (const [key, value] of Object.entries(rawKeys)) {
        if (key != "kCEK") {
            xmlData += `<k>${key}</k>`
            if (typeof value == "string") xmlData += `<s>${value}</s>`
            else if (typeof value == "number") xmlData += `<i>${value}</i>`
            else if (typeof value == "boolean" && value) xmlData += `<t/>`
        }
    }
    xmlData += "</d>"

    let dataBlob = new Blob([xmlData], {type: 'application/xml'})
    let blobURL = URL.createObjectURL(dataBlob);
    let blobLink = document.createElement('a');
    blobLink.href = blobURL;
    blobLink.download = `${rawKeys.k2 || "level"}.gmd`

    blobLink.click();
})