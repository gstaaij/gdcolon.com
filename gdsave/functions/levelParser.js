let lvPage = 1
let lvPageSize = 20
let createdTable = []
let customUsername = "my"
let totalTime = false
let levelXML

function levelAnalysis(levelSave) {

    levelXML = levelSave.children[1]
    levelData = parseXML(levelXML)
    levelData = arrLabelObject(levelData, levelKeys, true).filter(x => x.name)

    listCreatedLevels(levelData.sort((a, b) => (Number(a["_key"].slice(2)) || 0) - (Number(b["_key"].slice(2)) || 0)))

    let foundUsername = levelData.find(x => x.author)
    if (foundUsername) customUsername = foundUsername.author.toLowerCase()

    $('#uploadDiv').hide()
    $('#createdLevels').show()

    $(document).on('click', '.customSort', function() {
        let sort = $(this).attr('sort')
        let special = $(this).attr('special')

        if (special == "time") totalTime = false

        if (special == "name") createdTable = createdTable.sort((a, b) => a.name.localeCompare(b.name))
        else if (special == "size") createdTable = createdTable.sort((a, b) => (b.levelData || "").length - (a.levelData || "").length)
        else if (special == "totalTime") {
            totalTime = true;
            createdTable.sort(function (a, b) { return (Math.max(b.totalEditorTime || 0, b.editorTime || 0)) - Math.max(a.totalEditorTime || 0, a.editorTime || 0) })  }
        else createdTable = createdTable.sort(function (a, b) { return (b[sort] || 0) - (a[sort] || 0) })

        lvPage = 1
        listCreatedLevels(createdTable)
        $('#customSortBy').text($(this).attr('by'))
    })

    $('#customSearch').on('input blur', function () {
        lvPage = 1
        listCreatedLevels(createdTable)
    })

    let includeData = true
    $(document).on('click', '.incPass', function () {
        includeData = !includeData
        if (includeData) { $('#dataTrue').show(); $('#dataFalse').hide() }
        else { $('#dataTrue').hide(); $('#dataFalse').show() }
    })

    $('#downloadCustomXML').click(function() {
        return downloadFile(GameManagerXML, customUsername + "_levels.xml", null, !includeData)
    })

    $('#downloadCustomJSON').click(function() {
        // cloning arrays is pain
        let dataJSON = []
        levelData.forEach(x => dataJSON.push({...x}))

        if (!includeData) dataJSON.forEach(x => { x.levelDataLength = (x.levelData || "").length; delete x.levelData})
        return downloadFile(JSON.stringify(dataJSON, null, 2), customUsername + "_levels.json")
    })

}