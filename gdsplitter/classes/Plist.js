const sub_dom = new DOMParser()

class Plist {
    constructor(data) {
        let plist = sub_dom.parseFromString(data.trim(), "text/xml")
        let plistFrames = plist.children[0].children[0].children
        if (plistFrames[0].nodeName == "parsererror") return console.log(plistFrames[0].innerHTML)
        this.data = parseDict(plistFrames)
    }
}

function parseDict(dict) {
    let data = {}
    for (let i=0; i < dict.length; i += 2) {
        let frameName = dict[i].innerHTML
        let frameData = dict[i + 1]
        if (frameData) {
            let dataType = frameData.nodeName
            if (dataType == "dict") data[frameName] = parseDict(frameData.children)
            else if (dataType == "true" || dataType == "false") data[frameName] = (dataType == "true")
            else data[frameName] = frameData.innerHTML
        }
    }
    return data
}

function parsePlistArray(data) {
    return data.replace(/[^0-9,-.]/g, "").split(",").map(x => +x)
}