import React, { useState, useEffect } from 'react';
import { authApi } from '../services/api';

interface UserProfile {
  firstName: string;
  lastName: string;
  patronymic: string;
  phone: string;
  email: string;
}

function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    patronymic: '',
    phone: '',
    email: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Загрузка данных профиля при монтировании
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authApi.getProfile();
        
        if (response.success && response.data) {
          setProfile({
            firstName: response.data.first_name || '',
            lastName: response.data.last_name || '',
            patronymic: response.data.patronymic || '',
            phone: response.data.phone || '',
            email: response.data.email || ''
          });
        } else {
          setError('Не удалось загрузить данные профиля');
        }
      } catch (err) {
        setError('Произошла ошибка при загрузке профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // В будущем здесь будет логика сохранения данных на сервер
    setSaveSuccess(true);
    
    // Скрываем сообщение об успехе через 3 секунды
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <p>Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Личный кабинет</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-md">
          {error}
        </div>
      )}
      
      {saveSuccess && (
        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded-md">
          Данные профиля успешно сохранены!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Фамилия
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              Имя
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <label htmlFor="patronymic" className="block text-sm font-medium text-gray-700 mb-2">
              Отчество
            </label>
            <input
              type="text"
              id="patronymic"
              name="patronymic"
              value={profile.patronymic}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="+7 (999) 999-99-99"
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
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Сохранить изменения
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;