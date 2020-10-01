<template>
<div id="chat-layout">
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex xs12>
        <template v-for="(channel, index) in channels">
          <channel
            v-if="index < 2"
            :key="channel.uuid"
            :channel="channel"
          ></channel>
        </template>        
        <v-card v-bind:class="[ showChat ? '' : 'showChat']">
          <v-toolbar class="toolbar-chat" color="primary" dense dark>
            <!-- <v-toolbar-side-icon @click="openPeople">
              <v-icon>chat</v-icon>
            </v-toolbar-side-icon> -->
            <v-toolbar-title class="subheading chat-toolbar-title" @click="showChat = !showChat">
              <v-icon small>chat</v-icon>
              Online contacts
              <span> {{ online_users.length }} Online</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn small icon @click="showChat = !showChat" v-on="on" class="ma-0 pa-0">
                  <v-icon small>{{ showChat ? 'remove' : 'add' }}</v-icon>
                </v-btn>
              </template>
              <span>{{ showChat ? 'Minimize' : 'Maximize' }} Chat window</span>
            </v-tooltip>

            <!-- <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn small icon v-on="on" class="ma-0 pa-0 btn-more">
                  <v-icon small>more_vert</v-icon>
                </v-btn>
              </template>
              <span>{{ showChat ? 'Minimize' : 'Maximize' }} Chat window</span>
            </v-tooltip> -->

            <v-menu top>
              <template v-slot:activator="{ on }">
                    <v-btn small icon v-on="on" class="ma-0 pa-0 btn-more">
                      <v-icon small>more_vert</v-icon>
                    </v-btn>
              </template>

              <v-list>
                <v-list-tile>
                  <v-list-tile-title>Show Only Online Contacts</v-list-tile-title>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-title>Close this window</v-list-tile-title>
                </v-list-tile>

              </v-list>
            </v-menu>
            
          </v-toolbar>
          <vue-perfect-scrollbar class="chat-people--scrollbar">
            <v-list subheader>
              <v-subheader>People {{ showChat }}</v-subheader>
              <v-list-tile
                v-for="item in users"
                :key="item.name"
                avatar
                @click="openChat(item)"
              >
                <v-list-tile-avatar size="32">
                  <img :src="item.avatar">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title class="body-1" v-html="item.name"></v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon :color="item.active ? 'green' : 'grey'" small>fas fa-circle</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </vue-perfect-scrollbar>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  
