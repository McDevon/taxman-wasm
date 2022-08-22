const vendorCheck = () => {
  const vendors = ["webkit", "moz"];
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] ||
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }
};

const animateKeyDown = (element) => {
  element.style.backgroundImage = "url(./button_down.png)";
  element.style.lineHeight = "55px";
};
const animateKeyUp = (element) => {
  element.style.backgroundImage = "url(./button_up.png)";
  element.style.lineHeight = "45px";
};

const registerKeys = () => {
  window.currentKeys = {};
  window.currentKeys.left = 0;
  window.currentKeys.right = 0;
  window.currentKeys.up = 0;
  window.currentKeys.down = 0;
  window.currentKeys.a = 0;
  window.currentKeys.b = 0;
  window.currentKeys.menu = 0;
  window.currentKeys.rotate_cw = 0;
  window.currentKeys.rotate_ccw = 0;
  window.currentKeys.increase_rot_speed = 0;
  window.currentKeys.decrease_rot_speed = 0;
  window.currentKeys.rot_speed = 100;
  window.currentKeys.rot_speed_change_speed = 200;
  window.crank = 0;

  window.crankControl = {
    touch: -2,
    startAngle: 0,
    startCrank: 0,
    center: { x: 0, y: 0 },
  };
  window.buttonControl = {
    dpad: -2,
    dpadbutton: 0, // Left = 1, right = 2, up = 3, down = 4
    dpadcenter: { x: 0, y: 0 },
    actionarea: -2,
    actionbutton: 0, // A = 1, B = 2
    actioncenterx: 0,
    menu: -2,
  };

  const keyDown = (e) => {
    e = e || window.event;

    if (e.keyCode == "37") {
      window.currentKeys.left = 1;
      animateKeyDown(document.getElementById("button_left"));
    } else if (e.keyCode == "39") {
      window.currentKeys.right = 1;
      animateKeyDown(document.getElementById("button_right"));
    } else if (e.keyCode == "38") {
      window.currentKeys.up = 1;
      animateKeyDown(document.getElementById("button_up"));
    } else if (e.keyCode == "40") {
      window.currentKeys.down = 1;
      animateKeyDown(document.getElementById("button_down"));
    } else if (e.keyCode == "88") {
      window.currentKeys.a = 1;
      animateKeyDown(document.getElementById("button_a"));
    } else if (e.keyCode == "90") {
      window.currentKeys.b = 1;
      animateKeyDown(document.getElementById("button_b"));
    } else if (e.keyCode == "69") {
      window.currentKeys.menu = 1;
      animateKeyDown(document.getElementById("button_menu"));
    } else if (e.keyCode == "65") {
      window.currentKeys.rotate_ccw = 1;
    } else if (e.keyCode == "68") {
      window.currentKeys.rotate_cw = 1;
    } else if (e.keyCode == "87") {
      window.currentKeys.increase_rot_speed = 1;
    } else if (e.keyCode == "83") {
      window.currentKeys.decrease_rot_speed = 1;
    }
  };
  const keyUp = (e) => {
    e = e || window.event;

    if (e.keyCode == "37") {
      window.currentKeys.left = 0;
      animateKeyUp(document.getElementById("button_left"));
    } else if (e.keyCode == "39") {
      window.currentKeys.right = 0;
      animateKeyUp(document.getElementById("button_right"));
    } else if (e.keyCode == "38") {
      window.currentKeys.up = 0;
      animateKeyUp(document.getElementById("button_up"));
    } else if (e.keyCode == "40") {
      window.currentKeys.down = 0;
      animateKeyUp(document.getElementById("button_down"));
    } else if (e.keyCode == "88") {
      window.currentKeys.a = 0;
      animateKeyUp(document.getElementById("button_a"));
    } else if (e.keyCode == "90") {
      window.currentKeys.b = 0;
      animateKeyUp(document.getElementById("button_b"));
    } else if (e.keyCode == "69") {
      window.currentKeys.menu = 0;
      animateKeyUp(document.getElementById("button_menu"));
    } else if (e.keyCode == "65") {
      window.currentKeys.rotate_ccw = 0;
    } else if (e.keyCode == "68") {
      window.currentKeys.rotate_cw = 0;
    } else if (e.keyCode == "87") {
      window.currentKeys.increase_rot_speed = 0;
    } else if (e.keyCode == "83") {
      window.currentKeys.decrease_rot_speed = 0;
    }
  };

  document.onkeydown = keyDown;
  document.onkeyup = keyUp;
};

