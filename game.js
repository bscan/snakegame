// Game constants
const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;
const INITIAL_SNAKE_LENGTH = 3;
const GAME_SPEED = 150; // milliseconds

// Food progression: as the snake grows, it eats more substantial prey
const FOOD_PROGRESSION = [
    { minScore:  0, emoji: '🐛', name: 'Worm' },
    { minScore:  3, emoji: '🦗', name: 'Cricket' },
    { minScore:  6, emoji: '🐌', name: 'Snail' },
    { minScore:  9, emoji: '🐸', name: 'Frog' },
    { minScore: 12, emoji: '🐭', name: 'Mouse' },
    { minScore: 16, emoji: '🐀', name: 'Rat' },
    { minScore: 20, emoji: '🐇', name: 'Rabbit' },
    { minScore: 24, emoji: '🐦', name: 'Bird' },
    { minScore: 28, emoji: '🐟', name: 'Fish' },
    { minScore: 32, emoji: '🦎', name: 'Lizard' },
    { minScore: 36, emoji: '🐖', name: 'Pig' },
    { minScore: 40, emoji: '🦌', name: 'Deer' },
    { minScore: 44, emoji: '🐐', name: 'Goat' },
];

// Game state
let canvas;
let ctx;
let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let pellet = {};
let score = 0;
let highScore = 0;
let gameLoop;
let isGameRunning = false;
let isPaused = false;

// Return the current food item based on score
function getCurrentFood() {
    for (let i = FOOD_PROGRESSION.length - 1; i >= 0; i--) {
        if (score >= FOOD_PROGRESSION[i].minScore) {
            return FOOD_PROGRESSION[i];
        }
    }
    return FOOD_PROGRESSION[0];
}

// Update the food indicator in the UI
function updateFoodIndicator() {
    const food = getCurrentFood();
    const el = document.getElementById('currentFood');
    if (el) {
        el.textContent = food.emoji + ' ' + food.name;
    }
}

// Initialize the game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Load high score from localStorage
    highScore = localStorage.getItem('snakeHighScore') || 0;
    document.getElementById('highScore').textContent = highScore;
    
    // Add event listeners
    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);
    
    [
        { id: 'controlUp', direction: 'up' },
        { id: 'controlDown', direction: 'down' },
        { id: 'controlLeft', direction: 'left' },
        { id: 'controlRight', direction: 'right' }
    ].forEach(control => {
        const button = document.getElementById(control.id);
        if (button) {
            button.addEventListener('pointerdown', (event) => {
                event.preventDefault();
                handleDirectionInput(control.direction);
            });
        }
    });
    
    // Draw initial state
    drawGame();
}

// Start the game
function startGame() {
    resetGame();
    isPaused = false;
    isGameRunning = true;
    document.getElementById('startButton').disabled = true;
    document.getElementById('pauseIndicator').classList.add('hidden');
    gameLoop = setInterval(updateGame, GAME_SPEED);
}

// Reset game state
function resetGame() {
    // Initialize snake in the middle, moving right
    snake = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        snake.push({ x: Math.floor(GRID_SIZE / 2) - i, y: Math.floor(GRID_SIZE / 2) });
    }
    
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('gameOver').classList.add('hidden');
    updateFoodIndicator();
    
    generatePellet();
}

// Generate a new pellet
function generatePellet() {
    let validPosition = false;
    
    while (!validPosition) {
        pellet = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        
        // Check if pellet is not on snake
        validPosition = !snake.some(segment => segment.x === pellet.x && segment.y === pellet.y);
    }
}

// Handle direction updates from keyboard or touch controls
function handleDirectionInput(input) {
    if (!isGameRunning || isPaused) return;
    
    switch (input) {
        case 'up':
            if (direction.y === 0) {
                nextDirection = { x: 0, y: -1 };
            }
            break;
        case 'down':
            if (direction.y === 0) {
                nextDirection = { x: 0, y: 1 };
            }
            break;
        case 'left':
            if (direction.x === 0) {
                nextDirection = { x: -1, y: 0 };
            }
            break;
        case 'right':
            if (direction.x === 0) {
                nextDirection = { x: 1, y: 0 };
            }
            break;
    }
}

