const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'Frontend', 'style.css');

const profileCss = `
/* =========================================================
   PROFILE ICON & LOGGED-IN UI IMPROVEMENTS
   ========================================================= */

/* Profile Avatar Styling */
.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f2f5;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

#navLinks.nav-main-links > li.logged-in-only > a.nav-item {
  background: transparent !important;
  border: none !important;
  padding: 4px 8px !important;
  display: flex !important;
  align-items: center !important;
  cursor: pointer !important;
}

#navLinks.nav-main-links > li.logged-in-only > a.nav-item:hover {
  background: transparent !important;
  border-color: transparent !important;
}

#navLinks.nav-main-links > li.logged-in-only > a.nav-item:hover .profile-avatar {
  background: #e63946;
  color: #fff;
  border-color: #e63946;
  box-shadow: 0 4px 10px rgba(230,57,70,0.3);
}

/* Disable Hover Dropdown for Profile */
@media (min-width: 993px) {
  #navLinks.nav-main-links > li.logged-in-only.dropdown:hover .dropdown-content {
    opacity: 0 !important;
    visibility: hidden !important;
    transform: translateY(-10px) !important;
  }
  
  /* Show Dropdown on Click Class */
  #navLinks .dropdown-content.show-dropdown {
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateY(0) !important;
  }
}
`;

fs.appendFileSync(cssPath, profileCss, 'utf8');
console.log("Appended profile CSS to style.css");
