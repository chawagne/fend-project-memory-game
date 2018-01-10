/*
Variables:
deck - array - A list of all cards in the deck
openList -  array - A list of opened cards.  Cards are considered opened if they have been flipped but are not yet matches.
noMatch - boolean - True if the opened cards don't match.
card1 - string - The first opened card.
card2 - string - The second opened card.
count - number - Total number of moves in a game.
score - number - Total number of matched cards.  8 is a winning condition.
visibleTimer - DOMNode - The displayed ingame timer.
stars - DOMNode Collection - Displayed number of stars.
timer - number - The time the game began.
deckTable - DOMNode Collection - Collection of all card DOMNodes
winnerStars - DOMNode Collection - Displayed stars on winner screen.
winnerStats - DOMNode - Displayed stats on winner screen.
playAgain - DOMNOde - Play again button.
gameStarted - boolean - True if the game has started
*/

let deck = ['bolt', 'bolt', 'diamond', 'diamond', 'paper-plane-o', 'paper-plane-o', 'anchor', 'anchor', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb', 'cube', 'cube'];
let openList = [];
let noMatch = false;
let card1 = null;
let card2 = null;
let count = 0;
let score = 0;
let visibleTimer = document.querySelector('.timer');
let stars = document.querySelectorAll('.stars i');
let timer = null;
let deckTable = document.querySelectorAll('.card');
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

// Adds click event to restart buttons
function createRestartButton() {
  let restartButton = document.querySelector('.restart')
  restartButton.addEventListener('click', restartGame);
  playAgain.addEventListener('click', restartGame);
}


//Adds click event to all cards.
function makeCardsClickable() {
  let cards = document.querySelectorAll('.card');
  cards.forEach(function(currentCard) {
    currentCard.addEventListener('click', function() {
      if (timer === null) {
        timer = performance.now();
        gameStarted = true;
        //If the game timer hasn't started, star it.
        updateTimerCheck(timer);
      }
      //When cards don't match, clicking flips both cards back over.
      if (noMatch === true) {
        card1.parentElement.classList.remove('miss');
        card2.parentElement.classList.remove('miss');
        noMatch = false;
        return;
      }
      //When the same card is clicked twice, nothing happens.
      if (currentCard.classList.contains('show')) {
        return;
      }
      flipCard(currentCard);
      openCard(currentCard);
    });
  });
}
//Updates the ingame timer every second.
function updateTimerCheck(timer){
  setTimeout(function(){
    let currentDisplayedTime = parseInt(document.querySelector('.timer').textContent);
    //Calculates game time and rounds down to the nearest second.
    let currentTime = Math.floor((performance.now()-timer)/1000);
    if((currentDisplayedTime !==  currentTime)&&(gameStarted === true)){
      document.querySelector('.timer').textContent=currentTime;
      updateTimerCheck(timer);
    }

  },1000);
}
//Makes a card flip.
function flipCard(currentCard) {
  currentCard.classList.toggle('show');
}

//Makes a card open.
function openCard(currentCard) {
  currentCard.classList.toggle('open');
  openList.push(currentCard);
  checkMatch(openList);

}
//Closes an open card.
function closeCard(card) {
  card.classList.toggle('open');
}

//Checks to see if two open cards are a match.  List is the list of open cards.
function checkMatch(list) {

  if (list.length === 2) {
    card1 = list[0].firstElementChild;
    card2 = list[1].firstElementChild;
    increaseCount(card1, card2);
    //See if cards don't match.
    if (card1.classList.value !== card2.classList.value) {
      isNotMatch(card1, card2, list);
    } else {
      isMatch(card1, card2);
    }
  }
}

//When cards don't match, display them as missed.  Close and flip each card.
function isNotMatch(card1, card2, list) {
  card1.parentElement.classList.add('miss');
  card2.parentElement.classList.add('miss');
  noMatch = true;
  closeCard(list[0]);
  flipCard(list[0]);
  closeCard(list[1]);
  flipCard(list[1]);
  //No more cards should be open.
  openList = [];
}

//When cards do match, display them as matched.
function isMatch(card1, card2) {
  card1.parentElement.classList.add('match');
  card2.parentElement.classList.add('match');
  //No more cards should be open.
  openList = [];
  //Score increases
  score += 1;
  //If score is 8, all cards match and the game ends.
  if (score === 8) {
    showWinner()
    gameStarted = false;
  }
}

//When two cards have been picked, the move counter is increased.
function increaseCount() {
  count += 1;
  let moves = document.querySelector('.moves')
  moves.textContent = count;
  //See if the rank changes.
  checkRank();
}

//Changes the number of stars if there have been too many moves.
function checkRank() {
  //14 moves is two stars.
  if (count === 14) {
    stars[2].classList.add('fa-star-o');
  }
  //18 moves is one star.
  if (count === 18) {
    stars[1].classList.add('fa-star-o');
  }
}

//Resets the game.  This reverts all variables back to thier default values, shuffles the deck, and resets the gameboard.
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
  score = 0;
  timer = null;
  let moves = document.querySelector('.moves')
  moves.textContent = count;
  deck = shuffle(deck);
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

//When a player wins, display a winner modal.
function showWinner() {
  stars.forEach(function(current, index) {
    let starClone = stars[index].cloneNode(true);
    winnerStars.appendChild(starClone);
  });
  //Calculates total game time.
  winnerStats.textContent = `${count} moves. ${((performance.now()-timer)/1000).toFixed(2)} seconds to complete.`
  playAgain.classList.toggle('show');
}
