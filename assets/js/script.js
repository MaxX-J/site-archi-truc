// ═══════════════════════════════════════════════
// PAGE LOADER — une seule fois par session
// ═══════════════════════════════════════════════
const loader = document.getElementById('page-loader');
if (loader) {
    if (sessionStorage.getItem('site-visited')) {
        loader.style.display = 'none';
    } else {
        sessionStorage.setItem('site-visited', '1');
        const dismiss = () => loader.classList.add('hidden');
        window.addEventListener('load', () => setTimeout(dismiss, 400));
        setTimeout(dismiss, 1200);
    }
}


// ═══════════════════════════════════════════════
// HERO SLIDESHOW — crossfade toutes les 6s
// ═══════════════════════════════════════════════
(function () {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length < 2) return;

    let current = 0;

    // Précharger les images suivantes
    slides.forEach((s, i) => {
        if (i === 0) return;
        const img = new Image();
        img.src = s.style.backgroundImage.slice(5, -2);
    });

    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 6000);
})();


// ═══════════════════════════════════════════════
// HEADER — transparent → blanc au scroll
// ═══════════════════════════════════════════════
const header = document.querySelector('#main-header');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
});


// ═══════════════════════════════════════════════
// ANIMATIONS SCROLL — Intersection Observer
// ═══════════════════════════════════════════════
const faders = document.querySelectorAll('.fade-up, .reveal-wrap');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

faders.forEach(el => observer.observe(el));


// ═══════════════════════════════════════════════
// HERO — animer les éléments à l'entrée directement
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    // Hero accueil
    const heroEls = document.querySelectorAll('.hero .fade-up');
    heroEls.forEach((el, i) => {
        setTimeout(() => el.classList.add('appear'), 200 + i * 180);
    });

    // Hero pages internes (.page-hero) — fix showrooms.html
    const pageHeroEls = document.querySelectorAll('.page-hero .fade-up');
    pageHeroEls.forEach((el, i) => {
        setTimeout(() => el.classList.add('appear'), 400 + i * 200);
    });
});


// ═══════════════════════════════════════════════
// MOBILE MENU (squelette — à compléter si besoin)
// ═══════════════════════════════════════════════
const toggle = document.getElementById('mobile-toggle');
const nav    = document.querySelector('.desktop-nav');

function closeMobileMenu() {
    nav.classList.remove('open');
    toggle.classList.remove('active');
    header.classList.remove('menu-open');
}

if (toggle && nav) {
    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.classList.toggle('active');
        header.classList.toggle('menu-open', isOpen);
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}


// ═══════════════════════════════════════════════
// STICKY SHOWROOMS — pairing mobile
// ═══════════════════════════════════════════════
function initMobileShowrooms() {
    if (window.innerWidth >= 1024) return;

    const wrapper = document.querySelector('.sticky-showrooms-wrapper');
    if (!wrapper || wrapper.dataset.mobileDone) return;
    wrapper.dataset.mobileDone = 'true';

    const detailBlocks = Array.from(document.querySelectorAll('.showroom-detail-block'));
    const stickyVisuals = document.querySelector('.sticky-visuals');

    const mobileContainer = document.createElement('div');
    mobileContainer.className = 'sticky-showrooms-wrapper';

    detailBlocks.forEach(block => {
        const visualId = block.dataset.visual;
        const visualItem = document.getElementById(visualId);
        const pair = document.createElement('div');
        pair.className = 'mobile-showroom-pair';
        if (visualItem) pair.appendChild(visualItem);
        pair.appendChild(block);
        mobileContainer.appendChild(pair);
    });

    wrapper.parentNode.replaceChild(mobileContainer, wrapper);
}

document.addEventListener('DOMContentLoaded', initMobileShowrooms);


// ═══════════════════════════════════════════════
// CAROUSEL MINI (Showrooms)
// ═══════════════════════════════════════════════
const carousels = document.querySelectorAll('.carousel');
carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    let currentIndex = 0;

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });
    }
    if(prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
});

// ═══════════════════════════════════════════════
// MAGNETIC BUTTONS
// ═══════════════════════════════════════════════
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translateY(-3px) translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});


// ═══════════════════════════════════════════════
// ANIMATED COUNTERS
// ═══════════════════════════════════════════════
const statNums = document.querySelectorAll('.stat-number[data-target]');
if (statNums.length > 0) {
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.dataset.target;
            const duration = 1600;
            const startTime = performance.now();
            (function tick(now) {
                const p = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.floor(eased * target);
                if (p < 1) requestAnimationFrame(tick);
                else el.textContent = target;
            })(startTime);
            counterObs.unobserve(el);
        });
    }, { threshold: 0.6 });
    statNums.forEach(n => counterObs.observe(n));
}


// ═══════════════════════════════════════════════
// STICKY SHOWROOMS SCROLL EFFECT
// ═══════════════════════════════════════════════
const detailBlocks = document.querySelectorAll('.showroom-detail-block');
const visualItems = document.querySelectorAll('.sticky-visual-item');

if (detailBlocks.length > 0 && visualItems.length > 0) {
    const stickyObserverOptions = {
        root: null,
        threshold: 0.5 // Trigger when block is 50% visible
    };

    const stickyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.getAttribute('data-visual');
                
                // Update active state of visual items
                visualItems.forEach(item => {
                    if (item.id === targetId) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, stickyObserverOptions);

    detailBlocks.forEach(block => stickyObserver.observe(block));
}

