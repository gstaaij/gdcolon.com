const fileInput = document.getElementById("fileUpload");
const sheetInput = document.getElementById("imageUpload");
const spritesInput = document.getElementById("spritesUpload");

const loader = PIXI.Loader.shared;
const reader = new FileReader()
const invalidFileWarning = "This site only supports spritesheets. (they should have HD/UHD in their name)"
const TRANSPARENT = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

const canvas = document.getElementById('atlas');
const packCanvas = document.getElementById('packCanvas');
const app = new PIXI.Application({ view: canvas, width: 3000, height: 3000, backgroundAlpha: 0 });
const Packer = MaxRectsPacker.MaxRectsPacker; // lmao

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const sheetPresets = ['GJ_GameSheet', 'GJ_GameSheet02', 'GJ_GameSheet03', 'GJ_GameSheet04', 'GJ_GameSheetEditor',
'GJ_GameSheetGlow', 'GJ_LaunchSheet', 'GJ_ParticleSheet', 'GJ_PathSheet',
'GJ_ShopSheet', 'GJ_ShopSheet01', 'GJ_ShopSheet02', 'GJ_ShopSheet03',
'CCControlColourPickerSpriteSheet', 'DungeonSheet', 'FireSheet_01', 'GauntletSheet', 'PixelSheet_01', 'SecretSheet', 'TowerSheet',
'TreasureRoomSheet', 'WorldSheet', 'PlayerExplosion_00',
'icons/player_00', 'icons/ship_00', 'icons/player_ball_00', 'icons/bird_00', 'icons/dart_00', 'icons/robot_00', 'icons/spider_00', 'icons/swing_00', 'icons/jetpack_00']

$('#packPresets').append(sheetPresets.map(x => `<option>${x}</option>`).join("\n"))
$('#packPresets').change(function () {
    $('#pack_sheetName').val($(this).val())
    $(this).val("-")
})

const fileTemplate = $('.fileTexture').first().clone()
$('.fileTexture').remove()

$('#spritePreview').attr("src", TRANSPARENT)
$('#packResult').attr("src", TRANSPARENT)

let zoom = 1
let filePage = 0

let busy = false

let sheet = null
let imageName = null
let b64 = null

fileInput.addEventListener("change", function () {
    plistUpload(Array.from(this.files).find(x => x.name.toLowerCase().endsWith(".plist")) || this.files[0])
})

function plistUpload(file) {
    if (!file) return
    if (file.type == "image/png" || file.name.toLowerCase().endsWith(".png")) { return sheetUpload(file) }
    reader.readAsText(file)
    reader.onload = function (data) {
        readPlist(data.target.result)
    }
}

function readPlist(data) {
    if (sheet) return
    let plist = new Plist(data)
    if (!plist.data) return alert("Invalid XML data! Are you sure this is the right file?")
    else if (plist.data.maxParticles && plist.data.finishColorRed) return alert("This file is for a particle effect! " + invalidFileWarning)
    else if (plist.data.animationContainer && plist.data.usedTextures) return alert("This file is for animations! " + invalidFileWarning)
    else if (plist.data.Robot && plist.data.Spider) return alert("You found GD's master animation file! Unfortunately, it serves no purpose here. " + invalidFileWarning)
    else if (!plist.data.frames || !plist.data.metadata || !Object.values(plist.data.frames).some(x => x.spriteSize || x.sourceSize)) return alert("This doesn't appear to be a valid texture plist! " + invalidFileWarning)
    else {
        sheet = new Spritesheet(plist.data.frames, plist.data.metadata.textureFileName)
        if (b64) {
            if (imageName != sheet.name && !confirm(`⚠ This file doesn't match the name of the image you uploaded!\nAre you sure you want to use it? This will likely lead to a broken spritesheet.\n\nUploaded file: ${sheet.name.replace(/.png$/, ".plist")}\nCorrect file: ${imageName.replace(/.png$/, ".plist")}`)) return
            extractTextures()
        }
        else {
            let foundImg = Array.from(fileInput.files).find(x => x.name == sheet.name)
            if (foundImg) sheetUpload(foundImg)
            else showImageUpload(sheet.name)
        }
    }
}

