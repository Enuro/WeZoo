pub use sea_orm_migration::prelude::*;

mod m20250001_000001_create_user_table;
mod m20250001_000011_create_orders_table;
mod m20250001_000008_create_pets_table;
mod m20250001_000003_create_pet_types_table;
mod m20250001_000007_create_pet_breeds_table;
mod m20250001_000012_create_goods_pets_table;
mod m20250001_000010_create_goods_table;
mod m20250001_000013_create_reports_table;
mod m20250001_000014_create_marking_table;
mod m20250001_000015_create_goods_orgs_table;
mod m20250001_000009_create_producers_table;
mod m20250001_000016_create_stocks_table;
mod m20250001_000004_create_organizations_table;
mod m20250001_000006_create_cliniks_table;
mod m20250001_000002_create_goods_classes_table;
mod m20250001_000005_create_goods_groups_table;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250001_000001_create_user_table::Migration),
            Box::new(m20250001_000002_create_goods_classes_table::Migration),
            Box::new(m20250001_000003_create_pet_types_table::Migration),
            Box::new(m20250001_000004_create_organizations_table::Migration),
            Box::new(m20250001_000005_create_goods_groups_table::Migration),
            Box::new(m20250001_000006_create_cliniks_table::Migration),
            Box::new(m20250001_000007_create_pet_breeds_table::Migration),
            Box::new(m20250001_000008_create_pets_table::Migration),
            Box::new(m20250001_000009_create_producers_table::Migration),
            Box::new(m20250001_000010_create_goods_table::Migration),
            Box::new(m20250001_000011_create_orders_table::Migration),
            Box::new(m20250001_000012_create_goods_pets_table::Migration),
            Box::new(m20250001_000013_create_reports_table::Migration),
            Box::new(m20250001_000014_create_marking_table::Migration),
            Box::new(m20250001_000015_create_goods_orgs_table::Migration),
            Box::new(m20250001_000016_create_stocks_table::Migration),
        ]
    }
}
