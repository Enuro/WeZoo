use sea_orm::{ConnectionTrait, DatabaseConnection};

pub struct AppState {
    pub db: DatabaseConnection
}

impl ConnectionTrait for AppState{
    fn execute<'life0,'async_trait>(&'life0 self,stmt:sea_orm::Statement) 
    ->  ::core::pin::Pin<Box<dyn ::core::future::Future<Output = Result<sea_orm::ExecResult,sea_orm::DbErr> > + ::core::marker::Send+'async_trait> >
    where 'life0:'async_trait,Self:'async_trait {
        todo!()
    }
    fn get_database_backend(&self) -> sea_orm::DbBackend {
        todo!()
    }
    fn execute_unprepared<'life0,'life1,'async_trait>(&'life0 self,sql: &'life1 str) ->  
    ::core::pin::Pin<Box<dyn ::core::future::Future<Output = Result<sea_orm::ExecResult,sea_orm::DbErr> > + ::core::marker::Send+'async_trait> >
    where 'life0:'async_trait,'life1:'async_trait,Self:'async_trait {
        todo!()
    }
    fn is_mock_connection(&self) -> bool {
        todo!()
    }
    fn query_all<'life0,'async_trait>(&'life0 self,stmt:sea_orm::Statement) 
    ->  ::core::pin::Pin<Box<dyn ::core::future::Future<Output = Result<Vec<sea_orm::QueryResult> ,
    sea_orm::DbErr> > + ::core::marker::Send+'async_trait> >where 'life0:'async_trait,Self:'async_trait {
        todo!()
    }
    fn query_one<'life0,'async_trait>(&'life0 self,stmt:sea_orm::Statement) 
    ->  ::core::pin::Pin<Box<dyn ::core::future::Future<Output = Result<Option<sea_orm::QueryResult> ,
    sea_orm::DbErr> > + ::core::marker::Send+'async_trait> >where 'life0:'async_trait,Self:'async_trait {
        todo!()
    }
    fn support_returning(&self) -> bool {
        todo!()
    }
}