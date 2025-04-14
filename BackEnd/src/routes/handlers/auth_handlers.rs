use actix_web::{post, web, Responder};
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
use validator::Validate;

use crate::utils::jwt::encode_jwt;
use crate::utils::{api_response, app_state::AppState};

#[derive(Serialize, Deserialize, Validate)]
struct RegisterModel {
    first_name: String,
    last_name: String,
    patronymic: String,
    #[validate(email)]
    email: Option<String>,
    #[validate(phone)]
    phone: Option<String>,
    password: Option<String>
}

#[derive(Serialize, Deserialize, Validate)]
struct LoginModel {
    #[validate(email)]
    email: Option<String>,
    #[validate(phone)]
    phone: Option<String>,
    password: Option<String>
}

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
    if register_json.email.is_some() && register_json.password.is_none() {
        return api_response::ApiResponse::new(400, "Для регистрации по email необходимо указать пароль".to_string());
    }
    
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
    
    // Создание новой модели пользователя
    let mut user_model = entity::user::ActiveModel {
        first_name: Set(Some(register_json.first_name.clone())),
        last_name: Set(Some(register_json.last_name.clone())),
        patronymic: Set(Some(register_json.patronymic.clone())),
        role: Set(Some("client".to_string())),
        ..Default::default()
    };
    
    // Устанавливаем email и пароль, если они предоставлены
    if let Some(email) = &register_json.email {
        user_model.email = Set(Some(email.clone()));
        
        if let Some(password) = &register_json.password {
            user_model.password = Set(Some(digest(password)));
        }
    }
    
    // Устанавливаем телефон, если он предоставлен
    if let Some(phone) = &register_json.phone {
        user_model.phone = Set(Some(phone.clone()));
    }
    
    // Сохраняем пользователя в базу данных
    let user = user_model.insert(&app_state.db).await.unwrap();
    
    api_response::ApiResponse::new(200, serde_json::json!({
        "id": user.id,
        "message": "Регистрация успешно завершена"
    }).to_string())
}

#[post("/login")]
pub async fn login(
    app_state: web::Data<AppState>,
    login_json: web::Json<LoginModel>
) -> impl Responder {
    // Проверка наличия хотя бы одного контакта
    if login_json.email.is_none() && login_json.phone.is_none() {
        return api_response::ApiResponse::new(400, "Необходимо указать email или номер телефона".to_string());
    }
    
    let mut user = None;

    if let Err(err) = login_json.validate() {
        return api_response::ApiResponse::new(400, format!("Validation error: {:?}", err));
    }
    // Поиск пользователя по email и паролю
    if let Some(email) = &login_json.email {
        if let Some(password) = &login_json.password {
            user = entity::user::Entity::find()
                .filter(
                    Condition::all()
                    .add(entity::user::Column::Email.eq(email.clone()))
                    .add(entity::user::Column::Password.eq(digest(password.clone())))
                )
                .one(&app_state.db)
                .await
                .unwrap();
        } else {
            return api_response::ApiResponse::new(400, "Для входа по email необходимо указать пароль".to_string());
        }
    }
    
    // Поиск пользователя по телефону
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
    let identifier = user_data.email.clone().unwrap_or_else(|| user_data.id.to_string());
    let token = encode_jwt(identifier, user_data.id).unwrap();
    
    api_response::ApiResponse::new(200, serde_json::json!({
        "token": token
    }).to_string())
}
