// ----MODE 1 VARIABLES----
let currentMode = null;
let mode1Started = false;
let findersFirst = true;

let tt_canvasWidth = 800;
let tt_canvasHeight = 600;

let tt_gridSpacing = 35;
let tt_gridDotRadiusBase = 40;
let tt_gridDotRadiusVariation = 8;

let tt_circleRadius = 18;
let tt_wordToSpawn = "PINGPONG";

let tt_bounceSpeed = 0.007;
let tt_bounceAmplitude = 6.5;

let tt_shadowYOffset = 26;
let tt_shadowHeight = 5;
let tt_shadowAlpha = 40;
let tt_shadowWidthMin = tt_circleRadius * 0.75;
let tt_shadowWidthMax = tt_circleRadius * 1;

let tt_revealDuration = 1000;
let tt_explosionMinPetals = 6;
let tt_explosionMaxPetals = 9;
let tt_explosionSpeedMin = 14;
let tt_explosionSpeedMax = 20;
let tt_explosionCollisionRadius;

let tt_hoverCooldown = 300;

let tt_gridDotColor = [255, 214, 13];
let tt_hiddenDotColor = [0, 0, 0, 0];
let tt_circleFillColor = [255];
let tt_textColor = [0];

let tt_bgImagePath = "bg.png";

let tt_circles = [];
let tt_petals = [];
let tt_grid = [];
let tt_explodedCount = 0;
let tt_spawnAfter = 0;
let tt_startTime;
let tt_bgImage;
let tt_lastInteractionTime = 0;
let tt_autoTriggerDelay = 8000;

let tt_spacing = 100;
let tt_squareSize = 10;
let tt_probability = 0.25;

let tt_centerRectW = 150;
let tt_centerRectH = 100;

let tt_squarePositions = []; // store final positions to draw

// ----MODE 2 VARIABLES----
let pintu;
let cols, rows; // New grid dimensions based on canvas size
let numCircles = 8;
let circleRadius;
let circles = [];
let cellSize;
let directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
let easingDuration = 500;
let maxPintu = 500;
let mode2Started = false;
let duplicate = false;

// ----MODE 3 VARIABLES----
let mode3Started = false;
let followers = [];
let dragging = false;
let lastMouse = {x:0, y:0};
let eyeRadius = 15;
let phoneEye = false;

let leftPupilAngle = 90;
let rightPupilAngle = 90;
let leftPupilTarget = 90;
let rightPupilTarget = 90;

let rX;
let rY;
let targetX, targetY;

// ----MODE 4 VARIABLES----
let particles = [];
let initialCount = 8;
let maxParticles = 200;
let particleRadius = 12;
let customColors = ['#FF414A', '#FFAA02', '#FADB06', '#43BA68', '#3DBEFF', '#8F77FB', '#BD40DE', '#FF54BDFF'];

let img;
let mode4Started = false;


function preload() {
  pintu = loadImage("favicon.png"); // pintu for Mode 2
  img = loadImage('beach-ball.png'); // beach-ball for Mode 4
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.touchStarted(touchStarted); // explicitly bind

  
  
  document.getElementById('default').addEventListener('click', () => setMode('function1'));
  document.getElementById('secondd').addEventListener('click', () => setMode('function2'));
  document.getElementById('third').addEventListener('click', () => setMode('function3'));
  document.getElementById('fourth').addEventListener('click', () => setMode('function4'));
}

function draw() {
  
  if(!currentMode) { // makes Function 1 the default state
    enterFunction1();
    currentMode = loopFunction1;
    currentMode();
  }
  if (currentMode) { // initiates loop of whichever mode is selected.
    currentMode();
  }
}

function setMode(modeName) {
  if (modeName === 'function1') { // to show mode's selected state
    enterFunction1();
    document.getElementById('default').style.backgroundColor = '#343232';
    document.getElementById('secondd').style.backgroundColor = 'transparent';
    document.getElementById('third').style.backgroundColor = 'transparent';
    document.getElementById('fourth').style.backgroundColor = 'transparent';
    currentMode = loopFunction1;
  } else if (modeName === 'function2') {
    enterFunction2();
    document.getElementById('default').style.backgroundColor = 'transparent';
    document.getElementById('secondd').style.backgroundColor = '#343232';
    document.getElementById('third').style.backgroundColor = 'transparent';
    document.getElementById('fourth').style.backgroundColor = 'transparent';
    currentMode = loopFunction2;
  } else if (modeName === 'function3') {
    enterFunction3();
    document.getElementById('default').style.backgroundColor = 'transparent';
    document.getElementById('secondd').style.backgroundColor = 'transparent';
    document.getElementById('third').style.backgroundColor = '#343232';
    document.getElementById('fourth').style.backgroundColor = 'transparent';
    currentMode = loopFunction3;
  } else if (modeName === 'function4') {
    enterFunction4();
    document.getElementById('default').style.backgroundColor = 'transparent';
    document.getElementById('secondd').style.backgroundColor = 'transparent';
    document.getElementById('third').style.backgroundColor = 'transparent';
    document.getElementById('fourth').style.backgroundColor = '#343232';
    currentMode = loopFunction4;
  }
}

