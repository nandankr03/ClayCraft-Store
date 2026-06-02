const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'Frontend');

const originalNavHTML = `    <nav id="mainNav">
    <div class="logo" onclick="window.location='index.html'" style="cursor:pointer;">
      <img src="Images/pottery_hands_logo.png" alt="Claycraft Logo" style="height:40px; width:40px; border-radius:6px; object-fit:cover;">
      <span style="background: linear-gradient(45deg, #e63946, #d68c45, #3a5a40); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">ClayCraft</span>
    </div>

    <!-- Desktop search bar -->
    <div class="search-bar">
      <div class="search-wrapper" style="max-width: 500px; position: relative;">
        <input type="text" id="searchInput" placeholder="Search for products">
        <span id="clearSearchBtn" onclick="document.getElementById('searchInput').value=''; this.style.display='none'; document.getElementById('searchInput').focus();" style="display:none; position:absolute; right: 55px; top: 50%; transform: translateY(-50%); cursor:pointer; font-size: 14px; color:#999; padding:5px;">&#10006;</span>
        <button onclick="searchProducts(document.getElementById('searchInput').value)" style="font-size:18px; display:flex; align-items:center; justify-content:center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </div>
    </div>

    <ul id="navLinks" class="nav-main-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="contact.html">Contact</a></li>
      
      <!-- Logged Out Links -->
      <li class="dropdown logged-out-only">
        <a href="#" class="nav-dropdown-toggle">Login &#9662;</a>
        <div class="dropdown-content">
          <a href="customer-login.html">Customer Login</a>
          <a href="artisan-login.html">Artisan Login</a>
          <a href="admin-login.html" id="adminLoginLink" style="display:none;">Admin Login</a>
        </div>
      </li>
      <li class="dropdown logged-out-only">
        <a href="#" class="nav-dropdown-toggle">Register &#9662;</a>
        <div class="dropdown-content">
          <a href="customer-signup.html">Customer</a>
          <a href="artisan-signup.html">Artisan</a>
        </div>
      </li>
      
      <!-- Logged In Links -->
      <li class="dropdown logged-in-only" style="display:none;">
        <a href="#" id="userNameDisplay" class="nav-dropdown-toggle">Hi, User &#9662;</a>
        <div class="dropdown-content">
          <a href="profile.html">My Profile</a>
          <a href="myOrder.html">My Orders</a>
          <a href="wishlist.html" class="cart-link">Wishlist <span id="wishlist-count-dropdown" class="badge">0</span></a>
          <a href="cart.html" class="cart-link">Cart 🛒 <span id="cart-count-dropdown" class="badge">0</span></a>
          <a href="#" onclick="logoutUser(event)">Logout</a>
        </div>
      </li>
    </ul>

    <!-- Right-side icons: search toggle + hamburger -->
    <div style="display:flex; align-items:center; gap:6px;">
      <!-- Mobile search icon -->
      <button class="search-toggle-btn" id="searchToggleBtn" aria-label="Toggle search">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7 7 0 1 0 4.65 4.65a7 7 0 0 0 12 12z"/>
        </svg>
      </button>

      <!-- Hamburger -->
      <button class="hamburger" id="hamburgerBtn" aria-label="Toggle navigation">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>`;

const files = fs.readdirSync(frontendDir);
files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(frontendDir, file);
        let html = fs.readFileSync(filePath, 'utf8');

        // Replace the new nav with the original nav structure
        if (html.includes('<nav id="mainNav">')) {
            html = html.replace(/<nav id="mainNav">[\s\S]*?<\/nav>/, originalNavHTML);
        }

        fs.writeFileSync(filePath, html);
    }
});

