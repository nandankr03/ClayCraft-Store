window.onload = function () {
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const intendedBuy = localStorage.getItem("intendedBuy");
    if (intendedBuy) {
      alert("Login successful! Proceeding to buy product ID: " + intendedBuy + "\n(This is a demo. Implement backend/payment later.)");
      localStorage.removeItem("intendedBuy");
    } else {
      alert("Login successful!");
    }
    
    window.location.href = "index.html";
  });
};