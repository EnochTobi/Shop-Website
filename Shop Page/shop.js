const CONFIG = {
    IMAGE_BASE_URL: '/assets/images',
    CACHE_DURATION: 24 * 60 * 60 * 1000
};

import { db, colRef, storage } from "../js/firebaseConfig.js";
import { getDocs } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';

// Initialize state
let products = [];

// Make fetchProducts globally accessible
window.fetchProducts = async function fetchProducts() {
    try {
        const querySnapshot = await getDocs(colRef);
        products = [];
        
        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        displayProducts(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        displayError("Unable to load products. Please try again later.");
    }
}

function displayProducts(products) {
    const productGrid = document.getElementById("product-grid");
    if (!productGrid) return;

    productGrid.innerHTML = "";

    products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        // Add null check for image_path
        const imagePath = product.image_path 
            ? (product.image_path.startsWith("http") 
                ? product.image_path 
                : `${CONFIG.IMAGE_BASE_URL}/${product.image_path}`)
            : '../assets/placeholder.jpg';

        productCard.innerHTML = `
            <a href="product-detail.html?id=${product.id}" class="product-link">
                <img src="${imagePath}" 
                     alt="${product.name || 'Product'}" 
                     class="product-image"
                     onerror="this.src='../assets/placeholder.jpg'"
                     loading="lazy">
                <div class="product-info">
                    <h3 class="product-title">${product.name || 'Untitled Product'}</h3>
                    <p class="product-price">$${(parseFloat(product.price) || 0).toFixed(2)}</p>
                    ${product.stock && product.stock <= 5 
                        ? `<span class="low-stock">Only ${product.stock} left!</span>` 
                        : ''}
                </div>
            </a>
        `;

        productGrid.appendChild(productCard);
    });
}

function getCachedProducts() {
  const cached = localStorage.getItem("productsCache");
  if (!cached) return null;

  const { timestamp, data } = JSON.parse(cached);
  if (Date.now() - timestamp > CONFIG.CACHE_DURATION) {
    localStorage.removeItem("productsCache");
    return null;
  }

  return data;
}

function displayError(message) {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return;

  productGrid.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <button onclick="fetchProducts()" class="retry-btn">
                <i class="fas fa-sync"></i> Retry
            </button>
        </div>
    `;
}

// Add offline support
window.addEventListener("online", () => {
  fetchProducts();
  showNotification("Connection restored! Updating products...");
});

window.addEventListener("offline", () => {
  showNotification("You are offline. Showing cached products.");
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  setInterval(fetchProducts, 5 * 60 * 1000); // Refresh every 5 minutes
});

function retryFetch() {
  fetchProducts();
}

// Updated Cart functionality
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image_path: product.image_path,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay(); // Changed from updateCartNotification
  showNotification("Added to cart successfully!");
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
  showNotification("Item removed from cart");
}

function updateCartDisplay() {
  const cartNotification = document.getElementById("cart-notification");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (!cartNotification || !cartItems || !cartTotal) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce(
    (sum, item) => sum + (parseInt(item.quantity) || 0),
    0
  );
  const totalPrice = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  // Update notification badge
  cartNotification.textContent = totalItems;
  cartNotification.style.display = totalItems ? "flex" : "none";

  // Update cart items list
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <img src="${
                  item.image_path || "../assets/placeholder.jpg"
                }" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${parseFloat(item.price).toFixed(2)} × ${
          item.quantity
        }</p>
                    <button onclick="removeFromCart(${
                      item.id
                    })" class="remove-item">Remove</button>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Update total
  cartTotal.textContent = totalPrice.toFixed(2);
}

// Initialize cart display when page loads
document.addEventListener("DOMContentLoaded", () => {
  updateCartDisplay();
});

function setupCartIcon() {
  const cartIcon = document.getElementById("cart-icon");
  const cartDropdown = document.getElementById("cart-dropdown");

  if (!cartIcon || !cartDropdown) return;

  cartIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    cartDropdown.style.display =
      cartDropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!cartIcon.contains(e.target) && !cartDropdown.contains(e.target)) {
      cartDropdown.style.display = "none";
    }
  });
}

// Updated Search functionality
function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const searchButton = document.getElementById("searchButton");

  if (!searchInput || !categoryFilter || !searchButton) return;

  const debounceSearch = debounce(performSearch, 300);

  searchInput.addEventListener("input", debounceSearch);
  searchButton.addEventListener("click", () => performSearch());
  categoryFilter.addEventListener("change", () => performSearch());
}

async function performSearch() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  if (!searchInput || !categoryFilter) return;

  const query = searchInput.value.trim();
  const category = categoryFilter.value;

  try {
    const response = await fetch(
      `http://localhost:3000/api/products/search?query=${encodeURIComponent(
        query
      )}&category=${category}`
    );
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("Error searching products:", error);
    displayError();
  }
}

// Utility function for debouncing search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function clearCart() {
  if (confirm("Are you sure you want to remove all items from your cart?")) {
    localStorage.setItem("cart", JSON.stringify([]));
    updateCartDisplay();
    showNotification("Cart cleared successfully");
  }
}

// Add this to your existing showNotification function if you haven't already
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Add a warning display function
function displayWarning(message) {
  const notification = document.createElement("div");
  notification.className = "notification warning";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function setupMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('nav ul');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Add to your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    // ...existing initialization code...
    setupMobileNav();
});
