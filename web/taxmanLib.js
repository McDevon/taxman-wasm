const vendorCheck = () => {
    const vendors = ['webkit', 'moz']
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
    }
}

const registerKeys = () => {

    window.currentKeys = {}
    window.currentKeys.left = 0
    window.currentKeys.right = 0
    window.currentKeys.up = 0
    window.currentKeys.down = 0
    window.currentKeys.a = 0
    window.currentKeys.b = 0
    window.currentKeys.menu = 0
    window.currentKeys.rotate_cw = 0
    window.currentKeys.rotate_ccw = 0
    window.currentKeys.increase_rot_speed = 0
    window.currentKeys.decrease_rot_speed = 0
    window.currentKeys.rot_speed = 150

    const animateKeyDown = (element) => {
        element.style.backgroundImage = "url(/button_down.png)";
        element.style.lineHeight = '55px';
    }
    const animateKeyUp = (element) => {
        element.style.backgroundImage = "url(/button_up.png)";
        element.style.lineHeight = '45px';
    }

    const keyDown = (e) => {
        e = e || window.event

        if (e.keyCode == '37') {
            window.currentKeys.left = 1
            animateKeyDown(document.getElementById("button_left"))
        } else if (e.keyCode == '39') {
            window.currentKeys.right = 1
            animateKeyDown(document.getElementById("button_right"))
        } else if (e.keyCode == '38') {
            window.currentKeys.up = 1
            animateKeyDown(document.getElementById("button_up"))
        } else if (e.keyCode == '40') {
            window.currentKeys.down = 1
            animateKeyDown(document.getElementById("button_down"))
        } else if (e.keyCode == '83') {
            window.currentKeys.a = 1
            animateKeyDown(document.getElementById("button_a"))
        } else if (e.keyCode == '65') {
            window.currentKeys.b = 1
            animateKeyDown(document.getElementById("button_b"))
        } else if (e.keyCode == '76') {
            window.currentKeys.menu = 1
        } else if (e.keyCode == '81') {
            window.currentKeys.rotate_ccw = 1
        } else if (e.keyCode == '87') {
            window.currentKeys.rotate_cw = 1
        }
    }
    const keyUp = (e) => {
        e = e || window.event

        if (e.keyCode == '37') {
            window.currentKeys.left = 0
            animateKeyUp(document.getElementById("button_left"))
        } else if (e.keyCode == '39') {
            window.currentKeys.right = 0
            animateKeyUp(document.getElementById("button_right"))
        } else if (e.keyCode == '38') {
            window.currentKeys.up = 0
            animateKeyUp(document.getElementById("button_up"))
        } else if (e.keyCode == '40') {
            window.currentKeys.down = 0
            animateKeyUp(document.getElementById("button_down"))
        } else if (e.keyCode == '83') {
            window.currentKeys.a = 0
            animateKeyUp(document.getElementById("button_a"))
        } else if (e.keyCode == '65') {
            window.currentKeys.b = 0
            animateKeyUp(document.getElementById("button_b"))
        } else if (e.keyCode == '76') {
            window.currentKeys.menu = 0
        } else if (e.keyCode == '81') {
            window.currentKeys.rotate_ccw = 0
        } else if (e.keyCode == '87') {
            window.currentKeys.rotate_cw = 0
        }
    }

    document.onkeydown = keyDown
    document.onkeyup = keyUp
}

const startRender = () => {

    document.getElementById("output").style.display = "none"

    let canvas = document.getElementById('canvas')

    const ctx = canvas.getContext('2d')

    ctx.mozImageSmoothingEnabled = false
    ctx.webkitImageSmoothingEnabled = false

    vendorCheck()

    step = Module.cwrap('step', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'])
    let lastTime = (new Date()).getTime(),
        currentTime = 0,
        dt = 0,
        skip = false,
        crank = 0.0
    
    const updateCrank = (crank) => {
        if (crank > 360.0) { crank -= 360.0 }
        if (crank < 0) { crank += 360.0 }
        document.getElementById("crank_arm_container").style.transform = 'rotate(' + crank + 'deg)'
        document.getElementById("crank_label_value").textContent = Number(crank).toFixed(1) + '°'
        return crank
    }

    const simulationLoop = () => {
        window.requestAnimationFrame(simulationLoop)

        skip = !skip
        if (skip) {
            return
        }

        currentTime = (new Date()).getTime()
        dt = Math.min((currentTime - lastTime) / 1000, 0.03)

        if (window.currentKeys.rotate_cw) {
            crank += dt * window.currentKeys.rot_speed
            crank = updateCrank(crank)
        }
        if (window.currentKeys.rotate_ccw) {
            crank -= dt * window.currentKeys.rot_speed
            crank = updateCrank(crank)
        }

        step(
            dt,
            window.currentKeys.left,
            window.currentKeys.right,
            window.currentKeys.up,
            window.currentKeys.down,
            window.currentKeys.a,
            window.currentKeys.b,
            window.currentKeys.menu,
            crank
        )

        lastTime = currentTime
    }

    simulationLoop()
}

async function getTextFile(utf8FileName, callback, context) {
    let fileName = UTF8ToString(utf8FileName)
	let response = await fetch('/' + fileName)

	if(response.status != 200) {
		throw new Error("Server Error")
	}
	let textData = await response.text()

    let fileNameLen = lengthBytesUTF8(fileName) + 1;
    let fileNamePtr = _malloc(fileNameLen);
    stringToUTF8Array(fileName, HEAP8, fileNamePtr, fileNameLen);
    let textDataLen = lengthBytesUTF8(textData) + 1;
    let textDataPtr = _malloc(textDataLen);
    stringToUTF8Array(textData, HEAP8, textDataPtr, textDataLen);

    console.log('file: ' + fileName)
    Module.ccall('read_text_callback',
        null,
        ['number', 'number', 'number', 'number'],
        [
            fileNamePtr,
            textDataPtr,
            callback,
            context
        ]
    )

    _free(fileNamePtr)
    _free(textDataPtr)
}

function freeText(text) {
    _free(text)
}

if (typeof mergeInto !== 'undefined') mergeInto(LibraryManager.library, {
    start: function() {
        registerKeys()
        startRender()
    },
    get_current_time: function() {
        return Date.now()
    },
    get_text_file: function(fileName, callback, context) {
        getTextFile(fileName, callback, context)
    },
    log_in_js: function(text) {
        console.log(UTF8ToString(text))
    }
});