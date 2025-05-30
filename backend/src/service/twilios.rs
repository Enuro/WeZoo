use reqwest::{header, Client};
use std::collections::HashMap;

use crate::utils::{
    constants, 
    model::{OTPResponse, OTPVerifyResponse}
};

pub struct TwilioService { }

impl TwilioService {

    pub async fn send_otp_phone(phone_number: &String) -> Result<OTPResponse, &'static str> {
        let account_sid = (*constants::ACCOUNT_SID.clone()).to_string();
        let auth_token = (*constants::AUTH_TOKEN.clone()).to_string();
        let service_id = (*constants::SERVICE_ID.clone()).to_string();

        let url = format!(
            "https://verify.twilio.com/v2/Services/{serv_id}/Verifications",
            serv_id = service_id
        );

        let mut headers = header::HeaderMap::new();
        headers.insert(
            "Content-Type",
            "application/x-www-form-urlencoded".parse().unwrap(),
        );

        let mut form_body: HashMap<&str, String> = HashMap::new();
        form_body.insert("To", phone_number.to_string());
        form_body.insert("Channel", "sms".to_string());

        let client = Client::new();
        let res = client
            .post(url)
            .basic_auth(account_sid, Some(auth_token))
            .headers(headers)
            .form(&form_body)
            .send()
            .await;

        match res {
            Ok(response) => {
                let result = response.json::<OTPResponse>().await;
                match result {
                    Ok(data) => Ok(data),
                    Err(_) => Err("Error sending OTP"),
                }
            }
            Err(_) => Err("Error sending OTP"),
        }
    }

    pub async fn send_otp_email(email: &String) -> Result<OTPResponse, &'static str> {
        let account_sid = (*constants::ACCOUNT_SID.clone()).to_string();
        let auth_token = (*constants::AUTH_TOKEN.clone()).to_string();
        let service_id = (*constants::SERVICE_ID.clone()).to_string();

        let url = format!(
            "https://verify.twilio.com/v2/Services/{serv_id}/Verifications",
            serv_id = service_id
        );

        let mut headers = header::HeaderMap::new();
        headers.insert(
            "Content-Type",
            "application/x-www-form-urlencoded".parse().unwrap(),
        );

        let mut form_body: HashMap<&str, String> = HashMap::new();
        form_body.insert("To", email.to_string());
        form_body.insert("Channel", "email".to_string());

        let client = Client::new();
        let res = client
            .post(url)
            .basic_auth(account_sid, Some(auth_token))
            .headers(headers)
            .form(&form_body)
            .send()
            .await;

        match res {
            Ok(response) => {
                let result = response.json::<OTPResponse>().await;
                match result {
                    Ok(data) => Ok(data),
                    Err(_) => Err("Error sending OTP"),
                }
            }
            Err(_) => Err("Error sending OTP"),
        }
    }

    pub async fn verify_otp_phone(phone_number: &String, code: &String) -> Result<(), &'static str> {
        let account_sid = (*constants::ACCOUNT_SID.clone()).to_string();
        let auth_token = (*constants::AUTH_TOKEN.clone()).to_string();
        let service_id = (*constants::SERVICE_ID.clone()).to_string();

        let url = format!(
            "https://verify.twilio.com/v2/Services/{serv_id}/VerificationCheck",
            serv_id = service_id,
        );

        let mut headers = header::HeaderMap::new();
        headers.insert(
            "Content-Type",
            "application/x-www-form-urlencoded".parse().unwrap(),
        );

        let mut form_body: HashMap<&str, &String> = HashMap::new();
        form_body.insert("To", phone_number);
        form_body.insert("Code", code);

        let client = Client::new();
        let res = client
            .post(url)
            .basic_auth(account_sid, Some(auth_token))
            .headers(headers)
            .form(&form_body)
            .send()
            .await;

        match res {
            Ok(response) => {
                let data = response.json::<OTPVerifyResponse>().await;
                match data {
                    Ok(result) => {
                        if result.status == "approved" {
                            Ok(())
                        } else {
                            Err("Error verifying OTP")
                        }
                    }
                    Err(_) => Err("Error verifying OTP"),
                }
            }
            Err(_) => Err("Error verifying OTP"),
        }
    }

    pub async fn verify_otp_email(email: &String, code: &String) -> Result<(), &'static str> {
        let account_sid = (*constants::ACCOUNT_SID.clone()).to_string();
        let auth_token = (*constants::AUTH_TOKEN.clone()).to_string();
        let service_id = (*constants::SERVICE_ID.clone()).to_string();

        let url = format!(
            "https://verify.twilio.com/v2/Services/{serv_id}/VerificationCheck",
            serv_id = service_id,
        );

        let mut headers = header::HeaderMap::new();
        headers.insert(
            "Content-Type",
            "application/x-www-form-urlencoded".parse().unwrap(),
        );

        let mut form_body: HashMap<&str, &String> = HashMap::new();
        form_body.insert("To", email);
        form_body.insert("Code", code);

        let client = Client::new();
        let res = client
            .post(url)
            .basic_auth(account_sid, Some(auth_token))
            .headers(headers)
            .form(&form_body)
            .send()
            .await;

        match res {
            Ok(response) => {
                let data = response.json::<OTPVerifyResponse>().await;
                match data {
                    Ok(result) => {
                        if result.status == "approved" {
                            Ok(())
                        } else {
                            Err("Error verifying OTP")
                        }
                    }
                    Err(_) => Err("Error verifying OTP"),
                }
            }
            Err(_) => Err("Error verifying OTP"),
        }
    }
}
