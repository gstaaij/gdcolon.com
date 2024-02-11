let achievementCategories = [
    { id: "stars", stat: "stars", name: "Stars", icon: "star", color: "#FFDC00" },
    { id: "moons", stat: "moons", name: "Moons", icon: "moon", color: "#00B4FF" },
    { id: "coins", stat: "coins", name: "Secret Coins", icon: "coin", color: "#FF8000" },
    { id: "usercoins", stat: "userCoins", name: "User Coins", icon: "silvercoin", color: "#BBBBBB" },
    { id: "diamonds", stat: "diamonds", name: "Diamonds", icon: "diamond", color: "cyan" },
    { id: "demon", stat: "demons", name: "Demons", icon: "demon", color: "red" },
    { id: "mappacks", stat: "mapPacks", name: "Map Packs", icon: "folder", color: "#FFB41E" },
    { id: "gauntlets", stat: "gauntlets", name: "Gauntlets", icon: "gauntlet", color: "#781E1E" },
    { id: "lists", stat: "listRewards", name: "List Rewards", icon: "list", color: "#B4503C" },
    { id: "daily", stat: "completedDailies", name: "Daily Levels", icon: "daily", color: "#FFC800" },
    { id: "custom", stat: "onlineLevelsCompleted", name: "Online Levels", icon: "online", color: "#00AAC8" },
    { id: "jump", stat: "jumps", name: "Jumps", icon: "jumps", color: "#FFB478" },
    { id: "attempt", stat: "attempts", name: "Attempts", icon: "attempts", color: "#FF7878" },
    { id: "like", stat: "likedLevels", name: "Liked Levels", icon: "vote_like", color: "#FFC81E" },
    { id: "rateDiff", stat: "ratedLevels", name: "Rated Levels", icon: "vote_rate", color: "#64C81E" }
]

let rewardTypes = { bird: "ufo", dart: "wave" }
let specialRewardTypes = { special: "trail", death: "deathEffect" }

async function buildAchList() {

    let achTiers = await fetch("resources/acheivementTiers.json").then(res => res.json())

    let numFormat = Intl.NumberFormat( 'en-US', { maximumFractionDigits: 2, notation: "compact" , compactDisplay: "short" })

    let achCounts = {}

    achievementCategories.forEach(x => {
        let tiers = achTiers[x.id]
        if (!tiers) return

        let current = +data.stats[x.stat] || 0
        let max = tiers[tiers.length - 1].count
        let percent = (current / max * 100)

        achCounts[x.id] = current

        let markers = []
        let completedTiers = 0
        let nextReward;
        let prevReward;

        tiers.forEach((t, i) => {
            let pc = (t.count / max * 100)
            markers.push(`<div class="achLine" achType="${x.id}" achIndex="${i}" style="left: ${pc}%"></div>`)
            if (!nextReward && pc > percent) nextReward = t
            if (pc <= percent) {
                completedTiers++
                prevReward = t
            }
        })

        let nextPercent = 0
        if (nextReward) {
            let prev = prevReward ? prevReward.count : 0
            nextPercent = ((current - prev) / (nextReward.count - prev) * 100)
        }

        $('#achievementBars').append(`
        <div class="achTracker">
            <div class="centerflex achLabel">
                <img src="assets/${x.icon}.png" style="height: 40px; margin-right: 10px">
                <h2${percent >= 100 ? ' style="color: lime"' : ""}>${x.name}</h2>
            </div>
            <p class="small">${commafy(current)} / ${commafy(max)} <span class="grey">(${commafy(Number(percent.toFixed(2)))}%)</span></p>

            <div class="achBounds">
                <div class="achBar">
                    ${markers.join("")}
                    <div style="width: ${percent}%; background-color: ${x.color}"></div>
                </div>
                
                <img class="gdButton achInfo" achType="${x.id}" src="assets/info.png">
            </div>

            <div class="achIcons" style="display: none">
                <h2 class="achIconHeader">Rewards (${completedTiers}/${tiers.length})</h2>
                <h2 class="achIconInfo" style="display: none; color: lime"></h2>
                <div class="achIconList centerflex"></div>
            </div>

            <div class="centerflex achRewards">
                ${prevReward ? `<p class="smaller">Previous reward: ${commafy(prevReward.count)}</p>` : ""}
                ${prevReward && nextReward ? `<p class="smaller" style="margin: 0px 15px">•</p>` : ""}
                ${nextReward ? `<p class="smaller">Next reward: ${commafy(nextReward.count)} <span class="grey">(${commafy(Number(nextPercent.toFixed(2)))}%)</span></p>` : ""}
            </div>
        </div>`)
    })

    $('#achievementBars .achInfo').click(function() {
        let iconBox = $(this).parent().parent().find(".achIcons")

        if (iconBox.is(":visible")) {
            $(this).attr("src", "assets/info.png")
            return iconBox.hide()
        }

        let rType = $(this).attr("achType")
        let tiers = achTiers[rType]
        if (!tiers) return

        let achList = iconBox.find(".achIconList")
        
        if (!achList.html()) {
            tiers.forEach(x => {
                let iconImg = $("<img>");
                let foundSpecial = specialRewardTypes[x.reward.type]
                let passed = achCounts[rType] >= +x.count
                let isColor = x.reward.type == "color1" || x.reward.type == "color2"
    
                if (isColor) {
                    iconImg.attr("src", `assets/col${x.reward.type == "color1" ? 1 : 2}.png`)
                    iconImg.addClass("colorIcon")
                    iconImg.css("background-color", `rgb(${getColorFromID(+x.reward.id)})`)
                }
    
                else if (foundSpecial) {
                    iconImg.attr("src", `https://gdbrowser.com/iconkit/items/${foundSpecial}_${+x.reward.id}.png`)
                }
    
                else {
                    let rType = rewardTypes[x.reward.type] || x.reward.type
                    iconImg.attr("src", `https://gdbrowser.com/iconkit/premade/${rType}_${+x.reward.id}.png`)
                }
    
                iconImg.attr("title", "ID: " + +x.reward.id)
                if (!isColor && !passed) iconImg.css("opacity", "50%")

                let textCount = (x.count >= 10000 ? numFormat.format(+x.count) : commafy(x.count))
                achList.append(`<div achname="${x.name}"> ${iconImg.prop("outerHTML")} <p style="font-size: 20px;${passed ? " color: lime;" : ""}">${textCount}</p> </div>`)
            })
        }

        $(this).attr("src", "assets/close_small.png")
        iconBox.show()
    })

    function iconHover(el, off) {
        let parent = el.parent().parent()
        let mainHeader = parent.find(".achIconHeader")
        let infoHeader = parent.find(".achIconInfo")

        if (off) {
            infoHeader.hide()
            mainHeader.show()
        }

        else {
            infoHeader.text(el.attr("achname"))
            mainHeader.hide()
            infoHeader.show()
        }
    }

    $(document).on('mouseover', '.achIconList div', function() { iconHover($(this)) }),
    $(document).on('mouseout',  '.achIconList div', function() { iconHover($(this), true) })

}