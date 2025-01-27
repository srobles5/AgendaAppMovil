import { api } from './api';
import { AuthService } from './auth';
import type { ServicesResponse } from '../types/service';
import type { StateChangeResponse, SignatureRequest, SignatureResponse } from '../types/auth';

export class ServiceManager {
    static async getCurrentUserServices(): Promise<ServicesResponse> {
        try {
            const token = await AuthService.getToken();
            if (!token) {
                throw new Error('No token found');
            }
            return api.getCurrentUserServices(token);
        } catch (error) {
            console.error('Error fetching services:', error);
            throw error;
        }
    }

    static async setServiceInProgress(serviceId: number): Promise<StateChangeResponse> {
        try {
            const token = await AuthService.getToken();
            if (!token) {
                throw new Error('No token found');
            }
            return api.setServiceInProgress(serviceId, token);
        } catch (error) {
            console.error('Error changing service state:', error);
            throw error;
        }
    }

    static async signService(serviceId: number, signatureData: SignatureRequest): Promise<SignatureResponse> {
        try {
            const token = await AuthService.getToken();
            if (!token) {
                throw new Error('No token found');
            }
            return api.signService(serviceId, signatureData, token);
        } catch (error) {
            console.error('Error signing service:', error);
            throw error;
        }
    }
} 