// ----SETUP AND DRAW FUNCTIONS----
function enterFunction1() { // setup function for mode 1
  
  // manage flags
  mode1Started = true;
  mode2Started = false;
  mode3Started = false;
  mode4Started = false;

  angleMode(RADIANS);

  tt_circles = [];
  tt_grid = [];

  document.getElementById('default').style.backgroundColor = '#343232';
  document.getElementById('secondd').style.backgroundColor = 'transparent';
  document.getElementById('third').style.backgroundColor = 'transparent';
  document.getElementById('fourth').style.backgroundColor = 'transparent';
  
  noStroke();
  tt_startTime = millis();
  tt_lastInteractionTime = millis();

  for (let y = tt_gridSpacing / 2; y < height + 30; y += tt_gridSpacing) {
    for (let x = tt_gridSpacing / 2; x < width + 20; x += tt_gridSpacing) {
      tt_grid.push({
        x, y,
        r: tt_gridDotRadiusBase + random(-tt_gridDotRadiusVariation, tt_gridDotRadiusVariation),
        active: true,
        activatedAt: null,
        explosionOrigins: []
      });
    }
  }

  for (let i = 0; i < tt_wordToSpawn.length; i++) {
    tt_addNewCircle(tt_wordToSpawn[i]);
  }

  let tt_halfW = width / 2;
  let tt_halfH = height / 2;

  // Loop through each quadrant and store valid square positions
  for (let tt_qx = 0; tt_qx < 2; tt_qx++) {
    for (let tt_qy = 0; tt_qy < 2; tt_qy++) {
      let tt_xStart = tt_qx * tt_halfW;
      let tt_yStart = tt_qy * tt_halfH;

      for (let tt_y = tt_yStart + tt_spacing / 2; tt_y < tt_yStart + tt_halfH; tt_y += tt_spacing) {
        for (let tt_x = tt_xStart + tt_spacing / 2; tt_x < tt_xStart + tt_halfW; tt_x += tt_spacing) {
          if (
            random() < tt_probability
          ) {
            tt_squarePositions.push({ x: tt_x, y: tt_y });
          }
        }
      }
    }
  }
  console.log("Grid size after reset:", tt_grid.length);
}

function loopFunction1() { // draw function for mode 1

  if (mode1Started) {
    background('#fffff3');

    // Draw the stored squares
    noStroke();
    fill(0);
    rectMode(CENTER);
    for (let tt_pos of tt_squarePositions) {
      rect(tt_pos.x, tt_pos.y, tt_squareSize, tt_squareSize);
    }

    // to set type depending on mobile or desktop
    if (width > 700) {
      push();
      textAlign(CENTER);
      textSize(200);
      textFont('argent-pixel-cf');
      textStyle(ITALIC);
      textLeading(130);
      text('finders\n  seekers', width/2, height/2);
      pop();
    } else {
      push();
      textAlign(LEFT, TOP);
      textSize(125);
      textFont('argent-pixel-cf');
      text('f', 78 / 393 * width, 22 / 857 * height);
      text('i', 142 / 393 * width, 39 / 857 * height);
      text('n', 197 / 393 * width, 58 / 857 * height);
      text('d', 235 / 393 * width, 165 / 857 * height);
      text('e', 193 / 393 * width, 253 / 857 * height);
      text('r', 127 / 393 * width, 282 / 857 * height);
      text('s', 63 / 393 * width, 355 / 857 * height);
      text('e', 118 / 393 * width, 434 / 857 * height);
      text('e', 182 / 393 * width, 482 / 857 * height);
      text('k', 249 / 393 * width, 520 / 857 * height);
      text('e', 235 / 393 * width, 627 / 857 * height);
      text('r', 175 / 393 * width, 681 / 857 * height);
      text('s', 102 / 393 * width, 697 / 857 * height);
      pop();
    }

    // to set reveal radius based on mobile or desktop
    if (width > height) tt_explosionCollisionRadius = 40;
    else tt_explosionCollisionRadius = 20;

    for (let pt of tt_grid) {
      if (!pt.active && pt.activatedAt && pt.explosionOrigins.length > 0) {
        let delays = pt.explosionOrigins.map(origin => {
          let d = dist(pt.x, pt.y, origin.x, origin.y);
          let maxD = 300;
          let noiseOffset = noise(pt.x * 0.01, pt.y * 0.01) * 300;
          let baseDelay = 1000;
          let fadeDelay = map(d, 0, maxD, tt_revealDuration, 0);
          return baseDelay + fadeDelay + noiseOffset;
        });

        let maxDelay = Math.max(...delays);
        if (millis() - pt.activatedAt >= maxDelay) {
          pt.active = true;
          pt.activatedAt = null;
          pt.explosionOrigins = [];
        }
      }

      fill(pt.active ? color(...tt_gridDotColor) : color(...tt_hiddenDotColor));
      ellipse(pt.x, pt.y, pt.r * 2);
    }

    for (let p of tt_petals) {
      p.update();
      p.checkCollision();
      p.display();
    }
    tt_petals = tt_petals.filter(p => p.life > 0);

    tt_handleCircleHover();
    tt_drawCircles();

    if (millis() - tt_lastInteractionTime > tt_autoTriggerDelay) {
      tt_triggerRandomUnexplodedCircle();
      tt_lastInteractionTime = millis();
    }
  }
}

