let angleX = 0;
let angleY = 0;
let zoom = 1.0; // Initial zoom level

let table;
let r = 200;

let earth;

// Array to store shooting star objects
let shootingStars = [];

function preload() {
  earth = loadImage('earth.jpg');
  table = loadTable(
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.csv',
    'header'
  );
}

function setup() {
  createCanvas(600, 600, WEBGL);
  
  // Initialize shooting star objects
  for (let i = 0; i < 5; i++) {
    shootingStars.push(new ShootingStar());
  }
}

function draw() {
  background(0); // Set background color to black
  
  lights();
  
  rotateX(angleX);
  rotateY(angleY);
  
  scale(zoom);
  
  fill(200);
  noStroke();
  texture(earth);
  sphere(r);

  // Update and display shooting star objects
  for (let shootingStar of shootingStars) {
    shootingStar.update();
    shootingStar.display();
  }

  for (let row of table.rows) {
    let lat = row.getNum('latitude');
    let lon = row.getNum('longitude');
    let mag = row.getNum('mag');
    let theta = radians(lat);
    let phi = radians(lon) + PI;
    let x = r * cos(theta) * cos(phi);
    let y = -r * sin(theta);
    let z = -r * cos(theta) * sin(phi);
    let pos = createVector(x, y, z);
    let h = pow(10, mag);
    let maxh = pow(10, 7);
    h = map(h, 0, maxh, 10, 100);
    let xaxis = createVector(1, 0, 0);
    let angleb = abs(xaxis.angleBetween(pos));
    let raxis = xaxis.cross(pos);

    push();
    translate(x, y, z);
    rotate(angleb, raxis);
    fill(255);
    box(h, 5, 5);
    pop();
  }
}

function mouseDragged() {
  let sensitivity = 0.01;
  angleY += sensitivity * (mouseX - pmouseX);
  angleX += sensitivity * -(mouseY - pmouseY);
}

function mouseWheel(event) {
  let sensitivity = 0.01;
  zoom -= sensitivity * event.delta;
  zoom = constrain(zoom, 0.5, 2.0);
  return false;
}

class ShootingStar {
  constructor() {
    this.position = createVector(random(-r, r), random(-r, r), random(-r, r));
    this.velocity = createVector(random(-10, -5), random(-2, 2), random(-2, 2)); // Adjust velocity for faster movement
    this.size = random(1, 3); // Adjust size for smaller stars
  }

  update() {
    this.position.add(this.velocity);
    // Wrap around the scene
    if (this.position.mag() > r * 2) {
      this.position.mult(-1);
    }
  }

  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    fill(255, random(100, 200)); // Random opacity
    noStroke();
    sphere(this.size);
    pop();
  }
}

