use sea_orm_migration::{prelude::*};

use crate::m20250001_000008_create_pets_table::Pets;
use crate::m20250001_000003_create_pet_types_table::PetTypes;

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
                            .primary_key()
                            .unique_key()
                        )
                    .col(ColumnDef::new(PetBreeds::Name).string())
                    .col(ColumnDef::new(PetBreeds::PetTypesId).integer())
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_pet_breeds_pet_types_id_pet_types")
                        .from(PetBreeds::Table, Pets::PetTypesId)
                        .to(PetTypes::Table, PetTypes::Id)
                    )
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
pub enum PetBreeds {
    Table,
    Id,
    Name,
    PetTypesId,
}
