const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const imgPlayer = new Image();
imgPlayer.src = 'img/player.png';

const imgEnemy = new Image();
imgEnemy.src = 'img/enemy.png';

const imgHeart = new Image();
imgHeart.src = 'img/pixel_heart.png';

let score = 0;
let lives = 3;
let player = { x: canvas.width / 2 - 15, y: canvas.height - 40, width: 30, height: 20, speed: 5 };
let bullets = [];
let enemyBullets = [];
let enemies = [];
const bulletSpeed = 7;
const enemyBulletSpeed = 4;
const cols = 8;
const rows = 2;
const enemyWidth = 30;
const enemyHeight = 20;
const spacing = 20;

// Inicializar enemigos
function spawnEnemies() {
  enemies = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      enemies.push({
        x: col * (enemyWidth + spacing) + 40,
        y: row * (enemyHeight + spacing) + 30,
        width: enemyWidth,
        height: enemyHeight,
        row: row,
        col: col
      });
    }
  }
}

// Dibujar jugador
function drawPlayer() {
  ctx.drawImage(imgPlayer, player.x, player.y, player.width, player.height);
}


// Dibujar enemigos
function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.drawImage(imgEnemy, enemy.x, enemy.y, enemy.width, enemy.height);
  });
}


// Dibujar vidas
function drawLives() {
  const livesDiv = document.getElementById('lives');
  livesDiv.innerHTML = 'Vidas: ';
  for (let i = 0; i < lives; i++) {
    livesDiv.innerHTML += `<img src=\"img/pixel_heart.png\" width=\"20\" height=\"20\" style=\"margin: 0 2px; vertical-align: middle;\">`;
  }
}


// Dibujar y manejar balas del jugador
function drawBullets() {
  ctx.fillStyle = 'red';
  bullets.forEach((bullet, bIndex) => {
    bullet.y -= bulletSpeed;
    if (bullet.y < 0) bullets.splice(bIndex, 1);

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

// Dibujar y manejar balas de enemigos
function drawEnemyBullets() {
  ctx.fillStyle = 'yellow';
  enemyBullets.forEach((bullet, i) => {
    bullet.y += enemyBulletSpeed;
    if (bullet.y > canvas.height) enemyBullets.splice(i, 1);

    // Colisión con el jugador
    if (
      bullet.x < player.x + player.width &&
      bullet.x + 4 > player.x &&
      bullet.y < player.y + player.height &&
      bullet.y + 10 > player.y
    ) {
      enemyBullets.splice(i, 1);
      lives--;
      drawLives();
      if (lives <= 0) {
        setTimeout(() => {
          alert('Game Over\\nPuntaje: ' + score);
          resetGame();
        }, 100);
      }
    }

    ctx.fillRect(bullet.x, bullet.y, 4, 10);
  });
}

// Disparo enemigo aleatorio de la primera línea visible
function enemyShoot() {
  let frontLineEnemies = {};
  enemies.forEach(e => {
    if (!frontLineEnemies[e.col] || e.row > frontLineEnemies[e.col].row) {
      frontLineEnemies[e.col] = e;
    }
  });

  const shooters = Object.values(frontLineEnemies);
  if (shooters.length > 0) {
    let shooter = shooters[Math.floor(Math.random() * shooters.length)];
    enemyBullets.push({ x: shooter.x + shooter.width / 2 - 2, y: shooter.y + shooter.height });
  }
}

// Actualizar puntaje
function updateScore() {
  document.getElementById('score').textContent = 'Puntaje: ' + score;
}

// Disparar jugador
function shoot() {
  bullets.push({ x: player.x + player.width / 2 - 2, y: player.y });
}

// Redibujar todo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawEnemies();
  drawBullets();
  drawEnemyBullets();
  if (enemies.length === 0) spawnEnemies();
}

// Movimiento del jugador
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && player.x > 0) {
    player.x -= player.speed;
  } else if (e.key === 'ArrowRight' && player.x + player.width < canvas.width) {
    player.x += player.speed;
  } else if (e.key === ' ' || e.key === 'Spacebar') {
    shoot();
  }
});

// Bucle del juego
function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

// Reinicio del juego
function resetGame() {
  score = 0;
  lives = 3;
  bullets = [];
  enemyBullets = [];
  spawnEnemies();
  updateScore();
  drawLives();
}

spawnEnemies();
updateScore();
drawLives();
setInterval(enemyShoot, 1000); // disparos enemigos cada 1 seg
gameLoop();
