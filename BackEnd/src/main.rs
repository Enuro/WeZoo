use actix_web::{middleware::Logger, web, App, HttpServer, HttpResponse};
use actix_cors::Cors;
use sea_orm::{Database, DatabaseConnection};
use utils::app_state::AppState;
use migration::{Migrator, MigratorTrait};
use actix_web::http::header;


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
    let database_url: String = (*utils::constants::DATABASE_URL).clone();

    let db: DatabaseConnection = Database::connect(database_url).await.unwrap();
    Migrator::up(&db, None).await.unwrap();

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:5173") // URL вашего React-приложения
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
            .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT, header::CONTENT_TYPE])
            .max_age(3600);

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(AppState{db: db.clone()}))
            .wrap(Logger::default())
            .configure(routes::home_routes::config)
            .configure(routes::auth_routes::config)
    })
    .bind((address, port))?
    .run()
    .await
}