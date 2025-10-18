// Музыкальный плеер
const audioPlayer = new Audio();
let isPlaying = false;
let currentTrackIndex = 0;

// Плейлист (замените на свои треки)
const playlist = [
    {
        title: "Мой трек 1",
        artist: "Мой артист",
        src: "путь/к/треку1.mp3"
    },
    {
        title: "Мой трек 2", 
        artist: "Мой артист",
        src: "путь/к/треку2.mp3"
    },
    {
        title: "Мой трек 3",
        artist: "Мой артист", 
        src: "путь/к/треку3.mp3"
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