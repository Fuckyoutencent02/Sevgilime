// ============================================================
// 1. ARKA PLAN YILDIZ KANVASI (starfield)
// ============================================================
const starCanvas = document.getElementById('starfield');
const starCtx = starCanvas.getContext('2d');
let W, H;

function resizeStarCanvas() {
    W = starCanvas.width = window.innerWidth;
    H = starCanvas.height = window.innerHeight;
}
resizeStarCanvas();
window.addEventListener('resize', resizeStarCanvas);

// Yıldızlar
const stars = [];
const STAR_COUNT = 220;
for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.5,
        speed: Math.random() * 0.02 + 0.005,
        brightness: Math.random() * 0.8 + 0.2,
    });
}

// Kayan yıldız (shooting star) havuzu
let shootingStars = [];

function createShootingStar() {
    const x = Math.random() * W * 0.8 + W * 0.1;
    const y = Math.random() * H * 0.3;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    const speed = 6 + Math.random() * 8;
    const len = 60 + Math.random() * 100;
    shootingStars.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len,
        life: 1,
        decay: 0.008 + Math.random() * 0.01,
    });
}

// Periyodik kayan yıldız
setInterval(() => {
    if (Math.random() < 0.4) createShootingStar();
}, 1800);

function drawStars() {
    starCtx.clearRect(0, 0, W, H);

    // Sabit yıldızlar
    for (const s of stars) {
        const alpha = s.brightness * (0.7 + 0.3 * Math.sin(Date.now() * s.speed));
        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(255, 245, 235, ${alpha})`;
        starCtx.fill();
    }

    // Kayan yıldızlar
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= ss.decay;
        if (ss.life <= 0 || ss.x > W || ss.y > H) {
            shootingStars.splice(i, 1);
            continue;
        }
        const grad = starCtx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 2, ss.y - ss.vy * 2);
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.life})`);
        grad.addColorStop(1, `rgba(255, 220, 200, 0)`);
        starCtx.beginPath();
        starCtx.moveTo(ss.x, ss.y);
        starCtx.lineTo(ss.x - ss.vx * 2, ss.y - ss.vy * 2);
        starCtx.strokeStyle = grad;
        starCtx.lineWidth = 2.2;
        starCtx.stroke();
    }

    requestAnimationFrame(drawStars);
}
drawStars();

// ============================================================
// 2. ÖN PLAN KANVASI (kalpler, yapraklar, kalp oluşumu)
// ============================================================
const fxCanvas = document.getElementById('fx-canvas');
const fxCtx = fxCanvas.getContext('2d');
let fxW, fxH;

function resizeFxCanvas() {
    fxW = fxCanvas.width = window.innerWidth;
    fxH = fxCanvas.height = window.innerHeight;
}
resizeFxCanvas();
window.addEventListener('resize', resizeFxCanvas);

// --- Kalp parçacıkları (float) ---
let heartParticles = [];
const HEART_COUNT = 28;

function initHeartParticles() {
    for (let i = 0; i < HEART_COUNT; i++) {
        heartParticles.push({
            x: Math.random() * fxW,
            y: Math.random() * fxH,
            size: 6 + Math.random() * 14,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: -0.2 - Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2,
            alpha: 0.3 + Math.random() * 0.5,
        });
    }
}
initHeartParticles();

// --- Gül yaprağı (rose petal) ---
let petals = [];
const PETAL_COUNT = 12;

function initPetals() {
    for (let i = 0; i < PETAL_COUNT; i++) {
        petals.push({
            x: Math.random() * fxW,
            y: Math.random() * fxH,
            size: 8 + Math.random() * 16,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: 0.2 + Math.random() * 0.3,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.02,
            alpha: 0.4 + Math.random() * 0.4,
            color: `hsl(${340 + Math.random() * 20}, 70%, ${60 + Math.random() * 25}%)`,
        });
    }
}
initPetals();

// --- Kalp oluşumu için parçacıklar (final) ---
let formationParticles = [];
let formationActive = false;
let formationProgress = 0;
const FORMATION_SPEED = 0.012;

