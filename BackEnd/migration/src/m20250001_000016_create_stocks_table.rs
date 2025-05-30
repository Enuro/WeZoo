use sea_orm_migration::{prelude::*};

use crate::m20250001_000010_create_goods_table::Goods;
use crate::m20250001_000006_create_cliniks_table::Cliniks;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Stocks::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Stocks::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                        )
                    .col(ColumnDef::new(Stocks::GoodsId).string().not_null().unique_key())
                    .col(ColumnDef::new(Stocks::ClinicId).integer().not_null())
                    .col(ColumnDef::new(Stocks::Quantity).integer().not_null())
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_cliniks_id_stocks")
                        .from(Stocks::Table, Stocks::ClinicId)
                        .to(Cliniks::Table, Cliniks::Id)
                    )
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_stocks_goods_id_goods")
                        .from(Stocks::Table, Stocks::GoodsId)
                        .to(Goods::Table, Goods::IdExt)
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Stocks::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Stocks {
    Table,
    Id,
    GoodsId,
    ClinicId,
    Quantity
}
