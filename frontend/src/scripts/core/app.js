// Main Application - Automatic Workflow
import { authService } from '../services/authService.js';
import { authStore } from '../stores/authStore.js';
import { notificationStore } from '../stores/notificationStore.js';

(function() {
    document.addEventListener('DOMContentLoaded', init);
    
    function init() {
        console.log('AutoFlow App initialized');
        
        // Load auth state from storage
        authStore.loadFromStorage();
        
        initMobileMenu();
        initChat();
        initAuth();
        updateUI();
        
        // Subscribe to auth changes
        authStore.subscribe(updateUI);
    }
    
    function updateUI() {
        const isAuth = authStore.isAuthenticated();
        const user = authStore.getUser();
        
        // Update login button
        const loginBtn = document.getElementById('login-btn');
        const loginBtnMobile = document.getElementById('login-btn-mobile');
        
        if (isAuth && user) {
            if (loginBtn) {
                loginBtn.textContent = 'Dashboard';
                loginBtn.onclick = () => window.location.href = 'dashboard.html';
            }
            if (loginBtnMobile) {
                loginBtnMobile.textContent = 'Dashboard';
                loginBtnMobile.onclick = () => window.location.href = 'dashboard.html';
            }
        } else {
            if (loginBtn) {
                loginBtn.textContent = 'Get Started';
                loginBtn.onclick = () => window.location.href = 'dashboard.html';
            }
            if (loginBtnMobile) {
                loginBtnMobile.textContent = 'Get Started';
                loginBtnMobile.onclick = () => window.location.href = 'dashboard.html';
            }
        }
        
        // Update user info in sidebar
        const userName = document.querySelector('.user-name');
        const userPlan = document.querySelector('.user-plan');
        const userAvatar = document.querySelector('.user-avatar');
        
        if (user) {
            if (userName) userName.textContent = user.name || user.email;
            if (userPlan) userPlan.textContent = (user.plan || 'free').charAt(0).toUpperCase() + (user.plan || 'free').slice(1) + ' Plan';
            if (userAvatar) userAvatar.textContent = (user.name || user.email || 'U').charAt(0).toUpperCase();
        }
    }
    
    function initAuth() {
        // Login modal/handler if needed
        const loginHandler = async (email, password) => {
            try {
                notificationStore.show('Logging in...', 'info');
                await authService.login(email, password);
                notificationStore.show('Login successful!', 'success');
                window.location.href = 'dashboard.html';
            } catch (e) {
                notificationStore.show(e.message || 'Login failed', 'error');
            }
        };
        
        // Register handler
        const registerHandler = async (email, name, password) => {
            try {
                notificationStore.show('Creating account...', 'info');
                await authService.register(email, name, password);
                notificationStore.show('Account created!', 'success');
                window.location.href = 'dashboard.html';
            } catch (e) {
                notificationStore.show(e.message || 'Registration failed', 'error');
            }
        };
        
        // Expose to global scope for HTML onclick handlers
        window.authHandlers = {
            login: loginHandler,
            register: registerHandler
        };
    }
    
    function initMobileMenu() {
        var btn = document.getElementById('mobile-menu-btn');
        var nav = document.getElementById('mobile-nav');
        var overlay = document.getElementById('mobile-overlay');
        if (!btn || !nav) return;
        
        btn.onclick = function() {
            btn.classList.toggle('active');
            nav.classList.toggle('open');
            if (overlay) overlay.classList.toggle('visible');
            document.body.classList.toggle('menu-open');
        };
        
        if (overlay) overlay.onclick = function() {
            btn.classList.remove('active');
            nav.classList.remove('open');
            overlay.classList.remove('visible');
            document.body.classList.remove('menu-open');
        };
        
        var links = document.querySelectorAll('.nav-mobile-link');
        for (var i = 0; i < links.length; i++) {
            links[i].onclick = function() {
                btn.classList.remove('active');
                nav.classList.remove('open');
                if (overlay) overlay.classList.remove('visible');
                document.body.classList.remove('menu-open');
            };
        }
    }
    
    function initChat() {
        var widget = document.getElementById('chat-widget');
        var fab = document.getElementById('chat-fab');
        var close = document.getElementById('chat-close');
        var send = document.getElementById('chat-send');
        
        if (!widget) return;
        
        if (fab) fab.onclick = function() { widget.classList.remove('hidden'); fab.style.display = 'none'; };
        if (close) close.onclick = function() { widget.classList.add('hidden'); fab.style.display = 'flex'; };
        
        if (send) send.onclick = sendMsg;
        
        var inp = document.getElementById('chat-input');
        if (inp) inp.onkeypress = function(e) { if (e.key === 'Enter') sendMsg(); };
        
        var chips = document.querySelectorAll('.suggestion-chip');
        for (var j = 0; j < chips.length; j++) {
            chips[j].onclick = function() {
                var input = document.getElementById('chat-input');
                if (input) { input.value = this.textContent; sendMsg(); }
            };
        }
        
        function sendMsg() {
            var input = document.getElementById('chat-input');
            var msgs = document.getElementById('chat-messages');
            if (!input || !input.value.trim() || !msgs) return;
            
            var msg = input.value.trim();
            input.value = '';
            
            var div = document.createElement('div');
            div.className = 'chat-message user';
            div.innerHTML = '<div class="message-content">' + msg + '</div>';
            msgs.appendChild(div);
            
            var botDiv = document.createElement('div');
            botDiv.className = 'chat-message bot';
            botDiv.innerHTML = '<div class="message-content">' + getResponse(msg) + '</div>';
            msgs.appendChild(botDiv);
            msgs.scrollTop = msgs.scrollHeight;
        }
        
        function getResponse(msg) {
            msg = msg.toLowerCase();
            if (msg.includes('hello')) return 'Hello! How can I help you?';
            if (msg.includes('workflow')) return 'Create workflows at the Workflows page.';
            if (msg.includes('api')) return 'Manage API keys in Settings.';
            if (msg.includes('price')) return 'Free (100 runs), Pro ($29/mo), Enterprise (custom).';
            if (msg.includes('help')) return 'I help with workflows, integrations, API keys, pricing.';
            return 'Ask me about workflows, integrations, or pricing!';
        }
    }
})();
