// ═══════════════════════════════════════════════
// CARROUSEL GALERIE — Archi Nous
// Swipe tactile + navigation clavier + drag souris
// ═══════════════════════════════════════════════
(function () {
    const track    = document.getElementById('gallery-track');
    const prev     = document.getElementById('gallery-prev');
    const next     = document.getElementById('gallery-next');
    const current  = document.getElementById('gallery-current');
    const dotsWrap = document.getElementById('gallery-dots');

    if (!track) return;

    const slides = track.querySelectorAll('.gallery-slide');
    const total  = slides.length;
    let index    = 0;

    // Nombre de slides visibles selon la largeur
    function visibleCount() {
        const width = slideWidth();
        return width ? Math.max(1, Math.floor(window.innerWidth / width)) : 1;
    }

    // Largeur d'un slide + gap
    function slideWidth() {
        const slide = slides[0];
        const style = window.getComputedStyle(slide);
        return slide.offsetWidth + parseInt(style.marginRight || 0);
    }

    function maxIndex() {
        return Math.max(0, total - visibleCount());
    }

    function goTo(i) {
        if (i < 0) {
            index = maxIndex();
        } else if (i > maxIndex()) {
            index = 0;
        } else {
            index = i;
        }
        track.style.transform = `translateX(-${index * slideWidth()}px)`;
        if (current) current.textContent = index + 1;
        dots.forEach((d, idx) => d.classList.toggle('active', idx === index));
    }

    // Dots
    const dots = [];
    if (dotsWrap) {
        for (let i = 0; i <= maxIndex(); i++) {
            const dot = document.createElement('button');
            dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Photo ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
            dots.push(dot);
        }
    }

    if (prev) prev.addEventListener('click', () => goTo(index - 1));
    if (next) next.addEventListener('click', () => goTo(index + 1));

    // Clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  goTo(index - 1);
        if (e.key === 'ArrowRight') goTo(index + 1);
    });

    // Swipe tactile
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
        const dx = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 50) goTo(dx > 0 ? index + 1 : index - 1);
    });

    // Drag souris
    let dragStartX = 0, isDragging = false;
    track.addEventListener('mousedown', (e) => { dragStartX = e.clientX; isDragging = true; });
    track.addEventListener('mousemove', (e) => { if (isDragging) e.preventDefault(); });
    track.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const dx = dragStartX - e.clientX;
        if (Math.abs(dx) > 50) goTo(dx > 0 ? index + 1 : index - 1);
    });
    track.addEventListener('mouseleave', () => { isDragging = false; });

    // Recalcul au resize
    window.addEventListener('resize', () => goTo(Math.min(index, maxIndex())));

    // Init
    goTo(0);
})();

// ═══════════════════════════════════════════════
// LIGHTBOX MODAL
// ═══════════════════════════════════════════════
(function() {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    if (!modal || !modalImg) return;

    const images = document.querySelectorAll('.gallery-slide img');

    images.forEach(img => {
        let startX = 0, startY = 0;
        
        img.addEventListener('mousedown', e => { 
            startX = e.clientX; 
            startY = e.clientY; 
        });
        
        img.addEventListener('mouseup', e => {
            const dx = Math.abs(e.clientX - startX);
            const dy = Math.abs(e.clientY - startY);
            // Si le mouvement est très faible, on considère que c'est un clic (pas un swipe)
            if (dx < 5 && dy < 5) {
                modalImg.src = img.src;
                modal.classList.add('active');
            }
        });

        // Bloquer le comportement de clic par défaut pour éviter des conflits avec le mousedown/up
        img.addEventListener('click', e => e.preventDefault());
    });

    function closeModal() {
        modal.classList.remove('active');
        // On attend la fin de la transition CSS (0.4s) pour vider la source
        setTimeout(() => { modalImg.src = ''; }, 400); 
    }

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        // Ferme la modale si on clique sur le fond noir (hors de l'image)
        if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
})();
