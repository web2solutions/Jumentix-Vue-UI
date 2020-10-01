'use strict';
import moment from 'moment-timezone'
import { uuid, isDefined, isNumber, isArray, isEmail, sanitizeString, copy, isDate } from './util'
// import config from '../config'
// const env = process.env.NODE_ENV || "development"

// moment.tz.setDefault( config[ env ].timezone )

class Message
{
    constructor( c )
    {
        let toIds = []
        let _message = c.message
        let _subject = ''
        let from_copy = {}
        let to_copy = {}
        let utc_date  = moment.utc()/*.format()*/,
            dateNow = ( utc_date ).toISOString(),
            createdAt,
            updatedAt,
            defaultNumOfDaysExpires = 1, // default expire message after one day
            ttl_utc_date = moment.utc().add(defaultNumOfDaysExpires, 'days');

        // checkings
        if( ! isDefined(c.from)  )
        {
            throw 'cant compose, undefined from'
        }
        if( ! isDefined( c.type )  )
        {
            throw 'cant compose, undefined type'
        }
        if( ! isDefined(c.from.agency_id)  )
        {
            throw 'cant compose, undefined agency_id'
        }
        if( ! isNumber(c.from.agency_id)  )
        {
            throw 'cant compose, agency_id need to a number'
        }

        this.uuid = c.uuid || uuid() // type guid mandatory
        this.from = c.from // type user mandatory

        this.to = c.to || {}

        this.agency_id = +c.from.agency_id // type integer mandatory

        this.data = c.data || {}
        this.payload = c.payload || {}
        this.items = c.items || []

        this.type = c.type
        /*
        server:client:list:send
        talk:private:create
        talk:private:send TODO
        talk:group:join
        talk:group:send TODO
        talk:group:leave
        server:announcement
        server:client:list:receive
        */

        if( isDefined( c.createdAt )  )
        {
            createdAt = c.createdAt
        }
        else {
            createdAt = dateNow
        }

        if( isDefined( c.updatedAt )  )
        {
            updatedAt = c.updatedAt
        }
        else {
            updatedAt = dateNow
        }
        //console.log(this.config.timezone)

        this.createdAt = createdAt
        this.updatedAt = updatedAt

        //console.log('composer ', this.createdAt)
        //console.log('composer ', this.updatedAt)


        if( c.ttl )
        {
            if( isNumber(c.ttl) )
            {
                ttl_utc_date = moment.utc().add( parseInt( c.ttl ), 'd' )
            }
        }

        this.ttl = ( ttl_utc_date ).toISOString()

        this.sent = 0

        from_copy = copy( this.from )
        delete from_copy.id

        this.read = [
            from_copy
        ]

        this.people = [
            from_copy
        ]

        toIds = [
            isNumber( c.from.user_id ) ? (+c.from.user_id) : c.from.user_id
        ]

        if(  c.type === 'talk:private:send' ||  c.type === 'talk:private:receive' || c.type === 'talk:group:send' ||  c.type === 'talk:group:receive' )
        {
            // if is a chat message
            if( ! isDefined(c.message)  )
            {
                throw 'cant compose chat message, undefined message'
            }
            if( ! isDefined(c.to)  )
            {
                throw 'cant compose chat message, undefined to'
            }

            to_copy = copy( this.to )
            delete to_copy.id

            toIds.push( isNumber( c.to.user_id ) ? (+c.to.user_id) : c.to.user_id )
            this.people.push( to_copy )
        }



        if(  c.type === 'talk:group:send' ||  c.type === 'talk:group:receive' )
        {
            if( isArray(c.people) )
            {
                c.people.forEach( ( user ) =>
                {
                    delete user.id
                    this.people.push( user )
                    toIds.push( isNumber( user.user_id ) ? (+user.user_id) : user.user_id )
                } )
            }
        }

        if( c.type === 'webhook:income:messages' )
        {
            if( ! isDefined(c.to)  )
            {
                throw 'cant compose webhook:income:messages, undefined to'
            }

            this.read = [ ]
            this.people = [ ]
        }

        if(  c.type === 'channel:before:join' ||  c.type === 'channel:after:join' )
        {
            if( ! isDefined(c.channel)  )
            {
                throw 'cant compose chat message, undefined channel'
            }
            this.channel = c.channel
        }
        else {
            this.setchannel( this.type, toIds )
        }

        if( c.subject )
        {
            _subject = sanitizeString( c.subject.toString() )
        }
        else {
            _subject = 'Message from' + this.from.name
        }

        _message = sanitizeString( _message )

        if( isArray( c.read ) ) this.read  = c.read
        if( isArray( c.people ) ) this.people  = c.people

        this.message = _message
        this.subject = _subject
    }

