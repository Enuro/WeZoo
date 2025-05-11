FROM node:22.14-alpine as build

WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Финальный образ на nginx
FROM nginx:alpine

# Копируем собранные файлы из build образа
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомный nginx конфиг, если нужно
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
