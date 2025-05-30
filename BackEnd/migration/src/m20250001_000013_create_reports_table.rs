use sea_orm_migration::{prelude::*};

use crate::m20250001_000011_create_orders_table::Orders;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
      manager
            .create_table(
                Table::create()
                    .table(Reports::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Reports::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key()
                            .unique_key()
                        )
                    .col(ColumnDef::new(Reports::OrderId).integer())
                    .col(ColumnDef::new(Reports::Date).date())
                    .col(ColumnDef::new(Reports::Time).time())
                    .col(ColumnDef::new(Reports::Sum).decimal())
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk_reports_order_id_orders")
                        .from(Reports::Table, Reports::OrderId)
                        .to(Orders::Table, Orders::Id)
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Reports::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Reports {
    Table,
    Id,
    OrderId,
    Date,
    Time,
    Sum,
}
