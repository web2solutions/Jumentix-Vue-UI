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

class Cursor
{
    constructor(cursor, request)
    {
        this._cursor = cursor;
        this._request = request;
    }
}


proxyProperties(Cursor, '_cursor', [
    'direction',
    'key',
    'primaryKey',
    'value'
]);

proxyRequestMethods(Cursor, '_cursor', IDBCursor, [
    'update',
    'delete'
]);

// proxy 'next' methods
['advance', 'continue', 'continuePrimaryKey'].forEach(function(methodName)
{
    if (!(methodName in IDBCursor.prototype)) return;
    Cursor.prototype[methodName] = function()
    {
        let cursor = this;
        let args = arguments;
        return Promise.resolve().then(function()
        {
            cursor._cursor[methodName].apply(cursor._cursor, args);
            return promisifyRequest(cursor._request).then(function(value)
            {
                if (!value) return;
                return new Cursor(value, cursor._request);
            });
        });
    };
});


export default Cursor
