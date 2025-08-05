# 🎈 Balloon Popper - Arcade Game

A fun and addictive HTML5 Canvas arcade game built with vanilla JavaScript. Pop colorful balloons as they rise across the screen and try to reach 25 points to win!

## 🎮 How to Play

1. **Objective**: Pop 25 balloons to win the game
2. **Controls**: Click on balloons to pop them
3. **Scoring**: Each popped balloon gives you 1 point
4. **Difficulty**: Balloons spawn faster as you progress, increasing the challenge

## ✨ Features

- **Colorful Balloons**: 10 different vibrant colors
- **Random Generation**: Balloons spawn at random positions with varying speeds
- **Visual Effects**:
  - Realistic balloon strings
  - Balloon highlights for depth
  - Explosion particles when balloons pop
  - Smooth animations
- **Sound Effects**: Pop sounds using Web Audio API
- **Progressive Difficulty**: Balloon spawn rate increases over time
- **Responsive Design**: Beautiful gradient background with modern UI
- **Game Over Screen**: Celebration screen when you reach 25 points

## 🚀 Getting Started

1. Open `index.html` in your web browser
2. Start clicking on balloons to pop them
3. Try to reach 25 points as quickly as possible!

## 🛠️ Technical Details

- **Pure JavaScript**: No external libraries or frameworks
- **HTML5 Canvas**: For smooth graphics and animations
- **Web Audio API**: For sound effects
- **CSS3**: Modern styling with gradients and animations
- **Responsive**: Works on desktop and mobile devices

## 🎨 Game Mechanics

- **Balloon Spawning**: New balloons appear every 1.5 seconds initially, decreasing to 0.5 seconds
- **Balloon Movement**: Balloons rise at speeds between 1-3 pixels per frame
- **Collision Detection**: Precise click detection for popping balloons
- **Particle System**: Explosion effects when balloons are popped
- **Memory Management**: Automatic cleanup of off-screen balloons and dead particles

## 📁 File Structure

```
balloon-popper/
├── index.html      # Main HTML file with game interface
├── game.js         # Game logic and mechanics
└── README.md       # This file
```

## 🎯 Future Enhancements

- High score tracking
- Different balloon types with different point values
- Power-ups and special effects
- Multiple difficulty levels
- Mobile touch optimization
- Background music

Enjoy popping balloons! 🎈💥
