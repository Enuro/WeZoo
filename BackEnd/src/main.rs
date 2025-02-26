use actix_web::{middleware::Logger, web, App, HttpResponse, HttpServer};

mod routes;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {

    if std::env::var_os("RUST_LOG").is_none(){
        std::env::set_var("RUST_LOG", "actix_web=info");
    }

    dotenv::dotenv().ok();
    env_logger::init();

    let port: u16 = (*utils::constants::PORT).clone();
    let address: String = (*utils::constants::ADDRESS).clone();

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .configure(routes::home_routers::config)
            .route(
                "/",
                web::get().to(|| async { HttpResponse::Ok().body("/") }),
            )
    })
    .bind((address, port))?
    .run()
    .await
}