use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(PetBreeds::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(PetBreeds::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key())
                    .col(ColumnDef::new(PetBreeds::Name).string().not_null().unique_key())
                    .col(ColumnDef::new(PetBreeds::PetTypesId).integer().not_null().unique_key())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(PetBreeds::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum PetBreeds {
    Table,
    Id,
    Name,
    PetTypesId,
}
