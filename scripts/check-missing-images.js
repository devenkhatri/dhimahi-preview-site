const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const contentDir = path.join(__dirname, '../content/case-studies');
const publicDir = path.join(__dirname, '../public');

// Helper to parse frontmatter manually since we might not have 'matter' or 'yaml-front-matter' installed
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
        try {
            return yaml.load(match[1]);
        } catch (e) {
            console.error('Error parsing YAML:', e);
            return null;
        }
    }
    return null;
}

function main() {
    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    const missingImages = [];

    files.forEach(file => {
        const content = fs.readFileSync(path.join(contentDir, file), 'utf8');
        const frontmatter = parseFrontmatter(content);

        if (frontmatter && frontmatter.images) {
            frontmatter.images.forEach(img => {
                const src = img.src; // e.g. /case-studies/foo.svg
                const fullPath = path.join(publicDir, src);

                // Check if file exists (try exact match first)
                let exists = fs.existsSync(fullPath);

                // If not found, check if a PNG version exists (since we generate PNGs)
                if (!exists && src.endsWith('.svg')) {
                    const pngPath = fullPath.replace('.svg', '.png');
                    if (fs.existsSync(pngPath)) {
                        exists = true;
                        // We should probably allow the markdown to point to SVG but use PNG if SVG is missing? 
                        // Or rather, the user wants "missing" images generated. 
                        // If a PNG exists, maybe it is NOT missing?

                        // However, the markdown references .svg. 
                        // If the request implies generating the images that are *missing*, 
                        // and the markdown asks for SVG but we have PNG, we might consider it "present" if the app handles it, 
                        // but physically the file at that path is missing. 

                        // Let's assume strict checking: if the file at path does not exist, it is missing.
                        // BUT, I'll note if a PNG alternative exists.
                    }
                }

                if (!exists) {
                    missingImages.push({
                        file: file,
                        src: src,
                        alt: img.alt,
                        caption: img.caption,
                        type: img.type,
                        title: frontmatter.title,
                        slug: file.replace('.md', ''),
                        challenge: frontmatter.challenge,
                        solution: frontmatter.solution,
                        results: frontmatter.results
                    });
                }
            });
        }
    });

    console.log(JSON.stringify(missingImages, null, 2));
}

main();