    setchannel( type, toIds )
    {
        let self = this
        //console.log("setchannel <===========================")
        //console.log(toIds)
        switch(type) {
            case 'talk:private:create':
                self.channel = 'private_talk_'+self.agency_id+'_' + toIds.sort(function(a, b) { return a - b }).join('_')
                break;
            case 'talk:private:send':
                    self.channel = 'private_talk_'+self.agency_id+'_' + toIds.sort(function(a, b) { return a - b }).join('_')
                    break;
            case 'talk:private:receive':
                    self.channel = 'private_talk_'+self.agency_id+'_' + toIds.sort(function(a, b) { return a - b }).join('_')
                    break;
            case 'talk:group:create':
                self.channel = 'group_talk_'+self.agency_id+'_' + toIds.sort(function(a, b) { return a - b }).join('_')
                break;
            case 'talk:group:send':
                    self.channel = 'group_talk_'+self.agency_id+'_' + toIds.sort(function(a, b) { return a - b }).join('_')
                    break;
            case 'talk:group:receive':
                    self.channel = 'group_talk_'+self.agency_id+'_' + toIds.sort(function(a, b) { return a - b }).join('_')
                    break;
            default:
                self.channel = '/'
        }
    }
}

class Composer
{
    constructor( )
    {

    }

    // channel:before:join   channel:after:join
    channelBeforeJoinMessage( c )
    {
        if( ! isDefined(c.from)  )
        {
            throw 'cant compose before join message, undefined from'
        }
        if( ! isDefined(c.channel)  )
        {
            throw 'cant compose before join message, undefined channel'
        }

        return new Message({
            from: c.from,
            type: 'channel:before:join',
            ttl: 0,
            people: [
                c.from
            ],
            subject: '',
            message: '',
            channel: c.channel
        })
    }


    channelAfterJoinMessage( c )
    {
        if( ! isDefined(c.from)  )
        {
            throw 'cant compose before join message, undefined from'
        }
        if( ! isDefined(c.channel)  )
        {
            throw 'cant compose before join message, undefined channel'
        }

        return new Message({
            from: c.from,
            type: 'channel:after:join',
            ttl: 0,
            people: [
                c.from
            ],
            subject: '',
            message: '',
            channel: c.channel
        })
    }


    // 'talk:private:send' ||  c.type === 'talk:group:send'
    newCsPrivateMessage( c )
    {
        let channel = ''
        if( ! isDefined(c.from)  )
        {
            throw 'cant compose private chat message, undefined from'
        }
        if( ! isDefined(c.to)  )
        {
            throw 'cant compose private chat message, undefined to'
        }

        return new Message({
            from: c.from,
            type: 'talk:private:send',
            ttl: ( 365 * 10 ),
            to: c.to,
            people: [
                c.from,
                c.to
            ],
            subject: c.subject || 'New message from ' + c.from.name,
            message: c.message,
            channel: channel
        })
    }

    webHookMessage( c )
    {
        if( ! isDefined(c.from)  )
        {
            throw 'cant compose webHookMessage, undefined from'
        }
        if( ! isDefined(c.to)  )
        {
            throw 'cant compose webHookMessage, undefined to'
        }

        return new Message({
            from: c.from,
            type: 'webhook:income:messages',
            to: c.to,
            subject: c.subject || 'New webhook message ',
            message: c.message || 'New webhook message',
            data: c.data || false,
            items: c.items || false,
            ttl: 30
        })
    }

    newScPrivateMessage( c )
    {
        let channel = ''
        if( ! isDefined(c.from)  )
        {
            throw 'cant compose Server private chat message, undefined from'
        }
        if( ! isDefined(c.to)  )
        {
            throw 'cant compose Server private chat message, undefined to'
        }
        if( ! isDefined(c.uuid)  )
        {
            throw 'cant compose Server private chat message, undefined c.uuid'
        }
        if( ! isDefined(c.createdAt)  )
        {
            throw 'cant compose Server private chat message, undefined c.createdAt'
        }
        if( ! isDefined(c.updatedAt)  )
        {
            throw 'cant compose Server private chat message, undefined c.updatedAt'
        }

        return new Message({
            from: c.from,
            type: 'talk:private:receive',
            ttl: ( 365 * 10 ),
            to: c.to,
            uuid: c.uuid,
            people: [
                //c.from,
                c.to
            ],
            subject: c.subject || 'New message from ' + c.from.name,
            message: c.message,
            subject: 'New message from ' + c.from.name,
            channel: channel,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt
        })
    }

