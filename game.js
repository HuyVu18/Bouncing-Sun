let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

let soundtrack = new Audio('./audio/ProudOfYou.mp3');
let crash = new Audio('./audio/crash.wav');
// let lose = new Audio('./audio/lose.wav');
// let win = new Audio('./audio/win.wav');

let rightPressed = false;
let leftPressed = false;

let animationID;

let score = 0;
let lives = 3;

let bricks = [];
let brickColumn = 7;
let brickRow = 3;
for (let c = 0; c < brickColumn; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRow; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
    }
}
function keyUp(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = false;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false;
    }
}

class Ball {
    constructor(ballX, ballY, radius, bx, by) {
        this.ballX = ballX;
        this.ballY = ballY;
        this.radius = radius;
        this.bx = bx;
        this.by = by;
    }

    drawBall = function () {
        ctx.beginPath();
        ctx.arc(this.ballX, this.ballY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffdd00';
        ctx.fill();

        // let image = new Image();
        // image.src = "sun.png";
        // ctx.drawImage(image, this.ballX - 10, this.ballX - 10, this.radius*2, this.radius*2);
    }

    moveBall = function () {
        this.ballX += this.bx;
        this.ballY += this.by;
    }
}

class Paddle {
    constructor(paddleX, paddleY) {
        this.paddleWidth = 120;
        this.paddleHeight = 40;
        this.paddleX = paddleX - this.paddleWidth / 2;
        this.paddleY = paddleY;
    }

    drawPaddle = function () {        
        let image = new Image();
        image.src = "./image/airplane-removebg-preview.png";
        ctx.drawImage(image, this.paddleX, this.paddleY, this.paddleWidth, this.paddleHeight);

        // ctx.beginPath();
        // ctx.rect(this.paddleX, this.paddleY, this.paddleWidth, this.paddleHeight);
        // ctx.fillStyle = '#0095DD';
        // ctx.fill();
    }

    movePaddle = function () {
        if (rightPressed && paddle.paddleX < canvas.width - paddle.paddleWidth) {
            paddle.paddleX += 7;
        }
        else if (leftPressed && paddle.paddleX > 0) {
            paddle.paddleX -= 7;
        }
    }
}

class Bricks {
    constructor(brickWidth, brickHeight, brickPadding, brickTop, brickLeft) {
        this.brickWidth = brickWidth;
        this.brickHeight = brickHeight;
        this.brickPadding = brickPadding;
        this.brickTop = brickTop;
        this.brickLeft = brickLeft;
    }

    drawBricks = function () {
        for (let c = 0; c < brickColumn; c++) {
            for (let r = 0; r < brickRow; r++) {

                if (bricks[c][r].status == 1) {
                    let brickX = c * (this.brickWidth + this.brickPadding) + this.brickLeft;
                    let brickY = r * (this.brickHeight + this.brickPadding) + this.brickTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;

                    let image = new Image();
                    image.src = "./image/cloud-removebg-preview.png";
                    ctx.drawImage(image, brickX, brickY, this.brickWidth, this.brickHeight);

                    // ctx.beginPath();
                    // ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
                    // ctx.fillStyle = 'yellow';
                    // ctx.fill();
                }
            }
        }
    }
}

let ball = new Ball(canvas.width / 2, canvas.height - 50, 10, 4, -4);
let paddle = new Paddle(canvas.width / 2, canvas.height - 40);
let brick = new Bricks(80, 30, 30, 40, 40);

function drawScore() {
    ctx.font = '18px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('score: ' + score, 10, 24);
}

function drawLife() {
    ctx.font = '18px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('🤍 ' + lives, canvas.width - 56, 24);
}

function drawStart() {

    ctx.font = '22px Arial';
    ctx.fillStyle = '#9ad3e1';
    ctx.fillText('PRESS ENTER TO BEGIN✨', canvas.width / 2 - 130, canvas.height - 60);
}

function animation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationID = requestAnimationFrame(animation);

    drawScore();
    drawLife();

    brick.drawBricks();
    ball.drawBall();
    paddle.drawPaddle();

    ball.moveBall();
    paddle.movePaddle();

    // delete brick and win
    for (let c = 0; c < brickColumn; c++) {
        for (let r = 0; r < brickRow; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (ball.ballX + ball.radius > b.x &&
                    ball.ballX - ball.radius < b.x + brick.brickWidth &&
                    ball.ballY + ball.radius > b.y &&
                    ball.ballY - ball.radius < b.y + brick.brickHeight) {
                    crash.play();
                    ball.by = -ball.by;
                    b.status = 0;
                    score++;
                    if (score == brickColumn * brickRow) {
                        // win.play();
                        alert('YOU WIN!');
                        document.location.reload();
                        cancelAnimationFrame(animationID);
                    }
                }
            }
        }
    }

    // ball animation
    if (ball.ballX + ball.radius > canvas.width || ball.ballX - ball.radius < 0) {
        ball.bx = -ball.bx;
    }
    if (ball.ballY < ball.radius) {
        ball.by = -ball.by;
    } else if (ball.ballY + ball.radius >= canvas.height - paddle.paddleHeight) {
        if (ball.ballX > paddle.paddleX - ball.radius && ball.ballX < paddle.paddleX + paddle.paddleWidth + ball.radius) {
            ball.by = -ball.by;
        } else {
            lives--;
            if (lives < 1) {
                // lose.play();
                alert('GAME OVER!!! and Score: ' + score);
                document.location.reload();
                cancelAnimationFrame(animationID);
            } else {
                ball.ballX = canvas.width / 2;
                ball.ballY = canvas.height - 50;
                ball.bx = 6;
                ball.by = -6;
                paddle.paddleX = (canvas.width - paddle.paddleWidth) / 2;
            }
        }
    }
}
drawStart();
document.addEventListener('keydown', start);
function start(e) {
    if (e.key == 'Enter') {
        soundtrack.play();
        cancelAnimationFrame(animationID);
        animation();
    }
}
