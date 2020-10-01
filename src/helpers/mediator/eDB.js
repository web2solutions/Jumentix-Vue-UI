"use strict"

import UpgradeDB from './eDB/UpgradeDB'
import DB from './eDB/DB'

import
{
    isDefined,
    copy,
    isArray,
    isObject,
    comparer,
    toArray,
    proxyProperties,
    proxyMethods,
    proxyRequestMethods,
    proxyCursorRequestMethods,
    promisifyRequest,
    promisifyRequestCall,
    promisifyCursorRequestCall
}
from './eDB/util'

class eDB
{
    constructor(db)
    {
        this._collections = {}
        this.models = {}
        this.$_collections = {}
        this.upgradeDB = null
    }
    open(name, version, upgradeCallback)
    {
        let self = this
        let p = promisifyRequestCall(indexedDB, 'open', [name, version]);
        let request = p.request;

        if (request)
        {
            request.onupgradeneeded = function(event)
            {
                self.UpgradeDB = new UpgradeDB(request.result, event.oldVersion, request.transaction)
                if (upgradeCallback)
                {
                    upgradeCallback(self.UpgradeDB)
                }
            }
        }

        return p.then(function(db)
        {
            return new DB(db);
        });
    }
    delete(name)
    {
        return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);
    }
}

export default eDB
