use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250001_000004_create_organizations_table::Organizations;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Cliniks::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Cliniks::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                            .unique_key()
                        )
                    .col(ColumnDef::new(Cliniks::Name).string())
                    .col(ColumnDef::new(Cliniks::Description).text())
                    .col(ColumnDef::new(Cliniks::Coords).string())
                    .col(ColumnDef::new(Cliniks::OrgId).integer())
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_cliniks_org_id_organization")
                        .from(Cliniks::Table, Cliniks::OrgId)
                        .to(Organizations::Table, Organizations::Id)
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Cliniks::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Cliniks {
    Table,
    Id,
    Name,
    Description,
    Coords,
    OrgId
}
