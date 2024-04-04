// Define variables
let canvas, ctx;
let snake, food;
let score = 0;
let gameInterval;
const foodItemsArray = [
    "🐁", "🍇","🍉", "🍈", "🍓", "🍍","🍌","🥝","🍏","🍎","🍔", "🍅", "🥚",];
const gridSize = 20;
const losePhrases = ["Better Luck Next Time!", "Oops! Try Again!"];
const backgroundColor = 'blue';
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Function to create a grid of cells
function createGrid(rows, cols) {
    canvas.width = cols * gridSize;
    canvas.height = rows * gridSize;
// Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
// Draw grid lines
    ctx.beginPath();
    for (let i = 0; i <= cols; i++) {
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
    }
    for (let j = 0; j <= rows; j++) {
        ctx.moveTo(0, j * gridSize);
        ctx.lineTo(canvas.width, j * gridSize);
    }
    ctx.strokeStyle = 'red';
    ctx.stroke();
}
// Snake class
class Snake {
    constructor() {
        this.body = [
            { x: 40, y: 40 }, // Head
            { x: 20, y: 40 }, // Body
            { x: 0, y: 40 }   // Tail
        ];
        this.dx = gridSize;
        this.dy = 0;
    }

    move() {
        const newHead = {
            x: this.body[0].x + this.dx,
            y: this.body[0].y + this.dy
        };
        this.body.unshift(newHead);
        if (this.eat(food)) {
            score++;
            food.randomizePosition();
        } else {
            this.body.pop();
        }
    }
   draw() {
        // Draw each segment of the snake
        this.body.forEach((segment) => {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        });
    }
    
    eat(food) {
        return this.body[0].x === food.position.x && this.body[0].y === food.position.y;
    }

    checkCollision() {
        const head = this.body[0];
        return (
            head.x < 0 ||
            head.x >= canvas.width ||
            head.y < 0 ||
            head.y >= canvas.height ||
            this.body.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    changeDirection(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }
}
// Food class
class Food {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.randomizePosition();
    }

    randomizePosition() {
        const rows = Math.floor(canvas.height / gridSize);
        const cols = Math.floor(canvas.width / gridSize);
        this.position.x = getRandomInt(0, cols - 1) * gridSize;
        this.position.y = getRandomInt(0, rows - 1) * gridSize;
        this.currentFoodItem = foodItemsArray[Math.floor(Math.random() * foodItemsArray.length)];
    }

    draw() {
        ctx.font = "20px Arial";
        ctx.fillStyle = 'red';
        ctx.fillText(this.currentFoodItem, this.position.x, this.position.y);
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.querySelector('.game-board');
    ctx = canvas.getContext('2d');
    createGrid(canvas.height / gridSize, canvas.width / gridSize);
    snake = new Snake();
    food = new Food();
// Start game loop
    gameInterval = setInterval(gameLoop, 100);
    document.addEventListener('keydown', handleKeyDown);
});

// Game loop function
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    snake.move();
    snake.draw();
    food.draw();
    updateScore();
    if (snake.checkCollision()) {
        endGame();
    }
}
function updateScore() {
    document.getElementById('score').textContent = score;
}
const gameOverSound = document.getElementById('game-over-sound');
function playGameOverSound() {
    gameOverSound.play();
}
// Function to end the game
function endGame() {
    clearInterval(gameInterval);
    displayGameOverScreen();
    playGameOverSound();
}
// Function to display game over screen
function displayGameOverScreen() {
    const gameOverScreen = document.querySelector('.game-over-screen');
    gameOverScreen.style.display = 'block';
    function getRandomPhrase(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    const message = document.getElementById('message');
    message.textContent = "Game Over! " + getRandomPhrase(losePhrases);
}
// Event listener for arrow key controls
function handleKeyDown(event) {
    const keyPressed = event.key;
    let dx = 0, dy = 0;
    switch (keyPressed) {
        case 'ArrowUp':
            dy = -gridSize;
            break;
        case 'ArrowDown':
            dy = gridSize;
            break;
        case 'ArrowLeft':
            dx = -gridSize;
            break;
        case 'ArrowRight':
            dx = gridSize;
            break;
    }

    // Prevent the snake from reversing
    if ((dx !== 0 && dx !== -snake.dx) || (dy !== 0 && dy !== -snake.dy)) {
        snake.changeDirection(dx, dy);
    }
}
let isMusicOn = true;
const backgroundMusic = document.getElementById('background-audio');
const musicToggleButton = document.getElementById('music-toggle-btn');
musicToggleButton.addEventListener('click', () => {
    isMusicOn = !isMusicOn;
    const musicIcon = document.getElementById('music-icon');
    musicIcon.src = isMusicOn ? 'assets/speaker.png' : 'assets/no-sound.png';
    if (isMusicOn) {
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
});
const playButton = document.getElementById('play-btn');
const pauseButton = document.getElementById('pause-btn');
// Initialize a variable to track the game state
let isGameRunning = true;
playButton.addEventListener('click', () => {
    if (!isGameRunning) {
        gameInterval = setInterval(gameLoop, 100);
        isGameRunning = true;
    }
});
// Add event listener to the pause button
pauseButton.addEventListener('click', () => {
    clearInterval(gameInterval);
    isGameRunning = false;
});
document.getElementById('play-again-btn').addEventListener('click', () => {
    window.location.href ='index.html';
});
