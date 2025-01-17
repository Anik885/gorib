const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Helicopter settings
const helicopter = {
    x: 100,
    y: 200,
    width: 60,
    height: 40,
    velocity: 0,
    gravity: 0.2,
    lift: -5,
    isFlapping: false,
};

// Pipe settings
const pipeWidth = 60;
const pipeGap = 150;
let pipes = [];
let pipeSpeed = 2;

// Game variables
let score = 0;
let gameOver = false;

// Key listeners
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && !gameOver) {
        helicopter.velocity = helicopter.lift; // Flap the helicopter
    }
});

// Draw helicopter
function drawHelicopter() {
    ctx.fillStyle = 'green';
    ctx.fillRect(helicopter.x, helicopter.y, helicopter.width, helicopter.height);
}

// Draw pipes
function drawPipes() {
    ctx.fillStyle = 'brown';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
    });
}

// Update pipe positions
function updatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x <= canvas.width - 200) {
        const topPipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({
            x: canvas.width,
            top: topPipeHeight
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        // Remove pipes that are off-screen
        if (pipe.x + pipeWidth <= 0) {
            pipes.shift();
            score++;
        }
    });
}

// Detect collisions
function checkCollisions() {
    // Check for collision with the pipes
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        if (helicopter.x + helicopter.width > pipe.x && helicopter.x < pipe.x + pipeWidth) {
            if (helicopter.y < pipe.top || helicopter.y + helicopter.height > pipe.top + pipeGap) {
                gameOver = true;
            }
        }
    }

    // Check for collision with the ground or the sky
    if (helicopter.y <= 0 || helicopter.y + helicopter.height >= canvas.height) {
        gameOver = true;
    }
}

// Update game objects
function updateHelicopter() {
    if (!gameOver) {
        helicopter.velocity += helicopter.gravity;
        helicopter.y += helicopter.velocity;

        if (helicopter.y < 0) helicopter.y = 0;
        if (helicopter.y + helicopter.height > canvas.height) helicopter.y = canvas.height - helicopter.height;
    }
}

// Draw the score
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 20, 30);
}

// Reset game
function resetGame() {
    helicopter.y = 200;
    helicopter.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        drawHelicopter();
        drawPipes();
        drawScore();
        updatePipes();
        checkCollisions();
        updateHelicopter();
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = 'black';
        ctx.font = '36px Arial';
        ctx.fillText('Game Over! Press Space to Restart', 150, canvas.height / 2);
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                resetGame();
                gameLoop();
            }
        });
    }
}

// Start the game loop
gameLoop();
