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
import ObjectStore from './ObjectStore'

class Transaction
{
    constructor(idbTransaction)
    {
        this._tx = idbTransaction
        this.complete = new Promise(function(resolve, reject)
        {
            idbTransaction.oncomplete = function()
            {
                resolve()
            }
            idbTransaction.onerror = function()
            {
                reject(idbTransaction.error)
            }
            idbTransaction.onabort = function()
            {
                reject(idbTransaction.error)
            }
        })
    }
    objectStore(name)
    {
      
        return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments))
    }
}

proxyProperties(Transaction, '_tx', [
    'objectStoreNames',
    'mode'
]);

proxyMethods(Transaction, '_tx', IDBTransaction, [
    'abort'
]);

export default Transaction
