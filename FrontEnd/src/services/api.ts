const API_URL = 'http://localhost:8080'; // URL вашего API

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

// Интерфейс для обновления профиля
interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  phone?: string;
  email?: string;
}

// Интерфейс для профиля пользователя
interface UserProfile {
  id: number;
  first_name: string | null;
  last_name: string | null;
  patronymic: string | null;
  phone: string | null;
  email: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Функция для парсинга ответа от бэкенда в формате Rust String
function parseRustModelString(text: string): UserProfile | null {
  try {
    // Ищем id в строке
    const idMatch = text.match(/id: (\d+)/);
    if (!idMatch) return null;
    const id = parseInt(idMatch[1], 10);
    
    // Ищем first_name
    const firstNameMatch = text.match(/first_name: Some\("([^"]*)"\)/);
    const firstName = firstNameMatch ? firstNameMatch[1] : null;
    
    // Ищем last_name
    const lastNameMatch = text.match(/last_name: Some\("([^"]*)"\)/);
    const lastName = lastNameMatch ? lastNameMatch[1] : null;
    
    // Ищем patronymic
    const patronymicMatch = text.match(/patronymic: Some\("([^"]*)"\)/);
    const patronymic = patronymicMatch ? patronymicMatch[1] : null;
    
    // Ищем phone
    const phoneMatch = text.match(/phone: Some\("([^"]*)"\)/);
    const phone = phoneMatch ? phoneMatch[1] : null;
    
    // Ищем email, который может быть None или Some
    const emailNoneMatch = text.match(/email: None/);
    const emailSomeMatch = text.match(/email: Some\("([^"]*)"\)/);
    const email = emailNoneMatch ? null : (emailSomeMatch ? emailSomeMatch[1] : null);

    return {
      id,
      first_name: firstName,
      last_name: lastName,
      patronymic: patronymic,
      phone: phone,
      email: email
    };
  } catch (e) {
    console.error('Error parsing Rust model string:', e);
    return null;
  }
}

export const authApi = {
  // Авторизация пользователя
  login: async (data: LoginData): Promise<ApiResponse<{ token: string }>> => {
    try {
      console.log('Login request data:', data);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('Login response status:', response.status);
      
      // Сначала получаем текст ответа для отладки
      const responseText = await response.text();
      console.log('Login response text:', responseText);
      
      // Затем преобразуем его в JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing login response:', e);
        return { success: false, error: 'Некорректный формат ответа сервера' };
      }
      
      if (response.ok) {
        return { success: true, data: responseData };
      } else {
        // Улучшенная обработка конкретных ошибок
        if (response.status === 401) {
          return { success: false, error: 'Неверные учетные данные для входа' };
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
      console.error('Login network error:', error);
      return { success: false, error: 'Ошибка сети при попытке входа' };
    }
  },
  
  // Регистрация пользователя
  register: async (data: RegisterData): Promise<ApiResponse<{ id: number, message: string }>> => {
    try {
      console.log('Register request data:', data);
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('Register response status:', response.status);
      
      // Сначала получаем текст ответа для отладки
      const responseText = await response.text();
      console.log('Register response text:', responseText);
      
      // Затем преобразуем его в JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing register response:', e);
        return { success: false, error: 'Некорректный формат ответа сервера' };
      }
      
      if (response.ok) {
        return { success: true, data: responseData };
      } else {
        // Улучшенная обработка конкретных ошибок регистрации
        if (response.status === 409) {
          return { 
            success: false, 
            error: data.email 
              ? 'Пользователь с таким email уже существует'
              : 'Пользователь с таким телефоном уже существует'
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
      console.error('Register network error:', error);
      return { success: false, error: 'Ошибка сети при попытке регистрации' };
    }
  },
  
  // Получение данных профиля пользователя
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found');
      return { success: false, error: 'Нет токена авторизации' };
    }
    
    try {
      console.log('Fetching profile with token:', token);
      
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Profile response status:', response.status);
      
      // Получаем текст ответа
      const responseText = await response.text();
      console.log('Profile response text:', responseText);
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          return { success: false, error: 'Сессия истекла, пожалуйста, войдите снова' };
        }
        
        return { success: false, error: `Ошибка запроса: ${response.statusText}` };
      }
      
      // Пробуем сначала как обычный JSON
      try {
        const profileData = JSON.parse(responseText);
        console.log('Profile data parsed as JSON:', profileData);
        return { success: true, data: profileData };
      } catch (e) {
        console.log('Response is not valid JSON, trying to parse as Rust string model');
        
        // Если не JSON, пробуем парсить как Rust строку
        const profileData = parseRustModelString(responseText);
        if (profileData) {
          console.log('Profile data parsed from Rust string:', profileData);
          return { success: true, data: profileData };
        } else {
          console.error('Failed to parse profile data from response');
          return { success: false, error: 'Не удалось разобрать данные профиля' };
        }
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      return { success: false, error: 'Ошибка сети при получении профиля' };
    }
  },
  
  // Обновление данных профиля пользователя
  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<UserProfile>> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found for update profile');
      return { success: false, error: 'Нет токена авторизации' };
    }
    
    try {
      console.log('Updating profile with data:', data);
      
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT', // или 'PATCH' в зависимости от реализации вашего API
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('Update profile response status:', response.status);
      
      // Получаем текст ответа
      const responseText = await response.text();
      console.log('Update profile response text:', responseText);
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          return { success: false, error: 'Сессия истекла, пожалуйста, войдите снова' };
        }
        
        return { success: false, error: `Ошибка запроса: ${response.statusText}` };
      }
      
      // Для обратной совместимости - если сервер не возвращает данные
      if (responseText.trim() === '') {
        // Имитируем ответ с локальными данными
        return { 
          success: true, 
          data: { 
            id: 0, // Заполнится позже при перезагрузке профиля
            first_name: data.first_name || null,
            last_name: data.last_name || null,
            patronymic: data.patronymic || null,
            phone: data.phone || null,
            email: data.email || null
          }
        };
      }
      
      // Пробуем сначала как обычный JSON
      try {
        const profileData = JSON.parse(responseText);
        console.log('Updated profile data parsed as JSON:', profileData);
        return { success: true, data: profileData };
      } catch (e) {
        console.log('Response is not valid JSON, trying to parse as Rust string model');
        
        // Если не JSON, пробуем парсить как Rust строку
        const profileData = parseRustModelString(responseText);
        if (profileData) {
          console.log('Updated profile data parsed from Rust string:', profileData);
          return { success: true, data: profileData };
        } else {
          // В случае ошибки - вернем имитацию успешного обновления
          return { 
            success: true, 
            data: { 
              id: 0, // Заполнится позже при перезагрузке профиля
              first_name: data.first_name || null,
              last_name: data.last_name || null,
              patronymic: data.patronymic || null,
              phone: data.phone || null,
              email: data.email || null
            }
          };
        }
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Ошибка сети при обновлении профиля' };
    }
  }
};