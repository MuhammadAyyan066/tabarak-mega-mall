const API_URL = 'https://tabarak-mega-mall-backend-production.up.railway.app';

// Redirect if already authenticated
if (localStorage.getItem('adminToken')) {
    window.location.href = "admin.html";
}

function showAlert(msg, isSuccess = false) {
    const alertBox = document.getElementById('alertBox');
    const alertMsg = document.getElementById('alertMessage');
    const alertIcon = document.getElementById('alertIcon');

    alertMsg.innerText = msg;
    alertBox.className = isSuccess 
        ? "mb-4 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700"
        : "mb-4 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700";
    
    alertIcon.className = isSuccess ? "fa-solid fa-circle-check text-base" : "fa-solid fa-circle-exclamation text-base";
    alertBox.classList.remove('hidden');
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginBtn = document.getElementById('loginBtn');

    loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
    loginBtn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            
            showAlert("✅ Login Successful! Redirecting...", true);
            setTimeout(() => { window.location.href = "admin.html"; }, 800);
        } else {
            showAlert(data.message || "Invalid Username or Password!");
        }
    } catch (err) {
        showAlert("❌ Unable to connect to server! Make sure node app.js is running.");
    } finally {
        loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login to Dashboard';
        loginBtn.disabled = false;
    }
}

// Send OTP
async function handleSendOtp(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value.trim();
    const btn = document.getElementById('sendOtpBtn');

    btn.innerText = "Sending OTP Email...";
    btn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();

        if (res.ok) {
            document.getElementById('otpStep1Form').classList.add('hidden');
            document.getElementById('otpStep2Form').classList.remove('hidden');
        } else {
            showAlert("❌ " + data.message);
        }
    } catch (err) {
        alert("❌ Server Connection Error!");
    } finally {
        btn.innerText = "Send OTP Verification Code";
        btn.disabled = false;
    }
}

// Verify OTP & Reset Password
async function handleVerifyReset(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value.trim();
    const otp = document.getElementById('otpCode').value.trim();
    const newPassword = document.getElementById('newPass').value.trim();

    try {
        const res = await fetch(`${API_URL}/verify-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword })
        });
        const data = await res.json();

        if (res.ok) {
            alert("✅ Password Reset Successful! Login with your new password.");
            closeForgetModal();
        } else {
            alert("❌ " + data.message);
        }
    } catch (err) {
        alert("❌ Failed to reset password.");
    }
}

function openForgetModal() {
    document.getElementById('forgetModal').classList.remove('hidden');
    document.getElementById('otpStep1Form').classList.remove('hidden');
    document.getElementById('otpStep2Form').classList.add('hidden');
}

function closeForgetModal() {
    document.getElementById('forgetModal').classList.add('hidden');
}