function showImageUpload() {
    if (!sheet) return
    $('#sheetName').text(sheet.name)
    $('#uploadPlist').hide()
    $('#uploadSheet').show()
}

sheetInput.addEventListener("change", function () {
    sheetUpload(this.files[0])
})

function sheetUpload(file) {
    if (!file) return
    if (sheet && sheet.name != file.name && !confirm(`⚠ This file doesn't match the name specified by the .plist file!\nAre you sure you want to use it? This will likely lead to a broken spritesheet.\n\nUploaded file: ${file.name}\nCorrect file: ${sheet.name}`)) return
    reader.readAsDataURL(file)
    reader.onload = function (data) {
        b64 = data.target.result
        imageName = file.name
        if (b64 && sheet) {
            extractTextures()
        }
        else {
            $('#alsoUpload').hide()
            $('#alsoUploadedName').text(file.name)
            $('#alsoUploaded').show()
            $('#fileUpload').attr("accept", ".xml,.plist")
        }
    }
}

let spritesToMerge = []
spritesInput.addEventListener("change", function () {
    [...this.files].forEach(x => {
        if (x.type == "image/png") {
            spritesToMerge = spritesToMerge.filter(s => s.name != x.name)
            spritesToMerge.push(x)
        }
    })
    listSpritesToMerge()
})

function listSpritesToMerge() {
    spritesToMerge = spritesToMerge.sort((a, b) => a.name.localeCompare(b.name))
    $('.spriteUploadCount').text(spritesToMerge.length)
    $('#allSpritesToMerge').text(spritesToMerge.map(x => x.name).join(", "))
    if (spritesToMerge.length > 0) $('#mergeContinue').show()
    else $('#mergeContinue').hide()
}

function extractTextures(data) {
    if (!sheet || !b64) return
    sheet.b64 = b64
    sheet.loadTextures()
        .then(displaySheet)
        .catch(showError)
}

let selectionAlpha = 0.75
let selectionAlphaLocked = 0.95
let selection = new PIXI.Container()
selection.filters = [new PIXI.filters.AlphaFilter(selectionAlpha)]

function displaySheet() {
    $('#uploadSheet').hide()
    $('#uploadPlist').hide()
    $('#plistName').text(sheet.name)
    $('#main').show()

    $('.yesFileView').hide()
    $('.noFileView').show()

    selection.removeChildren()
    app.stage.removeChildren()
    let spritesheet = loader.resources[sheet.name].texture

    const scale = 2

    $('#atlas').css((spritesheet.width < spritesheet.height) ? "width" : "height", "100%")
    $('#atlas').css((spritesheet.width < spritesheet.height) ? "height" : "width", "initial")

    let sheetSprite = new PIXI.Sprite(spritesheet)
    sheetSprite.interactive = true
    app.stage.addChild(sheetSprite)
    app.stage.scale.set(1 / scale)
    app.stage.sortableChildren = true

    canvas.width = app.stage.width
    canvas.height = app.stage.height

    selection.visible = false
    app.stage.addChild(selection)

    for (let i = 0; i < 4; i++) {
        let g = new PIXI.Graphics();
        g.beginFill(0)
        g.drawRect(0, 0, 100, 100)
        selection.addChild(g)
    }

    sheetSprite.mousemove = onMouseMove
    function onMouseMove(e) {
        if (selectionLocked || !$('#atlas').is(":visible")) return
        let onCanvas = (e.data.originalEvent.target || e.data.originalEvent.originalTarget).nodeName == "CANVAS"
        let pos = [e.data.global.x, e.data.global.y].map(x => x * scale)
        let foundSprite = !onCanvas ? null : Object.entries(sheet.data).find(x => {
            let b = x[1].textureBounds
            return (b[0] <= pos[0]) && (b[1] <= pos[1]) && (b[2] >= pos[0]) && (b[3] >= pos[1])
        })
        if (foundSprite) {
            if (lastSprite && foundSprite[0] == lastSprite[0]) return
            lastSprite = foundSprite
            sheetSprite.cursor = "pointer"
            updatePreview(...foundSprite)
            let tb = foundSprite[1].textureBounds
            let rects = selection.children

            rects[0].width = spritesheet.width; rects[0].height = tb[1];
            rects[1].width = spritesheet.width; rects[1].position.y = tb[3]; rects[1].height = spritesheet.height - tb[3];
            rects[2].width = tb[0]; rects[2].height = spritesheet.height;
            rects[3].width = spritesheet.width - tb[2]; rects[3].position.x = tb[2]; rects[3].height = spritesheet.height
            selection.visible = true
        }
        else if (!e.target) {
            selection.visible = false
            clearPreview()
        }
        else {
            selection.children[0].width = spritesheet.width; selection.children[0].height = spritesheet.height;
            clearPreview()
        }
    }

    sheetSprite.mousedown = function (e) {
        if (selectionLocked) toggleSelectionLock(false)
        else if (currentPreview) toggleSelectionLock(true)
        onMouseMove(e)
    }

    $(window).trigger('resize')
    clearPreview()
    loadFileView()
}

