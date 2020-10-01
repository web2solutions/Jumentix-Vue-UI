<template>
  <div id="appRoot">
    <template v-if="!$route.meta.public">
      <v-app id="inspire" class="app" :dark="$vuetify.dark">
        <app-drawer class="app--drawer" style="z-index: 99999;"></app-drawer>
        <app-toolbar class="app--toolbar" style="z-index: 9999;"></app-toolbar>
        <v-content>
          <!-- Page Header -->
          <page-header v-if="$route.meta.breadcrumb"></page-header>
          <div v-if="$vuetify.dark" class="page-wrapper " style="background-color: #4d4d4d; !important">
            <router-view></router-view>
          </div>
          <div v-else class="page-wrapper">
            <router-view></router-view>
          </div>

           <!-- App Footer v-if="!isMobile()" -->
           <template>
            <v-footer v-if="session.user" height="auto" class="pa-3 app--footer" :dark="$vuetify.dark">
              <span class="caption">Jumentix - web2 solutions &copy; {{ new Date().getFullYear() }}</span>
              <v-spacer></v-spacer>
              <span class="caption hidden-sm-and-down">User: {{ session.user.name }}</span>
              <v-spacer></v-spacer>
              <span class="caption hidden-sm-and-down">Role: {{ session.user.role }}</span>
              <v-spacer></v-spacer>
              <span id="span_endin" class="caption hidden-md-and-down">Session ends in: {{ moment.tz( (new Date(session.expires)).toISOString(), moment.tz.guess() ).format('LLLL') }}</span>
              <v-spacer></v-spacer>
              <span id="progress" style="height: 15px; width: 100px;"></span>
              <v-spacer></v-spacer>
              <router-link class="caption hidden-sm-and-down" to="/privacy">Privacy</router-link>
              <v-spacer></v-spacer>
              <span class="caption mr-1"> Made With Love </span> <v-icon color="pink" small>favorite</v-icon>
            </v-footer>
           </template>
        </v-content>
        <chat v-if="session.user && messagingDrawer === true"></chat>
       <!-- Go to top -->
        <app-fab class="app-fab-top"></app-fab>
        <!-- theme setting -->
        <v-btn small fab dark falt fixed top="top" right="right" class="setting-theme" color="red" @click="openThemeSettings">
          <v-icon>settings</v-icon>
        </v-btn>

        <v-btn small fab dark falt fixed top="top" right="right" class="setting-chat" color="primary" @click="openMessaging">
          <v-icon>chat</v-icon>
        </v-btn>

        <v-btn small fab dark falt fixed top="top" right="right" class="setting-onlineusers" color="green" @click="openOnlineUsers">
          <v-icon>list</v-icon>
        </v-btn>

        

        <v-navigation-drawer
          class="setting-drawer"
          temporary
          right
          v-model="rightDrawer"
          hide-overlay
          fixed
          >
          <theme-settings></theme-settings>
        </v-navigation-drawer>
        <v-navigation-drawer
          class="setting-drawer"
          temporary
          right
          v-model="onlineUsersDrawer"
          hide-overlay
          fixed
          >
          <online-users></online-users>
        </v-navigation-drawer>

      </v-app>
    </template>
    <template v-else>
      <!--<transition>
         <keep-alive> -->
          <router-view></router-view>
        <!-- </keep-alive> 
      </transition>-->
    </template>
    <v-snackbar
      :timeout="3000"
      bottom
      right
      :color="snackbar.color"
      v-model="snackbar.show"
      class="snack-zindex"
    >
      {{ snackbar.text }}
      <v-btn dark flat @click.native="snackbar.show = false" icon>
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-tour v-if="!$router.currentRoute.path.includes('/setup') && $router.currentRoute.name !== 'Login' " class="primary" name="toolbarTour" :steps="steps"></v-tour>
  </div>
