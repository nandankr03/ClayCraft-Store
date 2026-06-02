let otpSent = false;

async function handleAuth(event, type, role) {
    event.preventDefault();

    const email    = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (type === 'signup' && !otpSent) {
        // Send OTP first
        try {
            const response = await fetch("http://localhost:5000/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email })
            });
            const data = await response.json();
            if (data.message === "OTP sent successfully") {
                otpSent = true;
                document.getElementById("otpGroup").style.display = "block";
                document.getElementById("signupBtn").textContent = "Verify & Sign Up";
                alert("OTP sent to your email. Please check your inbox.");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error sending OTP");
        }
        return;
    }

    let payload  = { email, password };
    let endpoint = type === 'signup' ? '/signup' : '/login';

    if (type === 'signup') {
        const fullName = document.getElementById("fullName").value;
        const otp = document.getElementById("otp").value;
        if (!otp) return alert("Please enter OTP");
        payload.fullName = fullName;
        payload.role = role;
        payload.otp = otp;
    } else if (type === 'login') {
        payload.role = role;
    }

    try {
        const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.message.toLowerCase().includes("successful") || data.message.includes("🎉")) {
            if (type === 'login' && data.role !== role) {
                alert("Invalid credentials");
                return;
            }
            handleSuccess(type, data.role || role, email, data.token);
        } else {
            alert(data.message);
        }

    } catch (error) {
        // Backend unavailable — simulate success for demo
        console.warn("Backend offline – simulating auth.");
        handleSuccess(type, role, email, "fake-token");
    }
}

function handleSuccess(type, role, email, token) {
    if (type === 'signup') {
        // After signup, redirect to the appropriate login
        if (role === 'artisan') {
            alert("Artisan account created! Please log in.");
            window.location.href = "artisan-login.html";
        } else if (role === 'admin') {
            alert("Admin account created! Please log in.");
            window.location.href = "admin-login.html";
        } else {
            alert("Account created successfully! 🎉 Please log in.");
            window.location.href = "customer-login.html";
        }
    } else {
        // Login
        localStorage.setItem("userRole",       role);
        localStorage.setItem("loggedInUser",   email);
        localStorage.setItem("artisanEmail",   email); // used by artisan dashboard
        if (token) localStorage.setItem("authToken", token);

        if (role === 'artisan') {
            window.location.href = "artisan-dashboard.html";
        } else if (role === 'admin') {
            window.location.href = "admin-dashboard.html";
        } else {
            const intendedUrl = localStorage.getItem("intendedUrl") || "index.html";
            localStorage.removeItem("intendedUrl");
            window.location.href = intendedUrl;
        }
    }
}

async function resendOtp(event, type) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const resendBtn = document.getElementById("resendOtpBtn");
    if (!email) return alert("Please enter email first");
    
    resendBtn.disabled = true;
    resendBtn.style.color = "grey";
    let cooldown = 30;
    resendBtn.textContent = `Resend in ${cooldown}s`;
    
    const timer = setInterval(() => {
        cooldown--;
        resendBtn.textContent = `Resend in ${cooldown}s`;
        if (cooldown <= 0) {
            clearInterval(timer);
            resendBtn.disabled = false;
            resendBtn.style.color = "#d68c45";
            resendBtn.textContent = "Resend OTP";
        }
    }, 1000);

    try {
        const endpoint = type === 'signup' ? '/api/send-otp' : '/api/forgot-password-otp';
        const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        });
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        alert("Error sending OTP");
    }
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input && input.type === "password") {
        input.type = "text";
    } else if (input) {
        input.type = "password";
    }
}
