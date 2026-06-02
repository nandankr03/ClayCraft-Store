const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'Frontend');

const newNavHTML = `  <nav id="mainNav">
    <div class="nav-container">
      <div class="logo" onclick="window.location='index.html'" style="cursor:pointer;">
        <img src="Images/pottery_hands_logo.png" alt="Claycraft Logo" class="logo-img">
        <span class="logo-text">Clay<span>Craft</span></span>
      </div>

      <div class="search-bar">
        <div class="search-wrapper">
          <input type="text" id="searchInput" placeholder="Search for products">
          <span id="clearSearchBtn" class="clear-btn">&#10006;</span>
          <button id="searchBtn" class="search-btn" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>
      </div>

      <ul id="navLinks" class="nav-main-links">
        <li><a href="index.html" class="nav-item">Home</a></li>
        <li><a href="about.html" class="nav-item">About</a></li>
        <li><a href="contact.html" class="nav-item">Contact</a></li>
        
        <!-- Logged Out Links -->
        <li class="nav-dropdown-container logged-out-only">
          <button class="nav-btn-login nav-dropdown-toggle">Login</button>
          <div class="nav-dropdown-menu">
            <a href="customer-login.html">Customer Login</a>
            <a href="artisan-login.html">Artisan Login</a>
            <a href="admin-login.html" id="adminLoginLink" style="display:none;">Admin Login</a>
          </div>
        </li>
        <li class="nav-dropdown-container logged-out-only">
          <button class="nav-btn-register nav-dropdown-toggle">Register</button>
          <div class="nav-dropdown-menu">
            <a href="customer-signup.html">Customer Register</a>
            <a href="artisan-signup.html">Artisan Register</a>
          </div>
        </li>
        
        <!-- Logged In Links -->
        <li class="nav-dropdown-container logged-in-only" style="display:none;">
          <button class="profile-toggle nav-dropdown-toggle" id="userNameDisplay">
             <span class="profile-name">User</span>
             <div class="profile-avatar">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
             </div>
          </button>
          <div class="nav-dropdown-menu">
            <a href="profile.html">My Profile</a>
            <a href="myOrder.html">My Orders</a>
            <a href="wishlist.html">Wishlist <span id="wishlist-count-dropdown" class="badge">0</span></a>
            <a href="cart.html">Cart <span id="cart-count-dropdown" class="badge">0</span></a>
            <div class="dropdown-divider"></div>
            <a href="#" onclick="logoutUser(event)">Logout</a>
          </div>
        </li>
      </ul>

      <!-- Mobile Toggles -->
      <div class="mobile-toggles">
        <button class="search-toggle-btn" id="searchToggleBtn" aria-label="Toggle search">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        <button class="hamburger" id="hamburgerBtn" aria-label="Toggle navigation">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>`;

// Fix HTML Files
const files = fs.readdirSync(frontendDir);
files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(frontendDir, file);
        let html = fs.readFileSync(filePath, 'utf8');

        // Replace old nav completely
        html = html.replace(/<nav id="mainNav">[\s\S]*?<\/nav>/, newNavHTML);

        // Remove old mobile search bar if it exists (since we'll handle it or we can keep it, but it's buggy)
        html = html.replace(/<div class="mobile-search-bar" id="mobileSearchBar">[\s\S]*?<\/div>/, '');

        // Remove the inline script block that had e.preventDefault logic and old mobile logic
        // It usually starts with (function () { const hamburger
        html = html.replace(/\(function\s*\(\)\s*\{\s*const hamburger[\s\S]*?\}\)\(\);/g, '');

        fs.writeFileSync(filePath, html);
        console.log('Fixed HTML:', file);
    }
});

