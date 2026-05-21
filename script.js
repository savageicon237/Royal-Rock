// ============ SHOP PRODUCTS DATA ============
const shopProducts = [
    { id: 1, name: "Immune Boost Complex", price: 35000, image: "images/herbal1.jpg", description: "Natural immune system support" },
    { id: 2, name: "Detox Wellness Tea Bundle", price: 25000, image: "images/herbal2.jpg", description: "Organic detox tea bundle" },
    { id: 3, name: "Energy & Vitality Capsules", price: 40000, image: "images/herbal3.jpg", description: "Natural energy boost" },
    { id: 4, name: "Liver Health Formula", price: 30000, image: "images/herbal4.jpg", description: "Supports liver function" },
    { id: 5, name: "Joint Care Complex", price: 35000, image: "images/herbal5.jpg", description: "Natural joint support" },
    { id: 6, name: "Stress Relief Tincture", price: 28000, image: "images/herbal6.jpg", description: "Natural calm and relaxation" }
];

// ============ CART FUNCTIONS ============
let cart = JSON.parse(localStorage.getItem('royalRockCart') || '[]');

function saveCart() {
    localStorage.setItem('royalRockCart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

function addToCart(productId) {
    const product = shopProducts.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElements = document.querySelectorAll('.cart-count');
    countElements.forEach(el => { if(el) el.innerText = count; });
}

function updateCartDisplay() {
    const container = document.getElementById('cartItems');
    const totalSpan = document.getElementById('cartTotal');
    const totalDisplay = document.getElementById('cartTotalDisplay');
    const progressFill = document.getElementById('progressFill');
    const progressMessage = document.getElementById('progressMessage');
    
    if (!container) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px;">Your cart is empty</p>';
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" onerror="this.src='https://placehold.co/60x60/1a1a2e/c9a03d?text=Product'">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${(item.price * item.quantity).toLocaleString()} CFA</div>
                    <div class="cart-item-quantity">
                        <button class="cart-qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="cart-qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <span class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    if (totalSpan) totalSpan.innerText = total.toLocaleString() + ' CFA';
    if (totalDisplay) totalDisplay.innerText = total.toLocaleString() + ' CFA';
    
    if (progressFill) {
        const percent = Math.min((total / 100000) * 100, 100);
        progressFill.style.width = percent + '%';
    }
    
    if (progressMessage) {
        if (total >= 100000) {
            progressMessage.innerHTML = '<span style="color: #22c55e;">✓ Congratulations! You qualify for the affiliate program!</span>';
        } else {
            const remaining = 100000 - total;
            progressMessage.innerHTML = `Add ${remaining.toLocaleString()} CFA more to qualify for affiliate program`;
        }
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        saveCart();
        updateCartCount();
        updateCartDisplay();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) sidebar.classList.toggle('open');
}

function closeModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.remove('open');
}

function checkout() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    const modal = document.getElementById('checkoutModal');
    const orderSummary = document.getElementById('orderSummary');
    const orderTotal = document.getElementById('orderTotal');
    
    if (orderSummary) {
        orderSummary.innerHTML = cart.map(item => `
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>${item.name} x${item.quantity}</span>
                <span>${(item.price * item.quantity).toLocaleString()} CFA</span>
            </div>
        `).join('');
    }
    if (orderTotal) orderTotal.innerText = total.toLocaleString() + ' CFA';
    if (modal) modal.classList.add('open');
}

// ============ LOAD SHOP PRODUCTS ============
function loadShopProducts() {
    const container = document.getElementById('shopProductsGrid');
    if (!container) return;
    
    container.innerHTML = shopProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/300x220/1a1a2e/c9a03d?text=${product.name.substring(0,10)}'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${product.price.toLocaleString()} CFA</div>
                <button class="btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// ============ 3D SLIDER ============
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentSlide = 0;
    let slideInterval;
    
    if (!slides.length) return;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
        createExplosionEffect();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
        createExplosionEffect();
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentSlide = i;
            showSlide(currentSlide);
            createExplosionEffect();
        });
    });
    
    slideInterval = setInterval(nextSlide, 5000);
}

