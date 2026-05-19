// ============ EMAILJS CONFIGURATION ============
// Replace with your EmailJS keys after signing up at emailjs.com
const EMAILJS_PUBLIC_KEY = "WDudZHbWJQx9BDzCk";
const EMAILJS_SERVICE_ID = "service_y156bsg";
const EMAILJS_TEMPLATE_ID = "template_a8c4ly1";

// Initialize EmailJS
if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "WDudZHbWJQx9BDzCk") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

// ============ 3D PARTICLE BACKGROUND ============
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleCount = 100;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.fillStyle = `rgba(201, 160, 61, ${this.opacity})`;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============ EXPLODING OBJECTS ANIMATION ============
function createExplosion(x, y) {
    const container = document.getElementById('explosionContainer');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 100 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Random explosion on clicks
document.addEventListener('click', (e) => {
    if (Math.random() > 0.9) {
        createExplosion(e.clientX, e.clientY);
    }
});

// ============ 3D SLIDER ============
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentSlide = 0;
    let slideInterval;
    
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
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentSlide = i;
            showSlide(currentSlide);
        });
    });
    
    // Auto-slide every 5 seconds
    if (slides.length > 0) {
        slideInterval = setInterval(nextSlide, 5000);
    }
}

// ============ SCROLL REVEAL ANIMATION ============
function initScrollReveal() {
    const reveals = document.querySelectorAll('.business-card, .step-card, .commission-card, .product-card, .medical-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    reveals.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
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
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(counter);
            }
        });
        
        observer.observe(counter);
    });
}

// ============ SUBPAGE NAVIGATION ============
function initSubpageNavigation() {
    const subpageLinks = document.querySelectorAll('.subpage-link');
    
    subpageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSubpage = document.getElementById(targetId);
            
            if (targetSubpage) {
                // Update active states
                subpageLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Hide all subpages in the same container
                const container = targetSubpage.parentElement;
                const allSubpages = container.querySelectorAll('.subpage');
                allSubpages.forEach(subpage => subpage.classList.remove('active'));
                
                // Show target subpage
                targetSubpage.classList.add('active');
                
                // Smooth scroll
                targetSubpage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
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
            if (icon) {
                icon.style.transform = item.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
            }
        });
    });
}

// ============ AFFILIATE REGISTRATION (with referral code) ============
const registerForm = document.getElementById('affiliateRegisterForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('regFullName').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const referralCode = document.getElementById('regReferralCode').value;
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        if (!referralCode) {
            alert('You need a referral code to register!');
            return;
        }
        
        // Generate unique referral code for this affiliate
        const newReferralCode = 'RR' + Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Save to localStorage (database simulation)
        const affiliates = JSON.parse(localStorage.getItem('royalRockAffiliates') || '[]');
        
        // Check if email already exists
        if (affiliates.find(a => a.email === email)) {
            alert('Email already registered!');
            return;
        }
        
        // Check if referral code exists
        const referringAffiliate = affiliates.find(a => a.referralCode === referralCode);
        if (!referringAffiliate && affiliates.length > 0) {
            alert('Invalid referral code!');
            return;
        }
        
        const newAffiliate = {
            id: Date.now(),
            fullName,
            email,
            phone,
            username,
            password,
            referralCode: newReferralCode,
            referredBy: referralCode,
            joinedDate: new Date().toISOString(),
            totalEarnings: 0,
            totalSales: 0,
            totalReferrals: 0
        };
        
        affiliates.push(newAffiliate);
        localStorage.setItem('royalRockAffiliates', JSON.stringify(affiliates));
        
        // Update referrer's stats
        if (referringAffiliate) {
            referringAffiliate.totalReferrals++;
            localStorage.setItem('royalRockAffiliates', JSON.stringify(affiliates));
        }
        
        // Send email notification
        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                to_email: email,
                subject: 'Welcome to Royal Rock Affiliate Program!',
                message: `Hello ${fullName},\n\nThank you for joining Royal Rock Affiliate Program!\n\nYour referral code is: ${newReferralCode}\n\nShare this code with others to earn commissions!\n\nLogin here: royalrock.com/dashboard`
            }).catch(e => console.log('Email error:', e));
        }
        
        // Send notification to admin
        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                to_email: "lilicon2331@gmail.com",
                subject: 'New Affiliate Registration',
                message: `New affiliate registered:\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nReferral Code: ${newReferralCode}\nReferred by: ${referralCode}`
            }).catch(e => console.log('Email error:', e));
        }
        
        alert(`Registration successful!\nYour referral code is: ${newReferralCode}\nPlease save this code.`);
        
        // Store login session
        localStorage.setItem('currentAffiliate', JSON.stringify(newAffiliate));
        window.location.href = 'affiliate-dashboard.html';
    });
}

