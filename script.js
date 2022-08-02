const breachesBlock = document.querySelector("#breachesBlock");
const ball = document.querySelector(".ball");
const breaker = document.querySelector(".breaker-body");

let isBallLaunched = false;
let isGameStarted = false;
let isGameOver = false;

let keysDown = {
    "ArrowRight": false,
    "ArrowLeft": false
};

let ballDirection = {
    "up": false,
    "down": false,
    "right": false,
    "left": false
};


let arrowKeys = Array.from(Object.keys(keysDown));

breachesBlock.onclick = function breachesBlockClick(event) {
    document.querySelector(".start-game").remove();
    breachesBlock.classList.remove("bg-red");
    breachesBlock.classList.add("width-100")
    generateBreaches(breachesBlock, 32);
    isGameStarted =  true;
    breachesBlock.onclick = null;
}

document.onkeydown = function (event) {
    if (event.code == "ArrowUp" && !isBallLaunched && isGameStarted) {
        isBallLaunched = true;
        ballDirection["up"] = ballDirection["right"] = true;

    }

    // if(isArrowKey(event.code))
        keysDown[event.code] = true;
}

document.onkeyup = function (event) {
    
    // if(isArrowKey(event.code))
        keysDown[event.code] = false;
}

window.onload = function () {
    ball.style.top = ball.getBoundingClientRect().top;
    ball.style.left = ball.getBoundingClientRect().left;
    ball.style.position = "absolute";

    breaker.style.top = breaker.getBoundingClientRect().top;
    breaker.style.left = breaker.getBoundingClientRect().left;
    breaker.style.position = "absolute";
}


function breakerMove() {

    if (!isGameOver) {
        const game = document.querySelector(".game");
        if (keysDown["ArrowLeft"]) {

            if (breaker.getBoundingClientRect().left <= game.getBoundingClientRect().left + 10) {
                return;
            }

            if (!isBallLaunched) {
                ball.style.left = ball.getBoundingClientRect().left - 3 + 'px';
            }
            breaker.style.left = breaker.getBoundingClientRect().left - 3 + 'px';
        }

        if (keysDown["ArrowRight"]) {
            if (breaker.getBoundingClientRect().right >= game.getBoundingClientRect().right - 10) {
                return;
            }
            if (!isBallLaunched) {
                ball.style.left = ball.getBoundingClientRect().left + 3 + 'px';
            }
            breaker.style.left = breaker.getBoundingClientRect().left + 3 + 'px';
        }
    }

}

function ballMove() {


    if (isBallLaunched && !isGameOver) {
        let x, y;
        if (ballDirection["up"]) {
            y = -1;
        } else if (ballDirection["down"]) {
            y = 1;
        }

        if (ballDirection["left"]) {
            x = -1;
        } else if (ballDirection["right"]) {
            x = 1;
        }
        ball.style.top = ball.getBoundingClientRect().top + y + 'px';
        ball.style.left = ball.getBoundingClientRect().left + x + 'px';
        checkCollision();
    }
}


function checkCollision() {
    const { left: ballX, top: ballY } = ball.getBoundingClientRect();

    //Для левой и правой границ
    const gameField = document.querySelector(".game");
    if (gameField.getBoundingClientRect().left + 5 >= ballX || gameField.getBoundingClientRect().right - 5 <= ballX + ball.offsetWidth) {
        ballDirection['left'] = !ballDirection['left'];
        ballDirection['right'] = !ballDirection['right'];
        return;
    }

    //для верхней границы

    if (gameField.getBoundingClientRect().top + 5 >= ballY) {
        ballDirection["up"] = false;
        ballDirection["down"] = true;
        return;
    }

    //для нижней границы

    if (gameField.getBoundingClientRect().bottom - ball.offsetHeight <= ballY) {
        isGameOver = true;

        for (const key in ballDirection) {
            ballDirection[key] = false;
        }
        alert("Проигрыш")
        return;
    }

    //Для объектов
    let colliedObject;

    // при ударе об левую или правую стороны объекта

    if (ballDirection["left"]) {

        /*цикл нужен для того, чтобы убедиться, ударился ли мяч об правую сторону объекта. Практически такой же цикл сделан для всех остальных сторон.*/
        for (let y = ballY; y <= ballY + ball.offsetHeight; y++) {
            colliedObject = document.elementFromPoint(ballX - 2, y).closest(".breach");
            if (colliedObject)
                break;
        }
    }


    if (ballDirection["right"]) {
        for (let y = ballY; y <= ballY + ball.offsetHeight; y++) {
            colliedObject = document.elementFromPoint(ballX + ball.offsetWidth + 2, y).closest(".breach");
            if (colliedObject)
                break;
        }
    }

    if (colliedObject) {
        ballDirection['left'] = !ballDirection['left'];
        ballDirection['right'] = !ballDirection['right'];
        removeBrick(colliedObject);
        return;
    }

    // при ударе об нижнюю или верхнюю стороны объекта

    if (ballDirection["up"]) {

        for (let x = ballX; x <= ballX + ball.offsetWidth; x++) {
            colliedObject = document.elementFromPoint(x, ballY - 2).closest(".breach");
            if (colliedObject)
                break;

        }
    }
    if (ballDirection["down"]) {
        for (let x = ballX; x <= ballX + ball.offsetWidth; x++) {
            colliedObject = document.elementFromPoint(x, ballY + ball.offsetHeight + 2).closest(".breach");
            if (colliedObject)
                break;

            else {
                colliedObject = document.elementFromPoint(x, ballY + ball.offsetHeight).closest(".breaker-body");
                if (colliedObject)
                    break
            }
        }
    }


    if (colliedObject) {
        ballDirection['up'] = !ballDirection['up'];
        ballDirection['down'] = !ballDirection['down'];
        removeBrick(colliedObject)
        return;
    }



}

function removeBrick(brick) {
    if (brick.classList.contains("breach")) {
        brick.classList.add("breach-hidden");
        brick.classList.remove("breach");
        brick.style.backgroundColor = "unset";
        brick.innerHTML = '';
    }

    checkWin();
}

function checkWin() {
    isGameOver = document.getElementsByClassName("breach").length == 0;
    if(isGameOver)
        alert("Победа");
}



function generateBreaches(block, count) {
    for (let i = 1; i <= count; i++) {
        let breach = document.createElement("div");
        breach.className = "breach";
        breach.innerHTML = i;
        if ((i - 1) % 8 == 0 || i == 1) {
            breach.classList.add("ml-0");
        }
        breach.style.backgroundColor = getRandomColor();
        block.append(breach);
    }
}

function getRandomColor() {
    let resultColor = '';

    let letters = ['A', 'B', 'C', 'D', 'E', 'F'];

    let symbol;
    for (let i = 0; i < 6; i++) {

        let choice = Math.random();
        if (choice < 0.5) {
            let letterIndex = Math.round(Math.random() * 5);
            symbol = letters[letterIndex];
        }
        else {
            symbol = Math.ceil(Math.random() * 10) - 1;
        }

        resultColor += symbol;
    }
    return resultColor;
}

function isArrowKey(code){
    return arrowKeys.includes(code);
}

setInterval(breakerMove)
setInterval(ballMove);