// ============ EXPLODING OBJECTS ============
function createExplosionEffect() {
    const container = document.getElementById('explosionContainer');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        container.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// ============ PARTICLE BACKGROUND ============
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            ctx.fillStyle = `rgba(201, 160, 61, ${p.opacity})`;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// ============ SCROLL REVEAL ============
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
}

// ============ COUNTER ANIMATION ============
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        let current = 0;
        const increment = target / 50;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                setTimeout(updateCounter, 30);
            } else {
                counter.innerText = target;
            }
        };
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) updateCounter();
        });
        observer.observe(counter);
    });
}

// ============ FAQ ACCORDION ============
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
            const icon = question.querySelector('i');
            if (icon) icon.style.transform = item.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
        });
    });
}

// ============ NOTIFICATION ============
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        z-index: 10000;
        animation: fadeOut 3s forwards;
        font-weight: 500;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ============ MOBILE MENU ============
function toggleMenu() {
    const menu = document.getElementById('mobileNav');
    if (menu) menu.classList.toggle('show');
}

// ============ SUPABASE AUTHENTICATION ============
// Check if supabase is initialized
if (typeof supabase !== 'undefined' && window.supabase) {
    const supabase = window.supabase;
    
    // AFFILIATE REGISTRATION
    const registerForm = document.getElementById('affiliateRegisterForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('regFullName').value;
            const email = document.getElementById('regEmail').value;
            const phone = document.getElementById('regPhone').value;
            const username = document.getElementById('regUsername').value;
            const referralCode = document.getElementById('regReferralCode').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }
            
            // Check if user exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('email, username')
                .eq('email', email)
                .single();
            
            if (existingUser) {
                showNotification('Email already registered!', 'error');
                return;
            }
            
           // Allow first user to register without referral code
let referrer = null;
let isFirstUser = false;
// ============ AFFILIATE REGISTRATION (UPDATED - NO REFERRAL CODE NEEDED FOR FIRST USER) ============
const registerForm = document.getElementById('affiliateRegisterForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('regFullName').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const username = document.getElementById('regUsername').value;
        const referralCode = document.getElementById('regReferralCode').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // Check password match
        if (password !== confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }
        
        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('email, username')
            .or(`email.eq.${email},username.eq.${username}`);
        
        if (existingUser && existingUser.length > 0) {
            showNotification('Email or username already exists!', 'error');
            return;
        }
        
        // Check if this is the FIRST user in the system
        const { count: userCount, error: countError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });
        
        let isFirstUser = (userCount === 0);
        let referrerId = null;
        
        // If NOT first user, validate referral code
        if (!isFirstUser) {
            if (!referralCode) {
                showNotification('Referral code is required!', 'error');
                return;
            }
            
            const { data: referrer, error: refError } = await supabase
                .from('users')
                .select('id, referral_code')
                .eq('referral_code', referralCode)
                .single();
            
            if (!referrer) {
                showNotification('Invalid referral code! Please enter a valid code.', 'error');
                return;
            }
            
            referrerId = referrer.id;
        }
        
        // Generate new referral code for this user
        const newReferralCode = 'RR' + Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Insert user
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{
                email: email,
                username: username,
                full_name: fullName,
                phone: phone,
                password: btoa(password),
                referral_code: newReferralCode,
                referred_by: referrerId,
                has_purchased: false,
                total_purchased: 0,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (insertError) {
            console.error('Insert error:', insertError);
            showNotification('Registration failed: ' + insertError.message, 'error');
            return;
        }
        
        // Insert affiliate record
        const { error: affiliateError } = await supabase
            .from('affiliates')
            .insert([{
                id: newUser.id,
                referral_code: newReferralCode,
                total_earnings: 0,
                total_sales: 0,
                total_referrals: 0,
                available_balance: 0,
                joined_at: new Date().toISOString()
            }]);
        
        if (affiliateError) {
            console.error('Affiliate insert error:', affiliateError);
        }
        
        // If referred by someone, add commission for referrer
        if (referrerId) {
            await supabase
                .from('commissions')
                .insert([{
                    affiliate_id: referrerId,
                    amount: 5000,
                    type: 'referral_bonus',
                    description: `New affiliate registration: ${email}`,
                    created_at: new Date().toISOString()
                }]);
            
            // Update referrer's totals
            await supabase.rpc('increment_referral_count', { user_id: referrerId });
        }
        
        showNotification(`Registration successful! Your referral code is: ${newReferralCode}`, 'success');
        
        // Auto login after registration
        const sessionData = {
            user: newUser,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
        localStorage.setItem('royalRockSession', JSON.stringify(sessionData));
        
        setTimeout(() => {
            window.location.href = 'affiliate-dashboard.html';
        }, 2000);
    });
}// ============ LOGIN WITH LOCAL DATABASE ============
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const loginInput = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe')?.checked || false;
        
        const users = await localDB.getUsers();
        const user = users.find(u => 
            (u.email === loginInput || u.username === loginInput) && 
            u.password === btoa(password)
        );
        
        if (!user) {
            showNotification('Invalid username/email or password', 'error');
            return;
        }
        
        setSession(user, rememberMe);
        showNotification('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            if (user.has_purchased) {
                window.location.href = 'affiliate-dashboard.html';
            } else {
                window.location.href = 'affiliate-shop.html';
            }
        }, 1500);
    });
}
            
            // Check if user has purchased 100k+
            const { data: orders } = await supabase
                .from('orders')
                .select('total_amount')
                .eq('email', email)
                .gte('total_amount', 100000);
            
            if (!orders || orders.length === 0) {
                showNotification('You must purchase 100,000 CFA worth of products first!', 'error');
                return;
            }
            
            const newReferralCode = generateReferralCode();
            
            // Insert user
            const { data: newUser, error: userError } = await supabase
                .from('users')
                .insert([{
                    email, username, full_name: fullName, phone,
                    password: btoa(password), referral_code: newReferralCode,
                    referred_by: referralCode, has_purchased: true, total_purchased: orders[0]?.total_amount || 0
                }])
                .select()
                .single();
            
            if (userError) {
                showNotification('Registration failed: ' + userError.message, 'error');
                return;
            }
            
            // Insert affiliate record
            await supabase.from('affiliates').insert([{
                id: newUser.id, referral_code: newReferralCode, total_earnings: 0,
                total_sales: 0, total_referrals: 0, available_balance: 0
            }]);
            
            // Add commission for referrer
            await supabase.from('commissions').insert([{
                affiliate_id: referrer.id, amount: 5000, type: 'referral_bonus',
                description: `New affiliate registration bonus for referring ${email}`
            }]);
            
            showNotification('Registration successful! Redirecting to login...', 'success');
            setTimeout(() => window.location.href = 'affiliate-login.html', 2000);
        });
    }
    
    // LOGIN
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const loginInput = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe')?.checked || false;
            
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .or(`email.eq.${loginInput},username.eq.${loginInput}`)
                .eq('password', btoa(password))
                .single();
            
            if (error || !user) {
                showNotification('Invalid username/email or password', 'error');
                return;
            }
            
            // Set session with cookie duration
            const sessionDuration = rememberMe ? 30 : 1;
            const sessionData = {
                user: user,
                expiresAt: new Date(Date.now() + sessionDuration * 24 * 60 * 60 * 1000).toISOString()
            };
            localStorage.setItem('royalRockSession', JSON.stringify(sessionData));
            
            window.location.href = 'affiliate-dashboard.html';
        });
    }
    
    // RESTAURANT RESERVATION
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('resName').value;
            const phone = document.getElementById('resPhone').value;
            const email = document.getElementById('resEmail').value;
            const guests = document.getElementById('resGuests').value;
            const date = document.getElementById('resDate').value;
            const time = document.getElementById('resTime').value;
            const occasion = document.getElementById('resOccasion').value;
            const requests = document.getElementById('resRequests').value;
            
            const { error } = await supabase.from('reservations').insert([{
                name, phone, email, guests, date, time, occasion, special_requests: requests
            }]);
            
            if (error) {
                showNotification('Reservation failed. Please try again.', 'error');
            } else {
                showNotification('Reservation confirmed! We will contact you shortly.', 'success');
                reservationForm.reset();
            }
        });
    }
    
    // MEDICAL QUOTE
    const quoteForm = document.getElementById('medicalQuoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('quoteName').value;
            const institution = document.getElementById('quoteInstitution').value;
            const email = document.getElementById('quoteEmail').value;
            const phone = document.getElementById('quotePhone').value;
            const products = document.getElementById('quoteProducts').value;
            const budget = document.getElementById('quoteBudget').value;
            const location = document.getElementById('quoteLocation')?.value || '';
            
            const { error } = await supabase.from('medical_inquiries').insert([{
                name, institution, email, phone, products, budget, location
            }]);
            
            if (error) {
                showNotification('Failed to submit. Please try again.', 'error');
            } else {
                showNotification('Quote request sent! We will contact you within 24 hours.', 'success');
                quoteForm.reset();
            }
        });
    }
}

