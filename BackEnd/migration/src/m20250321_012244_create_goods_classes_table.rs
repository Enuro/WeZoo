use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(GoodsClasses::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(GoodsClasses::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                        )
                    .col(ColumnDef::new(GoodsClasses::Name).string().not_null())
                    .col(ColumnDef::new(GoodsClasses::Description).text().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(GoodsClasses::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum GoodsClasses {
    Table,
    Id,
    Name,
    Description,
}
