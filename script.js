// ============ EMAILJS CONFIGURATION ============
const EMAILJS_PUBLIC_KEY = "WDudZHbWJQx9BDzCk";
const EMAILJS_SERVICE_ID = "service_y156bsg";
const EMAILJS_TEMPLATE_ID = "template_a8c4ly1";

if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "WDudZHbWJQx9BDzCk") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

// ============ PRODUCT DATABASE ============
const products = [
    { 
        id: 1, 
        name: "Pile", 
        price: 50000, 
        category: "herbal",
        image:"web/1.jpg " ,
        commission: 6000 // 12% of 50000
    },
     { 
        id: 2, 
        name: "Nefropatia", 
        price: 50000, 
        category: "herbal",
        image:"web/2.jpg " ,
        commission: 6000 // 12% of 50000
    }, { 
        id: 3, 
        name: "Immunity Booster", 
        price: 50000, 
        category: "herbal",
        image:"web/3.jpg " ,
        commission: 6000 // 12% of 50000
    }, { 
        id: 4, 
        name: "Tooth Care Pack", 
        price: 50000, 
        category: "herbal",
        image:"web/4.jpg " ,
        commission: 6000 // 12% of 50000
    }, { 
        id: 5, 
        name: "Air Force One", 
        price: 50000, 
        category: "herbal",
        image:"web/5.jpg " ,
        commission: 6000 // 12% of 50000
    },
];

