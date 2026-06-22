// Main Application - Automatic Workflow
(function() {
    document.addEventListener('DOMContentLoaded', init);
    
    function init() {
        console.log('App initialized');
        initMobileMenu();
        initChat();
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
