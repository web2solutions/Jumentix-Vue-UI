"use strict";

import {
  bulkGetCollections,
  getCollection,
  isDate
} from '../helpers'
import {
  copy,
  isDefined
}
from './util'
import {
  getConf,
  setConf
} from './eDB/collections_conf'

import CollectionMapper from './eDB/CollectionMapper'
import EventSystem from './EventSystem'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import _messages from './_messages'
import eDB from './eDB'
import store from '../store'

//import swal from 'sweetalert'


class Store extends EventSystem {
  constructor(c) {
    super()
    if (!isDefined(c.name)) {
      throw _message.db.undef_name
    }
    this.$db = null
    this.$db_started = false
    this.$db_name = c.name
    this.$_collections = {}
    this.models = {}
    this.swagger = c.swagger || false
    this.models_conf = copy(getConf())
    this.$db_version = 1
    this.triggerEvent('store:system:created', self)
  }

  isDataSaved() {
    let flag = global.localStorage.getItem(this.$db_name) || 0
    return parseInt(flag)
  }

  setDataSaved (dateWhen) {
    
    global.localStorage.setItem(this.$db_name, "1")
    global.localStorage.setItem(this.$db_name + '_last_sync', dateWhen)
  }

  getLastSyncDate () {
    let date = global.localStorage.getItem(this.$db_name + '_last_sync')
    let parsedDate = false
    try {
      parsedDate = new Date(date).toISOString()
    } catch (error) {
      
    }
    // console.log('getLastSyncDate')
    // console.log('parsedDate', parsedDate)
    return parsedDate
  }

  setDataNotSaved () {
    global.localStorage.setItem(this.$db_name, "0")
  }

   setDataAPI(db) {
    
     for (let name in this.models_conf) {
       if (this.models_conf.hasOwnProperty(name)) {
         //// console.log( name )
         this.models[name] = new CollectionMapper({
           name: name,
           db: db,
           configuration: this.models_conf[name]
         })
       }
     }
   }

  setSwaggerCollections () {
    
    for (let name in this.swagger) {
      if (this.swagger.hasOwnProperty(name)) {
        let definition = this.swagger[name]
        let schemasToRemove = []
        let idbIndice = {
          unique: false
        }
        this.models_conf[name] = {
          primary_key: {
            name: "_id",
            autoIncrement: false
          },
          props: {}
        }
        for (let propertyName in definition.properties) {
          if (definition.properties.hasOwnProperty(propertyName)) {
            if (propertyName === '_id') continue;
            let property = definition.properties[propertyName]
            let isRequired = false
            let idbType = 'string'
            if (definition.required) {
              if (definition.required.indexOf(propertyName) > -1) {
                isRequired = true
              }
            }
            if (property.type === 'array') {
              idbType = []
              if (property.items) {
                if (property.items.$ref) {
                  let entityName = property.items.$ref.split('definitions/')[1]
                  schemasToRemove.push(entityName)
                }
              }
            } else if (property.type === 'object') {
              idbType = {}
              if (property.$ref) {
                let entityName = property.$ref.split('definitions/')[1]
                idbIndice = {
                  compound: Object.keys(store.state.swagger.definitions[entityName].properties)
                }
                schemasToRemove.push(entityName)
              }
            }
            this.models_conf[name].props[propertyName] = {
              indice: idbIndice,
              required: isRequired,
              type: idbType,
            }
          }
        }
        this.models_conf[name].props['deleted'] = {
          indice: {
            unique: false
          },
          required: false,
          type: 'number',
        }
        schemasToRemove.forEach(name => delete this.models_conf[name])
      }
    }
  }

  async syncCollection (entityName) {
    
    let {
      error,
      data
    } = await getCollection(entityName, 1000)
    try {
      await this.models[entityName].put(data)
    } catch (e) {
      // console.log('error updating doc ', e)
    }
  }

  async syncCollections (collections, lastSyncDate = false) {
    // console.log('syncCollections', lastSyncDate)
    Swal.fire({
      title: `<strong>Syncing database</strong>`,
      type: 'warning',
      html: 'Please wait a few time while the remote and local database are synced',
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: 'Close',
    });
    let {
      error,
      data
    } = await bulkGetCollections(collections, lastSyncDate)
    if (error)
    {
      console.error('error syncing collections ', error)
    }
    else
    {
      // console.log(data);
      for (let entityName in data)
      {
        if (data.hasOwnProperty(entityName))
        {
          let records = data[entityName]
          try {
            await this.models[entityName].put(records)
          } catch (e) {
            console.error('error updating doc ', e)
          }
        }
      }
    }
    Swal.close()
    return {
      error,
      data
    };
  }

  async syncData () {
    let label = 'Time spent to sync collections: --> ';
    console.time(label)
    let objCollections = {}
    for (let entityName in this.models_conf) {
      if (this.models_conf.hasOwnProperty(entityName)) {
        if (entityName !== 'channels')
        {
          objCollections[entityName] = entityName
          // await this.syncCollection(entityName)
        }
      }
    }
    let dateWhen = new Date().toISOString()
    let lastSyncDate = this.getLastSyncDate();
    // console.log('syncData', lastSyncDate)
    let { data, error } = await this.syncCollections(objCollections, lastSyncDate)
    if (!error)
    {
      this.setDataSaved(dateWhen)
    }
    console.timeEnd(label)
  }

  
  start(c) {
    let self = this;
    if (!this.$db_started) {
      (async function () {
        self.setSwaggerCollections()
        setConf(self.models_conf)
        let dbFactory = new eDB({
          EventSystem: EventSystem,
        })
        let db = await dbFactory.open(self.$db_name, 1, UpgradeDB => {})
        self.$db = db
        self.setDataAPI(self.$db)
        // if (!self.isDataSaved()) {
        await self.syncData()
        // }
        self.triggerEvent('store:start', self)
      })()
    } else {
      self.triggerEvent('store:start', self)
    }
  }
}

export default Store
