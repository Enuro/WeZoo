use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(PetTypes::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(PetTypes::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key())
                    .col(ColumnDef::new(PetTypes::Name).string().not_null().unique_key())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(PetTypes::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum PetTypes {
    Table,
    Id,
    Name,
}
