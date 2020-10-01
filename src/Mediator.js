// eslint-disable-next-line
/* eslint-disable */
import MessageMediatorClient from './helpers/mediator/MessageMediatorClient';
import store from './helpers/store';
class MediatorClient {
    constructor(settings) {
        this.started = false;
        this.client = false;
    }

    start(sessionData, callback) {
        // console.log('sessionData', sessionData);
        if (this.started) return callback ? callback() : false;
        this.client = new MessageMediatorClient({
            name: sessionData.user.name, //  mandatory
            user_id: sessionData.user.user_id, //  mandatory, must be unique
            agency_id: ""+sessionData.user.agency_id, //  mandatory, must be unique
            swagger: sessionData.swagger || false
        });

        this.client.on('mediator:start', (eventObj) => {
            // console.log(this.client.store);
            

            window.addEventListener("beforeunload", (e)=> {
              // console.log(eventObj);
              this.client.socket.disconnect()
              e.returnValue = true     // Gecko, Trident, Chrome 34+
              return true              // Gecko, WebKit, Chrome <34
            });
            this.started = true;

            window.getApp.$emit('mediator:start')
            if (callback) callback();
        }); //  client.destroyEvent( startEvent );



        this.client.on('mediator:ready', async (eventObj) => {
          console.warn('Connected to the server!');
          console.warn('Type <b>/help</b> for a list of commands.');

          let messages = await this.client.store.models.SocketMessage.getAll()

          messages
            .filter( message => { return message.type === 'agency:message:global:receive'} )
            .sort((a, b) => {
              return (new Date(a.createdAt)).getTime() - (new Date(b.createdAt)).getTime();
            })
            .forEach( message => store.commit('addAgencyAnouncement', message) )


        });

        this.client.on('server:client:list:receive',  (eventObj) => {
          // console.log('server:client:list:receive', eventObj);
          // console.log('server:client:list:receive', eventObj.data.users);
          store.commit('setOnlineUsers', eventObj.data.users);
        });


        this.client.on('channel:after:join:personal',  (eventObj) => {
          // console.log('server:client:list:receive', eventObj);
          // console.log('channel:after:join:personal', eventObj);
        });

        this.client.on('user:join', function(eventObj) {
            // console.log('user:join', eventObj);
        });

        this.client.on('channel:after:join', function(eventObj) {
          // console.log('channel:after:join', eventObj);
        });

        this.client.on('system:stats', function(eventObj) {
            // console.log(eventObj);
        });


        this.client.on('mediator:pong', function(eventObj) {
                // console.log('pong')
                // console.log(eventObj);
            }),


            this.client.on('user:disconnect', function(eventObj) {
                // console.log(eventObj)
                    // logSystemMessage( eventObj);
            });
        // this.client.destroyEvent( on_userDisconnectEvent );

        this.client.on('command:execute', function(eventObj) {
            // console.log(eventObj)
                // logSystemMessage( eventObj );
        });
        // this.client.destroyEvent( on_executeCommandExecuteEvent );
        this.client.on('command:error', function(eventObj) {
            // console.log(eventObj)
                // logSystemMessage( eventObj );
        });
        // this.client.destroyEvent( on_executeCommandError );
        this.client.on('command:display:info', function(eventObj) {
            // console.log(eventObj)
                // logSystemMessage( eventObj );
        });
        // this.client.destroyEvent( on_commandDisplayHelpEvent );


        this.client.on('agency:message:global:send', function(eventObj) {
            // console.log('agency:message:global:send')
            // console.log(eventObj)
                //logUserMessage(eventObj.from.name, eventObj.message, true)
        });
        // this.client.destroyEvent( on_agencyGlobalMessageSendEvent );

        this.client.on('agency:message:global:receive', function(eventObj) {
            // console.log('agency:message:global:receive')
            // console.log(eventObj)
                // console.log( this )
                // console.log( eventObj.from.name )
                // console.log( this.me.name )
                // logUserMessage(eventObj.from.name, eventObj.message, false)
        });
        // this.client.destroyEvent( on_agencyGlobalMessageReceiveEvent );


        // when sends an server announcement
        this.client.on('server:announcement:send', function(eventObj) {
            // console.log('server:announcement:send')
            // console.log(eventObj)
                // logAnnouncements(eventObj.from.name, eventObj.message)
        });
        // this.client.destroyEvent( on_serverAnnouncementSendEvent );

        // when receives an server announcement
        this.client.on('server:announcement:receive', function(eventObj) {
            // console.log('server:announcement:receive')
            // console.log(eventObj)
                // logAnnouncements(eventObj.from.name, eventObj.message)
        });
        // this.client.destroyEvent( on_serverAnnouncementReceiveEvent );

        // when request a available client list
        this.client.on('server:client:list:send', function(eventObj) {
            // console.log('server:client:list:send', eventObj)
            
                //logAnnouncements(eventObj.data.name, eventObj.data.message)
        });
        // this.client.destroyEvent( on_serverRequestClientListEvent );

        //  start Mediator client and connect to socket session
        this.client.start();
    }
}

let Mediator = new MediatorClient();

export default Mediator;
