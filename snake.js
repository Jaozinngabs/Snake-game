const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// unidade
const box = 32;

// cores
const foodColor = "red";
const snakeHeadColor = "green";
const snakeBodyColor = "white";
const bombColor = "yellow"; // Cor da bomba (fase 2)

// sons
let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// cobrinha
let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
};

// comida
let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
};

// bomba (só aparece na fase 2)
let bomb = {
    x: -100,
    y: -100
};

// variáveis
let score = 0;
let fase = 1; // fase inicial
let d;

document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT") {
        left.play();
        d = "LEFT";
    } else if (key == 38 && d != "DOWN") {
        up.play();
        d = "UP";
    } else if (key == 39 && d != "LEFT") {
        right.play();
        d = "RIGHT";
    } else if (key == 40 && d != "UP") {
        down.play();
        d = "DOWN";
    }
}

function draw() {
    ctx.clearRect(0, 0, cvs.width, cvs.height); // Limpa o canvas a cada frame

    // Desenha a cobrinha
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? snakeHeadColor : snakeBodyColor;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Desenha a comida (maçã)
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x, food.y, box, box);

    // Desenha a bomba (apenas na fase 2)
    if (fase >= 2) {
        ctx.fillStyle = bombColor;
        ctx.fillRect(bomb.x, bomb.y, box, box);
    }

    // Posição da cabeça
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Movimentação
    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // Se comer a comida
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        eat.play();

        // Criar nova comida
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        };

        // Mudar para a fase 2 depois de 5 maçãs
        if (score == 5 && fase == 1) {
            fase = 2;
            gerarBomba();
        }
    } else {
        // Remove o rabo
        snake.pop();
    }

    // Se colidir com a bomba, perde
    if (fase >= 2 && snakeX == bomb.x && snakeY == bomb.y) {
        gameOver();
    }

    // Nova cabeça
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Fim de jogo - bater na parede
    if (
        snakeX < box || snakeX > 17 * box ||
        snakeY < 3 * box || snakeY > 17 * box
    ) {
        gameOver();
    }

    snake.unshift(newHead);

    // Desenha o score
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score, 2 * box, 1.6 * box);

    // Desenha a fase
    ctx.font = "20px Arial";
    ctx.fillText("Fase: " + fase, 15 * box, 1.6 * box);
}

// Função para gerar a bomba na fase 2
function gerarBomba() {
    bomb = {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
    };
}

// Função para exibir tela de Game Over
function gameOver() {
    clearInterval(game);
    dead.play();
    document.getElementById("game-over-screen").style.display = "block";
}

// Função para reiniciar o jogo
function restartGame() {
    document.getElementById("game-over-screen").style.display = "none";
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    score = 0;
    fase = 1;
    food = {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
    };
    bomb = { x: -100, y: -100 };
    d = undefined;
    clearInterval(game);
    game = setInterval(draw, 150);
}

// Iniciar o jogo
let game = setInterval(draw, 150);
