'use strict';

import {
  copy,
  getPersonalRoomName,
  sanitizeString
}
from './util'

import Composer from './Composer'
import EventSystem from './EventSystem'
import Store from './Store'
import hideCollections from './hideCollections'
import io from 'socket.io-client'
import moment from 'moment-timezone'
import swal from 'sweetalert2'

//import config from '../../config'
//const env = process.env.NODE_ENV || "development"

//moment.tz.setDefault(config[env].timezone)

class MessageMediatorClient extends EventSystem {
  constructor(c) {
    // console.log(c)
    super()
    this.$c = c
    this.me = false
    this.name = false
    this.user_id = false
    this.agency_id = false
    this.started = false
    this.store = false
    this.socket = false
    this.joinedChannels = {}
    this.envelop = new Composer()
    this.notification_permission = false
    this.worker_registration = false
    this.swagger = false
    this.collectionDefinitions = {}
    if (c.swagger) {
      try {
        this.swagger = JSON.parse(JSON.stringify(c.swagger))
      } catch (err) {
        this.swagger = false
      }
      if (this.swagger) this.setSystemEntities()
    }
  }

  isCollectionName(entityName) {
    let isName = true
    hideCollections.collections.forEach( keyword => {
      if (entityName === keyword) {
        isName = false
      }
    })
    hideCollections.schemas.forEach( keyword => {
      if (entityName === keyword) {
        isName = false
      }
    })
    hideCollections.prefix_sufix.forEach( keyword => {
      if (entityName.indexOf(keyword) > -1) {
        isName = false
      }
    })
    return isName
  }

  getSwaggerEntities() {
    let allEntities = Object.keys(this.swagger.definitions)
    let systemEntities = allEntities.filter(entityName => {
      let set = false;
      set = this.isCollectionName(entityName)
      if (set)
      {
        if (! this.swagger.definitions[entityName].properties['_id'])
        {
          // console.log(entityName, this.swagger.definitions[entityName].properties)
          set = false;
        }
      }
      return set
    })
    return systemEntities
  }

  setSystemEntities() {
    let systemEntities = this.getSwaggerEntities()
    systemEntities.forEach( name => {
      this.collectionDefinitions[name] = this.swagger.definitions[name]
    })
    // console.log(this.collectionDefinitions)
  }
  connect() {
    let self = this
    const c = this.$c,
      name = c.name,
      user_id = c.user_id,
      agency_id = c.agency_id;
    
    let host = c.host ? c.host : (window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'http://a243.test.myadoptionportal.com/');
    
    if (window.location.hostname.indexOf('-prod') > -1) {
      host = 'https://a243-prod.myadoptionportal.com/'
    }

    if (window.location.hostname.indexOf('map-ui-test') > -1) {
      host = 'https://map-api-test.myadoptionportal.com/'
    }

    if (self.socket) {
      self.socket.destroy()
      delete self.socket
      self.socket = null
    }

    self.socket = io.connect(host, {
      secure: false,
      query: "name=" + name + "&user_id=" + user_id + "&agency_id=" + agency_id,
      //forceNew : true,
      ///reconnection : true,
      //reconnectionDelay : 1000,
      //reconnectionDelayMax : 5000,
      //reconnectionAttempts : Infinity,
      reconnection: false,
      transports: ['websocket', 'polling']
    })

    self.triggerEvent('mediator:connect', {
      mediator: self
    })
  }

  start() {
    let self = this,
      c = self.$c;

    const name = c.name || false,
      user_id = c.user_id || false,
      agency_id = c.agency_id || false;

    if (!name) {
      self.displayError("Can not start", "Invalid name")
      return
    }
    if (!user_id) {
      self.displayError("Can not start", "Invalid user_id")
      return
    }
    if (!agency_id) {
      self.displayError("Can not start", "Invalid agency_id")
      return
    }

    self.name = name
    self.user_id = user_id
    self.agency_id = ""+agency_id+""
    self.commands = {}

    self.me = {
      name: self.name,
      user_id: self.user_id,
      agency_id: ""+self.agency_id,
      channel: getPersonalRoomName(user_id, agency_id)
    }
    // console.log('XXCCCXXXCCCCC', "indexedDB" in window)
    if ("indexedDB" in window) {
      self.store = new Store({
        name: 'DB-Mediator-' + self.agency_id + '-' + self.user_id,
        swagger: self.collectionDefinitions
      })

      self.store.on('store:start', eventObj => {
        self.connect()
        self.setupSocket()
      })

      self.store.on('store:error', eventObj => {
        // handle error
        self.displayError("Local database", "Local database error ....", true)
      })
    }

    self.on('socket:connected', eventObj => {
      if (!self.started) {
        
        self.triggerEvent('mediator:start', {
          mediator: self
        })
        self.started = true
      }
      self.displaySuccess("Server communication", "Mediator client is started")
    })

    // stack starts here
    //self.askNotificationPermission((err, permission) =>
    //{
    //alert('passed permission')
    if (self.store) {
      self.store.start()
    } else {
      self.connect()
      self.setupSocket()
    }
    //})
  }

