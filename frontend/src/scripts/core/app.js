/**
 * Main Application Entry Point
 * Automatic Workflow
 */

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Automatic Workflow initialized');
    
    // Initialize Chat Widget
    initChatWidget();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Check auth and update login button
    checkAuth();
});

function initChatWidget() {
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const chatClose = document.getElementById('chat-close');
    const chatFab = document.getElementById('chat-fab');
    
    if (chatWidget && typeof ChatWidget !== 'undefined') {
        const chat = new ChatWidget({
            container: chatWidget,
            apiEndpoint: '/api/v1/chat'
        });
        
        // Toggle chat on button click
        if (chatToggle) {
            chatToggle.addEventListener('click', () => chat.toggle());
        }
        if (chatClose) {
            chatClose.addEventListener('click', () => chat.toggle());
        }
        if (chatFab) {
            chatFab.addEventListener('click', () => chat.toggle());
        }
        
        // Initially hide widget, show FAB
        if (chatWidget) chatWidget.classList.add('hidden');
        if (chatFab) chatFab.classList.remove('hidden');
    }
}

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    function toggleMenu() {
        mobileMenuBtn?.classList.toggle('active');
        mobileNav?.classList.toggle('open');
        mobileOverlay?.classList.toggle('visible');
        document.body.classList.toggle('menu-open');
    }
    
    function closeMenu() {
        mobileMenuBtn?.classList.remove('active');
        mobileNav?.classList.remove('open');
        mobileOverlay?.classList.remove('visible');
        document.body.classList.remove('menu-open');
    }
    
    mobileMenuBtn?.addEventListener('click', toggleMenu);
    mobileOverlay?.addEventListener('click', closeMenu);
    
    // Close menu on link click
    document.querySelectorAll('.nav-mobile-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

function checkAuth() {
    const token = localStorage.getItem('autoflow_token');
    const loginBtn = document.getElementById('login-btn');
    const loginBtnMobile = document.getElementById('login-btn-mobile');
    
    if (token) {
        if (loginBtn) {
            loginBtn.textContent = 'Dashboard';
            loginBtn.onclick = () => window.location.href = 'dashboard.html';
        }
        if (loginBtnMobile) {
            loginBtnMobile.textContent = 'Dashboard';
            loginBtnMobile.onclick = () => window.location.href = 'dashboard.html';
        }
    }
}

// Toast notification helper
window.showToast = function(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
};

// Export for module usage
export { checkAuth, initChatWidget, initMobileMenu };
