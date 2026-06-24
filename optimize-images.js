const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'assets', 'images', 'hero-slideshow');

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach((file) => {
        if (path.extname(file).toLowerCase() === '.jpg' || path.extname(file).toLowerCase() === '.jpeg') {
            const inputPath = path.join(directoryPath, file);
            const outputPath = path.join(directoryPath, path.parse(file).name + '.webp');
            
            sharp(inputPath)
                .webp({ quality: 80 })
                .toFile(outputPath, (err, info) => {
                    if (err) {
                        console.error('Error processing file', file, err);
                    } else {
                        console.log('Successfully converted', file, 'to webp. Size:', info.size);
                    }
                });
        }
    });
});
