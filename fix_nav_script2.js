const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'Frontend');

const files = fs.readdirSync(frontendDir);
files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(frontendDir, file);
        let html = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // More robust replacements for Login
        if (html.includes('<a href="#">Login &#9662;</a>')) {
            html = html.replace(/<a href="#">Login &#9662;<\/a>/g, '<a href="customer-login.html">Login &#9662;</a>');
            modified = true;
        }

        // More robust replacements for Register
        if (html.includes('<a href="#">Register &#9662;</a>')) {
            html = html.replace(/<a href="#">Register &#9662;<\/a>/g, '<a href="customer-signup.html">Register &#9662;</a>');
            modified = true;
        }

        // Remove e.preventDefault() for the dropdown toggle
        // Look for e.preventDefault() in the dropdown click listener
        if (html.includes("toggle.addEventListener('click'") && html.includes("e.preventDefault()")) {
            html = html.replace(/e\.preventDefault\(\);/g, "if(window.innerWidth <= 768) { e.preventDefault(); }");
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, html);
            console.log('Fixed', file);
        }
    }
});
