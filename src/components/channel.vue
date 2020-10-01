<template>
  <v-card v-bind:class="[ showChat ? '' : 'showChat']">
    <v-toolbar class="toolbar-chat pa-0" color="primary" dense dark>
      <v-toolbar-title class="subheading chat-toolbar-title" v-html="channel.type" @click="showChat = !showChat"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn small icon @click="showChat = !showChat" v-on="on" class="ma-0 pa-0">
            <v-icon small>{{ showChat ? 'remove' : 'add' }}</v-icon>
          </v-btn>
        </template>
        <span>{{ showChat ? 'Minimize' : 'Maximize' }} Chat window</span>
      </v-tooltip>

      <v-menu top>
        <template v-slot:activator="{ on }">

              <v-btn small icon v-on="on" class="ma-0 pa-0 btn-more">
                <v-icon small>more_vert</v-icon>
              </v-btn>
        </template>

        <v-list>
          <v-list-tile>
            <v-list-tile-title>View Profile</v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title>Open in a new window</v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title>Close this window</v-list-tile-title>
          </v-list-tile>

        </v-list>
      </v-menu>
    </v-toolbar>
    <vue-perfect-scrollbar
      class="chat-room--scrollbar grey lighten-5"
      style="height: 230px; background-color: #666;"
    >
      <v-list three-line>
        <template v-for="(item, index) in messages">
          <template>
            <div
              v-bind:class="[ item.me ? 'reverse' : '']"
              class="messaging-item layout row my-3"
              :key="index"
            >
              <v-avatar class="indigo mx-1" size="32">
                <img v-bind:src="item.avatar" alt />
              </v-avatar>
              <div class="messaging--body layout column mx-2 body-1">
                <p
                  :value="true"
                  v-bind:class="[ item.me ? 'primary white--text' : 'white']"
                  class="pa-2 ma-0"
                >{{item.message}}</p>
                <div
                  class="caption px-1 text--secondary"
                >{{new Date(item.createdAt).toLocaleString()}}</div>
              </div>
              <v-spacer></v-spacer>
            </div>
          </template>
        </template>
      </v-list>
    </vue-perfect-scrollbar>

    <v-card-actions>
      <v-text-field
        full-width
        flat
        clearable
        solo
        append-icon="send"
        label="Type some message here"
        @keyup="send"
      >
        <v-icon slot="append-icon" @click="send">send</v-icon>
        <v-icon slot="append-icon" class="mx-2">photo</v-icon>
        <v-icon slot="append-icon">face</v-icon>
      </v-text-field>
    </v-card-actions>
  </v-card>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
import {
  getLocalCollection,
  getOnLocalCollection,
  joinChannel
} from "../helpers/helpers";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Mediator from "../Mediator";
export default {
  components: {
    VuePerfectScrollbar
  },
  props: {
    channel: {
      type: Object,
      default: function() {
        return {};
      }
    }
    /*entity: {
        default: '',
        type: String
      },
      
      hideFields: {
        default: function () { return [] },
        type: Array
      },
      hideSubFields: {
        default: function () { return {} },
        type: Object
      },
      hideCloseButton: {
        default: false,
        type: Boolean
      },
      isFormSimple: {
        default: false,
        type: Boolean
      },
      isHideOnFormSimpleSave: {
        default: true,
        type: Boolean
      },
      displayWhat: {
        default: 'crud',
        type: String
      },
      dialog: {
        default: false,
        type: Boolean
      },
      loading: {
        default: false,
        type: Boolean
      },
      dialog_loading: {
        default: false,
        type: Boolean
      },
      showHeadline: {
        default: true,
        type: Boolean
      },
      selected: {
        default: function () { return [] },
        type: Array
      },
      forms: {
        type: Object,
        default: function () { return {} },
      },
      form_search: {
        type: Object,
        default: function () { return {} },
      },
      query_operators: {
        type: Object,
        default: function () { return {} },
      },

      currentFormMode: {
        default: 'create',
        type: String
      },
      uploaders: {
        default: function () { return [] },
        type: Array
      },*/
  },
  data() {
    return {
      showChat: true,
      messages: [
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
          _id: "1",
          message:
            " I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
          me: false,
          createdAt: Date.now()
        },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
          _id: "2",
          message: "Wish I could come, but I'm out of town this weekend.",
          me: true,
          createdAt: Date.now()
        }
      ]
    };
  },
  watch: {
    online_users: {
      handler() {},
      deep: true
    }
  },
  created() {
    //AppEvents.forEach(item => {
    //  this.$on(item.name, item.callback);
    //});
    //window.getApp = this;
    console.log(
      "=============================== channel ==============================="
    );
  },
  mounted() {},

  beforeRouteEnter(to, from, next) {
    if (!session.isOnline()) {
      // return;
      next({ path: "/login" });
    } else {
      next();
    }
  },
  methods: {
    send(e) {
      let key = e.which || e.keyCode;
      console.log(e.target.value);
      if (key === 13) {
        // sends command ir agency global message
        (async function(){
          console.log(this.channel);
          // await Mediator.client.send.message.to.channel(targetChannelName, message);
        })()
        e.target.value = "";
      }
    }
  },
  computed: {
    online_users() {
      return this.store.state.online_users;
    }
  }
};
</script>
<style lang="css" scoped>

  .toolbar-chat {
    height: 40px !important;
  }
  .v-card {
    height: 350px;
    width:250px;
    float:left;
    margin-left: 10px;
  }
  .showChat .chat-room--scrollbar {
    display: none;
  }

  .toolbar-channel {
    height: 40px !important;
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

