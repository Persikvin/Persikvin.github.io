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
        
        // ЖЁСТКИЕ ГЛИТЧИ - части сайта накладываются друг на друга
        
        // 1. Крупные смещения всего контента
        if (Math.random() < 0.4) {
            const shiftX = (Math.random() - 0.5) * 100; // до 50px смещения
            const shiftY = (Math.random() - 0.5) * 60; // до 30px смещения
            
            glitchCtx.globalAlpha = 0.7;
            glitchCtx.drawImage(
                mathCanvas, 
                0, 0, glitchCanvas.width, glitchCanvas.height,
                shiftX, shiftY, glitchCanvas.width, glitchCanvas.height
            );
            glitchCtx.globalAlpha = 1;
        }
        
        // 2. Разрывы и дублирования частей экрана
        if (Math.random() < 0.3) {
            const sliceHeight = 30 + Math.random() * 100;
            const sliceY = Math.random() * (glitchCanvas.height - sliceHeight);
            const shiftX = (Math.random() - 0.5) * 80;
            
            // Дублируем и смещаем полосу
            glitchCtx.globalAlpha = 0.8;
            glitchCtx.drawImage(
                mathCanvas,
                0, sliceY, glitchCanvas.width, sliceHeight,
                shiftX, sliceY + (Math.random() - 0.5) * 40, glitchCanvas.width, sliceHeight
            );
            glitchCtx.globalAlpha = 1;
        }
        
        // 3. Множественные наложения
        if (Math.random() < 0.25) {
            const layers = 2 + Math.floor(Math.random() * 3);
            for (let i = 0; i < layers; i++) {
                const offsetX = (Math.random() - 0.5) * 60;
                const offsetY = (Math.random() - 0.5) * 40;
                const scale = 0.8 + Math.random() * 0.4;
                
                glitchCtx.globalAlpha = 0.3 + Math.random() * 0.3;
                glitchCtx.drawImage(
                    mathCanvas,
                    0, 0, glitchCanvas.width, glitchCanvas.height,
                    offsetX, offsetY, glitchCanvas.width * scale, glitchCanvas.height * scale
                );
            }
            glitchCtx.globalAlpha = 1;
        }
        
        // 4. Резкие цветовые каналы (RGB split)
        if (Math.random() < 0.35) {
            const rShift = (Math.random() - 0.5) * 15;
            const gShift = (Math.random() - 0.5) * 15;
            const bShift = (Math.random() - 0.5) * 15;
            
            // Красный канал
            glitchCtx.globalCompositeOperation = 'screen';
            glitchCtx.globalAlpha = 0.4;
            glitchCtx.drawImage(
                mathCanvas,
                0, 0, glitchCanvas.width, glitchCanvas.height,
                rShift, 0, glitchCanvas.width, glitchCanvas.height
            );
            
            // Зелёный канал
            glitchCtx.globalAlpha = 0.4;
            glitchCtx.drawImage(
                mathCanvas,
                0, 0, glitchCanvas.width, glitchCanvas.height,
                gShift, 0, glitchCanvas.width, glitchCanvas.height
            );
            
            // Синий канал
            glitchCtx.globalAlpha = 0.4;
            glitchCtx.drawImage(
                mathCanvas,
                0, 0, glitchCanvas.width, glitchCanvas.height,
                bShift, 0, glitchCanvas.width, glitchCanvas.height
            );
            
            glitchCtx.globalAlpha = 1;
            glitchCtx.globalCompositeOperation = 'source-over';
        }
        
        // 5. Инвертированные участки
        if (Math.random() < 0.2) {
            const invertWidth = 100 + Math.random() * 200;
            const invertHeight = 50 + Math.random() * 150;
            const invertX = Math.random() * (glitchCanvas.width - invertWidth);
            const invertY = Math.random() * (glitchCanvas.height - invertHeight);
            
            glitchCtx.globalCompositeOperation = 'difference';
            glitchCtx.globalAlpha = 0.6;
            glitchCtx.drawImage(
                mathCanvas,
                invertX, invertY, invertWidth, invertHeight,
                invertX, invertY, invertWidth, invertHeight
            );
            glitchCtx.globalAlpha = 1;
            glitchCtx.globalCompositeOperation = 'source-over';
        }
        
        // 6. Горизонтальные разрывы
        if (Math.random() < 0.15) {
            const tearCount = 3 + Math.floor(Math.random() * 5);
            for (let i = 0; i < tearCount; i++) {
                const tearY = Math.random() * glitchCanvas.height;
                const tearHeight = 2 + Math.random() * 8;
                const tearShift = (Math.random() - 0.5) * 50;
                
                glitchCtx.globalAlpha = 0.9;
                glitchCtx.drawImage(
                    mathCanvas,
                    0, tearY, glitchCanvas.width, tearHeight,
                    tearShift, tearY, glitchCanvas.width, tearHeight
                );
            }
            glitchCtx.globalAlpha = 1;
        }
        
        // 7. Статические помехи
        if (Math.random() < 0.1) {
            const staticDensity = 500 + Math.random() * 1000;
            for (let i = 0; i < staticDensity; i++) {
                const x = Math.random() * glitchCanvas.width;
                const y = Math.random() * glitchCanvas.height;
                const size = Math.random() * 3;
                const brightness = Math.random() * 255;
                
                glitchCtx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
                glitchCtx.fillRect(x, y, size, size);
            }
        }
        
    }
    
    requestAnimationFrame(animateGlitch);
}