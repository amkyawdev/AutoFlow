/**
 * Workflow Service - Workflow API calls
 */

import API_CONFIG from './apiConfig.js';
import { authStore } from '../stores/authStore.js';

class WorkflowService {
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

        // Handle 204 No Content
        if (response.status === 204) {
            return null;
        }

        return response.json();
    }

    async getWorkflows(skip = 0, limit = 100) {
        return this.request(`${API_CONFIG.endpoints.workflows.list}?skip=${skip}&limit=${limit}`);
    }

    async getWorkflow(id) {
        return this.request(API_CONFIG.endpoints.workflows.get(id));
    }

    async createWorkflow(data) {
        return this.request(API_CONFIG.endpoints.workflows.create, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateWorkflow(id, data) {
        return this.request(API_CONFIG.endpoints.workflows.update(id), {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteWorkflow(id) {
        return this.request(API_CONFIG.endpoints.workflows.delete(id), {
            method: 'DELETE'
        });
    }

    async executeWorkflow(id, parameters = null) {
        const body = parameters ? { parameters } : {};
        return this.request(API_CONFIG.endpoints.workflows.execute(id), {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }
}

export const workflowService = new WorkflowService();
export default workflowService;
