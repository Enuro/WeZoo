use actix_web::{get, web, HttpResponse, Responder};
use actix_web_httpauth::extractors::bearer::BearerAuth;
use sea_orm::EntityTrait;
use serde::Serialize;

use crate::utils::{api_response, app_state, jwt};

#[derive(Serialize)]
struct UserModel{
    first_name: String,
    last_name: String,
    patronymic: String,
    email: Option<String>,
    phone: Option<String>,
    data_reg: Option<String>,
    data_birt: Option<String>,
}

#[get("/profile")]
pub async fn profile(
    app_state: web::Data<app_state::AppState>,
    auth: BearerAuth,
) -> impl Responder {

    let token = auth.token();
    let user_id = match  jwt::decode_jwt(token.to_string()) {
        Ok(claims) => claims.claims.id,
        Err(_) => return HttpResponse::Unauthorized().json("Invalid token")
    };

    let user = entity::user::Entity::find_by_id(user_id).one(app_state.get_ref()).await;

    match user {
        Ok(Some(user)) => HttpResponse::Ok().json(user),
        Ok(None) => HttpResponse::NotFound().json("User not found"),
        Err(err) => HttpResponse::InternalServerError().json(err.to_string()),
    }

    // api_response::ApiResponse::new(200, "Verifyed user".to_string());
}