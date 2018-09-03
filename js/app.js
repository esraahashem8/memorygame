//cards list
var cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];

var moves = 0;
var matchedCards = 0;
var gameStart = false;

// timer object
var timer = new Timer();
timer.start();
timer.addEventListener('secondsUpdated', function (e) {
    $('#timeCounter').html(timer.getTimeValues().toString());
});


function createCard(card) {
    $('#deck').append(`<li class="card animated"><i class="fa ${card}"></i></li>`);
}
// generate random cards using shuffle function
function generateCards() {
    for (var i = 0; i < 2; i++) {
        cards = shuffle(cards);
        cards.forEach(createCard);
    }
}
//intiating the game
function initGame() {
    generateCards();
    $('.card').click(toggleCard);
    $('#moves').html("0 Moves");
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length
        , temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
 

// Array to keep track of open cards
openCards = [];
// grab the reset button by ID
$('#reset-button').click(resetGame);

function incrementMoves() {
    moves += 1;
    $('#moves').html(`${moves} Moves`);
}


// card functionality by API jquery
function toggleCard() {
    
    // start the timer when the game start
    if (gameStart == false) {
        gameStart = true;
        timer.start();
    }
    
    if (openCards.length === 0) {
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        clickDisable(); //function to disable any 
    }
    else if (openCards.length === 1) {
        incrementMoves(); //incrementing the moves counter
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        setTimeout(matchOpenCards, 1000);
    }
}
// Disable click of the open Cards
function clickDisable() {
    openCards.forEach(function (card) {
        card.off('click');
    });
}
// enable click on the open card
function clickEnable() {
    openCards[0].click(toggleCard);
}
// check openCards if they match or not
function matchOpenCards() {
    if (openCards[0][0].firstChild.className == openCards[1][0].firstChild.className) { //matched
        console.log("matchCard");
        openCards[0].addClass("match").animateCss('pulse');
        openCards[1].addClass("match").animateCss('pulse');
        clickDisable();
		openCards = [];
        setTimeout(gameWin, 1000);
    }
    else { //no match
        openCards[0].toggleClass("show open").animateCss('flipInY');
        openCards[1].toggleClass("show open").animateCss('flipInY');
        clickEnable();
		openCards = [];
    }
}
// function to add animations
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(animationName).one(animationEnd, function () {
            $(this).removeClass(animationName);
        });
        return this;
    }
});

// check whether the game is finished or not 
function gameWin() {
    matchedCards += 1;
    if (matchedCards == 8) {
        resultGame();
    }
}

// win result of the finished game
function resultGame() { 
   $('#win-result').empty();
    timer.pause();
	//css
    var scoreBoard = ` 
        <p class="success"> Congrats, YOU WON the game (: !!! </p>
        <p>
            <span class="score-titles">Moves:</span>
            <span class="score-values">${moves}</span>
            <span class="score-titles">Time:</span>
            <span class="score-values">${timer.getTimeValues().toString()}</span>
        </p>
        <div class="text-center margin-top-2">
             <div class="star">
                <i class="fa fa-star fa-3x"></i>    
             </div>
             <div class="star">
                <i class="fa ${ (moves > 26) ? "fa-star-o" : "fa-star"}  fa-3x"></i>    
             </div>
            <div class="star">
                <i class="fa ${ (moves > 16) ? "fa-star-o" : "fa-star"} fa-3x"></i>    
             </div>
        </div>
        <div class="text-center margin-top-2" id="restart">
            <i class="fa fa-repeat fa-2x"></i>
          </div>
    `;
    $('#game-deck')[0].style.display = "none";
    $('#win-result')[0].style.display = "block";
    $('#win-result').append($(scoreBoard));
    $('#restart').click(resetGame);
}
// reset the game and start it again
function resetGame() {
    moves = 0;
    matchedCards = 0;
    $('#deck').empty();
    $('#stars').empty();
    $('#game-deck')[0].style.display = "";
    $('#win-result')[0].style.display = "none";
    gameStart=false;
    timer.stop();
    $('#timer').html("00:00:00");
	openCards = [];
	initGame();
}

initGame();
