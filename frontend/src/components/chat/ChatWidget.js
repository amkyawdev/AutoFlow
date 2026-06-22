/**
 * ChatWidget Component - Simple Version
 */

export class ChatWidget {
    constructor(options = {}) {
        this.container = options.container;
        this.apiEndpoint = options.apiEndpoint || '/api/v1/chat';
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.messagesContainer = this.container?.querySelector('#chat-messages');
        this.inputField = this.container?.querySelector('#chat-input');
        this.sendButton = this.container?.querySelector('#chat-send');
        this.suggestionsContainer = this.container?.querySelector('.chat-suggestions');
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }

        if (this.inputField) {
            this.inputField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (this.suggestionsContainer) {
            this.suggestionsContainer.querySelectorAll('.suggestion-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    const text = chip.textContent;
                    if (this.inputField) {
                        this.inputField.value = text;
                        this.sendMessage();
                    }
                });
            });
        }
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.container?.classList.remove('hidden');
        } else {
            this.container?.classList.add('hidden');
        }
    }

    show() {
        this.isOpen = true;
        this.container?.classList.remove('hidden');
    }

    hide() {
        this.isOpen = false;
        this.container?.classList.add('hidden');
    }

    async sendMessage() {
        const content = this.inputField?.value?.trim();
        if (!content) return;

        this.addMessage('user', content);
        this.clearInput();
        this.showTyping();

        // Simulate bot response (in production, call API)
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(content);
            this.addMessage('bot', response);
        }, 1000);
    }

    generateResponse(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('hello') || msg.includes('hi')) {
            return "Hello! 👋 Welcome to Automatic Workflow. How can I help you today?";
        }
        if (msg.includes('workflow')) {
            return "To create a workflow: 1️⃣ Go to Workflows page 2️⃣ Click New Workflow 3️⃣ Choose trigger type 4️⃣ Add actions. Would you like me to guide you through any step?";
        }
        if (msg.includes('api') || msg.includes('key')) {
            return "API keys are stored securely. Go to Settings → API Keys to generate or manage your keys. Never share them publicly! 🔐";
        }
        if (msg.includes('price') || msg.includes('plan')) {
            return "We have 3 plans: 🆓 Free (100 runs/month), 💎 Pro ($29/mo - unlimited), 🏢 Enterprise (custom). Which one interests you?";
        }
        if (msg.includes('integration') || msg.includes('connect')) {
            return "We support: OpenAI, Slack, Discord, GitHub, Google Sheets, Notion & more! Go to Integrations page to connect your services.";
        }
        if (msg.includes('help')) {
            return "I can help you with:\n• Creating workflows\n• Setting up integrations\n• API key management\n• Troubleshooting\n\nWhat do you need help with?";
        }
        
        return "I'm here to help with Automatic Workflow! You can ask me about creating workflows, integrations, pricing, or getting started. 😊";
    }

    addMessage(role, content) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${role}`;
        msgDiv.innerHTML = `
            <div class="message-content">${this.escapeHtml(content)}</div>
            <div class="message-time">${time}</div>
        `;
        
        if (this.messagesContainer) {
            this.messagesContainer.appendChild(msgDiv);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    }

    clearInput() {
        if (this.inputField) {
            this.inputField.value = '';
        }
    }

    showTyping() {
        if (!this.messagesContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dots">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typing = this.messagesContainer?.querySelector('#typing-indicator');
        if (typing) {
            typing.remove();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }
}

// Make ChatWidget globally available
window.ChatWidget = ChatWidget;
