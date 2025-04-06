use actix_web::web;

use super::handlers;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg
    .service(
        web::scope("/auth")
        .service(handlers::auth_handlers::register_email)
        .service(handlers::auth_handlers::register_phone)
        .service(handlers::auth_handlers::login_email)
        .service(handlers::auth_handlers::login_phone)
    );
}