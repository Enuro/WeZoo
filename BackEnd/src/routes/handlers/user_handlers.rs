use actix_web::{
    delete, 
    get, 
    post, 
    web, 
    HttpMessage, 
    HttpResponse, 
    Responder
};
use entity::user::{ActiveModel, Model};
use sea_orm::{
    ActiveValue::Set,
    ActiveModelTrait, 
    ColumnTrait, 
    EntityTrait, 
    ModelTrait, 
    QueryFilter
};
use serde::{Deserialize, Serialize};
use sha256::digest;

use crate::utils::{api_response::ApiResponse, app_state::AppState, jwt::Claims};

#[derive(Serialize, Default)]
struct User{
    first_name: String,
    last_name: String,
    patronymic: String,
    email: Option<String>,
    phone: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct UpdateModel{
    first_name: Option<String>,
    last_name: Option<String>,
    patronymic: Option<String>,
    phone: Option<String>,
    email: Option<String>,
    password: Option<String>,
    data_birt: Option<String>,
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
    // ApiResponse::new(200, "Вы успешно зашли".to_string());
    
    HttpResponse::Ok().json(usr)
}

#[post("/profile/update")]
pub async fn update(
    update_json: web::Json<UpdateModel>,
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

    let mut user: ActiveModel = user.unwrap().into();
    if let Some(first_name) = &update_json.first_name {
        user.first_name = Set(Some(first_name.clone()));
    }
    
    if let Some(last_name) = &update_json.last_name {
        user.last_name = Set(Some(last_name.clone()));
    }

    if let Some(patronymic) = &update_json.patronymic {
        user.patronymic = Set(Some(patronymic.clone()));
    }

    if let Some(phone) = &update_json.phone {
        user.phone = Set(Some(phone.clone()));
    }

    if let Some(email) = &update_json.email {
        user.email = Set(Some(email.clone()));

        if let Some(password) = &update_json.password {
            user.password = Set(Some(digest(password)));
        }
    }
    
    if let Some(data_birt) = &update_json.data_birt {
        user.data_birt = Set(Some(data_birt.clone()));
    }

    let user: Model = user.update(&app_state.db).await.unwrap();

    ApiResponse::new(200, format!("Пользователь {:?} успешно обнавлен", user.first_name))
}

#[delete("/profile/delete")]
pub async fn delete(
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

    let user = user.unwrap();

    let name = user.clone().first_name.unwrap_or_default().to_string();

    user.delete(&app_state.db).await.unwrap();

    ApiResponse::new(200, format!("Пользователь {} успешно удален!", name))
}