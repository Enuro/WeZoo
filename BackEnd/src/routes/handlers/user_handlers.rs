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

    let user_data = user.unwrap();

    let usr = User{
        first_name: user_data.first_name.unwrap_or_default().to_string(),
        last_name: user_data.last_name.unwrap_or_default().to_string(),
        patronymic: user_data.patronymic.unwrap_or_default().to_string(),
        email: user_data.email.clone(),
        phone: user_data.phone.clone()
    };
    ApiResponse::new(200, "Вы успешно зашли".to_string());
    
    HttpResponse::Ok().json(usr)
}