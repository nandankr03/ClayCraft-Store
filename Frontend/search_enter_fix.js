
  // Add Enter key event listener to search inputs
  const desktopSearchInput = document.getElementById("searchInput");
  if (desktopSearchInput) {
      desktopSearchInput.addEventListener("keypress", function(event) {
          if (event.key === "Enter") {
              event.preventDefault();
              if (window.searchProducts) window.searchProducts(this.value);
          }
      });
  }

  const mobileSearchInput = document.getElementById("mobileSearchInput");
  if (mobileSearchInput) {
      mobileSearchInput.addEventListener("keypress", function(event) {
          if (event.key === "Enter") {
              event.preventDefault();
              if (window.searchProducts) window.searchProducts(this.value);
          }
      });
  }
