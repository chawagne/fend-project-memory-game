//List of cards
let deck = ['bolt', 'bolt', 'diamond', 'diamond', 'paper-plane-o', 'paper-plane-o', 'anchor', 'anchor', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb', 'cube', 'cube'];
//Cards opened
let openList = [];
let noMatch = false;
//first opened card
let card1 = null;
//second opened card
let card2 = null;
//total moves
let count = 0;
//total successful moves; 8 is a win
let score = 0;
//ingame clock
let visibleTimer = document.querySelector('.timer');
let stars = document.querySelectorAll('.stars i');
let timer = null;
//list of all cards
let deckTable = document.querySelectorAll('.card');
//elements shown when the game ends
let winnerStars = document.querySelector('.large-stars');
let winnerStats = document.querySelector('.stats');
let playAgain = document.querySelector('.play-again');
let gameStarted = false;


restartGame();
makeCardsClickable();
createRestartButton();


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function createRestartButton() {
  let restartButton = document.querySelector('.restart')
  restartButton.addEventListener('click', restartGame);
  playAgain.addEventListener('click', restartGame);
}

function makeCardsClickable() {
  let cards = document.querySelectorAll('.card');
  cards.forEach(function(currentCard) {
    currentCard.addEventListener('click', function() {
      if (timer === null) {
        timer = performance.now();
        gameStarted = true;
        //Starting the game clock
        updateTimerCheck(timer);
        //
      }
      //Cards don't match
      if (noMatch === true) {
        card1.parentElement.classList.remove('miss');
        card2.parentElement.classList.remove('miss');
        noMatch = false;
        return;
      }
      //Handle where card already clicked
      if (currentCard.classList.contains('show')) {
        return;
      }
      flipCard(currentCard);
      openCard(currentCard);
    });
  });
}

function updateTimerCheck(timer){
  setTimeout(function(){
    let currentDisplayedTime = parseInt(document.querySelector('.timer').textContent);
    let currentTime = Math.floor((performance.now()-timer)/1000);
    console.log(`was ${currentDisplayedTime} is ${currentTime}`);
    if(currentDisplayedTime !==  currentTime){
      document.querySelector('.timer').textContent=currentTime;
    }

    if (gameStarted === true){
      updateTimerCheck(timer);
    }
  },1000);
}

function flipCard(currentCard) {
  currentCard.classList.toggle('show');
}


function openCard(currentCard) {
  currentCard.classList.toggle('open');
  openList.push(currentCard);
  checkMatch(openList, currentCard);

}

function closeCard(card) {
  card.classList.toggle('open');
}

function checkMatch(list, currentCard) {

  if (list.length === 2) {
    card1 = list[0].firstElementChild;
    card2 = list[1].firstElementChild;
    increaseCount(card1, card2);
    if (card1.classList.value !== card2.classList.value) {
      isNotMatch(card1, card2, list);
    } else {
      isMatch(card1, card2);
    }
  }
}

function isNotMatch(card1, card2, list) {
  card1.parentElement.classList.add('miss');
  card2.parentElement.classList.add('miss');
  noMatch = true;
  closeCard(list[0]);
  flipCard(list[0]);
  closeCard(list[1]);
  flipCard(list[1]);
  openList = [];
}

function isMatch(card1, card2) {
  card1.parentElement.classList.add('match');
  card2.parentElement.classList.add('match');
  openList = [];
  score += 1;
  if (score === 8) {
    showWinner()
    gameStarted = false;
  }
}

function increaseCount() {
  count += 1;
  let moves = document.querySelector('.moves')
  moves.textContent = count;
  checkRank();
}

function checkRank() {
  if (count === 14) {
    stars[2].classList.add('fa-star-o');
  }
  if (count === 18) {
    stars[1].classList.add('fa-star-o');
  }
}

function restartGame() {
  deck.forEach(function(current, index) {
    deckTable[index].className = 'card';
  });
  stars.forEach(function(current, index) {
    stars[index].className = 'fa fa-star';
  });
  openList = [];
  noMatch = false;
  card1 = null;
  card2 = null;
  count = 0;
  score = 7;
  timer = null;
  let moves = document.querySelector('.moves')
  moves.textContent = count;
  //deck = shuffle(deck);
  deckTable = document.querySelectorAll('.card');
  deck.forEach(function(current, index) {
    deckTable[index].firstElementChild.className = 'fa';
    deckTable[index].firstElementChild.classList.add(`fa-${current}`);
  });
  winnerStars.textContent = "";
  winnerStats.textContent = "";
  visibleTimer.textContent = "0";
  playAgain.classList = "winner play-again";
}

function showWinner() {
  stars.forEach(function(current, index) {
    let starClone = stars[index].cloneNode(true);
    winnerStars.appendChild(starClone);
  });
  winnerStats.textContent = `${count} moves. ${((performance.now()-timer)/1000).toFixed(2)} seconds to complete.`
  playAgain.classList.toggle('show');
}