const updateCrank = (crank) => {
  if (crank > 360.0) {
    crank -= 360.0;
  }
  if (crank < 0) {
    crank += 360.0;
  }
  document.getElementById("crank_arm_container").style.transform =
    "rotate(" + crank + "deg)";
  document.getElementById("crank_label_value").textContent =
    Number(crank).toFixed(1) + "°";
  return crank;
};

const normalisedAngle = (angle) => {
  if (angle > 360.0) {
    angle -= 360.0;
  }
  if (angle < 0) {
    angle += 360.0;
  }
  return angle;
};

const registerMouse = () => {
  const crank = document.getElementById("crank");
  const dpad = document.getElementById("dpad");
  const menubutton = document.getElementById("button_menu");
  const actionarea = document.getElementById("action_area");

  const setDpadButton = (buttonDown, buttonUp) => {
    if (buttonDown == 1) {
      animateKeyDown(document.getElementById("button_left"));
      window.currentKeys.left = 1;
    } else if (buttonDown == 2) {
      animateKeyDown(document.getElementById("button_right"));
      window.currentKeys.right = 1;
    } else if (buttonDown == 3) {
      animateKeyDown(document.getElementById("button_up"));
      window.currentKeys.up = 1;
    } else if (buttonDown == 4) {
      animateKeyDown(document.getElementById("button_down"));
      window.currentKeys.down = 1;
    }

    if (buttonUp == 1) {
      animateKeyUp(document.getElementById("button_left"));
      window.currentKeys.left = 0;
    } else if (buttonUp == 2) {
      animateKeyUp(document.getElementById("button_right"));
      window.currentKeys.right = 0;
    } else if (buttonUp == 3) {
      animateKeyUp(document.getElementById("button_up"));
      window.currentKeys.up = 0;
    } else if (buttonUp == 4) {
      animateKeyUp(document.getElementById("button_down"));
      window.currentKeys.down = 0;
    }
  };

  const setActionButton = (buttonDown, buttonUp) => {
    if (buttonDown == 1) {
      animateKeyDown(document.getElementById("button_a"));
      window.currentKeys.a = 1;
    } else if (buttonDown == 2) {
      animateKeyDown(document.getElementById("button_b"));
      window.currentKeys.b = 1;
    }

    if (buttonUp == 1) {
      animateKeyUp(document.getElementById("button_a"));
      window.currentKeys.a = 0;
    } else if (buttonUp == 2) {
      animateKeyUp(document.getElementById("button_b"));
      window.currentKeys.b = 0;
    }
  };

  const crankStartEvent = (event) => {
    event.preventDefault();
    let userX = 0,
      userY = 0,
      identifier = -1;
    if (event.type == "touchstart") {
      const touch = event.touches[0];
      userX = touch.clientX;
      userY = touch.clientY;
      identifier = touch.identifier;
    } else if (event.type == "mousedown") {
      userX = event.clientX;
      userY = event.clientY;
      identifier = 1;
    }

    const crank = document.getElementById("crank");
    let e = crank;
    let offset = { x: 0, y: 0 };
    while (e) {
      offset.x += e.offsetLeft;
      offset.y += e.offsetTop;
      e = e.offsetParent;
    }
    offset.x += crank.clientWidth / 2.0;
    offset.y += crank.clientHeight / 2.0;

    if (
      document.documentElement &&
      (document.documentElement.scrollTop ||
        document.documentElement.scrollLeft)
    ) {
      offset.x -= document.documentElement.scrollLeft;
      offset.y -= document.documentElement.scrollTop;
    } else if (
      document.body &&
      (document.body.scrollTop || document.body.scrollLeft)
    ) {
      offset.x -= document.body.scrollLeft;
      offset.y -= document.body.scrollTop;
    } else if (window.pageXOffset || window.pageYOffset) {
      offset.x -= window.pageXOffset;
      offset.y -= window.pageYOffset;
    }

    const distance = {
      x: userX - offset.x,
      y: userY - offset.y,
    };

    if (Math.abs(distance.x) >= 0 && Math.abs(distance.y) >= 0) {
      const angle = (Math.atan2(distance.y, distance.x) * 180) / Math.PI;
      window.crankControl.startAngle = angle;
    } else {
      window.crankControl.startAngle = 0;
    }

    window.crankControl.touch = identifier;
    window.crankControl.startCrank = window.crank;
    window.crankControl.center = offset;
  };
  const dpadStartEvent = (event) => {
    event.preventDefault();
    let userX = 0,
      userY = 0,
      identifier = -1;
    if (event.type == "touchstart") {
      const touch = event.touches[0];
      userX = touch.clientX;
      userY = touch.clientY;
      identifier = touch.identifier;
    } else if (event.type == "mousedown") {
      userX = event.clientX;
      userY = event.clientY;
      identifier = 1;
    }

    const dpad = document.getElementById("dpad");
    let e = dpad;
    let offset = { x: 0, y: 0 };
    while (e) {
      offset.x += e.offsetLeft;
      offset.y += e.offsetTop;
      e = e.offsetParent;
    }

    offset.x += dpad.clientWidth / 2.0;
    offset.y += dpad.clientHeight / 2.0;

    if (
      document.documentElement &&
      (document.documentElement.scrollTop ||
        document.documentElement.scrollLeft)
    ) {
      offset.x -= document.documentElement.scrollLeft;
      offset.y -= document.documentElement.scrollTop;
    } else if (
      document.body &&
      (document.body.scrollTop || document.body.scrollLeft)
    ) {
      offset.x -= document.body.scrollLeft;
      offset.y -= document.body.scrollTop;
    } else if (window.pageXOffset || window.pageYOffset) {
      offset.x -= window.pageXOffset;
      offset.y -= window.pageYOffset;
    }

    const position = {
      x: userX - offset.x,
      y: userY - offset.y,
    };

    if (position.x > position.y) {
      if (position.x > -position.y) {
        window.buttonControl.dpadbutton = 2;
      } else {
        window.buttonControl.dpadbutton = 3;
      }
    } else {
      if (position.x > -position.y) {
        window.buttonControl.dpadbutton = 4;
      } else {
        window.buttonControl.dpadbutton = 1;
      }
    }
    setDpadButton(window.buttonControl.dpadbutton, 0);
    window.buttonControl.dpad = identifier;
    window.buttonControl.dpadcenter = offset;
  };
  const menuStartEvent = (event) => {
    event.preventDefault();
    let identifier = -1;
    if (event.type == "touchstart") {
      identifier = event.touches[0].identifier;
    } else if (event.type == "mousedown") {
      identifier = 1;
    }
    window.currentKeys.menu = 1;
    animateKeyDown(document.getElementById("button_menu"));
    window.buttonControl.menu = identifier;
  };
  const actionStartEvent = (event) => {
    event.preventDefault();
    let userX = 0,
      userY = 0,
      identifier = -1;
    if (event.type == "touchstart") {
      const touch = event.touches[0];
      userX = touch.clientX;
      userY = touch.clientY;
      identifier = touch.identifier;
    } else if (event.type == "mousedown") {
      userX = event.clientX;
      userY = event.clientY;
      identifier = 1;
    }

    const actionarea = document.getElementById("action_area");
    let e = actionarea;
    let offset = { x: 0, y: 0 };
    while (e) {
      offset.x += e.offsetLeft;
      offset.y += e.offsetTop;
      e = e.offsetParent;
    }

    offset.x += actionarea.clientWidth / 2.0;
    offset.y += actionarea.clientHeight / 2.0;

    if (
      document.documentElement &&
      (document.documentElement.scrollTop ||
        document.documentElement.scrollLeft)
    ) {
      offset.x -= document.documentElement.scrollLeft;
      offset.y -= document.documentElement.scrollTop;
    } else if (
      document.body &&
      (document.body.scrollTop || document.body.scrollLeft)
    ) {
      offset.x -= document.body.scrollLeft;
      offset.y -= document.body.scrollTop;
    } else if (window.pageXOffset || window.pageYOffset) {
      offset.x -= window.pageXOffset;
      offset.y -= window.pageYOffset;
    }

    const position = {
      x: userX - offset.x,
      y: userY - offset.y,
    };

    if (position.x < 0) {
      window.buttonControl.actionbutton = 2;
    } else {
      window.buttonControl.actionbutton = 1;
    }

    setActionButton(window.buttonControl.actionbutton, 0);
    window.buttonControl.actionarea = identifier;
    window.buttonControl.actioncenterx = offset.x;
  };

  const handleMove = (moveEvent, userX, userY, identifier) => {
    if (window.crankControl.touch == identifier) {
      moveEvent.preventDefault();
      const distance = {
        x: userX - window.crankControl.center.x,
        y: userY - window.crankControl.center.y,
      };
      if (Math.abs(distance.x) > 1 && Math.abs(distance.y) > 1) {
        let currentAngle = (Math.atan2(distance.y, distance.x) * 180) / Math.PI;
        if (currentAngle - window.crankControl.startAngle > 180) {
          currentAngle -= 360;
        }
        if (currentAngle - window.crankControl.startAngle < -180) {
          currentAngle += 360;
        }
        const change = currentAngle - window.crankControl.startAngle;
        window.crank = updateCrank(change + window.crankControl.startCrank);
      }
    } else if (window.buttonControl.dpad == identifier) {
      moveEvent.preventDefault();

      const position = {
        x: userX - window.buttonControl.dpadcenter.x,
        y: userY - window.buttonControl.dpadcenter.y,
      };

      const previousButton = window.buttonControl.dpadbutton;
      if (position.x > position.y) {
        if (position.x > -position.y) {
          window.buttonControl.dpadbutton = 2;
        } else {
          window.buttonControl.dpadbutton = 3;
        }
      } else {
        if (position.x > -position.y) {
          window.buttonControl.dpadbutton = 4;
        } else {
          window.buttonControl.dpadbutton = 1;
        }
      }
      if (window.buttonControl.dpadbutton != previousButton) {
        setDpadButton(window.buttonControl.dpadbutton, previousButton);
      }
    } else if (window.buttonControl.actionarea == identifier) {
      moveEvent.preventDefault();

      const positionX = userX - window.buttonControl.actioncenterx;

      const previousButton = window.buttonControl.actionbutton;
      if (positionX < 0) {
        window.buttonControl.actionbutton = 2;
      } else {
        window.buttonControl.actionbutton = 1;
      }

      if (window.buttonControl.actionbutton != previousButton) {
        setActionButton(window.buttonControl.actionbutton, previousButton);
      }
    }
  };
  const moveEvent = (event) => {
    if (event.type == "touchmove") {
      event.touches.array.forEach((touch) => {
        handleMove(event, touch.clientX, touch.clientY, touch.identifier);
      });
    } else if (event.type == "mousemove") {
      handleMove(event, event.clientX, event.clientY, 1);
    }
  };

  const handleEnd = (endEvent, identifier) => {
    if (window.crankControl.touch == identifier) {
      event.preventDefault();
      window.crankControl.touch = -2;
    } else if (window.buttonControl.dpad == identifier) {
      event.preventDefault();
      setDpadButton(0, window.buttonControl.dpadbutton);
      window.buttonControl.dpad = -2;
    } else if (window.buttonControl.menu == identifier) {
      event.preventDefault();
      window.currentKeys.menu = 0;
      animateKeyUp(document.getElementById("button_menu"));
    } else if (window.buttonControl.actionarea == identifier) {
      event.preventDefault();
      setActionButton(0, window.buttonControl.actionbutton);
      window.buttonControl.actionarea = -2;
    }
  };

  const endEvent = (event) => {
    if (event.type == "touchend" || event.type == "touchcancel") {
      event.touches.array.forEach((touch) => {
        handleEnd(event, touch.identifier);
      });
    } else if (event.type == "mouseup") {
      handleEnd(event, 1);
    }
  };

  crank.addEventListener("touchstart", crankStartEvent);
  crank.addEventListener("mousedown", crankStartEvent);

  dpad.addEventListener("touchstart", dpadStartEvent);
  dpad.addEventListener("mousedown", dpadStartEvent);

  menubutton.addEventListener("touchstart", menuStartEvent);
  menubutton.addEventListener("mousedown", menuStartEvent);

  actionarea.addEventListener("touchstart", actionStartEvent);
  actionarea.addEventListener("mousedown", actionStartEvent);

  document.addEventListener("touchmove", moveEvent);
  document.addEventListener("mousemove", moveEvent);

  document.addEventListener("touchend", endEvent);
  document.addEventListener("touchcancel", endEvent);
  document.addEventListener("mouseup", endEvent);
};

