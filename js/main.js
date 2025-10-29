
document.addEventListener('DOMContentLoaded', function() {

    initPlayer();
    makeDraggable(document.getElementById('draggable-window'));
    makeDraggable(document.getElementById('music-player'));
    

    const socialWindow = document.getElementById('draggable-window');
    const playerWindow = document.getElementById('music-player');
    

    socialWindow.style.left = (window.innerWidth - 400 - 50) + 'px';
    socialWindow.style.top = '50%';
    socialWindow.style.transform = 'translateY(-50%)';
    

    animateMathBackground();
    animateDigits();
});