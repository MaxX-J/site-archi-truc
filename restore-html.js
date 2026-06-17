const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace all 'à ' with ' '
    content = content.replace(/à /g, ' ');
    
    fs.writeFileSync(file, content, 'utf8');
}
console.log('Restored ' + files.length + ' files.');