const startRender = () => {
  document.getElementById("output").style.display = "none";

  let canvas = document.getElementById("canvas");

  const ctx = canvas.getContext("2d");

  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;

  vendorCheck();

  step = Module.cwrap("step", null, [
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
    "number",
  ]);
  let lastTime = new Date().getTime(),
    currentTime = 0,
    dt = 0,
    skip = false;

  const updateCrankSpeed = (crankSpeed) => {
    if (crankSpeed > 800.0) {
      crankSpeed = 800.0;
    }
    if (crankSpeed < 0.0) {
      crankSpeed = 0.0;
    }
    document.getElementById("crank_speed_label_value").textContent =
      Number(crankSpeed).toFixed(0) + "°/s";
    return crankSpeed;
  };

  const simulationLoop = () => {
    window.requestAnimationFrame(simulationLoop);

    skip = !skip;
    if (skip) {
      return;
    }

    currentTime = new Date().getTime();
    dt = Math.min((currentTime - lastTime) / 1000, 0.1);

    if (window.currentKeys.rotate_cw) {
      window.crank += dt * window.currentKeys.rot_speed;
      window.crank = updateCrank(window.crank);
    }
    if (window.currentKeys.rotate_ccw) {
      window.crank -= dt * window.currentKeys.rot_speed;
      window.crank = updateCrank(window.crank);
    }
    if (window.currentKeys.increase_rot_speed) {
      window.currentKeys.rot_speed +=
        dt * window.currentKeys.rot_speed_change_speed;
      window.currentKeys.rot_speed = updateCrankSpeed(
        window.currentKeys.rot_speed
      );
    }
    if (window.currentKeys.decrease_rot_speed) {
      window.currentKeys.rot_speed -=
        dt * window.currentKeys.rot_speed_change_speed;
      window.currentKeys.rot_speed = updateCrankSpeed(
        window.currentKeys.rot_speed
      );
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
      window.crank
    );

    lastTime = currentTime;
  };

  simulationLoop();
};