// Fix CSS
const cssPath = path.join(frontendDir, 'style.css');
if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');

    // Remove old nav related css
    css = css.replace(/nav\s*\{[\s\S]*?\}/, '');
    css = css.replace(/nav ul\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.nav-main-links\s*\{[\s\S]*?\}/, '');
    css = css.replace(/nav ul li\s*\{[\s\S]*?\}/, '');
    css = css.replace(/nav ul li a\s*\{[\s\S]*?\}/, '');
    css = css.replace(/nav ul li a::after\s*\{[\s\S]*?\}/, '');
    css = css.replace(/nav ul li a:hover\s*\{[\s\S]*?\}/, '');
    css = css.replace(/nav ul li a:hover::after\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.dropdown\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.dropdown-content\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.dropdown:hover \.dropdown-content\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.dropdown-content a\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.dropdown-content a::after\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.dropdown-content a:hover\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.search-bar\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.search-wrapper\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.search-wrapper:focus-within\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.search-wrapper input\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.search-wrapper input::placeholder\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.search-wrapper button\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.search-wrapper button:hover\s*\{[\s\S]*?\}/, '');
    css = css.replace(/\.search-wrapper button:active\s*\{[\s\S]*?\}/, '');

    const newCSS = `
/* ========== MODERN E-COMMERCE NAVBAR ========== */
nav#mainNav {
  background: #ffffff;
  color: #333;
  position: relative;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #eaeaea;
  padding: 0;
  font-family: "Inter", sans-serif;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 24px;
  gap: 30px;
}

/* Search Bar */
.search-bar {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 600px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  background: #f0f2f5;
  border-radius: 50px;
  padding: 4px 6px 4px 20px;
  border: 1px solid transparent;
  width: 100%;
  position: relative;
  transition: all 0.3s ease;
}

.search-wrapper:focus-within {
  background: #ffffff;
  border-color: #e63946;
  box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.1);
}

.search-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  color: #333;
  font-family: "Inter", sans-serif;
  padding: 8px 0;
}

.search-wrapper input::placeholder {
  color: #888;
}

.clear-btn {
  display: none;
  cursor: pointer;
  color: #888;
  font-size: 14px;
  padding: 5px;
  margin-right: 5px;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #333;
}

.search-btn {
  background: #e63946;
  color: #fff;
  border: none;
  border-radius: 50px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
}

.search-btn:hover {
  background: #d62828;
}

/* Nav Links */
.nav-main-links {
  display: flex;
  align-items: center;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  text-decoration: none;
  color: #444;
  font-weight: 500;
  font-size: 15px;
  font-family: "Inter", sans-serif;
  transition: color 0.3s ease;
  padding: 8px 0;
}

.nav-item:hover {
  color: #e63946;
}

/* Dropdown styling */
.nav-dropdown-container {
  position: relative;
}

.nav-btn-login,
.nav-btn-register {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.nav-btn-login {
  background: transparent;
  color: #333;
  border-color: #ddd;
}

.nav-btn-login:hover {
  background: #f9f9f9;
  border-color: #ccc;
}

.nav-btn-register {
  background: #ffcc00;
  color: #111;
  border-color: #ffcc00;
}

.nav-btn-register:hover {
  background: #f5b900;
}

/* Profile Toggle */
.profile-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 50px;
  transition: background 0.2s;
}

.profile-toggle:hover {
  background: #f0f2f5;
}

.profile-name {
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: #333;
}

.profile-avatar {
  background: #e63946;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dropdown Menu */
.nav-dropdown-menu {
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  background: #ffffff;
  min-width: 220px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  border: 1px solid #eaeaea;
  padding: 8px 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 1001;
}

.nav-dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.nav-dropdown-menu a {
  display: block;
  padding: 12px 20px;
  color: #444;
  text-decoration: none;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-dropdown-menu a:hover {
  background: #f8f9fa;
  color: #e63946;
  padding-left: 24px;
}

.dropdown-divider {
  height: 1px;
  background: #eee;
  margin: 6px 0;
}

.mobile-toggles {
  display: none;
}

@media (max-width: 992px) {
  .search-bar { display: none; }
  .nav-main-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: #fff;
    flex-direction: column;
    align-items: flex-start;
    padding: 80px 30px;
    transition: right 0.3s ease;
    z-index: 1000;
    box-shadow: -5px 0 20px rgba(0,0,0,0.1);
  }
  .nav-main-links.open { right: 0; }
  .mobile-toggles { display: flex; align-items: center; gap: 15px; }
  
  .nav-dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    border: none;
    background: #f9f9f9;
    padding: 0;
    margin-top: 10px;
    display: none;
  }
  .nav-dropdown-menu.show { display: block; }
  
  .nav-btn-login, .nav-btn-register { width: 100%; text-align: left; }
}
`;
    // Insert new CSS at the top after imports or at body
    css = css.replace(/body\s*\{/, newCSS + '\nbody {');
    fs.writeFileSync(cssPath, css);
    console.log('Fixed style.css');
}

// Fix script.js
const scriptPath = path.join(frontendDir, 'script.js');
if (fs.existsSync(scriptPath)) {
    let script = fs.readFileSync(scriptPath, 'utf8');

    // Remove old search logic
    script = script.replace(/const desktopSearchInput = document\.getElementById\("searchInput"\);[\s\S]*?\}\);[\s\S]*?\}\);/g, '');
    
    // Remove old user display logic
    script = script.replace(/if \(userNameDisplay\) \{[\s\S]*?\}\)\;/g, '');

    const newJS = `
  // ── Modern Navbar Logic ──────────────────────────────────────
  const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const menu = this.nextElementSibling;
      const isShowing = menu.classList.contains('show');
      
      // Close all other dropdowns
      document.querySelectorAll('.nav-dropdown-menu.show').forEach(m => {
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
    if (!e.target.closest('.nav-dropdown-container')) {
      document.querySelectorAll('.nav-dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
      });
    }
  });

  // Search Logic
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const searchBtn = document.getElementById("searchBtn");

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

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", function() {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      this.style.display = "none";
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", function() {
      if (searchInput && window.searchProducts) {
        window.searchProducts(searchInput.value);
      }
    });
  }
  
  // Mobile nav toggles
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navLinks = document.getElementById("navLinks");
  if(hamburgerBtn && navLinks) {
      hamburgerBtn.addEventListener("click", () => {
          navLinks.classList.toggle("open");
      });
  }
`;
    // Insert new JS into script.js right after DOMContentLoaded
    script = script.replace(/document\.addEventListener\("DOMContentLoaded", \(\) => \{/, 'document.addEventListener("DOMContentLoaded", () => {\n' + newJS);
    
    // Fix username display
    script = script.replace(/if \(user\) \{/, `if (user) {
      const profileNameEl = document.querySelector('.profile-name');
      if (profileNameEl) {
          let displayName = user.split('@')[0];
          try {
              const profile = JSON.parse(localStorage.getItem("userProfile_" + user));
              if (profile && profile.name) displayName = profile.name.split(' ')[0];
          } catch(e) {}
          profileNameEl.textContent = displayName;
      }`);

    fs.writeFileSync(scriptPath, script);
    console.log('Fixed script.js');
}

console.log("Complete!");
