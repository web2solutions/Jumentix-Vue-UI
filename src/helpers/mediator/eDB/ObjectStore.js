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
import Index from './Index'


class ObjectStore
{
    constructor(store)
    {
        this._store = store
    }

    createIndex()
    {
        return new Index(this._store.createIndex.apply(this._store, arguments))
    }

    index()
    {
        return new Index(this._store.index.apply(this._store, arguments))
    }
}



proxyProperties(ObjectStore, '_store', [
    'name',
    'keyPath',
    'indexNames',
    'autoIncrement'
]);

proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'put',
    'add',
    'delete',
    'clear',
    'get',
    'getAll',
    'getKey',
    'getAllKeys',
    'count'
]);

proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'openCursor',
    'openKeyCursor'
]);

proxyMethods(ObjectStore, '_store', IDBObjectStore, [
    'deleteIndex'
]);


// Add cursor iterators
// TODO: remove this once browsers do the right thing with promises
['openCursor', 'openKeyCursor'].forEach(function(funcName)
{
    [Index, ObjectStore].forEach(function(Constructor)
    {
        // Don't create iterateKeyCursor if openKeyCursor doesn't exist.
        if (!(funcName in Constructor.prototype)) return;

        Constructor.prototype[funcName.replace('open', 'iterate')] = function()
        {
            let args = toArray(arguments);
            let callback = args[args.length - 1];
            let nativeObject = this._store || this._index;
            let request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));
            request.onsuccess = function()
            {
                callback(request.result);
            };
        };
    });
});

// polyfill getAll
[Index, ObjectStore].forEach(function(Constructor)
{
    if (Constructor.prototype.getAll) return;
    Constructor.prototype.getAll = function(query, count)
    {
        let instance = this;
        let items = [];

        return new Promise(function(resolve)
        {
            instance.iterateCursor(query, function(cursor)
            {
                if (!cursor)
                {
                    resolve(items);
                    return;
                }
                items.push(cursor.value);

                if (count !== undefined && items.length == count)
                {
                    resolve(items);
                    return;
                }
                cursor.continue();
            });
        });
    };
});

export default ObjectStore