</div>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import { getLocalCollection, getOnLocalCollection, joinChannel } from '../helpers/helpers';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import channel from './channel';
import Mediator from '../Mediator';
export default {
    components: {
      VuePerfectScrollbar,
      channel
    },
    data () {
      return {
        show: 'people',
        currentChannel: '',
        onlineIds:[],
        users: [],
        channels: [],
        showChat: true
      }
    },
    watch: {
      online_users: {
        handler () {
          this.setUsers()
          console.log('online user was changed', this.online_users)
          
        },
        deep: true
      }
    },
    created () {
      (async () => {
        await this.setChannels()
      })()
      Mediator.client.on('channel:after:join', async (messageEvent) => {
          console.log('<><><><><><><><><><><><><><><><><> AFTER JOIN', messageEvent)

          //let rU = await getOnLocalCollection('User', messageEvent.from.user_id)
          //let user = rU.data
      })

      Mediator.client.on('channel:after:join:personal', async (messageEvent) => {
        let joined = false
        if (messageEvent.channel.owner !== session.user()._id) {
          return
        }
        this.channels.forEach(channel => { if (channel.uuid === messageEvent.channel.uuid) joined = true })
        if (!!!joined) this.channels.push(messageEvent.channel)
      })
    },
    mounted () {
      (async () => {
        await this.setUsers()
      })()
    },

    beforeRouteEnter (to, from, next) {
      if (!session.isOnline())
      {
        // return;
        next({ path: '/login' });
      }
      else
      {
        next();
      }

    },
    methods:{
      setChannels: async function(){
        let {error, data} = await getLocalCollection('SocketChannel')
        if(!!error) return { error, data:null }
        console.log({error, data})
        this.channels.splice(0, this.channels.length)
        data.forEach( channel => {
          if(channel.type === "personal")
          {
            this.channels.push(channel)
          }
          else
          {
            this.channels.push(channel)
          }
          
        } )
        console.log('xxxxxxx',this.channels, this.users)
        return { error: null, data }
      },
      setUsers: async function( ){
        let self = this
        self.users.splice(0,self.users.length)
        self.online_users.forEach( async (onlineUser) => {
          
          console.info(onlineUser.user_id, self.onlineIds.indexOf(onlineUser.user_id))
          console.info('self.onlineIds', self.onlineIds, this.channels)

          let alreadyOnline = false
          if(self.onlineIds.indexOf(onlineUser.user_id) > -1)
          {
            self.onlineIds.splice(self.onlineIds.indexOf(onlineUser.user_id),1)
            alreadyOnline = true
          }

          self.onlineIds.push(onlineUser.user_id)
          let rU = await getOnLocalCollection('User', onlineUser.user_id)
          let user = rU.data
          let rh = await getOnLocalCollection('Human', user.human)
          console.log(rh)
          user.name = `${rh.data.first_name} ${rh.data.last_name}`
          user.socket = onlineUser

          if(alreadyOnline)
          {
            alreadyOnline = false
            self.users.forEach( (u,i) => {
              if(u.user_id == onlineUser.user_id)
              {
                self.users[i] = user
                alreadyOnline = true;
              }
            })
            if(!!!alreadyOnline)
            {
              self.users.push(user)
            }
          }
          else
          {
            self.users.push(user)
          }
          
          console.log("self.users", self.users);
          
        })
      },
      openChat: function( user ){
        this.show = 'chat'

        //let rh = await getOnLocalCollection('Human', user.human)
        //console.log(rh)
        console.log(user)

        if( user._id === session.user()._id )
        {
          console.info('you cant create another personal channel')
          return;
        }

        console.log(user.socket)
        console.log(this.online_users)
        console.log(user.socket)
        
        let targetPersonClient = user.socket
        let channelName = this.setChannelName( [user._id, session.user()._id] )
        console.log(channelName)
        try {
          joinChannel(false, channelName)
          joinChannel(targetPersonClient, channelName)
        } catch(e) {
          // statements
          console.log(e);
        }
        //

      },
      setChannelName( people ){

        let p = people.sort(function (a, b) {
          if (a > b) {
            return 1;
          }
          if (a < b) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        return `talk_${p.join('_')}`
      },
      openPeople: function(){
        this.show = 'people'
      },

      send (e) {
        let key = e.which || e.keyCode;
        console.log(e.target.value);
        if (key === 13) {
          // sends command ir agency global message
          Mediator.client.sendUniversal(e.target.value);
          e.target.value = '';
        }
      },
    },
    computed: {
      online_users () {
        console.log('his.store.state.online_users', this.store.state.online_users);
        return this.store.state.online_users;
      },
      computeHeight () {
        console.log('<<<<<<--------------------------------->>>>>>', this.height)
        return {
          height: this.height || ''
        };
      }
    },
  }
</script>
<style lang="css" scoped>
  #chat-layout {
    position: fixed; 
    right: 0; 
    bottom: 30px;
  }
  #chat-layout .v-list__tile__avatar{
    min-width: 36px !important;
  }
  #chat-layout .v-card {
    height: 350px;
    width:250px;
    float: left;
    margin-left: 10px;
    border-radius: 5px 5px 0 0;
  }
  .chat-toolbar-title {
    line-height: 0.75;
    margin-left: -15px !important;
  }

   .chat-toolbar-title .v-icon {
    margin-top: 0px !important;
  }

  .showChat .chat-toolbar-title {
    font-size: 14px !important;
    margin-top: -5px !important;
  }
  .chat-toolbar-title span {
    padding-left: 21px !important;
    display: block;
    font-size: 12px !important;
    font-weight: 400;
  }
  .showChat {
    height: 40px !important;
    margin-top: 310px;
    width: 215px !important;
  }
  .toolbar-chat {
    height: 40px !important;
  }

  .showChat .chat-people--scrollbar {
    display: none;
  }
  .showChat .chat-toolbar, .v-toolbar__content {
    padding: 0 10px !important;
  }
  #chat-layout .fa-circle {
    font-size: 8px !important;
  }
  #chat-layout .v-subheader{
    height: 32px !important;
  }
  .btn-more {
    margin-right: -15px !important;
  }
</style>

