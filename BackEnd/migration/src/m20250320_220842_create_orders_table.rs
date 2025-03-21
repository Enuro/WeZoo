use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Orders::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Orders::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key())
                    .col(ColumnDef::new(Orders::Data).date().not_null())
                    .col(ColumnDef::new(Orders::Time).time().not_null())
                    .col(ColumnDef::new(Orders::GoodId).integer().not_null().unique_key())
                    .col(ColumnDef::new(Orders::ClinikId).integer().not_null().unique_key())
                    .col(ColumnDef::new(Orders::Quantity).integer().not_null())
                    .col(ColumnDef::new(Orders::UserId).integer().not_null().unique_key())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Orders::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Orders {
    Table,
    Id,
    Data,
    Time,
    GoodId,
    ClinikId,
    Quantity,
    UserId,
}
