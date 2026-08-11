const API_URL = 'https://tabarak-mega-mall-backend-production.up.railway.app';

// Redirect if already authenticated
if (localStorage.getItem('adminToken')) {
  window.location.href = "admin.html";
}

function showAlert(msg, isSuccess = false) {
  const alertBox = document.getElementById('alertBox');
  const alertMsg = document.getElementById('alertMessage');
  const alertIcon = document.getElementById('alertIcon');

  if (!alertBox || !alertMsg) return;

  alertMsg.innerText = msg;

  alertBox.className = isSuccess
    ? "mb-4 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800"
    : "mb-4 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-800";

  if (alertIcon) {
    alertIcon.className = isSuccess
      ? "fa-solid fa-circle-check text-base text-emerald-600"
      : "fa-solid fa-circle-exclamation text-base text-rose-600";
  }

  alertBox.classList.remove('hidden');
}

// Handle Admin Login Submission
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

async function handleLogin(e) {
  e.preventDefault();

  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');

  const username = usernameInput ? usernameInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value.trim() : '';

  if (!username || !password) {
    showAlert('Username and password are required!');
    return;
  }

  if (loginBtn) {
    loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
    loginBtn.disabled = true;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem('adminToken', data.token);
      if (data.user) {
        localStorage.setItem('adminUser', JSON.stringify(data.user));
      }
      showAlert('✅ Login Successful! Redirecting...', true);
      setTimeout(() => {
        window.location.href = "admin.html";
      }, 800);
    } else {
      showAlert(data.message || 'Invalid Username or Password!');
    }
  } catch (err) {
    console.error('Login Error:', err);
    showAlert('❌ Unable to connect to server! Make sure backend is running.');
  } finally {
    if (loginBtn) {
      loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login to Dashboard';
      loginBtn.disabled = false;
    }
  }
}

// Send OTP for Password Reset
async function handleSendOtp(e) {
  e.preventDefault();
  const emailInput = document.getElementById('resetEmail');
  const btn = document.getElementById('sendOtpBtn');

  const email = emailInput ? emailInput.value.trim() : '';
  if (!email) return;

  if (btn) {
    btn.innerText = "Sending OTP Email...";
    btn.disabled = true;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById('otpStep1Form').classList.add('hidden');
      document.getElementById('otpStep2Form').classList.remove('hidden');
    } else {
      showAlert("❌ " + (data.message || "Failed to send OTP"));
    }
  } catch (err) {
    alert("❌ Server Connection Error!");
  } finally {
    if (btn) {
      btn.innerText = "Send OTP Verification Code";
      btn.disabled = false;
    }
  }
}

// Verify OTP & Reset Password
async function handleVerifyReset(e) {
  e.preventDefault();
  const email = document.getElementById('resetEmail').value.trim();
  const otp = document.getElementById('otpCode').value.trim();
  const newPassword = document.getElementById('newPass').value.trim();

  try {
    // Corrected Endpoint URL with /api/auth
    const res = await fetch(`${API_URL}/api/auth/verify-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp, newPassword })
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Password Reset Successful! Login with your new password.");
      closeForgetModal();
    } else {
      alert("❌ " + (data.message || "Reset failed"));
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