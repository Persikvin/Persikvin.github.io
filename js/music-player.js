// Музыкальный плеер
const audioPlayer = new Audio();
let isPlaying = false;
let currentTrackIndex = 0;

// Плейлист (замените на свои треки)
const playlist = [
    {
        title: "Space Ashole",
        artist: "Space Station 13",
        src: "audio/Space_Asshole.mp3"
    },
    {
        title: "Где моя нога", 
        artist: "Серёга Пират",
        src: "audio/gde_my_leg.mp3"
    },
    {
        title: "Space Song", 
        artist: "Beach House",
        src: "audio/Beach House - Space Song.mp3"
    },
    {
        title: "breakcore",
        artist: "Неизвестно", 
        src: "audio/breakcore.mp3"
    }
];

// Элементы плеера
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const currentTrackEl = document.getElementById('current-track');
const currentArtistEl = document.getElementById('current-artist');
const volumeSlider = document.getElementById('volume-slider');
const volumeLevel = document.getElementById('volume-level');
const playlistEl = document.getElementById('playlist');

// Инициализация плеера
function initPlayer() {
    initEffects();
    animateGlitch();
    // Заполняем плейлист
    playlist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        if (index === 0) item.classList.add('active');
        item.textContent = `${track.title} - ${track.artist}`;
        item.addEventListener('click', () => playTrack(index));
        playlistEl.appendChild(item);
    });
    
    // Устанавливаем громкость
    audioPlayer.volume = 0.7;
    updateVolumeDisplay();
    
    // Загружаем первый трек
    loadTrack(currentTrackIndex);
    
    // События плеера
    playPauseBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    
    progressContainer.addEventListener('click', setProgress);
    volumeSlider.addEventListener('click', setVolume);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextTrack);
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audioPlayer.duration);
    });
}

function loadTrack(index) {
    const track = playlist[index];
    audioPlayer.src = track.src;
    currentTrackEl.textContent = track.title;
    currentArtistEl.textContent = track.artist;

    // Обновляем эффекты для этого трека
    updateEffects(track.title);
    
    // Обновляем активный элемент плейлиста
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

function togglePlay() {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶';
    } else {
        audioPlayer.play();
        playPauseBtn.textContent = '⏸';
    }
    isPlaying = !isPlaying;
}

function playTrack(index) {
    if (currentTrackIndex !== index) {
        currentTrackIndex = index;
        loadTrack(index);
    }
    if (!isPlaying) {
        togglePlay();
    }
}

function prevTrack() {
    currentTrackIndex--;
    if (currentTrackIndex < 0) {
        currentTrackIndex = playlist.length - 1;
    }
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audioPlayer.play();
    }
}

function nextTrack() {
    currentTrackIndex++;
    if (currentTrackIndex >= playlist.length) {
        currentTrackIndex = 0;
    }
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audioPlayer.play();
    }
}