const getTextFile = async (utf8FileName, callback, context) => {
  let fileName = UTF8ToString(utf8FileName);
  let response = await fetch("./" + fileName);

  if (response.status != 200) {
    throw new Error("Server Error");
  }
  let textData = await response.text();

  let fileNameLen = lengthBytesUTF8(fileName) + 1;
  let fileNamePtr = _malloc(fileNameLen);
  stringToUTF8Array(fileName, HEAP8, fileNamePtr, fileNameLen);
  let textDataLen = lengthBytesUTF8(textData) + 1;
  let textDataPtr = _malloc(textDataLen);
  stringToUTF8Array(textData, HEAP8, textDataPtr, textDataLen);

  Module.ccall(
    "read_text_callback",
    null,
    ["number", "number", "number", "number"],
    [fileNamePtr, textDataPtr, callback, context]
  );

  _free(fileNamePtr);
  _free(textDataPtr);
};

const returnImage = (image, canvas, fileName, callback, context) => {
  let size = image.width * image.height;
  let pixelData = canvas
    .getContext("2d")
    .getImageData(0, 0, image.width, image.height).data;

  let alpha = false;
  for (let i = 3, n = pixelData.length; i < n; i += 4) {
    if (pixelData[i] < 255) {
      alpha = true;
      break;
    }
  }

  arraySize = alpha ? size * 2 : size;

  let dataPtr = _malloc(arraySize);
  let array = new Uint8Array(HEAPU8.buffer, dataPtr, arraySize);

  if (alpha) {
    for (let i = 0; i < size; i++) {
      array[i * 2] = pixelData[i * 4];
      array[i * 2 + 1] = pixelData[i * 4 + 3];
    }
  } else {
    for (let i = 0; i < size; i++) {
      array[i] = pixelData[i * 4];
    }
  }

  let fileNameLen = lengthBytesUTF8(fileName) + 1;
  let fileNamePtr = _malloc(fileNameLen);
  stringToUTF8Array(fileName, HEAP8, fileNamePtr, fileNameLen);

  Module.ccall(
    "read_image_callback",
    null,
    ["number", "number", "number", "number", "number", "number", "number"],
    [fileNamePtr, image.width, image.height, alpha, dataPtr, callback, context]
  );

  _free(fileNamePtr);
  _free(dataPtr);
};

const getImageFile = async (utf8FileName, callback, context) => {
  let fileName = UTF8ToString(utf8FileName);
  let response = await fetch("./" + fileName.replace(/\.[^/.]+$/, "") + ".png");

  if (response.status != 200) {
    throw new Error("Server Error");
  }
  let blob = await response.blob();
  let canvas = document.createElement("canvas");

  let ctx = canvas.getContext("2d");
  let img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    returnImage(img, canvas, fileName, callback, context);
  };

  img.src = URL.createObjectURL(blob);
};

if (typeof mergeInto !== "undefined")
  mergeInto(LibraryManager.library, {
    start: function () {
      registerKeys();
      registerMouse();
      startRender();
    },
    get_current_time: function () {
      return Date.now();
    },
    get_text_file: function (fileName, callback, context) {
      getTextFile(fileName, callback, context);
    },
    get_image_file: function (fileName, callback, context) {
      getImageFile(fileName, callback, context);
    },
    log_in_js: function (text) {
      console.log(UTF8ToString(text));
    },
  });