function enterFunction2() { // setup function for mode 2
  
  // manage flags
  mode1Started = false;
  mode2Started = false;
  mode3Started = false;
  mode4Started = false;
  
  angleMode(RADIANS);

  // to set grid based on mobile or desktop
  if (width > height) cellSize = width / 50;
  else cellSize = height / 25;
  
  
  cols = Math.ceil(width / cellSize);
  rows = Math.ceil(height / cellSize);

  // Calculate offset to center the grid
  xOffset = (width - cols * cellSize) / 2;
  yOffset = (height - rows * cellSize) / 2;

  circleRadius = cellSize / 2;
  circles = [];
  initializeCircles();
}

function loopFunction2() { // draw function for mode 2
  background('#0A2C20');


  if(mode2Started) updateCircles();
  
  drawCircles();
}

function enterFunction3() { // setup function for mode 3

  // manage flags
  mode1Started = false;
  mode2Started = false;
  mode3Started = true;
  mode4Started = false;

  followers = [];

  angleMode(DEGREES);

  // initiate eyes
  followers.push(new FunctionFollower(0, drawShapeA));
  followers.push(new FunctionFollower(1, drawShapeB));
  followers.push(new FunctionFollower(2, drawShapeC));
  followers.push(new FunctionFollower(3, drawShapeD));
}

function loopFunction3() { // draw function for mode 3
  background('#111009');
  
  if (mode3Started) {
    for (let f of followers) {
      f.update();
      f.display();
    }
    
    for (let i = 0; i < followers.length; i++) {
      for (let j = i + 1; j < followers.length; j++) {
        separateFollowers(followers[i], followers[j]);
      }
    }
  }
}

function enterFunction4() { // setup function for mode 4

  // manage flags
  mode1Started = false;
  mode2Started = false;
  mode3Started = false;
  mode4Started = true;

  particles = [];
  
  colorMode(RGB);
  imageMode(CENTER);
  noStroke();

  // First 8 particles: beach ball image
  for (let i = 0; i < initialCount; i++) {
    particles.push(new Particle(random(width), random(height), particleRadius, null, null, null, img));
  }
}

function loopFunction4() { // draw function for mode 4

  if (mode4Started) {
    background('#FFFFF5');
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].checkEdges();
      particles[i].display();
    }
  }
}

// ----MODE 1 FUNCTIONS----
function tt_drawCircles() {
  textAlign(CENTER, CENTER);
  textFont('degular-mono');
  textStyle(BOLD);
  textSize(16);

  for (let i = 0; i < tt_circles.length; i++) {
    let c = tt_circles[i];
    if (!c.exploded) {
      let bounce = sin((millis() - tt_startTime) * tt_bounceSpeed + i) * tt_bounceAmplitude;
      let shadowWidth = map(bounce, -tt_bounceAmplitude, tt_bounceAmplitude, tt_shadowWidthMax, tt_shadowWidthMin);

      // Draw shadow
      fill(0, tt_shadowAlpha);
      ellipse(c.x, c.y + tt_shadowYOffset, shadowWidth, tt_shadowHeight);

      fill(...tt_circleFillColor);
      ellipse(c.x, c.y + bounce, c.r * 2);

      fill(...tt_textColor);
      text(c.letter || "", c.x, c.y + bounce);

    }
  }
}

function tt_handleCircleHover() {
  for (let c of tt_circles) {
    if (!c.exploded && dist(mouseX, mouseY, c.x, c.y) < c.r) {
      if (!c.hoveredAt || millis() - c.hoveredAt > tt_hoverCooldown) {
        tt_explodeCircle(c);
        c.hoveredAt = millis();
      }
    }
  }
}

function tt_explodeCircle(c) {
  c.exploded = true;
  tt_explodedCount++;
  tt_lastInteractionTime = millis();

  let petalCount = floor(random(tt_explosionMinPetals, tt_explosionMaxPetals + 1));
  for (let i = 0; i < petalCount; i++) {
    let angle = (TWO_PI * i) / petalCount;
    tt_petals.push(new Petal(c.x, c.y, angle));
  }

  if (tt_explodedCount > tt_spawnAfter) {
    tt_addNewCircle(c.letter);
  }
}

