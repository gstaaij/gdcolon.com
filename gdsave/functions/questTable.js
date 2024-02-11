let questList = [
    { tier: 1, type: "Orb", amount: 200 },
    { tier: 2, type: "Orb", amount: 500 },
    { tier: 3, type: "Orb", amount: 1000 },
    { tier: 1, type: "Star", amount: 5 },
    { tier: 2, type: "Star", amount: 10 },
    { tier: 3, type: "Star", amount: 15 },
    { tier: 1, type: "Coin", amount: 2 },
    { tier: 2, type: "Coin", amount: 4 },
    { tier: 3, type: "Coin", amount: 6 },
]

let questImages = { Orb: "orbs", Star: "star", Coin: "silvercoin"}
let questIndexes = ["", "Top", "Middle", "Bottom"]
let altTypes = { Orb: "orbs", Star: "stars", Coin: "coins"}

let questNames = ["Finder", "Collector", "Master"]
let rewardMultiplier = 5

function appendQuests() {

    let diamondRewards = [
        data.quests[0] ? data.quests[0].diamonds : 0,
        data.quests[1] ? data.quests[1].diamonds : 0,
        data.quests[2] ? data.quests[2].diamonds : 0
    ]

    questList.forEach((x, n) => {
        let foundQuest = data.quests.findIndex(q => x.tier == q.tier && altTypes[x.type] == q.itemType) + 1
        let foundQueue = data.queuedQuests.findIndex(q => x.tier == q.tier && altTypes[x.type] == q.itemType) + 1
        let progress = !foundQuest ? "" : data.quests.find(q => x.tier == q.tier).obtainedItems || 0
        
        let bgCol = foundQuest ? "0, 255, 0, 0.07" : foundQueue ? "0, 128, 255, 0.1" : "0, 0, 0, 0"

        $('#questTable').append(`
        <tr class="questRow" style="background-color: rgba(${bgCol})">
        <td>${x.type} ${questNames[x.tier - 1]}</td>
        <td><img src="assets/${questImages[x.type]}.png">${x.amount}</td>
        <td>${foundQuest ? `<img src="assets/${questImages[x.type]}.png">${progress}` : ""}</td>
        <td><img src="assets/diamond.png">${diamondRewards[x.tier - 1]}</td>
        <td>${questIndexes[foundQuest]}</td>
        <td>${questIndexes[foundQueue]}</td>
        <td></td>
        <td></td>
        </tr>`)
    })

    for (i=1; i<=3; i++) {
        let tierRewards = Object.keys(data.diamondRewards.quests || {}).filter(x => data.diamondRewards.quests[x] == i*3 || data.diamondRewards.quests[x] == i*5 ) // x3 in GD World
        let diamondSum = 0
        tierRewards.forEach(x => diamondSum += +data.diamondRewards.quests[x])
        $("#questList").append(`<p class="middle" style="line-height: 40px">Completed tier ${i} quests: <span style="color: yellow">${tierRewards.length}</span> (<img class="middle" style="height: 38px" src="assets/diamond.png"> <span style="color: cyan">${diamondSum}</span>)</p>`)
    }
}