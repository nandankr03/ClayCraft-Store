const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'Frontend');

// 1. Fix style.css
const styleCssPath = path.join(frontendDir, 'style.css');
if (fs.existsSync(styleCssPath)) {
    let css = fs.readFileSync(styleCssPath, 'utf8');
    
    // Fix nav
    css = css.replace(/nav\s*\{[\s\S]*?\}/, (match) => {
        let newMatch = match;
        // Make sure it has position relative and z-index 1000
        newMatch = newMatch.replace(/position:\s*sticky;/g, 'position: relative;');
        if (!newMatch.includes('z-index: 1000;')) {
            newMatch = newMatch.replace(/position:\s*relative;/, 'position: relative;\n  z-index: 1000;');
        }
        return newMatch;
    });

    // Fix hero
    css = css.replace(/\.hero\s*\{[\s\S]*?\}/, (match) => {
        let newMatch = match;
        // ensure z-index is lower
        if (!newMatch.includes('z-index:')) {
            newMatch = newMatch.replace(/position:\s*relative;/, 'position: relative;\n  z-index: 1;');
        }
        return newMatch;
    });

    fs.writeFileSync(styleCssPath, css);
    console.log('Fixed style.css');
}

// 2. Fix HTML files
const files = fs.readdirSync(frontendDir);
files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(frontendDir, file);
        let html = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        if (html.includes('<a href="#">Login &#9662;</a>')) {
            html = html.replace(/<a href="#">Login &#9662;<\/a>/g, '<a href="customer-login.html">Login &#9662;</a>');
            modified = true;
        }
        
        if (html.includes('<a href="#">Register &#9662;</a>')) {
            html = html.replace(/<a href="#">Register &#9662;<\/a>/g, '<a href="customer-signup.html">Register &#9662;</a>');
            modified = true;
        }

        if (html.includes('e.preventDefault();')) {
            // Find the mobile dropdown JS and remove the e.preventDefault();
            html = html.replace(/toggle\.addEventListener\('click',\s*function\s*\(e\)\s*\{\s*e\.preventDefault\(\);\s*const\s*content/g, 
            `toggle.addEventListener('click', function (e) {\n            if(window.innerWidth <= 768) { e.preventDefault(); }\n            const content`);
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, html);
            console.log('Fixed', file);
        }
    }
});
