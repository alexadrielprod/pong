var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

var ballRadius = 10;
var color = getColor();
var color2 = getColor();
var color3 = getColor();

var paddleHeight = 15;
var paddleWidth = 100;
var paddlex = (canvas.width-paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 8;
var brickColumnCount = 20;
var brickWidth = 25;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 150;
var score = 0;
var lives = 5;

var bricks = [];

for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 1}
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

document.addEventListener('touchstart', touchHandler, false);
document.addEventListener('touchmove', touchMoveHandler, false);
document.addEventListener('touchend', touchHandler, false);

function mouseMoveHandler(i) {
    var relativex = i.clientX - canvas.offsetLeft;
    if (relativex > 0 && relativex < canvas.width) {
        paddlex = relativex - paddleWidth/2;
    }
}

function keyDownHandler(i) {
    if (i.key == "ArrowRight" || i.key == "Right") {
        rightPressed = true;
    }
    else if (i.key == "ArrowLeft" || i.key == "Left") {
        leftPressed = true;
    }
}
function keyUpHandler(i) {
    if (i.key == "ArrowRight" || i.key == "Right") {
        rightPressed = false;
    }
    else if (i.key == "ArrowLeft" || i.key == "Left") {
        leftPressed = false;
    }
}

function touchHandler(e) {

    const relativeX = e.changedTouches[0].pageX - canvas.offsetLeft;  

    // Check that cursor is on the canvas
    if(relativeX > 0 && relativeX < canvas.width) {
        paddlex = relativeX - paddleWidth / 2; 
    } 

}

function touchMoveHandler(e) {

    const relativeX = e.targetTouches[0].pageX - canvas.offsetLeft;  

    // Check that cursor is on the canvas
    if(relativeX > 0 && relativeX < canvas.width) {
        paddlex = relativeX - paddleWidth / 2; 
    }

}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                dy = -dy;
                b.status = 0;
                color = getColor();
                score++;
                if (score == brickRowCount*brickColumnCount) {
                    alert("You win douchebag, now go get a life and stop playing shitty javascript games.");
                    document.location.reload();
                    
                }
            }
            }
        }
    }
}

function getColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
    color = color + letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddlex, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = color2;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
            var brickx = (c * (brickWidth+brickPadding)) + brickOffsetLeft;
            var bricky = (r * (brickHeight+brickPadding)) + brickOffsetTop;
            bricks[c][r].x = brickx;
            bricks[c][r].y = bricky;
            ctx.beginPath();
            ctx.rect(brickx, bricky, brickWidth, brickHeight);
            ctx.fillStyle = color3;
            ctx.fill();
            ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "24px Comic Sans MS";
    ctx.fillStyle = "rgba(0, 125, 175, 0.8)";
    ctx.fillText("Score: " + score, 10, 25);
}

function drawLives() {
    ctx.font = "24px Comic Sans";
    ctx.fillStyle = "rgba(0, 125, 175, 0.8)"
    ctx.fillText("Lives: " + lives, canvas.width-100, 25);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = 0-dx;
        color = getColor();
    }
    if (y + dy < ballRadius) {
        dy = 0-dy;
        color = getColor();
    }
    else if (y + dy > canvas.height-ballRadius-(paddleHeight/2)) {
        if (x > paddlex && x < paddlex+paddleWidth) {
            dy = -dy * 1.05;
            color = getColor();
            color2 = getColor();
        }
        else {
            lives--;
            if (!lives) {
            alert("GAME OVER you STUPID FUCKING BIIIIIIIIIIIIIIIIIIITTTTTTTTTTCHHHHHHH. haha");
            document.location.reload();
            
            }
            else {
                alert(lives+" LIVES REMAINING")
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddlex = (canvas.width-paddleWidth)/2;
            }
        }
    }


    if(rightPressed) {
        paddlex = paddlex + 5;
        if (paddlex + paddleWidth > canvas.width) {
            paddlex = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed) {
        paddlex = paddlex - 5;
        if (paddlex < 0) {
            paddlex = 0;
        }
    }
    
    x = x + dx;
    y = y + dy;
    requestAnimationFrame(draw);

}

draw();
