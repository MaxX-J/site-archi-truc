const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== '404.html');

let report = {
    totalFiles: files.length,
    missingTitles: [],
    missingDescriptions: [],
    missingCanonical: [],
    httpLinks: [],
    missingAltTags: 0,
    totalImages: 0,
    brokenLocalLinks: []
};

// Get all valid local targets
const validTargets = files.map(f => f);
validTargets.push('assets/css/style.css');
validTargets.push('assets/js/script.js');

files.forEach(file => {
    const html = fs.readFileSync(file, 'utf8');
    
    // SEO
    if (!/<title>[^<]+<\/title>/i.test(html)) report.missingTitles.push(file);
    if (!/<meta[^>]*name=["']description["']/i.test(html)) report.missingDescriptions.push(file);
    if (!/<link[^>]*rel=["']canonical["']/i.test(html)) report.missingCanonical.push(file);
    
    // HTTP links
    const httpMatches = html.match(/href=["']http:\/\/[^"']+["']/gi);
    if (httpMatches && !html.includes('http://www.w3.org')) report.httpLinks.push({file, links: httpMatches});
    
    // Images
    const imgMatches = html.match(/<img[^>]+>/gi) || [];
    report.totalImages += imgMatches.length;
    imgMatches.forEach(img => {
        if (!/alt=["'][^"']*["']/i.test(img)) {
            report.missingAltTags++;
        }
    });

    // Broken Links
    const hrefMatches = html.match(/href=["']([^"']+)["']/gi) || [];
    hrefMatches.forEach(hrefStr => {
        const url = hrefStr.replace(/href=["']/, '').replace(/["']$/, '');
        if (url.startsWith('http') || url.startsWith('mailto') || url.startsWith('tel') || url.startsWith('#')) return;
        const cleanUrl = url.split('#')[0].split('?')[0];
        if (cleanUrl && !fs.existsSync(cleanUrl)) {
            report.brokenLocalLinks.push({ file, brokenLink: cleanUrl });
        }
    });
});

console.log('--- AUDIT REPORT ---');
console.log(JSON.stringify(report, null, 2));