  setupSocket(callback) {
    let self = this
    self.socket.on('dong', () => {
      console.warn('dong')
      self.latency = Date.now() - self.startPingTime
      let data = 'Ping: ' + self.latency + 'ms'
      console.warn(self.latency)
      self.triggerEvent('mediator:pong', {
        mediator: self,
        data: self.latency,
        message: data
      })
    })
    self.setupSendAPI()
    self.setupClient()
    /*self.socket.on('connect_failed', () => {
        self.socket.close()
        self.triggerEvent('mediator:close', {
            mediator: self
        })
    })*/

    self.socket.on('connect', async () => {
      
      console.warn('=====>>>> CONNECTED as ' + self.name + ' ' + self.socket.id)
      self.isConnected = true
      try {
        swal.close()
        self.displaySuccess("Server connection", "Connected as " + self.name + " ....")
      } catch (e) {

      }
      if (self.interval) clearInterval(self.interval)
      self.me.id = self.socket.id
      /*self.socket.emit('authentication', { user_id: 2751, token: "abc" })
      self.socket.on('authenticated', function() {

      })*/
      if (self.store) {
        console.warn('Trying to delivery not sent messages')
        let notSentMessages = await self.store.models.SocketMessage.findAllByIndexValue('sent', 0)
        console.warn(notSentMessages)
        notSentMessages.forEach(message => {
          if (message.type === "talk:private:send") {
            self.socket.emit(message.type, envelop)
            self.triggerEvent(eventname, envelop)
          }
        })
      }
      self.triggerEvent('socket:connected', {
        mediator: self
      })
    })

    self.socket.on('disconnect', (data) => {
      console.warn('=====>>>> DISCONNECT ')
      self.displayError("Server connection", "Server connection for " + self.name + " is now offline ....", true)
      
      self.socket.close()
      self.isConnected = false

      self.triggerEvent('mediator:disconnect', {
        mediator: self
      })

      self.interval = window.setInterval(() => {
        // swal.close()
        self.displayWarning("Server connection", "Trying to reconnect as " + self.name + " ....", true)
        //console.warn('trying to reconnect  as ' + self.name + ' ' + self.socket.id)
        if (self.isConnected) {
          clearInterval(self.interval)
          self.interval = null
          swal.close()
          return
        }
        //self.connect()
        self.socket.connect()
        //swal.close()
      }, 5000)
    })

    self.socket.on('user:disconnect', (data) => {
      console.warn('=====>>>> USER:DISCONNECT ', data)
      self.triggerEvent('user:disconnect', data)
      // remove user from redis
    })

    self.socket.on('user:join', (data) => {
      let str = (data.name.length < 1 ? 'Anon' : data.name) + ' joined ' + (data.room ? ' into ' + data.room : '')
      let str2 = '<b>' + (data.name.length < 1 ? 'Anon' : data.name) + '</b> joined ' + (data.room ? ' into ' + data.room : '')
      self.triggerEvent('user:join', {
        mediator: self,
        data: data,
        message: str
      })

      // request list of all users again

      self.displaySuccess("Server communication", str)
      try {
        self.send.request.serverClientList()
      } catch (error) {
        console.warn('Mediator Send API is not ready yet!');
      }
    })

    //self.socket.on('agency:message:global:receive', (data) => {
    //  self.triggerEvent('agency:message:global:receive', data)
    //})



    self.socket.on('agency:message:global:receive', async (messageEvent) => {
      let eventName = 'agency:message:global:receive'
      let record = copy(messageEvent)
      console.warn('XXXXXXXXX agency:message:global:receive', messageEvent)
      try {
          if (self.store) {
            let oldDocument = await self.store.models.SocketMessage.get(record.uuid)
            if (!!!oldDocument) {
              let document = await self.store.models.SocketMessage.add(record)
            }
          }
      } catch (e) {
          console.error('error oldDocument')
          console.error(e)
      } finally {
          self.triggerEvent(eventName, messageEvent)
      }
    })

    self.socket.on('server:announcement:receive', (data) => {
      self.triggerEvent('server:announcement:receive', data)
      self.displayWarning('Server Announcement', data.message)
    })

    self.socket.on('server:client:list:receive', (data) => {
      self.triggerEvent('server:client:list:receive', data)
    })
    self.socket.on('system:stats', (messageEvent) => {
      // console.log('system:stats', messageEvent)
      self.triggerEvent('system:stats', {
        subject: messageEvent.subject,
        message: messageEvent.message,
        data: messageEvent.data
      })
    })


    self.socket.on('DemoUser', (messageEvent) => {
      // console.log('------------>>>>>>>', 'DemoUser')
      self.triggerEvent('DemoUser', messageEvent)
    })

    self.socket.on('Human', (messageEvent) => {
      // console.log('------------>>>>>>>', 'Human')
      self.triggerEvent('Human', messageEvent)
    })

    self.socket.on('FinanceCategory', (messageEvent) => {
      // console.log('------------>>>>>>>', 'FinanceCategory')
      self.triggerEvent('FinanceCategory', messageEvent)
    })


    self.socket.on('channel:after:join:personal', async (messageEvent) => {
      let evtName = 'channel:after:join:personal'
      // console.warn('>>>>>>>>>>>>> channel:after:join', messageEvent)
      if (self.store) {
        // console.warn('store is available')
        try {
          let record = await self.store.models.SocketChannel.get(messageEvent.channel.uuid)
          // console.log(record)
          if (!!!record) {
            console.warn('creating channel')
            let document = await self.store.models.SocketChannel.add(messageEvent.channel)
            // console.log(document)
          }
        } 
        catch (e) {
          console.error('ERROR channel:after:join:personal', e)
        }
        finally {
              console.warn('joining channel')
              self.joinedChannels[messageEvent.channel.uuid] = true
              self.triggerEvent(evtName, messageEvent)
            }
      } else {
        console.warn('store is NOT available. using memory. joining.')
        self.joinedChannels[messageEvent.channel.uuid] = true
        self.triggerEvent('channel:after:join', messageEvent)
      }
    })



    self.socket.on('message:server:receipt', async (messageEvent) => {
      let eventname = 'message:server:receipt',
        message = copy(messageEvent),
        record = {},
        oldDocument,
        newDocument;

      if (self.store) {
        try {
          oldDocument = await self.store.models.SocketMessage.get(message.uuid)
          if (oldDocument) {
            record = copy(oldDocument)
            record.sent = 1
            record.updatedAt = message.updatedAt
            try {
              newDocument = await self.store.models.SocketMessage.put(record, message.uuid)
            } catch (e) {
              // console.log('error updating doc ', e)
            } finally {
              self.triggerEvent(eventname, message)
            }
          } else {
            throw 'Document ' + message.uuid + ' not found. Can not locally set message as sent.'
          }
        } catch (e) {
          // console.log('error oldDocument')
          console.error(e)
        }
      } else {
        self.triggerEvent(eventname, message)
      }
    })

    self.socket.on('message:acknowledgment:receive', async (messageEvent) => {
      let eventname = 'message:acknowledgment:receive',
        message = copy(messageEvent),
        from = message.from,
        read = false,
        record = {},
        oldDocument;

      if (self.store) {
        try {
          oldDocument = await self.store.models.SocketMessage.get(message.uuid)
        } catch (e) {
          // console.log('error getting doc ', e)
        } finally {
          if (oldDocument) {
            record = copy(oldDocument)
            record.read.forEach(client => {
              if (client.user_id.toString() === from.user_id.toString()) {
                read = true
              }
            })
            if (!read) {
              delete from.id
              record.read.push(from)
              record.sent = 1
              record.updatedAt = message.updatedAt
              try {
                let document = await self.store.models.SocketMessage.put(record, message.uuid)
              } catch (e) {
                console.error('error putting', e)
              } finally {
                self.triggerEvent(eventname, message)
              }
            } else {
              console.error('User ' + from.name + ' - ' + from.id + ' already had read' + message.uuid)
            }
          } else {
            throw 'Document ' + message.uuid + ' not found. Can not set acknowledgment locally.'
          }
        }
      } else {
        self.triggerEvent(eventname, message)
      }
    })

    self.socket.on('webhook:income:messages', async (messageEvent) => {
      let eventName = 'webhook:income:messages'
      let record = copy(messageEvent)

      try {
          if (self.store) {
            let oldDocument = await self.store.models.SocketMessage.get(record.uuid)
            if (!!!oldDocument) {
              let document = await self.store.models.SocketMessage.add(record)
            }
          }
      } catch (e) {
          console.error('error oldDocument')
          console.error(e)
      } finally {
          self.sendAcknowledgment(record.uuid)
          self.triggerEvent(eventName, messageEvent)
      }
    })

    self.socket.on('data:sync', async (messageEvent) => {
      let eventName = 'data:sync'
      let record = copy(messageEvent)
      // console.log('XXXXXXXXX DATA SYNC')
      try {
        if (self.store) {
          //let oldDocument = await self.store.models.SocketMessage.get(record.uuid)
          //if (!!!oldDocument) {
          //  let document = await self.store.models.SocketMessage.put(record)
          //}
        }
      } catch (e) {
        console.error('error oldDocument')
        console.error(e)
      } finally {
        self.sendAcknowledgment(record.uuid)
        self.triggerEvent(eventName, messageEvent)
      }
    })

    self.socket.on('talk:private:receive', async (messageEvent) => {
      if (!document.hasFocus()) {
        self.crossNotification(messageEvent.from.name, messageEvent.message, 'static/message.png')
        let oldTitle = document.title
        self.windowBlinkTimeoutId = setInterval(
          self.blinkWindow(oldTitle, messageEvent.from.name + " sent a message"),
          500
        ); //Initiate the Blink Call
      }
      let record = copy(messageEvent)
      try {
        if (self.store) {
          let oldDocument = await self.store.models.SocketMessage.get(record.uuid)
          if (!oldDocument) {
            let document = await self.store.models.SocketMessage.add(record)
          }
        }
      } catch (e) {
        console.error('error oldDocument')
        console.error(e)
      }
      self.triggerEvent('talk:private:receive', messageEvent)
      self.sendAcknowledgment(record.uuid)
    })

    self.socket.on('channel:after:join', async (messageEvent) => {
      console.warn('>>>>>>>>>>>>> channel:after:join', messageEvent)
      if (self.store) {
        console.warn('store is available')
        try {
          let record = await self.store.models.SocketChannel.findOneByIndex('name', messageEvent.channel.name)
          // console.log(record)
          if (record) {
            console.warn('channel already exist, joining')
            this.joinedChannels[messageEvent.channel] = true
            self.triggerEvent('channel:after:join', messageEvent)
          } else {
            console.warn('creating channel')
            try {
              let document = await self.store.models.SocketChannel.add(messageEvent.channel)
              // console.log(document)
            } catch (e) {
              console.error('error new document')
              console.error(e)
            } finally {
              console.warn('joining channel')
              self.joinedChannels[messageEvent.channel] = true
              self.triggerEvent('channel:after:join', messageEvent)
            }
          }
        } catch (e) {
          console.error(e)
        }
      } else {
        console.warn('store is NOT available. using memory. joining.')
        self.joinedChannels[messageEvent.channel] = true
        self.triggerEvent('channel:after:join', messageEvent)
      }
    })
  }

