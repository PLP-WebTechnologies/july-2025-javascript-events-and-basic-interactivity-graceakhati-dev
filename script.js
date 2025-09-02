// -----------------------------
// DOM Elements (getting elements from HTML by ID/class)
// -----------------------------
const themeToggle = document.getElementById('theme-toggle'); // Button to switch between dark/light mode
const cartBtn = document.getElementById('cart-btn'); // Button to open the shopping cart
const cartModal = document.getElementById('cart-modal'); // Modal (popup) for the cart
const closeModal = document.querySelector('.close'); // Close button (X) inside the cart modal
const exploreBtn = document.getElementById('explore-btn'); // "Explore" button to scroll to New Arrivals
const newsletterForm = document.getElementById('newsletter-form'); // Newsletter subscription form
const filterButtons = document.querySelectorAll('.filter-btn'); // Buttons to filter product categories
const galleryItems = document.querySelectorAll('.gallery-item'); // Product gallery items
const addToCartButtons = document.querySelectorAll('.add-to-cart'); // "Add to Cart" buttons
const cartItemsContainer = document.getElementById('cart-items'); // Where cart items are displayed
const totalAmount = document.getElementById('total-amount'); // Shows total cart price
const checkoutBtn = document.getElementById('checkout-btn'); // Checkout button

// -----------------------------
// Cart array (stores cart items as objects)
// -----------------------------
let cart = [];

// -----------------------------
// Initialize the application
// -----------------------------
function init() {
    // Set up event listeners (button clicks, form, etc.)
    setupEventListeners();
    
    // Load cart from localStorage if available (keeps cart saved between refreshes)
    loadCartFromStorage();
    
    // Update cart display in the modal
    updateCartDisplay();
}

// -----------------------------
// Set up all event listeners for buttons/forms
// -----------------------------
function setupEventListeners() {
    // Theme toggle functionality
    themeToggle.addEventListener('click', toggleDarkMode);
    
    // Cart modal functionality (open/close)
    cartBtn.addEventListener('click', openCartModal);
    closeModal.addEventListener('click', closeCartModal);
    window.addEventListener('click', outsideModalClick);
    
    // Explore button smooth scroll
    exploreBtn.addEventListener('click', scrollToNewArrivals);
    
    // Form validation for newsletter subscription
    newsletterForm.addEventListener('submit', validateForm);
    
    // Gallery filtering (e.g., show Women/Men/Accessories)
    filterButtons.forEach(button => {
        button.addEventListener('click', filterGallery);
    });
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', checkout);
}

// -----------------------------
// Dark Mode Toggle Functionality
// -----------------------------
function toggleDarkMode() {
    // Toggle the "dark-mode" CSS class on body
    document.body.classList.toggle('dark-mode');
    
    // Change icon based on mode
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️'; // Switch to sun icon
        // Save preference to localStorage
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = '🌙'; // Switch to moon icon
        // Save preference to localStorage
        localStorage.setItem('theme', 'light');
    }
}

// -----------------------------
// Check for saved theme preference
// -----------------------------
function checkSavedTheme() {
    const savedTheme = localStorage.getItem('theme'); // Get saved theme
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
}

// -----------------------------
// Cart Modal Functions (open/close modal)
// -----------------------------
function openCartModal() {
    cartModal.style.display = 'block'; // Show modal
}

function closeCartModal() {
    cartModal.style.display = 'none'; // Hide modal
}

function outsideModalClick(e) {
    // If user clicks outside modal area, close modal
    if (e.target === cartModal) {
        closeCartModal();
    }
}

// -----------------------------
// Smooth Scroll to New Arrivals Section
// -----------------------------
function scrollToNewArrivals(e) {
    e.preventDefault(); // Prevent default link behavior
    document.getElementById('new-arrivals').scrollIntoView({
        behavior: 'smooth' // Smooth scroll animation
    });
}

// -----------------------------
// Form Validation (Newsletter subscription)
// -----------------------------
function validateForm(e) {
    e.preventDefault(); // Prevent form from submitting immediately
    
    let isValid = true; // Assume form is valid until checked
    
    // Validate name
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (nameInput.value.trim() === '') {
        nameError.textContent = 'Name is required';
        isValid = false;
    } else {
        nameError.textContent = '';
    }
    
    // Validate email
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
    
    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Email is required';
        isValid = false;
    } else if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    } else {
        emailError.textContent = '';
    }
    
    // Validate preference dropdown
    const preferenceSelect = document.getElementById('preference');
    const preferenceError = document.getElementById('preference-error');
    if (preferenceSelect.value === '') {
        preferenceError.textContent = 'Please select a preference';
        isValid = false;
    } else {
        preferenceError.textContent = '';
    }
    
    // If form is valid, show success message and reset form
    if (isValid) {
        alert('Thank you for subscribing to our newsletter!');
        newsletterForm.reset();
    }
}

// -----------------------------
// Gallery Filtering Functionality
// -----------------------------
function filterGallery() {
    // Remove "active" class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add "active" class to clicked button
    this.classList.add('active');
    
    const filter = this.getAttribute('data-filter'); // Get chosen category
    
    // Show/hide items based on category
    galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block'; // Show item
        } else {
            item.style.display = 'none'; // Hide item
        }
    });
}

// -----------------------------
// Shopping Cart Functionality
// -----------------------------
function addToCart() {
    const product = this.getAttribute('data-product'); // Product name
    const price = parseFloat(this.getAttribute('data-price')); // Product price
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.product === product);
    
    if (existingItem) {
        existingItem.quantity += 1; // Increase quantity if already in cart
    } else {
        // Add new product to cart
        cart.push({
            product: product,
            price: price,
            quantity: 1
        });
    }
    
    // Update cart display in UI
    updateCartDisplay();
    
    // Save cart to localStorage
    saveCartToStorage();
    
    // Show confirmation notification
    showNotification(`${product} added to cart!`);
}

function updateCartDisplay() {
    // Clear current cart items
    cartItemsContainer.innerHTML = '';
    
    // Calculate total
    let total = 0;
    
    // Add items to cart display
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal; // Add to total cost
            
            // Create HTML for each cart item
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div>
                    <h4>${item.product}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div>
                    <p>$${itemTotal.toFixed(2)}</p>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
    }
    
    // Update total amount in modal
    totalAmount.textContent = total.toFixed(2);
}

function checkout() {
    // If cart is empty, prevent checkout
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Success message
    alert('Thank you for your purchase! Your order has been placed.');
    
    // Empty cart
    cart = [];
    updateCartDisplay();
    saveCartToStorage();
    closeCartModal();
}

// -----------------------------
// LocalStorage Functions (save/load cart)
// -----------------------------
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart)); // Save as JSON
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart); // Restore cart from storage
    }
}

// -----------------------------
// Notification Function (temporary popup message)
// -----------------------------
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#d4af37';
    notification.style.color = '#fff';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    
    // Add notification to the page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// -----------------------------
// Run initialization when DOM is fully loaded
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
    init(); // Start app
    checkSavedTheme(); // Apply saved theme (dark/light)
});
