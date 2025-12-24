// Cart functionality
let cart = JSON.parse(localStorage.getItem('coreteachCart')) || [];

// Product data
const products = {
    computers: [
        { id: 1, name: "Gaming Pro PC", price: 1299, category: "computers" },
        { id: 2, name: "Office Workstation", price: 899, category: "computers" },
        { id: 3, name: "Streaming Rig", price: 1599, category: "computers" }
    ],
    laptops: [
        { id: 4, name: "CoreTeach Ultrabook", price: 1199, category: "laptops" },
        { id: 5, name: "Gaming Laptop Pro", price: 1499, category: "laptops" },
        { id: 6, name: "Student Edition", price: 699, category: "laptops" }
    ],
    parts: [
        { id: 7, name: "RTX 5070 GPU", price: 799, category: "parts" },
        { id: 8, name: "Ryzen AI CPU", price: 499, category: "parts" },
        { id: 9, name: "32GB RAM Kit", price: 129, category: "parts" }
    ]
};

// Add to cart function
function addToCart(productId, productName, productPrice, productCategory) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            category: productCategory,
            quantity: 1
        });
    }
    
    updateCart();
    
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            removeFromCart(productId);
        }
    }
    updateCart();
}

// Update cart display and localStorage
function updateCart() {
    localStorage.setItem('coreteachCart', JSON.stringify(cart));
    updateCartCount();
    
    // Update bag page if we're on it
    if (window.location.pathname.includes('bag.html')) {
        renderBagItems();
    }
}

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    }
}

// Render bag items
function renderBagItems() {
    const bagItemsContainer = document.getElementById('bag-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (!bagItemsContainer) return;
    
    if (cart.length === 0) {
        bagItemsContainer.innerHTML = '<p class="empty-bag">Your bag is empty</p>';
        if (subtotalElement) subtotalElement.textContent = '$0.00';
        if (taxElement) taxElement.textContent = '$0.00';
        if (totalElement) totalElement.textContent = '$0.00';
        return;
    }
    
    let subtotal = 0;
    bagItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'bag-item';
        itemElement.innerHTML = `
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>${item.category}</p>
                <p class="item-price">$${item.price}</p>
            </div>
            <div class="item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        bagItemsContainer.appendChild(itemElement);
    });
    
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + tax;
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your bag is empty!');
        return;
    }
    
    alert('Proceeding to checkout...');
    // In a real implementation, this would redirect to payment gateway
    // For now, clear the cart
    cart = [];
    updateCart();
    window.location.href = 'index.html';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Add event listeners for product cards
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const productName = this.dataset.name;
            const productPrice = parseFloat(this.dataset.price);
            const productCategory = this.dataset.category;
            
            addToCart(productId, productName, productPrice, productCategory);
        });
    });
    
    // Render bag items if on bag page
    if (window.location.pathname.includes('bag.html')) {
        renderBagItems();
    }
    
    // Sign in form handling
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (email && password) {
                alert('Sign in successful!');
                window.location.href = 'index.html';
            } else {
                alert('Please fill in all fields');
            }
        });
    }
});