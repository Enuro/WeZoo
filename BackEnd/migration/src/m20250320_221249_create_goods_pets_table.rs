use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(GoodsPets::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(GoodsPets::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                        )
                    .col(ColumnDef::new(GoodsPets::GoodsId).integer().not_null().unique_key())
                    .col(ColumnDef::new(GoodsPets::PetTypesId).integer().not_null().unique_key())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(GoodsPets::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum GoodsPets {
    Table,
    Id,
    GoodsId,
    PetTypesId,
}
