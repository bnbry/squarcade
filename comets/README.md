# ☄️ Comets - Arcade Game

A thrilling space arcade game where you control a ship dodging asteroids while leaving a destructive light trail in your wake!

## 🎮 Gameplay

- **Control your ship** using WASD or arrow keys
- **Dodge asteroids** falling from the top of the screen
- **Use your light trail** to destroy asteroids - the trail follows your ship and lasts for 2 seconds
- **Survive as long as possible** while racking up points
- **Level up** every 100 points for increased difficulty

## 🚀 Features

### Ship Controls

- **WASD** or **Arrow Keys**: Move the ship in any direction
- **Smooth movement** with momentum and friction physics
- **Screen wrapping** - ship appears on the opposite side when reaching screen edges
- **Visual direction** - ship rotates to face movement direction

### Light Trail System

- **2-second duration** - trail segments fade out over time
- **Physical obstacle** - trail can destroy asteroids on contact
- **Beautiful visual effect** - glowing cyan trail with gradient fade
- **Strategic gameplay** - use trail positioning to destroy asteroids

### Asteroid System

- **Random spawning** - asteroids appear from the top of the screen
- **Varied sizes** - different asteroid sizes give different point values
- **Realistic physics** - asteroids rotate and move with momentum
- **Increasing difficulty** - spawn rate increases as you progress

### Visual Effects

- **Particle explosions** - colorful particles when asteroids are destroyed
- **Star field background** - animated stars for immersive space atmosphere
- **Engine glow** - ship engine lights up when moving
- **Modern UI** - sleek design with glowing effects

## 🎯 Scoring System

- **Small asteroids** (20-30px): 2-3 points
- **Medium asteroids** (30-40px): 3-4 points
- **Large asteroids** (40-50px): 4-5 points
- **Level progression** every 100 points
- **Lives system** - start with 3 lives

## 🎨 Visual Design

- **Space theme** with dark background and cyan accents
- **Glowing effects** throughout the interface
- **Smooth animations** and particle systems
- **Modern UI** with backdrop blur and transparency

## 🎮 How to Play

1. **Open** `index.html` in a modern web browser
2. **Use WASD or arrow keys** to control your ship
3. **Dodge asteroids** falling from the top
4. **Use your light trail** strategically to destroy asteroids
5. **Survive as long as possible** and achieve the highest score!

## 🔧 Technical Details

- **Pure JavaScript** - no external dependencies
- **HTML5 Canvas** for rendering
- **60 FPS** smooth gameplay
- **Responsive design** with fixed canvas size
- **Cross-browser compatible**

## 🎯 Game Mechanics

### Collision Detection

- **Ship-Asteroid collisions** reduce lives
- **Trail-Asteroid collisions** destroy asteroids and award points
- **Precise hit detection** with radius-based collision

### Physics System

- **Momentum-based movement** for realistic feel
- **Friction and speed limits** for controlled gameplay
- **Gravity effects** on particles
- **Rotation physics** for asteroids

### Difficulty Progression

- **Increasing spawn rates** as you level up
- **Balanced challenge** that scales with player skill
- **Multiple difficulty factors** (speed, frequency, size)

## 🏆 Tips for High Scores

1. **Stay mobile** - constant movement makes you harder to hit
2. **Use your trail strategically** - position it to destroy multiple asteroids
3. **Watch for patterns** - asteroids spawn at regular intervals
4. **Manage screen space** - use the full canvas area
5. **Practice trail timing** - learn when to move to maximize trail effectiveness

## 🎨 Customization

The game is easily customizable by modifying the JavaScript constants:

- **Ship speed** and **max speed**
- **Asteroid spawn rates** and **sizes**
- **Trail duration** and **visual effects**
- **Scoring system** and **difficulty progression**

Enjoy the game and may the force be with you! 🚀
