const API_URL = 'http://localhost:8080'; // Замени на реальный URL твоего API

interface LoginData {
  email?: string;
  phone?: string;
  password?: string;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  patronymic: string;
  email?: string;
  phone?: string;
  password?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const authApi = {
  // Авторизация пользователя
  login: async (data: LoginData): Promise<ApiResponse<{ token: string }>> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        return { success: true, data: responseData };
      } else {
        return { success: false, error: responseData };
      }
    } catch (error) {
      return { success: false, error: 'Ошибка сети при попытке входа' };
    }
  },
  
  // Регистрация пользователя
  register: async (data: RegisterData): Promise<ApiResponse<{ id: number, message: string }>> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        return { success: true, data: responseData };
      } else {
        return { success: false, error: responseData };
      }
    } catch (error) {
      return { success: false, error: 'Ошибка сети при попытке регистрации' };
    }
  },
  
  // Получение данных профиля (пример запроса с токеном)
  getProfile: async (): Promise<ApiResponse<any>> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { success: false, error: 'Нет токена авторизации' };
    }
    
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        return { success: true, data: responseData };
      } else {
        return { success: false, error: responseData };
      }
    } catch (error) {
      return { success: false, error: 'Ошибка сети при получении профиля' };
    }
  }
};