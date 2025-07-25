let ballX, ballY;
let ballRadius = 50;
let targetX, targetY;
let beta, gamma;
let threshold = 0.02;
let border = 20;
let floatTexts = [];
let permissionButton;

// Particle system variables
let particles = [];
let particleSize= 5; //10, 2, 10
let numParticles = 200; //100, 300, 100
let trailLength = 10; //20, 10, 10
let speedRange = { min: 5, max: 10 };//5:10, 5:10, 1:5
let trailColors = ['#3868B5', '#3EA888', '#FFD60D', '#FA4E46', '#4A2F2F'];

let logo;

let targetRot = 0;


let hasDeviceOrientation = false;

let started = false;

let ballSVG;

let dicePNGw;
let dicePNGp;
let pingpongPNG;

function preload() {
  dicePNGw = loadImage("workDice.png");
  dicePNGp = loadImage("playDice.png");
  pingpongPNG = loadImage("pingpongDice.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ballX = width / 2;
  ballY = height / 2;
  targetX = ballX;
  targetY = ballY;
  textAlign(CENTER, CENTER);
  textFont('Helvetica');
  noStroke();

  floatTexts = [
    new FloatingWord("2"),
    new FloatingWord("DAYS"),
    new FloatingWord("TO"),
    new FloatingWord("GO")
  ];

  for (let i = 0; i < numParticles; i++) {
    particles.push(createParticle());
  }
  
  // Ping Pong Logo
  logo = loadImage("PingPongLogo.png");
  
  

  
  // Central play button
  // permissionButton = createButton('▶');
  // permissionButton = createDiv(`
  //   <svg width="72" height="72" viewBox="0 0 100 100">
  //     <polygon points="35,25 75,50 35,75" 
  //       fill="none" stroke="black" stroke-width="2" />
  //   </svg>
  // `);

  permissionButton = document.querySelector('.permission-button');
  startText = document.querySelector('.start-text');
  // permissionButton.size(100, 100); // set fixed width and height
  // permissionButton.position(width / 2 - 50, height / 1.2 - 50); // center it

  // // Style the button
  // permissionButton.style('padding-left', '0px');
  // permissionButton.style('padding-top', '0px');
  // permissionButton.style('font-size', '48px');
  // permissionButton.style('background', 'transparent');
  // permissionButton.style('color', '#000');
  // //permissionButton.style('border', '1px solid #000');
  // //permissionButton.style('border-radius', '50%');
  // permissionButton.style('cursor', 'pointer');
  // permissionButton.style('display', 'flex');
  // permissionButton.style('align-items', 'center');
  // permissionButton.style('justify-content', 'center');
  // permissionButton.style('text-align', 'center');
  // permissionButton.style('line-height', '60px'); // matches height to vertically center text

  // permissionButton.mousePressed(startSketch);
  document.querySelector('.permission-button').addEventListener('click', () => {
  if (typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          started = true;
          permissionButton.style.visibility = 'hidden';
          startText.style.visibility = 'hidden';
          window.addEventListener('deviceorientation', handleOrientation);
        } else {
          alert('Permission denied for motion input.');
        }
      })
      .catch(console.error);
  } else {
    // No permission needed, just start
    started = true;
    permissionButton.style.visibility = 'hidden';
    startText.style.visibility = 'hidden';
    window.addEventListener('deviceorientation', handleOrientation);
  }
});
}

function startSketch() {
  if (typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          started = true;
          permissionButton.hide();
          window.addEventListener('deviceorientation', handleOrientation);
        } else {
          alert('Permission denied for motion input.');
        }
      })
      .catch(console.error);
  } else {
    // No permission needed, just start
    started = true;
    permissionButton.hide();
    window.addEventListener('deviceorientation', handleOrientation);
  }
}

function handleOrientation(event) {
  if (event.beta !== null && event.gamma !== null) {
    hasDeviceOrientation = true;
    beta = event.beta;
    gamma = event.gamma;

    let rX = map(gamma, -90, 90, -height / 2, height / 2);
    let rY = map(beta, -90, 90, -height, height);

    targetX = width / 2 + rX;
    targetY = height / 2 + rY;
    
    targetRot = map(beta, -90, 90, -PI, PI); // +/- 60 degrees
  }
}

