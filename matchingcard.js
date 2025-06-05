console.log("JavaScript načítaný!");

const themes = {
  ratatoule: ["ratatoule1.png", "ratatoule2.png", "ratatoule3.png", "ratatoule4.png", "ratatoule5.png","ratatoule6.png", "ratatoule7.png","ratatoule8.png","ratatoule9.png", "ratatoule10.png", "ratatoule11.png", "ratatoule12.png", "ratatoule13.png","ratatoule14.png", "ratatoule15.png","ratatoule16.png"],
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
  console.log("Rendering board with cards:", cards);
  
  const board = document.getElementById("board");
  board.innerHTML = "";

  cards.forEach((imgName, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;

    const img = document.createElement("img");
    img.src = `images/${currentTheme}/${imgName}`;
    img.alt = "card";

    card.appendChild(img);
    card.addEventListener("click", () => flipCard(card, index));
    board.appendChild(card);
  });
}

function flipCard(card, index) {
  if (revealedCards.length >= 2 || card.classList.contains("revealed") || matchedCards.includes(index)) return;

  card.classList.add("revealed");
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
  board.children[i1].classList.remove("revealed");
  board.children[i2].classList.remove("revealed");
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  document.getElementById("current-player").textContent = currentPlayer;
}

function checkGameOver() {
  if (matchedCards.length === cards.length) {
    const winnerText = scores[0] > scores[1]
      ? "Vyhráva hráč 1!"
      : scores[1] > scores[0]
        ? "Vyhráva hráč 2!"
        : "Remíza!";
    document.getElementById("winner").textContent = winnerText;
  }
}

startGame();