use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250001_000013_create_reports_table::Reports;
use crate::m20250001_000010_create_goods_table::Goods;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Marking::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Marking::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                        )
                    .col(ColumnDef::new(Marking::ReportId).integer().not_null().unique_key())
                    .col(ColumnDef::new(Marking::Mark).string().not_null())
                    .col(ColumnDef::new(Marking::GoodsId).string().not_null().unique_key())
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_marking_report_id_reports")
                        .from(Marking::Table, Marking::ReportId )
                        .to(Reports::Table, Reports::Id)
                    )
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_marking_goods_id_goods")
                        .from(Marking::Table, Marking::GoodsId)
                        .to(Goods::Table, Goods::IdExt)
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Marking::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Marking {
    Table,
    Id,
    ReportId,
    Mark,
    GoodsId,
}
