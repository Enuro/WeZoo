use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(User::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(User::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key())
                    .col(ColumnDef::new(User::NameF).string().not_null())
                    .col(ColumnDef::new(User::NameM).string().not_null())
                    .col(ColumnDef::new(User::NameS).string().not_null())
                    .col(ColumnDef::new(User::Phone).string().not_null().unique_key())
                    .col(ColumnDef::new(User::Email).string().not_null().unique_key())
                    .col(ColumnDef::new(User::Password).string().not_null())
                    .col(ColumnDef::new(User::DataReg).string().not_null().date())
                    .col(ColumnDef::new(User::DataBirt).string().not_null().date())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(User::Table).to_owned())
            .await
    }
}


#[derive(DeriveIden)]
enum User {
    Table,
    Id,
    NameF,
    NameM,
    NameS,
    Phone,
    Email,
    Password,
    DataReg,
    DataBirt
}
