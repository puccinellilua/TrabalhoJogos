document.addEventListener("DOMContentLoaded", function() {
    const player = document.getElementById('player');
    const gameArea = document.getElementById('gameArea');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const scoreElement = document.getElementById('score');
    const recordElement = document.getElementById('record');
    const backgroundMusic = document.getElementById('backgroundMusic'); // Música de fundo

    let score = 0;
    let gameRunning = false;
    let obstacleInterval;
    let obstacles = [];

    // Sons
    const jumpSound = new Audio('jump.mp3');
    const gameOverSound = new Audio('gameOver.mp3');

    // Recuperar recorde do localStorage (se existir)
    let highScore = localStorage.getItem('highScore');
    if (!highScore) {
        highScore = 0; // Se não houver recorde salvo, definimos como 0
    }
    recordElement.textContent = `Recorde: ${highScore}`;

    // Função para iniciar o jogo
    function startGame() {
        score = 0;
        obstacles = [];
        scoreElement.textContent = `Pontuação: ${score}`;
        gameRunning = true;
        gameOverScreen.style.display = 'none';
        startBtn.disabled = true;
        gameArea.innerHTML = '';
        gameArea.appendChild(player);

        startObstacleGeneration();
        document.addEventListener('keydown', jump);

        // Iniciar música de fundo
        backgroundMusic.play(); // Tocar a música de fundo
    }

    // Função para gerar obstáculos
    function startObstacleGeneration() {
        obstacleInterval = setInterval(() => {
            const newObstacle = document.createElement('div');
            newObstacle.classList.add('obstacle');
            gameArea.appendChild(newObstacle);
            obstacles.push(newObstacle);

            // Ajusta a velocidade do obstáculo
            newObstacle.style.animationDuration = `${Math.random() * 2 + 2}s`;

        }, 2000); // Gera um obstáculo a cada 2 segundos
    }

    // Função para verificar colisão
    function checkCollision() {
        const playerRect = player.getBoundingClientRect();
        
        obstacles.forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();
            
            // Verifica se há sobreposição entre o jogador e o obstáculo
            if (
                playerRect.left < obstacleRect.right &&
                playerRect.right > obstacleRect.left &&
                playerRect.top < obstacleRect.bottom &&
                playerRect.bottom > obstacleRect.top
            ) {
                endGame(); // Game over imediato
            }
        });
    }

    // Função para finalizar o jogo
    function endGame() {
        gameRunning = false;
        clearInterval(obstacleInterval);
        gameOverScreen.style.display = 'block';
        gameOverSound.play(); // Tocar som de game over
        backgroundMusic.pause(); // Parar a música de fundo quando o jogo acabar

        // Salvar a pontuação final e verificar se é um novo recorde
        if (score > highScore) {
            highScore = score; // Atualiza o recorde
            localStorage.setItem('highScore', highScore); // Salva o novo recorde no localStorage
        }

        recordElement.textContent = `Recorde: ${highScore}`; // Exibir o recorde atualizado
    }

    // Função de pulo
    function jump(event) {
        if (gameRunning && event.key === 'ArrowUp') {
            player.style.transition = 'transform 0.2s';
            player.style.transform = 'translateY(-100px)';
            jumpSound.play();

            setTimeout(() => {
                player.style.transition = 'transform 0.2s';
                player.style.transform = 'translateY(0)';
            }, 200);
        }
    }

    // Função de reiniciar o jogo
    restartBtn.addEventListener('click', function() {
        gameOverScreen.style.display = 'none';
        startGame();
    });

    // Iniciar o jogo quando o botão de iniciar for clicado
    startBtn.addEventListener('click', startGame);

    // Aumenta a pontuação a cada 1 segundo
    setInterval(() => {
        if (gameRunning) {
            score++;
            scoreElement.textContent = `Pontuação: ${score}`;
            checkCollision(); // Verifica colisões a cada incremento de pontuação
        }
    }, 1000);
});
