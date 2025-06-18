let layer = 0;
let count = 0;
let poppedCount = 0;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let powerLevel = 0;
let bubbleInterval;
let gameSpeed = 1000;
let bubbleSize = 48;
let isRunning = true;
let isPaused = false;

const gameArea = document.getElementById('gameArea');
const countElement = document.getElementById('count');
const poppedElement = document.getElementById('popped');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const powerLevelElement = document.getElementById('powerLevel');
const powerMeter = document.getElementById('powerMeter');
const themeToggle = document.getElementById('themeToggle');
const speedControl = document.getElementById('speedControl');
const sizeControl = document.getElementById('sizeControl');
const colorControl = document.getElementById('colorControl');
const pauseButton = document.getElementById('pauseButton');

const speeds = {
    'Slow': 1500,
    'Normal': 1000,
    'Fast': 500,
    'Insane': 200
};

const sizes = {
    'Tiny': 32,
    'Normal': 48,
    'Large': 64,
    'Huge': 96
};

const colorModes = ['Rainbow', 'Pastel', 'Neon', 'Mono'];

const bubbleColors = {
    Rainbow: () => `hsl(${Math.random() * 360}, 80%, 60%)`,
    Pastel: () => `hsl(${Math.random() * 360}, 70%, 80%)`,
    Neon: () => `hsl(${Math.random() * 360}, 100%, 50%)`,
    Mono: () => `hsl(200, 80%, ${40 + Math.random() * 20}%)`
};

function toggleTheme() {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    themeToggle.innerHTML = document.body.dataset.theme === 'dark' ? 
        '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function togglePause() {
    isPaused = !isPaused;
    pauseButton.innerHTML = isPaused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
    if (isPaused) {
        clearInterval(bubbleInterval);
    } else {
        bubbleInterval = setInterval(createBubble, gameSpeed);
    }
}

function cycleSpeed() {
    const currentSpeed = speedControl.textContent.split(': ')[1];
    const speedKeys = Object.keys(speeds);
    const currentIndex = speedKeys.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % speedKeys.length;
    const nextSpeed = speedKeys[nextIndex];
    
    speedControl.textContent = `Speed: ${nextSpeed}`;
    gameSpeed = speeds[nextSpeed];
    
    clearInterval(bubbleInterval);
    if (!isPaused) {
        bubbleInterval = setInterval(createBubble, gameSpeed);
    }
}

function cycleSize() {
    const currentSize = sizeControl.textContent.split(': ')[1];
    const sizeKeys = Object.keys(sizes);
    const currentIndex = sizeKeys.indexOf(currentSize);
    const nextIndex = (currentIndex + 1) % sizeKeys.length;
    const nextSize = sizeKeys[nextIndex];
    
    sizeControl.textContent = `Size: ${nextSize}`;
    bubbleSize = sizes[nextSize];
}

function cycleColor() {
    const currentColor = colorControl.textContent.split(': ')[1];
    const currentIndex = colorModes.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % colorModes.length;
    const nextColor = colorModes[nextIndex];
    
    colorControl.textContent = `Color: ${nextColor}`;
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
    const currentColor = colorControl.textContent.split(': ')[1];
    
    bubble.className = 'bubble';
    bubble.style.left = `${position.x}px`;
    bubble.style.top = `${position.y}px`;
    bubble.style.width = `${bubbleSize}px`;
    bubble.style.height = `${bubbleSize}px`;
    bubble.style.background = `radial-gradient(circle at 30% 30%, ${bubbleColors[currentColor]()}, transparent 100%)`;
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
    score += Math.floor(100 / gameSpeed * bubbleSize);
    powerLevel += 1;
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.textContent = highScore;
    }
    
    powerLevelElement.textContent = powerLevel;
    powerMeter.style.width = `${Math.min(powerLevel, 100)}%`;
    
    countElement.textContent = count;
    poppedElement.textContent = poppedCount;
    scoreElement.textContent = score;
    
    setTimeout(() => bubble.remove(), 300);
}

function handleResize() {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => {
        const position = getRandomPosition(parseInt(bubble.style.width));
        bubble.style.left = `${position.x}px`;
        bubble.style.top = `${position.y}px`;
    });
}

function initGame() {
    highScoreElement.textContent = highScore;
    
    themeToggle.addEventListener('click', toggleTheme);
    speedControl.addEventListener('click', cycleSpeed);
    sizeControl.addEventListener('click', cycleSize);
    colorControl.addEventListener('click', cycleColor);
    pauseButton.addEventListener('click', togglePause);
    
    window.addEventListener('resize', handleResize);
    
    bubbleInterval = setInterval(createBubble, gameSpeed);
}

initGame();