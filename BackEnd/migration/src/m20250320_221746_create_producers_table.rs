use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Producers::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Producers::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                        )
                    .col(ColumnDef::new(Producers::Name).string().not_null())
                    .col(ColumnDef::new(Producers::Description).text().not_null())
                    .col(ColumnDef::new(Producers::OrgId).integer().not_null().unique_key())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Producers::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Producers {
    Table,
    Id,
    Name,
    Description,
    OrgId,
}
