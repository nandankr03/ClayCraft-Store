const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'Frontend', 'style.css');
const jsPath = path.join(__dirname, 'Frontend', 'script.js');

// 1. Fix CSS
const cssFix = `
/* =========================================================
   FINAL NAVBAR & PROFILE OVERRIDES
   ========================================================= */

/* Center Search Bar perfectly */
nav#mainNav {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  height: 75px !important;
  padding: 0 40px !important;
}

nav#mainNav .search-bar {
  flex: 1 !important;
  display: flex !important;
  justify-content: center !important;
}

nav#mainNav .search-wrapper {
  max-width: 400px !important;
  width: 100% !important;
  border-radius: 25px !important;
  border: 1px solid #ddd !important;
  background: #fff !important;
  display: flex !important;
  align-items: center !important;
  overflow: hidden !important;
  padding: 0 !important;
}

nav#mainNav .search-wrapper input {
  flex: 1 !important;
  border: none !important;
  outline: none !important;
  padding: 10px 15px !important;
  background: transparent !important;
}

nav#mainNav .search-wrapper button {
  background: transparent !important;
  border: none !important;
  color: #555 !important;
  padding: 0 15px !important;
  cursor: pointer !important;
  font-size: 18px !important;
}

/* Remove Clear search box weird padding issues */
#clearSearchBtn, #clearMobileSearchBtn {
  position: static !important;
  margin-right: 5px !important;
  transform: none !important;
}

/* 2. Login as text, Register as button */
#navLinks.nav-main-links {
  gap: 20px !important;
}

#navLinks.nav-main-links > li:nth-child(4) > a.nav-item {
  border: none !important;
  background: transparent !important;
  color: #333 !important;
  font-weight: 500 !important;
  padding: 8px 12px !important;
}
#navLinks.nav-main-links > li:nth-child(4) > a.nav-item:hover {
  color: #e63946 !important;
}

#navLinks.nav-main-links > li:nth-child(5) > a.nav-item {
  background: #e63946 !important;
  border: none !important;
  border-radius: 20px !important;
  padding: 8px 24px !important;
  color: #fff !important;
  font-weight: 600 !important;
}
#navLinks.nav-main-links > li:nth-child(5) > a.nav-item:hover {
  background: #d62828 !important;
}

/* 3. Dropdown styling without hover flickering */
#navLinks .dropdown-content {
  position: absolute !important;
  top: 100% !important;
  right: 0 !important;
  display: none !important; /* ONLY controlled by JS */
  z-index: 9999 !important;
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
  min-width: 180px !important;
  background: #fff !important;
  border-radius: 8px !important;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15) !important;
  margin-top: 10px !important;
}

#navLinks .dropdown-content.show-dropdown {
  display: block !important;
}

#navLinks.nav-main-links > li.dropdown:hover .dropdown-content {
  display: none !important; /* Stop hover flickering */
}
#navLinks.nav-main-links > li.dropdown:hover .dropdown-content.show-dropdown {
  display: block !important; /* Only let JS class control it */
}

.profile-avatar {
  cursor: pointer !important;
}
`;

fs.appendFileSync(cssPath, cssFix, 'utf8');

// 2. Fix JS
let jsContent = fs.readFileSync(jsPath, 'utf8');
// Clean up existing listener block to prevent multiple bindings and ensure strict logic
jsContent = jsContent.replace(/userNameDisplay\.addEventListener\('click'[\s\S]*?\}\);[\s\S]*?document\.addEventListener\('click', function\(e\) \{[\s\S]*?userNameDisplay\.nextElementSibling\.classList\.remove\('show-dropdown'\);[\s\S]*?\}\);/m, 
`// Profile Click Handler
          // Remove old listeners by cloning
          const newUserNameDisplay = userNameDisplay.cloneNode(true);
          userNameDisplay.parentNode.replaceChild(newUserNameDisplay, userNameDisplay);
          
          newUserNameDisplay.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              const dropdown = this.nextElementSibling;
              if (dropdown) {
                  dropdown.classList.toggle('show-dropdown');
              }
          });
          
          document.addEventListener('click', function(e) {
              const dropdown = newUserNameDisplay.nextElementSibling;
              if (dropdown && !newUserNameDisplay.contains(e.target)) {
                  dropdown.classList.remove('show-dropdown');
              }
          });`);

fs.writeFileSync(jsPath, jsContent, 'utf8');

console.log("Applied final fixes to JS and CSS.");
