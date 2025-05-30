use serde::{Serialize, Deserialize};
use validator::Validate;

//Модель для регисстрации
#[derive(Deserialize, Validate)]
pub struct RegisterModel {
    pub first_name: String,
    pub last_name: String,
    pub patronymic: String,
    #[validate(email)]
    pub email: Option<String>,
    #[validate(phone)]
    pub phone: Option<String>,
    pub password: Option<String>,
    pub role: String,
    pub verify: Option<bool>
}
//Модель для аунтификации
#[derive(Deserialize, Validate)]
pub struct LoginModel {
    #[validate(email)]
    pub email: Option<String>,
    #[validate(phone)]
    pub phone: Option<String>,
    pub password: Option<String>
}
//Модели для двухфакторной аунтификации
#[derive(Deserialize, Validate, Debug, Clone)]
pub struct VerifyOTPData{
    #[validate(phone)]
    pub phone: Option<String>,
    #[validate(email)]
    pub email: Option<String>,
    pub code: String
}

#[derive(Deserialize, Validate, Debug, Clone)]
pub struct OTPData{
    #[validate(phone)]
    pub phone: Option<String>,
    #[validate(email)]
    pub email: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct OTPVerifyResponse{
    pub status: String
}

#[derive(Deserialize, Debug, Clone)]
pub struct OTPResponse {
    pub sid: String,
}

//Модели для пользователя и манипуляции с ним
#[derive(Serialize, Default)]
pub struct User{
    pub first_name: String,
    pub last_name: String,
    pub patronymic: String,
    pub email: Option<String>,
    pub phone: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateModel{
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub patronymic: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub password: Option<String>,
    pub data_birt: Option<String>,
}

//Модели для товаров
#[derive(Serialize)]
pub struct Goods{
    pub name: String,
    pub pic: Option<String>,
    pub description: Option<String>,
    pub article: String,
    pub description_imp: Option<String>,
}

#[derive(Deserialize)]
pub struct GoodsModel{
    pub id_ext: Option<String>,
    pub name: String,
    pub pic: Option<String>,
    pub description: Option<String>,
    pub producer_id: i32,
    pub article: String,
    pub class_id: i32,
    pub group_id: i32,
    pub description_imp: Option<String>,
}

