use actix_web::{get, web, Responder};

use crate::utils::api_response;

#[get("/hello/{name}")]
pub async fn greet(name: web::Path<String>) -> impl Responder {
   api_response::ApiResponse::new(300, format!("кукуруза {name}"))
}

#[get("/test")]
pub async fn test() -> impl Responder {
   api_response::ApiResponse::new(200, "Niggers".to_string())
}