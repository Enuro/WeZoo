use sea_orm_migration::{prelude::*, schema::*};

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
                        )
                    .col(ColumnDef::new(Goods::IdExt).string().not_null())
                    .col(ColumnDef::new(Goods::Name).string().not_null())
                    .col(ColumnDef::new(Goods::Pic).string().not_null())
                    .col(ColumnDef::new(Goods::Description).text().not_null())
                    .col(ColumnDef::new(Goods::ProducerId).integer().not_null().unique_key())
                    .col(ColumnDef::new(Goods::Article).string().not_null())
                    .col(ColumnDef::new(Goods::ClassId).integer().not_null().unique_key())
                    .col(ColumnDef::new(Goods::GroupId).integer().not_null().unique_key())
                    .col(ColumnDef::new(Goods::Allergy).string().not_null())
                    .col(ColumnDef::new(Goods::DescriptionImp).string().not_null())
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
enum Goods {
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
