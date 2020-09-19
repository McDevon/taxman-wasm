const vendorCheck = () => {
    const vendors = ['webkit', 'moz'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
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

    const keyDown = (e) => {
        e = e || window.event;

        console.log("key " + e.keyCode)

        if (e.keyCode == '37' || e.keyCode == '65') {
            window.currentKeys.left = 1
        } else if (e.keyCode == '39' || e.keyCode == '68') {
            window.currentKeys.right = 1
        } else if (e.keyCode == '38' || e.keyCode == '87') {
            window.currentKeys.up = 1
        } else if (e.keyCode == '40' || e.keyCode == '83') {
            window.currentKeys.down = 1
        } else if (e.keyCode == '75' || e.keyCode == '90') {
            window.currentKeys.a = 1
        } else if (e.keyCode == '74' || e.keyCode == '88') {
            window.currentKeys.b = 1
        } else if (e.keyCode == '76' || e.keyCode == '67') {
            window.currentKeys.menu = 1
        }
    }
    const keyUp = (e) => {
        e = e || window.event;

        if (e.keyCode == '37' || e.keyCode == '65') {
            window.currentKeys.left = 0
        } else if (e.keyCode == '39' || e.keyCode == '68') {
            window.currentKeys.right = 0
        } else if (e.keyCode == '38' || e.keyCode == '87') {
            window.currentKeys.up = 0
        } else if (e.keyCode == '40' || e.keyCode == '83') {
            window.currentKeys.down = 0
        } else if (e.keyCode == '75' || e.keyCode == '90') {
            window.currentKeys.a = 0
        } else if (e.keyCode == '74' || e.keyCode == '88') {
            window.currentKeys.b = 0
        } else if (e.keyCode == '76' || e.keyCode == '67') {
            window.currentKeys.menu = 0
        }
    }

    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
}

const startRender = () => {

    var canvas = document.getElementById('canvas');

    const ctx = canvas.getContext('2d');

    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;

    vendorCheck()

    step = Module.cwrap('step', null, ['number']);

    let lastTime = (new Date()).getTime(),
        currentTime = 0,
        dt = 0,
        skip = false

    const simulationLoop = () => {
        window.requestAnimationFrame(simulationLoop)

        skip = !skip
        if (skip) {
            return
        }

        currentTime = (new Date()).getTime()
        dt = Math.min((currentTime - lastTime) / 1000, 0.03)

        step(
            dt,
            window.currentKeys.left,
            window.currentKeys.right,
            window.currentKeys.up,
            window.currentKeys.down,
            window.currentKeys.a,
            window.currentKeys.b,
            window.currentKeys.menu
            );

        lastTime = currentTime
    }

    simulationLoop()
}

if (typeof mergeInto !== 'undefined') mergeInto(LibraryManager.library, {
    start: function() {
        registerKeys()
        startRender()
    }
});