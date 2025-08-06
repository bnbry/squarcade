// Game variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const lengthElement = document.getElementById("length");
const highScoreElement = document.getElementById("highScore");
const gameOverElement = document.getElementById("gameOver");
const gameOverTextElement = document.getElementById("gameOverText");
const finalScoreElement = document.getElementById("finalScore");
const finalLengthElement = document.getElementById("finalLength");

// Game constants
const GRID_SIZE = 20;
const GRID_WIDTH = canvas.width / GRID_SIZE;
const GRID_HEIGHT = canvas.height / GRID_SIZE;
const INITIAL_SNAKE_LENGTH = 3;
const GAME_SPEED = 150; // milliseconds between moves

// Game state
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameRunning = true;
let gamePaused = false;
let lastUpdateTime = 0;

// Snake properties
let snake = [];
let snakeDirection = { x: 1, y: 0 }; // Start moving right
let nextDirection = { x: 1, y: 0 };

// Apple properties
let apple = { x: 0, y: 0 };

// Initialize game
function initGame() {
  // Initialize snake
  snake = [];
  for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
    snake.push({
      x: Math.floor(GRID_WIDTH / 2) - i,
      y: Math.floor(GRID_HEIGHT / 2),
    });
  }

  // Set initial direction
  snakeDirection = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };

  // Spawn first apple
  spawnApple();

  // Reset score
  score = 0;
  updateUI();
}

// Spawn apple at random position
function spawnApple() {
  let newApple;
  do {
    newApple = {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT),
    };
  } while (
    snake.some(
      (segment) => segment.x === newApple.x && segment.y === newApple.y
    )
  );

  apple = newApple;
}

// Input handling
const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;

  // Handle direction changes
  switch (e.key.toLowerCase()) {
    case "w":
    case "arrowup":
      if (snakeDirection.y === 0) {
        nextDirection = { x: 0, y: -1 };
      }
      break;
    case "s":
    case "arrowdown":
      if (snakeDirection.y === 0) {
        nextDirection = { x: 0, y: 1 };
      }
      break;
    case "a":
    case "arrowleft":
      if (snakeDirection.x === 0) {
        nextDirection = { x: -1, y: 0 };
      }
      break;
    case "d":
    case "arrowright":
      if (snakeDirection.x === 0) {
        nextDirection = { x: 1, y: 0 };
      }
      break;
    case " ":
      e.preventDefault();
      togglePause();
      break;
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

// Toggle pause
function togglePause() {
  gamePaused = !gamePaused;
}

// Update snake position
function updateSnake() {
  // Update direction
  snakeDirection = nextDirection;

  // Calculate new head position
  const head = snake[0];
  const newHead = {
    x: head.x + snakeDirection.x,
    y: head.y + snakeDirection.y,
  };

  // Check for wall collision
  if (
    newHead.x < 0 ||
    newHead.x >= GRID_WIDTH ||
    newHead.y < 0 ||
    newHead.y >= GRID_HEIGHT
  ) {
    gameOver();
    return;
  }

  // Check for self collision
  if (
    snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
  ) {
    gameOver();
    return;
  }

  // Add new head
  snake.unshift(newHead);

  // Check for apple collision
  if (newHead.x === apple.x && newHead.y === apple.y) {
    // Eat apple
    score += 10;
    spawnApple();
    updateUI();
  } else {
    // Remove tail if no apple was eaten
    snake.pop();
  }
}

// Draw functions
function drawSnake() {
  snake.forEach((segment, index) => {
    const x = segment.x * GRID_SIZE;
    const y = segment.y * GRID_SIZE;

    if (index === 0) {
      // Draw head
      ctx.fillStyle = "#4ade80";
      ctx.strokeStyle = "#22c55e";
    } else {
      // Draw body
      const greenValue = Math.max(50, 255 - index * 10);
      ctx.fillStyle = `rgb(74, ${greenValue}, 128)`;
      ctx.strokeStyle = "#22c55e";
    }

    ctx.fillRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    ctx.strokeRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);

    // Draw eyes for head
    if (index === 0) {
      ctx.fillStyle = "#000";
      const eyeSize = 3;
      const eyeOffset = 5;

      // Position eyes based on direction
      let leftEyeX, leftEyeY, rightEyeX, rightEyeY;

      if (snakeDirection.x === 1) {
        // Right
        leftEyeX = x + GRID_SIZE - eyeOffset;
        leftEyeY = y + eyeOffset;
        rightEyeX = x + GRID_SIZE - eyeOffset;
        rightEyeY = y + GRID_SIZE - eyeOffset;
      } else if (snakeDirection.x === -1) {
        // Left
        leftEyeX = x + eyeOffset;
        leftEyeY = y + eyeOffset;
        rightEyeX = x + eyeOffset;
        rightEyeY = y + GRID_SIZE - eyeOffset;
      } else if (snakeDirection.y === -1) {
        // Up
        leftEyeX = x + eyeOffset;
        leftEyeY = y + eyeOffset;
        rightEyeX = x + GRID_SIZE - eyeOffset;
        rightEyeY = y + eyeOffset;
      } else {
        // Down
        leftEyeX = x + eyeOffset;
        leftEyeY = y + GRID_SIZE - eyeOffset;
        rightEyeX = x + GRID_SIZE - eyeOffset;
        rightEyeY = y + GRID_SIZE - eyeOffset;
      }

      ctx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize);
      ctx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize);
    }
  });
}

