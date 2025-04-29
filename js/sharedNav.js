function insertNavbar() {
  const navbar = `
        <div class="navbar">
            <div class="nav-toggle" id="navToggle">
                <i class="fas fa-bars"></i>
            </div>
            <div class="logo">
                <img src="/Home Images/logo.png" alt="Berachah Boutique Logo" width="125">
            </div>
            <nav>
                <ul>
                    <li><a href="/Home Page/home.html">Home</a></li>
                    <li><a href="/Shop Page/shop.html">Shop</a></li>
                    <li><a href="/About Page/about.html">About</a></li>
                    <li><a href="/Contact Page/contact.html">Contact</a></li>
                    <li class="cart-container">
                        <div class="cart-icon" id="cart-icon">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="cart-notification" id="cart-notification">0</span>
                        </div>
                        <div class="cart-dropdown" id="cart-dropdown">
                            <div class="cart-header">
                                Shopping Cart
                                <button onclick="clearCart()" class="clear-cart-btn" id="clear-cart-btn">
                                    <i class="fas fa-trash"></i> Clear All
                                </button>
                            </div>
                            <div class="cart-items" id="cart-items"></div>
                            <div class="cart-footer">
                                <div class="cart-total">
                                    <span>Total:</span>
                                    <span>$<span id="cart-total">0.00</span></span>
                                </div>
                                <div class="cart-buttons">
                                    <a href="/Cart Page/cart.html" class="checkout-btn">Checkout</a>
                                    <a href="/Cart Page/cart.html" class="view-cart-btn">View Cart</a>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li id="nav-profile" class="nav-profile"></li>
                </ul>
            </nav>
        </div>
    `;

  const header = document.querySelector("header .container");
  if (header) {
    header.innerHTML = navbar;
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  insertNavbar();
  setupMobileNav();
});

function setupMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.querySelector("nav ul");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }
}
