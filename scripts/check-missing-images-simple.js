const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content/case-studies');
const publicDir = path.join(__dirname, '../public');

function parseYaml(yamlString) {
    const result = {};
    const currentKeyOrder = [];
    const lines = yamlString.split('\n');
    let currentKey = null;
    let indentLevel = 0;

    // Very hacky parse for now. Or better, just search for `images:` block.
    // Actually, let's just use regex to extract the `images:` block since we only care about that.

    const imagesMatch = yamlString.match(/images:\s*\n((?:\s+-\s+src:.*\n(?:\s+.*\n)*?)*)/s);
    if (!imagesMatch) return [];

    const imagesBlock = imagesMatch[1];
    const items = imagesBlock.split(/^\s+-\s+/m).filter(Boolean);

    return items.map(item => {
        const srcMatch = item.match(/src:\s*(.*)/);
        const altMatch = item.match(/alt:\s*(.*)/);
        const typeMatch = item.match(/type:\s*(.*)/);
        const captionMatch = item.match(/caption:\s*(.*)/);

        return {
            src: srcMatch ? srcMatch[1].trim() : null,
            alt: altMatch ? altMatch[1].trim() : null,
            type: typeMatch ? typeMatch[1].trim() : null,
            caption: captionMatch ? captionMatch[1].trim() : null
        };
    });
}

function extractFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    return match ? match[1] : '';
}

function extractTitle(frontmatter) {
    const match = frontmatter.match(/title:\s*(.*)/);
    return match ? match[1].trim() : '';
}

function main() {
    const files = fs.readdirSync(contentDir);
    const missingImages = [];

    files.forEach(file => {
        if (!file.endsWith('.md')) return;

        const content = fs.readFileSync(path.join(contentDir, file), 'utf8');
        const frontmatter = extractFrontmatter(content);
        if (!frontmatter) return;

        const images = parseYaml(frontmatter);
        const title = extractTitle(frontmatter);

        if (images.length > 0) {
            images.forEach(img => {
                if (!img.src) return;

                let src = img.src;
                // Handle path relative to public dir
                // e.g. /case-studies/foo.svg -> public/case-studies/foo.svg
                const relativePath = src.startsWith('/') ? src.substring(1) : src;
                const fullPath = path.join(publicDir, relativePath);

                // Check if file exists
                let exists = fs.existsSync(fullPath);

                // If not found, check if a PNG version exists (since markdown says SVG but we might have PNG)
                if (!exists && src.endsWith('.svg')) {
                    const pngPath = fullPath.replace(/\.svg$/, '.png');
                    if (fs.existsSync(pngPath)) {
                        exists = true;
                    }
                }

                // Also check if user meant without extension (unlikely for file check but let's be safe)

                if (!exists) {
                    missingImages.push({
                        file: file,
                        src: src,
                        alt: img.alt,
                        caption: img.caption,
                        type: img.type,
                        title: title,
                        slug: file.replace('.md', '')
                    });
                }
            });
        }
    });

    console.log(JSON.stringify(missingImages, null, 2));
}

main();
