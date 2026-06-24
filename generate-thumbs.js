const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Read projects-data.js
let dataContent = fs.readFileSync('assets/js/projects-data.js', 'utf8');

// Extract the JSON object
const jsonStart = dataContent.indexOf('{');
const jsonEnd = dataContent.lastIndexOf('}') + 1;
const jsonStr = dataContent.substring(jsonStart, jsonEnd);

let projects;
try {
    // Dirty eval to parse the JS object since it might have trailing commas etc
    projects = eval('(' + jsonStr + ')');
} catch (e) {
    console.error('Failed to parse projects-data.js', e);
    process.exit(1);
}

// 2. Process each project
async function processProjects() {
    for (const key in projects) {
        const project = projects[key];
        const folder = project.folder;
        const thumbName = project.thumbnail || project.hero;
        
        if (!thumbName) continue;
        
        // If it's already a thumb, skip
        if (thumbName.includes('-thumb.webp')) continue;
        
        const originalPath = path.join(folder, thumbName);
        if (!fs.existsSync(originalPath)) {
            console.log('Original not found:', originalPath);
            continue;
        }
        
        const parsedPath = path.parse(originalPath);
        const newThumbName = parsedPath.name + '-thumb.webp';
        const newThumbPath = path.join(folder, newThumbName);
        
        try {
            await sharp(originalPath)
                .resize({ width: 600, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(newThumbPath);
                
            console.log('Created thumb:', newThumbPath);
            
            // Update the object
            project.thumbnail = newThumbName;
        } catch (e) {
            console.error('Error creating thumb for', originalPath, e);
        }
    }
    
    // 3. Write back to projects-data.js
    const newJsonStr = JSON.stringify(projects, null, 4);
    const newFileContent = `const PROJECTS_DATA = ${newJsonStr};`;
    fs.writeFileSync('assets/js/projects-data.js', newFileContent, 'utf8');
    console.log('projects-data.js updated!');
}

processProjects();