class Petal {
  constructor(x, y, angle) {
    this.origin = createVector(x, y);
    this.pos = createVector(x, y);

    // Spread adjustment based on canvas aspect ratio
    let spreadFactor = 1;
    if (height > width) {
      spreadFactor = 0.6; // Reduce speed when vertical layout
    }

    // Apply directional speed with spread control
    this.vel = p5.Vector.fromAngle(angle).mult(
      random(tt_explosionSpeedMin, tt_explosionSpeedMax) * spreadFactor
    );

    this.r = 10;
    this.life = 19;
    this.maxLife = 50;
  }

  update() {
    this.pos.add(this.vel);
    this.life--;
  }

  display() {
    let alpha = map(this.life, 0, this.maxLife, 0, 255);
    fill(255, alpha);
  }

  checkCollision() {
    for (let pt of tt_grid) {
      let d = dist(this.pos.x, this.pos.y, pt.x, pt.y);
      if (d < this.r + pt.r + tt_explosionCollisionRadius) {
        if (pt.active) {
          pt.active = false;
        }
        pt.activatedAt = millis();
        pt.explosionOrigins.push(this.origin.copy());
      }
    }
  }
}

function tt_triggerRandomUnexplodedCircle() {
  let unclicked = tt_circles.filter(c => !c.exploded);
  if (unclicked.length === 0) return;
  tt_explodeCircle(random(unclicked));
}

function tt_addNewCircle(letter = "") {
  let whitePoints = tt_grid.filter(pt => pt.active);
  if (whitePoints.length === 0) return;

  for (let i = 0; i < 50; i++) {
    let centerX = width / 2;
    let centerY = height / 2;
    let x = centerX + random(-width * 0.35, width * 0.35);
    let y = centerY + random(-height * 0.35, height * 0.35);

    // define starting point of the balls based on mobile or desktop
    if (findersFirst) {
      if (width > height) {
        if (i === 0) {
          x = 174/1761 * width;
          y = 358/1173 * height;
        } else if (i === 1) {
          x = 604/1761 * width;
          y = 289/1173 * height;
        } else if (i === 2) {
          x = 959/1761 * width;
          y = 159/1173 * height;
        } else if (i === 3) {
          x = 1322/1761 * width;
          y = 329/1173 * height;
        } else if (i === 4) {
          x = 383/1761 * width;
          y = 776/1173 * height;
        } else if (i === 5) {
          x = 881/1761 * width;
          y = 604/1173 * height;
        } else if (i === 6) {
          x = 1095/1761 * width;
          y = 929/1173 * height;
        } else if (i === 7) {
          x = 1501/1761 * width;
          y = 723/1173 * height;
        }
      } else {
        if (i === 0) {
          x = 78/393 * width;
          y = 143/857 * height;
        } else if (i === 1) {
          x = 245/393 * width;
          y = 170/857 * height;
        } else if (i === 2) {
          x = 188/393 * width;
          y = 247/857 * height;
        } else if (i === 3) {
          x = 308/393 * width;
          y = 317/857 * height;
        } else if (i === 4) {
          x = 55/393 * width;
          y = 383/857 * height;
        } else if (i === 5) {
          x = 207/393 * width;
          y = 459/857 * height;
        } else if (i === 6) {
          x = 159/393 * width;
          y = 625/857 * height;
        } else if (i === 7) {
          x = 319/393 * width;
          y = 587/857 * height;
        }
      }
    }

    // restricts respawned balls from being close together
    let tooClose = tt_circles.some(c => dist(c.x, c.y, x, y) < (c.r * 2) + 10);
    if (!tooClose) {
      tt_circles.push({ x, y, r: tt_circleRadius, exploded: false, letter });
      return;
    }
  }
}

function tt_reinitializeGridAndCircles() {
  tt_grid = [];
  tt_circles = [];
  tt_petals = [];
  tt_explodedCount = 0;
  tt_lastInteractionTime = millis();

  for (let y = tt_gridSpacing / 2; y < height; y += tt_gridSpacing) {
    for (let x = tt_gridSpacing / 2; x < width; x += tt_gridSpacing) {
      tt_grid.push({
        x, y,
        r: tt_gridDotRadiusBase + random(-tt_gridDotRadiusVariation, tt_gridDotRadiusVariation),
        active: true,
        activatedAt: null,
        explosionOrigins: []
      });
    }
  }

  for (let i = 0; i < tt_wordToSpawn.length; i++) {
    tt_addNewCircle(tt_wordToSpawn[i]);
  }
}

// ----MODE 2 FUNCTIONS----
function initializeCircles() {
  let center = createVector(Math.ceil(cols / 2), Math.ceil(rows / 2));
  let gridPositions = [];

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      gridPositions.push(createVector(x, y));
    }
  }

  gridPositions.sort((a, b) => {
    return dist(a.x, a.y, center.x, center.y) - dist(b.x, b.y, center.x, center.y);
  });

  for (let i = 0; i < numCircles; i++) {
    let pos = gridPositions[i];
    let x = pos.x * cellSize + cellSize / 2 - cellSize;
    let y = pos.y * cellSize + cellSize / 2 - cellSize;
    circles.push({
      x: x,
      y: y,
      gridX: pos.x,
      gridY: pos.y,
      targetX: x,
      targetY: y,
      startTime: millis(),
      moveCount: 0,
      history: [createVector(pos.x, pos.y)]
    });
  }
}

