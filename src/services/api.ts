import type { LoginCredentials, LoginResponse, LogoutResponse, StateChangeResponse, SignatureRequest, SignatureResponse } from '../types/auth';
import type { ServicesResponse } from '../types/service';

const API_URL = 'https://multitanques.smartlytic.com.co';

export const api = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        return response.json();
    },

    logout: async (token: string): Promise<LogoutResponse> => {
        const response = await fetch(`${API_URL}/api/logout`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        return response.json();
    },

    getCurrentUserServices: async (token: string): Promise<ServicesResponse> => {
        const response = await fetch(`${API_URL}/api/servicios/get/by/current/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        return response.json();
    },

    setServiceInProgress: async (serviceId: number, token: string): Promise<StateChangeResponse> => {
        const response = await fetch(`${API_URL}/api/servicios/${serviceId}/to/state/inprogress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        return response.json();
    },

    signService: async (
        serviceId: number, 
        signatureData: SignatureRequest, 
        token: string
    ): Promise<SignatureResponse> => {
        const response = await fetch(`${API_URL}/api/servicios/${serviceId}/firma`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(signatureData),
        });

        return response.json();
    }
}; 