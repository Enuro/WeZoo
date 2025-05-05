use actix_web::{post, Responder, web};
use serde::{Deserialize, Serialize};

use crate::utils::{app_state::AppState, api_response::ApiResponse};

#[derive(Serialize, Deserialize)]
struct PetsModel{

}

#[post("/add")]
pub async fn add(
    app_state: web::Data<AppState>,
    pets_json: web::Json<PetsModel>,
    req: actix_web::HttpRequest,
) -> impl Responder{
    ApiResponse::new(200, "ladno".to_string())
}