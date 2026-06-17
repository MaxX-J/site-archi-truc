const fs = require('fs');

for (let f of ['index.html', 'contact.html', 'archi-nous.html', 'archi-business.html']) {
    let lines = fs.readFileSync(f, 'utf8').split('\n');
    for (let i=0; i<lines.length; i++) {
        if (lines[i].match(/à[\"<]/) || lines[i].trim().endsWith('à')) console.log(f+':'+(i+1)+': '+lines[i].trim());
    }
}