const cssPath = path.join(frontendDir, 'style.css');
if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');

    // Remove the previously injected modern CSS
    css = css.replace(/\/\* ========== MODERN E-COMMERCE NAVBAR ========== \*\/[\s\S]*?(?=\/\*)/, '');
    css = css.replace(/nav#mainNav\s*\{[\s\S]*?\}/g, '');

    const originalCSS = `
/* ========== FIXED ORIGINAL NAVBAR CSS ========== */
nav#mainNav {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 15px 40px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(12px) !important;
  position: relative !important;
  z-index: 1000 !important;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05) !important;
  border-bottom: 1px solid #eaeaea;
}

.nav-main-links {
  display: flex !important;
  align-items: center !important;
  gap: 30px !important;
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
  flex: 1; /* Pushes to use space */
}

/* Push Login/Register to extreme right */
.nav-main-links .logged-out-only:first-of-type,
.nav-main-links .logged-in-only {
  margin-left: auto !important;
}

.nav-main-links > li > a {
  text-decoration: none !important;
  color: #333 !important;
  font-weight: 500 !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 15px !important;
  transition: color 0.2s !important;
  padding: 8px 4px !important;
}

.nav-main-links > li > a:hover {
  color: #e63946 !important;
}

/* Make Login and Register look like buttons */
.nav-main-links .logged-out-only:nth-last-child(2) > a {
  border: 1px solid #e63946 !important;
  border-radius: 6px !important;
  padding: 8px 18px !important;
  color: #e63946 !important;
  font-weight: 600 !important;
  display: inline-block;
}
.nav-main-links .logged-out-only:nth-last-child(2) > a:hover {
  background: #fff0f1 !important;
}

.nav-main-links .logged-out-only:last-child > a {
  background: #ffcc00 !important; /* Amazon style */
  color: #111 !important;
  border: 1px solid #ffcc00 !important;
  border-radius: 6px !important;
  padding: 8px 18px !important;
  font-weight: 600 !important;
  display: inline-block;
}
.nav-main-links .logged-out-only:last-child > a:hover {
  background: #f5b900 !important;
}

/* Search Bar Pill Style */
.search-bar {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 20px;
}
.search-wrapper {
  display: flex !important;
  align-items: center !important;
  background: #f0f2f5 !important;
  border-radius: 50px !important;
  padding: 0 0 0 20px !important;
  width: 100% !important;
  max-width: 500px !important;
  border: 1px solid transparent !important;
  transition: all 0.3s ease !important;
}
.search-wrapper:focus-within {
  background: #fff !important;
  border-color: #e63946 !important;
  box-shadow: 0 0 0 3px rgba(230,57,70,0.1) !important;
}
.search-wrapper input {
  flex: 1 !important;
  border: none !important;
  background: transparent !important;
  outline: none !important;
  padding: 10px 0 !important;
  font-size: 14px !important;
  font-family: 'Inter', sans-serif !important;
}
.search-wrapper button {
  background: #e63946 !important;
  border: none !important;
  color: white !important;
  height: 100% !important;
  padding: 10px 20px !important;
  border-radius: 0 50px 50px 0 !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Dropdown click functionality */
.dropdown { position: relative !important; }
.dropdown-content {
  position: absolute !important;
  top: calc(100% + 15px) !important;
  right: 0 !important;
  background: #fff !important;
  min-width: 200px !important;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15) !important;
  border-radius: 8px !important;
  padding: 8px 0 !important;
  opacity: 0 !important;
  visibility: hidden !important;
  transform: translateY(10px) !important;
  transition: all 0.2s ease !important;
  z-index: 1000 !important;
  display: block !important;
}
.dropdown-content.show {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateY(0) !important;
}
.dropdown-content a {
  display: block !important;
  padding: 10px 20px !important;
  color: #444 !important;
  text-decoration: none !important;
  font-size: 14px !important;
  border: none !important;
}
.dropdown-content a:hover {
  background: #f8f9fa !important;
  color: #e63946 !important;
}
`;

    css = originalCSS + css;
    fs.writeFileSync(cssPath, css);
}

const jsPath = path.join(frontendDir, 'script.js');
if (fs.existsSync(jsPath)) {
    let script = fs.readFileSync(jsPath, 'utf8');

    // Remove the previously injected modern JS
    script = script.replace(/\/\/ ── Modern Navbar Logic ──────────────────────────────────────[\s\S]*?(?=\/\/ ──)/, '');

    const originalJS = `
  // ── Fixed Click Logic for Original Navbar ──────────────────────────────────────
  const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const menu = this.nextElementSibling;
      if (!menu) return;
      const isShowing = menu.classList.contains('show');
      
      // Close all other dropdowns
      document.querySelectorAll('.dropdown-content.show').forEach(m => {
        m.classList.remove('show');
      });

      // Toggle current
      if (!isShowing) {
        menu.classList.add('show');
      }
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-content.show').forEach(menu => {
        menu.classList.remove('show');
      });
    }
  });

  // Search Logic
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");

  if (searchInput) {
    searchInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (window.searchProducts) window.searchProducts(this.value);
      }
    });

    searchInput.addEventListener("input", function() {
      if (clearSearchBtn) {
        clearSearchBtn.style.display = this.value.length > 0 ? "block" : "none";
      }
    });
  }

  // Profile Username Load
  const user = localStorage.getItem("loggedInUser");
  const profileNameEl = document.getElementById('userNameDisplay');
  if (user && profileNameEl) {
    document.querySelectorAll(".logged-out-only").forEach(el => el.style.display = 'none');
    document.querySelectorAll(".logged-in-only").forEach(el => el.style.display = 'block');
    
    let displayName = user.split('@')[0];
    try {
      const profile = JSON.parse(localStorage.getItem("userProfile_" + user));
      if (profile && profile.name) displayName = profile.name.split(' ')[0];
    } catch(e) {}
    profileNameEl.innerHTML = "Hi, " + displayName + " &#9662;";
  }
`;

    script = script.replace(/document\.addEventListener\("DOMContentLoaded", \(\) => \{/, 'document.addEventListener("DOMContentLoaded", () => {\n' + originalJS);
    fs.writeFileSync(jsPath, script);
}
console.log("Reverted and fixed!");
