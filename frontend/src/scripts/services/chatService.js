/**
 * Chat Service - API Client for Chat
 */

const API_BASE = '/api/v1';

class ChatService {
    constructor() {
        this.baseUrl = API_BASE;
    }

    async sendMessage(message, conversationId = null) {
        const response = await fetch(`${this.baseUrl}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify({
                message,
                conversation_id: conversationId
            })
        });
        return response;
    }

    async getHistory(limit = 50) {
        const response = await fetch(`${this.baseUrl}/chat/history?limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        });
        return response;
    }

    async getSuggestions() {
        const response = await fetch(`${this.baseUrl}/chat/suggestions`);
        return response;
    }

    async submitFeedback(messageId, helpful) {
        const response = await fetch(`${this.baseUrl}/chat/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify({
                message_id: messageId,
                helpful
            })
        });
        return response;
    }

    getToken() {
        return localStorage.getItem('autoflow_token') || '';
    }
}

export const chatService = new ChatService();
