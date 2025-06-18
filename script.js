let layer = 0;
let count = 0;
let poppedCount = 0;
let score = 0;
let bubbleInterval;
let gameSpeed = 1000;
let bubbleSize = 48;
let isRunning = true;
let isPaused = false;

const gameArea = document.getElementById('gameArea');
const countElement = document.getElementById('count');
const poppedElement = document.getElementById('popped');
const scoreElement = document.getElementById('score');
const pauseButton = document.getElementById('pauseButton');

function togglePause() {
    isPaused = !isPaused;
    pauseButton.innerHTML = isPaused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
    if (isPaused) {
        clearInterval(bubbleInterval);
    } else {
        bubbleInterval = setInterval(createBubble, gameSpeed);
    }
}

function getRandomPosition(size) {
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size;
    return {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY)
    };
}

function createBubble() {
    if (!isRunning || isPaused) return;
    
    const bubble = document.createElement('div');
    const position = getRandomPosition(bubbleSize);
    
    bubble.className = 'bubble';
    bubble.style.left = `${position.x}px`;
    bubble.style.top = `${position.y}px`;
    bubble.style.width = `${bubbleSize}px`;
    bubble.style.height = `${bubbleSize}px`;
    bubble.style.background = `radial-gradient(circle at 30% 30%, hsl(${Math.random() * 360}, 80%, 60%), transparent 100%)`;
    bubble.style.zIndex = ++layer;
    
    bubble.addEventListener('click', () => popBubble(bubble));
    
    gameArea.appendChild(bubble);
    count++;
    countElement.textContent = count;
    
    setTimeout(() => {
        if (bubble.parentNode && !bubble.classList.contains('popped')) {
            bubble.remove();
            count--;
            countElement.textContent = count;
        }
    }, 10000);
}

function popBubble(bubble) {
    if (bubble.classList.contains('popped')) return;
    
    bubble.classList.add('popped');
    bubble.innerHTML = '<i class="fas fa-burst"></i>';
    
    count--;
    poppedCount++;
    score += 100;
    
    countElement.textContent = count;
    poppedElement.textContent = poppedCount;
    scoreElement.textContent = score;
    
    setTimeout(() => bubble.remove(), 300);
}

function initGame() {
    pauseButton.addEventListener('click', togglePause);
    bubbleInterval = setInterval(createBubble, gameSpeed);
}

initGame();