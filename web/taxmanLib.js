const vendorCheck = () => {
    const vendors = ['webkit', 'moz'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
}

function startRender() {

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

        step(dt);

        lastTime = currentTime
    }

    simulationLoop()
}

if (typeof mergeInto !== 'undefined') mergeInto(LibraryManager.library, {
    start: function() {
        startRender()
    }
});