</template>
<script>
import * as is from 'is_js'
/* global session, store, moment */
import AppDrawer from '@/components/AppDrawer';
import AppToolbar from '@/components/AppToolbar';
import AppFab from '@/components/AppFab';
import PageHeader from '@/components/PageHeader';
import menu from '@/api/menu';
import ThemeSettings from '@/components/ThemeSettings';
import OnlineUsers from '@/components/OnlineUsers';
import Chat from '@/components/Chat';
import AppEvents from  './event';
export default {
  components: {
    AppDrawer,
    AppToolbar,
    AppFab,
    PageHeader,
    ThemeSettings,
    Chat,
    OnlineUsers
  },
  data: () => ({
    expanded: true,
    rightDrawer: false,
    messagingDrawer: false,
    onlineUsersDrawer: false,
    snackbar: {
      show: false,
      text: '',
      color: '',
    },
    steps:
    [
      {
        target: '#banner_profile',  // We're using document.querySelector() under the hood
        content: `Click here to go to your profile section!`,
        params: {
          placement: 'right'
        }
      },
      {
        target: '#bt_fullscren',  // We're using document.querySelector() under the hood
        content: `Click here to expand to full screen!`,
        params: {
          placement: 'left'
        }
      },
      {
        target: '#menu_notification',
        content: `Click here to preview the last notifications`,
        params: {
          placement: 'left'
        }
      },
      {
        target: '#bt_toogle',
        content: `Click here to toogle the menu bar`,
        params: {
          placement: 'right'
        }
      },
      {
        target: '#bt_speed',
        content: `Click here to logout or preview your profile`,
        params: {
          placement: 'left'
        }
      },
      {
        target: '#span_endin',
        content: `Here you can check when your active session will expires in.`,
        params: {
          placement: 'top'
        }
      }

      // 
    ],
    tourCallbacks: {
      onPreviousStep: this.previousStepCallback,
      onNextStep: this.nextStepCallback
    },
  }),

  computed: {
    session () {

      return this.store.state.session;
    },
  },
  watch: {
    session: {
      handler () {
        // if (!this.session.user) return;
        // console.log('watched session', this.session);
        // this.setAvatar();
        // this.setName();
      },
      deep: true
    }
  },

  created () {
    AppEvents.forEach(item => {
      this.$on(item.name, item.callback);
    });
    window.getApp = this;

    
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
  methods: {
    openThemeSettings () {
      this.$vuetify.goTo(0);
      this.rightDrawer = (!this.rightDrawer);
    },
    openMessaging () {
      this.messagingDrawer = (!this.messagingDrawer);
    },
    //
    openOnlineUsers () {
      this.$vuetify.goTo(0);
      this.onlineUsersDrawer = (!this.onlineUsersDrawer);
    },
    isMobile () {
      return is.mobile()
    }
  },

};
</script>


<style lang="css">
  .swal2-container {
    z-index: 99999 !important;
  }
  img.avatar {
    vertical-align: middle; width: 100px; height: 100px; border-radius: 50%;
  }
  img.ximage {
    vertical-align: middle; width: 250px;
  }
  .setting-theme {
    top:  40%!important;
    right:0;
    border-radius:0
  }
  .setting-chat {
    top:  45%!important;
    right:0;
    border-radius:0
  }
  .setting-onlineusers {
    top:  50%!important;
    right:0;
    border-radius:0
  }
  .page-wrapper {
    min-height:calc(100vh - 100px);
    background: #f5f5f5;
    padding-bottom: 40px !important;
  }
  .v-step {
    z-index:99999!important;
  }
  .snack-zindex {
    z-index: 999999 !important;
  }
  .app-fab-top  {
    margin-bottom: 24px;
    z-index: 999999 !important;
  }
  .app--footer { 
    position: fixed; 
    bottom: 0; 
    width: calc(100% - 250px); 
    z-index: 9;
  }
  @media only screen and (max-width: 999px) {
  .app--footer {
    width: 100%;
  }
}
</style>
