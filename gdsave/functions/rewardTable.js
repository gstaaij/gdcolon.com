const shardList = rewardKeys[1].bump.filter(x => x.endsWith(" Shard")).map((x, y) => ({ name: x, index: y, id: x.split(" ")[0].toLowerCase() }))

function findReward(r, rType) {
    return (r.rewards.find(x => x.item == rType) || {}).amount || 0
}

function parseChestID(chest) {
    let chestNum = Number(chest.id)
    if (chestNum) return chestNum
    else if (typeof chest.id === undefined) return Infinity
    else return Number(String(chest.id).match(/\d+/g)) || Infinity
}

function appendRewards(rewardList) {

        $('.rewardRow').remove()
        if (rewardList) chestTable = rewardList
        else rewardList = chestTable

        rewardList = rewardList.filter(x => x && allowedChests.includes(x.name))

        let maxPages = maxPage(rewardList, chestPageSize)
        if (chestPage <= 0) chestPage = 1
        if (chestPage > maxPages) chestPage = maxPages

        rewardList = rewardList.slice((chestPage-1)*chestPageSize, (chestPage-1)*chestPageSize + chestPageSize)
    
        if (chestPage == 1) { $('#chestLeft').addClass('greyed'); $('#chestStart').addClass('greyed') }
        else { $('#chestLeft').removeClass('greyed'); $('#chestStart').removeClass('greyed') }
    
        if (chestPage == maxPages) { $('#chestRight').addClass('greyed'); $('#chestEnd').addClass('greyed') }
        else { $('#chestRight').removeClass('greyed'); $('#chestEnd').removeClass('greyed') }

        $('#chestPage').val(chestPage).attr("max", maxPages)
        $('#chestTotal').text(maxPages)
        
        rewardList.forEach((x, n) => {

            let iconStr = ""
            let shardStr = ""
            let shardRewards = []

            x.rewards.forEach(i => {
                if (i.item.endsWith(" Shard")) {
                    let sh = shardList.find(s => s.name == i.item)
                    if (sh) shardRewards.push({ shard: sh, amount: i.amount })
                }

                else if (i.item == "Icon") {
                    let formStr = i.iconForm == "deathEffect" ? "Death" : i.iconForm[0].toUpperCase() + i.iconForm.slice(1)
                    let isCol = (i.iconForm == "color1" || i.iconForm == "color2")
                    let iconImg = $('<img style="height: 40px">')
                    if (isCol) {
                        iconImg.attr("src", `assets/col${i.iconForm == "color1" ? 1 : 2}.png`)
                        iconImg.addClass("colorIcon")
                        iconImg.css("background-color", `rgb(${getColorFromID(i.iconID)})`)
                    }
                    else if (["deathEffect", "trail"].includes(i.iconForm)) iconImg.attr("src", `https://gdbrowser.com/assets/${i.iconForm == "deathEffect" ? "deatheffects" : "trails"}/${i.iconID}.png`)
                    else iconImg.attr("src", `https://gdbrowser.com/iconkit/premade/${i.iconForm == "cube" ? "icon" : i.iconForm}_${i.iconID}.png`)

                    return iconStr += `<p>${iconImg.prop("outerHTML")}${formStr} #${i.iconID}</p>`
                }
                
                else if (i.item == "Custom") {
                    let specialItem = specialItems[i.customID];
                    return iconStr += `<p><img style="height: 40px" src="assets/items/${specialItem}.png">Special #${i.customID}</p>`
                }
            })

            let chestImg = `chests/${x.chest}`

            if (x.name == "Gauntlet") chestImg = "gauntlet"
            else if (x.name == "Weekly") chestImg = "weekly"
            else if (x.name == "Special") chestImg = "quality"
            else if (x.name == "Path") chestImg = "paths/soul"
            else if (x.chest.endsWith("key")) {
                chestImg = `chests/demon${x.name.split(" ")[0]}`
                x.type = x.chest
            }

            if (shardRewards.length) {
                shardRewards = shardRewards.sort((a, b) => a.shard.index - b.shard.index)
                shardStr = shardRewards.map(ss => `<p><img title="${ss.shard.name}" src="assets/shards/${ss.shard.id}.png">${ss.amount}</p>`).join("")
            }

            $('#rewardTable').append(`
            <tr class="rewardRow">
            <td class="center chest"><img style="height: 40px" src="assets/${chestImg}.png"></td>
            <td><p>${x.id || ""}</p></td>
            <td><p><img src="assets/orbs.png">${findReward(x, "Mana Orbs")}</p></td>
            <td><p><img src="assets/diamond.png">${findReward(x, "Diamonds")}</p></td>
            <td><p><img src="assets/key.png">${findReward(x, "Demon Key")}</p></td>
            <td class="shardRow"><div>${shardStr}</div></td>
            <td>${iconStr}</td>
            </tr>`)
            $('#rewardTable td:not(.chest)').each(function() {
                if (!$(this).text() || $(this).text() == "0") $(this).html("")
            })
        })
    }

    
    $('#chestRight').click(function() {
        chestPage = Math.min(maxPage(chestTable, chestPageSize), chestPage + 1)
        appendRewards()
    })

    $('#chestLeft').click(function() {
        chestPage--
        appendRewards()
    })

    $('#chestStart').click(function() {
        chestPage = 1
        appendRewards()
    })

    $('#chestEnd').click(function() {
        chestPage = maxPage(chestTable, chestPageSize)
        appendRewards()
    })

    $('#chestPage').change(function() {
        chestPage = +$(this).val()
        appendRewards()
    })