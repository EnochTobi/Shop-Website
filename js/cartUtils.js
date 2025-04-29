function setupCartIcon() {
    const cartIcon = document.getElementById("cart-icon");
    const cartDropdown = document.getElementById("cart-dropdown");

    if (!cartIcon || !cartDropdown) return;

    document.addEventListener("click", (e) => {
        if (!cartIcon.contains(e.target) && !cartDropdown.contains(e.target)) {
            cartDropdown.style.display = 'none';
        }
    });

    cartIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
    });
}

function updateCartDisplay() {
    const cartNotification = document.getElementById('cart-notification');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartNotification || !cartItems || !cartTotal) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
    const totalPrice = cart.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + (price * quantity);
    }, 0);

    cartNotification.textContent = totalItems;
    cartNotification.style.display = totalItems ? 'flex' : 'none';

    cartItems.innerHTML = cart.length === 0 
        ? '<div class="empty-cart">Your cart is empty</div>'
        : cart.map(item => `
            <div class="cart-item">
                <img src="${item.image_path || '../assets/placeholder.jpg'}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${(parseFloat(item.price) || 0).toFixed(2)} × ${item.quantity}</p>
                    <button onclick="removeFromCart(${item.id})" class="remove-item">Remove</button>
                </div>
            </div>
        `).join('');

    cartTotal.textContent = totalPrice.toFixed(2);
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.setItem('cart', JSON.stringify([]));
        updateCartDisplay();
        showNotification('Cart cleared successfully');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupCartIcon();
    updateCartDisplay();
});