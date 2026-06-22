/**
 * API Configuration - Centralized API settings
 */

const API_CONFIG = {
    // Use relative URL for Vercel deployment
    // Backend is at /api/*
    baseUrl: '/api/v1',
    
    // For local development, use:
    // baseUrl: 'http://localhost:8000/api/v1',
    
    endpoints: {
        auth: {
            register: '/auth/register',
            login: '/auth/login/json',
            me: '/auth/me',
            refresh: '/auth/refresh'
        },
        workflows: {
            list: '/workflows/',
            create: '/workflows/',
            get: (id) => `/workflows/${id}`,
            update: (id) => `/workflows/${id}`,
            delete: (id) => `/workflows/${id}`,
            execute: (id) => `/workflows/${id}/execute`
        },
        integrations: {
            list: '/integrations/',
            connect: '/integrations/connect',
            disconnect: (id) => `/integrations/${id}`
        },
        chat: {
            message: '/chat/message'
        }
    }
};

export default API_CONFIG;
