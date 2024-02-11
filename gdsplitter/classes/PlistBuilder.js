// ugly

class PlistBuilder {
    constructor(data, format="cocos") {

	this.frames = data.frames.map(function(x) {
		x.offset = x.offset || [0, 0]
		x.size = x.size || x.sourceSize || [0, 0]
		x.sourceSize = x.sourceSize || x.size || [0, 0]
		x.position = x.position || [0, 0]
		x.range = x.range || [0, 0]
		x.rotated = !!x.rotated
		return x
	});

switch (format) {

case "cocos":

this.extension = ".plist"
return this.result = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0" msg="Spritesheet created with https://gdcolon.com/gdsplitter">
	<dict>
		<key>frames</key>
		<dict>
`

+ this.frames.map(x => `			<key>${x.name}</key>
			<dict>
				<key>aliases</key>
				<array/>
				<key>spriteOffset</key>
				<string>{${x.offset.join(",")}}</string>
				<key>spriteSize</key>
				<string>{${x.size.join(",")}}</string>
				<key>spriteSourceSize</key>
				<string>{${x.sourceSize.join(",")}}</string>
				<key>textureRect</key>
				<string>{{${x.position.join(",")}},{${x.size.join(",")}}}</string>
				<key>textureRotated</key>
				<${x.rotated}/>
			</dict>`).join("\n")
	
+ `
		</dict>
		<key>metadata</key>
		<dict>
			<key>format</key>
			<integer>3</integer>
			<key>pixelFormat</key>
			<string>RGBA4444</string>
			<key>premultiplyAlpha</key>
			<false/>
			<key>realTextureFileName</key>
			<string>${data.name}</string>
			<key>size</key>
			<string>{${data.width},${data.height}}</string>
			<key>textureFileName</key>
			<string>${data.name}</string>
		</dict>
	</dict>
</plist>`

// ====================================== //
// ====================================== //
// ====================================== //

case "cocos_old":

this.extension = ".plist"
return this.result = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0" msg="Spritesheet created with https://gdcolon.com/gdsplitter">
	<dict>
		<key>frames</key>
		<dict>
`

+ this.frames.map(x => `			<key>${x.name}</key>
			<dict>
				<key>frame</key>
				<string>{{${x.position.join(",")}},{${x.size.join(",")}}}</string>
				<key>offset</key>
				<string>{${x.offset.join(",")}}</string>
				<key>rotated</key>
				<${x.rotated}/>
				<key>sourceColorRect</key>
                <string>{{${x.range[0] + x.offset[0]},${x.range[1] - x.offset[1]}},{${x.size.join(",")}}}</string>
				<key>sourceSize</key>
				<string>{${x.sourceSize.join(",")}}</string>
			</dict>`).join("\n")
	
+ `
		</dict>
		<key>metadata</key>
		<dict>
			<key>format</key>
			<integer>2</integer>
			<key>realTextureFileName</key>
			<string>${data.name}</string>
			<key>size</key>
			<string>{${data.width},${data.height}}</string>
			<key>textureFileName</key>
			<string>${data.name}</string>
		</dict>
	</dict>
</plist>`


// ====================================== //
// ====================================== //
// ====================================== //

default:

this.extension = ".json"
let jsonResult = {
	frames: {},
	metadata: {
		app: window.location.href,
		version: "1.0",
		image: data.name,
		format: "RGBA8888",
		size: {"w": data.width, "h": data.height},
		scale: "1",
	}
}

this.frames.forEach(x => {
	jsonResult.frames[x.name] = {
		frame: {x: x.position[0], y: x.position[1], w: x.size[0], h: x.size[1]},
		rotated: x.rotated,
		trimmed: true,
		spriteSourceSize: { x: ((x.sourceSize[0] - x.size[0]) / 2) + x.offset[0], y: ((x.sourceSize[1] - x.size[1]) / 2) - x.offset[1], w: x.size[0], h: x.size[1] },
		sourceSize: {w: x.sourceSize[0], h: x.sourceSize[1]}
	}
})
return this.result = JSON.stringify(jsonResult, null, 2)

}}}