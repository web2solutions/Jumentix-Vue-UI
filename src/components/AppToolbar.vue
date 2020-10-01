<template>

    <v-toolbar
    dense
    color="primary"
    fixed
    dark
    app
    >
    <v-toolbar-title class="ml-0 pl-3">
      <v-toolbar-side-icon id="bt_toogle" @click.stop="handleDrawerToggle"></v-toolbar-side-icon>
    </v-toolbar-title>
    <h4>{{ $route.meta.title }}</h4>
      <v-spacer></v-spacer>     
      <v-btn id="bt_fullscren" icon @click="handleFullScreen()">
        <v-icon>fullscreen</v-icon>
      </v-btn>
         
      

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn id="bt_notification_permission" icon @click="allowNotification">
            <v-icon v-if="notification_allowed">check_circle</v-icon>
            <v-icon v-else>highlight_off</v-icon>
          </v-btn>
        </template>
        <span v-if="notification_allowed">Notification is allowed</span>
        <span v-else>Notification is not allowed. Click to allow.</span>
      </v-tooltip>

      <v-menu id="menu_notification" offset-y origin="center center" class="elelvation-1" :nudge-bottom="14" transition="scale-transition">
        <v-btn icon flat slot="activator">
        <v-badge color="red" overlap>
          <span slot="badge">3</span>
          <v-icon medium>notifications</v-icon>
        </v-badge>
        </v-btn>
        <notification-list></notification-list>
      </v-menu>
      <v-menu id="bt_speed" offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
        <v-btn icon large flat slot="activator">
          <v-avatar size="30px">
            <img 
              :src="avatar" 
              :alt="name"
            />
          </v-avatar>
        </v-btn>
        <v-list class="pa-0">
          <v-list-tile v-for="(item,index) in items" :to="!item.href ? { name: item.name } : null" :href="item.href" @click="item.click" ripple="ripple" :disabled="item.disabled" :target="item.target" rel="noopener" :key="index">
            <v-list-tile-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
  </v-toolbar>
  

</template>
<script>
// import session from '../helpers/session';
import NotificationList from '@/components/widgets/list/NotificationList';
import Util from '@/util';
export default {
  name: 'app-toolbar',
  components: {
    NotificationList
  },
  data: () => ({

    avatar: '/static/avatar.png',
    name: '',
    notification_allowed: false,
    items: [
      {
        icon: 'account_circle',
        href: '/#/account-info',
        title: 'My Account',
        click: (e) => { }
      },
      /** {
        icon: 'settings',
        href: '#',
        title: 'Settings',
        click: (e) => {
          console.log(e);
        }
      }, */
      {
        icon: 'fullscreen_exit',
        href: '/#/logout',
        title: 'Logout',
        click: (e) => {
          // session.logout();
          // window.getApp.$emit('APP_LOGOUT');
        }
      }
    ],
  }),
  computed: {
    toolbarColor () {
      return this.$vuetify.options.extra.mainNav;
    },
    session () {
      return this.store.state.session;
    },
  },
  watch: {
    session: {
      handler () {
        if (!this.session.user) return;
        // console.log('watched session', this.session);
        this.setAvatar();
        this.setName();
      },
      deep: true
    }
  },
  created () {
    if (window.Notification.permission === 'granted')
    {
      this.notification_allowed = true;
    }
  },
  mounted () {
    if (!this.session.user) return;
    // console.log('session', this.session);
    this.setAvatar();
    this.setName();
    
  },
  methods: {
    handleDrawerToggle () {
      window.getApp.$emit('APP_DRAWER_TOGGLED');
    },
    allowNotification () {
      window.Notification.requestPermission((permission) => {
        // If the user accepts, let's create a notification
        if (permission === 'granted') {
          let not = new window.Notification('Configuration', {
            body: 'Notification is now allowed',
            icon: 'static/success.png'
          });
          this.notification_allowed = true;
        }
      });
    },
    handleFullScreen () {
      Util.toggleFullScreen();
    },
    setAvatar () {
      if (this.session) if (this.session.user) if (this.session.user.avatar) this.avatar = this.session.user.avatar;
    },
    setName () {
      if (this.session) if (this.session.user) if (this.session.user.name) this.name = this.session.user.name;
      
    },
    goToAccountInfo () {
      console.log(this.$router.push);
      this.$router.push({ path: 'account-info' });
    }
  }
};
</script>
