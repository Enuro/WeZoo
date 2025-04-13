import { create } from 'zustand';
import { authApi } from '../services/api';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    first_name: string;
    last_name: string;
    patronymic: string;
    email?: string;
    phone?: string;
    password?: string;
  }) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    const response = await authApi.login({ email, password });
    
    if (response.success && response.data) {
      localStorage.setItem('token', response.data.token);
      set({ isAuthenticated: true, token: response.data.token, loading: false });
      return true;
    } else {
      set({ 
        loading: false, 
        error: typeof response.error === 'string' ? response.error : 'Ошибка входа в систему' 
      });
      return false;
    }
  },
  
  register: async (data) => {
    set({ loading: true, error: null });
    
    const response = await authApi.register(data);
    
    if (response.success) {
      set({ loading: false });
      return true;
    } else {
      set({ 
        loading: false, 
        error: typeof response.error === 'string' ? response.error : 'Ошибка регистрации' 
      });
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, token: null });
  }
}));