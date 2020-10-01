<template>
  <div id="EventsPurchase">
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
                    <img src="/static/study.jpg" width="100%" alt="">
                  </v-flex>

                  <v-flex xs12>
                    <h3>Overview</h3>
                    <p>This event is demo for Event Tickets, a free ticketing plugin you can downoad to use with or without the Events Calender Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere, sapien vitae dapibus vehicula, justo dui blandit lorem, in finibus nibh magna nec nisi. Donec commodo nisi a nisl consectetur pharetra. Aenean sollicitudin, nisi quis condimentum varius, urna justo auctor quam, vel sodales justo elit nec neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque lobortis lorem eu quam volutpat auctor. Duis dignissim, odio sollicitudin cursus faucibus, lectus ante fermentum nibh, quis scelerisque tellus purus vel mauris. Praesent pulvinar ante a risus vehicula, at venenatis lectus tincidunt. Etiam tempor vitae augue vel sagittis. Vestibulum quis ultricies magna. Vivamus posuere, sapien vitae dapibus vehicula, justo dui blandit lorem, in finibus nibh magna nec nisi. Donec commodo nisi a nisl consectetur pharetra. Aenean sollicitudin, nisi quis condimentum varius, urna justo auctor quam, ante a risus vehicula, at venenatis lectus tincidunt. Etiam tempor vitae augue vel sagittis. Vestibulum quis ultricies magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere, sapien vitae dapibus vehicula, justo dui blandit lorem, in finibus nibh magna nec nisi. Donec commodo nisi a nisl consectetur pharetra. Aenean sollicitudin, nisi quis condimentum varius, urna justo auctor quam, vel sodales justo elit nec neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque lobortis lorem eu quam volutpat auctor. Duis dignissim, odio sollicitudin cursus faucibus, lectus ante fermentum nibh, quis scelerisque tellus purus vel mauris. Praesent pulvinar ante a risus vehicula, at venenatis lectus tincidunt. Etiam tempor vitae augue vel sagittis. Vestibulum quis ultricies magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere, sapien vitae dapibus vehicula, justo dui blandit lorem, in finibus nibh magna nec nisi. Donec commodo nisi a nisl consectetur pharetra. Aenean sollicitudin, nisi quis condimentum varius, urna justo auctor quam, vel sodales justo elit nec neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque lobortis lorem eu quam volutpat auctor. Duis dignissim, odio sollicitudin cursus faucibus, lectus ante fermentum nibh, quis scelerisque tellus purus vel mauris. Praesent pulvinar ante a risus vehicula, at venenatis lectus tincidunt. Etiam tempor vitae augue vel sagittis. Vestibulum quis ultricies magna.</p>
                  </v-flex>

                  <v-flex xs12>
                    <v-btn color="primary">+ GOOGLE CALENDAR</v-btn>
                    <v-btn color="primary">+ ICAL EXPORT</v-btn>
                  </v-flex>

                  <v-flex xs12>
                    <v-card>
                      <v-card-title primary-title>
                        <h3>Tickets:</h3>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-layout row wrap>
                            <v-flex xs3>
                              <v-select
                                :items="qntTickets"
                                v-model="qtdValue1"
                                label="Number of tickets"
                              ></v-select>
                            </v-flex>

                            <v-flex xs3>
                              <h4><b>Royal Member</b></h4>  
                            </v-flex>

                            <v-flex xs3>
                              <h4>Royal Member</h4>  
                            </v-flex>


                            <v-flex xs3>
                              <v-btn @click="buynow1">Buy Now</v-btn> 
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
                                <v-btn>PURCHASE</v-btn>
                              </v-flex>
                            </v-flex>
                            <v-flex xs3>
                              <v-select
                                :items="qntTickets"
                                v-model="qtdValue2"
                                label="Number of tickets"
                              ></v-select>
                            </v-flex>

                            <v-flex xs3>
                              <h4><b>Club Member</b></h4>  
                            </v-flex>

                            <v-flex xs3>
                              <h4>Club Member</h4>  
                            </v-flex>


                            <v-flex xs3>
                              <v-btn @click="buynow2">Buy Now</v-btn> 
                            </v-flex>

                            <v-flex xs12 v-if="btnBuyNow2">
                              <div> 
                                <v-flex xs12 md4 row>
                                  <v-text-field
                                    name="name"
                                    label="Full Name1:"
                                    id="id"
                                  ></v-text-field>
                                </v-flex>
                                <v-flex xs12 md4 row>
                                  <v-text-field
                                    name="name"
                                    label="Full Name2:"
                                    id="id"
                                  ></v-text-field>
                                </v-flex>
                                <v-flex xs12 md4 row>
                                  <v-text-field
                                    name="name"
                                    label="Email:"
                                    id="id"
                                  ></v-text-field>
                                </v-flex>
                                <v-flex xs12 md4 row>
                                  <v-btn>PURCHASE</v-btn>
                                </v-flex>
                              </div>
                            </v-flex>

                            <v-flex xs3>
                              <v-select
                                :items="qntTickets"
                                v-model="qtdValue3"
                                label="Number of tickets"
                              ></v-select>
                            </v-flex>

                            <v-flex xs3>
                              <h4><b>Non Member</b></h4>  
                            </v-flex>

                            <v-flex xs3>
                              <h4>Non Member</h4>  
                            </v-flex>


                            <v-flex xs3>
                              <v-btn @click="buynow3">Buy Now</v-btn> 
                            </v-flex>

                            <v-flex xs12 v-if="btnBuyNow3">
                              <div> 
                                <v-flex xs12 md4 row>
                                  <v-text-field
                                    name="name"
                                    label="Full Name1:"
                                    id="id"
                                  ></v-text-field>
                                </v-flex>
                                <v-flex xs12 md4 row>
                                  <v-text-field
                                    name="name"
                                    label="Full Name2:"
                                    id="id"
                                  ></v-text-field>
                                </v-flex>
                                <v-flex xs12 md4 row>
                                  <v-text-field
                                    name="name"
                                    label="Email:"
                                    id="id"
                                  ></v-text-field>
                                </v-flex>
                                <v-flex xs12 md4 row>
                                  <v-btn>PURCHASE</v-btn>
                                </v-flex>
                              </div>
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
                                <b>Date & Time:</b><br>
                                The Events Calender Team<br>
                                <b>Phone:</b> 0819536325<br>
                                <b>Email:</b> mailto@mail.com<br>
                                <b>Website:</b> https://google.com<br>
                                <b>Seats Available:</b><br>
                                Royal Member - 10<br> 
                                Club Member - 15<br> 
                                Non Member - 20<br> 
                                Non Member - 20<br>
                              </p>
                            </v-flex>
                            <v-flex xs12 md4>
                              <h4><b>Other</b></h4>
                              <p>
                                <b>Tickets:</b> Lorem ipsum dolor sit amet, consectetur adipiscing<br>
                                <b>Download:</b> https://google.com<br>
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
import EventsPurchase from './EventsPurchase.vm.js';
export default EventsPurchase;
</script>
<style scoped lang="css">

</style>
