// ===== 1. YILDIZ KANVASI =====
const starCanvas = document.getElementById('starfield');
const starCtx = starCanvas.getContext('2d');
let W, H;

function resizeStar() {
    W = starCanvas.width = window.innerWidth;
    H = starCanvas.height = window.innerHeight;
}
resizeStar();
window.addEventListener('resize', resizeStar);

const stars = [];
for (let i = 0; i < 200; i++) {
    stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.5,
        speed: Math.random() * 0.02 + 0.005,
        brightness: Math.random() * 0.8 + 0.2,
    });
}

let shooting = [];

function createShooting() {
    const x = Math.random() * W * 0.8 + W * 0.1;
    const y = Math.random() * H * 0.3;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    const speed = 5 + Math.random() * 8;
    shooting.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.008 + Math.random() * 0.01,
    });
}
setInterval(() => { if (Math.random() < 0.35) createShooting(); }, 1600);

function drawStars() {
    starCtx.clearRect(0, 0, W, H);
    for (const s of stars) {
        const alpha = s.brightness * (0.7 + 0.3 * Math.sin(Date.now() * s.speed));
        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(255, 245, 235, ${alpha})`;
        starCtx.fill();
    }
    for (let i = shooting.length - 1; i >= 0; i--) {
        const ss = shooting[i];
        ss.x += ss.vx; ss.y += ss.vy;
        ss.life -= ss.decay;
        if (ss.life <= 0 || ss.x > W || ss.y > H) { shooting.splice(i,1); continue; }
        const grad = starCtx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx*2, ss.y - ss.vy*2);
        grad.addColorStop(0, `rgba(255,255,255,${ss.life})`);
        grad.addColorStop(1, `rgba(255,220,200,0)`);
        starCtx.beginPath();
        starCtx.moveTo(ss.x, ss.y);
        starCtx.lineTo(ss.x - ss.vx*2, ss.y - ss.vy*2);
        starCtx.strokeStyle = grad;
        starCtx.lineWidth = 2;
        starCtx.stroke();
    }
    requestAnimationFrame(drawStars);
}
drawStars();

// ===== 2. FX KANVASI =====
const fxCanvas = document.getElementById('fx-canvas');
const fxCtx = fxCanvas.getContext('2d');
let fxW, fxH;

function resizeFx() {
    fxW = fxCanvas.width = window.innerWidth;
    fxH = fxCanvas.height = window.innerHeight;
}
resizeFx();
window.addEventListener('resize', resizeFx);

// Kalpler
let hearts = [];
for (let i = 0; i < 25; i++) {
    hearts.push({
        x: Math.random() * fxW,
        y: Math.random() * fxH,
        size: 6 + Math.random() * 14,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -0.2 - Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.5,
    });
}

// Yapraklar
let petals = [];
for (let i = 0; i < 10; i++) {
    petals.push({
        x: Math.random() * fxW,
        y: Math.random() * fxH,
        size: 8 + Math.random() * 14,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: 0.2 + Math.random() * 0.3,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        alpha: 0.4 + Math.random() * 0.4,
        color: `hsl(${340 + Math.random()*20}, 70%, ${60 + Math.random()*25}%)`,
    });
}

// Kalp oluşumu
let formParticles = [];
let formActive = false;
let formProgress = 0;

function createFormation() {
    formParticles = [];
    const cx = fxW/2, cy = fxH/2 - 40;
    const scale = Math.min(fxW, fxH) / 300;
    for (let t = 0; t < Math.PI*2; t += 0.06) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t));
        formParticles.push({
            targetX: cx + x * scale * 3.2,
            targetY: cy + y * scale * 3.2,
            x: Math.random() * fxW,
            y: Math.random() * fxH,
            size: 2 + Math.random() * 3,
            alpha: 0.8,
            speed: 0.02 + Math.random() * 0.03,
        });
    }
}

function drawFX() {
    fxCtx.clearRect(0, 0, fxW, fxH);

    // Kalpler
    for (const h of hearts) {
        h.x += h.speedX + Math.sin(Date.now()*0.001 + h.phase) * 0.15;
        h.y += h.speedY;
        if (h.y < -20) { h.y = fxH+20; h.x = Math.random()*fxW; }
        if (h.x < -20) h.x = fxW+20;
        if (h.x > fxW+20) h.x = -20;
        fxCtx.save();
        fxCtx.globalAlpha = h.alpha * (0.7 + 0.3 * Math.sin(Date.now()*0.002 + h.phase));
        fxCtx.font = `${h.size}px sans-serif`;
        fxCtx.textAlign = 'center';
        fxCtx.textBaseline = 'middle';
        fxCtx.fillStyle = '#ff6b9d';
        fxCtx.fillText('❤️', h.x, h.y);
        fxCtx.restore();
    }

    // Yapraklar
    for (const p of petals) {
        p.x += p.speedX + Math.sin(Date.now()*0.001 + p.rot) * 0.08;
        p.y += p.speedY;
        p.rot += p.rotSpeed;
        if (p.y > fxH+30) { p.y = -30; p.x = Math.random()*fxW; }
        if (p.x < -30) p.x = fxW+30;
        if (p.x > fxW+30) p.x = -30;
        fxCtx.save();
        fxCtx.globalAlpha = p.alpha;
        fxCtx.translate(p.x, p.y);
        fxCtx.rotate(p.rot);
        fxCtx.beginPath();
        fxCtx.ellipse(0, 0, p.size*0.5, p.size*0.3, 0, 0, Math.PI*2);
        fxCtx.fillStyle = p.color;
        fxCtx.shadowColor = 'rgba(255,100,120,0.3)';
        fxCtx.shadowBlur = 12;
        fxCtx.fill();
        fxCtx.restore();
    }

    // Kalp oluşumu
    if (formActive && formParticles.length > 0) {
        formProgress = Math.min(1, formProgress + 0.015);
        const ease = 1 - Math.pow(1 - formProgress, 3);
        for (const fp of formParticles) {
            fp.x += (fp.targetX - fp.x) * fp.speed * 1.5;
            fp.y += (fp.targetY - fp.y) * fp.speed * 1.5;
            const dist = Math.hypot(fp.x - fp.targetX, fp.y - fp.targetY);
            const alpha = Math.min(1, 2 - dist/25);
            fxCtx.beginPath();
            fxCtx.arc(fp.x, fp.y, fp.size * (0.6 + 0.4*ease), 0, Math.PI*2);
            fxCtx.fillStyle = `rgba(255, 80, 120, ${alpha * 0.9})`;
            fxCtx.shadowColor = 'rgba(255,80,120,0.6)';
            fxCtx.shadowBlur = 18;
            fxCtx.fill();
        }
        if (formProgress >= 1) {
            document.getElementById('final-text').style.opacity = '1';
        }
    }

    requestAnimationFrame(drawFX);
}
drawFX();

// ===== 3. SAYFA GEÇİŞLERİ =====
const sections = document.querySelectorAll('.section');
const btnStart = document.getElementById('btn-start');
const storyTextEl = document.getElementById('story-text');
const envelope = document.getElementById('envelope');
const hint = document.getElementById('envelope-hint');

const storyLines = [
    "Dün gece arkadaşlarıma uydum.",
    "Bunu seni çok üzdüğünün ve meraklandığının farkındayım.",
    "O an bunun seni bu kadar kıracağını düşünemedim.",
    "Bahane üretmeyeceğim.",
    "Çünkü ne söylersem söyleyeyim seni üzdüğüm gerçeği değişmeyecek.",
    "Sadece seni ne kadar önemsediğimi göstermek istiyorum."
];

let storyIndex = 0;
let currentSection = 0;

function goToSection(index) {
    sections.forEach((sec, i) => {
        sec.classList.toggle('active', i === index);
    });
    sections[index].scrollIntoView({ behavior: 'smooth' });
    currentSection = index;
}

btnStart.addEventListener('click', () => {
    goToSection(1);
    startStory();
});

function startStory() {
    storyIndex = 0;
    showLine();
}

function showLine() {
    if (storyIndex >= storyLines.length) {
        setTimeout(() => goToSection(2), 600);
        return;
    }
    const line = storyLines[storyIndex];
    storyTextEl.textContent = '';
    storyTextEl.style.opacity = '0';
    setTimeout(() => {
        storyTextEl.style.opacity = '1';
        typeLine(line, 0);
    }, 300);
}

function typeLine(text, pos) {
    if (pos < text.length) {
        storyTextEl.textContent += text.charAt(pos);
        setTimeout(() => typeLine(text, pos+1), 40);
    } else {
        setTimeout(() => {
            storyTextEl.style.opacity = '0';
            setTimeout(() => {
                storyIndex++;
                showLine();
            }, 350);
        }, 2000);
    }
}

// Zarf açma
let opened = false;
envelope.addEventListener('click', () => {
    if (!opened) {
        envelope.classList.add('open');
        opened = true;
        hint.textContent = '❤️ Mektubu okudun mu?';
        hint.style.color = '#ffb3c6';
        setTimeout(() => goToSection(3), 4500);
    }
});

// Uzak mesafe → final
let ldTimer = null;
const ldObs = new MutationObserver(() => {
    const ld = document.getElementById('long-distance');
    if (ld.classList.contains('active')) {
        if (!ldTimer) {
            ldTimer = setTimeout(() => {
                goToSection(4);
                startHeartFormation();
                ldTimer = null;
            }, 5000);
        }
    } else {
        if (ldTimer) { clearTimeout(ldTimer); ldTimer = null; }
    }
});
ldObs.observe(document.getElementById('long-distance'), { attributes: true, attributeFilter: ['class'] });

function startHeartFormation() {
    if (formActive) return;
    formActive = true;
    formProgress = 0;
    createFormation();
    document.getElementById('final-text').style.opacity = '0';
}

goToSection(0);