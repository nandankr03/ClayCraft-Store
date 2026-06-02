async function signupUser(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName,
                email,
                password
            })
        });

        const data = await response.json();
        alert(data.message);
        
        window.location.href = "login.html";

    } catch (error) {
        console.error("Error:", error);
        alert("Server error. Simulating successful signup for demo.");
        window.location.href = "login.html";
    }
}
