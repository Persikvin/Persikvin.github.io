
const mathCanvas = document.getElementById('math-canvas');
const ctx = mathCanvas.getContext('2d');


function resizeCanvas() {
    mathCanvas.width = window.innerWidth;
    mathCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);


const formulas = [
    "E = mc²",
    "F = G(m₁m₂)/r²",
    "∇·E = ρ/ε₀",
    "∇×B = μ₀J + μ₀ε₀∂E/∂t",
    "ψ = Ae^(i(kx-ωt))",
    "∫f(z)dz = 2πi∑Res",
    "∂²u/∂t² = c²∇²u",
    "H|ψ⟩ = E|ψ⟩",
    "ds² = -(1-2GM/rc²)dt² + ...",
    "R_{μν} - 1/2g_{μν}R = 8πGT_{μν}",
    "S = -∫d⁴x√(-g)(R/16πG + L_m)",
    "∇²φ = 4πGρ",
    "T_{μν} = (ρ+p)u_μu_ν + pg_{μν}",
    "a = (0, -GMr/|r|³)",
    "L = r × p",
    "S = k_B ln Ω"
];

const formulaParticles = [];
const blackHole = {
    x: mathCanvas.width / 2,
    y: mathCanvas.height / 2,
    mass: 800,
    radius: 40,
    distortionRadius: 200
};


class FormulaParticle {
    constructor() {
        this.reset();
        this.formula = formulas[Math.floor(Math.random() * formulas.length)];
        this.size = 10 + Math.random() * 6;
        this.speed = 0.3 + Math.random() * 1.0;
        this.angle = Math.random() * Math.PI * 2;
        this.opacity = 0.2 + Math.random() * 0.3;
    }
    
    reset() {
        this.x = Math.random() * mathCanvas.width;
        this.y = Math.random() * mathCanvas.height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.age = 0;
        this.maxAge = 150 + Math.random() * 200;
    }
    
    update() {
        this.age++;
        

        const dx = blackHole.x - this.x;
        const dy = blackHole.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > blackHole.radius) {
            const force = blackHole.mass / (distance * distance);
            this.vx += (dx / distance) * force * 0.08;
            this.vy += (dy / distance) * force * 0.08;
        } else {

            this.reset();
        }
        
        this.x += this.vx;
        this.y += this.vy;
        

        this.vx *= 0.998;
        this.vy *= 0.998;
        
        if (this.age > this.maxAge) {
            this.reset();
        }
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.font = `${this.size}px Courier New`;
        ctx.fillText(this.formula, this.x, this.y);
        ctx.restore();
    }
}


function drawSpaceTimeGrid() {
    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 0.5;
    

    for (let y = 0; y < mathCanvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(mathCanvas.width, y);
        ctx.stroke();
    }
    

    for (let x = 0; x < mathCanvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, mathCanvas.height);
        ctx.stroke();
    }
}


function drawBlackHole() {

    const distortionGradient = ctx.createRadialGradient(
        blackHole.x, blackHole.y, blackHole.radius,
        blackHole.x, blackHole.y, blackHole.distortionRadius
    );
    distortionGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    distortionGradient.addColorStop(0.3, 'rgba(200, 200, 255, 0.1)');
    distortionGradient.addColorStop(1, 'transparent');
    

    ctx.fillStyle = distortionGradient;
    ctx.beginPath();
    ctx.arc(blackHole.x, blackHole.y, blackHole.distortionRadius, 0, Math.PI * 2);
    ctx.fill();
    

    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 2;
    

    ctx.beginPath();
    ctx.arc(blackHole.x, blackHole.y, blackHole.radius * 2.5, 0, Math.PI * 2);
    ctx.stroke();
    

    ctx.beginPath();
    ctx.arc(blackHole.x, blackHole.y, blackHole.radius * 1.8, 0, Math.PI * 2);
    ctx.stroke();
    

    ctx.fillStyle = '#000000';
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(blackHole.x, blackHole.y, blackHole.radius, 0, Math.PI * 2);
    ctx.fill();
    

    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(blackHole.x, blackHole.y, blackHole.radius, 0, Math.PI * 2);
    ctx.stroke();
    

    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const startX = blackHole.x + Math.cos(angle) * blackHole.radius;
        const startY = blackHole.y + Math.sin(angle) * blackHole.radius;
        const endX = blackHole.x + Math.cos(angle) * blackHole.distortionRadius;
        const endY = blackHole.y + Math.sin(angle) * blackHole.distortionRadius;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
    

    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(blackHole.x, blackHole.y, 2, 0, Math.PI * 2);
    ctx.fill();
}


function distortGrid() {
    ctx.save();
    

    const distortionStrength = 0.3;
    
    for (let y = 0; y < mathCanvas.height; y += 30) {
        for (let x = 0; x < mathCanvas.width; x += 30) {
            const dx = blackHole.x - x;
            const dy = blackHole.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < blackHole.distortionRadius && distance > blackHole.radius) {
                const distortion = (blackHole.distortionRadius - distance) / blackHole.distortionRadius;
                const shiftX = (dx / distance) * distortion * distortionStrength * 50;
                const shiftY = (dy / distance) * distortion * distortionStrength * 50;
                
                ctx.strokeStyle = '#ffffff';
                ctx.globalAlpha = 0.2 * distortion;
                ctx.lineWidth = 1;
                

                ctx.beginPath();
                ctx.moveTo(x + shiftX, y + shiftY);
                ctx.lineTo(x + 30 + shiftX, y + shiftY);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(x + shiftX, y + shiftY);
                ctx.lineTo(x + shiftX, y + 30 + shiftY);
                ctx.stroke();
            }
        }
    }
    
    ctx.restore();
}


for (let i = 0; i < 20; i++) {
    formulaParticles.push(new FormulaParticle());
}


function animateMathBackground() {

    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, mathCanvas.width, mathCanvas.height);
    
    drawSpaceTimeGrid();
    distortGrid();
    drawBlackHole();
    
    formulaParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateMathBackground);
}