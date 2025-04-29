document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  setupEventListeners();
});

function loadCart() {
  const cartItems = document.getElementById("cart-items");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button onclick="window.location.href='../Shop Page/shop.html'" 
                        class="continue-shopping">
                    Continue Shopping
                </button>
            </div>
        `;
    updateSummary(0, 0);
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item, index) => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-price">$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeItem(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `
    )
    .join("");

  updateCartTotal();
}

function updateQuantity(index, change) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity = Math.max(1, cart[index].quantity + change);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function updateCartTotal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 10 : 0; // Example shipping cost
  const total = subtotal + shipping;

  updateSummary(subtotal, shipping);
}

function updateSummary(subtotal, shipping) {
  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("shipping").textContent = `$${shipping.toFixed(2)}`;
  document.getElementById("total").textContent = `$${(
    subtotal + shipping
  ).toFixed(2)}`;
}

function setupEventListeners() {
  document.getElementById("checkout-btn").addEventListener("click", () => {
    // Add checkout logic here
    window.location.href = "../Checkout Page/checkout.html";
  });

  document.getElementById("continue-shopping").addEventListener("click", () => {
    window.location.href = "../Shop Page/shop.html";
  });
}