function updateCircles() {
  let now = millis();
  let newCircles = [];

  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];

    if (now - circle.startTime > easingDuration) {
      let neighbors = [];

      for (let dir of directions) {
        let newX = circle.gridX + dir[0];
        let newY = circle.gridY + dir[1];

        if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
          neighbors.push(createVector(newX, newY));
        }
      }

      neighbors = neighbors.filter(pos =>
        !circles.some(c => c.gridX === pos.x && c.gridY === pos.y)
      );

      if (neighbors.length > 0) {
        let newPos = random(neighbors);

        circle.targetX = newPos.x * cellSize + cellSize / 2 + xOffset;
        circle.targetY = newPos.y * cellSize + cellSize / 2 + yOffset;
        circle.history.push(createVector(circle.gridX, circle.gridY));
        circle.gridX = newPos.x;
        circle.gridY = newPos.y;
        circle.startTime = millis();
        circle.moveCount = (circle.moveCount || 0) + 1;

        // ✅ DUPLICATION LOGIC
        if (duplicate) {
          let cloneNeighbors = directions
            .map(d => createVector(circle.gridX + d[0], circle.gridY + d[1]))
            .filter(pos =>
              pos.x >= 0 && pos.x < cols && pos.y >= 0 && pos.y < rows &&
              !circles.some(c => c.gridX === pos.x && c.gridY === pos.y) &&
              !newCircles.some(c => c.gridX === pos.x && c.gridY === pos.y)
            );

          if (cloneNeighbors.length > 0) {
            let clonePos = random(cloneNeighbors);
            let cx = clonePos.x * cellSize + cellSize / 2 + xOffset;
            let cy = clonePos.y * cellSize + cellSize / 2 + yOffset;

            newCircles.push({
              x: circle.x,
              y: circle.y,
              gridX: clonePos.x,
              gridY: clonePos.y,
              targetX: cx,
              targetY: cy,
              startTime: millis(),
              history: [createVector(clonePos.x, clonePos.y)],
              moveCount: 0
            });
          }
        }
      }
    }

    let elapsed = min((now - circle.startTime) / easingDuration, 1);
    let ease = quartInOut(elapsed);
    circle.x = lerp(circle.x, circle.targetX, ease);
    circle.y = lerp(circle.y, circle.targetY, ease);
  }

  if (circles.length + newCircles.length > maxPintu) return;

  circles = circles.concat(newCircles);
}

function drawCircles() {
  push();
  fill('#FFD60D');
  noStroke();
  imageMode(CENTER);

  for (let circle of circles) {
    for (let pos of circle.history) {
      let hx = pos.x * cellSize + cellSize / 2 + xOffset;
      let hy = pos.y * cellSize + cellSize / 2 + yOffset;
    }

    // to initiate a wiggle animation on inactivity
    if (!mode2Started) {
      let time = millis();
      let interval = 3000;     // every 3 seconds
      let wiggleDuration = 500; // wiggle lasts for 300 ms

      let inWiggleWindow = (time % interval) < wiggleDuration;

      let wiggleX = 0;
      if (inWiggleWindow) {
        // Quick oscillation within the wiggle duration
        let t = (time % interval) / wiggleDuration; // normalized [0,1] over 300ms
        wiggleX = sin(t * TWO_PI * 4) * 5; // fast wiggle (4 cycles, 5px range)
      }

      let size = circleRadius * 2;
      image(pintu, circle.x + wiggleX, circle.y, size, size);
    }
    else {
      image(pintu, circle.x, circle.y, circleRadius * 2, circleRadius * 2);
    }
  }

  pop();
}

function quartInOut(t) {
  if (t < 0.5) {
    return 8 * t * t * t * t;
  } else {
    let f = t - 1;
    return -8 * f * f * f * f + 1;
  }
}

// ----MODE 3 FUNCTIONS----
function separateFollowers(a, b) {
  let minDist = 150; // minimum horizontal spacing
  let dx = b.pos.x - a.pos.x;
  let distance = abs(dx);

  if (distance < minDist) {
    let overlap = (minDist - distance) / 2;
    let direction = dx > 0 ? 1 : -1; // which way to push

    // Only adjust x position
    a.pos.x -= direction * overlap;
    b.pos.x += direction * overlap;
  }
}

function mouseReleased() {
  dragging = false;
  // duplicate = false;
}

// class for all eyes' behavious
class FunctionFollower {
  constructor(index, drawFunction) {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector();
    this.acc = createVector();
    this.angle = 0;
    this.drawFunction = drawFunction;
    this.offset = 60 + index * 50;
    this.maxSpeed = 7;
    this.maxForce = 0.3;
    this.t = random(1000);
    this.settled = false;
    this.gravity = createVector(0, 0.08);
    
    
    

    // 👁️ Pupil state
    this.leftPupilAngle = 90;
    this.rightPupilAngle = 90;
    this.leftPupilTarget = 90;
    this.rightPupilTarget = 90;
    
    this.droopStartTime = null;
    this.droopOffset = 0;
    this.maxDroop = 10;
  }

