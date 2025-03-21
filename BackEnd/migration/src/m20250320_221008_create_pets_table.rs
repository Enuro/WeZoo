use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Pets::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Pets::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key())
                    .col(ColumnDef::new(Pets::UserId).integer().not_null().unique_key())
                    .col(ColumnDef::new(Pets::PetTypeId).integer().not_null().unique_key())
                    .col(ColumnDef::new(Pets::PetBreedsId).integer().not_null().unique_key())
                    .col(ColumnDef::new(Pets::DateBirth).date().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Pets::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Pets {
    Table,
    Id,
    UserId,
    PetTypeId,
    PetBreedsId,
    DateBirth,
}
