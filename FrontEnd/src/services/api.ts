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
        // Улучшенная обработка конкретных ошибок
        if (response.status === 401) {
          return { success: false, error: 'Неверный email или пароль' };
        } else if (response.status === 404) {
          return { success: false, error: 'Пользователь не найден' };
        } else {
          return { 
            success: false, 
            error: responseData.message || responseData.error || 'Ошибка при попытке входа' 
          };
        }
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
        // Улучшенная обработка конкретных ошибок регистрации
        if (response.status === 409) {
          return { 
            success: false, 
            error: 'Пользователь с таким email или телефоном уже существует' 
          };
        } else if (response.status === 400) {
          return { 
            success: false, 
            error: 'Некорректные данные для регистрации' 
          };
        } else {
          return { 
            success: false, 
            error: responseData.message || responseData.error || 'Ошибка при регистрации' 
          };
        }
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
        // Улучшенная обработка ошибок профиля
        if (response.status === 401) {
          // Токен истек или недействителен
          localStorage.removeItem('token'); // Удаляем недействительный токен
          return { success: false, error: 'Сессия истекла, пожалуйста, войдите снова' };
        } else {
          return { 
            success: false, 
            error: responseData.message || responseData.error || 'Ошибка при получении профиля' 
          };
        }
      }
    } catch (error) {
      return { success: false, error: 'Ошибка сети при получении профиля' };
    }
  }
};