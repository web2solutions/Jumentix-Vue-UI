
<template>
  <v-card class="chat-room">
    <v-toolbar card dense flat class="white chat-room--toolbar" light>
      <v-btn icon>
        <v-icon color="text--secondary">keyboard_arrow_left</v-icon>
      </v-btn>
      <template v-if="chat.users">
        <v-avatar size="32" class="avatar-stack" v-for="(userId,index) in chat.users" :key="index">
          <img :src="getAvatar(userId)" alt="">
        </v-avatar>
      </template>
      <v-spacer></v-spacer>
      <v-toolbar-title> <h4>Chat Channel</h4></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn icon slot="activator">
          <v-icon color="text--secondary">add</v-icon>
        </v-btn>
        <span>Add user</span>
      </v-tooltip>
    </v-toolbar>
    <vue-perfect-scrollbar class="chat-room--scrollbar grey lighten-5" v-bind:style="computeHeight">
      <v-card-text class="chat-room--list pa-3">
        <template v-for="(item, index) in chat.messages">
          <div v-bind:class="[ index % 2 == 0 ? 'reverse' : '']" class="messaging-item layout row my-4" :key="index">
            <v-avatar class="indigo mx-1" size="40">
              <img v-bind:src="item.user.avatar" alt="">
            </v-avatar>
            <div class="messaging--body layout column mx-2">
              <p :value="true" v-bind:class="[ index % 2 == 0 ? 'primary white--text' : 'white']" class="pa-2">
                {{item.text}}
              </p>
              <div class="caption px-2 text--secondary">{{new Date(item.createdAt).toLocaleString()}}</div>
            </div>
            <v-spacer></v-spacer>
          </div>
        </template>
      </v-card-text>
    </vue-perfect-scrollbar>
    <v-card-actions>
      <v-text-field
        full-width
        flat
        clearable
        solo
        append-icon="send"
        label="Type some message here" @keyup="send" >
        <v-icon slot="append-icon" @click="send">send</v-icon>
        <v-icon slot="append-icon" class="mx-2">photo</v-icon>
        <v-icon slot="append-icon">face</v-icon>

      </v-text-field>
    </v-card-actions>
  </v-card>
</template>
<script>
/* global $mclient, session, $t, MessageMediatorClient */
// eslint-disable-next-line
/* eslint-disable */
import { getChatById } from '@/api/chat';
import { getUserById } from '@/api/user';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    VuePerfectScrollbar
  },
  props: {
    _id: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: null,
    }
  },
  computed: {
    chat () {
      let chatOrigin = {
        title: 'Chat',
        users: [],
        messages: []
      };
      let chat = getChatById(this.$route.params._id);
      return Object.assign(chatOrigin, chat);
    },
    computeHeight () {
      return {
        height: this.height || ''
      };
    }
  },
  methods: {
    getAvatar (uid) {
      return getUserById(uid).avatar;
    },
    send (e) {
      let key = e.which || e.keyCode;
      console.log(e.target.value);
      if (key === 13) {
        // sends command ir agency global message
        $mclient.sendUniversal(e.target.value);
        e.target.value = '';
      }
    },
  }
};
</script>
