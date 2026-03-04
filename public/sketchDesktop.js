let socket;
let sensor = { beta: 0 };
let pg;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pg = createGraphics(width, height, WEBGL);
  pg.setAttributes({ alpha: true });

  // Connect to the WebSocket server
  socket = io();

  socket.on("sensorData", (data) => {
    sensor = data;
    console.log("received sensor data from mobile:", data);
  });
}

function draw() {
  /*background(20);
  fill(255);
  ellipse(width/2, height/2, map(sensor.beta, -90, 90, 10, 300));
*/


  // trick transparent background with webgl https://editor.p5js.org/micuat/sketches/qOAjrWJf9
  pg.background(0, 20)
  // Use orthogonal projection to avoid perspective distortion (optional)
  pg.ortho(-200, 200, -200, 200, 0.1, 1000);


  pg.camera(400, -400, 400,
    0, 0, 0,     // Look at the origin
    0, 1, 0);    // Y-axis points upwards (keep the camera upright)

  pg.stroke(255);
  pg.noFill();
  pg.push();
  pg.rotateZ(radians(sensor.alpha));
  pg.rotateX(radians(sensor.beta));
  pg.rotateY(radians(sensor.gamma));

  
  pg.box(100, 5, 200);

  pg.pop();

  image(pg, -width / 2, -height / 2);
  drawAxis();

}

function drawAxis() {
  /*
    p5 Axis
    ~~~
    X-axis: Positive X points to the right. red
    Y-axis: Positive Y points downwards (towards the bottom of the screen). green
    Z-axis: Positive Z points towards the viewer (out of the screen). blue
  */
  // X-axis (Red)
  stroke(255, 0, 0);
  line(0, 0, 0, 200, 0, 0);  // X axis points right

  // Y-axis (Green)
  stroke(0, 255, 0);
  line(0, 0, 0, 0, -200, 0);  // Y axis points upwards

  // Z-axis (Blue)
  stroke(0, 0, 255);
  line(0, 0, 0, 0, 0, 200);  // Z axis points towards the viewer
}