  setupClient() {
    // console.warn('MessageMediatorClient setupClient()');
    let self = this,
      commandSettings;

    commandSettings = {
      info: 'Check your latency.'
    }
    self.registerCommand('ping', commandSettings, () => {
      self.checkLatency()
    })
    commandSettings = {
      info: 'Information about the chat commands.'
    }
    self.registerCommand('help', commandSettings, () => {
      self.printHelp()
    })
    commandSettings = {
      info: 'General announcements.'
    }
    self.registerCommand('announcement', commandSettings, (arg) => {
      self.sendServerAnnouncement(arg.join(' '))
    })

    commandSettings = {
      info: 'Get All Connected Client IDs list.'
    }
    self.registerCommand('getallclients', commandSettings, (arg) => {
      self.send.request.serverClientList()
    })

    self.triggerEvent('mediator:ready', {
      mediator: self
    })
  }

  displayError (title, text, doNotClose) {
    let self = this
    self.crossNotification(title, text, 'static/error.png')
    // console.warn(self.worker_registration)
    return
    swal.fire({
      title: title,
      text: text,
      type: "error"
    })
    if (doNotClose) {

    } else {
      setTimeout(() => {
        swal.close()
      }, 4000)
    }
  }

  annoucementSender() {
    let self = this
    let html = ``
    let announcement = window.prompt('Type the announcement', '')
    if(announcement && announcement !== '') self.sendUniversal(announcement);
  }

