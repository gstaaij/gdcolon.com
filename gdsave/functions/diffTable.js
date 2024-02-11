function average(vals, prop, places=2) {
    if (prop) vals = vals.map(x => x[prop] || 0)
    return Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(places)) || 0
}

function median(vals, prop, places=2) {
    if (prop) vals = vals.map(x => x[prop] || 0)
    let sorted = vals.sort((a, b) => a-b)
    let middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2) return sorted[middle] || 0;
    else return average([sorted[middle - 1], sorted[middle]], null, places)
}

function allStats(vals, prop, suffix="", places=2) {
    if (prop) vals = vals.map(x => x[prop] || 0)
    let noLast = suffix.startsWith("*")
    if (noLast) suffix = suffix.slice(1)
    return `<p>A: ${average(vals, null, places)}${suffix}</p>
            <p>M: ${median(vals, null, places)}${suffix}</p>
            <p>T: ${vals.reduce((a, b) => a + b, 0)}${noLast ? "" : suffix}</p>`
}

function buildDiffTable() {
    for (st = 1; st <= 18; st++) {

        let stars = st
        let specialStuff = st > 15
        if (stars > 10) stars = 10

        let lvls = levels.filter(x => x.type != "Official")
        if (!specialStuff) lvls = lvls.filter(x => x.stars == stars)

        let diffImg = st
        let diffDir = "/diff"

        if (st > 10 && !specialStuff) {
            let demonType;
            switch(st) {
                case 11: demonType = 3; break;
                case 12: demonType = 4; break;
                case 13: demonType = 1; break;
                case 14: demonType = 5; break;
                case 15: demonType = 6; break;
            }
            if (st == 13) lvls = lvls.filter(x => x.demon && (!x.demonType || x.demonType == 1))
            else lvls = lvls.filter(x => x.demon && x.demonType == demonType)
            diffImg = "demon-" + demonType
        }

        else if (specialStuff) {
            diffDir = ""
            switch(st) {
                case 16: lvls = lvls.filter(x => x.type == "Gauntlet");  diffImg = "gauntlet"; break;
                case 17: lvls = lvls.filter(x => x.type == "Daily");  diffImg = "daily"; break;
                case 18: lvls = lvls.filter(x => x.type == "Weekly"); diffImg = "weekly"; break;
            }
        }

        let complete = lvls.filter(x => x.percentage >= 100)
        let rewards = lvls.map(x => countRewards(x))
        let totalStars = stars * complete.length
        if (specialStuff) totalStars = complete.map(x => x.stars).reduce((a, b) => a + b, 0)

        let rOrbs = rewards.map(x => x.orbs)
        let rDiamonds = rewards.filter(x => x.diamonds.total > 0).map(x => x.diamonds)

        complete.forEach((x, y) => {
            complete[y].foundCoins = (x.collectedCoins || []).filter(x => x).length
        })

        $('#diffTable').append(`
            <tr class="diffRow${specialStuff ? " specialRow" : ""}">
            <td${specialStuff ? ' class="center"' : ""}>
                <p><img style="height: ${specialStuff ? 60 : 40}px" src="assets${diffDir}/${diffImg}.png">${specialStuff ? "" : stars}</p></td>
            <td>
                <p><img style="height: 40px" title="Completed" src="assets/check.png">${complete.length}</p>
                <p><img style="height: 40px" title="Completed in Practice Mode" src="assets/buttons/practice.png">${lvls.filter(x => x.percentage < 100 && x.practicePercentage >= 100).length}</p>
                <p><img style="height: 40px" title="Played" src="assets/play.png">${lvls.length}</p>
            </td>
            <td>
                <p><img style="height: 40px" title="Online" src="assets/online.png">${complete.filter(x => x.type == "Online").length}</p>
                <p><img style="height: 40px" title="Gauntlet" src="assets/gauntlet.png">${complete.filter(x => x.type == "Gauntlet").length}</p>
                <p><img style="height: 40px" title="Daily" src="assets/${(st >= 10 && !specialStuff) || st == 18 ? "weekly" : "daily"}.png">${complete.filter(x => x.type == "Daily" || x.type == "Weekly").length}</p>
            </td>
            <td>
                <p><img style="height: 40px" src="assets/star.png">${totalStars}</p>
                <p><img style="height: 40px" src="assets/orbs.png">${rOrbs.map(x => x.current).reduce((a, b) => a + b, 0)}</p>
                <p><img style="height: 40px" src="assets/diamond.png">${rDiamonds.map(x => x.current).reduce((a, b) => a + b, 0)}</p>
            </td>
            <td>${allStats(lvls, "percentage", "%")}</td>
            <td>${allStats(lvls, "attempts")}</td>
            <td>${allStats(complete, "attempts")}</td>
            <td>${allStats(complete, "jumps")}</td>
            <td>${allStats(rOrbs, "current", specialStuff ? "" : `*/${orbAmounts[stars]}`, 1)}</td>
            <td>${allStats(rDiamonds, "current", specialStuff ? "" : `*/${stars <= 1 ? 0 : stars + 2}`)}</td>
            <td>${allStats(complete, "foundCoins")}</td>
            </tr>`)
       
    }
}

