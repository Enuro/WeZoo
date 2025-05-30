use lazy_static::lazy_static;
use std::env;

lazy_static!{
    pub static ref ADDRESS: String = set_address();
    pub static ref DATABASE_URL: String = set_database_url();
    pub static ref SECRET: String = set_secret();
    pub static ref PORT: u16 = set_port();
    pub static ref SERVICE_ID: String = set_service_id();
    pub static ref ACCOUNT_SID: String = set_account_sid();
    pub static ref AUTH_TOKEN: String = set_auth_tonken();
}

fn set_address() -> String {
    dotenv::dotenv().ok();
    env::var("ADDRESS").unwrap()
}

fn set_port() -> u16 {
    dotenv::dotenv().ok();
    env::var("PORT").unwrap().parse::<u16>().unwrap()
}

fn set_database_url() -> String {
    dotenv::dotenv().ok();
    env::var("DATABASE_URL").unwrap()
}

fn set_secret() -> String {
    dotenv::dotenv().ok();
    env::var("SECRET").unwrap()
}

fn set_service_id() -> String {
    dotenv::dotenv().ok();
    env::var("SERVICE_ID").unwrap()
}

fn set_account_sid() -> String {
    dotenv::dotenv().ok();
    env::var("ACCOUNT_SID").unwrap()
}

fn set_auth_tonken() -> String {
    dotenv::dotenv().ok();
    env::var("AUTH_TOKEN").unwrap()
}