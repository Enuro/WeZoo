use sea_orm_migration::{prelude::*};

use crate::m20250001_000003_create_pet_types_table::PetTypes;
use crate::m20250001_000001_create_user_table::User;
use crate::m20250001_000007_create_pet_breeds_table::PetBreeds;

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
                            .primary_key()
                            .unique_key()
                        )
                    .col(ColumnDef::new(Pets::UserId).integer())
                    .col(ColumnDef::new(Pets::PetTypesId).integer())
                    .col(ColumnDef::new(Pets::PetBreedsId).integer())
                    .col(ColumnDef::new(Pets::DateBirth).date())
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_pets_client_id_clients")
                        .from(Pets::Table, Pets::UserId)
                        .to(User::Table, User::Id)
                    )
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_pet_types_id_pets")
                        .from(Pets::Table, Pets::PetTypesId)
                        .to(PetTypes::Table, PetTypes::Id)
                    )
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_pet_breeds_id_pets")
                        .from(Pets::Table, Pets::PetBreedsId)
                        .to(PetBreeds::Table, PetBreeds::Id)
                    )
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
pub enum Pets {
    Table,
    Id,
    UserId,
    PetTypesId,
    PetBreedsId,
    DateBirth,
}
