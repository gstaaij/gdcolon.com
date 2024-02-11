$('#uploadDiv').on('dragover dragenter', function(e) {
    if (!allowUploading) return
    $('#uploadDiv').addClass('dragOver')
    e.preventDefault();
    e.stopPropagation();
})

$('#uploadDiv').on('dragleave dragend drop', function(e) {
    if (!allowUploading) return
    $('#uploadDiv').removeClass('dragOver')
    e.preventDefault();
    e.stopPropagation();
})

$('#uploadDiv').on('drop', function(e){
    if (!allowUploading) return
    if (e.originalEvent.dataTransfer){
        if (e.originalEvent.dataTransfer.files.length) {
            e.preventDefault();
            e.stopPropagation();
            readUploadedFile(e.originalEvent.dataTransfer.files[0])
        }   
    }
});

$(document).on('click', '.categoryBtn', function () {
    $('.category').hide()
    $('.categoryBtn').removeClass('selectedCategory')
    $(`#${$(this).attr('category')}`).show()
    $(this).addClass('selectedCategory')
})

function loadButtons() {

    $('#levelFilterToggleOn').click(function() {
        $('#levelSearchFilters').show()
        $('#levelTableDiv').hide()
    })

    $(document).on('click', '.imgFilter, .chestType', function () {
        let filterEnabled = $(this).attr('enabled')
        $(this).attr('enabled', (filterEnabled == "true") ? "false" : "true")
        if ($(this).hasClass('chestType')) {
            allowedChests = []
            $('.chestType').each(function() {
                if ($(this).attr('enabled') == "true") allowedChests.push($(this).attr('chest'))
            })
            appendRewards()
        }
    })

    $('.imgFilter, .chestType').each(function() {
        $(this).addClass('gdButton')
        if (!$(this).attr('enabled')) $(this).attr('enabled', 'true')
    })

    if (!data.levelFolders) data.levelFolders = {}
    let folderKeys = Object.keys(data.levelFolders).map(x => +x)
    let topFolder = folderKeys.length ? Math.max(...folderKeys) : 1
    let selectedFolder = 0
    $('#lvlFolder').attr("max", topFolder)

    function folderStuff() {
        $('#lvlFolder').val(selectedFolder)
        let folderText = selectedFolder == 0 ? "All Levels" : data.levelFolders[selectedFolder] || "Unnamed"
        folderText += ` (⨯${selectedFolder == 0 ? levels.length : levels.filter(x => x.folder == selectedFolder).length})`
        $('#folderName').text(folderText)
    }
    folderStuff()

    $('#folderLeft').click(function() { selectedFolder--; if (selectedFolder < 0) selectedFolder = 0; folderStuff() } )
    $('#folderRight').click(function() { selectedFolder++; if (selectedFolder > topFolder) selectedFolder = topFolder; folderStuff() } )

    $('#lvlFolder').change(function() {
        selectedFolder = +$(this).val()
        folderStuff()
    })

    $('#saveLevelFilters').click(function() {

        let fs = [...levels]
        let filterList = []

        function addFilter(condition) {
            filterList.push(condition)
        }

        if (selectedFolder > 0) addFilter(x => x.folder == selectedFolder)

        $('.minFilter').each(function() {
            let t = $(this)
            let filterName = t.attr('filter')
            let inputs = t.find("input")
            let min = $(inputs[0]).val()
            let max = $(inputs[1]).val()
            if (min && Number.isInteger(+min)) addFilter(x => (x[filterName] || 0) >= +min)
            if (max && Number.isInteger(+max)) addFilter(x => (x[filterName] || 0) <= +max)
        })

        let sortStuff = {}
        $('.imgFilter').each(function() {
            let t = $(this)
            let filterName = t.parent().attr('filter')
            if (!sortStuff[filterName]) sortStuff[filterName] = {}
            sortStuff[filterName][t.attr('v')] = t.attr('enabled') == "true"
        })

        Object.keys(sortStuff.type).forEach(x => {
            if (!sortStuff.type[x]) addFilter(y => y.type != x)
        })

        Object.keys(sortStuff.stars).forEach(x => {
            if (!sortStuff.stars[x]) addFilter(y => y.type != "Official" && (y.stars || 0) != x)
        })

        Object.keys(sortStuff.demon).forEach(x => {
            if (!sortStuff.demon[x]) {
                if (x == 1) addFilter(y => y.demonType && y.demonType > 1)
                else addFilter(y => y.demonType != x)
            }
        })

        Object.keys(sortStuff.userRating).forEach(x => {
            if (sortStuff.userRating[x]) addFilter(y => y[x])
        })

        if (sortStuff.uncompletedFilter.stars) addFilter(y => y.stars > 0 && y.percentage < 100)
        if (sortStuff.uncompletedFilter.orbs) addFilter(y => y.stars > 1 && y.manaOrbPercentage < 100)
        if (sortStuff.uncompletedFilter.leaderboard) addFilter(y => y.leaderboardPercentage < 100)

        // saved info
        let si = sortStuff.savedInfo
        addFilter(y => (si.id && !y.name) || (si.metadata && y.name && !y.hasLevelData) || (si.leveldata && y.hasLevelData))

        // combine all them filters
        fs = fs.filter(y => !filterList.some(f => !f(y)))

        $('.levelRow').remove()
        page = 1
        appendToTable(fs)

        $('#levelSearchFilters').hide()
        $('#levelTableDiv').show()
    })

    $(document).on('click', '.levelSort', function() {
        let sort = $(this).attr('sort')
        if (sort == "type") {
            searchTable = [...levels]
            return $('#saveLevelFilters').trigger('click')
        }
        else {
            searchTable = searchTable.sort((a, b) => (+b[sort] || 0) - (+a[sort] || 0))
            if (sort == "id") searchTable = searchTable.reverse()
        }
        page = 1
        appendToTable(searchTable)
    })

    $(document).on('click', '.chestSort', function() {
        let sort = $(this).attr('sort')
        if (sort == "chest") chestTable = [...data.allRewards]
        else if (sort == "id") chestTable = chestTable.sort((a, b) => parseChestID(a) - parseChestID(b))
        else {
            chestTable = chestTable.sort(function (a, b) {
                return ((b.rewards.find(x => x.item == sort) || {}).amount || 0) - 
                       ((a.rewards.find(x => x.item == sort) || {}).amount || 0)
            })
        }
        chestPage = 1
        appendRewards(chestTable)
    })

    $(document).on('click', '.filterPage', function () {
        let pageFilter = $(this).attr('page')
        $(`.searchFilter[page!="${pageFilter}"]`).hide()
        $(`.searchFilter[page="${pageFilter}"]`).show()
        $('.filterPage').removeClass('selectedFilterPage')
        $(this).addClass('selectedFilterPage')
    })
    
    $('.filterPage[page="1"]').trigger('click')
    $('.categoryBtn[category="basicStats"]').trigger('click')

    let includePass = false
    $(document).on('click', '.incPass', function () {
        includePass = !includePass
        if (includePass) { $('#passTrue').show(); $('#passFalse').hide() }
        else { $('#passTrue').hide(); $('#passFalse').show() }
    })

    $('#downloadXML').click(function() {
        return downloadFile(GameManagerXML, (data.username || "player") + ".xml", !includePass)
    })

    $('#downloadJSON').click(function() {
        let dataJSON = { ...data } // clone
        dataJSON.allLevels = levels
        return downloadFile(JSON.stringify(dataJSON, null, 2), (data.username || "player") + ".json")
    })

    $('#downloadLevels').click(function() {
        return downloadFile(JSON.stringify(levels, null, 2), (data.username || "player") + "_levels.json")
    })

    $('input[type="number"]').attr('placeholder', "[none]").on('input blur', function (event) {
        var x = +$(this).val();
        var max = +$(this).attr('max');
        var min = +$(this).attr('min');
        
        if (!min) min = 0
        if (!max) max = Infinity

        if (event.type == "input") {
            if (x > max || x < min) $(this).addClass('red')
            else $(this).removeClass('red')
        }

        else {
            if (!$(this).val()) return $(this).removeClass('red')
            else if ($(this).hasClass("decimal") && $(this).val() != "") $(this).val(Math.max(Math.min(Math.round(x * (10 ** $(this).attr('places'))) / (10 ** $(this).attr('places')), max), 0));
            else $(this).val(Math.max(Math.min(Math.floor(x), max), min));
            $(this).removeClass('red')
        }
    })

}

$(document).keydown(function(k) {
	if ($('#uploadMain').is(':visible') && !$('#errorMsg').is(':visible')) {
        if (k.shiftKey && k.which == 191) {
            downloadMode = !downloadMode
            if (downloadMode) {
                $('#headsDown').show()
                $('#headsUp').hide()
            }
            else {
                $('#headsUp').show()
                $('#headsDown').hide()
            }
        }
	}
});