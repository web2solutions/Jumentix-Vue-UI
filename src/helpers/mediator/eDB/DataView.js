"use strict"

import IndexFilter from './IndexFilter'
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

new DataView({
    name: 'SocketMessage',
    db: null,
    where: {
        sent: true
    }
})

*/

class DataView
{
    constructor(c)
    {
        console.log('DataView')
        let self = this
        self.name = c.name
        self.db = c.db
        self.where = c.where


    }

    start()
    {
        let self = this
        return new Promise(async function(resolve, reject)
        {
            self.transaction = await self.db.transaction( self.name, "readonly" )
            self.table = self.transaction.objectStore( self.name )

            self.IndexFilters = {}

            // catch all filter errors one we are going to share the transaction
            self.transaction.onsuccess = event =>
            {
                console.info('onsuccess', event)
            }
            self.transaction.onerror = event =>
            {
                console.info('error', event.srcElement.error)
            }
            for(let indexName in self.where)
            {
                console.log(indexName, self.where[ indexName ])
                self.IndexFilters[ indexName ] = new IndexFilter({
                    name: indexName,
                    value: self.where[ indexName ],
                    db: self.db,
                    transaction: self.transaction,
                    table: self.table
                })
            }
            for(let indexName in self.where)
            {
                let records = await self.IndexFilters[ indexName ].filter()
                console.log(records)
            }
            resolve(self)
        })
    }
}



export default DataView
