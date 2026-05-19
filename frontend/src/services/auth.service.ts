import api from './api';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

class AuthService {
  async register(data: RegisterData): Promise<{ message: string }> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  async login(data: LoginData): Promise<{ access_token: string; refresh_token: string }> {
    const response = await api.post('/auth/login', data);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    return response.data;
  }

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async getCurrentUser(): Promise<UserProfile> {
    const response = await api.get('/users/me');
    return response.data;
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.put('/users/me', data);
    return response.data;
  }

  async updateAvatar(file: File): Promise<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteAccount(): Promise<void> {
    await api.delete('/users/me');
    await this.logout();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

export default new AuthService();