function draw() {
  
  if(started){
    noCursor();
    document.querySelector('.head-container').style.cursor = 'none';
    document.querySelector('html').style.cursor = 'none';
  }

  if (!started) {
    document.querySelector('.head-container').style.cursor = 'default';
    background('#FFD60D');
    
    textSize(18);
    fill(0);
    // text("HELLO@STUDIOPINGPONG.COM", 6.25*width/8, height/8-30);
    // text("LAUNCHING 1 JUNE", 6.85*width/8, height/8);
    
    let padding = width/64;
    let imgWidth = width / 6;
    let imgHeight = width / 12;
    // image(logo, padding, padding, imgWidth + padding * 4, imgHeight + padding * 2);
    //logo.style('padding', '12px');
    return;
  }
  
  
  // Compute whether the ball is near center
  let distFromCenterX = abs(ballX - width / 2);
  let distFromCenterY = abs(ballY - height / 2);
  let xThreshold = width * threshold;
  let yThreshold = height * threshold;
  let centerHit = distFromCenterX < xThreshold && distFromCenterY < yThreshold;

  // 1. Draw background first
  let bgColor = centerHit ? color('#FFFFF3') : color('#FFD60D');
  background(bgColor);

  // 2. Run particles if centered (they will appear behind all other visuals)
  if (centerHit) {
    runParticles();
  }
  
  if (!hasDeviceOrientation) {
  targetX = mouseX;
  targetY = mouseY;
  }

  // 3. Move ball
  ballX = lerp(ballX, targetX, 0.1);
  ballY = lerp(ballY, targetY, 0.1);

  // 4. Draw main and mirrored ball
  let ballColor = centerHit ? color('#FFD60D') : color(255);
  // fill(ballColor);
  // ellipse(ballX, ballY, ballRadius * 2, ballRadius * 2);
  let mirroredX = width - ballX;
  let mirroredY = height - ballY;
  // ellipse(mirroredX, mirroredY, ballRadius * 2, ballRadius * 2);
  
  if(!centerHit){
    let diceSize = ballRadius * 2;
    imageMode(CENTER);
    // Rotate WORK dice
    push();
    translate(ballX, ballY);
    rotate(targetRot);
    image(dicePNGw, 0, 0, diceSize, diceSize);
    pop();

    // Rotate PLAY dice
    push();
    translate(mirroredX, mirroredY);
    rotate(-targetRot); // Mirror the rotation direction for visual contrast
    image(dicePNGp, 0, 0, diceSize, diceSize);
    pop();
  }

  // 5. Draw text
  fill(0);
  if (centerHit) {
    textSize(24);
    // text("PING", width / 2, height / 2 - 14);
    // text("PONG", width / 2, height / 2 + 14);
    let diceSize = ballRadius * 2;
    imageMode(CENTER);
    image(pingpongPNG, ballX, ballY, diceSize * 1.4, diceSize * 1.4);
    

    for (let word of floatTexts) {
      //word.update();
      //word.display();
    }
  } else {
    textSize(20);
    // text("WORK", ballX, ballY);
    // text("PLAY", mirroredX, mirroredY);
  }
}



// ---- Floating Word Class ----
class FloatingWord {
  constructor(txt) {
    this.txt = txt;
    this.x = random(width);
    this.y = random(height);
    this.vx = (random() > 0.5 ? 1 : -1);
    this.vy = (random() > 0.5 ? 1 : -1);
    this.angle = random(TWO_PI);
    this.rotationSpeed = random(0.01, 0.02);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x <= border || this.x >= width - border) this.vx *= -1;
    if (this.y <= border || this.y >= height - border) this.vy *= -1;

    // Bounce off ball
    let distToBall = dist(this.x, this.y, ballX, ballY);
    if (distToBall < ballRadius + 20) {
      let angleToBall = atan2(this.y - ballY, this.x - ballX);
      this.vx = cos(angleToBall) * 2;
      this.vy = sin(angleToBall) * 2;
    }

    this.angle += this.rotationSpeed;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    textSize(42);
    text(this.txt, 0, 0);
    pop();
  }
}

// ---- Particle System ----
function runParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;

    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > trailLength) p.trail.shift();

    noStroke();
    for (let t = 0; t < p.trail.length; t++) {
      let cIndex = p.trail.length === 1 ? 0 : map(t, 0, p.trail.length - 1, 0, trailColors.length - 1);
      let cLow = floor(cIndex);
      let cHigh = min(ceil(cIndex), trailColors.length - 1);

      let c1 = color(trailColors[cLow]);
      let c2 = color(trailColors[cHigh]);
      let amt = cIndex - cLow;
      let c = lerpColor(c1, c2, amt);

      let alpha = map(t, 0, p.trail.length - 1, 250, 255);
      c.setAlpha(alpha);

      fill(c);
      let pos = p.trail[t];
      ellipse(pos.x, pos.y, particleSize);
    }

    // Main particle on top
    fill(255);
    ellipse(p.x, p.y, particleSize);

    // Respawn if out of bounds
    if (p.x < 0-trailLength*2 || p.x > width+trailLength*2 || p.y < 0-trailLength*2 || p.y > height+trailLength*2) {
      particles[i] = createParticle();
    }
  }
}

function createParticle() {
  return {
    x: width / 2,
    y: height / 2,
    angle: random(TWO_PI),
    speed: random(speedRange.min, speedRange.max),
    trail: []
  };
}

function requestAccess() {
  if (typeof DeviceMotionEvent !== 'undefined' && 
      typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          // Permission granted
          permissionButton.hide(); // Hide the button
        } else {
          alert('Permission denied for motion input.');
        }
      })
      .catch(console.error);
  } else {
    // For non-iOS devices
    permissionButton.hide();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // permissionButton.position(width / 2 - 50, height / 2 - 50); // center it
}