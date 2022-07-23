let domElements = {
    startGameAreaRef: document.querySelector("body > div.infoDashboard > div"),
    textLineFirstRef: document.querySelector('.line-first'),
    textLineSecondRef: document.querySelector('.line-second'),
    textLineThirdRef: document.querySelector('.line-third'),
    infoWrapperRef: document.querySelector('.infoDashboard'),
    canvasRef: document.querySelector('#canvas'),
    scoreRef: document.querySelector('.score'),
    chooseSpeedOptionsRef: document.querySelector('body > div.additionalOptions > div.dropdown'),
    currentSpeedRef: document.querySelector('body > div.additionalOptions > div.current-speed > a'),
    goThroughWallCheckBoxsRef: document.querySelector("#walls")
}

domElements.chooseSpeedOptionsRef.addEventListener('click', checkSpeedChoice);

const foodImage = new Image();
foodImage.src = "images/modifiedApple.png";
const eatAnAplleSound = new Audio();
eatAnAplleSound.src = "sounds/eatAnApple.mp3";
const gameOverSound = new Audio();
gameOverSound.src = "sounds/gameOver.mp3"

let Directions = {
    up: 1,
    down: 2,
    left: 3,
    right: 4
}

let GameState =
{
    Start: 1,
    Playing: 2,
    GameOver: 3
}
let SpeedOptions = {
    baseSpeedIndex: 120,
    speedType: {
        normal: "normal",
        fast: "fast",
        increasing: "increasing"
    }
}

let Game = {
    score: 0,
    speed: SpeedOptions.speedType.normal,
    context: undefined,
    state: GameState.Playing,
    blockSize: {
        width: 25,
        height: 25
    },
    food: undefined
}

let Snake = {
    headPosition: {
        x: 0,
        y: 0
    },
    direction: Directions.right,
    newDirection: undefined,
    body: []
}

window.onload = initializeGame;


function initializeGame(e) {
    Game.context = domElements.canvasRef.getContext('2d');
    Game.state = GameState.Start;

    //After click we will always be in state "Playing"
    domElements.startGameAreaRef.addEventListener('click', function () {

        if (Game.state !== GameState.Playing) {
            Game.state = GameState.Playing
            updateGameState();
            startGame();
        }
    });
}

function updateGameState(e) {
    switch (Game.state) {
        case (GameState.Start):
            //This will be shown on initially 
            domElements.infoWrapperRef.style.display = 'block';
            domElements.textLineFirstRef.textContent = 'START NEW GAME';
            domElements.textLineSecondRef.textContent = '';
            domElements.textLineThirdRef.textContent = '';
            break;

        //No info should be shown on the display
        case (GameState.Playing):
            domElements.infoWrapperRef.style.display = 'none';
            // startGame();
            break;

        //Unhide the div wrapper and show the final result/score
        case (GameState.GameOver):
            domElements.infoWrapperRef.style.display = 'block';
            domElements.textLineFirstRef.textContent = 'GAME OVER';
            domElements.textLineSecondRef.textContent = 'Your score: ' + Game.score;
            domElements.textLineThirdRef.textContent = 'Click here to start new game';
            gameOverSound.play();
            break;
    }
}

//Reset all the data and set the initial snake position
function startGame() {
    Game.score = 0;
    Game.food = undefined;
    Snake.headPosition = { x: 2, y: 1 }
    Snake.direction = Directions.right;
    Snake.body = [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }]

    let interval = window.setInterval(() => {
        makeMove();

        if (Game.state !== GameState.Playing) {
            window.clearInterval(interval);
            updateGameState();
        }
    }, setGameSpeed())
}

//After user's choice, we set the interval time accordingly
function setGameSpeed() {
    switch (Game.speed) {
        case SpeedOptions.speedType.normal: return SpeedOptions.baseSpeedIndex;
        case SpeedOptions.speedType.fast: return SpeedOptions.baseSpeedIndex * 0.70;
        case SpeedOptions.speedType.increasing: return SpeedOptions.baseSpeedIndex *= 0.98;
    }
}

//Check which of the 3 options *normal/fast/increasing* has been selected and adjust the game speed values
function checkSpeedChoice(e) {
    let choice = e.target.textContent;

    switch (choice.toLowerCase()) {
        case SpeedOptions.speedType.normal:
            Game.speed = SpeedOptions.speedType.normal;
            domElements.currentSpeedRef.textContent = Game.speed;
            break;
        case SpeedOptions.speedType.fast:
            Game.speed = SpeedOptions.speedType.fast;
            domElements.currentSpeedRef.textContent = Game.speed;
            break;
        case SpeedOptions.speedType.increasing:
            Game.speed = SpeedOptions.speedType.increasing;
            domElements.currentSpeedRef.textContent = Game.speed;
            break;
    }
}
function makeMove() {
    checkSnakeDirection();
    changeSnakePosition();
    checkIfSnakeDies();
    updateScore();
    clearCanvas();
    drawSnake();
    placeFood();
    drawFood();
    checkIfFoodWasEaten();
}

function checkSnakeDirection() {
    document.addEventListener('keydown', (e) => {

        if (Game.state === GameState.Playing) {
            //We make an additional check (for x / y) to make sure that the snake won't be able to change it's direction to 180°
            // debugger;
            if (e.code === "ArrowLeft" && Snake.direction !== Directions.right) {
                Snake.newDirection = Directions.left;
            } else if (e.code === "ArrowDown" && Snake.direction !== Directions.up) {
                Snake.newDirection = Directions.down;
            } else if (e.code === "ArrowRight" && Snake.direction !== Directions.left) {
                Snake.newDirection = Directions.right;
            } else if (e.code === "ArrowUp" && Snake.direction !== Directions.down) {
                Snake.newDirection = Directions.up;
            }
        }
    })
}

