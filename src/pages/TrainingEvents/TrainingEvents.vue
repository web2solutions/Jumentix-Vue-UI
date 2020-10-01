<template>
  <div id="TrainingEvents">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <vue-perfect-scrollbar class="perfect--scrollbar">
              <v-card-text>
                <v-container px-0>
                  <v-layout row wrap>
                    <v-flex xs12 md3>
                     <v-menu
                        ref="startMenu"
                        v-model="startMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="start"
                        transition="scale-transition"
                        min-width="290px"
                        lazy
                        offset-y
                        full-width
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="start"
                            label="EVENTS IN:"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="start"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            flat
                            color="primary"
                            @click="startMenu = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            flat
                            color="primary"
                            @click="$refs.startMenu.save(start)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>

                    <v-flex xs12 md3>
                      <v-text-field
                        label="SEARCH:"
                        placeholder="Type your search"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 md3>
                      <v-text-field
                        label="NEAR:"
                        placeholder="Location"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md3>
                      <v-btn color="primary">Find Event</v-btn>
                    </v-flex>
                  </v-layout>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-toolbar dense color="transparent" class="elevation-0">
                        <v-btn small>Today</v-btn>
                        <v-btn small @click="$refs.calendar.prev()">
                          <v-icon
                            dark
                          >
                            keyboard_arrow_left
                          </v-icon>
                        </v-btn>
                        <v-btn small @click="$refs.calendar.next()">
                          <v-icon
                            dark
                          >
                            keyboard_arrow_right
                          </v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn-toggle v-model="type">
                          <v-btn flat value="day">
                            Day
                          </v-btn>
                          <v-btn flat value="week">
                            Week
                          </v-btn>
                          <v-btn flat value="month">
                            Month
                          </v-btn>
                          <v-btn flat value="map">
                            map
                          </v-btn>
                        </v-btn-toggle>
                      </v-toolbar>
                    </v-flex>
                    <v-flex
                      xs12
                      class="mb-3"
                    >
                      <v-sheet height="450">
                        <v-calendar
                          ref="calendar"
                          v-model="start"
                          :start="start"
                          :type="type"
                          :end="end"
                          color="primary"
                        >
                        <template v-slot:day="{ date }">
                          <template v-for="event in eventsMap[date]">
                            <v-menu
                              :key="event.title"
                              v-model="event.open"
                              full-width
                              offset-x
                            >
                              <template v-slot:activator="{ on }">
                                <div
                                  v-if="!event.time"
                                  v-ripple
                                  class="my-event"
                                  v-on="on"
                                  v-html="event.title"
                                ></div>
                              </template>
                              <v-card
                                color="grey lighten-4"
                                min-width="350px"
                                flat
                              >
                                <v-toolbar
                                  color="primary"
                                  dark
                                >
                                  <v-btn icon>
                                    <v-icon>edit</v-icon>
                                  </v-btn>
                                  <v-toolbar-title v-html="event.title"></v-toolbar-title>
                                  <v-spacer></v-spacer>
                                  <v-btn icon>
                                    <v-icon>favorite</v-icon>
                                  </v-btn>
                                  <v-btn icon>
                                    <v-icon>more_vert</v-icon>
                                  </v-btn>
                                </v-toolbar>
                                <v-card-title primary-title>
                                  <span v-html="event.details"></span>
                                </v-card-title>
                                <v-card-actions>
                                  <v-btn
                                    flat
                                    color="primary"
                                    to="/events-view"
                                  ><v-icon left>pageview</v-icon>
                                    View
                                  </v-btn>
                                  <v-btn
                                    flat
                                    to="/events-purchase"
                                  >
                                  <v-icon left>add_shopping_cart</v-icon>
                                    Purchase
                                  </v-btn>
                                  <v-btn
                                    flat
                                    to="/events-rsvp"
                                  >
                                  <v-icon left>check</v-icon>
                                    RSVP
                                  </v-btn>
                                  <v-btn
                                    flat
                                    color="red"
                                    dark
                                  >
                                    Cancel
                                  </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-menu>
                          </template>
                        </template>
                        </v-calendar>
                      </v-sheet>
                    </v-flex>
                  </v-layout>
                  
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
import TrainingEvents from './TrainingEvents.vm.js';
export default TrainingEvents;
</script>
<style lang="stylus" scoped>

.perfect--scrollbar {
  height: calc(100vh - 140px) !important;
}
  .my-event {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 2px;
    background-color: #1867c0;
    color: #ffffff;
    border: 1px solid #1867c0;
    width: 100%;
    font-size: 12px;
    padding: 3px;
    cursor: pointer;
    margin-bottom: 1px;
  }
</style>
