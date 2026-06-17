const fs = require('fs');

let c = fs.readFileSync('showrooms.html', 'utf8');

const targetStr = `
                        <button class="carousel-prev">&#10094;</button>
                        <button class="carousel-next">&#10095;</button>
                    </div>
                </div>

                                alt="Showroom Rue Montmorency 4" loading="lazy">
                        </div>
                        <div class="carousel-indicators">
                            <span class="dot active"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                        </div>
                        <button class="carousel-prev">&#10094;</button>
                        <button class="carousel-next">&#10095;</button>
                    </div>
                </div>

                <!-- 2. Appart 101 -->
                <div class="sticky-visual-item" id="visual-appart">
                    <div class="carousel">
                        <div class="carousel-track">
                            <img class="carousel-slide"
                                src="assets/Archi-concept/appart/showroom-appart101-beziers-2.webp"
                                alt="Appart' 101" loading="lazy">
                            <img class="carousel-slide"
                                src="assets/Archi-concept/appart/showroom-appart101-beziers-3.webp"
                                alt="Appart' 101 2" loading="lazy">
                            <img class="carousel-slide"
                                src="assets/Archi-concept/appart/showroom-appart101-beziers-4.webp"
                                alt="Appart' 101 3" loading="lazy">
                            <img class="carousel-slide"
                                src="assets/Archi-concept/appart/showroom-appart101-beziers-1.webp"
                                alt="Appart' 101 4" loading="lazy">
                        </div>
                        <div class="carousel-indicators">
                            <span class="dot active"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                        </div>
                        <button class="carousel-prev">&#10094;</button>
                        <button class="carousel-next">&#10095;</button>
                    </div>
                </div>`;

const replacement = `
                        <button class="carousel-prev">&#10094;</button>
                        <button class="carousel-next">&#10095;</button>
                    </div>
                </div>

                <!-- 2. Appart 101 -->
                <div class="sticky-visual-item" id="visual-appart">
                    <div class="carousel">
                        <div class="carousel-track">
                            <img class="carousel-slide"
                                src="assets/Archi-concept/appart/showroom-appart101-beziers-2.webp"
                                alt="Appart' 101" loading="lazy">
                            <img class="carousel-slide"
                                src="assets/Archi-concept/appart/showroom-appart101-beziers-3.webp"
                                alt="Appart' 101 2" loading="lazy">
                            <img class="carousel-slide"
                                src="assets/Archi-concept/appart/showroom-appart101-beziers-4.webp"
                                alt="Appart' 101 3" loading="lazy">
                            <img class="carousel-slide"
                                src="assets/Archi-concept/appart/showroom-appart101-beziers-1.webp"
                                alt="Appart' 101 4" loading="lazy">
                        </div>
                        <div class="carousel-indicators">
                            <span class="dot active"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                            <span class="dot"></span>
                        </div>
                        <button class="carousel-prev">&#10094;</button>
                        <button class="carousel-next">&#10095;</button>
                    </div>
                </div>`;

c = c.replace(targetStr, replacement);
fs.writeFileSync('showrooms.html', c, 'utf8');
console.log('Fixed block');
