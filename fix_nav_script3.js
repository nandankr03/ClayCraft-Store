const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'Frontend');

const files = fs.readdirSync(frontendDir);
files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(frontendDir, file);
        let html = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // More robust replacements for Login, handling classes
        if (html.match(/<a[^>]*>Login &#9662;<\/a>/)) {
            html = html.replace(/<a([^>]*)href="#"([^>]*)>Login &#9662;<\/a>/g, '<a$1href="customer-login.html"$2>Login &#9662;</a>');
            modified = true;
        }

        // More robust replacements for Register, handling classes
        if (html.match(/<a[^>]*>Register &#9662;<\/a>/)) {
            html = html.replace(/<a([^>]*)href="#"([^>]*)>Register &#9662;<\/a>/g, '<a$1href="customer-signup.html"$2>Register &#9662;</a>');
            modified = true;
        }
        
        // Remove prevent default in script tags if it's there
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
