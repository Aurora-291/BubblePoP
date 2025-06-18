let count = 0;
let poppedCount = 0;
let score = 0;
let isPaused = false;

const gameArea = document.getElementById('gameArea');
const countElement = document.getElementById('count');
const poppedElement = document.getElementById('popped');
const scoreElement = document.getElementById('score');
const pauseButton = document.getElementById('pauseButton');

function togglePause() {
    isPaused = !isPaused;
    pauseButton.innerHTML = isPaused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
}

pauseButton.addEventListener('click', togglePause);