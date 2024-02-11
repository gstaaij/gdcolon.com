function levelTime(secs) {
	let days = Math.floor(secs / 86400)
	if (days) secs -= days * 86400
    return `${days ? `${days}d+` : ""}${[Math.floor(+secs / 3600), Math.floor(+secs / 60) % 60, +secs % 60].map(v => v < 10 ? "0" + v : v).filter((v,i) => v !== "00" || i > 0).join(":")}`
}

function levelDetail(str, val, comma=true) {
    return `<span class="levelDetailName">${str}:<span class="levelDetailDot"></span></span><b> ${comma ? commafy(val) : val}</b><br>`
}

function listCreatedLevels(levelList) {

        $('.createdLevelButton').remove()
        if (levelList) createdTable = levelList
        else levelList = createdTable

        let searchQuery = ($('#customSearch').val() || "").toLowerCase().trim()
        if (searchQuery) levelList = levelList.filter(x => x.name.toLowerCase().trim().startsWith(searchQuery))

        let maxPages = maxPage(levelList, lvPageSize)
        if (lvPage <= 0) lvPage = 1
        if (lvPage > maxPages) lvPage = maxPages

        levelList = levelList.slice((lvPage-1)*lvPageSize, (lvPage-1)*lvPageSize + lvPageSize)
    
        if (lvPage <= 1) { $('#customLeft').addClass('greyed'); $('#customStart').addClass('greyed') }
        else { $('#customLeft').removeClass('greyed'); $('#customStart').removeClass('greyed') }
    
        if (lvPage == maxPages) { $('#customRight').addClass('greyed'); $('#customEnd').addClass('greyed') }
        else { $('#customRight').removeClass('greyed'); $('#customEnd').removeClass('greyed') }

        $('#customPage').val(lvPage).attr("max", maxPages)
        $('#customTotal').text(maxPages)

        levelList.forEach((x, n) => {

            let dataLength = x.levelData ? x.levelData.length : 0
            let dataSize = [Number((dataLength / 1024 / 1024).toFixed(2)), "MB"]
            if (dataSize[0] < 1) dataSize = [Number((dataLength / 1024).toFixed(2)), "KB"]

            let passwordStr = !x.password ? "No Copy" : x.password == 1 ? "Free" :
            `<span style="border-radius: 6px; background-color: white">${Number(String(x.password).slice(1))}</span> `

            let collectedCoins = [x.firstCoinCollected, x.secondCoinCollected, x.thirdCoinCollected].slice(0, x.totalCoins || 0)
            .map(x => x ? "𝚘" : "⨯").join("")

            let largerEditorTime = Math.max(x.editorTime || 0, x.totalEditorTime || 0)

            $('#createdLevelButtons').append(`
            <div class="createdLevelButton">
                <div class="closeCreated">
                    <img class="inline middle createdFace" src="./assets/diff/unrated/${x.requestedStars || 0}.png">
                    <div class="createdInfo inline middle">
                        <p style="margin-right: 7px; color: ${x.id ? x.unlisted ? "yellow" : "lime" : "-"}"><b>${x.name}</b></p>
                        ${x.copiedID ? `<img src="./assets/copied.png" height="25px" title="${x.copiedID}">` : ""}
                        ${x.objects > 40000 ? `<img src="./assets/large.png" height="25px" title="${x.objects}">` : ""}
                        ${x.revision ? `<p style="margin-right: 7px; font-size: 25px">(rev. ${x.revision || "-"})</p>` : ""}
                        ${x.id ? `<p style="margin-right: 7px; font-size: 25px">(${x.id || "-"})</p>` : ""}
                        <br>
                        
                        <div class="createdStat" style="width: 210px">
                            <img class="inline middle" src="./assets/time${totalTime ? x.editorTime == largerEditorTime ? "" : "2" : ""}.png">
                            <p class="inline middle">${levelTime((totalTime ? largerEditorTime : x.editorTime) || 0)}</p>
                        </div>

                        <div class="createdStat" style="width: 195px">
                            <img class="inline middle" src="./assets/object.png">
                            <p class="inline middle">${commafy(x.objects || 0)}</p>
                        </div>

                        <div class="createdStat" style="width: 195px">
                            <img class="inline middle" src="./assets/online.png">
                            <p class="inline middle">${dataSize.join(" ")}</p>
                        </div>

                        <div class="createdStat" style="width: 175px">
                            <img class="inline middle" src="./assets/info.png">
                            <p class="inline middle">${x.verified ? "Verified" : "Unverified"}</p>
                        </div>

                        <div class="createdStat" style="width: 100px;${x.folder ? "" : " display: none;"}">
                            <img class="inline middle" src="./assets/folder.png">
                            <p class="inline middle">${x.folder || 0}</p>
                        </div>
                    </div>
                </div>

                <hr noshade style="margin: 25px auto">
                
                <p class="extraLevelInfo" style="display: none; white-space: normal; margin-bottom: 25px; width: 1000px;">${x.description || "(no description provided)"}<p>

                <p class="extraLevelInfo inline" style="width: 475px; display: none;">
                ${levelDetail("Level Position", Number(x["_key"].slice(2)) + 1 || 0)}
                ${levelDetail("Level ID", x.id || "N/A", false)}
                ${levelDetail("Copied ID", x.copiedID || "N/A", false)}
                ${levelDetail("Song ID", x.officialSongID != undefined ? "Level " + (+x.officialSongID + 1) : x.customSongID || "Level 1", false)}
                ${levelDetail("Objects", x.objects || 0)}
                ${levelDetail("Version", x.version || 1)}
                ${levelDetail("Revision", x.revision || 0)}
                <br>
                ${levelDetail("Level Size", dataSize.join(" "))}
                ${levelDetail("Length", x.length || "Tiny")}
                ${levelDetail("Coins", x.totalCoins || 0)}
                ${levelDetail("Verified Coins", collectedCoins)}
                ${levelDetail("Requested Stars", x.requestedStars || 0)}
                ${levelDetail("Attempts", x.attempts)}
                ${levelDetail("Jumps", x.jumps)}
                </p>

                <p class="extraLevelInfo inline" style="display: none; margin-left: 55px;">
                ${levelDetail("Verified", x.verified ? "Yes!" : "No")}
                ${levelDetail("Unlisted", x.unlisted ? "Yes!" : "No")}
                ${levelDetail("Two Player", x.twoPlayer ? "Yes!" : "No")}
                ${levelDetail("LDM", x.ldm ? "Yes!" : "No")}
                ${levelDetail("Normal %", (x.percentage || 0) + "%")}
                ${levelDetail("Practice %", (x.practicePercentage || 0) + "%")}
                ${levelDetail("Password", passwordStr)}
                <br>
                ${levelDetail("Folder", x.folder || "None")}
                ${levelDetail("Editor Time", levelTime(x.editorTime || 0))}
                ${levelDetail("Editor Time (+copies)", levelTime(x.totalEditorTime || 0))}
                ${levelDetail("Editor Camera X", x.editorCameraX || 0)}
                ${levelDetail("Editor Camera Y", x.editorCameraY || 0)}
                ${levelDetail("Editor Zoom", (x.editorCameraZoom || 1) + "x")}
                ${levelDetail("Editor Layer", (x.editorLayer == "-1" ? "All" : x.editorLayer || 0))}
                </p>

                <hr noshade style="margin: 25px auto">

                <div key="${x["_key"].slice(2)}" class="viewLevelData">
                    <p data="inner" style="width: 525px;" class="downloadData inline middle">View level data (inner string)</p>
                    <p data="outer" class="downloadData inline middle">Download .gmd file (raw XML)</p>
                </div>

            </div>`)
        })
    }

    $(document).on('click', '.createdLevelButton', function () {
        if ($(this).hasClass('expanded')) return
        $('.createdLevelButton').removeClass('expanded')
        $('.extraLevelInfo').hide()
        $(this).addClass('expanded')
        $(this).find(".extraLevelInfo").show()
        $('html, body').animate({ scrollTop: $(this).offset().top - 20 }, 50);
    })

    $(document).on('click', '.closeCreated', function (e) {
        if ($(this).parent().hasClass('expanded')) {
            $('.createdLevelButton').removeClass('expanded')
            $('.extraLevelInfo').hide()
            e.stopPropagation()
        }
    })

    $(document).on('click', '.downloadData', function (e) {
        let levelKey = $(this).parent().attr('key')
        let foundLevel = createdTable[levelKey]
        let isInner = $(this).attr('data') == "inner"
        if (!foundLevel) return
        let dataStr = ""
        if (isInner) {
            dataStr = (foundLevel.levelData) || ""
            dataStr = dataStr.startsWith("H4sIA") ? decode(dataStr) : dataStr // decode
        }
        else dataStr = $(levelXML).find("k").filter(function() { return $(this).html() == `k_${levelKey}` }).next()[0].outerHTML
        let dataBlob = new Blob([dataStr], {type: isInner ? 'text/plain' : 'application/xml'})
        let blobURL = URL.createObjectURL(dataBlob);
        let blobLink = document.createElement('a');
        blobLink.href = blobURL;

        if (isInner) {
            blobLink.target = '_blank';
        }
        else {
            blobLink.download = `${foundLevel.name}.gmd`
        }

        blobLink.click();
    })
    
    $('#customRight').click(function() {
        lvPage = Math.min(maxPage(createdTable, lvPageSize), lvPage + 1)
        listCreatedLevels()
    })

    $('#customLeft').click(function() {
        lvPage--
        listCreatedLevels()
    })

    $('#customStart').click(function() {
        lvPage = 1
        listCreatedLevels()
    })

    $('#customEnd').click(function() {
        lvPage = maxPage(createdTable, lvPageSize)
        listCreatedLevels()
    })

    $('#customPage').change(function() {
        lvPage = +$(this).val()
        listCreatedLevels()
    })