  update() {
    this.t += 0.01;
    
    
    
    if (dragging) {
        let elapsed = millis() - this.droopStartTime;
        if (elapsed > 4000 && this.drawFunction === drawShapeA ) {
          // Smooth droop using easing
          this.droopOffset = lerp(this.droopOffset, this.maxDroop, 0.05);
        } else if (elapsed > 3000 && this.drawFunction === drawShapeC ) {
          if(frameCount % 8 === 0) this.maxDroop = random(4,10);
          this.droopOffset = this.maxDroop;
        } else if (elapsed > 2000 && this.drawFunction === drawShapeA && phoneEye === true ) {
          // Smooth droop using easing
          this.droopOffset = lerp(this.droopOffset, this.maxDroop, 0.05);
        } else if (elapsed > 1500 && this.drawFunction === drawShapeC && phoneEye === true) {
          // Smooth droop using easing
          if(frameCount % 8 === 0) this.maxDroop = random(4,10);
          this.droopOffset = this.maxDroop;
        }
        
      } else {
        // Return eyelid when not dragging
        this.droopOffset = lerp(this.droopOffset, 0, 0.1);
        if(this.drawFunction === drawShapeA) this.droopOffset = lerp(this.droopOffset, this.maxDroop, 0.05);
      }

    if (dragging) {
      let target = createVector(mouseX, mouseY);
      let desired = p5.Vector.sub(target, this.pos);

      if (desired.mag() > this.offset) {
        desired.setMag(this.maxSpeed);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        this.acc.add(steer);
      }

      this.angle = this.vel.heading() * 0.1;
    } else if (!this.settled) {
      this.acc.add(this.gravity);
      this.angle *= 0.95;

      if (this.pos.y >= height - 50) {
        this.pos.y = height - 50;
        this.vel.mult(0);
        this.acc.mult(0);
        this.settled = true;
      }
    }

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    this.pos.x = constrain(this.pos.x, eyeRadius * 2, width - eyeRadius *2);
    this.pos.y = constrain(this.pos.y, eyeRadius * 2, height - eyeRadius *2);
  }

  display() {
    push();
    
    translate(this.pos.x, this.pos.y);
      
    rotate(this.angle);
    this.drawFunction(this);  // pass self to draw function
    pop();
  }
}

// UNIQUE FUNCTIONS TO DRAW EACH EYE
function drawShapeA(follower) { // first pair of eyes
  push();
  
  if (!dragging) { 
    follower.leftPupilTarget = 90;
    follower.rightPupilTarget = 90;
  }
  

  if (dragging) {
    let leftEyeCenterX = follower.pos.x - eyeRadius;
    let leftEyeCenterY = follower.pos.y;
    let rightEyeCenterX = follower.pos.x + eyeRadius;
    let rightEyeCenterY = follower.pos.y;

    follower.leftPupilTarget = atan2(mouseY - leftEyeCenterY, mouseX - leftEyeCenterX);
    follower.rightPupilTarget = atan2(mouseY - rightEyeCenterY, mouseX - rightEyeCenterX);
  }

  follower.leftPupilAngle = lerpAngle(follower.leftPupilAngle, follower.leftPupilTarget, 0.1);
  follower.rightPupilAngle = lerpAngle(follower.rightPupilAngle, follower.rightPupilTarget, 0.1);

  fill(255);
  noStroke();
  ellipse(-eyeRadius, 0, eyeRadius * 2, eyeRadius * 2);
  ellipse(eyeRadius, 0, eyeRadius * 2, eyeRadius * 2);
  
  let lidOffset = eyeRadius; // base distance from center

  // LEFT EYE

  // Upper lid
  push();
  translate(-eyeRadius, 0);
  translate(0, -lidOffset + follower.droopOffset); // goes down over time
  fill('#111009');
  noStroke();
  arc(0, 0, eyeRadius * 2, eyeRadius * 2, 180, 360, CHORD);
  pop();


  // RIGHT EYE

  // Upper lid
  push();
  translate(eyeRadius, 0);
  translate(0, -lidOffset + follower.droopOffset);
  fill('#111009');
  noStroke();
  arc(0, 0, eyeRadius * 2, eyeRadius * 2, 180, 360, CHORD);
  pop();

  let pupilRadius = 12.5;
  let leftPx = cos(follower.leftPupilAngle) * pupilRadius;
  let leftPy = sin(follower.leftPupilAngle) * pupilRadius;
  let rightPx = cos(follower.rightPupilAngle) * pupilRadius;
  let rightPy = sin(follower.rightPupilAngle) * pupilRadius;

  fill('#111009');
  ellipse(-eyeRadius + leftPx, 0 + leftPy, eyeRadius, eyeRadius);
  ellipse(eyeRadius + rightPx, 0 + rightPy, eyeRadius, eyeRadius);

  pop();
}

