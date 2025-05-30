use actix_web::{ post, web, Responder};
use sea_orm::{ 
    EntityTrait, 
    QueryFilter, 
    ColumnTrait, 
    Condition
};
use sha256::digest;
use validator::Validate;

use crate::utils::{
    api_response, 
    jwt::encode_jwt,
    app_state::AppState, 
    model::LoginModel
};
// use crate::service::twilios::TwilioService;

#[post("/login")]
pub async fn login(
    app_state: web::Data<AppState>,
    login_json: web::Json<LoginModel>
) -> impl Responder {
    if login_json.email.is_none() && login_json.phone.is_none() {
        return api_response::ApiResponse::new(400, "Необходимо указать email или номер телефона".to_string());
    }
    
    let mut user = None;

    if let Err(err) = login_json.validate() {
        return api_response::ApiResponse::new(400, format!("Validation error: {:?}", err));
    }

    if let Some(email) = &login_json.email {
        if let Some(password) = &login_json.password {
            user = entity::user::Entity::find()
                .filter(
                    Condition::all()
                    .add(entity::user::Column::Email.eq(email.clone()))
                    .add(entity::user::Column::Password.eq(digest(password.clone())))
                )
                .one(&app_state.db)
                .await.unwrap();
        } else {
            return api_response::ApiResponse::new(400, "Для входа по email необходимо указать пароль".to_string());
        }
    }

    if let Some(phone) = &login_json.phone {
        if let Some(password) = &login_json.password {
            user = entity::user::Entity::find()
                .filter(
                    Condition::all()
                    .add(entity::user::Column::Phone.eq(phone.clone()))
                    .add(entity::user::Column::Password.eq(digest(password.clone())))
                )
                .one(&app_state.db)
                .await.unwrap();
        } else {
            return api_response::ApiResponse::new(400, "Для входа по номеру телефона необходимо указать пароль".to_string());
        }
    }

    if user.is_none() && login_json.email.is_some() {
        user = entity::user::Entity::find()
            .filter(entity::user::Column::Email.eq(login_json.email.clone().unwrap()))
            .one(&app_state.db)
            .await
            .unwrap();
    }
    

    if user.is_none() && login_json.phone.is_some() {
        user = entity::user::Entity::find()
            .filter(entity::user::Column::Phone.eq(login_json.phone.clone().unwrap()))
            .one(&app_state.db)
            .await
            .unwrap();
    }
    
    if user.is_none() {
        return api_response::ApiResponse::new(401, "Пользователь не найден".to_string());
    }
    
    let user_data = user.unwrap();
    
    // Для создания токена используем email (если есть) или id
    let email = user_data.email.clone().unwrap_or_else(|| user_data.id.to_string());
    let phone = user_data.phone.clone().unwrap_or_else(|| user_data.id.to_string());
    let token = encode_jwt(email, phone, user_data.id).unwrap();
    
    api_response::ApiResponse::new(200, serde_json::json!({
        "token": token
    }).to_string())
}
