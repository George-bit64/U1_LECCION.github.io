const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables del juego
let score = 0;
let player = { x: canvas.width / 2 - 15, y: canvas.height - 40, width: 30, height: 20, speed: 5 };
let bullets = [];
let bulletSpeed = 7;

// Dibujar jugador
function drawPlayer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Dibujar balas
function drawBullets() {
    ctx.fillStyle = 'red';
    bullets.forEach((bullet, index) => {
    bullet.y -= bulletSpeed;
    if (bullet.y < 0) bullets.splice(index, 1);
    ctx.fillRect(bullet.x, bullet.y, 4, 10);
    });
}

// Actualizar puntaje
function updateScore() {
    document.getElementById('score').textContent = 'Puntaje: ' + score;
}

// Dibujar todo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
}

// Control de teclas
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.x > 0) {
    player.x -= player.speed;
    } else if (e.key === 'ArrowRight' && player.x + player.width < canvas.width) {
    player.x += player.speed;
    }
});

// Disparo
function shoot() {
    bullets.push({ x: player.x + player.width / 2 - 2, y: player.y });
    score++;
    updateScore();
}

document.getElementById('fireButton').addEventListener('click', shoot);
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Spacebar') shoot();
});

// Bucle del juego
function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