function drawShapeB(follower) { // second pair of eyes
  push();
  
  if (!dragging) { 
    follower.leftPupilTarget = 90;
    follower.rightPupilTarget = 90;
  }
  

  if (dragging) {
    let leftEyeCenterX = follower.pos.x - eyeRadius;
    let leftEyeCenterY = follower.pos.y;
    let rightEyeCenterX = follower.pos.x + eyeRadius;
    let rightEyeCenterY = follower.pos.y;

    follower.leftPupilTarget = atan2(mouseY - leftEyeCenterY, mouseX - leftEyeCenterX);
    follower.rightPupilTarget = atan2(mouseY - rightEyeCenterY, mouseX - rightEyeCenterX);
  }

  follower.leftPupilAngle = lerpAngle(follower.leftPupilAngle, follower.leftPupilTarget, 0.1);
  follower.rightPupilAngle = lerpAngle(follower.rightPupilAngle, follower.rightPupilTarget, 0.1);

  fill(255);
  noStroke();
  ellipse(-eyeRadius, 0, eyeRadius*2, eyeRadius*2);
  ellipse(eyeRadius, 0, eyeRadius*2, eyeRadius*2);

  let pupilRadius = eyeRadius/2;
  let leftPx = cos(follower.leftPupilAngle) * pupilRadius;
  let leftPy = sin(follower.leftPupilAngle) * pupilRadius;
  let rightPx = cos(follower.rightPupilAngle) * pupilRadius;
  let rightPy = sin(follower.rightPupilAngle) * pupilRadius;

  fill('#111009');
  ellipse(-eyeRadius + leftPx, 0 + leftPy, 5*eyeRadius/3, 5*eyeRadius/3);
  ellipse(eyeRadius + rightPx, 0 + rightPy, 5*eyeRadius/3, 5*eyeRadius/3);
  fill(255);
  ellipse(-10 + leftPx, leftPy, 10, 10);
  ellipse(20 + rightPx, rightPy, 10, 10);
  ellipse(-20 + leftPx, leftPy + 4, 4, 4);
  ellipse(8 + rightPx, rightPy + 4, 4, 4);

  pop();
}

function drawShapeC(follower) { // third pair of eyes
  push();
  
  if (!dragging) { 
    follower.leftPupilTarget = 90;
    follower.rightPupilTarget = 90;
  }
  

  if (dragging) {
    let leftEyeCenterX = follower.pos.x - eyeRadius/2 + 5;
    let leftEyeCenterY = follower.pos.y;
    let rightEyeCenterX = follower.pos.x + eyeRadius;
    let rightEyeCenterY = follower.pos.y;

    follower.leftPupilTarget = atan2(mouseY - leftEyeCenterY, mouseX - leftEyeCenterX);
    follower.rightPupilTarget = atan2(mouseY - rightEyeCenterY, mouseX - rightEyeCenterX);
  }

  follower.leftPupilAngle = lerpAngle(follower.leftPupilAngle, follower.leftPupilTarget, 0.1);
  follower.rightPupilAngle = lerpAngle(follower.rightPupilAngle, follower.rightPupilTarget, 0.1);

  fill(255);
  noStroke();
  ellipse(-eyeRadius/2 - 5, 0, eyeRadius +5, eyeRadius+5);
  ellipse(eyeRadius, 0, eyeRadius*2, eyeRadius*2);
  
  let lidOffset = eyeRadius; // base distance from center

  // LEFT EYE

  // Upper lid
  push();
  translate(-eyeRadius, 0);
  translate(0, -lidOffset + follower.droopOffset); // goes down over time
  fill('#111009');
  noStroke();
  arc(0, 0, eyeRadius*2, eyeRadius*2, 180, 360, CHORD);
  pop();
  
  // Lower lid
  push();
  translate(-eyeRadius, 0);
  translate(0, lidOffset - follower.droopOffset); // goes up over time
  fill('#111009');
  noStroke();
  arc(0, 0, eyeRadius*2, eyeRadius*2, 0, 180, CHORD);
  pop();

  let pupilRadius = eyeRadius/2;
  let leftPx = cos(follower.leftPupilAngle) * pupilRadius;
  let leftPy = sin(follower.leftPupilAngle) * pupilRadius;
  let rightPx = cos(follower.rightPupilAngle) * pupilRadius;
  let rightPy = sin(follower.rightPupilAngle) * pupilRadius;

  fill('#111009');
  ellipse(-eyeRadius + leftPx, 0 + leftPy, 10, 10);
  ellipse(eyeRadius + rightPx, 0 + rightPy, 20, 20);

  pop();
}

