use sea_orm_migration::{prelude::*, schema::*};

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
                    .col(ColumnDef::new(Stocks::GoodsId).integer().not_null().unique_key())
                    .col(ColumnDef::new(Stocks::ClinicId).integer().not_null().unique_key())
                    .col(ColumnDef::new(Stocks::Quantity).integer().not_null())
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
enum Stocks {
    Table,
    Id,
    GoodsId,
    ClinicId,
    Quantity
}