// ============ RESTAURANT MENU ============
const menuItems = [
    { id: 1, name: "Grilled Fish Special", price: 5000, category: "main", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300", description: "Fresh fish grilled with local spices" },
    { id: 2, name: "Pepper Soup", price: 3000, category: "appetizers", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=300", description: "Spicy traditional pepper soup" },
    { id: 3, name: "Jollof Rice", price: 3500, category: "main", image: "https://images.unsplash.com/photo-1546074177-ffdda98d214f?w=300", description: "Classic West African Jollof" },
    { id: 4, name: "Fruit Salad", price: 2500, category: "desserts", image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300", description: "Fresh seasonal fruits" },
    { id: 5, name: "Mango Juice", price: 1500, category: "drinks", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300", description: "Freshly squeezed mango juice" },
    { id: 6, name: "Fried Plantains", price: 2000, category: "appetizers", image: "https://images.unsplash.com/photo-1597534458220-9fb4969f2df5?w=300", description: "Crispy ripe plantains" }
];

// ============ CART FUNCTIONS ============
function getCart() {
    return JSON.parse(localStorage.getItem('royalCart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('royalCart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(el => {
        if (el) el.innerText = count;
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let cart = getCart();
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            commission: product.commission
        });
    }
    
    saveCart(cart);
    showNotification(`${product.name} added to cart!`);
}

function addRestaurantToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    let cart = getCart();
    const existing = cart.find(i => i.id === itemId && i.type === 'restaurant');
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
            type: 'restaurant',
            commission: 0
        });
    }
    
    saveCart(cart);
    showNotification(`${item.name} added to cart!`);
}

function removeFromCart(productId, type) {
    let cart = getCart();
    cart = cart.filter(item => !(item.id === productId && (item.type === type || (!item.type && !type))));
    saveCart(cart);
}

function updateQuantity(productId, change, type) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId && (item.type === type || (!item.type && !type)));
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId, type);
        } else {
            saveCart(cart);
        }
    }
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function displayCartItems() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    const cart = getCart();
    const subtotal = getCartTotal();
    
    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').innerText = `${subtotal.toLocaleString()} CFA`;
        document.getElementById('total').innerText = `${subtotal.toLocaleString()} CFA`;
    }
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="shop.html" class="btn-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div>
                <h4>${item.name}</h4>
                <p>${item.price.toLocaleString()} CFA</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1, '${item.type || ''}')">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1, '${item.type || ''}')">+</button>
            </div>
            <div>
                <span>${(item.price * item.quantity).toLocaleString()} CFA</span>
                <span class="remove-item" onclick="removeFromCart(${item.id}, '${item.type || ''}')"><i class="fas fa-trash"></i></span>
            </div>
        </div>
    `).join('');
}

// ============ DISPLAY PRODUCTS ============
function displayProducts(productsToShow) {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    container.innerHTML = productsToShow.map(product => `
        <div class="product-3d-card" data-aos="flip-up">
            <div style="position: relative;">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-badge">🌿 Natural</div>
                <div class="affiliate-badge">💰 Earn 6,000 CFA</div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${product.price.toLocaleString()} CFA</div>
                <div class="product-ingredients">
                    <strong>🌱 Ingredients:</strong><br>
                    ${product.ingredients.join(' • ')}
                </div>
                <div class="product-diseases">
                    ${product.diseases.map(d => `<span class="disease-tag">🩺 ${d}</span>`).join('')}
                </div>
                <p style="font-size: 0.8rem; color: #aaa; margin: 10px 0;">${product.description}</p>
                <button class="btn-primary" style="width: 100%;" onclick="addToCart(${product.id})">
                    Add to Cart <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function displayFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featured = products.slice(0, 3);
    container.innerHTML = featured.map(product => `
        <div class="product-3d-card" data-aos="flip-up">
            <div style="position: relative;">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-badge">⭐ Best Seller</div>
                <div class="affiliate-badge">💰 Earn 6,000 CFA</div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${product.price.toLocaleString()} CFA</div>
                <div class="product-ingredients">
                    <strong>🌱 Ingredients:</strong><br>
                    ${product.ingredients.slice(0, 2).join(' • ')}...
                </div>
                <button class="btn-primary" style="width: 100%;" onclick="addToCart(${product.id})">
                    Add to Cart <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function displayMenu(category = 'all') {
    const container = document.getElementById('menuGrid');
    if (!container) return;
    
    const filtered = category === 'all' ? menuItems : menuItems.filter(item => item.category === category);
    
    container.innerHTML = filtered.map(item => `
        <div class="menu-card" data-aos="fade-up">
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-card-info">
                <h3>${item.name}</h3>
                <p style="color: #aaa; font-size: 0.8rem;">${item.description}</p>
                <div class="menu-price">${item.price.toLocaleString()} CFA</div>
                <button class="btn-outline" style="width: 100%; margin-top: 10px;" onclick="addRestaurantToCart(${item.id})">
                    Add to Order <i class="fas fa-utensils"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ============ AFFILIATE SYSTEM ============
function registerAffiliate(userData) {
    let affiliates = JSON.parse(localStorage.getItem('royalAffiliates') || '[]');
    
    // Generate unique referral code
    const referralCode = 'RR' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newAffiliate = {
        ...userData,
        referralCode: referralCode,
        earnings: 0,
        referrals: [],
        totalSales: 0,
        joinDate: new Date().toISOString(),
        pendingPayment: 0
    };
    
    // Handle referral from existing affiliate
    if (userData.referredBy) {
        const referrer = affiliates.find(a => a.referralCode === userData.referredBy);
        if (referrer) {
            referrer.referrals.push({
                name: userData.fullName,
                date: new Date().toISOString(),
                status: 'pending'
            });
        }
    }
    
    affiliates.push(newAffiliate);
    localStorage.setItem('royalAffiliates', JSON.stringify(affiliates));
    
    // Store current affiliate in session
    sessionStorage.setItem('currentAffiliate', JSON.stringify(newAffiliate));
    
    return { success: true, referralCode };
}

function processAffiliateCommission(referralCode, saleAmount) {
    let affiliates = JSON.parse(localStorage.getItem('royalAffiliates') || '[]');
    const affiliate = affiliates.find(a => a.referralCode === referralCode);
    
    if (affiliate) {
        const commission = saleAmount * 0.12; // 12% commission
        affiliate.earnings += commission;
        affiliate.totalSales++;
        affiliate.pendingPayment += commission;
        
        // Update referral status
        const pendingReferral = affiliate.referrals.find(r => r.status === 'pending');
        if (pendingReferral) {
            pendingReferral.status = 'completed';
            pendingReferral.commission = commission;
            pendingReferral.saleAmount = saleAmount;
        }
        
        localStorage.setItem('royalAffiliates', JSON.stringify(affiliates));
        
        // Send email notification to affiliate
        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY_HERE") {
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                to_email: affiliate.email,
                subject: "You've earned a commission!",
                message: `Congratulations! You earned ${commission.toLocaleString()} CFA from a referral sale.`
            });
        }
        
        // Send email to admin (lilicon2331@gmail.com)
        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY_HERE") {
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                to_email: "lilicon2331@gmail.com",
                subject: "New Affiliate Commission",
                message: `Affiliate ${affiliate.fullName} earned ${commission.toLocaleString()} CFA from a referral sale. Total earnings: ${affiliate.earnings.toLocaleString()} CFA`
            });
        }
        
        return commission;
    }
    return 0;
}

