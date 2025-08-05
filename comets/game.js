// Game variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const levelElement = document.getElementById("level");
const gameOverElement = document.getElementById("gameOver");
const gameOverTextElement = document.getElementById("gameOverText");
const finalScoreElement = document.getElementById("finalScore");

let score = 0;
let lives = 3;
let level = 1;
let gameRunning = true;
let asteroids = [];
let particles = [];
let lastAsteroidTime = 0;
let asteroidSpawnInterval = 2000; // milliseconds

// Ship properties
const ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 0,
  vy: 0,
  speed: 5,
  maxSpeed: 8,
  size: 15,
  angle: 0,
  trail: [],
  boost: false,
};

// Input handling
const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === " ") {
    e.preventDefault();
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

// Asteroid class
class Asteroid {
  constructor() {
    this.size = Math.random() * 30 + 20; // 20-50px radius
    this.x = Math.random() * canvas.width;
    this.y = -this.size;
    this.vx = (Math.random() - 0.5) * 4; // Random horizontal velocity
    this.vy = Math.random() * 2 + 1; // 1-3 pixels per frame downward
    this.rotation = 0;
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    this.points = Math.floor(this.size / 10);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Draw asteroid
    ctx.fillStyle = "#8B4513";
    ctx.strokeStyle = "#654321";
    ctx.lineWidth = 2;

    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = this.size + Math.sin(angle * 3) * 5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  isOffScreen() {
    return (
      this.y > canvas.height + this.size ||
      this.x < -this.size ||
      this.x > canvas.width + this.size
    );
  }

  collidesWith(x, y, radius) {
    const distance = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
    return distance < this.size + radius;
  }
}

// Particle class for explosions
class Particle {
  constructor(x, y, vx, vy, color, life = 1) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = life;
    this.maxLife = life;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.life -= 0.02;
  }

  draw() {
    const alpha = this.life / this.maxLife;
    ctx.fillStyle = `rgba(${this.color}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Trail segment class
class TrailSegment {
  constructor(x, y, timestamp) {
    this.x = x;
    this.y = y;
    this.timestamp = timestamp;
    this.life = 2; // 2 seconds
  }

  update(deltaTime) {
    this.life -= deltaTime;
  }

  draw() {
    const alpha = Math.max(0, this.life / 2);
    const size = Math.max(4, (this.life / 2) * 12); // Increased base size and max size

    // Create gradient for trail effect
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      size
    );
    gradient.addColorStop(0, `rgba(0, 255, 255, ${alpha * 0.9})`);
    gradient.addColorStop(0.3, `rgba(0, 255, 255, ${alpha * 0.6})`);
    gradient.addColorStop(0.7, `rgba(0, 255, 255, ${alpha * 0.3})`);
    gradient.addColorStop(1, `rgba(0, 255, 255, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = "rgba(0, 255, 255, 0.8)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.3})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  collidesWith(x, y, radius) {
    const distance = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
    return distance < radius + 8; // Increased trail collision radius for better detection
  }
}

// Update ship movement
function updateShip() {
  // Handle input
  let dx = 0;
  let dy = 0;

  if (keys["w"] || keys["arrowup"]) dy -= 1;
  if (keys["s"] || keys["arrowdown"]) dy += 1;
  if (keys["a"] || keys["arrowleft"]) dx -= 1;
  if (keys["d"] || keys["arrowright"]) dx += 1;

  // Normalize diagonal movement
  if (dx !== 0 && dy !== 0) {
    dx *= 0.707;
    dy *= 0.707;
  }

  // Apply movement
  ship.vx += dx * ship.speed * 0.1;
  ship.vy += dy * ship.speed * 0.1;

  // Apply friction
  ship.vx *= 0.95;
  ship.vy *= 0.95;

  // Limit speed
  const speed = Math.sqrt(ship.vx ** 2 + ship.vy ** 2);
  if (speed > ship.maxSpeed) {
    ship.vx = (ship.vx / speed) * ship.maxSpeed;
    ship.vy = (ship.vy / speed) * ship.maxSpeed;
  }

  // Update position
  ship.x += ship.vx;
  ship.y += ship.vy;

  // Wrap around screen
  if (ship.x < -ship.size) ship.x = canvas.width + ship.size;
  if (ship.x > canvas.width + ship.size) ship.x = -ship.size;
  if (ship.y < -ship.size) ship.y = canvas.height + ship.size;
  if (ship.y > canvas.height + ship.size) ship.y = -ship.size;

  // Update angle for visual direction
  if (dx !== 0 || dy !== 0) {
    ship.angle = Math.atan2(dy, dx);
  }

  // Add trail segment
  ship.trail.push(new TrailSegment(ship.x, ship.y, Date.now()));

  // Remove old trail segments
  ship.trail = ship.trail.filter((segment) => segment.life > 0);
}

// Draw ship
function drawShip() {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);

  // Draw ship body
  ctx.fillStyle = "#00ffff";
  ctx.strokeStyle = "#0080ff";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(ship.size, 0);
  ctx.lineTo(-ship.size, ship.size * 0.5);
  ctx.lineTo(-ship.size * 0.5, 0);
  ctx.lineTo(-ship.size, -ship.size * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw engine glow
  if (Math.abs(ship.vx) > 0.1 || Math.abs(ship.vy) > 0.1) {
    ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
    ctx.beginPath();
    ctx.arc(-ship.size * 0.8, 0, ship.size * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Spawn asteroids
function spawnAsteroid() {
  if (Date.now() - lastAsteroidTime > asteroidSpawnInterval) {
    asteroids.push(new Asteroid());
    lastAsteroidTime = Date.now();

    // Gradually increase difficulty
    asteroidSpawnInterval = Math.max(500, asteroidSpawnInterval - 20);
  }
}

// Check collisions
function checkCollisions() {
  // Check ship collision with asteroids
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];
    if (asteroid.collidesWith(ship.x, ship.y, ship.size)) {
      // Ship hit by asteroid
      lives--;
      livesElement.textContent = lives;

      // Create explosion particles
      for (let j = 0; j < 10; j++) {
        particles.push(
          new Particle(
            ship.x + (Math.random() - 0.5) * 20,
            ship.y + (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            "0, 255, 255"
          )
        );
      }

      // Remove asteroid
      asteroids.splice(i, 1);

      if (lives <= 0) {
        gameOver();
      }
      break;
    }
  }

  // Check trail collision with asteroids
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];
    for (let j = ship.trail.length - 1; j >= 0; j--) {
      const trailSegment = ship.trail[j];
      if (trailSegment.collidesWith(asteroid.x, asteroid.y, asteroid.size)) {
        // Asteroid destroyed by trail
        score += asteroid.points;
        scoreElement.textContent = score;

        // Create explosion particles
        for (let k = 0; k < 8; k++) {
          particles.push(
            new Particle(
              asteroid.x + (Math.random() - 0.5) * 30,
              asteroid.y + (Math.random() - 0.5) * 30,
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 6,
              "139, 69, 19"
            )
          );
        }

        // Remove asteroid
        asteroids.splice(i, 1);
        break;
      }
    }
  }
}

// Update game state
function update() {
  if (!gameRunning) return;

  const deltaTime = 1 / 60; // Assuming 60 FPS

  updateShip();
  spawnAsteroid();

  // Update asteroids
  asteroids.forEach((asteroid) => asteroid.update());

  // Update trail segments
  ship.trail.forEach((segment) => segment.update(deltaTime));

  // Update particles
  particles.forEach((particle) => particle.update());

  // Remove off-screen asteroids
  asteroids = asteroids.filter((asteroid) => !asteroid.isOffScreen());

  // Remove dead particles
  particles = particles.filter((particle) => particle.life > 0);

  // Check collisions
  checkCollisions();

  // Level progression
  if (score > level * 100) {
    level++;
    levelElement.textContent = level;
  }
}

// Draw game
function draw() {
  // Clear canvas
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw stars background
  drawStars();

  // Draw trail
  ship.trail.forEach((segment) => segment.draw());

  // Draw particles
  particles.forEach((particle) => particle.draw());

  // Draw asteroids
  asteroids.forEach((asteroid) => asteroid.draw());

  // Draw ship
  drawShip();

  // Draw UI
  drawUI();
}

// Draw stars background
function drawStars() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  for (let i = 0; i < 50; i++) {
    const x = (i * 37) % canvas.width;
    const y = (i * 73) % canvas.height;
    const size = Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Draw UI
function drawUI() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Lives: ${lives}`, 10, 60);
  ctx.fillText(`Level: ${level}`, 10, 90);
}

// Game over function
function gameOver() {
  gameRunning = false;
  gameOverTextElement.textContent = "Game Over!";
  finalScoreElement.textContent = score;
  gameOverElement.style.display = "block";
}

// Restart game function
function restartGame() {
  score = 0;
  lives = 3;
  level = 1;
  gameRunning = true;
  asteroids = [];
  particles = [];
  ship.trail = [];
  ship.x = canvas.width / 2;
  ship.y = canvas.height / 2;
  ship.vx = 0;
  ship.vy = 0;
  lastAsteroidTime = 0;
  asteroidSpawnInterval = 2000;

  scoreElement.textContent = score;
  livesElement.textContent = lives;
  levelElement.textContent = level;
  gameOverElement.style.display = "none";
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

// Handle window resize
window.addEventListener("resize", () => {
  // Keep canvas size fixed for consistent gameplay
  canvas.width = 800;
  canvas.height = 600;
});
