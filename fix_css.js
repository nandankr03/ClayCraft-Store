const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'Frontend', 'style.css');

const appendCss = `
/* Unified Nav Fixes for Desktop */
@media (min-width: 993px) {
  #navLinks {
    position: static !important;
    flex-direction: row !important;
    width: auto !important;
    height: auto !important;
    box-shadow: none !important;
    padding: 0 !important;
    overflow-y: visible !important;
    background: transparent !important;
  }
  
  #navLinks li {
    border-bottom: none !important;
    width: auto !important;
  }
  
  #navLinks .dropdown-content {
    position: absolute !important;
    border-left: none !important;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
    border-radius: 8px !important;
  }
  
  .hamburger {
    display: none !important;
  }
  .search-toggle-btn {
    display: none !important;
  }
  .mobile-icons {
    display: none !important;
  }
}
`;

fs.appendFileSync(cssPath, appendCss, 'utf8');
console.log("Appended desktop CSS fix to style.css");
