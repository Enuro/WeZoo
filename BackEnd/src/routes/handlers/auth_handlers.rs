use std::fmt::format;

use actix_web::{post, web, Responder};
use actix_web::http::header::Date;
use sea_orm::{
    ActiveValue::Set, 
    EntityTrait, 
    ActiveModelTrait, 
    QueryFilter, 
    ColumnTrait, 
    Condition
};
use serde::{Serialize, Deserialize};
use sha256::digest;

use crate::utils::jwt::encode_jwt;
use crate::utils::{api_response, app_state::{self, AppState}};

#[derive(Serialize, Deserialize)]
struct RegisterEmailModel{
    first_name: String,
    last_name: String,
    patronymic: String,
    email: String,
    password: String
}

#[derive(Serialize, Deserialize)]
struct RegisterPhoneModel{
    first_name: String,
    last_name: String,
    patronymic: String,
    phone: String
}

#[derive(Serialize, Deserialize)]
struct LoginEmailModel{
    email: String,
    password: String
}

#[derive(Serialize, Deserialize)]
struct LoginPhoneModel{
    phone: String
}

#[post("/register/email")]
pub async fn register_email(
    app_state: web::Data<AppState>, 
    register_json: web::Json<RegisterEmailModel>
) -> impl Responder {

    let user_model = entity::user::ActiveModel{
        first_name: Set(Some(register_json.first_name.clone())),
        last_name: Set(Some(register_json.last_name.clone())),
        patronymic: Set(Some(register_json.patronymic.clone())),
        email: Set(Some(register_json.email.clone())),
        password: Set(Some(digest(&register_json.password))),
        role: Set(Some("client".to_string())),
        ..Default::default()
    }.insert(&app_state.db).await.unwrap();

    api_response::ApiResponse::new(200, format!("{}", user_model.id))
}

#[post("/register/phone")]
pub async fn register_phone(
    app_state: web::Data<AppState>, 
    register_json: web::Json<RegisterPhoneModel>
) -> impl Responder {

    let user_model = entity::user::ActiveModel{
        first_name: Set(Some(register_json.first_name.clone())),
        last_name: Set(Some(register_json.last_name.clone())),
        patronymic: Set(Some(register_json.patronymic.clone())),
        phone: Set(Some(register_json.phone.clone())),
        role: Set(Some("client".to_string())),
        ..Default::default()
    }.insert(&app_state.db).await.unwrap();

    api_response::ApiResponse::new(200, format!("{}", user_model.id))
}


#[post("/login/email")]
pub async fn login_email(
    app_state: web::Data<AppState>,
    login_json: web::Json<LoginEmailModel>
) -> impl Responder {
    let user = entity::user::Entity::find()
    .filter(
        Condition::all()
        .add(entity::user::Column::Email.eq(login_json.email.clone()))
        .add(entity::user::Column::Password.eq(digest(login_json.password.clone())))
    ).one(&app_state.db).await.unwrap();

    if user.is_none(){
            return api_response::ApiResponse::new(401, "User Not Found".to_string());
    }

    let user_data = user.unwrap();

    let token = encode_jwt(user_data.email.expect("REASON"), user_data.id).unwrap();

    api_response::ApiResponse::new(200, format!("{{ 'token':'{}' }}", token))
}

#[post("/login/phone")]
pub async fn login_phone(
    app_state: web::Data<AppState>,
    login_json: web::Json<LoginPhoneModel>
) -> impl Responder {
    let user = entity::user::Entity::find()
    .filter(
        Condition::all()
        .add(entity::user::Column::Phone.eq(login_json.phone.clone()))
    ).one(&app_state.db).await.unwrap();

    if user.is_none(){
        return api_response::ApiResponse::new(401, "User Not Found".to_string());
    }

    let user_data = user.unwrap();

    let token = encode_jwt(user_data.email.expect("REASON"), user_data.id).unwrap();

    api_response::ApiResponse::new(200, format!("{{ 'token':'{}' }}", token))
}