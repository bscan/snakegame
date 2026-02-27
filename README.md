Play a classic snake game here: https://bscan.github.io/snakegame/ 

# Repo purpose

This repo was a test of agentic development and was built entirely in Github Copilot. Feel free to use it as an AI testing ground as well. 

If you file an issues, I can tag Claude or Copilot to work on them. 

# Snake Game

A classic browser-based snake game built with vanilla JavaScript, HTML5 Canvas, and CSS.

## Features

- 🎮 Classic snake gameplay
- 🍎 Eat pellets to grow longer
- 📊 Score tracking with high score persistence
- 💚 Smooth animations and visual effects
- 🎯 Collision detection (walls and self)
- ⌨️ Keyboard controls using arrow keys
- ⏸️ Pause and resume functionality

## How to Play

1. Open `index.html` in a modern web browser
2. Click "Start Game" or press Enter to begin
3. Use arrow keys to control the snake:
   - ⬆️ Arrow Up - Move up
   - ⬇️ Arrow Down - Move down
   - ⬅️ Arrow Left - Move left
   - ➡️ Arrow Right - Move right
4. Press Spacebar to pause/resume the game
5. Eat the red pellets to grow longer and increase your score
6. Avoid hitting the walls or your own tail
7. Try to beat your high score!

## Technologies Used

- HTML5 Canvas for rendering
- Vanilla JavaScript (no dependencies)
- CSS3 for styling
- LocalStorage for high score persistence

## Running Locally

Simply open the `index.html` file in any modern web browser. No build process or server required!

Alternatively, you can serve it with a local HTTP server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

## Game Controls

- **Arrow Keys**: Control snake direction
- **Spacebar**: Pause/Resume the game
- **Enter Key**: Start a new game (when not running)
- **On-screen Arrows**: Tap the touch controls on mobile devices
- **Start Game Button**: Begin a new game
- **Play Again Button**: Restart after game over

## License

See LICENSE file for details.
