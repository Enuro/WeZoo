use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Marking::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Marking::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                        )
                    .col(ColumnDef::new(Marking::ReportId).integer().not_null().unique_key())
                    .col(ColumnDef::new(Marking::Mark).string().not_null())
                    .col(ColumnDef::new(Marking::GoodsId).integer().not_null().unique_key())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Marking::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Marking {
    Table,
    Id,
    ReportId,
    Mark,
    GoodsId,
}
