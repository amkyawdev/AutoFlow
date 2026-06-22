/**
 * Auth Service - Authentication API calls
 */

import API_CONFIG from './apiConfig.js';
import { authStore } from '../stores/authStore.js';

class AuthService {
    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
    }

    async request(endpoint, options = {}) {
        const token = authStore.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Request failed' }));
            throw new Error(error.detail || error.message || 'Request failed');
        }

        return response.json();
    }

    async register(email, name, password) {
        const user = await this.request(API_CONFIG.endpoints.auth.register, {
            method: 'POST',
            body: JSON.stringify({ email, name, password })
        });
        
        // Auto login after registration
        await this.login(email, password);
        return user;
    }

    async login(email, password) {
        const response = await this.request(API_CONFIG.endpoints.auth.login, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        // Get user info
        const user = await this.getCurrentUser(response.access_token);
        
        authStore.login(response.access_token, user);
        return { token: response.access_token, user };
    }

    async getCurrentUser(token = null) {
        const savedToken = token || authStore.getToken();
        if (!savedToken) return null;

        try {
            const user = await this.request(API_CONFIG.endpoints.auth.me, {
                headers: {
                    'Authorization': `Bearer ${savedToken}`
                }
            });
            return user;
        } catch (e) {
            console.error('Failed to get current user:', e);
            return null;
        }
    }

    async logout() {
        authStore.logout();
    }

    isAuthenticated() {
        return authStore.isAuthenticated();
    }

    getToken() {
        return authStore.getToken();
    }
}

export const authService = new AuthService();
export default authService;
