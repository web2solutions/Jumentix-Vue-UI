<template>
  <div id="pageDashboard">
    <v-container grid-list-xl fluid>
      <v-layout row wrap 
        v-sortable-card
        @sorted="cardSortOccurred">
        <v-flex lg4 sm6 xs12 v-if="session.user.role !== 'parent'">
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 8 : 1}`"
              :dark="$vuetify.dark"  
            >
              <v-card-title class="sortHandle pb-0">
                <div class="layout row ma-0 justify-space-between pb-1">
                  <h4>Announcements</h4>
                  <div class="icon">
                    <v-icon>announcement</v-icon>
                  </div>
                </div>
              </v-card-title>
              <v-card-text>
                <vue-perfect-scrollbar class="announcements-content">
                  <v-list two-line>
                    <v-list-tile
                      v-for="msg in announcements"
                      :key="msg.uuid"
                      avatar

                      v-ripple
                    >
                      <v-list-tile-avatar>
                        <div :id="'announcement_commander_' + msg.from.user_id + '_' + msg.uuid">
                          {{ getUserAvatar( msg.from.user_id, 'announcement_avatar_' + msg.from.user_id + '_' + msg.uuid, 'announcement_commander_' + msg.from.user_id + '_' + msg.uuid) }}
                        </div>
                        <img :id="'announcement_avatar_' + msg.from.user_id + '_' + msg.uuid">
                      </v-list-tile-avatar>

                      <v-list-tile-content>
                        <v-list-tile-title>{{ msg.from.name }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ msg.data.message.slice(0, 40) }}</v-list-tile-sub-title>
                        <v-list-tile-sub-title>{{moment.tz((new Date(msg.createdAt)).toISOString(), moment.tz.guess()).fromNow()}}</v-list-tile-sub-title>
                      </v-list-tile-content>

                      <v-list-tile-action>
                          <v-icon color="grey lighten-1">{{(msg.data.message).indexOf('Merge') > -1 ? 'star' : 'star_border'}}</v-icon>
                      </v-list-tile-action>
                    </v-list-tile> 
                  </v-list>
                </vue-perfect-scrollbar>
                
              </v-card-text>
              <v-card-actions>
                <v-btn flat color="primary" dense @click="annoucementSender">
                  <v-icon left>record_voice_over</v-icon>
                  <span>Send Annoucement</span>

                   
                </v-btn>
              </v-card-actions>            
            </v-card>
          </v-hover>
        </v-flex>
        
        <v-flex lg4 sm6 xs12>
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 8 : 1}`"
              :dark="$vuetify.dark"
            >
              <v-card-title class="sortHandle pb-0">
                <div class="layout row ma-0 justify-space-between pb-1">
                  <h4>Messages</h4>
                  <div class="icon">
                    <v-icon>mail_outline</v-icon>
                  </div>
                </div>
              </v-card-title>
              <v-card-text>
                <div class="loading-overlay" v-if="loadingMessages" dark>
                  <v-progress-circular :size="50" color="primary" indeterminate ></v-progress-circular>
                </div>
                 <p class="pt-5">You have no new messages</p>
              </v-card-text>
              <v-card-actions>
                
              </v-card-actions>            
            </v-card>
          </v-hover>
        </v-flex>
        
        <v-flex lg4 sm6 xs12>
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 8 : 1}`"
              :dark="$vuetify.dark"
            >
              <v-card-title class="sortHandle pb-0">
                <div class="layout row ma-0 justify-space-between pb-1">
                  <h4>Finance</h4>
                  <div class="icon">
                    <v-icon>local_atm</v-icon>
                  </div>
                </div>
              </v-card-title>
              <v-card-text>
                <h2 class="display-4 green--text lighten-5 mt-3">3</h2>
                <p>New Invoices</p>
              </v-card-text>
              <v-card-actions>
                <v-btn flat color="primary" dense to="/invoices">
                  <v-icon left>account_balance_wallet</v-icon>
                  <span>PAY INVOICES</span>
                </v-btn>
              </v-card-actions>            
            </v-card>
          </v-hover>
        </v-flex>
        
        <v-flex lg4 sm6 xs12 v-if="session.user.role !== 'parent'">
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 8 : 1}`"
              :dark="$vuetify.dark"
            >
              <v-card-title class="sortHandle pb-0">
                <div class="layout row ma-0 justify-space-between pb-1">
                  <h4>Get Help</h4>
                  <div class="icon">
                    <v-icon>far fa-life-ring</v-icon>
                  </div>
                </div>
              </v-card-title>
              <v-card-text>
                <p class="pt-5">Get help when you need it from either the portal or your agency</p>
              </v-card-text>
              <v-card-actions>
                <v-btn flat color="primary" dense>
                  <v-icon left>contact_support</v-icon>
                  <span>SUBMIT A TICKET</span>
                </v-btn>
              </v-card-actions>            
            </v-card>
          </v-hover>
        </v-flex>
        
        <v-flex lg4 sm6 xs12 v-if="session.user.role !== 'parent'">
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 8 : 1}`"
              :dark="$vuetify.dark"
            >
              <v-card-title class="sortHandle pb-0">
                <div class="layout row ma-0 justify-space-between pb-1">
                  <h4>Contact Searches</h4>
                  <div class="icon">
                    <v-icon>youtube_searched_for</v-icon>
                  </div>
                </div>
              </v-card-title>
              <v-card-text>
                <vue-perfect-scrollbar class="announcements-content">
                <v-list
                  v-sortable-list
                  @sorted="objectSortOccurred"
                  class="mx-0 px-0"
                >
                  <v-list-tile
                    v-for="item in searchesContactList"
                    :key="item.id"
                    avatar
                    to="/"
                    v-ripple
                  >
                    <v-list-tile-action class="sortHandle">
                      <v-icon style="cursor: row-resize">
                        drag_handle
                      </v-icon>
                    </v-list-tile-action>
                    <v-list-tile-avatar size="24">
                      <img :src="'../../' + item.file[0].webPath" width="24px">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title class="subheading">{{ item.name }}</v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action class="d-block">
                      <v-btn flat icon color="primary" :to="{ name: 'Contact', params: { query: item.settings }}">
                        <v-icon>directions_run</v-icon>
                      </v-btn>
                      <v-btn flat icon color="red" @click="deleteSearch(item)">
                        <v-icon>delete_sweep</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
                </vue-perfect-scrollbar>
              </v-card-text>
              <v-card-actions>
                <v-btn flat small></v-btn>
              </v-card-actions>            
            </v-card>
          </v-hover>
        </v-flex>
        
        <v-flex lg4 sm6 xs12 v-if="session.user.role !== 'parent'">
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 8 : 1}`"
              :dark="$vuetify.dark"
            >
              <v-card-title class="sortHandle pb-0">
                <div class="layout row ma-0 justify-space-between pb-1">
                  <h4>Cases Searches</h4>
                  <div class="icon">
                    <v-icon>youtube_searched_for</v-icon>
                  </div>
                </div>
              </v-card-title>
              <v-card-text>
                <vue-perfect-scrollbar class="announcements-content">
                <v-list
                  v-sortable-list
                  @sorted="objectSortOccurred"
                  class="mx-0 px-0"
                >
                  <v-list-tile
                    v-for="item in searchesCaseList"
                    :key="item.id"
                    avatar
                    to="/"
                    v-ripple
                  >
                    <v-list-tile-action class="sortHandle">
                      <v-icon style="cursor: row-resize">
                        drag_handle
                      </v-icon>
                    </v-list-tile-action>
                    <v-list-tile-avatar size="24">
                      <img :src="'../../' + item.file[0].webPath" width="24px">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title class="subheading">{{ item.name }}</v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action class="d-block">
                      <v-btn flat icon color="primary" :to="{ name: 'Cases', params: { query: item.settings }}">
                        <v-icon>directions_run</v-icon>
                      </v-btn>
                      <v-btn flat icon color="red" @click="deleteSearch(item)">
                        <v-icon>delete_sweep</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
                </vue-perfect-scrollbar>
              </v-card-text>
              <v-card-actions>
                <v-btn flat small></v-btn>
              </v-card-actions>            
            </v-card>
          </v-hover>
        </v-flex>
        
        <v-flex lg4 sm6 xs12>
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 8 : 1}`"
              :dark="$vuetify.dark"
            >
              <v-card-title class="sortHandle pb-0">
                <div class="layout row ma-0 justify-space-between pb-1">
                  <h4>Task</h4>
                  <div class="icon">
                    <v-icon>list</v-icon>
                  </div>
                </div>
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-tile
                    v-for="item in tasks"
                    :key="item.title"
                    avatar
                    v-ripple
                  >
                    <v-list-tile-content>
                       <v-chip :color="item.color" dark label>
                        <v-avatar>
                          <v-icon small>{{item.icon}}</v-icon>
                        </v-avatar>
                        {{item.title}}:  {{item.total}}
                      </v-chip>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-btn flat color="primary" dense to="/tasks">
                  <v-icon left>format_list_bulleted</v-icon>
                  <span>VIEW TASKS</span>
                </v-btn>
              </v-card-actions>            
            </v-card>
          </v-hover>
        </v-flex>
        
        <v-flex lg4 sm6 xs12 v-if="session.user.role !== 'parent'">
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 8 : 1}`"
              :dark="$vuetify.dark"
            >
              <v-card-title class="sortHandle pb-0">
                <div class="layout row ma-0 justify-space-between pb-1">
                  <h4>Upcoming Events</h4>
                  <div class="icon">
                    <v-icon>fas fa-chalkboard-teacher</v-icon>
                  </div>
                </div>
              </v-card-title>
              <v-card-text>
                <v-list three-line>
                  <v-list-tile
                    v-for="item in events"
                    :key="item.title"
                    avatar
                    v-ripple
                  >
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                      <v-list-tile-sub-title>{{ item.date }}</v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action class="row d-inline">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn class="ml-1" icon ripple v-on="on" :to="'/events-view/' + item._id">
                            <v-icon color="grey lighten-1">pageview</v-icon>
                          </v-btn>
                        </template>
                        <span>View</span>
                      </v-tooltip>

                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn class="ml-1" icon ripple v-on="on" :to="'/events-purchase/' + item._id">
                            <v-icon color="blue lighten-1">add_shopping_cart</v-icon>
                          </v-btn>
                        </template>
                        <span>Purchase</span>
                      </v-tooltip>

                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn class="ml-1" icon ripple v-on="on" :to="'/events-rsvp/' + item._id">
                            <v-icon color="green lighten-1">check</v-icon>
                          </v-btn>
                        </template>
                        <span>RSVP</span>
                      </v-tooltip>

                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-btn flat color="primary" dense to="/training-events">
                  <v-icon left>event</v-icon>
                  <span>VIEW ALL EVENTS</span>
                </v-btn>
              </v-card-actions>            
            </v-card>
          </v-hover>
        </v-flex>

      </v-layout>
    </v-container>
  </div>
