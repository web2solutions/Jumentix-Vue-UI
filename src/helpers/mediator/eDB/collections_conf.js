let _collections_conf = {
  SocketMessage: {
      primary_key: {
          name: 'uuid',
          autoIncrement: false
      },
      props:{
          /*uuid:{
              indice:{
                  unique: true
              },
              type: 'string',
              required: true
          },*/
          from: {
              indice:{
                  compound: ["id", "name", "userId", "companyId"]
              },
              type: {},
              required: true
          },
          to: {
              indice:{
                  compound: ["id", "name", "userId", "companyId"]
              },
              type: {},
              required: true
          },
          companyId: {
              indice:{
                  unique: false
              },
              type: 'number',
              required: true
          },
          type: {
              indice:{
                  unique: false
              },
              type: 'string',
              required: true
          },
          sent: {
              indice:{
                  unique: false
              },
              type: 'number',
              required: true
          },
          ttl: {
              indice:{
                  unique: false
              },
              type: 'date',
              required: true
          },
          createdAt: {
              indice:{
                  unique: false
              },
              type: 'date',
              required: true
          },
          updatedAt: {
              indice:{
                  unique: false
              },
              type: 'date',
              required: true
          },
          channel: {
              indice:{
                  unique: false
              },
              type: 'string',
              required: true
          },
          read: {
              type: [],
              required: true
          },
          people: {
              type: [],
              required: true
          },
          subject: {
              indice:{
                  unique: false
              },
              type: 'string',
              required: true
          },
          message: {
              indice:{
                  unique: false
              },
              type: 'string',
              required: true
          },
          data: {
              type: {},
              required: false
          },
          items: {
              type: [],
              required: false
          },
          __v: {
              type: 'number',
              required: true
          }
      }
  },
  // other collection here
  SocketChannel: {
      primary_key: {
          name: 'uuid',
          autoIncrement: false
      },
      props:{
          /*uuid:{
              indice:{
                  unique: true
              },
              type: 'string',
              required: true
          },*/
          id: {
              indice:{
                  unique: true
              },
              type: 'string',
              required: true
          },
          _id: {
              indice:{
                  unique: true
              },
              type: 'string',
              required: true
          },
          name: {
              indice:{
                  unique: true
              },
              type: 'string',
              required: true
          },
          type: {
              indice:{
                  unique: false
              },
              type: 'string',
              required: true
          },
          owner: {
              indice:{
                  unique: false
              },
              type: 'string',
              required: true
          },
          people: {
              indice:{
                  compound: ["first_name"]
              },
              type: [],
              required: true
          },
          messages: {
              indice:{
                  compound: ["message"]
              },
              type: [],
              required: true
          },
          __v: {
              type: 'number',
              required: true
          }
      }
  }
}

export function setConf (conf) {
  _collections_conf = conf
}
export function getConf () {
  return _collections_conf
}




