pub use sea_orm_migration::prelude::*;

// mod m20220101_000001_create_table;
mod m20250315_000140_create_user_table;
mod m20250320_220842_create_orders_table;
mod m20250320_221008_create_pets_table;
mod m20250320_221032_create_pet_types_table;
mod m20250320_221051_create_pet_breeds_table;
mod m20250320_221249_create_goods_pets_table;
mod m20250320_221305_create_goods_table;
mod m20250320_221641_create_reports_table;
mod m20250320_221701_create_marking_table;
mod m20250320_221726_create_goods_orgs_table;
mod m20250320_221746_create_producers_table;
mod m20250320_221829_create_stocks_table;
mod m20250320_222010_create_organizations_table;
mod m20250320_222034_create_cliniks_table;
mod m20250321_012244_create_goods_classes_table;
mod m20250321_012331_create_goods_groups_table;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250315_000140_create_user_table::Migration),
            Box::new(m20250320_220842_create_orders_table::Migration),
            Box::new(m20250320_221008_create_pets_table::Migration),
            Box::new(m20250320_221032_create_pet_types_table::Migration),
            Box::new(m20250320_221051_create_pet_breeds_table::Migration),
            Box::new(m20250320_221249_create_goods_pets_table::Migration),
            Box::new(m20250320_221305_create_goods_table::Migration),
            Box::new(m20250320_221641_create_reports_table::Migration),
            Box::new(m20250320_221701_create_marking_table::Migration),
            Box::new(m20250320_221726_create_goods_orgs_table::Migration),
            Box::new(m20250320_221746_create_producers_table::Migration),
            Box::new(m20250320_221829_create_stocks_table::Migration),
            Box::new(m20250320_222010_create_organizations_table::Migration),
            Box::new(m20250320_222034_create_cliniks_table::Migration),
            Box::new(m20250321_012244_create_goods_classes_table::Migration),
            Box::new(m20250321_012331_create_goods_groups_table::Migration),
        ]
    }
}