let selectionLocked = false
function toggleSelectionLock(val) {
    selectionLocked = val
    selection.filters[0].alpha = (selectionLocked ? selectionAlphaLocked : selectionAlpha)
}

let currentPreview = null
let lastSprite = null
function updatePreview(name, data) {
    if (name == currentPreview) return
    if (!data) data = sheet.data[name]
    currentPreview = name

    let size = data.spriteSourceSize
    let src = app.renderer.plugins.extract.base64(sheet.sprites[name])
    $('#spritePreview').attr("src", src)

    $('#textureName').text(name)
    scaleToFit()
    $('#texturePos').text(`X: ${data.texturePos[0]}, Y: ${data.texturePos[1]}`)
    $('#textureSize').text(`W: ${size[0]}, H: ${size[1]}`)
    $('#extraTextureInfo').show()
    $('#zoomButtons').hide()

    $("#downloadTexture").removeClass("inactive")
    $("#copyTexture").removeClass("inactive")
}

$('#enableFileView').click(function () {
    filePage = 0
    $('.noFileView').hide()
    $('.yesFileView').show()
    loadFileView()
})

$('#disableFileView').click(function () {
    $('.noFileView').show()
    $('.yesFileView').hide()
    $('#fileList').empty()
    clearPreview()
})

let defualtFilePageSize = 50
let filePageSize = defualtFilePageSize
$('#filePageSize').val(filePageSize)

function loadFileView(cap) {
    busy = true
    let sprites = Object.keys(sheet.sprites)
    let totalItems = sprites.length
    let totalPages = Math.floor((totalItems - 1) / filePageSize) + 1
    if (filePage < 0) filePage = cap ? 0 : (totalPages - 1)
    else if (filePage >= totalPages) filePage = cap ? (totalPages - 1) : 0
    let files = sprites.slice(filePage * filePageSize, filePage * filePageSize + filePageSize)
    $('#fileList').empty()
    files.forEach(x => {
        let box = fileTemplate.clone()
        let src = TRANSPARENT
        try { src = app.renderer.plugins.extract.base64(sheet.sprites[x]) }
        catch (e) { }
        box.find("img").attr("src", src)
        box.attr("sprite", x)
        $('#fileList').append(box)
    })
    busy = false
    let pageIndex = filePage * filePageSize
    $('#filePageDisplay').text(`${pageIndex + 1} to ${Math.min(totalItems, pageIndex + filePageSize)} of ${totalItems}`)
    $('#fileTotalPages').text(totalPages)
    $('#filePageInput').val(filePage + 1)
}

$('#filePageInput').blur(function () {
    filePage = Number($(this).val()) || 1
    filePage--
    loadFileView(true)
})

$('#filePageSize').blur(function () {
    filePageSize = Number($(this).val()) || defualtFilePageSize
    if (filePageSize < 10) filePageSize = 10
    else if (filePageSize > 500) filePageSize = 500
    $('#filePageSize').val(filePageSize)
    loadFileView(true)
})

