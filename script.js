/* ═══════════════════════════════════════════════════════
   script.js — Scroll-driven animations for _D.Dev_ Portfolio
════════════════════════════════════════════════════════ */

// ── 1. NAVBAR ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── 2. HERO TITLE: parallax ────────────────────────────────
const heroTitle = document.getElementById('hero-title');

function heroParallax() {
    const scrollY = window.scrollY;
    const heroH = document.querySelector('.hero').offsetHeight;
    if (scrollY < heroH) {
        heroTitle.style.transform = `translateY(${scrollY * 0.35}px)`;
        heroTitle.style.letterSpacing = `${scrollY * 0.05}px`;
        heroTitle.style.opacity = 1 - scrollY / (heroH * 0.85);
    }
}

// ── 3. HERO PHOTO: follows into about-image circle ─────────
const heroPhotoWrap = document.getElementById('hero-photo-wrap');

function heroPhotoParallax() {
    if (!heroPhotoWrap) return;
    const scrollY = window.scrollY;
    const heroH   = document.querySelector('.hero').offsetHeight;

    // Phase 1: photo visible in hero, drifts up slightly
    if (scrollY < heroH) {
        const progress = scrollY / heroH;             // 0 → 1
        const lift     = scrollY * 0.18;              // drifts up
        const scale    = 1 - progress * 0.25;         // shrinks a little
        const fade     = 1 - progress * 1.2;          // fades out before heroH

        heroPhotoWrap.style.transform = `translateX(-50%) translateY(-${lift}px) scale(${scale})`;
        heroPhotoWrap.style.opacity   = Math.max(0, fade);
        heroPhotoWrap.style.display   = 'block';
    } else {
        heroPhotoWrap.style.opacity = '0';
    }
}

// ── 4. VVV TEXT: parallax left / right ────────────────────
const supportLeft  = document.querySelector('.support-text');
const supportRight = document.querySelector('.support-text2');

function vvvParallax() {
    const scrollY = window.scrollY;
    const heroH = document.querySelector('.hero').offsetHeight;
    if (scrollY < heroH * 1.1) {
        supportLeft.style.transform  = `translateX(${-scrollY * 0.15}px)`;
        supportRight.style.transform = `translateX(${scrollY * 0.15}px)`;
    }
}

// ── 5. SCROLL STRIPS ──────────────────────────────────────
const stripLeft  = document.getElementById('strip-left');
const stripRight = document.getElementById('strip-right');

function stripScroll() {
    const scrollY = window.scrollY;
    if (stripLeft)  stripLeft.style.transform  = `translateX(${scrollY * 0.12}px)`;
    if (stripRight) stripRight.style.transform = `translateX(${-scrollY * 0.12}px)`;
}

// ── 6. STATEMENT TEXT ─────────────────────────────────────
const statementEl = document.getElementById('statement-text');

function statementParallax() {
    if (!statementEl) return;
    const rect    = statementEl.getBoundingClientRect();
    const viewH   = window.innerHeight;
    if (rect.top < viewH && rect.bottom > 0) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const clamped  = Math.min(Math.max(progress, 0), 1);
        const offset   = (1 - clamped) * 200;
        statementEl.style.transform = `translateX(${offset}px)`;
        statementEl.style.opacity   = clamped;
    }
}

// ── 7. SCROLL REVEAL (IntersectionObserver) ───────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// ── 8. MAIN SCROLL HANDLER ────────────────────────────────
function onScroll() {
    heroParallax();
    heroPhotoParallax();
    vvvParallax();
    stripScroll();
    statementParallax();
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── 9. CONTACT FORM ───────────────────────────────────────
function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.submit-btn');
    btn.textContent = 'TRANSMITTED ✓';
    setTimeout(() => {
        btn.textContent = 'TRANSMIT MESSAGE';
        e.target.reset();
    }, 2800);
}

// ── 10. SMOOTH CURSOR ─────────────────────────────────────
const cursor = document.createElement('div');
cursor.style.cssText = `
    width: 8px; height: 8px;
    background: #fff; border-radius: 50%;
    position: fixed; top: 0; left: 0;
    pointer-events: none; z-index: 9999;
    transition: transform 0.12s ease, opacity 0.3s ease;
    mix-blend-mode: difference;
`;
document.body.appendChild(cursor);

const cursorRing = document.createElement('div');
cursorRing.style.cssText = `
    width: 30px; height: 30px;
    border: 1px solid rgba(255,255,255,0.4); border-radius: 50%;
    position: fixed; top: 0; left: 0;
    pointer-events: none; z-index: 9998;
    transition: transform 0.22s ease, opacity 0.3s ease;
    mix-blend-mode: difference;
`;
document.body.appendChild(cursorRing);

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.transform     = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    cursorRing.style.transform = `translate(${mouseX - 15}px, ${mouseY - 15}px)`;
});

document.querySelectorAll('a, button, .project-card, .blog-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorRing.style.transform += ' scale(1.8)';
        cursorRing.style.borderColor = 'rgba(255,255,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
        cursorRing.style.transform = `translate(${mouseX - 15}px, ${mouseY - 15}px)`;
        cursorRing.style.borderColor = 'rgba(255,255,255,0.4)';
    });
});
