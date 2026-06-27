const fs = require('fs');
const content = fs.readFileSync('assets/images/picto.svg', 'utf8');
const paths = content.match(/<path[^>]+>/g).join('');

// Original viewBox is 0 0 143.38 312.3
// Let's use a viewBox of 0 0 500 500 to add plenty of padding (safe area for circular masks on Android/iOS)
// Content width: 143.38, Height: 312.3
// Center X: (500 - 143.38) / 2 = 178.31
// Center Y: (500 - 312.3) / 2 = 93.85

const newSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
  <defs>
    <style>
      .cls-1 { fill: #ff5100; }
    </style>
  </defs>
  <g transform="translate(178.31, 93.85)">
    ${paths}
  </g>
</svg>`;

fs.writeFileSync('assets/images/favicon.svg', newSvg);
