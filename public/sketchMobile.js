let socket;
let orientationListenerAttached = false;
let sensorDataReceived = false;
let sensorPlatformSupported = false;
let needsExplicitPermission = false;
let platformModeLabel = "Unknown";
let sensorCheckTimedOut = false;
let sensorCheckStarted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io();
  setupMobile();
}

function draw() {
  background(30);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);

  text(`Mode: ${platformModeLabel}`, width / 2, height / 2 - 40);

  if (!sensorPlatformSupported) {
    text("Sensor streaming is not supported on this device/browser.", width / 2, height / 2);
    return;
  }

  if (needsExplicitPermission && !permissionGranted) {
    text("Please allow sensor access.", width / 2, height / 2);
    return;
  }

  if (!sensorDataReceived) {
    if (sensorCheckTimedOut) {
      text("No live sensor events detected on this browser/device.", width / 2, height / 2);
      return;
    }

    text("Permission granted. Waiting for sensor events...", width / 2, height / 2);
    return;
  }

  text("Sending sensor data...", width / 2, height / 2);

}



// GENERAL PURPOSE FUNCTIONS TO MANAGE MOBILE SENSOR PERMISSIONS


let button;
let permissionGranted = false;

function setupMobile() {
  if (typeof DeviceOrientationEvent === "undefined") {
    sensorPlatformSupported = false;
    permissionGranted = false;
    platformModeLabel = "Unsupported";
    return;
  }

  sensorPlatformSupported = true;

  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    needsExplicitPermission = true;
    platformModeLabel = "iOS (permission required)";
    DeviceOrientationEvent.requestPermission()
      .catch(() => {
        button = createButton("ALLOW ACCESS TO SENSORS!");
        button.style("font-size", "16px");
        button.center();
        button.mousePressed(requestAccess);
      })
      .then((response) => {
        if (response === "granted") {
          permissionGranted = true;
          attachOrientationListener();
        }
      });
  } else {
    needsExplicitPermission = false;
    permissionGranted = true;
    platformModeLabel = "Android/Other (direct)";
    attachOrientationListener();
  }
}

function requestAccess() {
  if (typeof DeviceOrientationEvent.requestPermission !== "function") {
    return;
  }

  DeviceOrientationEvent.requestPermission()
    .then((response) => {
      if (response === "granted") {
        permissionGranted = true;
        attachOrientationListener();
      } else {
        permissionGranted = false;
      }
    })
    .catch(console.error);
  if (button) {
    button.remove();
  }
}

function attachOrientationListener() {
  if (orientationListenerAttached || typeof DeviceOrientationEvent === "undefined") {
    return;
  }

  startSensorAvailabilityCheck();

  window.addEventListener("deviceorientation", (event) => {
    let data = {
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma
    };
    sensorDataReceived = true;
    sensorCheckTimedOut = false;
    console.log("sensor event:", data);
    if (socket) {
      /*
event.alpha  // Rotation um Z-Achse, wenn das Gerät flach liegt und gedreht wird (0 bis 360)
event.beta   // Rotation um X-Achse, kippen des Geräts vorwärts/rückwärts (-180 bis 180)
event.gamma  // Rotation um Y-Achse, seitliches Kippen des Geräts, wie Nein sagen (-90 bis 90)
      */
      socket.emit("sensorData", data);
    }
  });

  orientationListenerAttached = true;
}

function startSensorAvailabilityCheck() {
  if (sensorCheckStarted) {
    return;
  }

  sensorCheckStarted = true;
  sensorCheckTimedOut = false;

  window.setTimeout(() => {
    if (!sensorDataReceived) {
      sensorCheckTimedOut = true;
    }
  }, 2000);
}

/*
function noMobileSensorInput() {
  let v = false;
  if (!permissionGranted) v = true;
  return v;
}*/
