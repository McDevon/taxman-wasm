function makeAlert() {
    console.log("Start called!");

    step = Module.cwrap('step', null, ['number']);
    step(0);
}

if (typeof mergeInto !== 'undefined') mergeInto(LibraryManager.library, {
    start: function() {
        makeAlert();
    }
});