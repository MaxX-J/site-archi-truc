const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetPhotos = {
    'grande': [
        'ChatGPT Image 12 juin 2026, 10_18_46.png',
        '_1027558.JPG',
        '_1027565.JPG',
        '_1027574.JPG'
    ],
    'appart': [
        '4K5A5482.JPG',
        'ChatGPT Image 12 juin 2026, 11_28_35.png',
        '_1027581.JPG',
        '_1027586.JPG'
    ],
    'Citadelle': [
        'ChatGPT Image 12 juin 2026, 11_04_59.png',
        '_1027467.JPG',
        '_1027537.JPG',
        '_1027542.JPG'
    ],
    'Location-appart': [
        '4K5A5455.JPG',
        '4K5A5498.JPG',
        'ChatGPT Image 12 juin 2026, 11_20_26.png',
        '_1027588.JPG'
    ]
};

const prefixes = {
    'grande': 'showroom-montmorency-beziers',
    'appart': 'showroom-appart101-beziers',
    'Citadelle': 'showroom-citadelle-beziers',
    'Location-appart': 'location-appart101-beziers'
};

const basePath = path.join(__dirname, 'assets', 'Archi-concept');

async function recover() {
    let missing = 0;
    
    // First, verify if the files exist in basePath
    for (const folder in targetPhotos) {
        for (const file of targetPhotos[folder]) {
            if (!fs.existsSync(path.join(basePath, file))) {
                console.log(`Missing file in Archi-concept: ${file}`);
                missing++;
            }
        }
    }
    
    if (missing > 0) {
        console.log(`Waiting for user to upload. ${missing} files missing.`);
        return;
    }
    
    console.log("All 16 original files found! Starting conversion...");

    for (const folder in targetPhotos) {
        const folderPath = path.join(basePath, folder);
        const files = targetPhotos[folder];
        
        let i = 1;
        for (const file of files) {
            const sourcePath = path.join(basePath, file);
            const destPath = path.join(folderPath, `${prefixes[folder]}-${i}.webp`);
            
            console.log(`Processing ${file} -> ${destPath}`);
            try {
                // We use standard resize without crop.
                // We just limit width to 1600px to keep them light. Height scales automatically.
                await sharp(sourcePath)
                    .resize({ width: 1600, withoutEnlargement: true })
                    .webp({ quality: 85 })
                    .toFile(destPath);
                    
                console.log(`   OK`);
            } catch (err) {
                console.error(`   ERROR on ${file}:`, err);
            }
            i++;
        }
    }
    
    console.log("Conversion done. Deleting all other JPG/PNG files in Archi-concept...");
    
    // Clean up the root of Archi-concept
    const allFiles = fs.readdirSync(basePath);
    for (const f of allFiles) {
        const fullPath = path.join(basePath, f);
        if (fs.statSync(fullPath).isFile()) {
            if (f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png')) {
                fs.unlinkSync(fullPath);
                console.log(`Deleted ${f}`);
            }
        }
    }
    
    console.log("Cleanup complete!");
}

recover();
