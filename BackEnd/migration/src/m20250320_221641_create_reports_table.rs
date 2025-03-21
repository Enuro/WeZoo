use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
      manager
            .create_table(
                Table::create()
                    .table(Reports::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Reports::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                        )
                    .col(ColumnDef::new(Reports::OrderId).integer().not_null().unique_key())
                    .col(ColumnDef::new(Reports::Date).date().not_null())
                    .col(ColumnDef::new(Reports::Time).time().not_null())
                    .col(ColumnDef::new(Reports::Sum).decimal().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Reports::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Reports {
    Table,
    Id,
    OrderId,
    Date,
    Time,
    Sum,
}
