use actix_web::web;

use super::handlers;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg
    .service(
        web::scope("/home")
        .service(handlers::home_handlers::greet)
        .service(handlers::home_handlers::test)
    );
}

