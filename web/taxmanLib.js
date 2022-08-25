const vendorCheck = () => {
  const vendors = ["webkit", "moz"];
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] ||
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }
};

const mobileCheck = () => {
  let ismobile = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      ismobile = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return ismobile;
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
  window.previousScreenStatus = {
    orientation: 0, // Portrait = 0, Landscape = 1
    width: 0,
    height: 0,
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
      const touch = event.touches[event.touches.length - 1];
      userX = touch.clientX * window.screenScale;
      userY = touch.clientY * window.screenScale;
      identifier = touch.identifier;
    } else if (event.type == "mousedown") {
      userX = event.clientX * window.screenScale;
      userY = event.clientY * window.screenScale;
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
      const touch = event.touches[event.touches.length - 1];
      userX = touch.clientX * window.screenScale;
      userY = touch.clientY * window.screenScale;
      identifier = touch.identifier;
    } else if (event.type == "mousedown") {
      userX = event.clientX * window.screenScale;
      userY = event.clientY * window.screenScale;
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
      identifier = event.touches[event.touches.length - 1].identifier;
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
      const touch = event.touches[event.touches.length - 1];
      userX = touch.clientX * window.screenScale;
      userY = touch.clientY * window.screenScale;
      identifier = touch.identifier;
    } else if (event.type == "mousedown") {
      userX = event.clientX * window.screenScale;
      userY = event.clientY * window.screenScale;
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
      const count = event.touches.length;
      for (let i = 0; i < count; i++) {
        const touch = event.touches[i];
        handleMove(
          event,
          touch.clientX * window.screenScale,
          touch.clientY * window.screenScale,
          touch.identifier
        );
      }
    } else if (event.type == "mousemove") {
      handleMove(
        event,
        event.clientX * window.screenScale,
        event.clientY * window.screenScale,
        1
      );
    }
  };

  const handleEnd = (endEvent, identifier) => {
    if (window.crankControl.touch == identifier) {
      endEvent.preventDefault();
      window.crankControl.touch = -2;
    } else if (window.buttonControl.dpad == identifier) {
      endEvent.preventDefault();
      setDpadButton(0, window.buttonControl.dpadbutton);
      window.buttonControl.dpad = -2;
    } else if (window.buttonControl.menu == identifier) {
      endEvent.preventDefault();
      window.currentKeys.menu = 0;
      animateKeyUp(document.getElementById("button_menu"));
    } else if (window.buttonControl.actionarea == identifier) {
      endEvent.preventDefault();
      setActionButton(0, window.buttonControl.actionbutton);
      window.buttonControl.actionarea = -2;
    }
  };

  const endEvent = (event) => {
    if (event.type == "touchend" || event.type == "touchcancel") {
      const count = event.changedTouches.length;
      for (let i = 0; i < count; i++) {
        const touch = event.changedTouches[i];
        handleEnd(event, touch.identifier);
      }
    } else if (event.type == "mouseup" || event.type == "mouseleave") {
      handleEnd(event, 1);
      console.log("mouse up");
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
  document.addEventListener("mouseleave", endEvent);

  document.addEventListener("touchstart", (event) => {
    event.preventDefault();
  });
};

const setOrientation = (orientation) => {
  console.log("orientation: " + orientation);
  console.log("Changed to " + (orientation == 1 ? "landscape" : "portrait"));

  const consoleYellow = document.getElementById("console_yellow");
  const consoleControls = document.getElementById("console_controls");
  const menuButton = document.getElementById("button_menu");
  const actionArea = document.getElementById("action_area");
  const crank = document.getElementById("crank");
  if (orientation == 0) {
    // Portrait
    consoleYellow.style.padding = "10px";
    consoleYellow.style.display = "inline-block";
    consoleControls.style.position = "relative";
    consoleControls.style.top = "";
    consoleControls.style.left = "";
    consoleControls.style.marginTop = "20px";
    consoleControls.style.width = "440px";
    menuButton.style.left = "180px";
    menuButton.style.top = "0px";
    actionArea.style.left = "235px";
    crank.style.left = "275px";
  } else {
    // Landscape
    consoleYellow.style.paddingLeft = "210px";
    consoleYellow.style.paddingRight = "210px";
    consoleYellow.style.display = "block";
    consoleControls.style.position = "absolute";
    consoleControls.style.top = "90px";
    consoleControls.style.left = "10px";
    consoleControls.style.marginTop = "0px";
    consoleControls.style.width = "872px";
    menuButton.style.left = "150px";
    menuButton.style.top = "-30px";
    actionArea.style.left = "676px";
    crank.style.left = "689px";
  }
};

const checkOrientation = () => {
  console.log("resize " + window.innerWidth + ", " + window.innerHeight);
  const currentWidth = window.innerWidth;
  const currentHeight = window.innerHeight;

  if (
    window.previousScreenStatus.width == currentWidth ||
    window.previousScreenStatus.height == currentHeight
  ) {
    return window.previousScreenStatus.orientation;
  }

  const currentOrientation = currentWidth > currentHeight ? 1 : 0;

  if (currentOrientation == window.previousScreenStatus.orientation) {
    return window.previousScreenStatus.orientation;
  }

  window.previousScreenStatus = {
    orientation: currentOrientation,
    width: currentWidth,
    height: currentHeight,
  };

  console.log("width: " + currentWidth + " height: " + currentHeight);
  setOrientation(currentOrientation);

  return currentOrientation;
};

const rezoomScreen = () => {
  if (!mobileCheck()) {
    window.screenScale = 1;
    return;
  }
  document.getElementById("controls").style.display = "none";
  document.body.style.overflow = "hidden";

  const consoleWidth = document.getElementById("console_yellow").offsetWidth;
  const scale = screen.width / consoleWidth;

  document.body.style.zoom = scale;

  document
    .querySelector("meta[name=viewport]")
    .setAttribute(
      "content",
      "initial-scale=1, maximum-scale=1, user-scalable=0"
    );
  window.screenScale = 1 / scale;

  checkOrientation();
  window.addEventListener("resize", checkOrientation);
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
      rezoomScreen();
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
