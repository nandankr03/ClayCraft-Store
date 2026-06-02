const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'Frontend', 'style.css');

const modernNavCss = `
/* =========================================================
   MODERN NAVBAR & BUTTON STYLING (AMAZON/FLIPKART STYLE)
   ========================================================= */

/* 1. Navbar Container Layout */
nav#mainNav {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  height: 75px !important;
  padding: 0 40px !important;
  background: #ffffff !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08) !important;
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* 2. Logo Alignment */
nav#mainNav .logo {
  flex: 0 0 auto;
}

/* 3. Search Bar Centering & Sizing */
nav#mainNav .search-bar {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

nav#mainNav .search-wrapper {
  max-width: 500px !important;
  width: 100%;
  display: flex;
  background: #f1f3f6 !important;
  border-radius: 8px !important;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  padding: 0 !important;
}

nav#mainNav .search-wrapper:focus-within {
  border-color: #e63946;
  box-shadow: 0 0 0 2px rgba(230, 57, 70, 0.2);
  background: #fff !important;
}

nav#mainNav .search-wrapper input {
  flex: 1;
  padding: 12px 16px !important;
  border: none !important;
  background: transparent !important;
  outline: none !important;
  font-size: 15px;
  color: #333;
}

nav#mainNav .search-wrapper button {
  background: #e63946 !important;
  color: #fff !important;
  border: none !important;
  padding: 0 24px !important;
  font-weight: 600 !important;
  cursor: pointer;
  border-radius: 0 8px 8px 0 !important;
  transition: background 0.3s ease;
}

nav#mainNav .search-wrapper button:hover {
  background: #d62828 !important;
}

/* 4. Desktop Navigation Links (Right Side) */
@media (min-width: 993px) {
  #navLinks.nav-main-links {
    flex: 0 0 auto;
    display: flex !important;
    align-items: center !important;
    gap: 24px !important; /* Proper spacing between items */
    margin: 0 !important;
  }

  /* Regular Links */
  #navLinks.nav-main-links > li > a.nav-item {
    font-size: 15px !important;
    font-weight: 500 !important;
    color: #333 !important;
    text-decoration: none;
    padding: 8px 4px !important;
    position: relative;
    transition: color 0.3s ease;
  }
  
  #navLinks.nav-main-links > li > a.nav-item:hover {
    color: #e63946 !important;
  }
  
  /* Underline animation for regular text links */
  #navLinks.nav-main-links > li:not(.dropdown) > a.nav-item::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #e63946;
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  #navLinks.nav-main-links > li:not(.dropdown) > a.nav-item:hover::after {
    width: 100%;
  }

  /* 5. Button Styling for Login and Register */
  /* Remove default underline for buttons */
  #navLinks.nav-main-links > li.dropdown > a.nav-item::after {
    display: none !important;
  }

  /* Login Button (Outline) - Targeting 4th list item */
  #navLinks.nav-main-links > li:nth-child(4) > a.nav-item {
    border: 1px solid #e63946 !important;
    border-radius: 6px !important;
    padding: 8px 18px !important;
    color: #e63946 !important;
    font-weight: 600 !important;
    background: transparent !important;
    transition: all 0.2s ease !important;
  }

  #navLinks.nav-main-links > li:nth-child(4) > a.nav-item:hover {
    background: #fff0f1 !important;
  }

  /* Register Button (Filled) - Targeting 5th list item */
  #navLinks.nav-main-links > li:nth-child(5) > a.nav-item {
    background: #e63946 !important;
    border: 1px solid #e63946 !important;
    border-radius: 6px !important;
    padding: 8px 18px !important;
    color: #fff !important;
    font-weight: 600 !important;
    transition: all 0.2s ease !important;
  }

  #navLinks.nav-main-links > li:nth-child(5) > a.nav-item:hover {
    background: #d62828 !important;
    border-color: #d62828 !important;
    box-shadow: 0 4px 12px rgba(230, 57, 70, 0.2) !important;
  }

  /* Logged in User Dropdown Button */
  #navLinks.nav-main-links > li:nth-child(6) > a.nav-item {
    background: #f8f9fa !important;
    border: 1px solid #dee2e6 !important;
    border-radius: 6px !important;
    padding: 8px 18px !important;
    color: #333 !important;
    font-weight: 600 !important;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease !important;
  }

  #navLinks.nav-main-links > li:nth-child(6) > a.nav-item:hover {
    background: #e9ecef !important;
    border-color: #ced4da !important;
  }

  /* 6. Dropdown Menu Enhancements */
  #navLinks .dropdown-content {
    position: absolute !important;
    top: calc(100% + 10px) !important;
    right: 0 !important;
    min-width: 180px !important;
    background: #fff !important;
    border-radius: 8px !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
    border: 1px solid #eee !important;
    padding: 8px 0 !important;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
    z-index: 1050;
  }

  /* Invisible bridge to prevent hover loss */
  #navLinks .dropdown::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 15px;
  }

  #navLinks .dropdown:hover .dropdown-content {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  #navLinks .dropdown-content a {
    padding: 10px 20px !important;
    color: #444 !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    transition: background 0.2s ease, color 0.2s ease !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #navLinks .dropdown-content a:hover {
    background: #f8f9fa !important;
    color: #e63946 !important;
  }
}

/* Responsive Overrides */
@media (max-width: 992px) {
  nav#mainNav {
    padding: 0 20px !important;
    height: 65px !important;
  }
  
  /* Reset Search Bar for Mobile */
  nav#mainNav .search-bar {
    display: none; /* Hide desktop search on mobile */
  }

  #navLinks.nav-main-links {
    gap: 0 !important; /* Reset gap for mobile sidebar */
  }
  
  #navLinks.nav-main-links > li > a.nav-item {
    border: none !important;
    border-radius: 0 !important;
    background: transparent !important;
    color: #1a1a1a !important;
    padding: 14px 24px !important;
    font-weight: 500 !important;
    display: block !important;
    width: 100% !important;
  }
}
`;

fs.appendFileSync(cssPath, modernNavCss, 'utf8');
console.log("Appended modern CSS enhancements to style.css");