</template>

<script>
/* global $ */
/* eslint-disable */
import Vue from 'vue';
import API from '@/api';
import Material from 'vuetify/es5/util/colors';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import Sortable from 'sortablejs';
import Mediator from '../Mediator';
import moment from 'moment-timezone';
import { getFromApi,  getOnLocalCollection } from '../helpers/helpers';
export default {
  components: {
    VuePerfectScrollbar
  },
  data: () => ({
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 1000, // -1 for All
      totalItems: 0
    },
    loadingMessages: true,
    color: Material,
    //announcements: [],
    cardSort: [],
    tasks: [
      { title: 'Tasks requiring attention', icon: 'warning', color: 'red', total: 5 },
      { title: 'Tasks submitted', icon: 'send', color: 'primary', total: 10 },
      { title: 'Tasks in progress', icon: 'query_builder', color: 'active', total: 4 }
    ],
    events: [],
    searchesContactList: [],
    searchesCaseList: []
  }),
  computed: {
    session () {
      return this.store.state.session;
    },
    announcements () {
      return this.store.state.announcements;
    },
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
  directives: {
    sortableList: {
      bind(el, binding, vnode) {
        //console.log(el, vnode);
        const options = {
          handle: ".sortHandle",
          animation: 150,
          onUpdate: function(event) {
            vnode.child.$emit("sorted", event);
          },
        };
        Sortable.create(el, options);
      },
    },
    sortableCard: {
      bind(el, binding, vnode) {
        // console.log(el, vnode);
        let sortableElement = el.getElementsByTagName("tbody")[0];
        const options = {
          handle: ".sortHandle",
          animation: 150,
          onUpdate: function(event) {
            //vnode.child.$emit("sorted", event);
          },
        };
        Sortable.create(el, options);
      },
    }
  },
  watch: {
      announcements: {
        handler () {
          console.log('->>>>>>>>>>>>>> announcements was changed', this.announcements)
        },
        deep: true
      }
    },
  methods:{
    objectSortOccurred({ oldIndex, newIndex }) {
      const contact = this.searchesContactList.splice(oldIndex, 1)[0];
      this.searchesContactList.splice(newIndex, 0, contact);
      const moved = this.searchesCaseList.splice(oldIndex, 1)[0];
      this.searchesContactList.splice(newIndex, 0, moved);
      console.log(this.searchesContactList)
    },
    annoucementSender () {
      Mediator.client.annoucementSender();
    },
    cardSortOccurred({ oldIndex, newIndex }) {
      const moved = this.cardSort.splice(oldIndex, 1)[0];
      this.cardSort.splice(newIndex, 0, moved);
    },
    getUserAvatar(user_id, img_id, commander_id) {
      (async function(){
        let rU = await getOnLocalCollection('User', user_id)
        let user = rU.data
        console.log(user)
        document.getElementById(img_id).src = user.avatar
        document.getElementById(commander_id).innerHTML = '';
        //return user.avatar || 'none'
      })()
    },
    loadEvents() {
      (async () => {
        console.log(this.session.user.timezone);
        let data = (await Mediator.client.store.models.Event.getAll()).filter( d => {
          if (d.deleted === true) return false;
          if (d.cancel === true) return false;
          if (d.close === true) return false;
          if (!d.visible_to_public) return false;
          return true;
        } ).map(d => {
          let dt = `
            ${moment.tz(d.startDate, this.session.user.timezone).format('llll')}
             / ${moment.tz(d.endDate, this.session.user.timezone).format('llll')}
             - ${moment.tz(d.startDate, this.session.user.timezone).fromNow()}
          `;
          return { title: d.name, date: dt, _id: d._id, startDate: d.startDate  }
        }).sort((date1, date2) => {
          let dt1 = (new Date(moment.tz(date1.startDate, this.session.user.timezone)._d)).getTime();
          let dt2 = (new Date(moment.tz(date2.startDate, this.session.user.timezone)._d)).getTime();
          //console.log(dt1, dt2);
          if (dt1 > dt2) return 1;
          if (dt1 < dt2) return -1;
          return 0;
        });
        //console.log(data);
        this.events = data;
      })();

      
    },
  
    async feedItems (entity) {
        let { data, total, error } = await getFromApi(entity, this, false, false);
        /* let data = (await Mediator.client.store.models[entity].getAll()).filter( d => {
          if (d.deleted === true) return false;
          return true;
        }); */

        if (data.length > 0) {
          switch (entity) {
            case 'SearchClient':
              data = data.filter(d => {
                if (d.deleted === true || session.user().id !== d.createdBy) return false;
                return true;
              });
              this.searchesContactList = data;
              break;
            case 'SearchCase':
              data = data.filter(d => {
                if (d.deleted === true || session.user().id !== d.createdBy) return false;
                return true;
              });
              this.searchesCaseList = data;
              break;
            default :
              break;
          }
        }
        

    },
    async deleteSearch (item) {
      Swal.fire({
        title: 'Delete item?',
        text: 'You will be able to restore this record anyway!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete it!',
        backdrop: `
            rgba(0,0,123,0.4)
            url("./static/nyan-cat.gif")
            center left
            no-repeat
          `
      }).then(async (result) => {
        if (result.value) {
          let self = this;
          self.entity = 'SearchClient';
          console.log(self, item);
          await deleteItem(self, item);
          this.feedItems('SearchClient');
          Swal.fire(
            'Deleted!',
            'Your record has been deleted.',
            'success'
          );
        }
      });
    }
  },
  created: function () {
    let self = this;
    this.bus = new Vue();

    


    

  },
  mounted () {
    let self = this


    setTimeout(function () { 
          self.loadingMessages = false;
    }, 3000);

   // self.load_messages(function() {
        //console.log("load messages", self.$store.state.modules.Messages.inbox_messages)
    //})

    this.loadEvents();

    this.feedItems('SearchClient');
    this.feedItems('SearchCase');
  },
  components: {
    VuePerfectScrollbar
  }

};
</script>

<style scoped lang="css">
.announcements-content{
  height: 230px;
}
.v-list__tile__action.sortHandle{
  display: contents !important;
}
.v-list__tile__action{
  position: absolute;
  right: 0px;
}
.v-card__title.sortHandle{
  cursor: move;
}
.v-card__text {
  max-height: 280px;
  height: 275px;
  text-align: center;
  position: relative;
}
.v-card__actions{
  display: block !important;
  text-align: center;
  height: 52px;
}
.loading-overlay {
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>
