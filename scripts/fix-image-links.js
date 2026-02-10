const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content/case-studies');
const publicDir = path.join(__dirname, '../public/case-studies');

const mappings = {
    'ayurvedic-brand-digital-launch': 'ayurvedic-brand',
    'education-group-digital-transformation': 'education-group',
    'farming-cooperative-smart-agriculture': 'farming-cooperative',
    'hotel-chatbot-booking-automation': 'hotel-chatbot',
    'it-company-hr-automation': 'it-company-hr',
    'pharma-distributor-portfolio-rationalisation': 'app-rationalisation'
};

function main() {
    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

    files.forEach(file => {
        const filePath = path.join(contentDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        const slug = file.replace('.md', '');

        // Check if we have a mapping for this slug
        // Or if we can find a shorter replacement pattern

        // Strategy: Look for src: /case-studies/[slug]-[type].svg
        // Check if /public/case-studies/[short-slug]-[type].png exists
        // If so, replace.

        Object.keys(mappings).forEach(longSlug => {
            if (slug === longSlug) {
                const shortSlug = mappings[longSlug];

                ['before', 'after', 'result'].forEach(type => {
                    const oldSrc = `/case-studies/${longSlug}-${type}.svg`;
                    const newSrc = `/case-studies/${shortSlug}-${type}.png`;
                    const newFile = path.join(publicDir, `${shortSlug}-${type}.png`);

                    if (content.includes(oldSrc)) {
                        if (fs.existsSync(newFile)) {
                            console.log(`Fixing ${file}: ${oldSrc} -> ${newSrc}`);
                            content = content.replace(oldSrc, newSrc);
                            changed = true;
                        } else {
                            console.log(`Skipping ${file}: ${newFile} does not exist`);
                        }
                    }
                });
            }
        });

        if (changed) {
            fs.writeFileSync(filePath, content);
        }
    });
}

main();
