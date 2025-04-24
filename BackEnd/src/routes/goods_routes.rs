use actix_web::web;

use super::handlers;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg
    .service(
        web::scope("/goods")
        .service(handlers::goods_handlers::create)
        .service(handlers::goods_handlers::unload)
    );
}