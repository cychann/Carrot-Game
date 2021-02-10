'use strict';

const ITEM__SIZE = 80;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const timerIndicator = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');
const gameLeveltnControl = document.querySelectorAll('.levelControl')
const gameLevelBtn = document.querySelector('.game__level')
const gameFactor = document.querySelector('.game__factor')

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');
const refreshSound = new Audio('./sound/refreshSound.mp3');

let started = false;
let score = 0;
let timer = undefined;
let carrot__count;
let bug__count;
let fire__count;
let game__duration__sec;
let fireLeft = undefined;

field.addEventListener('click', onFieldClick);
gameLeveltnControl.forEach((levelBtn) => {
  levelBtn.addEventListener('click', (e) => {
    if(e.target.id !== 'stage') return;
    
    switch(e.target.dataset.level) {
      case '1':
        carrot__count = 10
        bug__count = 10
        fire__count = 0
        game__duration__sec = 10
        break
      case '2':
         carrot__count = 10
         bug__count = 10
         fire__count = 0
         game__duration__sec = 7
         break
      case '3':
        carrot__count = 15
        bug__count = 15
        fire__count = 0
        game__duration__sec = 10
        break
      case '4':
        carrot__count = 20
        bug__count = 20
        fire__count = 1
        game__duration__sec = 10
        break
      case '5':
        carrot__count = 20
        bug__count = 20
        fire__count = 2
        game__duration__sec = 10
        break
      case '6':
        carrot__count = 20
        bug__count = 20
        fire__count = 3
        game__duration__sec = 10
        break
    }
    gameScreen();
    startGame();
  })
})

gameBtn.addEventListener('click', () => {
  stopGame();
})

popUpRefresh.addEventListener('click', () => {
  resetGame()
  initScreen();
  hidePopUp();
  playSound(refreshSound)
});

function startGame() {
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
  // fireAutoMove();
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText('REPLAY❓');
  playSound(alertSound);
  stopSound(bgSound);
  resetGame();
}

function finishGame(win) {
  started = false;
  hideGameButton();
  if (win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopGameTimer();
  stopSound(bgSound);
  showPopUpWithText(win ? 'YOU WON 🎉' : 'YOU LOST 💩');
}

function initScreen() {
  gameFactor.classList.add('btn--hide')
  gameLevelBtn.classList.remove('level--hide')
}

function gameScreen() {
  gameFactor.classList.remove('btn--hide')
  gameLevelBtn.classList.add('level--hide')
}

function showStopButton() {
  const icon = gameBtn.querySelector('.fas');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.style.visibility = 'visible';
}

function hideGameButton() {
  gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
  timerIndicator.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function startGameTimer() {
  let remainingTimeSec = game__duration__sec;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(score === carrot__count);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerIndicator.innerHTML = `${minutes}:${seconds}`;
}

function showPopUpWithText(text) {
  popUpText.innerText = text;
  popUp.classList.remove('pop-up--hide');
}

function hidePopUp() {
  popUp.classList.add('pop-up--hide');
}

function initGame() {
  score = 0;
  field.innerHTML = '';
  gameScore.innerText = carrot__count;
  // 벌레와 당근을 생성한뒤 field에 추가해줌
  addItem('carrot', carrot__count, 'img/carrot.png');
  addItem('bug', bug__count, 'img/bug.png');
  addObstacle('fire', fire__count, 'img/fire.png');
}

function resetGame() {
  score = 0;
  field.innerHTML = '';
}

function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.carrot')) {
    // 당근!!
    target.remove();
    score++;
    playSound(carrotSound);
    updateScoreBoard();
    if (score === carrot__count) {
      finishGame(true);
    }
  } else if (target.matches('.bug')) {
    finishGame(false);
  }
  else if(target.matches('.fire')) {
    finishGame(false);
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function updateScoreBoard() {
  gameScore.innerText = carrot__count - score;
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = -70;
  const x2 = fieldRect.width - ITEM__SIZE;
  const y2 = 90
  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y2, y1);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function addObstacle(className, count, imgPath) {
  let top = -70
  let left = 0
  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    item.style.left = `${left}px`
    item.style.top = `${top}px`
    field.appendChild(item)
    top += 80
    left += 100
    fireAutoMove(item,left)
  }
}

function fireAutoMove(item, initialLeft) {
  if(fire__count == 0)  return;
  let left = initialLeft;
  item.style.left = `${left}px`
  fireLeft = setInterval(() => {
    if(left >= 700) {
      left = 0
    }
    left += 1
    item.style.left = `${left}px`
  }, 10)
}