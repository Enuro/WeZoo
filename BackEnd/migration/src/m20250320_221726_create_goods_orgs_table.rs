use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(GoodsOrg::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(GoodsOrg::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                        )
                    .col(ColumnDef::new(GoodsOrg::GoodsId).integer().not_null().unique_key())
                    .col(ColumnDef::new(GoodsOrg::OrgId).integer().not_null().unique_key())
                    .col(ColumnDef::new(GoodsOrg::Article).string().not_null().unique_key())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(GoodsOrg::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum GoodsOrg {
    Table,
    Id,
    GoodsId,
    OrgId,
    Article,
}
