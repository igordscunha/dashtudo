import axios from 'axios';
import type { LoginCredentials, AuthResponse, User } from '../types/auth.ts';

const API_BASE_URL = 'https://my-server-s39h.onrender.com/';

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 999999
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isCheckingAuth = error.config?.url?.includes('/auth/me');
      if(!isCheckingAuth){
        localStorage.removeItem('token');
        window.location.href = '/login'
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    // Opcional: chamar endpoint de logout no backend
    // api.post('/auth/logout');
  }
};