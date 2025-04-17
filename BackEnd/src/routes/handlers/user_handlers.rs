use actix_web::{get, HttpMessage, Responder, web, HttpResponse};
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use serde::Serialize;

use crate::utils::{api_response::ApiResponse, app_state::AppState, jwt::Claims};

// #[derive(Serialize)]
// // struct User{
// //     first_name: String,
// //     last_name: String,
// //     patronymic: String,
// //     email: Option<String>,
// //     phone: Option<String>,
// // }

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

        HttpResponse::Ok().json(user.clone());

    ApiResponse::new(200, format!("{:?}", user))
}