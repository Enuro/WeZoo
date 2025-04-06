use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250001_000006_create_cliniks_table::Cliniks;
use crate::m20250001_000001_create_user_table::User;
use crate::m20250001_000010_create_goods_table::Goods;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Orders::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Orders::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                            .unique_key()
                        )
                    .col(ColumnDef::new(Orders::Data).date())
                    .col(ColumnDef::new(Orders::Time).time())
                    .col(ColumnDef::new(Orders::GoodsId).string().not_null().unique_key())
                    .col(ColumnDef::new(Orders::ClinicId).integer())
                    .col(ColumnDef::new(Orders::Quantity).integer())
                    .col(ColumnDef::new(Orders::UserId).integer())
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_clients_id_orders")
                        .from(Orders::Table, Orders::UserId)
                        .to(User::Table, User::Id)
                    )
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_orders_clinik_id_cliniks")
                        .from(Orders::Table, Orders::ClinicId)
                        .to(Cliniks::Table, Cliniks::Id)
                    )
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_orders_good_id_goods")
                        .from(Orders::Table, Orders::GoodsId)
                        .to(Goods::Table, Goods::IdExt)
                    )
                    .to_owned(),
            ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Orders::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Orders {
    Table,
    Id,
    Data,
    Time,
    GoodsId,
    ClinicId,
    Quantity,
    UserId,
}
