
import { playLionAnimation } from './3dModelLoader.js';
import { stopLionAnimation } from './3dModelLoader.js';

console.log("JavaScript načítaný!");

const flipSound = new Audio('sounds/flip.mp3');

const themes = {
  ratatoule: [
    "ratatoule1.png", "ratatoule2.png", "ratatoule3.png",
    "ratatoule4.png", "ratatoule5.png", "ratatoule6.png",
    "ratatoule7.png", "ratatoule8.png", "ratatoule9.png",
    "ratatoule10.png", "ratatoule11.png", "ratatoule12.png",
    "ratatoule13.png", "ratatoule14.png", "ratatoule15.png",
    "ratatoule16.png"
  ],
  fruit: [
    "fruit1.png", "fruit2.png", "fruit3.png", "fruit4.png", "fruit5.png", "fruit6.png",
    "fruit7.png", "fruit8.png", "fruit9.png", "fruit10.png", "fruit11.png", "fruit12.png",
    "fruit13.png", "fruit14.png", "fruit15.png", "fruit16.png", "fruit17.png", "fruit18.png",
    "fruit19.png", "fruit20.png"],
  animals: [
    "animal1.png", "animal2.png", "animal3.png", "animal4.png", "animal5.png", "animal6.png",
    "animal7.png", "animal8.png", "animal9.png", "animal10.png", "animal11.png", "animal12.png",
    "animal13.png", "animal14.png", "animal15.png", "animal16.png", "animal17.png", "animal18.png",
    "animal19.png", "animal20.png",
  ],
  flag: [
    "flag1.png", "flag2.png", "flag3.png", "flag4.png", "flag5.png",
    "flag6.png", "flag7.png", "flag8.png", "flag9.png", "flag10.png",
    "flag11.png", "flag12.png", "flag13.png", "flag14.png", "flag15.png",
    "flag15.png",
  ]
};

let currentTheme = "";
let selectedImages = [];
let cards = [];
let revealedCards = [];
let matchedCards = [];
let currentPlayer = 1;
let scores = [0, 0];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function chooseRandomTheme() {
  const themeKeys = Object.keys(themes);
  currentTheme = shuffle(themeKeys)[0];
  return currentTheme;
}

function startGame() {
  document.getElementById("next-btn").classList.add("hidden");
  document.getElementById("new-game-btn").classList.remove("hidden");
  document.getElementById("feed-message").classList.add("hidden");
  document.getElementById("food-options").classList.add("hidden");
  document.getElementById("lion-reaction").classList.add("hidden");

  const winnerElement = document.getElementById("winner"); 
  winnerElement.textContent = "";
  winnerElement.classList.add("hidden"); 

  const theme = chooseRandomTheme();
  const allThemeImages = themes[theme];

  const pairsCount = 8;
  selectedImages = shuffle(allThemeImages).slice(0, pairsCount);
  cards = shuffle([...selectedImages, ...selectedImages]);

  revealedCards = [];
  matchedCards = [];
  currentPlayer = 1;
  scores = [0, 0];

  document.getElementById("score1").textContent = 0;
  document.getElementById("score2").textContent = 0;
  document.getElementById("current-player").textContent = currentPlayer;
  document.getElementById("winner").textContent = "";
  renderBoard();
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  console.log("current theme:", currentTheme)

  cards.forEach((imgName, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;

    const inner = document.createElement("div");
    inner.classList.add("card-inner");

    const front = document.createElement("div");
    front.classList.add("card-front");

    const back = document.createElement("div");
    back.classList.add("card-back");
    const img = document.createElement("img");
    img.src = `images/${currentTheme}/${imgName}`;
    img.alt = "card";
    back.appendChild(img);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener("click", () => flipCard(card, index));
    board.appendChild(card);
  });
}