  displayWarning(title, text, doNotClose) {
    let self = this
    self.crossNotification(title, text, 'static/warning.png')
    // console.warn(self.worker_registration)
    return
    swal.fire(
    {
        title : title,
        text : text,
        type : "warning"
    })
    if (doNotClose)
    {

    }
    else
    {
        setTimeout(() =>
        {
            swal.close()
        }, 4000)
    }
  }

  displaySuccess(title, text, doNotClose) {
    let self = this
    self.crossNotification(title, text, 'static/success.png')
    // console.warn(self.worker_registration)
    return
    swal.fire(
    {
        title : title,
        html : text,
        type : "success"
    })
    if (doNotClose)
    {

    }
    else
    {
        setTimeout(() =>
        {
            swal.close()
        }, 4000)
    }
  }

  sendAcknowledgment(uuid) {
    let self = this,
      eventname = 'message:acknowledgment:send',
      utc_date = moment.utc() /*.format()*/ ,
      dateNow = (utc_date).toISOString(),
      envelop = {
        from: self.me,
        uuid: uuid,
        message: 'message ' + uuid + ' read',
        updatedAt: dateNow,
      };

    self.socket.emit(eventname, envelop)
    self.triggerEvent(eventname, envelop)
  }

  sendServerAnnouncement(message) {
    let self = this,
      eventname = 'server:announcement:send'
    message = sanitizeString(message)
    let envelop = self.envelop.newCsCommand({
      from: self.me,
      command: 'server:announcement:send',
      message: message,
    })
    self.socket.emit(eventname, envelop)
    self.triggerEvent(eventname, envelop)
  }


