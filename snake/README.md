# 🐍 Snake Game

A classic Snake game implementation with modern graphics and smooth gameplay. Control a snake to eat apples and grow longer while avoiding walls and your own tail.

## 🎮 How to Play

1. **Objective**: Control the snake to eat red apples and grow longer
2. **Movement**: Use WASD keys or arrow keys to control the snake's direction
3. **Scoring**: Each apple eaten gives you 10 points
4. **Game Over**: The game ends if you hit a wall or collide with your own tail

## 🎯 Controls

- **W / ↑**: Move up
- **S / ↓**: Move down
- **A / ←**: Move left
- **D / →**: Move right
- **Space**: Pause/Resume game

## ✨ Features

- **Smooth Movement**: Fluid snake movement with responsive controls
- **Visual Effects**:
  - Gradient snake body that fades from head to tail
  - Animated snake head with directional eyes
  - Detailed apple graphics with stem and leaf
  - Subtle grid overlay
- **Game Mechanics**:
  - Snake grows longer when eating apples
  - Apples spawn randomly (never on snake)
  - Collision detection with walls and self
  - Score tracking with high score persistence
- **User Interface**:
  - Real-time score and length display
  - High score tracking (saved in localStorage)
  - Pause functionality
  - Game over screen with final stats
  - Modern, responsive design

## 🎨 Visual Design

- **Color Scheme**: Green snake on dark background with red apples
- **Styling**: Modern gradient backgrounds with glassmorphism effects
- **Animations**: Smooth transitions and hover effects
- **Typography**: Clean, readable fonts with proper contrast

## 🔧 Customization

The game is easily customizable by modifying the JavaScript constants:

```javascript
// Game constants (in game.js)
const GRID_SIZE = 20; // Size of each grid cell
const INITIAL_SNAKE_LENGTH = 3; // Starting length of snake
const GAME_SPEED = 150; // Milliseconds between moves (lower = faster)
```

### Color Customization

You can modify the colors by changing these values in the CSS and JavaScript:

- **Snake Head**: `#4ade80` (bright green)
- **Snake Body**: Gradient from `rgb(74, 255, 128)` to `rgb(74, 50, 128)`
- **Apple**: `#ef4444` (red)
- **Background**: Dark green gradient
- **UI Elements**: Green accent colors

## 🚀 Getting Started

1. Open `index.html` in a modern web browser
2. The game will start automatically
3. Use WASD or arrow keys to control the snake
4. Try to achieve the highest score possible!

## 🎯 Game Tips

- **Plan Ahead**: Think about your next few moves to avoid getting trapped
- **Use the Grid**: The subtle grid lines can help you navigate more precisely
- **Don't Rush**: Take your time, especially when the snake gets longer
- **Watch Your Tail**: The most common cause of game over is hitting your own tail

## 🔄 Game Loop

The game uses `requestAnimationFrame` for smooth 60fps rendering with a separate update loop that runs at a controlled speed (every 150ms by default) to ensure consistent gameplay regardless of frame rate.

## 📁 File Structure

```
snake/
├── index.html      # Main HTML file with styling
├── game.js         # Game logic and rendering
└── README.md       # This file
```

## 🎮 Browser Compatibility

- Modern browsers with ES6+ support
- Canvas API support required
- localStorage for high score persistence

## 🐛 Known Issues

- None currently reported

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the game!

---

**Enjoy playing Snake!** 🐍🍎
