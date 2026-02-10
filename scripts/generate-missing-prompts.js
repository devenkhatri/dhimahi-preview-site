const fs = require('fs');
const path = require('path');

const missingImagesPath = path.join(__dirname, '..', 'missing_images_v2.json');
const outputDir = path.join(__dirname, '..', 'docs', 'generated');

function main() {
    if (!fs.existsSync(missingImagesPath)) {
        console.error('missing_images_v2.json not found');
        process.exit(1);
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const missingImages = JSON.parse(fs.readFileSync(missingImagesPath, 'utf8'));
    const grouped = {};

    missingImages.forEach(img => {
        if (!grouped[img.slug]) {
            grouped[img.slug] = {
                title: img.title,
                images: []
            };
        }
        grouped[img.slug].images.push(img);
    });

    let markdown = '# Missing Portfolio Image Prompts\n\n';
    markdown += 'Generated based on missing images in content.\n\n';
    markdown += '---\n\n';

    Object.keys(grouped).forEach(slug => {
        const group = grouped[slug];
        markdown += `## ${group.title}\n\n`;
        markdown += `**Slug**: \`${slug}\`\n\n`;

        group.images.forEach(img => {
            const type = img.type || 'image';
            markdown += `### ${type.charAt(0).toUpperCase() + type.slice(1)} Image\n\n`;

            // Construct a rich prompt
            let prompt = `Vector illustration of ${img.alt || 'concept'}. `;
            if (img.caption) prompt += `${img.caption}. `;
            prompt += `Style: professional flat vector illustration, clean lines, modern corporate palette (blues, teals, greys), isometric or 2D front view as appropriate.`;

            markdown += `**Concept**: ${img.alt}\n\n`;
            markdown += `**Prompt**:\n\`\`\`\n${prompt}\n\`\`\`\n\n`;

            // Suggest the target filename (using PNG)
            // If the src was likely a typo in markdown (referencing SVG), we suggest PNG.
            let filename = path.basename(img.src).replace('.svg', '.png');
            markdown += `**Target File**: \`public/case-studies/${filename}\`\n\n`;
            markdown += '---\n\n';
        });
    });

    const outputPath = path.join(outputDir, 'missing-portfolio-images-prompts.md');
    fs.writeFileSync(outputPath, markdown);
    console.log(`Generated prompts at ${outputPath}`);
}

main();
