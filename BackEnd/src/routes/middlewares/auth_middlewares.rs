use actix_web::{body::MessageBody, 
    dev::{ServiceRequest, ServiceResponse}, 
    http::header::AUTHORIZATION, 
    Error, 
    middleware::Next, 
    HttpMessage};
use jsonwebtoken::errors::ErrorKind;

use crate::utils::{api_response::ApiResponse, jwt::{Claims, decode_jwt}};

pub async fn check_auth_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody>
) -> Result<ServiceResponse<impl MessageBody>, Error>{
    let token = extract_bearer_token(&req)?;

    let claims = decode_and_validate_jwt(token)?;

    req.extensions_mut().insert(claims);

    next.call(req).await
    .map_err(|err| Error::from(ApiResponse::new(500, err.to_string())))
}

fn extract_bearer_token(req: &ServiceRequest) -> Result<String, Error> {
    req.headers()
        .get(AUTHORIZATION)
        .ok_or_else(|| Error::from(ApiResponse::new(401, "Missing authorization header".to_string())))?
        .to_str()
        .map_err(|_| Error::from(ApiResponse::new(401, "Invalid authorization header".to_string())))?
        .strip_prefix("Bearer ")
        .ok_or_else(|| Error::from(ApiResponse::new(401, "Invalid bearer token format".to_string())))
        .map(|s| s.to_string())
}

fn decode_and_validate_jwt(token: String) -> Result<Claims, Error> {
    decode_jwt(token)
        .map(|token_data| token_data.claims)
        .map_err(|e| match e.kind() {
            ErrorKind::ExpiredSignature => Error::from(ApiResponse::new(401, "Token expired".to_string())),
            _ => Error::from(ApiResponse::new(401, "Invalid token".to_string())),
        })
}