$(document).on('click', '#fileList .fileTexture', function () {
    let isSelected = $(this).attr("selected")
    $('.fileTexture[selected]').removeAttr('selected')
    if (isSelected) return clearPreview()
    $(this).attr("selected", "true")
    updatePreview($(this).attr("sprite"))
})

function clearPreview() {
    lastSprite = null
    currentPreview = null
    $('#spritePreview').attr("src", TRANSPARENT)
    $('#extraTextureInfo').hide()
    $('#zoomButtons').show()
    $('#textureName').text("(no texture)")
    scaleToFit()
}

$('#downloadTexture').click(function () {
    if (!currentPreview) return
    $(this).addClass("inactive")
    let link = document.createElement('a');
    link.download = currentPreview;
    link.href = app.renderer.plugins.extract.base64(sheet.sprites[currentPreview])
    link.click();
});

$('#copyTexture').click(async function () {
    if (!currentPreview) return
    $(this).addClass("inactive")
    let blob = await canvasToBlob(app.renderer.plugins.extract.canvas(sheet.sprites[currentPreview]))
    let item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([item]);
});

$('#downloadAll').click(async function () {
    if (busy) return
    busy = true
    let downloadAll = $(this).text()
    $(this).addClass("inactive")
    let zip = new JSZip()
    let blobs = {}
    $(this).text("Rendering sprites...")
    for (const [name, sprite] of Object.entries(sheet.sprites)) {
        blobs[name] = canvasToBlob(app.renderer.plugins.extract.canvas(sprite))
    }
    Promise.all(Object.values(blobs)).then(() => {
        $(this).text("Zipping sprites...")
        for (const [name, blob] of Object.entries(blobs)) {
            zip.file(name, blob)
        }
        $(this).text("Generating zip file...")
        zip.generateAsync({ type: "blob" }).then(async blob => {
            let downloader = document.createElement('a');
            downloader.href = URL.createObjectURL(new Blob([blob], { type: "application/zip" }))
            downloader.setAttribute("download", sheet.name.replace(/\.png$/, "") + ".zip");
            document.body.appendChild(downloader);
            downloader.click();
            document.body.removeChild(downloader);
            $(this).text("Download complete!")
            busy = false
            setTimeout(() => {
                $(this).removeClass("inactive")
                $(this).text(downloadAll)
            }, 2000);
        })
    }).catch((e => showError(e)))
});

