use actix_web::{post, web, Responder};
use entity::sea_orm_active_enums::Role;
use sea_orm::{
    ActiveValue::Set, 
    EntityTrait, 
    ActiveModelTrait, 
    QueryFilter, 
    ColumnTrait,
     
};
use sha256::digest;
use validator::Validate;

use crate::utils::{
    api_response, 
    app_state::AppState, 
    model::RegisterModel
};

#[post("/register")]
pub async fn register(
    app_state: web::Data<AppState>,
    register_json: web::Json<RegisterModel>
) -> impl Responder {
    // Проверка наличия хотя бы одного контакта
    if register_json.email.is_none() && register_json.phone.is_none() {
        return api_response::ApiResponse::new(400, "Необходимо указать email или номер телефона".to_string());
    }

    if let Err(err) = register_json.validate() {
        return api_response::ApiResponse::new(400, format!("Validation error: {:?}", err));
    }

    // Проверка на наличие пароля для email
    // if register_json.email.is_some() && register_json.password.is_none() {
    //     return api_response::ApiResponse::new(400, "Для регистрации по email необходимо указать пароль".to_string());
    // }
    
    // Проверка, не занят ли уже email или телефон
    if let Some(email) = &register_json.email {
        let existing_user = entity::user::Entity::find()
            .filter(entity::user::Column::Email.eq(email.clone()))
            .one(&app_state.db)
            .await
            .unwrap();
            
        if existing_user.is_some() {
            return api_response::ApiResponse::new(409, "Пользователь с таким email уже существует".to_string());
        }
    }
    
    if let Some(phone) = &register_json.phone {
        let existing_user = entity::user::Entity::find()
            .filter(entity::user::Column::Phone.eq(phone.clone()))
            .one(&app_state.db)
            .await
            .unwrap();
            
        if existing_user.is_some() {
            return api_response::ApiResponse::new(409, "Пользователь с таким номером телефона уже существует".to_string());
        }
    }
    
    let mut user_model = entity::user::ActiveModel {
        first_name: Set(Some(register_json.first_name.clone())),
        last_name: Set(Some(register_json.last_name.clone())),
        patronymic: Set(Some(register_json.patronymic.clone())),
        verify: Set(Some(false)),
        ..Default::default()
    };

    if &register_json.role == "admin" {
        user_model.role = Set(Role::Admin)
    } else if &register_json.role == "clinic_owner" {
        user_model.role = Set(Role::ClinicOwner)
    } else {
        user_model.role = Set(Role::Client)
    }
    
    
    if let Some(email) = &register_json.email {
        user_model.email = Set(Some(email.clone()));
    }
    
    if let Some(phone) = &register_json.phone {
        user_model.phone = Set(Some(phone.clone()));
    }

    if let Some(password) = &register_json.password {
        user_model.password = Set(Some(digest(password)));
    }
    
    let user = user_model.insert(&app_state.db).await.unwrap();
    
    api_response::ApiResponse::new(200, serde_json::json!({
        "id": user.id,
        "message": "Регистрация успешно завершена"
    }).to_string())
}