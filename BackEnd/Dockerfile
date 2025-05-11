FROM rust:1.86-slim as builder

WORKDIR /usr/src/app

# Устанавливаем зависимости для системы (для PostgreSQL)
RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Копируем всё содержимое проекта включая подмодули
COPY . .

# Проверяем структуру проекта
RUN ls -la && \
    ls -la entity && \
    ls -la migration

# Собираем с реальными исходными файлами
RUN cargo build --release

# Финальный образ - используем тот же базовый образ, что и для сборки,
# чтобы избежать проблем с совместимостью glibc
FROM rust:1.86-slim

WORKDIR /usr/local/bin

# Устанавливаем необходимые зависимости
RUN apt-get update && \
    apt-get install -y libpq5 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Копируем исполняемый файл из builder
COPY --from=builder /usr/src/app/target/release/WeZoo /usr/local/bin/wezoo

EXPOSE 8080

# Запуск бэкенда
CMD ["wezoo"]
