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
class Index
{
    constructor(index)
    {
        this._index = index
    }
}



proxyProperties(Index, '_index', [
    'name',
    'keyPath',
    'multiEntry',
    'unique'
]);

// class extend ?
proxyRequestMethods(Index, '_index', IDBIndex, [
    'get',
    'getKey',
    'getAll',
    'getAllKeys',
    'count'
]);

proxyCursorRequestMethods(Index, '_index', IDBIndex, [
    'openCursor',
    'openKeyCursor'
]);



// Add cursor iterators
// TODO: remove this once browsers do the right thing with promises
['openCursor', 'openKeyCursor'].forEach(function(funcName)
{
    [Index].forEach(function(Constructor)
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
[Index].forEach(function(Constructor)
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

export default Index
