use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250001_000002_create_goods_classes_table::GoodsClasses;
use crate::m20250001_000009_create_producers_table::Producers;
use crate::m20250001_000005_create_goods_groups_table::GoodsGroup;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Goods::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Goods::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                            .unique_key()
                        )
                    .col(ColumnDef::new(Goods::IdExt).string().unique_key())
                    .col(ColumnDef::new(Goods::Name).string())
                    .col(ColumnDef::new(Goods::Pic).string())
                    .col(ColumnDef::new(Goods::Description).text())
                    .col(ColumnDef::new(Goods::ProducerId).integer())
                    .col(ColumnDef::new(Goods::Article).string())
                    .col(ColumnDef::new(Goods::ClassId).integer())
                    .col(ColumnDef::new(Goods::GroupId).integer())
                    .col(ColumnDef::new(Goods::Allergy).string())
                    .col(ColumnDef::new(Goods::DescriptionImp).string())
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_goods_producer_id_table_1")
                        .from(Goods::Table, Goods::ProducerId)
                        .to(Producers::Table, Producers::Id)
                    )
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_goods_class_id_goods_classes")
                        .from(Goods::Table, Goods::ClassId)
                        .to(GoodsClasses::Table, GoodsClasses::Id)
                    )
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_goods_group_id_table_3")
                        .from(Goods::Table, Goods::GroupId)
                        .to(GoodsGroup::Table, GoodsGroup::Id)
                    )
                    .to_owned(), 
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Goods::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Goods {
    Table,
    Id,
    IdExt,
    Name,
    Pic,
    Description,
    ProducerId,
    Article,
    ClassId,
    GroupId,
    Allergy,
    DescriptionImp,
}