function drawShapeD(follower) { // fourth pair of eyes
  push();
  
  if (!dragging) { 
    follower.leftPupilTarget = 90;
    follower.rightPupilTarget = 90;
  }
  

  if (dragging) {
    let leftEyeCenterX = follower.pos.x - eyeRadius;
    let leftEyeCenterY = follower.pos.y;
    let rightEyeCenterX = follower.pos.x + eyeRadius;
    let rightEyeCenterY = follower.pos.y;

    follower.leftPupilTarget = atan2(mouseY - leftEyeCenterY, mouseX - leftEyeCenterX);
    follower.rightPupilTarget = atan2(mouseY - rightEyeCenterY, mouseX - rightEyeCenterX);
  }

  follower.leftPupilAngle = lerpAngle(follower.leftPupilAngle, follower.leftPupilTarget, 0.1);
  follower.rightPupilAngle = lerpAngle(follower.rightPupilAngle, follower.rightPupilTarget, 0.1);

  fill(255);
  noStroke();
  ellipse(-eyeRadius, 0, eyeRadius*2, eyeRadius*2);
  ellipse(eyeRadius, 0, eyeRadius*2, eyeRadius*2);

  let pupilRadius = 12.5;
  let leftPx = cos(follower.leftPupilAngle) * pupilRadius;
  let leftPy = sin(follower.leftPupilAngle) * pupilRadius;
  let rightPx = cos(follower.rightPupilAngle) * pupilRadius;
  let rightPy = sin(follower.rightPupilAngle) * pupilRadius;

  fill('#111009');
  ellipse(-eyeRadius + leftPx, 0 + leftPy, eyeRadius, eyeRadius);
  ellipse(eyeRadius + rightPx, 0 + rightPy, eyeRadius, eyeRadius);

  pop();
}

function lerpAngle(a, b, t) {
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return a + diff * t;
}

// ----MODE 4 FUNCTIONS----
class Particle {
  constructor(x, y, r, angle, speed, col, image = null) {
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = p5.Vector.fromAngle(angle || random(TWO_PI)).mult(speed || random(1, 2));
    this.mass = this.r * 0.1;
    this.col = col; // If null, use image
    this.image = image;
  }

  update() {
    this.pos.add(this.vel);
  }

  display() {
    push();
    if (this.image && !this.col) {
      blendMode(BLEND); // default blend for images
      image(this.image, this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    } else {
      blendMode(MULTIPLY); // multiply blend for colored particles
      fill(this.col);
      ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
    pop();
  }

  checkEdges() {
    if (this.pos.x < this.r || this.pos.x > width - this.r) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, this.r, width - this.r);
    }
    if (this.pos.y < this.r || this.pos.y > height - this.r) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, this.r, height - this.r);
    }
  }

  isClicked(mx, my) {
    let clickRadius = this.image && !this.col ? this.r * 2 : this.r;
    return dist(mx, my, this.pos.x, this.pos.y) < clickRadius;
  }
}


// ----GLOBAL FUNCTIONS----
function mousePressed() {
  
  
  dragging = true;
  lastMouse.x = mouseX;
  lastMouse.y = mouseY;
  
  mode2Started = true;

  duplicate = true;
  setTimeout(() => {
    duplicate = false;
  }, 500);

  for (let f of followers) {
    f.settled = false;
    if (f.drawFunction === drawShapeA || f.drawFunction === drawShapeC) {
      f.droopStartTime = millis();
    }
  }
  
  let newParticles = [];

  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].isClicked(mouseX, mouseY)) {
      if (particles.length + 8 <= maxParticles) {
        let parent = particles.splice(i, 1)[0];

        for (let j = 0; j < 8; j++) {
          let angle = random(TWO_PI);
          let speed = random(1, 2);
          let newColor;
          let newRadius = random(10, 20); // ✅ random radius for new particles

          if (parent.image) {
            // First split: from image to solid color
            newColor = color(customColors[j % customColors.length]);
          } else {
            // Further splits: same hue, random saturation/brightness
            colorMode(HSB);
            let h = hue(parent.col);
            let s = random(60, 100);       // Varying saturation
            let b = random(60, 100);       // Varying brightness
            newColor = color(h, s, b);
            colorMode(RGB); // Reset
          }

          newParticles.push(new Particle(parent.pos.x, parent.pos.y, newRadius, angle, speed, newColor));
        }
      }
      break;
    }
  }

  particles = particles.concat(newParticles);
}

function touchStarted(event) {
  phoneEye = true;
  mode2Started = true;
  duplicate = true;

  setTimeout(() => {
    duplicate = false;
  }, 500);

  let touch = event.touches[0];

  // Check what element is under the touch point
  let touchedElement = document.elementFromPoint(touch.clientX, touch.clientY);

  // If touch is NOT directly on the canvas element, don't trigger sketch logic
  if (touchedElement !== canvas.elt) {
    return true; // allow button clicks, links etc.
  }

  // Otherwise, trigger canvas interaction
  mousePressed();

  // Simulate mouse release after 3 seconds
  setTimeout(() => {
    dragging = false;
    phoneEye = false;
    mouseReleased();
  }, 4000);

  //return false; // block default only if it's actually the canvas
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  tt_reinitializeGridAndCircles();
}