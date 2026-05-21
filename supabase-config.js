// ============ LOCAL DATABASE (No Supabase Needed) ============

// Initialize local database if not exists
function initLocalDatabase() {
    if (!localStorage.getItem('localUsers')) {
        // Create first user (founder with referral code)
        const firstUser = {
            id: 1,
            email: 'founder@royalrock.com',
            username: 'founder',
            full_name: 'Company Founder',
            phone: '237653376334',
            password: btoa('123456'),
            referral_code: 'RRFOUNDER2025',
            referred_by: null,
            has_purchased: true,
            total_purchased: 100000,
            created_at: new Date().toISOString()
        };
        
        const firstAffiliate = {
            id: 1,
            referral_code: 'RRFOUNDER2025',
            total_earnings: 0,
            total_sales: 0,
            total_referrals: 0,
            available_balance: 0,
            joined_at: new Date().toISOString()
        };
        
        localStorage.setItem('localUsers', JSON.stringify([firstUser]));
        localStorage.setItem('localAffiliates', JSON.stringify([firstAffiliate]));
        localStorage.setItem('localOrders', JSON.stringify([]));
        localStorage.setItem('localCommissions', JSON.stringify([]));
    }
}

// Call this immediately
initLocalDatabase();

// Database functions
const localDB = {
    // Users
    async getUsers() {
        return JSON.parse(localStorage.getItem('localUsers') || '[]');
    },
    
    async getUserByEmail(email) {
        const users = await this.getUsers();
        return users.find(u => u.email === email);
    },
    
    async getUserByUsername(username) {
        const users = await this.getUsers();
        return users.find(u => u.username === username);
    },
    
    async getUserByReferralCode(code) {
        const users = await this.getUsers();
        return users.find(u => u.referral_code === code);
    },
    
    async createUser(userData) {
        const users = await this.getUsers();
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const newUser = { id: newId, ...userData, created_at: new Date().toISOString() };
        users.push(newUser);
        localStorage.setItem('localUsers', JSON.stringify(users));
        return newUser;
    },
    
    async updateUser(id, updates) {
        const users = await this.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem('localUsers', JSON.stringify(users));
            return users[index];
        }
        return null;
    },
    
    // Affiliates
    async getAffiliates() {
        return JSON.parse(localStorage.getItem('localAffiliates') || '[]');
    },
    
    async getAffiliateByUserId(id) {
        const affiliates = await this.getAffiliates();
        return affiliates.find(a => a.id === id);
    },
    
    async getAffiliateByReferralCode(code) {
        const affiliates = await this.getAffiliates();
        return affiliates.find(a => a.referral_code === code);
    },
    
    async createAffiliate(affiliateData) {
        const affiliates = await this.getAffiliates();
        affiliates.push(affiliateData);
        localStorage.setItem('localAffiliates', JSON.stringify(affiliates));
        return affiliateData;
    },
    
    async updateAffiliate(id, updates) {
        const affiliates = await this.getAffiliates();
        const index = affiliates.findIndex(a => a.id === id);
        if (index !== -1) {
            affiliates[index] = { ...affiliates[index], ...updates };
            localStorage.setItem('localAffiliates', JSON.stringify(affiliates));
            return affiliates[index];
        }
        return null;
    },
    
    // Orders
    async createOrder(orderData) {
        const orders = JSON.parse(localStorage.getItem('localOrders') || '[]');
        const newOrder = { id: Date.now(), ...orderData, created_at: new Date().toISOString() };
        orders.push(newOrder);
        localStorage.setItem('localOrders', JSON.stringify(orders));
        return newOrder;
    },
    
    // Commissions
    async createCommission(commissionData) {
        const commissions = JSON.parse(localStorage.getItem('localCommissions') || '[]');
        const newCommission = { id: Date.now(), ...commissionData, created_at: new Date().toISOString() };
        commissions.push(newCommission);
        localStorage.setItem('localCommissions', JSON.stringify(commissions));
        return newCommission;
    },
    
    // Get user count
    async getUserCount() {
        const users = await this.getUsers();
        return users.length;
    }
};

// Make available globally
window.localDB = localDB;

// Session management
function setSession(userData, rememberMe = false) {
    const duration = rememberMe ? 30 : 1;
    const sessionData = {
        user: userData,
        expiresAt: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString()
    };
    localStorage.setItem('royalRockSession', JSON.stringify(sessionData));
}

function getSession() {
    const session = localStorage.getItem('royalRockSession');
    if (!session) return null;
    
    const sessionData = JSON.parse(session);
    if (new Date(sessionData.expiresAt) < new Date()) {
        localStorage.removeItem('royalRockSession');
        return null;
    }
    return sessionData.user;
}

function clearSession() {
    localStorage.removeItem('royalRockSession');
}

function checkAuth() {
    const user = getSession();
    if (!user && !window.location.pathname.includes('affiliate-login.html') && 
        !window.location.pathname.includes('affiliate-register.html') &&
        !window.location.pathname.includes('index.html')) {
        window.location.href = 'affiliate-login.html';
    }
    return user;
}

function generateReferralCode() {
    return 'RR' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
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
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: fadeOut 3s forwards;
    `;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

console.log('Local database initialized! First referral code: RRFOUNDER2025');