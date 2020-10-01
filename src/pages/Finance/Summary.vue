<template>
  <v-container id="Summary">
    <component-menu-nav></component-menu-nav>
    <v-container fluid class="ma-0 pa-0">
      <v-layout row>
        <v-flex xs12>
          <v-card>
            <vue-perfect-scrollbar class="invoice--scrollbar">
              <v-card-text>
                <v-container grid-list-xl>
                  <v-layout row wrap>
                    <v-flex xs12 md7>
                      <v-card color="blue lighten-5">
                        <v-card-text>
                          <v-layout row wrap>
                            <v-flex xs6>
                              <h5>OUTSTANDING INVOICES</h5>
                              <h2 class="primary--text font-weight-bold">${{ invoiceAmount }}</h2>
                              <v-btn v-if="invoiceAmount !== 0" dark color="red" :to="'/invoices-client/'+customerID" >Pay Now</v-btn>
                              <span v-if="invoiceAmount === 0" >No pending invoice</span>
                            </v-flex>
                            <v-flex xs6>
                              <h5>AVALIABLE CREDIT</h5>
                              <h2 class="green--text font-weight-bold">$0.00</h2>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-flex xs12 md5>
                      <v-card>
                        <v-card-text>
                          <v-layout row wrap>
                            <v-flex xs12>
                              <h5>LAST PAYMENT MADE</h5>
                              <h2 class="primary--text font-weight-bold">${{ lastInvoiceAmount }}</h2>
                              <span mt-1 v-if="lastInvoiceAmount !== 0">
                                paid for
                                <router-link :to="'/invoice/'+lastInvoiceID">INV-{{ lastInvoiceNumber }}</router-link>,
                                <br>{{ lastInvoiceDate }}.
                              </span>
                              <span v-if="lastInvoiceAmount === 0">No invoice Paid</span>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap mt-3 text-xs-center text-md-left>
                    <v-flex xs12>
                      <h3>Contact Detaiils of WEB2 SOLUTIONS LLC</h3>
                      <v-layout mt-3 row wrap>
                        <v-flex xs12 md3>
                          <img
                            src="http://res.cloudinary.com/hrscywv4p/image/upload/c_limit,fl_lossy,h_1440,w_120,f_auto,q_auto/v1/774802/CAIRS_Logo_fin_knw2eu.png"
                          >
                        </v-flex>
                        <v-flex xs12 md4>
                          <strong>WEB2 SOLUTIONS LLC</strong>
                          <br>11125 Park Blvd Ste 104-136
                          <br>Seminole, FL 33772
                          <br>
                        </v-flex>
                        <v-flex xs12 md5>
                          <div>
                            <v-icon>person</v-icon> <b>{{ customer.name }}</b>
                          </div>
                          <div>
                            <v-icon>smartphone</v-icon> 727-914-5945
                          </div>
                          <div v-for="item in customer.email" :key="item._id">
                            <v-icon>email</v-icon> {{ item.email }} - ({{ item.type }})
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
            </vue-perfect-scrollbar>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import Summary from './Summary.vm.js';
export default Summary;
</script>

<style scoped>
.v-card__text {
  min-height: 160px;
}
</style>