  async sendAgencyGlobalMessage(message) {
    let self = this,
      eventname = 'agency:message:global:send'
    message = sanitizeString(message)
    let envelop = self.envelop.newCsAgencyGlobalMessage({
      from: self.me,
      message: message,
    })
    self.triggerEvent('agency:message:global:before:send', envelop)

    try {
      if (self.store) {
        //let oldDocument = await self.store.models.SocketMessage.get(envelop.uuid)
        //if (!!!oldDocument) {
        //  let document = await self.store.models.SocketMessage.add(envelop)
        //}
      }
    } catch (e) {
      console.error('error sendAgencyGlobalMessage')
      console.error(e)
    } finally {
      self.socket.emit(eventname, envelop)
      self.triggerEvent(eventname, envelop)
    }
  }


  sendCommand(text) {
    let self = this
    if (text.indexOf('/') === 0) {
      let args = text.substring(1).split(' ')
      let commandName = args[0]
      let announcementMessage = false

      if (commandName.indexOf('announcement') > -1) {
        announcementMessage = commandName.split(':')[1]
        commandName = commandName.split(':')[0]
      }

      if (self.commands[commandName]) {
        self.commands[commandName].callback(args.slice(1))
        self.triggerEvent('command:execute', {
          mediator: self,
          data: commandName,
          message: announcementMessage ? announcementMessage : commandName
        })
      } else {
        self.triggerEvent('command:error', {
          mediator: self,
          data: 'Unrecognized Command: ' + text + ', type /help for more info.',
          message: 'Unrecognized Command: ' + text + ', type /help for more info.'
        })
      }
    } else {
      self.triggerEvent('command:error', {
        mediator: self,
        data: 'Unrecognized Command: ' + text + ', type /help for more info.',
        message: 'Unrecognized Command: ' + text + ', type /help for more info.'
      })
    }
  }

  // sends command or agency global message
  async sendUniversal(text) {
    let self = this
    text = sanitizeString(text)
    if (text) {
      if (text.indexOf('/') === 0) {
        self.send.command(text)
      } else {
        await self.sendAgencyGlobalMessage(text)
      }
    }
  }

  registerCommand(name, settings, callback) {
    this.commands[name] = {
      settings: settings,
      callback: callback
    }
  }