function changeSnakePosition() {
    if (Snake.newDirection) {
        Snake.direction = Snake.newDirection;

        //Once we've updated the next direction, we set it to undefined, waiting for new direction from the listener
        Snake.newDirection = undefined;
    }

    let sX = Snake.headPosition.x;
    let sY = Snake.headPosition.y;

    switch (Snake.direction) {
        case Directions.up: sY -= 1; break;
        case Directions.down: sY += 1; break;
        case Directions.left: sX -= 1; break;
        case Directions.right: sX += 1; break;
    }

    Snake.headPosition = {
        x: sX, y: sY
    }

    //We add new head block and remove one block from the tail
    Snake.body.push(Snake.headPosition);
    Snake.body.shift();
}

//We check both scenarios - hitting itself or going outside the game area.
function checkIfSnakeDies() {
    let sX = Snake.headPosition.x;
    let sY = Snake.headPosition.y;
    let isSnakeHeadOutsideTheGameArea = sX < 0 || sY < 0 || sX >= Game.blockSize.width - 2 || sY >= Game.blockSize.height - 2;

    //Check if the user has clicked on "Go through walls" option
    let canGoThroughWalls = domElements.goThroughWallCheckBoxsRef.checked === true;
    //The snake dies when hits a wall
    if (!canGoThroughWalls) {
        //if snake hits left wall / right wall / bottom / top
        if (isSnakeHeadOutsideTheGameArea) {
            Game.state = GameState.GameOver;
            return;
        }
    } else {
        //The snake is allowed to go through walls. In this case we should change the head position before next iteration
        if (isSnakeHeadOutsideTheGameArea) {
            changeSnakeHeadPosition(sX, sY);
            changeSnakePosition();
        }
    }

    //if the snake hits itself, it always dies 
    for (var i = 0; i < Snake.body.length - 1; i++) {

        let currentBlock = Snake.body[i];

        if (Snake.headPosition.x === currentBlock.x
            && Snake.headPosition.y === currentBlock.y) {

            Game.state = GameState.GameOver;
            return;
        }
    }

}

function updateScore() {
    domElements.scoreRef.textContent = 'Score: ' + Game.score;
}

function clearCanvas() {
    Game.context.clearRect(0, 0, 625, 625);
}

function drawSnake() {
    Game.context.fillStyle = 'black';

    let width = Game.blockSize.width + 1;
    let height = Game.blockSize.height + 1;

    for (let i = Snake.body.length - 1; i >= 0; i--) {

        let x = Snake.body[i].x * (width + 1);
        let y = Snake.body[i].y * (height + 1);

        Game.context.fillStyle = (i == Snake.body.length - 1) ? "darkgreen" : "white";
        Game.context.fillRect(x, y, width, height);

        //Like a border style for each of the snake blocks(body). Looks better :) 
        Game.context.strokeStyle = "darkblue";
        Game.context.strokeRect(x, y, width, height);
    }
}

function placeFood() {
    //We keep the loop until we find a free block on the game area where we can place the food.
    while (!Game.food) {

        let foodX = Math.floor(Math.random() * (Game.blockSize.width - 2));
        let foodY = Math.floor(Math.random() * (Game.blockSize.height - 2));

        let isFoodOnSnake = Snake.body.some(z => z.x === foodX && z.y === foodY)

        if (!isFoodOnSnake) {
            Game.food = {
                x: foodX,
                y: foodY
            }
        }
    }
}

function drawFood() {

    let width = Game.blockSize.width + 1;
    let height = Game.blockSize.height + 1;
    let x = Game.food.x * (width + 1);
    let y = Game.food.y * (height + 1);

    Game.context.drawImage(foodImage, x, y, width, height);
}

//If the snake hits an apple, we adjust the score and clear the food coordinates
function checkIfFoodWasEaten() {
    if (Snake.headPosition.x === Game.food.x
        && Snake.headPosition.y === Game.food.y) {

        Game.score += 1;
        Game.food = undefined;
        eatAnAplleSound.play();
        // duplicate block at tail of snake
        Snake.body.unshift(Snake.body[0]);
    }
}

function changeSnakeHeadPosition(sX, sY) {
    //hitting the left wall - the snake should appear on the right        
    if (sX < 0) {
        sX = Game.blockSize.width - 2;
        isSnakeHeadOutsideTheGameArea = true;
    }
    //hitting the right wall - the snake should appear on the left
    else if (sX >= Game.blockSize.width - 2) {
        sX = -1;
        isSnakeHeadOutsideTheGameArea = true;
    }
    //hitting the top - the snake should appear on the bottom
    else if (sY < 0) {
        sY = Game.blockSize.height - 2;
        isSnakeHeadOutsideTheGameArea = true;
    }
    /*hitting the bottom - the snake should appear on the top. It cause a collision when switching directions right after passing a wall so we 
     set sX and sY to index -1 and call changeSnakePosition. */
    else if (sY >= Game.blockSize.height - 2) {
        sY = -1;
        isSnakeHeadOutsideTheGameArea = true;
    }
    Snake.headPosition = {
        x: sX,
        y: sY
    }
}
