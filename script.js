// Variable Declarations

roundsSelect = document.querySelector("#roundsSelect");
roundsSelectContainer = document.querySelector("#roundsSelectContainer");

errorMessagePara = document.querySelector("#errorMessagePara");

popup = document.querySelector("#popup");
closeButton = document.querySelector("#closeButton");

playButton = document.querySelector("#playButton");
nextRoundButton = document.querySelector("#nextRoundButton");
initButton = document.querySelector("#initButton");

gameControls = document.querySelectorAll(".gameControls");
userControls = document.querySelectorAll(".userControls");
computerControls = document.querySelectorAll(".computerControls");

roundID = document.querySelector("#roundID");
roundsSpan = roundID.querySelector("span");

countDown = document.querySelector("#countDown");

userScore = document.querySelector("#userScore");
userFireWork = document.querySelector("#userFireWork");

computerScore = document.querySelector("#computerScore");
computerFireWork = document.querySelector("#computerFireWork");

isGameStarted = false;
numberOfRounds = undefined;

currentRound = undefined;

isGameControlKeysEnabled = false;

LONG_DELAY = 1300;
DELAY = 1000;
SHORT_DELAY = 300;

init();
setUpKeyDownEvents();

/*
init():
Initializes the game state and UI elements.
Resets the scores, shows the rounds selection, and hides unnecessary elements.
Called when the page is loaded or when the game is reset.
*/

function init() {
  isGameStarted = false;
  userScore.innerText = "0";
  computerScore.innerText = "0";

  show([roundsSelectContainer, playButton]);
  hide([countDown, roundID, nextRoundButton, initButton]);

  roundsSelect.value = "5";
}

/*
startGame():
Validates the selected number of rounds.
Initiates the game by hiding the rounds selection and displaying the countdown.
Sets up the initial round and triggers the countdown.
*/

function startGame() {
  if (roundsSelect.value === "") {
    displayError("Choose number of rounds above");
    return;
  }
  numberOfRounds = +roundsSelect.value;
  isGameStarted = true;

  hide([roundsSelectContainer, playButton]);
  show([roundID, countDown]);

  currentRound = 1;
  resetCountDown();
  triggerCountDown();
}

/*
nextRound():
Initiates the next round by resetting the countdown and triggering it again.
Called after each round to proceed to the next one.
*/

function nextRound() {
  hide([nextRoundButton]);
  show([countDown]);

  resetCountDown();
  triggerCountDown();
}

/*
resetCountDown():
Resets the countdown to the initial state and applies a bounce animation.
*/

function resetCountDown() {
  countDown.innerText = "4";
  addClasses([countDown], ["animate-[bounce_1s_ease-in-out_infinite]"]);
}

/*
triggerCountDown():
Initiates the countdown sequence and enables game controls when the countdown reaches zero.
*/

function triggerCountDown() {
  if (+countDown.innerText > 1) {
    countDown.innerText = +countDown.innerText - 1;
    setTimeout(() => {
      triggerCountDown();
    }, DELAY);
  } else {
    countDown.innerText = "Go!!!";
    removeClasses([countDown], ["animate-[bounce_1s_ease-in-out_infinite]"]);

    enable(gameControls);
    isGameControlKeysEnabled = true;
  }
}

/*
select(userInput):
Handles the user's selection for each round.
Generates a random computer selection, compares results, updates scores, and triggers visual effects.
Prepares for the next round or ends the game if all rounds are completed.
*/

function select(userInput) {
  showSelection(userControls[userInput - 1]);

  let conputerInput = Math.floor(Math.random() * 3) + 1;

  showSelection(computerControls[conputerInput - 1]);

  disable(gameControls, SHORT_DELAY);
  isGameControlKeysEnabled = false;

  if (userInput === conputerInput) {
    countDown.innerText = "Draw!";
  } else if (
    (userInput === 1 && conputerInput === 3) ||
    (userInput === 2 && conputerInput === 1) ||
    (userInput === 3 && conputerInput === 2)
  ) {
    updateScore(userScore);
    show([userFireWork]);
    hide([userFireWork], DELAY);
  } else {
    updateScore(computerScore);
    show([computerFireWork]);
    hide([computerFireWork], DELAY);
  }

  if (currentRound < numberOfRounds) {
    prepareForNextRound();
  } else {
    gameOver();
    show([initButton]);
  }
}

/*
showSelection(control):
Highlights the selected control element with a temporary visual effect.
*/

function showSelection(control) {
  addClasses([control], ["bg-green-200", "border-green-600", "shadow-lg"]);
  setTimeout(() => {
    removeClasses([control], ["bg-green-200", "border-green-600", "shadow-lg"]);
  }, SHORT_DELAY);
}

/*
gameOver():
Displays the game-over message based on the final scores.
 */

function gameOver() {
  const userScoreValue = +this.userScore.innerText;
  const computerScoreValue = +this.computerScore.innerText;

  if (userScoreValue == computerScoreValue) {
    countDown.innerText = "Game over. It was a Draw!";
  } else if (userScoreValue > computerScoreValue) {
    countDown.innerText = "Game over. You Won!";
  } else {
    countDown.innerText = "Game over. You Lost!";
  }
}

/*
prepareForNextRound():
Prepares for the next round by updating the round number and showing the "Next Round" button.
*/

function prepareForNextRound() {
  setTimeout(() => {
    currentRound++;
    roundsSpan.innerText = currentRound;
    show([nextRoundButton]);
  }, DELAY);
}

function updateScore(element) {
  countDown.innerText = "";
  element.innerText = +element.innerText + 1;
}

function enable(elements, delay) {
  setTimeout(
    () => {
      elements.forEach((element) => {
        element.disabled = false;
      });
    },
    delay ? delay : 0
  );
}

function disable(elements, delay) {
  setTimeout(
    () => {
      elements.forEach((element) => {
        element.disabled = true;
      });
    },
    delay ? delay : 0
  );
}

function openPopup() {
  removeClasses([popup], ["hidden"]);
}

function closePopup() {
  addClasses([popup], ["hidden"]);
}

function addClasses(elements, classes) {
  elements.forEach((element) => {
    classes.forEach((className) => {
      element.classList.add(className);
    });
  });
}

function removeClasses(elements, classes) {
  elements.forEach((element) => {
    classes.forEach((className) => {
      element.classList.remove(className);
    });
  });
}

function hide(elements, delay) {
  setTimeout(
    () => {
      elements.forEach((element) => {
        element.classList.add("hidden");
      });
    },
    delay ? delay : 0
  );
}

function show(elements) {
  elements.forEach((element) => {
    element.classList.remove("hidden");
  });
}

function displayError(message) {
  errorMessagePara.innerText = message;
  setTimeout(() => {
    errorMessagePara.innerText = "";
  }, LONG_DELAY);
}

/*
setUpKeyDownEvents():
Sets up event listeners for keydown events, allowing user interaction with the game using keyboard keys.
*/

function setUpKeyDownEvents() {
  document.onkeydown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
    } else if (event.key === "Escape") {
      closePopup();
    } else if (event.key.toLowerCase() === "r" && isGameControlKeysEnabled) {
      select(1);
    } else if (event.key.toLowerCase() === "p" && isGameControlKeysEnabled) {
      select(2);
    } else if (event.key.toLowerCase() === "s" && isGameControlKeysEnabled) {
      select(3);
    } else if (event.key === " ") {
      if (!playButton.classList.contains("hidden")) {
        startGame();
      } else if (!nextRoundButton.classList.contains("hidden")) {
        nextRound();
      } else if (!initButton.classList.contains("hidden")) {
        init();
      }
    }
  };
}