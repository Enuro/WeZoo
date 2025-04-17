use actix_web::{get, HttpMessage, Responder, web, HttpResponse};
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use serde::Serialize;

use crate::utils::{api_response::ApiResponse, app_state::AppState, jwt::Claims};

#[derive(Serialize, Default)]
struct User{
    first_name: String,
    last_name: String,
    patronymic: String,
    email: Option<String>,
    phone: Option<String>,
}

#[get("/profile")]
pub async fn profile(   
    app_state: web::Data<AppState>,
    req: actix_web::HttpRequest,
) -> impl Responder {
    let extensions = req.extensions();

    let claims = extensions.get::<Claims>().expect("JWT middleware should set claims");
    
    let user = entity::user::Entity::find()
        .filter(entity::user::Column::Id.eq(claims.user_id))
        .one(&app_state.db)
        .await
        .unwrap();

    let usr = User{
        first_name: user.clone().unwrap().first_name.expect("REASON").to_string(),
        last_name: user.clone().unwrap().last_name.expect("REASON").to_string(),
        patronymic: user.clone().unwrap().patronymic.expect("REASON").to_string(),
        email: Some(user.clone().unwrap().email.expect("REASON")),
        phone: Some(user.clone().unwrap().phone.expect("REASON"))
    };

    HttpResponse::Ok().json(usr);

    ApiResponse::new(200, format!("{:?}", user))
}