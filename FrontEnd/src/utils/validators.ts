// Валидация email с помощью регулярного выражения
export const validateEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };
  
  // Валидация телефона (российский формат)
  export const validatePhone = (phone: string): boolean => {
    // Проверка на формат +7XXXXXXXXXX или 8XXXXXXXXXX
    const regex = /^(\+7|8)[0-9]{10}$/;
    
    // Удаляем все не цифровые символы для проверки
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Если номер начинается с 8, преобразуем в формат +7
    const formattedPhone = cleanPhone.startsWith('8') 
      ? '+7' + cleanPhone.substring(1) 
      : (cleanPhone.startsWith('7') ? '+' + cleanPhone : cleanPhone);
    
    return regex.test(formattedPhone);
  };
  
  // Форматирование телефонного номера в красивый вид
  export const formatPhone = (phone: string): string => {
    // Удаляем все не цифровые символы
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Если номер начинается с 8, преобразуем в формат +7
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith('8') && cleanPhone.length === 11) {
      formattedPhone = '7' + cleanPhone.substring(1);
    }
    
    // Если номер не содержит +, добавляем его для номеров, начинающихся с 7
    if (formattedPhone.startsWith('7') && formattedPhone.length === 11) {
      formattedPhone = '+' + formattedPhone;
    }
    
    // Форматируем номер в виде +7 (XXX) XXX-XX-XX
    if (formattedPhone.startsWith('+7') && formattedPhone.length === 12) {
      return formattedPhone.replace(/(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5');
    }
    
    return phone; // Возвращаем исходный номер, если он не соответствует ожидаемому формату
  };
  
  // Валидация пароля (минимум 6 символов, должен содержать буквы и цифры)
  export const validatePassword = (password: string): boolean => {
    return password.length >= 6 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  };
  
  // Валидация имени и фамилии (не пусто, только буквы)
  export const validateName = (name: string): boolean => {
    return name.trim().length > 0 && /^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(name);
  };