function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = JSON.parse(localStorage.getItem('userData'));
    const navProfileElement = document.getElementById('nav-profile');

    if (isLoggedIn && userData && navProfileElement) {
        navProfileElement.innerHTML = `
            <div class="profile-container">
                <img src="${userData.profileImage || '../assets/default-avatar.png'}" alt="Profile" class="profile-image">
                <span class="profile-name">${userData.username}</span>
                <div class="profile-dropdown">
                    <a href="../Profile Page/profile.html">My Profile</a>
                    <a href="../Orders Page/orders.html">My Orders</a>
                    <button onclick="logout()" class="logout-btn">Logout</button>
                </div>
            </div>`;
    } else if (navProfileElement) {
        navProfileElement.innerHTML = `
            <a href="../Login Page/login.html">Login/Register</a>`;
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    window.location.href = '../Home Page/home.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', checkLoginStatus);