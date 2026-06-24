const fs = require('fs');
const path = require('path');

const directoryPath = __dirname;

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach((file) => {
        if (path.extname(file).toLowerCase() === '.html') {
            const filePath = path.join(directoryPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;

            // 1. Typekit preconnects
            if (content.includes('<link rel="stylesheet" href="https://use.typekit.net/cfk3dsk.css">')) {
                if (!content.includes('<link rel="preconnect" href="https://use.typekit.net" crossorigin>')) {
                    content = content.replace(
                        '<link rel="stylesheet" href="https://use.typekit.net/cfk3dsk.css">',
                        '<link rel="preconnect" href="https://use.typekit.net" crossorigin>\n    <link rel="preconnect" href="https://p.typekit.net" crossorigin>\n    <link rel="stylesheet" href="https://use.typekit.net/cfk3dsk.css">'
                    );
                    modified = true;
                }
            }

            // 2. Logo width and height
            const logoImgStr = '<img src="assets/images/logo.svg" alt="Architruc & Baltaz\'Art" class="logo-img">';
            if (content.includes(logoImgStr)) {
                content = content.replace(
                    new RegExp(logoImgStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                    '<img src="assets/images/logo.svg" alt="Architruc & Baltaz\'Art" class="logo-img" width="416" height="118">'
                );
                modified = true;
            }

            const footerLogoStr = '<img src="assets/images/logo.svg" alt="Architruc & Baltaz\'Art" class="footer-logo">';
            if (content.includes(footerLogoStr)) {
                content = content.replace(
                    new RegExp(footerLogoStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                    '<img src="assets/images/logo.svg" alt="Architruc & Baltaz\'Art" class="footer-logo" width="416" height="118">'
                );
                modified = true;
            }

            // 3. business-hero images to webp
            if (content.includes('hero-slideshow/business-hero-1.jpg')) {
                content = content.replace(/hero-slideshow\/business-hero-1\.jpg/g, 'hero-slideshow/business-hero-1.webp');
                modified = true;
            }
            if (content.includes('hero-slideshow/business-hero-2.jpg')) {
                content = content.replace(/hero-slideshow\/business-hero-2\.jpg/g, 'hero-slideshow/business-hero-2.webp');
                modified = true;
            }
            if (content.includes('hero-slideshow/business-hero-3.jpg')) {
                content = content.replace(/hero-slideshow\/business-hero-3\.jpg/g, 'hero-slideshow/business-hero-3.webp');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log('Updated', file);
            }
        }
    });
});
