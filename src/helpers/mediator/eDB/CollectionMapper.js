"use strict"
//import "@babel/polyfill"
import EventSystem from './EventSystem'
//import DataView from './DataView'
import _messages from './_messages'
import
{
    isDefined,
    copy,
    isArray,
    isObject,
    comparer,
    isMatched
}
from './util'


class CollectionMapper extends EventSystem
{
    constructor(c)
    {
        if (!isDefined(c.name))
        {
            throw _message.db.undef_name
        }
        if (!isDefined(c.db))
        {
            throw _message.db.undef_db
        }
        if (!isDefined(c.configuration))
        {
            throw _message.db.undef_configuration
        }

        super()

        this.primary_key = c.configuration.primary_key
        this.properties = c.configuration.props
        this.name = c.name
        this.db = c.db

        this.start()
    }

    start()
    {
        this.triggerEvent('collection:ready', this)
    }

    add(record)
    {
        let self = this
        return new Promise(async function(resolve, reject)
        {
            let timer_label = "add() on IndexedDB. id: " + (new Date()).getTime()
            console.time(timer_label)
            let tx = self.db.transaction(self.name, 'readwrite'),
                store = tx.objectStore(self.name),
                saved = [],
                document,
                r;

            try
            {
                if (isArray(record))
                {
                    for (let x = 0; x < record.length; x++)
                    {
                        r = record[x]
                        document = await store.add(r)
                        await tx.complete
                        saved.push(document)
                    }
                    console.timeEnd(timer_label)
                }
                else if (isObject(record))
                {
                    document = await store.add(record)
                    await tx.complete
                    saved.push(document)
                    console.timeEnd(timer_label)
                }
                else
                {
                    reject(Error('Invalid record format, must be object or array'))
                    console.timeEnd(timer_label)
                    return
                }

                resolve(saved)
            }
            catch (e)
            {
                console.timeEnd(timer_label)
                reject(e)
            }
        })
    }

    put(record, recordId)
    {
        let self = this
        return new Promise(async function(resolve, reject)
        {
            let timer_label = "put() on IndexedDB. id: " + (new Date()).getTime()
            //console.time(timer_label)
            let tx = self.db.transaction(self.name, 'readwrite'),
                store = tx.objectStore(self.name),
                saved = [],
                document,
                r;

            try
            {
                if (isArray(record))
                {
                    for (let x = 0; x < record.length; x++)
                    {
                        r = record[x]
                        document = await store.put(r)
                    }
                    saved = record
                    await tx.complete
                    //console.timeEnd(timer_label)
                }
                else if (isObject(record))
                {
                    document = await store.put(record)
                    await tx.complete
                    saved.push(document)
                    //console.timeEnd(timer_label)
                }
                else
                {
                    reject(Error('Invalid record format, must be object or array'))
                    //console.timeEnd(timer_label)
                    return
                }

                resolve(saved)
            }
            catch (e)
            {
                console.timeEnd(timer_label)
                reject(Error(e))
            }
        })
    }


    delete(primary_key_value)
    {
        let self = this
        return new Promise(async function(resolve, reject)
        {
            let timer_label = "delete() " + self.name + " on IndexedDB. id: " + (new Date()).getTime()
            console.time(timer_label)
            let tx = self.db.transaction(self.name, 'readwrite')
            let store = tx.objectStore(self.name)
            let all = await store.delete(primary_key_value)
            await tx.complete
            console.timeEnd(timer_label)
            resolve(all)
        })
    }

    search(logical_operator = 'or', query = false)
    {
        let self = this
        query = isObject(query) ? query : {}
        return new Promise(async function(resolve, reject)
        {
            let found = []
            let shouldMatch = logical_operator === 'or' ? 1 : Object.keys(query).length
            let timer_label = "search() " + self.name + " on IndexedDB. id: " + (new Date()).getTime()
            console.time(timer_label)
            let tx = self.db.transaction(self.name, 'readwrite')
            let store = tx.objectStore(self.name)
            let cursor = await store.openCursor();
            
            while (cursor) {
              // console.log(cursor.key, cursor.value);
              cursor = await cursor.continue();
            }
            await tx.complete
            console.timeEnd(timer_label)
            resolve(found)
        })
    }


    equalsAnyOf(indexName, keysToFind, onfound, onfinish)
    {
        let /*self = this,*/
            tx = this.db.transaction([this.name], "readonly"),
            store = tx.objectStore(this.name),
            index = store.index(indexName),
            set = keysToFind.sort(comparer),
            i = 0,
            cursorReq = index.openCursor();

        cursorReq.onsuccess = function(event)
        {
            let key,
                cursor = event.target.result;

            if (!cursor)
            {
                return onfinish()
            }

            key = cursor.key

            while (key > set[i])
            {
                // The cursor has passed beyond this key. Check next.
                ++i

                if (i === set.length)
                {
                    // There is no next. Stop searching.
                    onfinish()
                    return
                }
            }

            if (key === set[i])
            {
                // The current cursor value should be included and we should continue
                // a single step in case next item has the same key or possibly our
                // next key in set.
                onfound(cursor.value)
                cursor.continue()
            }
            else
            {
                // cursor.key not yet at set[i]. Forward cursor to the next key to hunt for.
                cursor.continue(set[i])
            }
        }
    }

    get(primary_key_value)
    {
        let self = this
        return new Promise(async function(resolve, reject)
        {
            let timer_label = "get() " + self.name + " on IndexedDB. id: " + (new Date()).getTime()
            console.time(timer_label)
            let tx = self.db.transaction(self.name, 'readonly')
            let store = tx.objectStore(self.name)
            let all = await store.get(primary_key_value)
            await tx.complete
            console.timeEnd(timer_label)
            resolve(all)
        })
    }

