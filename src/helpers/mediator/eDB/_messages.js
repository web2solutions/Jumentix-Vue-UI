"use strict"


let _messages = {
    collection :
    {
        undef_name : 'cant not create collection, undefined name',
        undef_table_name : 'cant not create collection, undefined table_name',
        undef_$db : 'cant not create collection, undefined $db',
        undef_configuration : 'cant not create collection, undefined configuration',
        undef_prop_type : 'cant not create collection, undefined type collection property',
        undef_prop_required : 'cant not create collection, undefined required collection property',
        add_record : 'record when writing data to store needs to be object or array',
        add_action: 'action when writing data to store needs to be a string',
        mandatory_recordId:  'recordId is mandatory when updating a record',
        query_bad: 'Invalid query format. Query need to be an object',
        query_range_invalid: 'Invalid key range',
        query_limit_invalid: 'Invalid limit on query'
    },
    db: {
        permission: "Please give permission to your app to run IndexedDB",
        started: 'Storage system is already started',
        undef_name: 'cant not start store, undefined name',
        undef_collections: 'cant not start store, undefined collections',
        undef_db: 'cant not start store, undefined db',
    }
}

export default _messages