// Handle keyboard input
function handleKeyPress(e) {
    // Handle Enter key for starting/restarting game
    if (e.key === 'Enter' && !isGameRunning) {
        startGame();
        e.preventDefault();
        return;
    }

    // Handle spacebar for pause/resume
    if (e.key === ' ' && isGameRunning) {
        togglePause();
        e.preventDefault();
        return;
    }

    const keyDirectionMap = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
    };

    if (keyDirectionMap[e.key]) {
        e.preventDefault();
        handleDirectionInput(keyDirectionMap[e.key]);
    }
}

// Toggle pause state
function togglePause() {
    isPaused = !isPaused;
    
    if (isPaused) {
        clearInterval(gameLoop);
        document.getElementById('pauseIndicator').classList.remove('hidden');
    } else {
        gameLoop = setInterval(updateGame, GAME_SPEED);
        document.getElementById('pauseIndicator').classList.add('hidden');
    }
}

// Update game state
function updateGame() {
    // Update direction
    direction = nextDirection;
    
    // Calculate new head position
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;
    
    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameOver();
        return;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check pellet collision
    if (head.x === pellet.x && head.y === pellet.y) {
        score++;
        document.getElementById('score').textContent = score;
        updateFoodIndicator();
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            document.getElementById('highScore').textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        generatePellet();
    } else {
        // Remove tail if no pellet eaten
        snake.pop();
    }
    
    drawGame();
}

// Draw the game
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
        ctx.stroke();
    }
    
    // Draw pellet (food emoji matching current snake size)
    if (pellet.x !== undefined && pellet.y !== undefined) {
        const food = getCurrentFood();
        ctx.font = `${CELL_SIZE - 2}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            food.emoji,
            pellet.x * CELL_SIZE + CELL_SIZE / 2,
            pellet.y * CELL_SIZE + CELL_SIZE / 2
        );
    }
    
    // Draw snake
    if (snake.length > 0) {
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                ctx.fillStyle = '#2e7d32';
            } else {
                // Body
                ctx.fillStyle = '#4caf50';
            }
            
            ctx.fillRect(
                segment.x * CELL_SIZE + 1,
                segment.y * CELL_SIZE + 1,
                CELL_SIZE - 2,
                CELL_SIZE - 2
            );
            
            // Add eyes to head
            if (index === 0) {
                drawSnakeEyes(segment);
            }
        });
    }
}

// Draw snake eyes based on direction
function drawSnakeEyes(headSegment) {
    ctx.fillStyle = 'white';
    const eyeSize = 3;
    const eyeOffset = 5;
    const x = headSegment.x * CELL_SIZE;
    const y = headSegment.y * CELL_SIZE;
    
    if (direction.x === 1) { // Right
        ctx.fillRect(x + CELL_SIZE - eyeOffset, y + eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(x + CELL_SIZE - eyeOffset, y + CELL_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
    } else if (direction.x === -1) { // Left
        ctx.fillRect(x + eyeOffset - eyeSize, y + eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(x + eyeOffset - eyeSize, y + CELL_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
    } else if (direction.y === -1) { // Up
        ctx.fillRect(x + eyeOffset, y + eyeOffset - eyeSize, eyeSize, eyeSize);
        ctx.fillRect(x + CELL_SIZE - eyeOffset - eyeSize, y + eyeOffset - eyeSize, eyeSize, eyeSize);
    } else { // Down
        ctx.fillRect(x + eyeOffset, y + CELL_SIZE - eyeOffset, eyeSize, eyeSize);
        ctx.fillRect(x + CELL_SIZE - eyeOffset - eyeSize, y + CELL_SIZE - eyeOffset, eyeSize, eyeSize);
    }
}

// Game over
function gameOver() {
    isGameRunning = false;
    isPaused = false;
    clearInterval(gameLoop);
    document.getElementById('startButton').disabled = false;
    document.getElementById('pauseIndicator').classList.add('hidden');
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Restart the game
function restartGame() {
    startGame();
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