function createFormation() {
    formationParticles = [];
    const cx = fxW / 2, cy = fxH / 2 - 50;
    const scale = Math.min(fxW, fxH) / 280;
    // Kalp eğrisi parametrik
    for (let t = 0; t < Math.PI * 2; t += 0.06) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        const px = cx + x * scale * 3.5;
        const py = cy + y * scale * 3.5;
        formationParticles.push({
            targetX: px,
            targetY: py,
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

    // --- Kalp parçacıkları (float) ---
    for (const hp of heartParticles) {
        hp.x += hp.speedX + Math.sin(Date.now() * 0.001 + hp.phase) * 0.2;
        hp.y += hp.speedY;
        if (hp.y < -20) { hp.y = fxH + 20; hp.x = Math.random() * fxW; }
        if (hp.x < -20) hp.x = fxW + 20;
        if (hp.x > fxW + 20) hp.x = -20;
        fxCtx.save();
        fxCtx.globalAlpha = hp.alpha * (0.7 + 0.3 * Math.sin(Date.now() * 0.002 + hp.phase));
        fxCtx.font = `${hp.size}px "Segoe UI", sans-serif`;
        fxCtx.textAlign = 'center';
        fxCtx.textBaseline = 'middle';
        fxCtx.fillStyle = '#ff6b9d';
        fxCtx.fillText('❤️', hp.x, hp.y);
        fxCtx.restore();
    }

    // --- Gül yaprakları ---
    for (const p of petals) {
        p.x += p.speedX + Math.sin(Date.now() * 0.001 + p.rot) * 0.1;
        p.y += p.speedY;
        p.rot += p.rotSpeed;
        if (p.y > fxH + 30) { p.y = -30; p.x = Math.random() * fxW; }
        if (p.x < -30) p.x = fxW + 30;
        if (p.x > fxW + 30) p.x = -30;
        fxCtx.save();
        fxCtx.globalAlpha = p.alpha;
        fxCtx.translate(p.x, p.y);
        fxCtx.rotate(p.rot);
        fxCtx.beginPath();
        fxCtx.ellipse(0, 0, p.size * 0.5, p.size * 0.3, 0, 0, Math.PI * 2);
        fxCtx.fillStyle = p.color;
        fxCtx.shadowColor = 'rgba(255,100,120,0.3)';
        fxCtx.shadowBlur = 12;
        fxCtx.fill();
        fxCtx.restore();
    }

    // --- Kalp oluşumu (final) ---
    if (formationActive && formationParticles.length > 0) {
        formationProgress = Math.min(1, formationProgress + FORMATION_SPEED);
        const progress = formationProgress;
        for (const fp of formationParticles) {
            const ease = 1 - Math.pow(1 - progress, 3);
            fp.x += (fp.targetX - fp.x) * fp.speed * 1.6;
            fp.y += (fp.targetY - fp.y) * fp.speed * 1.6;
            const dist = Math.hypot(fp.x - fp.targetX, fp.y - fp.targetY);
            const alpha = Math.min(1, 2 - dist / 30);
            fxCtx.beginPath();
            fxCtx.arc(fp.x, fp.y, fp.size * (0.6 + 0.4 * ease), 0, Math.PI * 2);
            fxCtx.fillStyle = `rgba(255, 80, 120, ${alpha * 0.9})`;
            fxCtx.shadowColor = 'rgba(255, 80, 120, 0.6)';
            fxCtx.shadowBlur = 18;
            fxCtx.fill();
        }
        // Bitince final metni gösterilir (zaten HTML'de görünür)
        if (progress >= 1) {
            document.getElementById('final-text').style.opacity = '1';
        }
    }

    requestAnimationFrame(drawFX);
}
drawFX();

// ============================================================
// 3. SAYFA GEÇİŞLERİ & HİKÂYE AKIŞI
// ============================================================
const sections = document.querySelectorAll('.section');
const introSection = document.getElementById('intro');
const storySection = document.getElementById('story');
const envelopeSection = document.getElementById('envelope');
const ldSection = document.getElementById('long-distance');
const finalSection = document.getElementById('final');
const btnStart = document.getElementById('btn-start');

let currentSectionIndex = 0;
const totalSections = sections.length;

function goToSection(index) {
    sections.forEach((sec, i) => {
        sec.classList.toggle('active', i === index);
    });
    // Scroll snap ile otomatik geçiş
    sections[index].scrollIntoView({ behavior: 'smooth' });
    currentSectionIndex = index;
}

// --- Başla butonu ---
btnStart.addEventListener('click', () => {
    goToSection(1);
    startStory();
});

// --- Hikâye typewriter ---
const storyLines = [
    "Dün gece arkadaşlarıma uydum.",
    "Bunu seni çok üzdüğünün ve meraklandığının farkındayım.",
    "O an bunun seni bu kadar kıracağını düşünemedim.",
    "Bahane üretmeyeceğim.",
    "Çünkü ne söylersem söyleyeyim seni üzdüğüm gerçeği değişmeyecek.",
    "Sadece seni ne kadar önemsediğimi göstermek istiyorum."
];
const storyTextEl = document.getElementById('story-text');
let storyIndex = 0;
let storyInterval;

function startStory() {
    storyIndex = 0;
    storyTextEl.style.opacity = '1';
    showNextLine();
}

function showNextLine() {
    if (storyIndex >= storyLines.length) {
        // Hikâye bitti, zarf bölümüne geç
        setTimeout(() => {
            goToSection(2);
        }, 600);
        return;
    }
    const line = storyLines[storyIndex];
    storyTextEl.textContent = '';
    storyTextEl.style.opacity = '0';
    setTimeout(() => {
        storyTextEl.style.opacity = '1';
        typeWriter(line, 0);
    }, 300);
}

function typeWriter(text, pos) {
    if (pos < text.length) {
        storyTextEl.textContent += text.charAt(pos);
        setTimeout(() => typeWriter(text, pos + 1), 45);
    } else {
        // Bir sonraki cümle için bekle
        setTimeout(() => {
            storyTextEl.style.opacity = '0';
            setTimeout(() => {
                storyIndex++;
                showNextLine();
            }, 400);
        }, 2200);
    }
}

// --- Zarf açma ---
const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');
const hint = document.getElementById('envelope-hint');
let envelopeOpened = false;

envelope.addEventListener('click', () => {
    if (!envelopeOpened) {
        envelope.classList.add('open');
        envelopeOpened = true;
        hint.textContent = '❤️ Mektubu okudun mu?';
        hint.style.color = '#ffb3c6';
        // Zarf açıldıktan sonra uzak mesafe bölümüne geçiş
        setTimeout(() => {
            goToSection(3);
        }, 5000);
    }
});

// --- Uzak mesafe bölümü otomatik geçiş ---
// (Zaten zarf açıldıktan sonra geçiyoruz)

// --- Final bölümüne geçiş (uzak mesafe sonrası) ---
// Uzak mesafe bölümü görünür olduğunda 6 sn sonra final
let ldTimer = null;
const observer = new MutationObserver(() => {
    if (ldSection.classList.contains('active')) {
        if (!ldTimer) {
            ldTimer = setTimeout(() => {
                goToSection(4);
                // Finalde kalp oluşumunu başlat
                startHeartFormation();
                ldTimer = null;
            }, 5500);
        }
    } else {
        if (ldTimer) {
            clearTimeout(ldTimer);
            ldTimer = null;
        }
    }
});
observer.observe(ldSection, { attributes: true, attributeFilter: ['class'] });

// --- Kalp oluşumu (final) ---
function startHeartFormation() {
    if (formationActive) return;
    formationActive = true;
    formationProgress = 0;
    createFormation();
    // Final metni başta gizli
    document.getElementById('final-text').style.opacity = '0';
}

// --- Sayfa yüklendiğinde intro aktif ---
goToSection(0);

// ============================================================
// 4. YARDIMCI: Pencere yeniden boyutlandığında parçacıkları güncelle
// ============================================================
window.addEventListener('resize', () => {
    // Kalp oluşumu parçacıklarını yeniden oluştur (eğer aktifse)
    if (formationActive) {
        createFormation();
    }
    // Diğer parçacıklar sınırları aşabilir, sorun değil
});

console.log('❤️ Furkan & Zerrin — Romantik Özür Sitesi hazır.');