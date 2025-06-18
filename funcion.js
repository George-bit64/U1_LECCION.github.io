const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let player = { x: canvas.width / 2 - 15, y: canvas.height - 40, width: 30, height: 20, speed: 5 };
let bullets = [];
let enemies = [];
const bulletSpeed = 7;
const cols = 5;
const rows = 2;
const enemyWidth = 30;
const enemyHeight = 20;
const spacing = 20;

// Crear enemigos iniciales
function spawnEnemies() {
  enemies = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      enemies.push({
        x: col * (enemyWidth + spacing) + 40,
        y: row * (enemyHeight + spacing) + 30,
        width: enemyWidth,
        height: enemyHeight
      });
    }
  }
}

// Dibujar jugador
function drawPlayer() {
  ctx.fillStyle = 'white';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Dibujar enemigos
function drawEnemies() {
  ctx.fillStyle = 'lime';
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// Dibujar y actualizar balas
function drawBullets() {
  ctx.fillStyle = 'red';
  bullets.forEach((bullet, bIndex) => {
    bullet.y -= bulletSpeed;
    if (bullet.y < 0) bullets.splice(bIndex, 1);

    // Detectar colisiones
    enemies.forEach((enemy, eIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + 4 > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + 10 > enemy.y
      ) {
        bullets.splice(bIndex, 1);
        enemies.splice(eIndex, 1);
        score += 10;
        updateScore();
      }
    });

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
  drawEnemies();
  drawBullets();

  if (enemies.length === 0) {
    spawnEnemies(); // volver a crear enemigos al eliminar todos
  }
}

// Controles de movimiento
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
}

document.getElementById('fireButton').addEventListener('click', shoot);
document.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Spacebar') shoot();
});

// Bucle principal
function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

spawnEnemies();
gameLoop();
