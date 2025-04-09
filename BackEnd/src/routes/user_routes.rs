use actix_web::{middleware::from_fn, web};
use actix_web_lab::middleware;

use super::{handlers, middlewares};

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg
    .service(
        web::scope("/user")
        .wrap(from_fn(middlewares::auth_middlewares::check_auth_middleware))
        .service(handlers::user_handlers::user)
    );
}