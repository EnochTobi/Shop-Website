document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
    setupQuantityControls();
});

async function loadProductDetails() {
    try {
        // Get product ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        // Fetch product details from the server
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        const product = await response.json();

        if (!response.ok) {
            throw new Error('Product not found');
        }

        // Update the UI with product details
        document.getElementById('product-image').src = `http://localhost:3000${product.image_path}`;
        document.getElementById('product-title').textContent = product.name;
        document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('stock').textContent = `In Stock: ${product.stock}`;

        // Setup add to cart button
        setupAddToCart(product);

    } catch (error) {
        console.error('Error loading product:', error);
        showError();
    }
}

function setupQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    quantityInput.addEventListener('change', (e) => {
        if (e.target.value < 1) e.target.value = 1;
    });
}

function setupAddToCart(product) {
    const addToCartBtn = document.getElementById('add-to-cart');
    const buyNowBtn = document.getElementById('buy-now');

    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        const size = document.getElementById('size').value;
        
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_path,
            quantity: quantity,
            size: size
        });

        showNotification('Added to cart successfully!');
    });

    buyNowBtn.addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        const size = document.getElementById('size').value;
        
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_path,
            quantity: quantity,
            size: size
        });

        window.location.href = '../Cart Page/cart.html';
    });
}

function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(i => i.id === item.id && i.size === item.size);

    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

function showError() {
    const container = document.querySelector('.product-detail-container');
    container.innerHTML = `
        <div class="error-message">
            <h2>Product Not Found</h2>
            <p>Sorry, the requested product could not be found.</p>
            <a href="shop.html" class="back-to-shop">Return to Shop</a>
        </div>
    `;
}

function createProductCard(product) {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    // Create URL with product data
    const productUrl = new URL("product-detail.html", window.location.href);
    productUrl.searchParams.set("id", product.id);
    productUrl.searchParams.set("name", product.name);
    productUrl.searchParams.set("price", product.price);
    productUrl.searchParams.set("image", encodeURIComponent(product.image));
    productUrl.searchParams.set("description", product.description || "");

    productCard.innerHTML = `
        <a href="${productUrl.toString()}" class="product-link">
            <img src="${product.image}" alt="${
    product.name
  }" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
        </a>
    `;

    return productCard;
}

document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById("product-grid");

    // Get product elements (you can get these from your HTML or another source)
    const productElements = document.querySelectorAll(".product-item");

    productElements.forEach((element) => {
        const product = {
            id: element.dataset.id,
            name: element.dataset.name,
            price: parseFloat(element.dataset.price),
            image: element.dataset.image,
            description: element.dataset.description,
        };

        productGrid.appendChild(createProductCard(product));
    });
});