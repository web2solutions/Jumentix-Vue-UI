<template>
  <div>
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
          
          <img ref="logo" v-bind:src="logo" width="90%" alt="Your Agency">

          <v-dialog
            v-model="editLogo"
            
          >
            <template v-slot:activator="{ on }">
              <v-icon color="primary" v-on="on" style="position: absolute; right: 10px; top: 10px;">edit</v-icon>
            </template>

            <v-card>
              <v-card-title
                class="headline grey lighten-2"
                primary-title
              >
                Logo uploader and croppper
              </v-card-title>

              <v-card-text>
                <div class="cropper-area">
                <input
                  ref="input"
                  type="file"
                  name="image"
                  accept="image/*"
                  @change="setImage"
                  style="display: none;"
                />
                <div class="img-cropper">
                <vue-cropper 
                  ref="cropper"
                  :src="imgSrc"
                  alt="Source Image"
                  width="100%"
                  dragMode="move"
                >
                </vue-cropper>
                </div>
              </div>
                
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-btn
                  color="primary"
                  text
                  @click.prevent="zoom(0.2)"
                >
                  <v-icon color="secondary">zoom_in</v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click.prevent="zoom(-0.2)"
                >
                  <v-icon color="secondary">zoom_out</v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click.prevent="move(-10, 0)"
                >
                  <v-icon color="secondary">arrow_left</v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click.prevent="move(10, 0)"
                >
                  <v-icon color="secondary">arrow_right</v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click.prevent="move(0, -10)"
                >
                  <v-icon color="secondary">arrow_drop_up</v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click.prevent="move(0, 10)"
                >
                  <v-icon color="secondary">arrow_drop_down</v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click.prevent="reset"
                >
                  <v-icon color="secondary">undo</v-icon>
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click.prevent="cropImage"
                >
                  preview
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  @click="showFileChooser"
                >
                  upload
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="green"
                  text
                  @click="saveLogo"
                >
                  save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          
        </div>
      </v-toolbar>
      <name-card
        id="banner_profile"
        :cardBgImage="cardBgImage"
        :role="role"
        :name="name"
        :avatar="avatar"
        :dark="dark"
        :mini="!mini"
        :url="'/account-info'"
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
                  <v-list-tile v-else :key="subItem.name" :to="genChildTarget(item, subItem)" :href="subItem.href" :disabled="subItem.disabled" :target="subItem.target" ripple="ripple">
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
    
  </div>
