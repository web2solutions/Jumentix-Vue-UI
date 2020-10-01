<template>
  <v-navigation-drawer
    id="appDrawer"
    :mini-variant="mini"
    fixed
    :dark="$vuetify.dark"
    app
    v-model="drawer"
    width="250"
    mobile-break-point="1000"
    >
    <v-toolbar flat color="transparent" id="logo">
      <div class="">
        <img v-bind:src="computeLogo" width="90%" alt="Your Agency">
      </div>
    </v-toolbar>
    <name-card
      :cardBgImage="cardBgImage"
      :jobTitle="jobTitle"
      :name="name"
      :avatar="avatar"
      :dark="dark"
      :mini="mini"
    >
      <a color="green darken-4" href="#"><i color="green darken-4" class="fa fa-circle text-success"></i> Online</a>
    </name-card>
    
    <vue-perfect-scrollbar class="drawer-menu--scroll" :settings="scrollSettings">
      <v-list dense expand class="mt-2">
        <template v-for="(item, i) in menus">
            <!--group with subitems-->
            <v-list-group v-if="item.items && getRole(item)" :key="item.name" :group="item.group" :prepend-icon="item.icon" no-action="no-action">
              
              <v-list-tile slot="activator" ripple="ripple">
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <template v-for="(subItem, i) in item.items">
                <!--sub group-->
                <v-list-group v-if="subItem.items" :key="subItem.name" :group="subItem.group" sub-group="sub-group">
                  <v-list-tile slot="activator" ripple="ripple">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile v-for="(grand, i) in subItem.children" :key="i" :to="genChildTarget(item, grand)" :href="grand.href" ripple="ripple">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ grand.title }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list-group>
                <!--child item-->
                <v-list-tile v-else :key="i" :to="genChildTarget(item, subItem)" :href="subItem.href" :disabled="subItem.disabled" :target="subItem.target" ripple="ripple">
                  <v-list-tile-content>
                    <v-list-tile-title><span>{{ subItem.title }}</span></v-list-tile-title>
                  </v-list-tile-content>
                  <!-- <v-circle class="white--text pa-0 circle-pill" v-if="subItem.badge" color="red" disabled="disabled">{{ subItem.badge }}</v-circle> -->
                  <v-list-tile-action v-if="subItem.action">
                    <v-icon :class="[subItem.actionClass || 'success--text']">{{ subItem.action }}</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
            </v-list-group>
            <v-subheader v-else-if="item.header && getRole(item)" :key="i">{{ item.header }}</v-subheader>
            <v-divider v-else-if="item.divider && getRole(item)" :key="i"></v-divider>
            <!--top-level link-->
            <v-list-tile v-else-if="getRole(item)" :to="!item.href ? { name: item.name } : null" :href="item.href" ripple="ripple" :disabled="item.disabled" :target="item.target" rel="noopener" :key="item.name">
              <v-list-tile-action v-if="item.icon">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
              <!-- <v-circle class="white--text pa-0 chip--x-small" v-if="item.badge" :color="item.color || 'primary'" disabled="disabled">{{ item.badge }}</v-circle> -->
              <v-list-tile-action v-if="item.subAction">
                <v-icon class="success--text">{{ item.subAction }}</v-icon>
              </v-list-tile-action>
              <!-- <v-circle class="caption blue lighten-2 white--text mx-0" v-else-if="item.chip" label="label" small="small">{{ item.chip }}</v-circle> -->
            </v-list-tile>
        </template>
      </v-list>        
    </vue-perfect-scrollbar>        
  </v-navigation-drawer>
</template>
<script>
/* global session */
import menu from '@/api/menu';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import session from '../helpers/session';
import NameCard from '@/components/widgets/card/NameCard';
import ProfileCard from '@/components/widgets/card/ProfileCard';
export default {
  name: 'app-drawer',
  components: {
    VuePerfectScrollbar,
    NameCard,
    ProfileCard
  },
  props: {
    expanded: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    mini: false,
    drawer: true,
    menus: menu,
    scrollSettings: {
      maxScrollbarLength: 160
    },
    cardBgImage: '/static/bg/n3.jpeg',
    jobTitle: session.user().role,
    name: session.user().name,
    dark: false,
    avatar: {
      src: session.user().avatar,
      size: '36'
    },
    item: {
<<<<<<< HEAD
      
=======
      jobTitle: session.user().role,
      name: session.user().name,
      dark: false,
      cardBgImage: '/static/bg/user-panel-bg-1.png',
      avatar: {
        src: session.user().avatar,
        size: '36'
      }
>>>>>>> 5009f839c63de6a284240f30f0273f9eb658efb8
    }
  }),
  computed: {
    computeGroupActive () {
      return true;
    },
    computeLogo () {
      return '/static/logo.png';
    },

    sideToolbarColor () {
      return this.$vuetify.options.extra.sideNav;
    }
  },
  watch: {

  },
  created () {
    if (session.isOnline()) {
      window.getApp.$on('APP_DRAWER_TOGGLED', () => {
        // this.drawer = (!this.drawer);
        this.mini = (!this.mini);
      });
    }
  },
  methods: {
    genChildTarget (item, subItem) {
      if (subItem.href) return;
      if (subItem.component) {
        return {
          name: subItem.component,
        };
      }
      return { name: `${item.group}/${(subItem.name)}` };
    },
    getRole (item) {
      let isRole;
      
      if (session.user()) {
        // console.log('IF session user', session);
        let roles = session.user().roles;
        // console.log('Roles', roles);
        roles.forEach(element => {
          if (element === 'admin' || item.roles.indexOf(element) > -1 || item.roles[0] === '*') {
            // console.log(item.title, element, item.roles.indexOf(element));
            isRole = true;
          }
        });
      }
      if (isRole) return true;
    }
  }
};
</script>


<style lang="stylus">
// @import '../../node_modules/vuetify/src/stylus/settings/_elevations.styl';

#appDrawer
  overflow: hidden
  .drawer-menu--scroll
    height: calc(100vh - 110px)
    overflow: auto

#logo .v-toolbar__content{
 padding: 0 5px;
 height 100% !important;
 text-align: center;
}
</style>
