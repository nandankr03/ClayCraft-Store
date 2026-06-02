const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'Frontend', 'style.css');

const finalFixCss = `
/* =========================================================
   SEARCH INPUT PADDING FOR CLEAR BUTTON
   ========================================================= */

#searchInput, #mobileSearchInput {
  padding-right: 35px !important;
}

#clearSearchBtn, #clearMobileSearchBtn {
  z-index: 1000 !important;
}
`;

fs.appendFileSync(cssPath, finalFixCss, 'utf8');
console.log("Appended final search padding to style.css");