function drawApple() {
  const x = apple.x * GRID_SIZE;
  const y = apple.y * GRID_SIZE;

  // Draw apple body
  ctx.fillStyle = "#ef4444";
  ctx.strokeStyle = "#dc2626";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(
    x + GRID_SIZE / 2,
    y + GRID_SIZE / 2,
    GRID_SIZE / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.stroke();

  // Draw apple stem
  ctx.strokeStyle = "#8b4513";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + GRID_SIZE / 2, y + 2);
  ctx.lineTo(x + GRID_SIZE / 2 + 3, y - 2);
  ctx.stroke();

  // Draw apple leaf
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.ellipse(x + GRID_SIZE / 2 + 4, y - 1, 2, 1, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawGrid() {
  ctx.strokeStyle = "rgba(74, 222, 128, 0.1)";
  ctx.lineWidth = 1;

  // Draw vertical lines
  for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawUI() {
  // Draw pause indicator
  if (gamePaused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#4ade80";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);

    ctx.font = "24px Arial";
    ctx.fillText(
      "Press SPACE to resume",
      canvas.width / 2,
      canvas.height / 2 + 40
    );
  }
}

// Update UI elements
function updateUI() {
  scoreElement.textContent = score;
  lengthElement.textContent = snake.length;
  highScoreElement.textContent = highScore;
}

// Game over function
function gameOver() {
  gameRunning = false;

  // Update high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("snakeHighScore", highScore);
  }

  // Show game over screen
  finalScoreElement.textContent = score;
  finalLengthElement.textContent = snake.length;
  gameOverElement.style.display = "block";
}

// Restart game function
function restartGame() {
  gameRunning = true;
  gamePaused = false;
  gameOverElement.style.display = "none";
  initGame();
}

// Main game loop
function gameLoop(currentTime) {
  if (!gameRunning) return;

  // Clear canvas
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  drawGrid();

  if (!gamePaused) {
    // Update game logic
    if (currentTime - lastUpdateTime > GAME_SPEED) {
      updateSnake();
      lastUpdateTime = currentTime;
    }
  }

  // Draw game objects
  drawApple();
  drawSnake();
  drawUI();

  // Continue game loop
  requestAnimationFrame(gameLoop);
}

// Initialize and start game
initGame();
requestAnimationFrame(gameLoop);
