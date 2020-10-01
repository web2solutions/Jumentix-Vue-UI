<template>
  <div id="EventsRSVP">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-card-title primary-title>
              <h4>April 5, 2019 @ 11:15 am - 02:15 pm</h4>
            </v-card-title>
            <vue-perfect-scrollbar class="perfect--scrollbar">
              <v-card-text>
                <v-container>
                  <v-flex xs12>
                    <img src="/static/rsvp.png" width="100%" alt="">
                  </v-flex>

                  <v-flex xs12>
                    <p><b>This event is demo for Event Tickets, a free ticketing plugin you can downoad to use with or without the Events Calendar</b><br>
                    Event Tickets allow you to collect RSVPs and sell basic tickets from a event. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere, sapien vitae dapibus vehicula, justo dui blandit lorem. <br><br>
                        <i>This event is just an exemple, and the tickets below are not real.</i>
                    </p>
                  </v-flex>

                  <v-flex xs12>
                    <v-btn color="primary">+ GOOGLE CALENDAR</v-btn>
                    <v-btn color="primary">+ ICAL EXPORT</v-btn>
                  </v-flex>

                  <v-flex xs12>
                    <v-card>
                      <v-card-title primary-title>
                        <h3>RSVP</h3>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-layout row wrap>
                            <v-flex xs3>
                              <v-select
                                :items="qntTickets"
                                label="Number of tickets"
                                v-model="qtdValue1"
                              ></v-select>
                            </v-flex>

                            <v-flex xs3 py-4>
                              <span><b>RSVP</b></span>  
                            </v-flex>

                            <v-flex xs3 py-4>
                              <span>Let us know if you're attending!</span>  
                            </v-flex>

                            <v-flex xs3>
                              <v-btn @click="buynow1">Confirm</v-btn> 
                            </v-flex>

                            <v-flex xs12 v-if="btnBuyNow1">
                              <template v-for="n in Number(qtdValue1)">
                                  <v-flex xs12 md4 row :key="n + '-name'">
                                    <v-text-field
                                      name="name"
                                      :label="'Full Name ' + n"
                                      id="id"
                                    ></v-text-field>
                                  </v-flex>
                                  <v-flex xs12 md4 row :key="n + '-email'">
                                    <v-text-field
                                      name="email"
                                      :label="'Email ' + n"
                                      id="id"
                                    ></v-text-field>
                                  </v-flex>
                              </template>
                              <v-flex xs12 md4 row>
                                <v-btn>CONFIRM RSVP</v-btn>
                              </v-flex>
                            </v-flex>
                          </v-layout>
                        </v-container>
                        
                      </v-card-text>
                    </v-card>
                  </v-flex>

                  <v-flex xs12>
                    <v-card>
                      <v-card-text>
                        <v-container>
                          <v-layout row wrap>
                            <v-flex xs12 md4>
                              <h4><b>Details</b></h4>
                              <p>
                                <b>Date & Time:</b><br>
                                November 5, 2024 / 11:15 am - 02:15 pm <br>
                                <b>Coast: $8</b><br>
                                <b>Event Category:</b> Learning<br>
                                <b>Website:</b> https://google.com
                              </p>
                            </v-flex>
                            <v-flex xs12 md4>
                              <h4><b>Organizer</b></h4>
                              <p>
                                The Events Calender Team<br>
                                <b>Phone:</b> 0819536325<br>
                                <b>Email:</b> mailto@mail.com<br>
                                <b>Website:</b> https://google.com<br>
                              </p>
                            </v-flex>
                            <v-flex xs12 md4>
                              <h4><b>Other</b></h4>
                              <p>
                                <b>Tickets:</b><br> 
                                This event is demo for RSVP, ticketing screen you can downoad to use with<br>
                                <b>Download Event Ticket</b><br>
                                https://google.com<br>
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
import EventsRSVP from './EventsRSVP.vm.js';
export default EventsRSVP;
</script>
<style scoped lang="css">

</style>
