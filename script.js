let layer = 0;
let count = 0;
let poppedCount = 0;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let powerLevel = 0;
let bubbleInterval;
let powerupInterval;
let gameSpeed = 1000;
let bubbleSize = 48;
let isRunning = true;
let isPaused = false;
let powerupsEnabled = true;

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
const powerupControl = document.getElementById('powerupControl');
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
        clearInterval(powerupInterval);
    } else {
        bubbleInterval = setInterval(createBubble, gameSpeed);
        if (powerupsEnabled) {
            powerupInterval = setInterval(createPowerup, 5000);
        }
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
    
    resetIntervals();
}

function togglePowerups() {
    powerupsEnabled = !powerupsEnabled;
    powerupControl.textContent = `Powerups: ${powerupsEnabled ? 'On' : 'Off'}`;
    if (powerupsEnabled) {
        powerupInterval = setInterval(createPowerup, 5000);
    } else {
        clearInterval(powerupInterval);
    }
}

function resetIntervals() {
    clearInterval(bubbleInterval);
    clearInterval(powerupInterval);
    if (!isPaused) {
        bubbleInterval = setInterval(createBubble, gameSpeed);
        if (powerupsEnabled) {
            powerupInterval = setInterval(createPowerup, 5000);
        }
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

function createPowerup() {
    if (!isRunning || isPaused || !powerupsEnabled) return;
    
    const powerup = document.createElement('div');
    const position = getRandomPosition(bubbleSize);
    
    powerup.className = 'bubble powerup';
    powerup.style.left = `${position.x}px`;
    powerup.style.top = `${position.y}px`;
    powerup.style.width = `${bubbleSize}px`;
    powerup.style.height = `${bubbleSize}px`;
    powerup.style.background = `radial-gradient(circle at 30% 30%, gold, transparent 100%)`;
    powerup.style.zIndex = ++layer;
    powerup.innerHTML = '<i class="fas fa-bolt"></i>';
    
    powerup.addEventListener('click', () => collectPowerup(powerup));
    
    gameArea.appendChild(powerup);
    
    setTimeout(() => {
        if (powerup.parentNode) {
            powerup.remove();
        }
    }, 3000);
}

function collectPowerup(powerup) {
    powerup.remove();
    powerLevel += 10;
    powerLevelElement.textContent = powerLevel;
    powerMeter.style.width = `${Math.min(powerLevel, 100)}%`;
    
    if (powerLevel >= 100) {
        activatePowerMode();
    }
}

function activatePowerMode() {
    powerLevel = 0;
    powerLevelElement.textContent = powerLevel;
    powerMeter.style.width = '0%';
    
    const bubbles = document.querySelectorAll('.bubble:not(.powerup)');
    bubbles.forEach(bubble => popBubble(bubble));
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
    powerupControl.addEventListener('click', togglePowerups);
    pauseButton.addEventListener('click', togglePause);
    
    window.addEventListener('resize', handleResize);
    
    bubbleInterval = setInterval(createBubble, gameSpeed);
    powerupInterval = setInterval(createPowerup, 5000);
}

initGame();