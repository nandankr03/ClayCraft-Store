const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'Frontend');
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldSearch1 = `<input type="text" id="searchInput" placeholder="Search for products">
        <button onclick="searchProducts(document.getElementById('searchInput').value)">Search</button>`;

const newSearch1 = `<input type="text" id="searchInput" placeholder="Search for products">
        <span id="clearSearchBtn" onclick="document.getElementById('searchInput').value=''; this.style.display='none'; document.getElementById('searchInput').focus();" style="display:none; position:absolute; right: 65px; top: 50%; transform: translateY(-50%); cursor:pointer; font-size: 14px; color:#999; padding:5px;">&#10006;</span>
        <button onclick="searchProducts(document.getElementById('searchInput').value)" style="font-size:18px;">&#128269;</button>`;

const oldSearch2 = `<input type="text" id="mobileSearchInput" placeholder="Search products...">
        <button onclick="searchProducts(document.getElementById('mobileSearchInput').value)">Search</button>`;

const newSearch2 = `<input type="text" id="mobileSearchInput" placeholder="Search for products">
        <span id="clearMobileSearchBtn" onclick="document.getElementById('mobileSearchInput').value=''; this.style.display='none'; document.getElementById('mobileSearchInput').focus();" style="display:none; position:absolute; right: 65px; top: 50%; transform: translateY(-50%); cursor:pointer; font-size: 14px; color:#999; padding:5px;">&#10006;</span>
        <button onclick="searchProducts(document.getElementById('mobileSearchInput').value)" style="font-size:18px;">&#128269;</button>`;

const oldSearch3 = `<div class="search-wrapper" style="max-width: 400px;">`;
const newSearch3 = `<div class="search-wrapper" style="max-width: 400px; position: relative;">`;

const oldSearch4 = `<div class="search-wrapper">`;
const newSearch4 = `<div class="search-wrapper" style="position: relative;">`;

htmlFiles.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace desktop search
  if (content.includes('id="searchInput"')) {
    // try to match the general button replacement first
    content = content.replace(/<button[^>]*onclick="searchProducts\(document\.getElementById\('searchInput'\)\.value\)"[^>]*>Search<\/button>/g, `<button onclick="searchProducts(document.getElementById('searchInput').value)" style="font-size:18px;">&#128269;</button>`);
    
    // insert clear button if not exists
    if (!content.includes('clearSearchBtn')) {
      content = content.replace(/(<input type="text" id="searchInput"[^>]*>)/g, `$1\n        <span id="clearSearchBtn" onclick="document.getElementById('searchInput').value=''; this.style.display='none'; document.getElementById('searchInput').focus();" style="display:none; position:absolute; right: 65px; top: 50%; transform: translateY(-50%); cursor:pointer; font-size: 14px; color:#999; padding:5px;">&#10006;</span>`);
    }
  }

  // Replace mobile search
  if (content.includes('id="mobileSearchInput"')) {
    content = content.replace(/<button[^>]*onclick="searchProducts\(document\.getElementById\('mobileSearchInput'\)\.value\)"[^>]*>Search<\/button>/g, `<button onclick="searchProducts(document.getElementById('mobileSearchInput').value)" style="font-size:18px;">&#128269;</button>`);
    
    if (!content.includes('clearMobileSearchBtn')) {
      content = content.replace(/(<input type="text" id="mobileSearchInput"[^>]*>)/g, `$1\n        <span id="clearMobileSearchBtn" onclick="document.getElementById('mobileSearchInput').value=''; this.style.display='none'; document.getElementById('mobileSearchInput').focus();" style="display:none; position:absolute; right: 65px; top: 50%; transform: translateY(-50%); cursor:pointer; font-size: 14px; color:#999; padding:5px;">&#10006;</span>`);
    }
  }
  
  // ensure relative position on wrappers
  content = content.replace(/<div class="search-wrapper" style="max-width: 400px;">/g, newSearch3);
  content = content.replace(/<div class="search-wrapper">/g, newSearch4);
  // cleanup double relative if any
  content = content.replace(/position: relative; position: relative;/g, 'position: relative;');

  fs.writeFileSync(filePath, content, 'utf8');
});
console.log("HTML files updated for search UI");
