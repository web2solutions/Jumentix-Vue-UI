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
import Transaction from './Transaction'
import CollectionFactory from './CollectionFactory'
import { getConf } from './collections_conf'
import { copy } from './util'

class UpgradeDB
{
    constructor(db, oldVersion, transaction)
    {
        this._db = db;
        this.oldVersion = oldVersion;
        this.transaction = new Transaction(transaction);
        this.models_conf = copy( getConf() )
        this.$_collections = {}
        this.setup()
    }
    createObjectStore()
    {
        return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments))
    }
    setup()
    {
        let self = this
        for(let name in self.models_conf )
        {
            if( self.models_conf.hasOwnProperty(name) )
            {
                self.$_collections[ name ] = new CollectionFactory({
                    name: name,
                    db: self._db,
                    configuration: self.models_conf[ name ],
                    UpgradeDB: self
                })
            }
        }
        //this.createObjectStore('Eduardo', { autoIncrement: true })
    }
}

proxyProperties(UpgradeDB, '_db', [
    'name',
    'version',
    'objectStoreNames'
])

proxyMethods(UpgradeDB, '_db', IDBDatabase, [
    'deleteObjectStore',
    'close'
])

export default UpgradeDB
