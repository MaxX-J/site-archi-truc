const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Remove loc-hero-split
css = css.replace(/\/\* ═══════════════════════════════════════════════\n   HERO LOCATION SPLIT \(V3\)[\s\S]*?(?=\.loc-scroller)/, '');

const heroV2CSS = `/* ═══════════════════════════════════════════════
   ULTRA PREMIUM LOCATION DESIGN
═══════════════════════════════════════════════ */
.loc-hero-v2 {
    height: 100vh;
    min-height: 700px;
    background: var(--bg-dark);
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding-top: 80px;
}

.loc-hero-v2-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
}
.loc-hero-v2-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.4;
    filter: saturate(0);
}

.loc-hero-v2-content {
    position: relative;
    z-index: 2;
    color: white;
    width: 100%;
}

.loc-hero-v2-title {
    font-size: clamp(4rem, 12vw, 10rem);
    font-weight: 900;
    line-height: 0.85;
    text-transform: uppercase;
    letter-spacing: -2px;
    margin-bottom: 30px;
    mix-blend-mode: overlay;
    color: rgba(255,255,255,0.9);
}

.loc-hero-v2-desc {
    font-size: 1.4rem;
    line-height: 1.5;
    max-width: 500px;
    margin-left: auto;
    font-weight: 300;
    border-left: 2px solid var(--orange);
    padding-left: 30px;
}
`;

// Insert it right before .loc-scroller
css = css.replace('.loc-scroller {', heroV2CSS + '\n.loc-scroller {');
fs.writeFileSync('style.css', css, 'utf8');


let html = fs.readFileSync('location.html', 'utf8');

const heroV2HTML = `        <!-- 1. HERO MASSIVE -->
        <section class="loc-hero-v2">
            <div class="loc-hero-v2-bg">
                <img src="https://picsum.photos/seed/arch/1920/1080" alt="Appart 101">
            </div>
            <div class="container loc-hero-v2-content">
                <h1 class="loc-hero-v2-title fade-up">APPART<br>101.</h1>
                <div class="loc-hero-v2-desc fade-up" style="transition-delay: 0.2s;">
                    Un espace de 90m² privatisable au cœur de Béziers. Pensé pour la création, le partage et les rencontres professionnelles.
                </div>
            </div>
        </section>`;

html = html.replace(/<!-- 1\. HERO SPLIT -->[\s\S]*?<\/section>/, heroV2HTML);

// Add the logo in the CTA banner at the bottom
const ctaReplacement = `<div class="loc-cta-banner fade-up">
                    <img src="assets/appart101-orange.png" alt="Appart 101 Logo" style="max-width: 180px;">
                    <div>
                        <h3>Réserver l'espace</h3>
                        <p>Vérifiez nos disponibilités pour votre prochain événement.</p>
                    </div>
                    <a href="contact.html#contact-section" class="btn" style="background: white; color: var(--orange); border: none; font-size: 1.1rem; padding: 15px 40px;">Nous contacter</a>
                </div>`;
html = html.replace(/<div class="loc-cta-banner fade-up">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, ctaReplacement + '\n            </div>\n        </section>');

fs.writeFileSync('location.html', html, 'utf8');
