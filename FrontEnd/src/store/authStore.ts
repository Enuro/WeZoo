import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: (email: string, password: string) => {
    // Здесь будет реальная логика аутентификации
    console.log('Logging in with:', email, password);
    set({ isAuthenticated: true });
  },
  logout: () => set({ isAuthenticated: false }),
}));