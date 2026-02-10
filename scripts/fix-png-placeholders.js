const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public/case-studies');
const contentDir = path.join(__dirname, '../content/case-studies');

function main() {
    // 1. Scan for mis-named SVG files
    if (!fs.existsSync(publicDir)) return;

    const files = fs.readdirSync(publicDir);
    const renames = [];

    files.forEach(file => {
        if (file.endsWith('.png')) {
            const filePath = path.join(publicDir, file);
            // Read first 100 bytes
            const fd = fs.openSync(filePath, 'r');
            const buffer = Buffer.alloc(100);
            fs.readSync(fd, buffer, 0, 100, 0);
            fs.closeSync(fd);

            const contentHead = buffer.toString('utf8').trim();
            if (contentHead.startsWith('<svg')) {
                console.log(`Found SVG content in PNG file: ${file}`);
                const newName = file.replace(/\.png$/, '.svg');
                fs.renameSync(filePath, path.join(publicDir, newName));
                renames.push({
                    old: file,
                    new: newName
                });
            }
        }
    });

    // 2. Update markdown references
    if (renames.length > 0) {
        const mdFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

        mdFiles.forEach(mdFile => {
            const mdPath = path.join(contentDir, mdFile);
            let content = fs.readFileSync(mdPath, 'utf8');
            let changed = false;

            renames.forEach(rename => {
                // Determine the relative path used in markdown
                // This could be /case-studies/file.png or just file.png or public/case-studies/file.png
                // We'll simplisticly replace the filename
                if (content.includes(rename.old)) {
                    // Use global regex replace
                    const regex = new RegExp(rename.old.replace(/\./g, '\\.'), 'g');
                    content = content.replace(regex, rename.new);
                    changed = true;
                    console.log(`Updated reference in ${mdFile}: ${rename.old} -> ${rename.new}`);
                }
            });

            if (changed) {
                fs.writeFileSync(mdPath, content);
            }
        });
    } else {
        console.log('No disguised SVG files found.');
    }
}

main();
