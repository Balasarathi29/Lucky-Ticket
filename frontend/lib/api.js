
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const generateTicket = async (reward) => {
    const response = await api.post('/luckyticket/generate', { reward });
    return response.data;
};

export const getTickets = async () => {
    const response = await api.get('/luckyticket/list');
    return response.data;
};

export const redeemTicket = async (name, code) => {
    // Note: name is ignored by backend now, but kept for compatibility
    const response = await api.post('/luckyticket/redeem', { code });
    return response.data;
};

export const getAvailableTickets = async () => {
    const response = await api.get('/luckyticket/available');
    return response.data;
};

export const getMyTickets = async () => {
    const response = await api.get('/luckyticket/my-tickets');
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get('/api/auth/users');
    return response.data;
};
