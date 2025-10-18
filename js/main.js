// Основной файл инициализации
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех модулей
    initPlayer();
    makeDraggable(document.getElementById('draggable-window'));
    makeDraggable(document.getElementById('music-player'));
    
    // Позиционирование окон по умолчанию
    const socialWindow = document.getElementById('draggable-window');
    const playerWindow = document.getElementById('music-player');
    
    // Социальные сети - середина справа
    socialWindow.style.left = (window.innerWidth - 400 - 50) + 'px';
    socialWindow.style.top = '50%';
    socialWindow.style.transform = 'translateY(-50%)';
    
    // Плеер - середина слева (уже установлено в CSS)
    
    // Запуск анимаций
    animateMathBackground();
    animateDigits();
});