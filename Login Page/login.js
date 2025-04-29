document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", handleLogin);
});

function handleLogin(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Check if elements exist
    if (!usernameInput || !passwordInput) {
        console.error('Login form elements not found');
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Basic validation
    if (!username || !password) {
        showError('Please enter both username and password');
        return;
    }

    // Simulate login (replace with your actual login logic)
    if (username === 'demo' && password === 'password') {
        const userData = {
            username: username,
            profileImage: '../assets/default-avatar.png'
        };

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
        
        showSuccess('Login successful!');
        setTimeout(() => {
            window.location.href = '../Home Page/home.html';
        }, 1500);
    } else {
        showError('Invalid username or password');
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const form = document.getElementById('loginForm');
    const existingError = form.querySelector('.error-message');
    
    if (existingError) {
        existingError.remove();
    }
    
    form.insertBefore(errorDiv, form.firstChild);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const form = document.getElementById('loginForm');
    form.insertBefore(successDiv, form.firstChild);
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        console.error('Login form not found');
    }
});
