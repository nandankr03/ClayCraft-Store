// ── Shared Products Catalog ─────────────────────────────────────────────────
// Single source of truth for all static products, used by search, cart, etc.
const ALL_PRODUCTS = [
  { id: 1,  name: "Blue Glazed Coffee Mug",            artisan: "Ramesh Kumar",  price: 349,  image: "Images/BlueGlazedCoffeeMug.jpg" },
  { id: 2,  name: "Handmade Clay Pot",                 artisan: "Sita Devi",     price: 899,  image: "Images/HandMadeClayPot.jpg" },
  { id: 3,  name: "Sandstone Sculpture",               artisan: "Arjun Yadav",   price: 2499, image: "Images/Sandstone Sculpture.jpg" },
  { id: 4,  name: "Decorative Vase",                   artisan: "Radha Mishra",  price: 1299, image: "Images/DecorativeVase.jpg" },
  { id: 5,  name: "Hand-Painted Tall Decorative Vase", artisan: "Local Artisan", price: 399,  image: "Images/HandPaintedTallDecorativeVase.jpg" },
  { id: 6,  name: "Owl Sculpture",                     artisan: "Local Artisan", price: 1599, image: "Images/OwlSculpture.jpg" },
  { id: 7,  name: "HandCrafted Elephant Sculpture",    artisan: "Local Artisan", price: 499,  image: "Images/HandCraftedElephantSculpture.jpg" },
  { id: 8,  name: "HandMade Pottery Ketal",            artisan: "Local Artisan", price: 599,  image: "Images/HandmadePotteryKetal.jpg" },
  { id: 9,  name: "HandCrafted Matka",                 artisan: "Local Artisan", price: 549,  image: "Images/HandCraftedMatka.jpg" },
  { id: 10, name: "Modern Clay Flower Bottle Vase",    artisan: "Local Artisan", price: 699,  image: "Images/ModernClayFlowerBottleVase.jpg" },
  { id: 11, name: "HandMade Pottery Cup",              artisan: "Local Artisan", price: 349,  image: "Images/HandMade Pottery Cup.jpg" },
  { id: 12, name: "HandMade Clay Ganesh Idol",         artisan: "Local Artisan", price: 449,  image: "Images/Handmade clay Ganesh Idol.jpg" },
  { id: 13, name: "Modern Decorative Vase",            artisan: "Local Artisan", price: 299,  image: "Images/Modern Decorative Vase.jpg" },
  { id: 14, name: "Dolphin Shaped Decorative Pot",     artisan: "Local Artisan", price: 369,  image: "Images/Dolphin Shaped Decorative Pot.jpg" },
  { id: 15, name: "Stylish Kitchenware Set",           artisan: "Local Artisan", price: 449,  image: "Images/Stylish Kitchenware Set.jpg" },
  { id: 16, name: "Traditional Clay Idol",             artisan: "Local Artisan", price: 459,  image: "Images/Traditional Clay Idol.jpg" },
  { id: 17, name: "HandMade Panda Sculpture",          artisan: "Local Artisan", price: 499,  image: "Images/HandMade Panda Sculpture.jpg" },
  { id: 18, name: "HandCrafted Clay Sculpture",        artisan: "Local Artisan", price: 469,  image: "Images/HandCrafted Clay Sculpture.jpg" },
  { id: 19, name: "Hanging Bells",                     artisan: "Local Artisan", price: 599,  image: "Images/Hanging Bells.jpg" },
  { id: 20, name: "HandCrafted Kitchenware Set",       artisan: "Local Artisan", price: 799,  image: "Images/HandCrafted Kitchenware Set.jpg" },
  { id: 21, name: "Stylish Handmade Vase",             artisan: "Local Artisan", price: 1199, image: "Images/Stylish Handmade Vase.jpg" },
  { id: 22, name: "HandCrafted Jungle Tiles",          artisan: "Local Artisan", price: 899,  image: "Images/HandCrafted Jungle Tiles.jpg" },
  { id: 23, name: "Handmade Clay Flower Pot",          artisan: "Local Artisan", price: 749,  image: "Images/Handmade Clay Flower Pot.jpg" },
  { id: 24, name: "Handmade Clay & Ceramic Collection",artisan: "Local Artisan", price: 1199, image: "Images/Handmade Clay & Ceramic Collection.jpg" },
  { id: 25, name: "ClayArtistry",                      artisan: "Local Artisan", price: 1499, image: "Images/ClayArtistry.jpg" }
];

