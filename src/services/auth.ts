import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';
import type { LoginCredentials, LoginResponse, LogoutResponse } from '../types/auth';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return api.login(credentials);
  }

  static async logout(): Promise<LogoutResponse> {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.logout(token);
      
      if (response.status === 200) {
        await this.removeToken();
      }

      return response;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  static async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  }

  static async getToken(): Promise<string | null> {
    return AsyncStorage.getItem('userToken');
  }

  static async removeToken(): Promise<void> {
    return AsyncStorage.removeItem('userToken');
  }
} 