</template>
<script>
/* global session */
import menu from '@/api/menu';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import session from '../helpers/session';
import NameCard from '@/components/widgets/card/NameCard';
import ProfileCard from '@/components/widgets/card/ProfileCard';
import VueCropper from 'vue-cropperjs';
import { update, getLocalCollection } from '../helpers/helpers';
import Mediator from '../Mediator';
import 'cropperjs/dist/cropper.css';
import is from 'is_js';
export default {
  name: 'app-drawer',
  components: {
    VuePerfectScrollbar,
    NameCard,
    ProfileCard,
    VueCropper
  },
  props: {
    expanded: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    imgSrc: '/static/logo.png',
    logo: '/static/logo.png',
    selectedConfId: null,
    editLogo: false,
    mini: false,
    drawer: true,
    menus: menu,
    scrollSettings: {
      maxScrollbarLength: 160
    },
    cardBgImage: '/static/bg/user-panel-bg.png',
    role: '',
    name: '',
    dark: false,
    avatar: {
      src: '',
      size: '36'
    },
    status: is.online() ? 'online' : 'offline'
  }),
  computed: {
    computeGroupActive () {
      return true;
    },
    sideToolbarColor () {
      return this.$vuetify.options.extra.sideNav;
    },

    session () {
      return this.store.state.session;
    },
  },
  watch: {
    session: {
      handler () {
        this.setupUser();
      },
      deep: true
    }
  },
  created () {
    if (session.isOnline()) 
    {
      // on mediator start
      window.getApp.$on('mediator:start', async () => 
      {
        // listen to Mediator data:sync event to capture logo changes
        Mediator.client.on('data:sync', (eventObj) => {
          if (eventObj.success) {
            if (eventObj.action === 'update' || eventObj.action === 'create') {
              if (eventObj.entity === 'ConfigurationPortal') {
                // console.warn(' LOGO UPDATE XXXXXXXXXXXXXXXXXX-------------------->');
                // console.info(eventObj);
                
                this.imgSrc = eventObj.payload.logo;
                this.logo = eventObj.payload.logo;
              }
            }
          }
        });

        // set portal logo from local database. Pick first record of the colection
        let { error, data } = await getLocalCollection('ConfigurationPortal');
        if (data[0])
        {
          // console.info(data[0]);
          this.selectedConfId = data[0]._id;
          if (data[0].logo) this.imgSrc = data[0].logo;
          if (data[0].logo) this.logo = data[0].logo;
          if (data[0].title) document.title = `${data[0].title} - ${document.title}`;
        }
        // end mediator:start app listener
      });


      window.getApp.$on('APP_DRAWER_TOGGLED', () => {
        if (this.$vuetify.breakpoint.smAndDown) {
          this.drawer = (!this.drawer);
          this.mini = false;
        }
        else {
          this.mini = (!this.mini);
        }
      });
    }
  },
  mounted () {


    
    this.setupUser();
    // console.log('APP DRAW');
    window.setTimeout(() => {
      // console.log('----->>>>>>> TOUR', this.session.user);
      if (this.session.user)
      {
        // return;
        if (window.localStorage.getItem('toolbarTour') !== 'ok') return;
        this.$tours['toolbarTour'].start();
        window.localStorage.setItem('toolbarTour', 'ok');
      }
      
    }, 3000);
  },
  methods: {
    setImage (e) {
      const file = e.target.files[0];
      if (file.type.indexOf('image/') === -1) {
        alert('Please select an image file');
        return;
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Sorry, FileReader API not supported');
      }
    },
    showFileChooser () {
      this.editLogo = true;
      this.$refs.input.click();
    },
    cropImage () {
      // get image data for post processing, e.g. upload or setting image src
      this.logo = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    saveLogo () {
      // get image data for post processing, e.g. upload or setting image src
      console.log(this.logo);
      (async () => {
        let r = await update('ConfigurationPortal', { title: 'Demo Portal', logo: this.logo }, this.selectedConfId);
        console.log(r);
      })();
    },
    move (offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY);
    },
    reset () {
      this.$refs.cropper.reset();
    },
    zoom (percent) {
      this.$refs.cropper.relativeZoom(percent);
    },
    setupUser () {
      if (!this.session.user) return;
      // console.log('watched session on Appdrawer', this.session);
      if (this.session.user.avatar) this.avatar.src = this.session.user.avatar;
      if (this.session.user.name) this.name = this.session.user.name;
      if (this.session.user.role) this.role = this.session.user.role;
      if (this.session.user.bgImg) this.cardBgImage = this.session.user.bgImg;
      if (this.session.user.portal_isDark) this.dark = true;
      if (is.online()) 
      {
        this.status = 'online';
      }
      else 
      {
        this.status = 'offline';
      }
    },
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
        // // console.log('IF session user', session);
        let roles = session.user().roles;
        // // console.log('Roles', roles);
        roles.forEach(element => {
          // if (element === 'admin' || item.roles.indexOf(element) > -1 || item.roles[0] === '*') {
          if (item.roles.indexOf(element) > -1 || item.roles[0] === '*') {
            // // console.log(item.title, element, item.roles.indexOf(element));
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
    height: calc(100vh - 180px)
    overflow: auto

#logo .v-toolbar__content{
 padding: 0 0px;
 height 100% !important;
 text-align: center;
}
.cropper-area {
  width: 250px;
  overflow: hidden;
}
</style>
