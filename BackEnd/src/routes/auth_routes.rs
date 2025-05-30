use actix_web::web;

use super::handlers;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg
    .service(
        web::scope("/auth")
        .service(handlers::register_handlers::register)
        .service(handlers::login_handlers::login)
        .service(handlers::verify_handlers::send_otp)
        .service(handlers::verify_handlers::verify_otp)
    );
}