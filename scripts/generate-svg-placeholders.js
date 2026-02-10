const fs = require('fs');
const path = require('path');

const missingImagesPath = path.join(__dirname, '..', 'missing_images_v2.json');
const publicDir = path.join(__dirname, '..', 'public');

function getColorHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
}

function generateSVG(width, height, text, subtext, bgColor) {
    // Basic sanitization for XML
    const safeText = (text || '').replace(/[<>&"']/g, '');
    const safeSubtext = (subtext || '').replace(/[<>&"']/g, '');

    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bgColor}" />
  <rect width="100%" height="100%" fill="rgba(0,0,0,0.2)" />
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">${safeText}</text>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.8)" text-anchor="middle" dy=".3em">${safeSubtext}</text>
  <text x="50%" y="90%" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.5)" text-anchor="middle">Placeholder Image</text>
</svg>`;
}

function main() {
    if (!fs.existsSync(missingImagesPath)) {
        console.error('missing_images_v2.json not found');
        process.exit(1);
    }

    const missingImages = JSON.parse(fs.readFileSync(missingImagesPath, 'utf8'));
    let count = 0;

    missingImages.forEach(img => {
        // Construct file path
        // img.src is like "/case-studies/filename.svg"
        const relPath = img.src.startsWith('/') ? img.src.substring(1) : img.src;
        const fullPath = path.join(publicDir, relPath);
        const dirName = path.dirname(fullPath);

        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
        }

        const title = img.type ? img.type.toUpperCase() : 'IMAGE';
        const description = (img.alt || img.file).substring(0, 50) + (img.alt && img.alt.length > 50 ? '...' : '');
        const color = getColorHash(img.slug || img.file);

        const svgContent = generateSVG(800, 600, title, description, color);

        fs.writeFileSync(fullPath, svgContent);
        console.log(`Generated placeholder: ${relPath}`);
        count++;
    });

    console.log(`\nSuccessfully generated ${count} placeholder images.`);
}

main();
