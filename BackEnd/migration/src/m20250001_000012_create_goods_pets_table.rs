use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250001_000003_create_pet_types_table::PetTypes;
use crate::m20250001_000010_create_goods_table::Goods;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(GoodsPets::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(GoodsPets::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                        )
                    .col(ColumnDef::new(GoodsPets::GoodsId).string().not_null().unique_key())
                    .col(ColumnDef::new(GoodsPets::PetTypesId).integer().not_null())
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_goods_pets_pet_types_id_pet_types")
                        .from(GoodsPets::Table, GoodsPets::PetTypesId)
                        .to(PetTypes::Table, PetTypes::Id)
                    )
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_goods_pets_goods_id_goods")
                        .from(GoodsPets::Table, GoodsPets::GoodsId)
                        .to(Goods::Table, Goods::IdExt)
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(GoodsPets::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum GoodsPets {
    Table,
    Id,
    GoodsId,
    PetTypesId,
}
