import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { validateEmail, validatePhone, validatePassword, validateName, formatPhone } from '../utils/validators';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Поля для входа
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Дополнительные поля для регистрации
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [phone, setPhone] = useState('');
  
  // Ошибки валидации
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, register, error: storeError } = useAuthStore();
  
  // Синхронизация ошибки из store
  useEffect(() => {
    if (storeError) {
      setGeneralError(storeError);
    }
  }, [storeError]);

  // Обработка ввода телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Убираем все символы, кроме цифр, +, (, ), -
    const sanitizedValue = value.replace(/[^\d+()-\s]/g, '');
    setPhone(sanitizedValue);
    
    // Сбрасываем ошибку при изменении поля
    setPhoneError(null);
  };
  
  // Валидация всех полей
  const validateFields = (isLoginForm: boolean) => {
    let isValid = true;
    
    // Сбрасываем все ошибки
    setEmailError(null);
    setPasswordError(null);
    setPhoneError(null);
    setFirstNameError(null);
    setLastNameError(null);
    setGeneralError(null);
    
    // Проверка на наличие хотя бы одного метода входа
    if (!email && !phone) {
      setGeneralError('Необходимо указать email или телефон');
      isValid = false;
    }
    
    // Проверка email, если он указан
    if (email && !validateEmail(email)) {
      setEmailError('Некорректный формат email');
      isValid = false;
    }
    
    // Проверка пароля для email
    if (email && (!password || (isLoginForm ? false : !validatePassword(password)))) {
      setPasswordError(isLoginForm 
        ? 'Необходимо указать пароль для входа по email' 
        : 'Пароль должен содержать минимум 6 символов, включая буквы и цифры');
      isValid = false;
    }
    
    // Проверка телефона, если он указан
    if (phone && !validatePhone(phone.replace(/\D/g, ''))) {
      setPhoneError('Некорректный формат телефона');
      isValid = false;
    }
    
    // Дополнительные проверки для формы регистрации
    if (!isLoginForm) {
      if (!firstName || !validateName(firstName)) {
        setFirstNameError('Укажите корректное имя');
        isValid = false;
      }
      
      if (!lastName || !validateName(lastName)) {
        setLastNameError('Укажите корректную фамилию');
        isValid = false;
      }
    }
    
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFields(true)) {
      return;
    }
    
    setLoading(true);
    
    const formattedPhone = phone ? formatPhone(phone) : undefined;
    const success = await login(email, password);
    setLoading(false);
    
    if (success) {
      navigate('/profile');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFields(false)) {
      return;
    }
    
    setLoading(true);
    
    const formattedPhone = phone ? formatPhone(phone) : undefined;
    const registerData = {
      first_name: firstName,
      last_name: lastName,
      patronymic,
      email: email || undefined,
      phone: formattedPhone || undefined,
      password: password || undefined
    };
    
    const success = await register(registerData);
    setLoading(false);
    
    if (success) {
      // После успешной регистрации переключаемся на форму входа
      setIsLogin(true);
      setGeneralError('Регистрация успешна! Теперь вы можете войти.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isLogin ? 'Вход' : 'Регистрация'}
      </h1>
      
      {generalError && (
        <div className={`p-3 mb-4 rounded-md ${generalError.includes('успешна') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {generalError}
        </div>
      )}
      
      {isLogin ? (
        // Форма входа
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              className={`w-full px-4 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-emerald-500 focus:border-emerald-500`}
            />
            {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+7 (999) 999-99-99"
              className={`w-full px-4 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-emerald-500 focus:border-emerald-500`}
            />
            {phoneError && <p className="mt-1 text-sm text-red-500">{phoneError}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(null);
              }}
              className={`w-full px-4 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-emerald-500 focus:border-emerald-500`}
            />
            {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:bg-emerald-400"
          >
            {loading ? 'Выполняется вход...' : 'Войти'}
          </button>
        </form>
      ) : (
        // Форма регистрации
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Фамилия
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setLastNameError(null);
                }}
                className={`w-full px-4 py-2 border ${lastNameError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-emerald-500 focus:border-emerald-500`}
                required
              />
              {lastNameError && <p className="mt-1 text-sm text-red-500">{lastNameError}</p>}
            </div>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                Имя
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setFirstNameError(null);
                }}
                className={`w-full px-4 py-2 border ${firstNameError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-emerald-500 focus:border-emerald-500`}
                required
              />
              {firstNameError && <p className="mt-1 text-sm text-red-500">{firstNameError}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="patronymic" className="block text-sm font-medium text-gray-700 mb-2">
              Отчество
            </label>
            <input
              type="text"
              id="patronymic"
              value={patronymic}
              onChange={(e) => setPatronymic(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              className={`w-full px-4 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-emerald-500 focus:border-emerald-500`}
            />
            {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+7 (999) 999-99-99"
              className={`w-full px-4 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-emerald-500 focus:border-emerald-500`}
            />
            {phoneError && <p className="mt-1 text-sm text-red-500">{phoneError}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(null);
              }}
              className={`w-full px-4 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-emerald-500 focus:border-emerald-500`}
            />
            {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:bg-emerald-400"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            // Переключение между формами входа и регистрации
            setIsLogin(!isLogin);
            
            // Очистка всех полей формы
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setPatronymic('');
            setPhone('');
            
            // Очистка всех ошибок
            setGeneralError(null);
            setEmailError(null);
            setPasswordError(null);
            setPhoneError(null);
            setFirstNameError(null);
            setLastNameError(null);
          }}
          className="text-emerald-600 hover:text-emerald-700"
        >
          {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
        </button>
      </div>
    </div>
  );
}

export default Auth;