  printHelp() {
    let self = this
    for (let cmd in self.commands) {
      if (self.commands.hasOwnProperty(cmd)) {
        self.triggerEvent('command:display:info', {
          mediator: self,
          data: cmd,
          message: '/' + cmd + ': ' + self.commands[cmd].settings.info
        })
      }
    }
  }

  checkLatency() {
    this.startPingTime = Date.now()
    this.socket.emit('ding')
  }

  _emitSimple(eventname) {
    this.socket.emit(eventname)
    this.triggerEvent(eventname)
  }

  _emitText(eventname, text, meta) {
    let self = this
    let message = text || eventname.split(':').join(' ')
    meta = meta || false

    let _data = {
      name: self.name,
      message: message
    }
    if (meta) {
      _data.data = meta
    }

    let eventObject = {
      name: self.name,
      message: message,
      data: _data,
    }

    self.socket.emit(eventname, eventObject)
    self.triggerEvent(eventname, eventObject)
  }

  joinChannel(name, user = false) {

    let self = this
    if(!!!user) user = self.me
    // console.log('joinChannel', user)
    let envelop = self.envelop.channelBeforeJoinMessage({
      from: user,
      channel: name
    })
    //envelop.sent = 1
    // console.log('joinChannel', envelop)
    self.triggerEvent(envelop.type, envelop)
    self.socket.emit(envelop.type, envelop)
    return { ok: true }
  }

  setupSendAPI() {
    let self = this
    this.send = {
      request: {
        // get all Client ids connected to server
        serverClientList: () => {
          this._emitSimple('server:client:list:send')
        },
        // get all Client ids connected to a channel
        inChannelClientList: (channel) => {},
        messagesHistory: (sinceFromDate) => {},
      },
      create: {
        talk: {
          private: (targetUser) => {

          },
          group: (targetUsers) => {

          }
        },
        channel: (targetChannelName) => {}
      },
      // must be admin
      server: {
        announcement: (message) => {
          self.sendServerAnnouncement(message)
        }
      },
      // must be admin, agency, caseworker
      agency: {
        globalMessage: async (message) => {
          await self.sendAgencyGlobalMessage(message)
        }
      },
      // must be admin
      command: (command) => {
        self.sendCommand(command)
      },
      message: {
        to: {
          user: async (c) => {
            let envelop = self.envelop.newCsPrivateMessage({
              from: self.me,
              to: c.to,
              message: c.message,
            })
            //envelop.sent = 1

            let record = copy(envelop)
            // console.log( self.store.models )
            if (self.store) {
              try {
                let document = await self.store.models.SocketMessage.add(record)
                // console.log(document)
              } catch (e) {
                // console.log('error new document')
                // console.log(e)
              } finally {
                self.socket.emit(envelop.type, envelop)
                self.triggerEvent(envelop.type, envelop)
              }

            } else {
              self.socket.emit(envelop.type, envelop)
              self.triggerEvent(envelop.type, envelop)
            }
            return envelop
          },
          // must be group participant
          channel:  async (targetChannelName, message) => {
            let envelop = self.envelop.newCsGroupMessage({
              from: self.me,
              message: c.message,
              channel: targetChannelName
            })
            //envelop.sent = 1

            let record = copy(envelop)
            // console.log( record )
            if (self.store) {
              try {
                let document = await self.store.models.SocketMessage.add(record)
                // console.log(document)
              } catch (e) {
                // console.log('error new document')
                // console.log(e)
              } finally {
                self.socket.emit(envelop.type, envelop)
                self.triggerEvent(envelop.type, envelop)
              }

            } else {
              self.socket.emit(envelop.type, envelop)
              self.triggerEvent(envelop.type, envelop)
            }
            return envelop
          }
        },
        // must be admin
        channel: (targetChannelName) => {

        }
      },
    }
  }