let packStage = new PIXI.Container();
$('#createSheet').click(async function () {

    let packName = $('#pack_sheetName').val()
        .replace(/(\.png$|\.plist$)/gi, "")
        .replace(/-u?hd($|\..+)/gi, "")
    if (!packName) return alert("Please enter the spritesheet name! (e.g. GJ_GameSheet03)")

    if (busy) return
    busy = true

    let packQuality = $('#pack_resolution').val()
    if (packQuality.length) packName += ("-" + packQuality)

    let packNameSlashed = packName.split("/").pop()

    $('#packLoaded').hide()
    $('#packLoading').show()

    $('#createdSheet').text(packName)
    $('#packResult').attr("src", TRANSPARENT)
    $('.packStep').hide()
    $('#packStep3').show()

    let paddingAmount = Number($('#pack_padding').val()) || 0

    let packOptions = {
        smart: true,
        pot: false,
        allowRotation: $('#pack_rotate').prop('checked'),
    }

    let imageFiles = spritesToMerge.map(x => createImage(x))
    Promise.all(imageFiles).then(files => {
        loader.add(files.map(x => ({ name: x.name, url: x.data })))
        loader.load((l, resources) => {
            let invalidSprites = []
            let sprites = []
            files.forEach((x, y) => {
                let spr = new PIXI.Sprite(resources[x.name].texture)
                let sourceSize = [x.width, x.height]
                let spriteCanvas = app.renderer.plugins.extract.canvas(spr);
                let ctx = spriteCanvas.getContext('2d')
                let pixels = ctx.getImageData(0, 0, spr.width, spr.height)
                let xRange = [spr.width, 0]
                let yRange = [spr.height, 0]

                // crop whitespace
                let atLeastOneFuckingPixel = false // player_111_extra_001.png
                for (let i = 0; i < pixels.data.length; i += 4) {
                    let alpha = pixels.data[i + 3]
                    let realIndex = i / 4
                    let pos = [realIndex % spr.width, Math.floor(realIndex / spr.width)]

                    if (alpha > 0) { // if pixel is not blank...
                        if (pos[0] < xRange[0]) xRange[0] = pos[0]      // if x pos is < the lowest x pos so far
                        if (pos[0] > xRange[1]) xRange[1] = pos[0]      // if x pos is > the highest x pos so far
                        if (pos[1] < yRange[0]) yRange[0] = pos[1]      // if y pos is < the lowest y pos so far
                        if (pos[1] > yRange[1]) yRange[1] = pos[1]      // if y pos is > the highest y pos so far
                        atLeastOneFuckingPixel = true
                    }
                }
                xRange[1]++; yRange[1]++

                if (!atLeastOneFuckingPixel) return invalidSprites.push(x.name)

                let spriteW = xRange[1] - xRange[0]
                let spriteH = yRange[1] - yRange[0]
                let xOffset = (sourceSize[0] - spriteW)
                let yOffset = (sourceSize[1] - spriteH)

                let xDiff = [xRange[0], sourceSize[0] - xRange[1]]
                let yDiff = [yRange[0], sourceSize[1] - yRange[1]]

                xOffset = xDiff[0] - xDiff[1]
                yOffset = yDiff[1] - yDiff[0]

                xOffset /= 2
                yOffset /= 2

                let trimmedTexture = ctx.getImageData(xRange[0], yRange[0], spriteW, spriteH)
                let newCanvas = document.createElement('canvas').getContext('2d')
                newCanvas.canvas.width = spriteW; newCanvas.canvas.height = spriteH;
                newCanvas.putImageData(trimmedTexture, 0, 0)

                sprites.push({ name: x.name, size: [spriteW, spriteH], sourceSize, offset: [xOffset, yOffset], xRange, yRange, xDiff, yDiff, ctx: newCanvas })
            })

            let packer = new Packer(32000, 32000, paddingAmount, packOptions)
            packer.addArray(sprites.map(x => ({ width: x.size[0], height: x.size[1], name: x.name, data: x })))
            let data = packer.bins[0]

            packStage.removeChildren()

            console.log(sprites)
            console.log(data)

            let plistFrames = []
            data.rects.forEach(z => {
                let x = z.data
                plistFrames.push({
                    name: x.name,
                    size: x.size,
                    sourceSize: x.sourceSize,
                    position: [z.x, z.y],
                    rotated: z.rot,
                    offset: x.offset,
                    range: [x.xRange[0], x.yRange[0]]
                })

                let texture = PIXI.Texture.from(x.ctx.canvas)
                let sprite = new PIXI.Sprite(texture)
                sprite.position.set(z.x, z.y)
                if (z.rot) {
                    sprite.anchor.set(0, 1)
                    sprite.angle = 90
                }
                packStage.addChild(sprite)
            })

            invalidSprites.forEach(x => {
                plistFrames.push({ name: x })
            })

            let packFormat = $('#pack_format').val()
            let createdPlist = new PlistBuilder({
                name: packName + ".png",
                width: data.width,
                height: data.height,
                frames: plistFrames.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
            }, packFormat)
            busy = false

            let b64 = app.renderer.plugins.extract.base64(packStage)
            $('#packResult').attr("src", b64)
            $('#downloadPlist').text(`Download ${createdPlist.extension}`)

            $('#downloadPack').off("click").click(function () {
                let link = document.createElement('a');
                link.download = packNameSlashed + ".png";
                link.href = b64
                link.click();
            });

            $('#downloadPlist').off("click").click(function () {
                let link = document.createElement('a');
                link.download = packNameSlashed + createdPlist.extension;
                link.href = window.URL.createObjectURL(new Blob([createdPlist.result], { type: "text/txt" }))
                link.click();
            });

            $('#packDetails').text(`${data.rects.length} sprites (${data.width} x ${data.height})`)

            $('#packLoaded').show()
            $('#packLoading').hide()
        })
    }).catch((e) => showError(e))
})

