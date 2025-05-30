use actix_web::{post, web::Json, Responder};

use crate::{
    utils::{api_response::ApiResponse, model::{OTPData, VerifyOTPData}},
    service::twilios::TwilioService,
};

#[post("/otp")]
pub async fn send_otp(new_data: Json<OTPData>) -> impl Responder {
    if let Some(phone) = &new_data.phone{
        let _otp_details = TwilioService::send_otp_phone(&phone.clone()).await;
        ApiResponse::new(200, "Succces".to_string());
    }

    if let Some(email) = &new_data.email{
        let _otp_details = TwilioService::send_otp_email(&email.clone()).await;
        ApiResponse::new(200, "Succces".to_string());
    }

    ApiResponse::new(200, "Succces".to_string())
}

#[post("/verifyOTP")]
pub async fn verify_otp(new_data: Json<VerifyOTPData>) -> impl Responder {
    if let Some(phone) = &new_data.phone{
        let _otp_details = TwilioService::verify_otp_phone(&phone.clone(), &new_data.code).await;
        ApiResponse::new(200, "Succces".to_string());
    }

    if let Some(email) = &new_data.email{
        let _otp_details = TwilioService::verify_otp_email(&email.clone(), &new_data.code).await;
        ApiResponse::new(200, "Succces".to_string());
    }

    ApiResponse::new(200, "Succces".to_string())
}
