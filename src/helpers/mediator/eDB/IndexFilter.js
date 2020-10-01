"use strict"

import
{
    isDefined,
    copy,
    isArray,
    isObject,
    comparer
}
from './util'


/*

new IndexFilter({
    name: indexName,
    value: '',
    db: self.db,
    transaction: self.transaction,
    table: self.table
})


*/

class IndexFilter
{
    constructor(c)
    {
        console.log('IndexFilter')
        let self = this
        self.name = c.name
        self.db = c.db
        self.value = c.value
        self.transaction = c.transaction
        self.table = c.table
        self.results = []
        self.cursor = null

        self.request = null
        console.log(self.index)
    }
    filter()
    {
        let self = this
        return new Promise(async function(resolve, reject)
        {
            console.log('filter')
            self.index = await self.table.index( self.name )
            console.log(self.index.openCursor)

            self.request = await self.index.openCursor()

            self.request.onsuccess = new Promise(function(resolve, reject) {
                console.log(self.request)
                console.log(self.request.result)
                self.cursor = self.request.result
                if (self.cursor)
                {
                    console.log(self.cursor)
                    self.results.push(self.cursor.value)
                    // cursor.value contains the current record being iterated through
                    // this is where you'd do something with the result
                    self.cursor.continue();
                }
                else
                {
                    // no more results
                    resolve(self.results)
                }

            });

/*
            self.request.onsuccess = (event) =>
            {
                console.log(event.target)
                console.log(self.request.result)
                self.cursor = event.target.result
                if (self.cursor)
                {
                    console.log(self.cursor)
                    self.results.push(self.cursor.value)
                    // cursor.value contains the current record being iterated through
                    // this is where you'd do something with the result
                    self.cursor.continue();
                }
                else
                {
                    // no more results
                    resolve(self.results)
                }
            }


*/


            //await self.complete

            //console.log(self.request)

            /*self.request.onerror = event =>
            {
                console.info('error', event.srcElement.error)
                reject(event.srcElement.error)
            }
            self.request.onabort = event =>
            {
                console.info('error', event.srcElement.error)
                reject(event.srcElement.error)
            }*/
        })
    }
}

export default IndexFilter
