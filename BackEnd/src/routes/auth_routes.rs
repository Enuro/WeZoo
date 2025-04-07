use actix_web::web;

use super::handlers;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg
    .service(
        web::scope("/auth")
        .service(handlers::auth_handlers::register)
        .service(handlers::auth_handlers::login)
    );
}