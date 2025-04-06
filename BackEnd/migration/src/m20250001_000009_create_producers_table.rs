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
                    .table(Producers::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Producers::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                            .unique_key()
                        )
                    .col(ColumnDef::new(Producers::Name).string())
                    .col(ColumnDef::new(Producers::Description).text())
                    .col(ColumnDef::new(Producers::OrgId).integer())
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_producers_org_id_organization")
                        .from(Producers::Table, Producers::OrgId)
                        .to(Organizations::Table, Organizations::Id)
                    )
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
pub enum Producers {
    Table,
    Id,
    Name,
    Description,
    OrgId,
}
