const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'Frontend');

const htmlFiles = ['payment.html'];

const newNav = `  <nav id="mainNav">
    <div class="logo" onclick="window.location='index.html'" style="cursor:pointer;">
      <img src="Images/pottery_hands_logo.png" alt="Claycraft Logo" style="height:40px; width:40px; border-radius:6px; object-fit:cover;">
      <span style="background: linear-gradient(45deg, #e63946, #d68c45, #3a5a40); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">ClayCraft</span>
    </div>

    <!-- Desktop search bar -->
    <div class="search-bar">
      <div class="search-wrapper" style="max-width: 400px;">
        <input type="text" id="searchInput" placeholder="Search for products">
        <button onclick="searchProducts(document.getElementById('searchInput').value)">Search</button>
      </div>
    </div>

    <ul id="navLinks" class="nav-main-links" style="display:flex; align-items:center;">
      <li><a href="index.html" class="nav-item">Home</a></li>
      <li><a href="about.html" class="nav-item">About</a></li>
      <li><a href="contact.html" class="nav-item">Contact</a></li>
      
      <!-- Logged Out Links -->
      <li class="dropdown logged-out-only">
        <a href="#" class="nav-item">Login &#9662;</a>
        <div class="dropdown-content">
          <a href="customer-login.html">Customer Login</a>
          <a href="artisan-login.html">Artisan Login</a>
          <a href="admin-login.html" id="adminLoginLink" style="display:none;">Admin Login</a>
        </div>
      </li>
      <li class="dropdown logged-out-only">
        <a href="#" class="nav-item">Register &#9662;</a>
        <div class="dropdown-content">
          <a href="customer-signup.html">Customer Register</a>
          <a href="artisan-signup.html">Artisan Register</a>
        </div>
      </li>
      
      <!-- Logged In Links -->
      <li class="dropdown logged-in-only" style="display:none;">
        <a href="#" id="userNameDisplay" class="nav-item">Hi, User &#9662;</a>
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

htmlFiles.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to replace `<nav id="mainNav"> ... </nav>` completely (case insensitive)
  content = content.replace(/<nav id="mainNav">[\s\S]*?<\/nav>/i, newNav);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Updated " + file);
});
