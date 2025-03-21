use sea_orm_migration::{prelude::*, schema::*};

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
                        )
                    .col(ColumnDef::new(GoodsGroup::ParentId).integer().not_null().unique_key())
                    .col(ColumnDef::new(GoodsGroup::Name).string().not_null())
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
enum GoodsGroup {
    Table,
    Id,
    ParentId,
    Name,
}