  getBrowserInfo(callback) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let info = {
        timezone: (new Date()).getTimezoneOffset() / 60,
        pageon: window.location.pathname,
        referrer: document.referrer,
        previousSites: history.length,
        browserName: navigator.appName,
        browserEngine: navigator.product,
        browserVersion1a: navigator.appVersion,
        browserVersion1b: navigator.userAgent,
        browserLanguage: navigator.language,
        browserOnline: navigator.onLine,
        browserPlatform: navigator.platform,
        javaEnabled: navigator.javaEnabled(),
        dataCookiesEnabled: navigator.cookieEnabled,
        dataCookies1: document.cookie,
        dataCookies2: decodeURIComponent(document.cookie.split(";")),
        dataStorage: localStorage,
        sizeScreenW: screen.width,
        sizeScreenH: screen.height,
        sizeDocW: document.width,
        sizeDocH: document.height,
        sizeInW: innerWidth,
        sizeInH: innerHeight,
        sizeAvailW: screen.availWidth,
        sizeAvailH: screen.availHeight,
        scrColorDepth: screen.colorDepth,
        scrPixelDepth: screen.pixelDepth,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp,
      }
      if (callback) callback(info)
    })
  }

  // function for creating the notification
  askNotificationPermission(callback) {
    let self = this
    let checKingMessage = (granted) => {
      self.crossNotification('Notifications permission', (granted ? 'Noitification permission is ok' : 'checking notification permission'), 'static/error.png')
    }
    if (!"Notification" in window) {
      // console.log("This browser does not support notifications.")
      if (callback) callback("This browser does not support notifications.", null)
      return
    }

    if ("Notification" in window) {
      if (window.Notification.permission === "granted") {
        // If it's okay let's create a notification
        checKingMessage()
        if (callback) callback(null, true)
      } else if (window.Notification.permission !== 'denied') {
        window.Notification.requestPermission(function (permission) {
          if (!('permission' in window.Notification)) {
            window.Notification.permission = permission
          }
          if (permission === "granted") {
            checKingMessage(true)
          }
          if (callback) callback(null, permission)
        })
      } else {
        if (callback) callback("There is some bloking on notifications", null)
      }
    } else {
      if (callback) callback("This browser does not support notifications.", null)
    }
  }

  crossNotification(title, body, icon) {
    // console.warn('crossNotification crossNotification crossNotification crossNotification')
    let self = this
    // console.log('"Notification" in window', ("Notification" in window))
    // console.log("'serviceWorker' in navigator", ('serviceWorker' in navigator))
    if ('serviceWorkers' in navigator)
    {
      // Android chrome fallBack
      //ServiceWorkerRegistration.showNotification(body)
      if (self.worker_registration) {
        self.worker_registration.showNotification(body)
      } else {
       
        if ('serviceWorker' in navigator) {
          // console.warn("'serviceWorker' in navigator", ('serviceWorker' in navigator))
          //navigator.serviceWorker.register
          navigator.serviceWorker.register('/static/sw.js', {scope: '/static/'})
          .then(function(registration) {
            // console.log(registration)
            if (registration.installing) {
              console.warn('Service worker installing');
            } else if (registration.waiting) {
              console.warn('Service worker installed');
            } else if (registration.active) {
              console.warn('Service worker active');
            }
            console.warn('Registration succeeded. Scope is ' + registration.scope);
            self.worker_registration = registration
            self.worker_registration.showNotification(title, {
                  body: body,
                  icon: icon,
                  //vibrate : [200, 100, 200, 100, 200, 100, 200],
                  tag: title
            })
          }).catch(function(error) {
            // registration failed
            console.warn('Registration failed with ' + error);
          });
        }
        /*else {
          // TODO
          try {
            ServiceWorkerRegistration.showNotification(title, {
              body: body,
              icon: icon,
              //vibrate : [200, 100, 200, 100, 200, 100, 200],
              tag: title
            })
          } catch (e) {
            // console.log(e)
          }
        }*/
      }
    }
    else
    {
      if ("Notification" in window) {
        // console.log(title, body)
        if (Notification.permission === 'granted')
        {
          let not = new window.Notification(title, {
            body: body,
            icon: icon
          })
        }
        
        //if ("vibrate" in window.navigator) window.navigator.vibrate(500)
      }
    }
  }

  blinkWindow(oldTitle, msg) {
    let self = this;

    document.title = document.title == oldTitle ? msg : oldTitle; //Modify Title in case a popup

    //document.focus()

    if (document.hasFocus()) //Stop blinking and restore the Application Title
    {
      document.title = oldTitle;
      clearInterval(self.windowBlinkTimeoutId);
    }
  }

  getId() {
    return this.socket.id
  }
}


export default MessageMediatorClient

window.MessageMediatorClient = MessageMediatorClient
global.MessageMediatorClient = MessageMediatorClient


//let myWorker = new Worker("sw.js")
//myWorker.postMessage('hello from main')
// console.log(myWorker)
// console.log(navigator)

//navigator.serviceWorker.register('sw.js')
