<template>
  <v-container id="Statements">
    <component-menu-nav></component-menu-nav>
    <v-container fluid class="ma-0 pa-0">
      <v-layout row>
        <v-flex>
          <v-card>
            <v-card-title class="pb-0">
              <v-layout row justify-space-between wrap>
              <v-flex xs3>
                <v-select
                  :items="ranger_filter"
                  prepend-icon="calendar_today"
                  label="Date Range"
                ></v-select>
              </v-flex>
              <v-flex xs3 class="text-xs-right">
                <v-btn color="red" dark>
                  <v-icon class="pr-2 subheading">fa-file-pdf</v-icon>
                  <span> Download</span>
                </v-btn>
                 <v-btn flat icon>
                  <v-icon>print</v-icon>
                </v-btn>
              </v-flex>
              </v-layout>
            </v-card-title>
            <vue-perfect-scrollbar class="statement--scrollbar">
              <v-card-text>
                <v-container fluid grid-list-xl>
                  <v-layout class="header-statement" row justify-space-between>
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
                  </v-layout>

                  <v-layout row justify-space-between wrap mt-4> 
                    <v-flex xs12 md4>
                      <div class="to">
                        <h3 class="font-weight-medium">To</h3>
                        <h4>Test Company</h4>
                      </div>

                    </v-flex>
                    <v-flex xs12 md5>
                      <h4 class="font-weight-regular display-1 text-xs-center">Statement of Accounts</h4>
                      <h5 class="font-weight-regular text-xs-center range-text">01 Jan 2018 To 31 Dec 2018</h5>
                      <table class="tbl-statement">
                        <tbody>
                          <tr class="grey lighten-4">
                            <td><b>Account Summary</b></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Opening Balance</td>
                            <td>$ 0.00</td>
                          </tr>
                          <tr>
                            <td>Invoice Amount</td>
                            <td>$ 0.00</td>
                          </tr>
                          <tr>
                            <td>Amount Paid</td>
                            <td>$ 0.00</td>
                          </tr>
                          <tr class="balance-due">
                            <td>Balance Due</td>
                            <td>$ 0.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </v-flex>
                    <v-flex xs12>
                      <v-data-table
                        :headers="headers"
                        :items="items"
                        class="elevation-0"
                        hide-actions
                      >
                        <template slot="items" slot-scope="props">
                          <td class="text-xs-left">{{ props.item.StatementDate }}</td>
                          <td class="text-xs-left">{{ props.item.StatementTransactions }}</td>
                          <td class="text-xs-left">{{ props.item.StatementDetails }}</td>
                          <td class="text-xs-center">{{ props.item.StatementAmount }}</td>
                          <td class="text-xs-center">{{ props.item.StatementPayments }}</td>
                          <td class="text-xs-center">{{ props.item.StatementBalance }}</td>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs12>
                      <div class="text-xs-center mt-4">
                        <p>Signature: ________________ </p>
                        <p>Date: 14/03/2019 09:39:28</p>
                      </div>
  
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex class="pdf-footer">
                      <p>User: Adoptions Together | User type: Agency | Agency: 243</p>
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
import Statements from '@/api/statements';
import Material from 'vuetify/es5/util/colors';
import MenuNav from '../MenuNav';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    'component-menu-nav': MenuNav,
    VuePerfectScrollbar
  },
  data: () => ({
    color: Material,
    ranger_filter: ['Today', 'This Week', 'This Month', 'This Quarter', 'This Year', 'Yesterday', 'Previews Week', 'Previews Month', 'Previews Quarter', 'Custom'],
    headers: [
      {
        text: 'Date',
        align: 'left',
        sortable: false,
        value: 'StatementDate'
      },
      { text: 'Transactions', value: 'StatementTransactions' },
      { text: 'Details', value: 'StatementDetails', align: 'center' },
      { text: 'Amount', value: 'StatementAmount', align: 'center' },
      { text: 'Payments', value: 'StatementPayments', align: 'center' },
      { text: 'Balance', value: 'StatementBalance', align: 'center' }
    ],
    items: Statements
  }),
  computed: {}
};
</script>

<style scoped lang="css">
.tbl-statement,
.tbl-statement tr {
  border-collapse: collapse;
  border-top: 1px solid #dee2e6;
  width: 100%;
}
.balance-due {
  border-top: 1px solid #9e9e9e !important;
}
.tbl-statement td,
.tbl-total td {
  padding: 10px 40px 10px 15px;
}
.tbl-statement tr {
  border-top: 1px solid #dee2e6;
}
.to{
  position: relative;
  top: 100px;
}
.range-text{
  border-top: 1px solid #666666;
  border-bottom: 1px solid #666666;
  padding: 5px;
  margin: 15px 0;
}
.pdf-footer {
  position: absolute;
  left: 0.3in;
  right: 0.3in;
  padding-top: 0.05in;
  border-top: 1px solid #e5e5e5;
  font-size: 0.9em;
  text-align: left;
  color: #787878;
}
.header-statement {
  border-bottom: 1px solid #d4d2d2;
  margin: 0 15px;
  padding-bottom: 5px;
}
.invoice-number {
  text-align: right;
}


</style>