function updateProgress() {
    const { currentTime, duration } = audioPlayer;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

function setVolume(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const volume = clickX / width;
    audioPlayer.volume = volume;
    updateVolumeDisplay();
}

function updateVolumeDisplay() {
    const volume = audioPlayer.volume;
    volumeLevel.style.width = `${volume * 100}%`;
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}
// Эффекты только для breakcore
const effectTrack = "breakcore";

// Элементы для эффектов
let glitchCanvas, glitchCtx;
let crtFilter, scanlines;
let currentEffects = false;

function initEffects() {
    // Создаём canvas для глитч-эффектов
    glitchCanvas = document.createElement('canvas');
    glitchCtx = glitchCanvas.getContext('2d');
    glitchCanvas.style.position = 'fixed';
    glitchCanvas.style.top = '0';
    glitchCanvas.style.left = '0';
    glitchCanvas.style.width = '100%';
    glitchCanvas.style.height = '100%';
    glitchCanvas.style.pointerEvents = 'none';
    glitchCanvas.style.zIndex = '9999';
    glitchCanvas.style.opacity = '0';
    glitchCanvas.style.transition = 'opacity 1s ease';
    document.body.appendChild(glitchCanvas);
    
    resizeGlitchCanvas();
    window.addEventListener('resize', resizeGlitchCanvas);
    
    // Создаём элементы для CRT эффекта
    crtFilter = document.createElement('div');
    crtFilter.style.position = 'fixed';
    crtFilter.style.top = '0';
    crtFilter.style.left = '0';
    crtFilter.style.width = '100%';
    crtFilter.style.height = '100%';
    crtFilter.style.pointerEvents = 'none';
    crtFilter.style.zIndex = '10000';
    crtFilter.style.opacity = '0';
    crtFilter.style.transition = 'opacity 1s ease';
    crtFilter.style.background = `radial-gradient(
        ellipse at center,
        transparent 0%,
        rgba(0, 0, 0, 0.3) 60%,
        rgba(0, 0, 0, 0.6) 100%
    )`;
    crtFilter.style.mixBlendMode = 'multiply';
    document.body.appendChild(crtFilter);
    
    // Создаём scanlines
    scanlines = document.createElement('div');
    scanlines.style.position = 'fixed';
    scanlines.style.top = '0';
    scanlines.style.left = '0';
    scanlines.style.width = '100%';
    scanlines.style.height = '100%';
    scanlines.style.background = `repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.1) 1px,
        transparent 1px,
        transparent 3px
    )`;
    scanlines.style.pointerEvents = 'none';
    scanlines.style.zIndex = '10001';
    scanlines.style.opacity = '0';
    scanlines.style.transition = 'opacity 1s ease';
    document.body.appendChild(scanlines);
}

function resizeGlitchCanvas() {
    glitchCanvas.width = window.innerWidth;
    glitchCanvas.height = window.innerHeight;
}

function updateEffects(trackTitle) {
    const shouldEnable = trackTitle === effectTrack;
    
    if (shouldEnable && !currentEffects) {
        // Плавное включение эффектов
        glitchCanvas.style.opacity = '0.9';
        crtFilter.style.opacity = '0.4';
        scanlines.style.opacity = '0.6';
        currentEffects = true;
    } else if (!shouldEnable && currentEffects) {
        // Плавное выключение эффектов
        glitchCanvas.style.opacity = '0';
        crtFilter.style.opacity = '0';
        scanlines.style.opacity = '0';
        currentEffects = false;
    }
}

function animateGlitch() {
    if (currentEffects) {
        // Полная очистка canvas
        glitchCtx.clearRect(0, 0, glitchCanvas.width, glitchCanvas.height);
        
        // РАЗНОЦВЕТНЫЕ ГЛИТЧИ
        
        // 1. RGB split с разными цветами
        if (Math.random() < 0.5) {
            const rShift = -10 + Math.random() * 20;
            const gShift = -10 + Math.random() * 20;
            const bShift = -10 + Math.random() * 20;
            
            // Красный канал
            glitchCtx.globalCompositeOperation = 'screen';
            glitchCtx.filter = 'brightness(2)';
            glitchCtx.globalAlpha = 0.6;
            glitchCtx.drawImage(
                mathCanvas,
                0, 0, glitchCanvas.width, glitchCanvas.height,
                rShift, 0, glitchCanvas.width, glitchCanvas.height
            );
            
            // Зелёный канал
            glitchCtx.filter = 'brightness(1.5)';
            glitchCtx.globalAlpha = 0.5;
            glitchCtx.drawImage(
                mathCanvas,
                0, 0, glitchCanvas.width, glitchCanvas.height,
                gShift, 2, glitchCanvas.width, glitchCanvas.height
            );
            
            // Синий канал
            glitchCtx.filter = 'brightness(1.8)';
            glitchCtx.globalAlpha = 0.5;
            glitchCtx.drawImage(
                mathCanvas,
                0, 0, glitchCanvas.width, glitchCanvas.height,
                bShift, -2, glitchCanvas.width, glitchCanvas.height
            );
            
            glitchCtx.filter = 'none';
            glitchCtx.globalAlpha = 1;
            glitchCtx.globalCompositeOperation = 'source-over';
        }
        
        // 2. Неоновые цветовые сдвиги
        if (Math.random() < 0.4) {
            const colors = [
                'rgba(255, 0, 0, 0.4)',    // Красный
                'rgba(0, 255, 0, 0.4)',    // Зелёный
                'rgba(0, 0, 255, 0.4)',    // Синий
                'rgba(255, 255, 0, 0.4)',  // Жёлтый
                'rgba(255, 0, 255, 0.4)',  // Пурпурный
                'rgba(0, 255, 255, 0.4)'   // Голубой
            ];
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shiftX = (Math.random() - 0.5) * 80;
            const shiftY = (Math.random() - 0.5) * 40;
            
            // Цветное наложение
            glitchCtx.globalCompositeOperation = 'screen';
            glitchCtx.fillStyle = color;
            glitchCtx.fillRect(0, 0, glitchCanvas.width, glitchCanvas.height);
            
            glitchCtx.globalAlpha = 0.7;
            glitchCtx.drawImage(
                mathCanvas,
                0, 0, glitchCanvas.width, glitchCanvas.height,
                shiftX, shiftY, glitchCanvas.width, glitchCanvas.height
            );
            glitchCtx.globalAlpha = 1;
            glitchCtx.globalCompositeOperation = 'source-over';
        }
        
        // 3. Цифровой шум с цветами VHS
        if (Math.random() < 0.3) {
            const noiseColors = [
                'rgba(255, 50, 50, 0.1)',    // Красный шум
                'rgba(50, 255, 50, 0.1)',    // Зелёный шум
                'rgba(50, 50, 255, 0.1)',    // Синий шум
                'rgba(255, 255, 100, 0.1)'   // Жёлтый шум
            ];
            
            for (let i = 0; i < 200; i++) {
                const x = Math.random() * glitchCanvas.width;
                const y = Math.random() * glitchCanvas.height;
                const width = 1 + Math.random() * 10;
                const height = 1 + Math.random() * 5;
                const color = noiseColors[Math.floor(Math.random() * noiseColors.length)];
                
                glitchCtx.fillStyle = color;
                glitchCtx.fillRect(x, y, width, height);
            }
        }
        
        // 4. Цветные горизонтальные полосы
        if (Math.random() < 0.25) {
            const stripeColors = [
                'rgba(255, 0, 0, 0.3)',      // Красный
                'rgba(0, 255, 0, 0.3)',      // Зелёный
                'rgba(0, 0, 255, 0.3)',      // Синий
                'rgba(255, 255, 0, 0.3)',    // Жёлтый
                'rgba(255, 0, 255, 0.3)'     // Пурпурный
            ];
            
            const stripeCount = 3 + Math.floor(Math.random() * 8);
            for (let i = 0; i < stripeCount; i++) {
                const y = Math.random() * glitchCanvas.height;
                const height = 1 + Math.random() * 8;
                const color = stripeColors[Math.floor(Math.random() * stripeColors.length)];
                const shiftX = (Math.random() - 0.5) * 30;
                
                glitchCtx.fillStyle = color;
                glitchCtx.fillRect(0, y, glitchCanvas.width, height);
                
                // Смещённая копия полосы
                glitchCtx.globalAlpha = 0.6;
                glitchCtx.drawImage(
                    mathCanvas,
                    0, y, glitchCanvas.width, height,
                    shiftX, y, glitchCanvas.width, height
                );
                glitchCtx.globalAlpha = 1;
            }
        }
        
        // 5. Psychedelic цветовые искажения
        if (Math.random() < 0.2) {
            const waveIntensity = Math.random() * 20;
            const colorPhase = Math.random() * Math.PI * 2;
            
            for (let channel = 0; channel < 3; channel++) {
                const channelShift = Math.sin(colorPhase + channel * Math.PI * 2/3) * waveIntensity;
                
                glitchCtx.globalCompositeOperation = channel === 0 ? 'screen' : 
                                                   channel === 1 ? 'screen' : 'screen';
                glitchCtx.globalAlpha = 0.3;
                
                const channelColors = [
                    'rgba(255, 0, 0, 0.5)',    // Красный
                    'rgba(0, 255, 0, 0.5)',    // Зелёный  
                    'rgba(0, 0, 255, 0.5)'     // Синий
                ];
                
                glitchCtx.fillStyle = channelColors[channel];
                glitchCtx.fillRect(0, 0, glitchCanvas.width, glitchCanvas.height);
                
                glitchCtx.drawImage(
                    mathCanvas,
                    0, 0, glitchCanvas.width, glitchCanvas.height,
                    channelShift, Math.sin(Date.now() * 0.01 + channel) * 5, 
                    glitchCanvas.width, glitchCanvas.height
                );
            }
            glitchCtx.globalAlpha = 1;
            glitchCtx.globalCompositeOperation = 'source-over';
        }
        
        // 6. Цветные блочные артефакты
        if (Math.random() < 0.35) {
            const blockSize = 10 + Math.random() * 40;
            const blockCount = 5 + Math.floor(Math.random() * 15);
            
            const blockColors = [
                'rgba(255, 100, 100, 0.8)',   // Светло-красный
                'rgba(100, 255, 100, 0.8)',   // Светло-зелёный
                'rgba(100, 100, 255, 0.8)',   // Светло-синий
                'rgba(255, 255, 100, 0.8)',   // Светло-жёлтый
                'rgba(255, 100, 255, 0.8)'    // Светло-пурпурный
            ];
            
            for (let i = 0; i < blockCount; i++) {
                const x = Math.random() * glitchCanvas.width;
                const y = Math.random() * glitchCanvas.height;
                const color = blockColors[Math.floor(Math.random() * blockColors.length)];
                const shiftX = (Math.random() - 0.5) * 50;
                const shiftY = (Math.random() - 0.5) * 30;
                
                // Цветной блок
                glitchCtx.fillStyle = color;
                glitchCtx.fillRect(x, y, blockSize, blockSize);
                
                // Смещённый контент под блоком
                glitchCtx.globalAlpha = 0.9;
                glitchCtx.drawImage(
                    mathCanvas,
                    x, y, blockSize, blockSize,
                    x + shiftX, y + shiftY, blockSize, blockSize
                );
                glitchCtx.globalAlpha = 1;
            }
        }
        
        // 7. Мерцающие пиксели радужных цветов
        if (Math.random() < 0.15) {
            const pixelCount = 100 + Math.floor(Math.random() * 400);
            
            for (let i = 0; i < pixelCount; i++) {
                const x = Math.floor(Math.random() * glitchCanvas.width);
                const y = Math.floor(Math.random() * glitchCanvas.height);
                
                // Случайный яркий цвет
                const r = Math.random() > 0.5 ? 255 : 0;
                const g = Math.random() > 0.5 ? 255 : 0;
                const b = Math.random() > 0.5 ? 255 : 0;
                const alpha = 0.3 + Math.random() * 0.7;
                
                glitchCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                glitchCtx.fillRect(x, y, 1, 1);
            }
        }
        
        // 8. Градиентные цветовые наложения
        if (Math.random() < 0.1) {
            const gradientType = Math.floor(Math.random() * 3);
            let gradient;
            
            if (gradientType === 0) {
                // Радужный градиент
                gradient = glitchCtx.createLinearGradient(0, 0, glitchCanvas.width, 0);
                gradient.addColorStop(0, 'rgba(255, 0, 0, 0.2)');
                gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.2)');
                gradient.addColorStop(1, 'rgba(0, 0, 255, 0.2)');
            } else if (gradientType === 1) {
                // Неоновый градиент
                gradient = glitchCtx.createRadialGradient(
                    glitchCanvas.width/2, glitchCanvas.height/2, 0,
                    glitchCanvas.width/2, glitchCanvas.height/2, glitchCanvas.width/2
                );
                gradient.addColorStop(0, 'rgba(255, 0, 255, 0.3)');
                gradient.addColorStop(1, 'rgba(0, 255, 255, 0.3)');
            } else {
                // Тёплый градиент
                gradient = glitchCtx.createLinearGradient(0, 0, 0, glitchCanvas.height);
                gradient.addColorStop(0, 'rgba(255, 100, 0, 0.2)');
                gradient.addColorStop(1, 'rgba(255, 255, 0, 0.2)');
            }
            
            glitchCtx.globalCompositeOperation = 'overlay';
            glitchCtx.fillStyle = gradient;
            glitchCtx.fillRect(0, 0, glitchCanvas.width, glitchCanvas.height);
            glitchCtx.globalCompositeOperation = 'source-over';
        }
        
    }
    
    requestAnimationFrame(animateGlitch);
}