    newRabbitMessageToUser( c )
    {
        let channel = ''
        if( ! isDefined(c.from)  )
        {
            throw 'cant compose RabbitMQ message, undefined from'
        }
        if( ! isDefined(c.to)  )
        {
            throw 'cant compose RabbitMQ message, undefined to'
        }
        if( ! isDefined(c.uuid)  )
        {
            throw 'cant compose RabbitMQ message, undefined c.uuid'
        }
        if( ! isDefined(c.type)  )
        {
            throw 'cant compose RabbitMQ message, undefined c.type'
        }
        if( ! isDefined(c.createdAt)  )
        {
            throw 'cant compose RabbitMQ message, undefined c.createdAt'
        }
        if( ! isDefined(c.updatedAt)  )
        {
            throw 'cant compose RabbitMQ message, undefined c.updatedAt'
        }

        if( ! isDefined(c.from.id)  )
        {
            c.from.id = uuid()
        }
        if( ! isDefined(c.to.id)  )
        {
            c.to.id = uuid()
        }

        return new Message({
            from: c.from,
            type: c.type,
            ttl: ( 365 * 10 ),
            to: c.to,
            uuid: c.uuid,
            people: [],
            read: [],
            subject: c.subject || 'New message from ' + c.from.name,
            message: c.message,
            channel: channel,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            data: c.data || false,
            payload: c.payload || false
        })
    }

    newCsGroupMessage( c )
    {
        if( ! isDefined(c.channel)  )
        {
            throw 'cant compose group chat message, undefined channel'
        }
        if( ! isDefined(c.from)  )
        {
            throw'cant compose group chat message, undefined from'
        }
        return new Message({
            from: c.from,
            type: 'talk:group:send',
            ttl: ( 365 * 10 ),
            uuid: c.uuid,
            to: {},
            people: [],
            subject: c.subject || 'New message from ' + c.from.name,
            message: c.message,
            channel: c.channel
        })
    }



    /*
        composer.newCsCommand( {
            command: 'server:announcement:send',
            message: 'Server will go down for 5 hours'
        } )
    */
    newCsCommand( c )
    {
        //console.log(c)
        if( ! isDefined(c.command)  )
        {
            throw 'cant compose cs command, undefined command'
        }

        if( c.command === 'server:announcement:send' )
        {
            if( ! isDefined(c.message)  )
            {
                throw 'cant compose server:announcement:send, undefined message'
            }
        }
        let message = {
            from: c.from,
            type: c.command,
            ttl: 30,
            to: {},
            people: [],
            subject: c.subject || '',
            message: c.message || '',
            channel: '/'
        }
        return new Message( message )
    }

    newCsAgencyGlobalMessage( c )
    {
        //console.log(c)
        if( ! isDefined(c.message)  )
        {
            throw 'cant compose server:announcement:send, undefined message'
        }
        return new Message( {
            from: c.from,
            type: 'agency:message:global:send',
            ttl: 30,
            to: {},
            people: [],
            subject: c.subject || '',
            message: c.message,
            channel: '/',
            data:{
                name: c.from.name,
                message: c.message
            }
        } )
    }

    newScAgencyGlobalMessage( c )
    {
        //console.log(c)
        if( ! isDefined(c.message)  )
        {
            throw 'cant compose server:announcement:send, undefined message'
        }
        return new Message( {
            from: c.from,
            type: 'agency:message:global:receive',
            ttl: 30,
            to: {},
            people: [],
            subject: c.subject || '',
            message: c.message,
            channel: '/',
            data:{
                name: c.from.name,
                message: c.message
            }
        } )
    }

    newScClientsList( c )
    {
        if( ! isDefined(c.ids)  )
        {
            throw 'cant compose group chat message, undefined ids'
        }
        if( ! isDefined(c.users)  )
        {
            throw 'cant compose group chat message, undefined users'
        }
        return new Message({
            from: c.from,
            type: 'server:client:list:receive',
            ttl: 0,
            to: c.from,
            people: [],
            subject: '',
            message: '',
            channel: '',
            data:{
                ids: c.ids,
                users: c.users
            }
        })
    }

    newScClientDisconnect( c )
    {
        return new Message({
            from: c.from,
            type: 'server:client:list:receive',
            ttl: 0,
            to: c.from,
            people: [],
            subject: '',
            message: (c.from.name.length < 1 ? 'Anon' : c.from.name) + '</b> disconnected.',
            channel: '',
            data:{
                name: c.from.name,
                user: c.from
            }
        })
    }
}

export default Composer
