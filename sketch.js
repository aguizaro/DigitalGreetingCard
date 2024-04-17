// watched Daniel Shiffman video tutorial on 2D water ripple
// https://www.youtube.com/watch?v=BZUdGqeOD0w

let cols;
let rows;
let current;
let previous;

let leafX, leafY;

let angle = 0;
let rotationSpeed = 0.01;
let maxRotationAngle = 0.1;

let dampening = 0.995;
let weight = 2000;
let lastRippleTime = 0;
let rippleInterval = 600;

let steelworks;

function preload() {
  steelworks = loadFont("SteelworksVintage.ttf");
}

function setup() {
  createCanvas(600, 400);

  pixelDensity(1);
  createCanvas(600, 400);
  cols = width;
  rows = height;

  current = new Array(cols).fill(0).map((n) => new Array(rows).fill(0));
  previous = new Array(cols).fill(0).map((n) => new Array(rows).fill(0));
}

function ripple(x, y) {
  previous[x][y] = weight;
}

function draw() {
  background(150, 200, 255);

  leafX = (2 * width) / 3;
  leafY = height / 2;

  updateRipple();
  drawLeaf(leafX, leafY, -0.45);

  textFont(steelworks, 100);
  fill(155, 254, 251);
  //text allign

  textSize(120);
  if (frameCount > 100) {
    text("Sorry!", 25, 120);
  }
  if (frameCount > 200) {
    textSize(45);
    text("For eating your ", 30, 210);
  }
  if (frameCount > 300) {
    textSize(45);
    text("Door Dash", 30, 260);
  }
}

function drawLeaf(x, y) {
  let w = 100;
  let h = 150;

  angle += rotationSpeed;
  let rotationAmount = sin(angle) * maxRotationAngle;

  push();
  rotate(rotationAmount);
  fill(0, 140, 0);
  beginShape();
  noStroke();
  arc(x, y, w, h, 0, -PI);
  arc(x, y, w - 25, h + 12, 0, -PI);
  arc(x, y + 5, w, h, 0, 2 * PI);

  //ridges
  for (let i = 0; i < 90; i += 10) {
    triangle(x + 55 - i / 10, y - i, x - 55 + i / 10, y - i, x, y + 95);
    triangle(x + 55 - i / 10, y - i, x - 55 + i / 10, y - i, x, y - 105);
  }

  fill(0, 150, 0);
  arc(x, y, w + 45, h, -0.25, PI + 0.25);
  arc(x, y - 10, w + 35, h, -0.25, PI + 0.25);
  arc(x, y - 20, w + 25, h, -0.25, PI + 0.25);
  arc(x, y - 30, w + 15, h, -0.25, PI + 0.25);
  arc(x, y - 40, w + 5, h, -0.25, PI + 0.25);
  arc(x, y - 50, w - 5, h, -0.25, PI + 0.25);
  arc(x, y - 60, w - 15, h, -0.25, PI + 0.25);
  arc(x, y - 70, w - 25, h, -0.25, PI + 0.25);
  arc(x, y - 80, w - 35, h, -0.25, PI + 0.25);

  //veins
  noFill();
  stroke(0, 125, 0);
  for (let offsetY = -50; offsetY <= 50; offsetY += 20) {
    bezier(
      x - 10,
      y + 10 + offsetY,
      x - 15,
      y + offsetY,
      x - 30,
      y + offsetY,
      x - 45,
      y - 25 + offsetY
    );
    bezier(
      x + 10,
      y + 10 + offsetY,
      x + 15,
      y + offsetY,
      x + 30,
      y + offsetY,
      x + 45,
      y - 25 + offsetY
    );
  }
  fill(0, 89, 15);
  rect(x - 5, y + 80, 10, 55); //stem
  endShape();
  pop();
}

function updateRipple() {
  if (frameCount == 1) {
    ripple(leafX, leafY);
    lastRippleTime = frameCount;
  } else if (frameCount - lastRippleTime >= rippleInterval) {
    ripple(leafX, leafY);
    lastRippleTime = frameCount;
  }
  loadPixels();

  for (let i = 1; i < cols - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
      current[i][j] =
        (previous[i - 1][j] +
          previous[i + 1][j] +
          previous[i][j - 1] +
          previous[i][j + 1]) /
          2 -
        current[i][j];
      current[i][j] = current[i][j] * dampening;

      let index = (i + j * cols) * 4;
      pixels[index + 0] = current[i][j] + 100 - i / 5;
      pixels[index + 1] = current[i][j] + 200 - j / 2;
      pixels[index + 2] = current[i][j] + 255;
    }
  }

  updatePixels();

  let temp = previous;
  previous = current;
  current = temp;
}