function flipCard(card, index) {
  if (
    revealedCards.length >= 2 ||
    card.classList.contains("revealed") ||
    matchedCards.includes(index)
  ) return;

  flipSound.currentTime = 0;
  flipSound.play();

  card.classList.add("revealed");
  card.classList.add('animate__animated', 'animate__flipInY');
  card.addEventListener('animationend', () => {
    card.classList.remove('animate__animated', 'animate__flipInY');
  }, { once: true });
  revealedCards.push({ index, img: cards[index] });

  if (revealedCards.length === 2) {
    const [first, second] = revealedCards;
    if (first.img === second.img && first.index !== second.index) {
      matchedCards.push(first.index, second.index);
      scores[currentPlayer - 1]++;
      document.getElementById(`score${currentPlayer}`).textContent = scores[currentPlayer - 1];
      revealedCards = [];
      checkGameOver();
    } else {
      setTimeout(() => {
        hideCards(first.index, second.index);
        revealedCards = [];
        switchPlayer();
      }, 1000);
    }
  }
}

function hideCards(i1, i2) {
  const board = document.getElementById("board");
  const card1 = board.children[i1];
  const card2 = board.children[i2];
  
  card1.classList.add('animate__animated', 'animate__flipOutY');
  card2.classList.add('animate__animated', 'animate__flipOutY');
  
  card1.addEventListener('animationend', () => {
    card1.classList.remove("revealed", 'animate__animated', 'animate__flipOutY');
  }, { once: true });
  
  card2.addEventListener('animationend', () => {
    card2.classList.remove("revealed", 'animate__animated', 'animate__flipOutY');
  }, { once: true });
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  document.getElementById("current-player").textContent = currentPlayer;
}

function checkGameOver() {
  if (matchedCards.length === cards.length) {

     const winnerElement = document.getElementById("winner");

      winnerElement.className = "";  //resset all class before 
      winnerElement.classList.remove("hidden"); //show result

      if (scores[0] > scores[1]) {
      winnerElement.textContent = "Player 1 wins!";
      winnerElement.className = "winner winner-p1";
    } else if (scores[1] > scores[0]) {
      winnerElement.textContent = "Player 2 wins!";
      winnerElement.className = "winner winner-p2";
    } else {
      winnerElement.textContent = "It's a draw!";
      winnerElement.className = "winner winner-draw";
    }
    document.getElementById("feed-message").classList.remove("hidden");
    document.getElementById("food-options").classList.remove("hidden");

    // show next, hidden start
    document.getElementById("next-btn").classList.remove("hidden");
    document.getElementById("new-game-btn").classList.add("hidden");
  }
}

function playSound(file) {
  const audio = new Audio(`sounds/${file}`);
  audio.play();
}

import { init3DModel } from './3dModelLoader.js';
init3DModel();

window.addEventListener('DOMContentLoaded', () => {
  init3DModel();
  document.getElementById('new-game-btn').addEventListener('click', startGame);

  document.getElementById('next-btn').addEventListener('click', () => {
    document.getElementById('next-btn').classList.add('hidden');
    document.getElementById('lion-reaction').textContent = "";
    stopLionAnimation();
    startGame(); // <- start another round
  });

  startGame(); // <-first start
});


function playSoundForFood(feed) {
  const sounds = {
    water: 'wag.mp3',
    meat: 'roar.mp3',
    fish: 'fish.mp3',
    candy: 'candy.mp3',
    ball: 'ball.mp3',
    mouse: 'mouse.mp3'
  };

  const soundFile = sounds[feed] || 'default.mp3'; // Fallback 
  const audio = new Audio('sounds/' + soundFile);
  audio.play();
}

window.feedLion = function (feed) {
  const reaction = document.getElementById('lion-reaction');
  reaction.className = "reaction-box";

  if (feed === 'mouse') reaction.innerHTML = '<strong>The cat is as happy as two grapefruits!</strong>';
  else if (feed === 'meat') reaction.innerHTML = '<strong>The cat is strong like lion!</strong>';
  else if (feed === 'fish') reaction.innerHTML = '<strong>The cat loves fish, how did you know?</strong>';
  else if (feed === 'water') reaction.innerHTML = '<strong>The cat is as thirsty as a camel!</strong>';
  else if (feed === 'candy') reaction.innerHTML = '<strong>The cat is not a human, you eat it!</strong>';
  else if (feed === 'ball') reaction.innerHTML = '<strong>The cat wants a yarn of wool, what use is this to her?</strong>';

  playSoundForFood(feed);

  document.getElementById('feed-message').classList.add('hidden');
  document.getElementById('food-options').classList.add('hidden');
  document.getElementById('next-btn').classList.remove('hidden');

  playLionAnimation();

}