function loadAffiliateDashboard() {
    const currentAffiliate = JSON.parse(sessionStorage.getItem('currentAffiliate'));
    if (!currentAffiliate) {
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'register.html';
        }
        return;
    }
    
    document.getElementById('userName').innerText = currentAffiliate.fullName;
    document.getElementById('totalEarnings').innerText = currentAffiliate.earnings.toLocaleString() + ' CFA';
    document.getElementById('totalReferrals').innerText = currentAffiliate.referrals.length;
    document.getElementById('totalSales').innerText = currentAffiliate.totalSales;
    document.getElementById('pendingPayment').innerText = currentAffiliate.pendingPayment.toLocaleString() + ' CFA';
    document.getElementById('referralLink').value = `${window.location.origin}/shop.html?ref=${currentAffiliate.referralCode}`;
    
    const transactionsList = document.getElementById('transactionsList');
    if (transactionsList) {
        transactionsList.innerHTML = currentAffiliate.referrals.map(ref => `
            <tr>
                <td>${new Date(ref.date).toLocaleDateString()}</td>
                <td>${ref.name}</td>
                <td>Royal Rock Product</td>
                <td>50,000 CFA</td>
                <td>${ref.commission ? ref.commission.toLocaleString() + ' CFA' : 'Pending'}</td>
                <td><span style="color: ${ref.status === 'completed' ? '#28a745' : '#ffc107'}">${ref.status}</span></td>
            </tr>
        `).join('');
    }
}

function copyReferralLink() {
    const linkInput = document.getElementById('referralLink');
    linkInput.select();
    document.execCommand('copy');
    showNotification('Referral link copied!');
}

function shareOnWhatsApp() {
    const link = document.getElementById('referralLink').value;
    window.open(`https://wa.me/?text=Check out Royal Rock Wellness! Use my referral link: ${link}`, '_blank');
}

function shareOnFacebook() {
    const link = document.getElementById('referralLink').value;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank');
}

function shareOnTwitter() {
    const link = document.getElementById('referralLink').value;
    window.open(`https://twitter.com/intent/tweet?text=Check out Royal Rock Wellness! Use my referral link: ${link}`, '_blank');
}

// ============ SHIPPING CALCULATOR ============
const shippingRates = {
    northwest: 1500,
    littoral: 2500,
    centre: 2500,
    west: 2000,
    other: 5000
};

function calculateShipping() {
    const region = document.getElementById('region')?.value;
    const shippingInput = document.getElementById('shippingEstimate');
    
    if (region && shippingRates[region]) {
        shippingInput.value = `${shippingRates[region].toLocaleString()} CFA`;
    } else {
        shippingInput.value = '';
    }
}

// ============ ORDER PROCESSING ============
async function processOrder(orderData) {
    const cart = getCart();
    const subtotal = getCartTotal();
    const shipping = shippingRates[orderData.region] || 0;
    const total = subtotal + shipping;
    
    // Check for affiliate referral
    let affiliateCommission = 0;
    if (orderData.referralCode) {
        affiliateCommission = processAffiliateCommission(orderData.referralCode, subtotal);
    }
    
    const ownerEarnings = total - affiliateCommission;
    
    const order = {
        orderId: 'RR' + Date.now(),
        customer: orderData,
        items: cart,
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        affiliateCommission: affiliateCommission,
        ownerEarnings: ownerEarnings,
        status: 'pending',
        date: new Date().toISOString()
    };
    
    // Save order
    let orders = JSON.parse(localStorage.getItem('royalOrders') || '[]');
    orders.push(order);
    localStorage.setItem('royalOrders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.setItem('royalCart', '[]');
    updateCartCount();
    
    // Send email to admin (lilicon2331@gmail.com)
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY_HERE") {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            to_email: "lilicon2331@gmail.com",
            subject: `New Order: ${order.orderId}`,
            message: `
                New Order Details:
                Order ID: ${order.orderId}
                Customer: ${orderData.fullName}
                Phone: ${orderData.phone}
                Address: ${orderData.address}
                Items: ${order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                Subtotal: ${subtotal.toLocaleString()} CFA
                Shipping: ${shipping.toLocaleString()} CFA
                Total: ${total.toLocaleString()} CFA
                Affiliate Commission (12%): ${affiliateCommission.toLocaleString()} CFA
                Your Earnings: ${ownerEarnings.toLocaleString()} CFA
            `
        });
    }
    
    return order;
}

