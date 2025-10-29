
const colors = [
    '#003300', 
    '#004400', 
    '#005500', 
    '#006600', 
    '#002200', 
    '#001100'  

const activeDigits = [];

function makeDraggable(element) {
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    const dragHandle = element.id === 'draggable-window' ? 
        element.querySelector('.drag-handle') : 
        element.querySelector('.player-title, .window-title');
    
    dragHandle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    function startDrag(e) {
        isDragging = true;
        const rect = element.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        element.style.cursor = 'grabbing';
    }
    
    function drag(e) {
        if (!isDragging) {
            
            if (Math.random() < 0.3) { 
                createDigit(e.clientX, e.clientY);
            }
            return;
        }
        
        element.style.left = (e.clientX - dragOffset.x) + 'px';
        element.style.top = (e.clientY - dragOffset.y) + 'px';
        element.style.transform = 'none';
    }
    
    function stopDrag() {
        isDragging = false;
        element.style.cursor = '';
    }
}

function createDigit(x, y) {
    const digit = document.createElement('div');
    digit.className = 'digit';
    digit.textContent = Math.floor(Math.random() * 10);
    
    const colorIndex = Math.floor(Math.random() * colors.length);
    digit.style.color = colors[colorIndex];
    
    const offsetX = (Math.random() - 0.5) * 60;
    const offsetY = (Math.random() - 0.5) * 30;
    
    const startX = x + offsetX;
    const startY = y + offsetY;
    
    digit.style.left = startX + 'px';
    digit.style.top = startY + 'px';
    
    const fontSize = 12 + Math.random() * 8;
    digit.style.fontSize = fontSize + 'px';
    
    document.body.appendChild(digit);
    
    const digitObj = {
        element: digit,
        x: startX,
        y: startY,
        velocityY: 0.3 + Math.random() * 1.0,
        opacity: 1,
        fadeSpeed: 0.004 + Math.random() * 0.004,
        createdAt: Date.now()
    };
    
    activeDigits.push(digitObj);
}

// Функция анимации цифр
function animateDigits() {
    const now = Date.now();
    
    for (let i = activeDigits.length - 1; i >= 0; i--) {
        const digit = activeDigits[i];
        
        digit.y += digit.velocityY;
        digit.element.style.top = digit.y + 'px';
        
        digit.opacity -= digit.fadeSpeed;
        digit.element.style.opacity = digit.opacity;
        
        if (digit.opacity <= 0 || now - digit.createdAt > 5000) {
            digit.element.remove();
            activeDigits.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animateDigits);
}