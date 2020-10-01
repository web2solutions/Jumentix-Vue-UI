"use strict"
import
{
    toArray,
    proxyProperties,
    proxyMethods,
    proxyRequestMethods,
    proxyCursorRequestMethods,
    promisifyRequest,
    promisifyRequestCall,
    promisifyCursorRequestCall
}
from './util'
import Transaction from './Transaction'

class DB
{
    constructor(db)
    {
        this._db = db;
    }
    transaction()
    {
        return new Transaction(this._db.transaction.apply(this._db, arguments));
    }
}



proxyProperties(DB, '_db', [
    'name',
    'version',
    'objectStoreNames'
]);

proxyMethods(DB, '_db', IDBDatabase, [
    'close'
]);


export default DB
