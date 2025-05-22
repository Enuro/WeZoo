FROM rust:1.86-slim as builder
WORKDIR /usr/src/app
RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
COPY . .
RUN cargo build --release
FROM rust:1.86-slim
WORKDIR /usr/local/bin
RUN apt-get update && \
    apt-get install -y libpq5 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/src/app/target/release/WeZoo /usr/local/bin/wezoo
EXPOSE 8080
CMD ["wezoo"]