// ============ AFFILIATE DASHBOARD ============
function loadDashboard() {
    const currentAffiliate = JSON.parse(localStorage.getItem('currentAffiliate'));
    
    if (!currentAffiliate && window.location.pathname.includes('affiliate-dashboard.html')) {
        window.location.href = 'affiliate.html';
        return;
    }
    
    if (currentAffiliate) {
        document.getElementById('dashboardName').innerText = currentAffiliate.fullName;
        document.getElementById('dashboardEmail').innerText = currentAffiliate.email;
        document.getElementById('welcomeName').innerText = currentAffiliate.fullName.split(' ')[0];
        document.getElementById('userReferralCode').innerText = currentAffiliate.referralCode;
        document.getElementById('totalReferrals').innerText = currentAffiliate.totalReferrals || 0;
        document.getElementById('totalSales').innerText = currentAffiliate.totalSales || 0;
        document.getElementById('totalEarnings').innerText = '$' + (currentAffiliate.totalEarnings || 0);
        
        const referralLink = document.getElementById('referralLink');
        if (referralLink) {
            referralLink.value = `https://royalrock.com/register?ref=${currentAffiliate.referralCode}`;
        }
    }
    
    // Dashboard tab switching
    const menuLinks = document.querySelectorAll('.dashboard-menu a');
    const tabs = document.querySelectorAll('.dashboard-tab');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            
            menuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            tabs.forEach(tab => tab.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function copyReferralCode() {
    const code = document.getElementById('userReferralCode')?.innerText;
    if (code) {
        navigator.clipboard.writeText(code);
        alert('Referral code copied!');
    }
}

function copyReferralLink() {
    const link = document.getElementById('referralLink')?.value;
    if (link) {
        navigator.clipboard.writeText(link);
        alert('Referral link copied!');
    }
}

function requestWithdrawal() {
    const amount = document.getElementById('withdrawAmount')?.value;
    const method = document.getElementById('paymentMethod')?.value;
    const details = document.getElementById('paymentDetails')?.value;
    
    if (!amount || amount < 50) {
        alert('Minimum withdrawal is $50');
        return;
    }
    
    const currentAffiliate = JSON.parse(localStorage.getItem('currentAffiliate'));
    if (currentAffiliate.totalEarnings < amount) {
        alert('Insufficient balance');
        return;
    }
    
    alert(`Withdrawal request submitted!\nAmount: $${amount}\nMethod: ${method}\nWe'll process within 3-5 business days.`);
}

// ============ RESTAURANT RESERVATION ============
const reservationForm = document.getElementById('restaurantReservationForm');
if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('resName').value;
        const phone = document.getElementById('resPhone').value;
        const date = document.getElementById('resDate').value;
        const time = document.getElementById('resTime').value;
        const guests = document.getElementById('resGuests').value;
        const occasion = document.getElementById('resOccasion').value;
        const requests = document.getElementById('resRequests').value;
        
        // Save to localStorage
        const reservations = JSON.parse(localStorage.getItem('royalRockReservations') || '[]');
        const newReservation = {
            id: Date.now(),
            name,
            phone,
            date,
            time,
            guests,
            occasion,
            requests,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        reservations.push(newReservation);
        localStorage.setItem('royalRockReservations', JSON.stringify(reservations));
        
        // Send email notification
        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                to_email: "lilicon2331@gmail.com",
                subject: 'New Restaurant Reservation',
                message: `New reservation:\nName: ${name}\nPhone: ${phone}\nDate: ${date}\nTime: ${time}\nGuests: ${guests}\nOccasion: ${occasion}\nRequests: ${requests}`
            }).catch(e => console.log('Email error:', e));
        }
        
        // Store in session for confirmation page
        localStorage.setItem('lastReservation', JSON.stringify({ name, date, time, guests }));
        window.location.href = 'restaurant-reservation.html';
    });
}

// Load reservation confirmation
if (window.location.pathname.includes('restaurant-reservation.html')) {
    const lastReservation = JSON.parse(localStorage.getItem('lastReservation'));
    if (lastReservation) {
        const detailsDiv = document.getElementById('reservationDetails');
        if (detailsDiv) {
            detailsDiv.innerHTML = `
                <p><strong>Name:</strong> ${lastReservation.name}</p>
                <p><strong>Date:</strong> ${lastReservation.date}</p>
                <p><strong>Time:</strong> ${lastReservation.time}</p>
                <p><strong>Guests:</strong> ${lastReservation.guests}</p>
                <p>A confirmation has been sent to your phone.</p>
            `;
        }
        localStorage.removeItem('lastReservation');
    }
}

// ============ MEDICAL QUOTE FORM ============
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
        
        // Save to localStorage
        const quotes = JSON.parse(localStorage.getItem('royalRockQuotes') || '[]');
        const newQuote = {
            id: Date.now(),
            name,
            institution,
            email,
            phone,
            products,
            budget,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        quotes.push(newQuote);
        localStorage.setItem('royalRockQuotes', JSON.stringify(quotes));
        
        // Send email notification
        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                to_email: "lilicon2331@gmail.com",
                subject: 'New Medical Quote Request',
                message: `New quote request:\nName: ${name}\nInstitution: ${institution}\nEmail: ${email}\nPhone: ${phone}\nProducts: ${products}\nBudget: ${budget}`
            }).catch(e => console.log('Email error:', e));
        }
        
        const statusDiv = document.getElementById('quoteStatus');
        statusDiv.innerHTML = '<p style="color: #22c55e;">Quote request sent! We will contact you within 24 hours.</p>';
        quoteForm.reset();
        
        setTimeout(() => {
            statusDiv.innerHTML = '';
        }, 5000);
    });
}

// ============ LOGOUT ============
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentAffiliate');
        window.location.href = 'affiliate.html';
    });
}

// ============ MOBILE MENU ============
function toggleMenu() {
    const menu = document.getElementById('mobileNav');
    if (menu) menu.classList.toggle('show');
}

// ============ INITIALIZE EVERYTHING ============
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initSlider();
    initScrollReveal();
    initCounters();
    initSubpageNavigation();
    initFAQ();
    loadDashboard();
});