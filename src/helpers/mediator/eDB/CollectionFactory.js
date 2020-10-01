"use strict"
import EventSystem from './EventSystem'
import _messages from './_messages'
import
{
    isDefined,
    copy,
    isArray,
    isObject,
    comparer
}
from './util'

class CollectionFactory extends EventSystem
{
    constructor(c)
    {
        super()
        if (!isDefined(c.name))
        {
            throw _messages.db.undef_name
        }
        if (!isDefined(c.db))
        {
            throw _messages.db.undef_db
        }
        if (!isDefined(c.configuration))
        {
            throw _messages.db.undef_configuration
        }
        if (!isDefined(c.UpgradeDB))
        {
            throw _messages.db.undef_configuration
        }
        this.pk = c.configuration.primary_key
        this.properties = c.configuration.props
        this.name = c.name
        this.$db = c.$db
        this.indexes = {}
        this.UpgradeDB = c.UpgradeDB
        this.ObjectStore = null
        this.create()
    }
    isValidProp(prop)
    {
        if (typeof prop.type === 'undefined')
        {
            return _messages.collection.undef_prop_type
        }

        if (typeof prop.required === 'undefined')
        {
            return _messages.collection.undef_prop_required
        }

        return true
    }

    create()
    {
        let self = this
        //Promise( (resolve, reject) =>
        //{
            self.ObjectStore = self.UpgradeDB.createObjectStore(self.name,
            {
                autoIncrement : self.pk.autoIncrement,
                keyPath : self.pk.name
            })

            for (let propname in self.properties)
            {
                if (self.properties.hasOwnProperty(propname))
                {
                    let prop = self.properties[propname]

                    if (self.isValidProp(prop) !== true)
                    {
                        throw self.isValidProp(prop)
                    }

                    if (prop.indice)
                    {
                        let unique = prop.indice.unique || false
                        let compound = prop.indice.compound || false

                        if (compound)
                        {
                            self.indexes[propname] = self.ObjectStore.createIndex(propname, compound)
                        }
                        else
                        {
                            self.indexes[propname] = self.ObjectStore.createIndex(propname, propname,
                            {
                                unique : unique
                            })
                        }
                        //console.log( ind )
                    }
                }
            }

            return self
        //})
    }
}

export default CollectionFactory
