<template>
  <div id="EventsView">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-card-title primary-title class="d-block">
              <h4>{{ events.name }}</h4>
              <span >
                {{moment.tz(events.startDate, this.session.user.timezone).format('llll')}}
                {{moment.tz(events.endDate, this.session.user.timezone).format('llll')}}
                {{moment.tz(events.startDate, this.session.user.timezone).fromNow()}}
              </span>
            </v-card-title>
            <vue-perfect-scrollbar class="perfect--scrollbar">
              <v-card-text>
                <v-container>
                  <v-flex xs12>
                    <img width="100%" v-bind:src="events.banner" alt="">
                  </v-flex>

                  <v-flex xs12>
                    <h3>Overview</h3>
                    <p v-html="events.description"></p>
                  </v-flex>

                  <v-flex xs12>
                    <v-btn color="primary">+ GOOGLE CALENDAR</v-btn>
                    <v-btn color="primary">+ ICAL EXPORT</v-btn>
                  </v-flex>

                  <v-flex xs12>
                    <v-card class="blue-grey lighten-5" >
                      <v-card-text>
                        <v-container>
                          <v-layout row wrap>
                            <v-flex xs12 md6>
                              <h4><b>Details</b></h4>
                              <p>
                                <b>Date & Time:</b><br>
                                {{moment.tz(events.startDate, this.session.user.timezone).format('llll')}} / {{moment.tz(events.endDate, this.session.user.timezone).format('llll')}}. <br>
                                Starts {{moment.tz(events.startDate, this.session.user.timezone).fromNow()}}<br><br>
                                <b>Cost: ${{parseFloat(events.price).toFixed(2)}}</b><br>
                              </p>
                              <p id="event_category_label">
                                <b>Event Category:</b> {{events.category}}<br>
                              </p>
                              <p id="event_sub_category_label">
                                <b>Event Sub Category:</b> {{events.sub_category}}<br>
                              </p>
                            </v-flex>
                            <v-flex xs12 md4>
                              <p>
                                <b>Location:</b> {{events.location}}<br>
                              </p>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-text>
                    </v-card>
                    
                  </v-flex>
                  
                </v-container>
              </v-card-text>
            </vue-perfect-scrollbar>  
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import EventsView from './EventsView.vm.js';
export default EventsView;
</script>
<style scoped lang="css">

</style>
