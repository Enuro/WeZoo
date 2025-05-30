use sea_orm_migration::{prelude::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(GoodsGroup::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(GoodsGroup::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                            .unique_key()
                        )
                    .col(ColumnDef::new(GoodsGroup::ParentId).integer())
                    .col(ColumnDef::new(GoodsGroup::Name).string())
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_goods_groups_parent_id_goods_groups")
                        .from(GoodsGroup::Table, GoodsGroup::ParentId)
                        .to(GoodsGroup::Table, GoodsGroup::Id)
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(GoodsGroup::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum GoodsGroup {
    Table,
    Id,
    ParentId,
    Name,
}