    getAll(query = false)
    {
        let self = this
        return new Promise(async function(resolve, reject)
        {
            let timer_label = "getAll() on IndexedDB. id: " + (new Date()).getTime()
            //console.time(timer_label)
            let tx = self.db.transaction(self.name, 'readonly')
            let store = tx.objectStore(self.name)
            let all = []
            if (query)
            {
                if (!isObject(query))
                {
                    throw _message.collection.query_bad
                }
                if (isDefined(query.start) && !isDefined(query.end))
                {
                    throw _message.collection.query_range_invalid
                }
                if (!isDefined(query.start) && isDefined(query.end))
                {
                    throw _message.collection.query_range_invalid
                }
                if (isDefined(query.limit))
                {
                    if (!isNumber(query.limit))
                    {
                        throw _message.collection.query_limit_invalid
                    }
                }
                // validated

                if (isDefined(query.start) && isDefined(query.end) && isDefined(query.limit))
                {
                    all = await store.getAll(IDBKeyRange(query.start, query.end), query.limit)
                }
                else if ((!isDefined(query.start) || !isDefined(query.end)) && isDefined(query.limit))
                {
                    all = await store.getAll(null, query.limit)
                }
                else if (isDefined(query.start) && isDefined(query.end) && (!isDefined(query.limit)))
                {
                    all = await store.getAll(IDBKeyRange(query.start, query.end))
                }
            }
            else
            {
                all = await store.getAll()
            }
            await tx.complete
            // console.timeEnd(timer_label)
            resolve(all)
        })
    }

    findOneByIndex(indexName, query, callback)
    {
        let self = this
        return new Promise(async function(resolve, reject)
        {
            console.log('findOneByIndex')
            let timer_label = "findOneByIndex on IndexedDB. id: " + (new Date()).getTime()
            console.time(timer_label)
            let tx = self.db.transaction(self.name, "readonly")
            let store = tx.objectStore(self.name)
            let index = store.index(indexName)
            let get;
            try
            {
                get = await index.get(query)
                await tx.complete
                resolve(get)
            }
            catch (e)
            {
                resolve(Error(e))
            }
            finally
            {
                console.timeEnd(timer_label)
            }
        })
    }

    findAllByIndexValue(indexName, query)
    {
        let self = this
        return new Promise(async function(resolve, reject)
        {
            // console.log('findAllByIndex')
            let timer_label = "findAllByIndex on IndexedDB. id: " + (new Date()).getTime()
            console.time(timer_label)
            let tx = self.db.transaction(self.name, "readonly")
            let store = tx.objectStore(self.name)
            let index = store.index(indexName)
            let found = []
            let foundKey = []

            index.iterateCursor( IDBKeyRange.only( query ), cursor =>
            {
                if (!cursor)
                {
                    console.timeEnd(timer_label)
                    resolve(found)
                    return;
                }
                found.push(cursor.value)
                cursor.continue()
            })
        })
    }

    where(c)
    {
        //let self = this
        return new Promise(async function(resolve, reject)
        {
            /*let dataview = new DataView(
            {
                name : self.name,
                db : self.db,
                where : c
            })

            await dataview.start()*/

            resolve( /*dataview*/ )
        })

    }

    /*

    getByPk(pkId, callback)
    {
        let self = this
        let tx = this.db.transaction([self.name])
        let store = tx.objectStore(self.name)
        let timer_label = "record got on IndexedDB. time: "

        console.time(timer_label)

        tx.oncomplete = event =>
        {
            //console.log(event)
            if (callback) callback(null, record)
            this.triggerEvent('collection:add',
            {
                record : record,
                collection : self
            })
            try
            {
                console.timeEnd(timer_label)
            }
            catch (e)
            {}
        }
        tx.onerror = event =>
        {
            if (callback) callback(event.target.error, null)
            try
            {
                console.timeEnd(timer_label)
            }
            catch (e)
            {}
            console.info('error name: ', event.srcElement.error.name)
            console.error('sorry Eduardo, couldnt add record. error message: ' + event.srcElement.error.message)
            //console.log.timeEnd(timer_label)
        }
        tx.onabort = event =>
        {
            if (callback) callback(event.target.error, record)
            try
            {
                console.timeEnd(timer_label)
            }
            catch (e)
            {}
            console.log(event.target.error.name, null)

        }

        store.get(pkId)
    }

    getByIndex(indexName, query, callback)
    {
        let self = this
        let tx = this.db.transaction(this.name, "readwrite")
        let store = tx.objectStore(this.name)
        let index = store.index(indexName)
        let get = index.get(query)

        get.onsuccess = event =>
        {
            console.log('get.onsuccess')
            console.log(event)
            if (callback) callback(null, record)
            try
            {
                console.timeEnd(timer_label)
            }
            catch (e)
            {}
        }

        get.onerror = event =>
        {
            if (callback) callback(event.target.error, null)
            try
            {
                console.timeEnd(timer_label)
            }
            catch (e)
            {}
            console.info('error name: ', event.srcElement.error.name)
            console.error('sorry Eduardo, couldnt add record. error message: ' + event.srcElement.error.message)
            //console.log.timeEnd(timer_label)
        }
        get.onabort = event =>
        {
            if (callback) callback(event.target.error, record)
            try
            {
                console.timeEnd(timer_label)
            }
            catch (e)
            {}
            console.log(event.target.error.name, null)

        }

        index.openCursor().onsuccess = function(event)
        {
            let cursor = event.target.result
            if (cursor)
            {
                // cursor.value.local_id
                cursor.continue()
            }
            else
            {
                console.log('Entries all read.')
            }
        }
    }*/
}


export default CollectionMapper
