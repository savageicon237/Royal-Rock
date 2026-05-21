// ============ SUPABASE CONFIGURATION ============
// REPLACE WITH YOUR ACTUAL SUPABASE CREDENTIALS
// Get these from your Supabase Project Settings → API

const SUPABASE_URL = "https://aedcevxlhzzscnuosmmd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ABCg50Qm3X12wVxNsk154A_-S_5gho3";

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Make available globally
window.supabase = supabaseClient;

// Session management with cookie duration (30 days max)
function setSession(userData, rememberMe = false) {
    const duration = rememberMe ? 30 : 1; // 30 days or 1 day
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

// Generate unique referral code
function generateReferralCode() {
    return 'RR' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Show notification
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