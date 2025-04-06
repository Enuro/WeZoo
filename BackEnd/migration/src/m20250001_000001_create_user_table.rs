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
                            .primary_key()
                            .unique_key()
                        )
                    .col(ColumnDef::new(User::FirstName).string())
                    .col(ColumnDef::new(User::LastName).string())
                    .col(ColumnDef::new(User::Patronymic).string())
                    .col(ColumnDef::new(User::Phone).string().unique_key())
                    .col(ColumnDef::new(User::Email).string().unique_key())
                    .col(ColumnDef::new(User::Password).string())
                    .col(ColumnDef::new(User::DataReg).string())
                    .col(ColumnDef::new(User::DataBirt).string())
                    .col(ColumnDef::new(User::Role).string())
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
pub enum User {
    Table,
    Id,
    FirstName,
    LastName,
    Patronymic,
    Phone,
    Email,
    Password,
    DataReg,
    DataBirt,
    Role
}
