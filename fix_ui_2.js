const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'Frontend', 'style.css');

const fixCss = `
/* =========================================================
   FURTHER UI ENHANCEMENTS & SEARCH BAR FIXES
   ========================================================= */

/* High Z-Index & Cursor for Profile Avatar */
#userNameDisplay {
  cursor: pointer !important;
}

#navLinks .dropdown-content {
  z-index: 9999 !important;
}

#navLinks .dropdown-content.show-dropdown {
  z-index: 9999 !important;
  display: flex !important;
  flex-direction: column !important;
  animation: smoothDropdown 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

@keyframes smoothDropdown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Restore 25px Rounded Search Bar */
nav#mainNav .search-wrapper {
  border-radius: 25px !important;
  padding-left: 8px !important;
}

nav#mainNav .search-wrapper button {
  border-radius: 25px !important;
  margin: 2px !important; /* to fit inside nicely */
  padding: 0 20px !important;
}

/* Adjust mobile search bar to match */
.mobile-search-bar .search-wrapper {
  border-radius: 25px !important;
}

.mobile-search-bar .search-wrapper button {
  border-radius: 25px !important;
}

/* Navbar overall layout guarantee */
nav#mainNav {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 20px !important;
}
`;

fs.appendFileSync(cssPath, fixCss, 'utf8');
console.log("Appended further fixes to style.css");