// Merge static products with any admin-approved custom products from localStorage
function getAllProducts() {
  const custom = JSON.parse(localStorage.getItem('customProducts') || '[]');
  return [...ALL_PRODUCTS, ...custom];
}

// ── Cart UI Helpers ────────────────────────────────────────────────────────
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badge = document.getElementById('cart-count');
  const dropdownBadge = document.getElementById('cart-count-dropdown');
  if (badge) badge.textContent = total;
  if (dropdownBadge) dropdownBadge.textContent = total;
}

// ── Add to Cart ───────────────────────────────────────────────────────────────
function addToCart(productId) {
  const product = getAllProducts().find(p => String(p.id) === String(productId));
  if (!product) return;
  
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingIndex = cart.findIndex(i => String(i.id) === String(productId));
  
  if (existingIndex > -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
  } else {
    cart.push({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      image: product.image, 
      quantity: 1 
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  
  if (typeof showWishlistToast === 'function') {
    showWishlistToast(product.name + ' added to cart!', '🛒');
  } else if (typeof showToast === 'function') {
    showToast(product.name + ' added to cart!', '🛒');
  } else {
    // Fallback if no toast is available on the current page
    // alert(product.name + ' added to cart!');
  }
}

// ── Buy Now ───────────────────────────────────────────────────────────────────
function buyNow(productId) {
  const product = getAllProducts().find(p => p.id === productId);
  if (!product) return;
  if (!localStorage.getItem('loggedInUser')) {
    localStorage.setItem('intendedUrl', 'payment.html');
    localStorage.setItem('paymentProduct', JSON.stringify(product));
    localStorage.setItem('checkoutType', 'buyNow');
    alert('Please sign up or login first to buy products.');
    window.location.href = 'customer-signup.html';
    return;
  }
  localStorage.setItem('paymentProduct', JSON.stringify(product));
  localStorage.setItem('checkoutType', 'buyNow');
  window.location.href = 'payment.html';
}

// ── Search Products ───────────────────────────────────────────────────────────
// Renders matching products into #searchresults container on search.html
window.searchProducts = function(query) {
  if (!query || !query.trim()) return;
  const q = query.trim().toLowerCase();
  const allProducts = getAllProducts();
  const results = allProducts.filter(p => p.name.toLowerCase().includes(q));

  const container = document.getElementById('searchresults');
  if (!container) return;

  const titleEl = document.getElementById('search-page-title');

  if (results.length === 0) {
    if (titleEl) titleEl.textContent = 'No Results Found';
    container.innerHTML = `
      <div style="text-align:center; padding:60px 20px;">
        <p style="font-size:60px; margin-bottom:20px;">🔍</p>
        <h2 style="font-family:'Poppins',sans-serif; color:#333; margin-bottom:10px;">No products found for "${query.trim()}"</h2>
        <p style="font-family:'Inter',sans-serif; color:#888; font-size:15px;">Try searching for something else.</p>
        <a href="index.html" style="display:inline-block; margin-top:25px; background:#e63946; color:#fff; padding:12px 30px; border-radius:50px; text-decoration:none; font-family:'Inter',sans-serif; font-weight:600;">Browse All Products</a>
      </div>`;
    return;
  }

  if (titleEl) titleEl.textContent = `Search Results for "${query.trim()}"`;

  container.innerHTML = '<div class="product-list">' + results.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" onerror="this.src='Images/HandMadeClayPot.jpg'">
      <h3>${p.name}</h3>
      <p class="price">₹ ${Number(p.price).toLocaleString('en-IN')}</p>
      <div class="buttons">
        <button class="cart-btn" onclick="addToCart(${p.id})">Add to Cart</button>
        <button class="buy-btn" onclick="buyNow(${p.id})">Buy Now</button>
      </div>
    </div>`).join('') + '</div>';
};


document.addEventListener("DOMContentLoaded", () => {

  // ── DROPDOWN (Login / Register / Profile) ─────────────────────────────
  // Use event delegation on document for reliable dropdown toggle
  document.addEventListener('click', function (e) {
    const toggle = e.target.closest('.dropdown-toggle');

    if (toggle) {
      e.preventDefault();
      e.stopPropagation();

      const parentDropdown = toggle.closest('.dropdown');
      const menu = parentDropdown ? parentDropdown.querySelector('.dropdown-menu') : null;

      if (!menu) return;

      // Close all OTHER dropdown menus first
      document.querySelectorAll('.dropdown-menu.show').forEach(m => {
        if (m !== menu) m.classList.remove('show');
      });

      // Toggle current dropdown
      menu.classList.toggle('show');
      return;
    }

    // If click is NOT inside any dropdown, close all
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
      });
    }
  });


  // ── SEARCH FIX ────────────────────────────────────────────────────────
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const searchBtn = document.getElementById("searchBtn");

  function triggerSearch(query) {
    if (!query || !query.trim()) return;

    if (window.location.pathname.includes('search.html') && typeof window.searchProducts === "function") {
      window.searchProducts(query);
    } else {
      window.location.href = `search.html?q=${encodeURIComponent(query.trim())}`;
    }
  }

  // Make triggerSearch globally accessible for inline onclick fallbacks
  window.triggerSearch = triggerSearch;

  if (searchInput) {
    // ENTER key
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        triggerSearch(this.value);
      }
    });

    // clear button visibility
    searchInput.addEventListener("input", function () {
      if (clearSearchBtn) {
        clearSearchBtn.style.display = this.value.length > 0 ? "block" : "none";
      }
    });
  }

  // search button click (by ID)
  if (searchBtn) {
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (searchInput) triggerSearch(searchInput.value);
    });
  }


  // ── USER PROFILE DISPLAY ─────────────────────────────────────────────
  const user = localStorage.getItem("loggedInUser");
  const profileNameEl = document.getElementById('userNameDisplay');

  if (user && profileNameEl) {
    document.querySelectorAll(".logged-out-only").forEach(el => el.style.display = 'none');
    document.querySelectorAll(".logged-in-only").forEach(el => el.style.display = 'block');

    let displayName = user.split('@')[0];
    try {
      const profile = JSON.parse(localStorage.getItem("userProfile_" + user));
      if (profile && profile.name) displayName = profile.name.split(' ')[0];
    } catch (e) { }

    profileNameEl.innerHTML = "Hi, " + displayName;
  } else {
    document.querySelectorAll(".logged-out-only").forEach(el => el.style.display = 'inline-block');
    document.querySelectorAll(".logged-in-only").forEach(el => el.style.display = 'none');
  }

  window.logoutUser = function (e) {
    if (e) e.preventDefault();
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    window.location.href = "index.html";
  };


  // ── SEARCH PAGE LOGIC ────────────────────────────────────────────────
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q');

  if (q && window.location.pathname.includes('search.html')) {
    const input = document.getElementById('searchInput');
    if (input) input.value = q;

    if (window.searchProducts) {
      window.searchProducts(q);
    }
  }


  // ── LIGHTBOX ─────────────────────────────────────────────────────────
  document.body.addEventListener("click", (e) => {
    const target = e.target;

    if (target && target.matches(".product-card img")) {
      openLightbox(target.src, target.alt || "");
    }

    if (target && target.id === "lightbox") {
      document.getElementById("lightbox")?.remove();
    }
  });

  function openLightbox(src, altText) {
    const existing = document.getElementById("lightbox");
    if (existing) existing.remove();

    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    Object.assign(lightbox.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.85)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      cursor: "pointer"
    });

    const img = document.createElement("img");
    img.src = src;
    img.alt = altText;
    Object.assign(img.style, {
      maxWidth: "90%",
      maxHeight: "90%",
      borderRadius: "10px"
    });

    img.addEventListener("click", (ev) => ev.stopPropagation());

    lightbox.appendChild(img);
    document.body.appendChild(lightbox);
  }

});