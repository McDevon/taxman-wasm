const vendorCheck = () => {
  const vendors = ["webkit", "moz"];
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] ||
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }
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
    touch: false,
    startAngle: 0,
    startCrank: 0,
    center: { x: 0, y: 0 },
  };

  const animateKeyDown = (element) => {
    element.style.backgroundImage = "url(./button_down.png)";
    element.style.lineHeight = "55px";
  };
  const animateKeyUp = (element) => {
    element.style.backgroundImage = "url(./button_up.png)";
    element.style.lineHeight = "45px";
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
  crank.onmousedown = (event) => {
    event.preventDefault();

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
      x: event.clientX - offset.x,
      y: event.clientY - offset.y,
    };

    if (Math.abs(distance.x) >= 0 && Math.abs(distance.y) >= 0) {
      const angle = (Math.atan2(distance.y, distance.x) * 180) / Math.PI;
      window.crankControl.startAngle = angle;
    } else {
      window.crankControl.startAngle = 0;
    }

    window.crankControl.touch = true;
    window.crankControl.startCrank = window.crank;
    window.crankControl.center = offset;
  };
  document.onmousemove = (event) => {
    if (!window.crankControl.touch) {
      return;
    }
    event.preventDefault();
    const distance = {
      x: event.clientX - window.crankControl.center.x,
      y: event.clientY - window.crankControl.center.y,
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
  };
  document.onmouseup = (event) => {
    if (!window.crankControl.touch) {
      return;
    }
    event.preventDefault();
    window.crankControl.touch = false;
  };
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
