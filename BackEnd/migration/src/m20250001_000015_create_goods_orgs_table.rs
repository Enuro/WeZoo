use sea_orm_migration::{prelude::*};

use crate::m20250001_000010_create_goods_table::Goods;
use crate::m20250001_000004_create_organizations_table::Organizations;


#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(GoodsOrgs::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(GoodsOrgs::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                        )
                    .col(ColumnDef::new(GoodsOrgs::GoodsId).string().not_null().unique_key())
                    .col(ColumnDef::new(GoodsOrgs::OrgId).integer().not_null())
                    .col(ColumnDef::new(GoodsOrgs::Article).string())
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_goods_orgs_org_id_organization")
                        .from(GoodsOrgs::Table, GoodsOrgs::OrgId)
                        .to(Organizations::Table, Organizations::Id)
                    )
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_goods_orgs_goods_id_goods")
                        .from(GoodsOrgs::Table, GoodsOrgs::GoodsId)
                        .to(Goods::Table, Goods::IdExt)
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(GoodsOrgs::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum GoodsOrgs {
    Table,
    Id,
    GoodsId,
    OrgId,
    Article,
}
