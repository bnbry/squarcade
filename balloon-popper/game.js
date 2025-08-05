// Game variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("gameOver");
const gameOverTextElement = document.getElementById("gameOverText");

let score = 0;
let gameRunning = true;
let balloons = [];
let lastBalloonTime = 0;
let balloonSpawnInterval = 1500; // milliseconds

// Balloon colors
const balloonColors = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Yellow
  "#DDA0DD", // Plum
  "#FFB347", // Orange
  "#98D8C8", // Mint
  "#F7DC6F", // Gold
  "#BB8FCE", // Purple
];

// Balloon class
class Balloon {
  constructor() {
    this.radius = Math.random() * 30 + 20; // 20-50px radius
    this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
    this.y = canvas.height + this.radius;
    this.speed = Math.random() * 2 + 1; // 1-3 pixels per frame
    this.color =
      balloonColors[Math.floor(Math.random() * balloonColors.length)];
    this.stringLength = Math.random() * 50 + 30; // 30-80px string
    this.popped = false;
    this.popAnimation = 0;
    this.particles = [];
  }

  update() {
    if (!this.popped) {
      this.y -= this.speed;
    } else {
      this.popAnimation += 0.1;
      // Create explosion particles
      if (this.particles.length < 10) {
        for (let i = 0; i < 3; i++) {
          this.particles.push({
            x: this.x + (Math.random() - 0.5) * 20,
            y: this.y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1,
          });
        }
      }

      // Update particles
      this.particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2; // gravity
        particle.life -= 0.02;
      });

      // Remove dead particles
      this.particles = this.particles.filter((particle) => particle.life > 0);
    }
  }

  draw() {
    if (!this.popped) {
      // Draw balloon string
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.radius);
      ctx.lineTo(this.x, this.y + this.radius + this.stringLength);
      ctx.stroke();

      // Draw balloon
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw balloon highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(
        this.x - this.radius * 0.3,
        this.y - this.radius * 0.3,
        this.radius * 0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw balloon knot
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(this.x, this.y + this.radius, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw explosion particles
      this.particles.forEach((particle) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.life})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  isClicked(mouseX, mouseY) {
    if (this.popped) return false;
    const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
    return distance <= this.radius;
  }

  isOffScreen() {
    return this.y + this.radius < 0;
  }
}

// Mouse click handler
canvas.addEventListener("click", (event) => {
  if (!gameRunning) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  balloons.forEach((balloon) => {
    if (balloon.isClicked(mouseX, mouseY) && !balloon.popped) {
      balloon.popped = true;
      score++;
      scoreElement.textContent = score;

      // Play pop sound effect (optional)
      playPopSound();

      // Check for game win
      if (score >= 25) {
        gameWin();
      }
    }
  });
});

// Sound effect function (optional)
function playPopSound() {
  // Create a simple pop sound using Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    50,
    audioContext.currentTime + 0.1
  );

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.1
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

// Game win function
function gameWin() {
  gameRunning = false;
  gameOverTextElement.textContent = "🎉 Congratulations! 🎉";
  gameOverElement.style.display = "block";
}

// Restart game function
function restartGame() {
  score = 0;
  scoreElement.textContent = score;
  balloons = [];
  gameRunning = true;
  lastBalloonTime = 0;
  gameOverElement.style.display = "none";
}

// Spawn new balloons
function spawnBalloon() {
  if (Date.now() - lastBalloonTime > balloonSpawnInterval) {
    balloons.push(new Balloon());
    lastBalloonTime = Date.now();

    // Gradually increase difficulty
    balloonSpawnInterval = Math.max(500, balloonSpawnInterval - 10);
  }
}

// Update game state
function update() {
  if (!gameRunning) return;

  spawnBalloon();

  // Update balloons
  balloons.forEach((balloon) => balloon.update());

  // Remove off-screen balloons
  balloons = balloons.filter(
    (balloon) =>
      !balloon.isOffScreen() &&
      (balloon.particles.length > 0 || !balloon.popped)
  );
}

// Draw game
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(135, 206, 250, 0.3)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw balloons
  balloons.forEach((balloon) => balloon.draw());

  // Draw score
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`Score: ${score}/25`, canvas.width / 2, 30);
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
