// Declaring Strict Mode
"use strict";
//Declaration of principale variables
const gameScore = document.getElementById("score");
const instructions = document.getElementById("introduction");
const descriptResults = document.getElementById("results");
const winningMes = document.getElementById("win-message");
const losingMes = document.getElementById("los-message");

// Enemies our player must avoid
let Enemy = function(x, speed) {
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = "images/enemy-bug.png";
  this.x = this.developX();
  this.y = this.developY();
  this.speed = this.developSpeed();
};

// Check for collisions with player
Enemy.prototype.collidedPlayer = function() {
  return checkCollision(player, this);
};

// developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Math/random
Enemy.prototype.developX = function() {
  return Math.floor((Math.random() * 400) - 100);
};

Enemy.prototype.developY = function() {
  return (85 * (Math.floor(Math.random() * 3)) + 45);
};

Enemy.prototype.developSpeed = function() {
  return Math.floor((Math.random() * 180) + 120);
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.

  this.x = this.x + this.speed * dt;
  if (this.x > 500) {
    this.x = Math.floor((Math.random() * 150) - 250);
    this.speed = this.developSpeed();
    this.y = this.developY();
  }
  //check for collisions
  if (this.hasCollidedPlayer()) {
    updateAfterCollision();
    generateEnemies();
  }
};

Enemy.prototype.hasCollidedPlayer = function() {
  return player.x < this.x + 60 &&
    player.x + 60 > this.x &&
    player.y < this.y + 30 &&
    player.y + 40 > this.y;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Player object
let Player = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = "images/char-boy.png";
  this.initialX = 200;
  this.initialY = 400;
  this.x = this.initialX;
  this.y = this.initialY;
  this.initialLives = 5;
  this.lives = this.initialLives;
  this.score = 0;
  this.livesSprite = "images/char-boy.png";
};
// The player re/starting position
Player.prototype.restartPosition = function() {
  this.x = this.initialX;
  this.y = this.initialY;
};

Player.prototype.update = function() {
// Update the player image in the game
};
// Draw the player image in the game
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// The player can move left, right, up and down handling keys
Player.prototype.handleInput = function(key) {
  if (key === "right" && this.x < 350) {
    this.x = this.x + 101;
  } else if (key === "left" && this.x > 50) {
    this.x = this.x - 101;
  } else if (key === "down" && this.y < 350) {
    this.y = this.y + 85;
  } else if (key === "up" && this.y > 100) {
    this.y = this.y - 85;
  } else if (key === "up" && this.y < 100) {

    this.reachedEndLevel();
  }
};

// Once the player reaches the 12 level, a winning message will appear
Player.prototype.reachedEndLevel = function() {
    if (this.score === 11) {
    VisualizeWinningMes();
      restartGame();
    } else {
      nextLevel();
    }
};

// Increasing score and number enemies for every next level
let nextLevel = function() {
  numEnemies = numEnemies + 1;
  player.score = player.score + 1;
  gameScore.innerHTML = player.score;
  player.restartPosition();
  generateEnemies();
};

// Once the player collides with one enemy, the player loses one life and he moves back to the start square
Player.prototype.loseLife = function() {
  this.lives = this.lives - 1;
  renderSmallboy(player);
  this.restartPosition();
};

// Once the player collides with an enemy, and he loses all lives, the game is reset
let updateAfterCollision = function() {
  if (player.lives === 1) {
    VisualizeLosingMes();
    restartGame();
  } else {
    player.loseLife();
  }
};

// Visualize Winning message
let VisualizeWinningMes = function() {
  winningMes.style.display = 'block';
  descriptResults.style.display = 'none';
  canvas.style.display = 'none';
};

// Visualize losing message
let VisualizeLosingMes = function() {
  losingMes.style.display = 'block';
  descriptResults.style.display = 'none';
  canvas.style.display = 'none';
};

// Restart game
let restartGame = function() {
  numEnemies = startingEnemies;
  player.score = 0;
  gameScore.innerHTML = player.score;
  player.lives = player.initialLives;
  player.restartPosition();
  renderSmallboy(player);
  generateEnemies();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let player = new Player();

let allEnemies = [];
// the game will start with two enemies, low difficulty
let startingEnemies = 2;
// number of enemies increases over time
let numEnemies = startingEnemies;
let generateEnemies = function() {
  allEnemies.length = 0;
  for (let y = 0; y < numEnemies; y++) {
    let enemy = new Enemy();
    allEnemies.push(enemy);
  }
};

generateEnemies();

// developer.mozilla.org/en-US/docs/Web/API/Document/createElement
// Create lives/img-boy element
let renderSmallboy = function(elem) {
  let livesboy = document.getElementById('lives');
  livesboy.innerHTML = "";
  for (let y = 0; y < elem.lives; y++) {
    let smallboySprite = document.createElement('img');
    smallboySprite.height = 60;
    smallboySprite.width = 30;
    smallboySprite.src = "images/char-boy.png";

    livesboy.appendChild(smallboySprite);
  }
};

renderSmallboy(player);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  let allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

//Add event listeners to buttons start/restart game
let buttons = document.getElementsByClassName("start-button");
for (let y = 0; y < buttons.length; y++) {
  buttons[y].addEventListener('click', function(e) {
    e.preventDefault();
    winningMes.style.display = 'none';
    losingMes.style.display = 'none';
    instructions.style.display = 'none';
    descriptResults.style.display = 'block';
    canvas.style.display = 'inline';
  });
}
