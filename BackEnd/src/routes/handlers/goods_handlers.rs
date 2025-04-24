use actix_web::{get, post, web, Responder, HttpResponse};
use serde::{Deserialize, Serialize};
use sea_orm::{
    ActiveModelTrait, 
    ActiveValue::Set, 
    EntityTrait, 
    QueryFilter, 
    ColumnTrait
};

use crate::utils::{api_response::ApiResponse, app_state::AppState};

#[derive(Serialize, Deserialize)]
struct GoodsModel{
    id_ext: Option<String>,
    name: String,
    pic: Option<String>,
    description: Option<String>,
    producer_id: i32,
    article: String,
    class_id: i32,
    group_id: i32,
    description_imp: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct Goods{
    name: String,
    pic: Option<String>,
    description: Option<String>,
    article: String,
    description_imp: Option<String>,
}

#[post("/create")]
pub async fn create(
    app_state: web::Data<AppState>,
    create_json: web::Json<GoodsModel>
) -> impl Responder {
    let goods = entity::goods::ActiveModel{
        id_ext: Set(create_json.id_ext.clone()),
        name: Set(Some(create_json.name.clone())),
        pic: Set(create_json.pic.clone()),
        description: Set(create_json.description.clone()),
        producer_id: Set(Some(create_json.producer_id)),
        article: Set(Some(create_json.article.clone())),
        class_id: Set(Some(create_json.class_id)),
        group_id: Set(Some(create_json.group_id)),
        description_imp: Set(create_json.description_imp.clone()),    
        ..Default::default()   
    };
    goods.insert(&app_state.db).await.unwrap();
    ApiResponse::new(200, "Товар загружен в базу данных".to_string())
}

#[get("/unload/{id}")]
pub async fn unload(
    app_state: web::Data<AppState>,
    id: web::Path<i32>) -> impl Responder{
    let goods = entity::goods::Entity::find()
        .filter(entity::goods::Column::Id.eq(*id))
        .one(&app_state.db)
        .await
        .unwrap();

    let goods_data = goods.unwrap();

    let gds =  Goods{
        name: goods_data.name.unwrap().to_string(),
        pic: Some(goods_data.pic.unwrap().to_string()),
        description: Some(goods_data.description.unwrap().to_string()),
        article: goods_data.article.unwrap().to_string(),
        description_imp: Some(goods_data.description_imp.unwrap().to_string())
    };

    // ApiResponse::new(200, "Товар загружен в базу данных".to_string());
    HttpResponse::Ok().json(gds)
}