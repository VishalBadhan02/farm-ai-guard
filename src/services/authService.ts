import api from '@/api/axios';
import endpoints from '@/api/endpoints';
import { LoginCredentials, RegisterData, User, AuthTokens } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post<{ user: User; tokens: AuthTokens }>(
      endpoints.auth.login,
      credentials
    );
    return response.data.data;
  },

  async register(data: RegisterData) {
    const response = await api.post<{ user: User; tokens: AuthTokens }>(
      endpoints.auth.register,
      data
    );
    return response.data;
  },

  async logout() {
    const response = await api.post(endpoints.auth.logout);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post(endpoints.auth.forgotPassword, { email });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string) {
    const response = await api.post(endpoints.auth.resetPassword, {
      token,
      newPassword,
    });
    return response.data;
  },

  async verifyOTP(email: string, otp: string) {
    const response = await api.post(endpoints.auth.verifyOTP, { email, otp });
    return response.data;
  },

  async resendOTP(email: string) {
    const response = await api.post(endpoints.auth.resendOTP, { email });
    return response.data;
  },

  async getProfile() {
    const response = await api.get<User>(endpoints.auth.profile);
    return response.data;
  },

  async updateProfile(data: Partial<User>) {
    const response = await api.patch<User>(endpoints.auth.profile, data);
    return response.data;
  },
};
