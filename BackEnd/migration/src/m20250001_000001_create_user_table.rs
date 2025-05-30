use sea_orm_migration::{prelude::{extension::postgres::Type, *}};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_type(
                Type::create()
                    .as_enum(RoleEnum::Role)
                    .values([
                        RoleEnum::Client,
                        RoleEnum::Admin,
                        RoleEnum::ClinicOwner,
                    ])
                    .to_owned(),
            )
            .await?;

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
                    .col(ColumnDef::new(User::FirstName).string().not_null())
                    .col(ColumnDef::new(User::LastName).string().not_null())
                    .col(ColumnDef::new(User::Patronymic).string().not_null())
                    .col(ColumnDef::new(User::Phone).string().unique_key())
                    .col(ColumnDef::new(User::Email).string().unique_key())
                    .col(ColumnDef::new(User::Password).string())
                    .col(ColumnDef::new(User::DataReg).string())
                    .col(ColumnDef::new(User::DataBirt).string())
                    .col(ColumnDef::new(User::Role).custom(RoleEnum::Role).not_null())  
                    .col(ColumnDef::new(User::Verify).boolean().not_null())
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
    Role,
    Verify,
}
#[derive(DeriveIden)]
pub enum RoleEnum{
    Role,
    Client,
    Admin,
    ClinicOwner
}