// ============ CHECKOUT ORDER ============
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('checkoutName').value;
        const email = document.getElementById('checkoutEmail').value;
        const phone = document.getElementById('checkoutPhone').value;
        const address = document.getElementById('checkoutAddress').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderNumber = 'RR' + Date.now().toString().slice(-8);
        
        // Save order to Supabase
        if (window.supabase) {
            const { error } = await window.supabase.from('orders').insert([{
                order_number: orderNumber, email, total_amount: total,
                items: cart, status: 'pending', delivery_address: address, payment_method: paymentMethod
            }]);
            
            if (!error && total >= 100000) {
                // Update user's purchase status
                await window.supabase.from('users').update({ has_purchased: true, total_purchased: total }).eq('email', email);
            }
        }
        
        showNotification(`Order placed successfully! Order #: ${orderNumber}`, 'success');
        cart = [];
        saveCart();
        closeModal();
        
        if (total >= 100000) {
            showNotification('Congratulations! You now qualify for the affiliate program. Please register.', 'success');
            setTimeout(() => window.location.href = 'affiliate-register.html', 2000);
        } else {
            setTimeout(() => window.location.href = 'affiliate-shop.html', 2000);
        }
    });
}

// ============ DASHBOARD LOAD ============
function loadDashboard() {
    const session = localStorage.getItem('royalRockSession');
    if (!session && window.location.pathname.includes('affiliate-dashboard.html')) {
        window.location.href = 'affiliate-login.html';
        return;
    }
    
    if (session) {
        const sessionData = JSON.parse(session);
        const user = sessionData.user;
        
        if (new Date(sessionData.expiresAt) < new Date()) {
            localStorage.removeItem('royalRockSession');
            window.location.href = 'affiliate-login.html';
            return;
        }
        
        document.getElementById('dashboardName').innerText = user.full_name;
        document.getElementById('dashboardEmail').innerText = user.email;
        document.getElementById('welcomeName').innerText = user.full_name.split(' ')[0];
        document.getElementById('userReferralCode').innerText = user.referral_code;
        document.getElementById('referralLink').value = `https://royalrock.com/register?ref=${user.referral_code}`;
    }
}

function copyReferralCode() {
    const code = document.getElementById('userReferralCode')?.innerText;
    if (code) {
        navigator.clipboard.writeText(code);
        showNotification('Referral code copied!');
    }
}

function copyReferralLink() {
    const link = document.getElementById('referralLink')?.value;
    if (link) {
        navigator.clipboard.writeText(link);
        showNotification('Referral link copied!');
    }
}

function requestWithdrawal() {
    showNotification('Withdrawal request submitted! We will process within 3-5 business days.', 'success');
}

// ============ LOGOUT ============
const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutBtnMobile');
logoutBtns.forEach(btn => {
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('royalRockSession');
            window.location.href = 'affiliate-login.html';
        });
    }
});

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    loadShopProducts();
    updateCartDisplay();
    updateCartCount();
    loadDashboard();
    initSlider();
    initParticles();
    initScrollReveal();
    initCounters();
    initFAQ();
    
    // Random explosions on clicks
    document.addEventListener('click', (e) => {
        if (Math.random() > 0.95) createExplosionEffect();
    });
});