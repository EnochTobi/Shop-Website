document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.querySelector(".login-register");
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (userData && userData.isLoggedIn) {
    loginLink.innerHTML = `
            <div class="user-profile">
                <div class="profile-icon">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="profile-dropdown">
                    <ul>
                        <li><a href="../Profile Page/profile.html">
                            <i class="fas fa-user"></i> My Profile</a></li>
                        <li><a href="../Cart Page/cart.html">
                            <i class="fas fa-shopping-cart"></i> My Cart</a></li>
                        <li><a href="../Orders Page/orders.html">
                            <i class="fas fa-box"></i> My Orders</a></li>
                        <li><a href="#" onclick="logout()">
                            <i class="fas fa-sign-out-alt"></i> Logout</a></li>
                    </ul>
                </div>
            </div>
        `;
  }
});
