const fs = require('fs');
let css = fs.readFileSync('assets/css/style.css', 'utf8');

// Replace page-loader visibility transition
// Handle both CRLF and LF
const targetCRLF = `transition: opacity 0.7s cubic-bezier(0.77, 0, 0.175, 1),\r\n        visibility 0.7s cubic-bezier(0.77, 0, 0.175, 1);`;
const targetLF = `transition: opacity 0.7s cubic-bezier(0.77, 0, 0.175, 1),\n        visibility 0.7s cubic-bezier(0.77, 0, 0.175, 1);`;
const replacement = `transition: opacity 0.7s cubic-bezier(0.77, 0, 0.175, 1);`;

css = css.replace(targetCRLF, replacement);
css = css.replace(targetLF, replacement);

const targetHidden = `visibility: hidden;`;
// To remove visibility: hidden completely from .page-loader.hidden to avoid Lighthouse warning
// Wait, actually I will just replace the specific block.
const blockToReplace = `.page-loader.hidden {\r
    opacity: 0;\r
    visibility: hidden;\r
    pointer-events: none;\r
}`;
const blockToReplaceLF = `.page-loader.hidden {\n    opacity: 0;\n    visibility: hidden;\n    pointer-events: none;\n}`;

css = css.replace(blockToReplace, `.page-loader.hidden {\r\n    opacity: 0;\r\n    pointer-events: none;\r\n}`);
css = css.replace(blockToReplaceLF, `.page-loader.hidden {\n    opacity: 0;\n    pointer-events: none;\n}`);

// Append media query for border-radius animations
if (!css.includes('OPTIMISATIONS PERFORMANCES MOBILE')) {
    css += `

/* --- OPTIMISATIONS PERFORMANCES MOBILE --- */
@media (max-width: 768px) {
    /* Désactiver les animations de border-radius (coûteuses en calcul) sur mobile */
    .loader-blob,
    .dot {
        animation: none !important;
        border-radius: 50% !important; 
        transform: scale(1) !important;
        opacity: 1 !important;
    }
}
`;
}

fs.writeFileSync('assets/css/style.css', css, 'utf8');
console.log('CSS updated successfully.');