function canvasToBlob(canvas) {
    return new Promise(res => {
        canvas.toBlob(function (blob) {
            res(blob)
        })
    })
}

function createImage(file) {
    return new Promise(res => {
        let read = new FileReader()
        read.onload = function () {
            let img = new Image()
            img.onload = function () {
                res({ name: file.name, width: img.width, height: img.height, data: read.result })
            }
            img.src = read.result
        }
        read.readAsDataURL(file)
    })
}

$(window).resize(function () {
    $('[copywidth]').each(function () {
        $(this).css("height", $(this).width() + "px")
    })
    scaleToFit()
})

$('#dragTarget').on('dragover dragenter', function (e) {
    if ($('.allowDrop').is(":visible")) {
        $('#dragTarget').addClass('dragOver')
        e.preventDefault();
        e.stopPropagation();
    }
})

$('#dragTarget').on('dragleave dragend drop', function (e) {
    if ($('.allowDrop').is(":visible")) {
        $('#dragTarget').removeClass('dragOver')
        e.preventDefault();
        e.stopPropagation();
    }
})

$('#dragTarget').on('drop', function (e) {
    let foundInput = $('.allowDrop:visible').find("input[type=file]")
    if ($('.allowDrop').is(":visible") && foundInput.length && e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
        e.preventDefault();
        e.stopPropagation();
        let accepted = foundInput.attr("accept").split(",")
        let allowedFiles = new DataTransfer();
        [...e.originalEvent.dataTransfer.files].forEach(x => {
            if (accepted.some(z => z.startsWith(".") ? x.name.endsWith(z) : z == x.type)) allowedFiles.items.add(x)
        })
        foundInput[0].files = allowedFiles.files
        foundInput[0].dispatchEvent(new Event("change"))
    }
});

$('.changeZoom').click(function () {
    let change = $(this).attr("zoom") == "out" ? -0.25 : 0.25
    if (zoom > 3) change *= 2
    zoom += change
    if (zoom <= 0.25) zoom = 0.25
    else if (zoom > 8) zoom = 8
    $('#atlas').css("transform", zoom != 1 ? `scale(${zoom})` : "")
})

$('.filePage').click(function () {
    if (busy) return
    filePage += Number($(this).attr("change"))
    loadFileView()
})

function scaleToFit(tolerance = 10) {
    $('[scaletofit]').each(function () {
        el = $(this);
        let w = el[0].scrollWidth + tolerance
        let pW = el.parent().width()
        let sc = Math.min(1, pW / w)
        el.css("transform", `scale(${sc})`)
    })
}

function showError(e) {
    $('#uploadSheet').hide()
    $('#uploadPlist').hide()
    $('#main').hide()
    $('#errorScreen').show()
    $('#errorMessage').text(e.message)
}

function resetEverything() {
    if (busy) return
    $('#uploadSheet').hide()
    $('#packSprites').hide()
    $('.packStep').hide()
    $('#main').hide()
    $('#errorScreen').hide()

    $('.yesFileView').hide()
    $('.noFileView').show()

    $('#alsoUpload').show()
    $('#alsoUploaded').hide()
    $('#fileUpload').attr("accept", ".plist,.xml,image/png")

    sheet = null
    imageName = null
    b64 = null

    loader.reset()
    zoom = 1
    $('#atlas').css("transform", "")
    $('input[type=file').val('')

    $('#uploadPlist').show()
};

// for testing lol
(async () => {
    let img = await fetch("./test/GJ_GameSheet03-uhd.png").then(res => res.blob())
    reader.readAsDataURL(img)
    reader.onload = function () {
        imageName = "GJ_GameSheet03-uhd.png"
        b64 = reader.result
    }
    readPlist(await fetch("./test/GJ_GameSheet03-uhd.plist").then(res => res.text()))
})//()