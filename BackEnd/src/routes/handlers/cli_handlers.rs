use actix_web::{get, Responder};

use crate::utils::api_response::ApiResponse;

#[get("/")]
pub async fn only() -> impl Responder{
    ApiResponse::new(200, "only".to_string())
}