// ============ FORM HANDLERS ============
function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            fullName: document.getElementById('fullName').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            email: document.getElementById('email').value,
            referralCode: document.getElementById('referralCode').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            referredBy: document.getElementById('referralCode').value
        };
        
        const result = registerAffiliate(formData);
        const statusDiv = document.getElementById('registerStatus');
        
        if (result.success) {
            statusDiv.innerHTML = `<div style="color: #28a745; padding: 10px; background: rgba(40,167,69,0.1); border-radius: 10px;">
                ✅ Registration successful! Your referral code: <strong>${result.referralCode}</strong><br>
                Redirecting to dashboard...
            </div>`;
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        }
    });
}

function setupCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    
    const subtotal = getCartTotal();
    const checkoutSummary = document.getElementById('checkoutSummary');
    if (checkoutSummary) {
        checkoutSummary.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-row"><span>Subtotal:</span><span>${subtotal.toLocaleString()} CFA</span></div>
            <div class="summary-row"><span>Shipping:</span><span id="summaryShipping">0 CFA</span></div>
            <div class="summary-row total"><span>Total:</span><span id="summaryTotal">${subtotal.toLocaleString()} CFA</span></div>
        `;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.place-order');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        const orderData = {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            region: document.getElementById('region').value,
            payment: document.querySelector('input[name="payment"]:checked').value,
            referralCode: document.getElementById('referralCode').value
        };
        
        const order = await processOrder(orderData);
        const statusDiv = document.getElementById('checkoutStatus');
        
        statusDiv.innerHTML = `<div style="color: #28a745; padding: 10px; background: rgba(40,167,69,0.1); border-radius: 10px;">
            ✅ Order placed successfully! Order ID: ${order.orderId}<br>
            You will receive a confirmation email shortly.
        </div>`;
        
        setTimeout(() => {
            window.location.href = 'shop.html';
        }, 3000);
    });
    
    const regionSelect = document.getElementById('region');
    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            const shipping = shippingRates[regionSelect.value] || 0;
            const total = subtotal + shipping;
            document.getElementById('summaryShipping').innerHTML = `${shipping.toLocaleString()} CFA`;
            document.getElementById('summaryTotal').innerHTML = `${total.toLocaleString()} CFA`;
        });
    }
}

// ============ FILTERS & SEARCH ============
function setupFilters() {
    const searchInput = document.getElementById('searchProducts');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    function filterAndDisplay() {
        let filtered = [...products];
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const category = categoryFilter?.value || 'all';
        
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm) || 
                p.diseases.some(d => d.toLowerCase().includes(searchTerm)) ||
                p.ingredients.some(i => i.toLowerCase().includes(searchTerm))
            );
        }
        
        if (category !== 'all') {
            filtered = filtered.filter(p => p.category === category);
        }
        
        const sort = sortFilter?.value || 'default';
        if (sort === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        }
        
        displayProducts(filtered);
        
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = filtered.length === 0 ? 'block' : 'none';
        }
    }
    
    searchInput?.addEventListener('input', filterAndDisplay);
    categoryFilter?.addEventListener('change', filterAndDisplay);
    sortFilter?.addEventListener('change', filterAndDisplay);
    
    filterAndDisplay();
}

// ============ NOTIFICATION ============
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--secondary), var(--primary));
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============ MOBILE MENU ============
function toggleMenu() {
    const menu = document.getElementById('mobileNav');
    if (menu) menu.classList.toggle('show');
}

// ============ COUNTER ANIMATION ============
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        let current = 0;
        const increment = target / 50;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                setTimeout(updateCounter, 40);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    });
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true
    });
    
    // Remove preloader
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }
    }, 1500);
    
    // Initialize components based on page
    updateCartCount();
    displayCartItems();
    displayFeaturedProducts();
    setupRegisterForm();
    setupCheckoutForm();
    setupFilters();
    loadAffiliateDashboard();
    animateCounters();
    
    // Restaurant menu tabs
    const menuTabs = document.querySelectorAll('.menu-tab');
    if (menuTabs.length) {
        displayMenu('all');
        menuTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                menuTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                displayMenu(tab.dataset.category);
            });
        });
    }
    
    // URL parameter for affiliate referral
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
        localStorage.setItem('affiliateReferral', refCode);
        showNotification(`You were referred by an affiliate! 🎉 Use code ${refCode} at checkout.`);
    }
    
    const savedRef = localStorage.getItem('affiliateReferral');
    const referralInput = document.getElementById('referralCode');
    if (savedRef && referralInput) {
        referralInput.value = savedRef;
    }
});

// ============ PRELOADER REMOVAL ============
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }, 500);
    }
});