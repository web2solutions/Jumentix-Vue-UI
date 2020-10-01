<template>
    <v-container id="Invoices">
      <component-menu-nav></component-menu-nav>
      <v-container fluid class="ma-0 pa-0">
        <v-layout row>
          <v-flex xs9>
            <v-card class="relative">
              <div class="ribbon">
                  <span v-if="invoice.InvoiceStatus ==='Paid'" class="bg-success-gradient">{{invoice.InvoiceStatus}}</span>
                  <span v-else class="bg-primary-gradient">{{invoice.InvoiceStatus}}</span>
              </div>
              <v-card-title class="pb-0">
                  <h4>Invoice {{invoice.InvoiceNumber}}</h4>
                  <v-btn v-if="invoice.InvoiceStatus !=='Paid'" color="red" dark :to="'/invoice-payment/' + invoice.InvoiceNumber">
                    <span>Pay Now</span>
                    <v-icon small right>fas fa-hand-holding-usd</v-icon>
                  </v-btn>
              </v-card-title>
              <vue-perfect-scrollbar class="invoice--scrollbar">
                <v-card-text>
                  <v-container fluid grid-list-xl>
                    <v-layout class="header-invoice" row justify-space-between>
                      <v-flex xs12 md3>
                        <img src="http://res.cloudinary.com/hrscywv4p/image/upload/c_limit,fl_lossy,h_1440,w_120,f_auto,q_auto/v1/774802/CAIRS_Logo_fin_knw2eu.png" />
                      </v-flex>
                      <v-flex xs12 md4>
                        <strong>WEB2 SOLUTIONS LLC</strong><br />
                            11125 Park Blvd Ste 104-136<br />
                            Seminole, FL 33772<br />
                      </v-flex>
                    </v-layout>

                    <v-layout row justify-space-between wrap>
                      <v-flex xs12 md4>
                        <table class="tbl-invoice mt-4">
                          <tbody>
                              <tr>
                                  <td class="grey lighten-4"><strong>Bill To</strong></td>
                              </tr>
                              <tr>
                                  <td style="height: 130px">Test Company</td>
                              </tr>
                            </tbody>
                        </table>
                      </v-flex>
                      <v-flex xs12 md6>
                        <h4 class="font-weight-regular font-italic headline text-xs-center">INVOICE</h4>
                         <table class="tbl-invoice">
                              <tbody>
                                  <tr>
                                      <td class="grey lighten-4">Invoice #</td>
                                      <td>{{invoice.InvoiceNumber}}</td>
                                  </tr>
                                  <tr>
                                      <td class="grey lighten-4">Invoice Date</td>
                                      <td>{{invoice.InvoiceDate}}</td>
                                  </tr>
                                  <tr>
                                      <td class="grey lighten-4">Terms</td>
                                      <td>Net 5</td>
                                  </tr>
                                  <tr>
                                      <td class="grey lighten-4">Due Date</td>
                                      <td>30 Aug 2018</td>
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
                            <td>{{ props.item.item }}</td>
                            <td class="text-xs-right">{{ props.item.description }}</td>
                            <td class="text-xs-right">{{ props.item.qty }}</td>
                            <td class="text-xs-right">{{ props.item.rate }}</td>
                            <td class="text-xs-right">{{ props.item.amount }}</td>
                          </template>
                        </v-data-table>
                      </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                      <v-flex xs7>
                        <h4>We appreciate your business</h4>

                        <p class="text-muted well well-sm no-shadow" style="margin-top: 10px;">
                            WEB2 SOLUTIONS LLC<br />
                            11125 Park Blvd Ste 104-136<br />
                            Seminole, FL 33772<br /> 
                        </p>
                        <h4><b>Terms & Conditions</b></h4>
                        <p class="text-muted well well-sm no-shadow" style="margin-top: 10px;">
                            Due upon receipt. Remit payment to:
                            WEB2 SOLUTIONS LLC<br />
                            11125 Park Blvd Ste 104-136<br />
                            Seminole, FL 33772<br /> 
                        </p>
                      </v-flex>
                      <v-flex xs5>
                        <table class="tbl-total">
                            <tr>
                            <th style="width:50%">Subtotal:</th>
                            <td class="text-right">$0.10</td>
                            </tr>
                            <tr>
                            <th>Total</th>
                            <td class="text-right"> $0.10</td>
                            </tr>
                            <tr>
                            <th>Balance Due:</th>
                            <td class="text-right">$0.10</td>
                            </tr>
                        </table>
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
          <v-flex xs4>
              <componet-payments-list></componet-payments-list>
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
</template>

<script>
/* eslint-disable */ 
import API from '@/api';
import Material from 'vuetify/es5/util/colors';
import MenuNav from '../MenuNav';
import PaymentsList from './PaymentsList.vue';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    'component-menu-nav': MenuNav,
    'componet-payments-list': PaymentsList,
    VuePerfectScrollbar
  },
  data: () => ({
    color: Material,
    invoice: {},
    headers: [
      {
        text: 'Item',
        align: 'left',
        sortable: false,
        value: 'item'
      },
      { text: 'Description', value: 'description' },
      { text: 'Qty', value: 'qty', align: 'center' },
      { text: 'Rate', value: 'rate', align: 'center' },
      { text: 'Amount', value: 'amount', align: 'center' }
    ],
    items: [
          {
            item: '2014 FAC Support',
            description: 'Insert a descriptiom',
            qty: 2,
            rate: 2.4,
            amount: 4.0
          },
          {
            item: '2017 ABCD Support',
            description: 'Insert a descriptiom',
            qty: 2,
            rate: 2.4,
            amount: 4.0
          }
          
      ],
  }), 
  mounted () {

  },
  created () {
    let paramID = this.$router.currentRoute.params.id;
    this.getInvoice(paramID);
  },
  computed: {

  },
  methods: {
    getInvoice (id) {
      let paramID = id
      let invoices = require('../../../api/invoices.json')

      for (let i = 0; i < invoices.data.length; i++) {
        if (invoices.data[i].InvoiceNumber === paramID) {
          this.invoice = invoices.data[i]

          break
        }
      }
    }

  },
  beforeRouteUpdate (to, from, next) {
    // console.log('from', from, to);
    let paramID = to.params.id;
    this.getInvoice(paramID);
    next();
  }
};
</script>

<style scoped>
.tbl-invoice, .tbl-invoice tr{
  border-collapse: collapse;
  border: 1px solid #dee2e6;
  width: 100%;
}

.tbl-total, .tbl-total tr{
  border-collapse: collapse;
  border: 1px solid #dee2e6;
  width: 100%;
  border-left: none;
  border-right: none;
  border-bottom: none;
}
.tbl-invoice td, .tbl-total td{
  padding: 10px 40px 10px 15px;
}
.tbl-invoice tr{
  border: 1px solid #dee2e6;
}
.relative{
  position: relative;
}
.pdf-footer {
      position: absolute;
			left: .3in;
			right: .3in;
			padding-top: 0.05in;
			border-top: 1px solid #e5e5e5;
			font-size: 0.9em;
			text-align: left;
			color: #787878;
		}
.v-card__title h4 {
  width: 100%;
  text-align: center;
}
.v-card__title .v-btn {
    position: absolute;
    right: 25px;
}
.md-card{
    margin-right: 0px !important;
    margin-top: 10px;
    height: 100% !important;
}
.invoice-content {
    height: calc(100vh - 230px);
    overflow: auto;
    max-height: 100%;
    padding: 0 20px;
}
.md-card-header-text {
    text-align: center;
}
.header-invoice{
    border-bottom: 1px solid #d4d2d2;
    margin: 0 15px;
    padding-bottom: 5px;
}
.invoice-number{
    text-align: right;
}
.bg-primary-gradient {
  background: #007bff;
  background: -webkit-gradient(linear, left bottom, left top, color-stop(0, #007bff), color-stop(1, #3395ff));
  background: -ms-linear-gradient(bottom, #007bff, #3395ff);
  background: -moz-linear-gradient(center bottom, #007bff 0%, #3395ff 100%);
  background: -o-linear-gradient(#3395ff, #007bff);
  color: #ffffff;
}
.bg-success-gradient {
  background: #28a745;
  background: -webkit-gradient(linear, left bottom, left top, color-stop(0, #28a745), color-stop(1, #34ce57));
  background: -ms-linear-gradient(bottom, #28a745, #34ce57);
  background: -moz-linear-gradient(center bottom, #28a745 0%, #34ce57 100%);
  background: -o-linear-gradient(#34ce57, #28a745);
  color: #ffffff;
}
.corner-ribbon{
  width: 200px;
  background: #333;
  position: absolute;
  top: 25px;
  left: -50px;
  text-align: center;
  line-height: 50px;
  letter-spacing: 1px;
  color: #f0f0f0;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.corner-ribbon.shadow{
  box-shadow: 0 0 3px rgba(0,0,0,.3);
}
.corner-ribbon.top-left{

  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.ribbon {
  position: absolute;
  left: -5px; top: -5px;
  z-index: 1;
  overflow: hidden;
  width: 200px; height: 200px;
  text-align: right;
}
.ribbon span {
    font-size: 15px;
    font-weight: bold;
    color: #FFF;
    text-transform: uppercase;
    text-align: center;
    line-height: 31px;
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
    width: 200px;
    display: block;
    box-shadow: 0 3px 10px -5px black;
    position: absolute;
    top: 46px;
    left: -39px;
}
.ribbon span::before {
  content: "";
  position: absolute; left: 0px; top: 100%;
  z-index: -1;
  border-left: 3px solid #333;
  border-right: 3px solid transparent;
  border-bottom: 3px solid transparent;
  border-top: 3px solid #333;
}
.ribbon span::after {
  content: "";
  position: absolute; right: 0px; top: 100%;
  z-index: -1;
  border-left: 3px solid transparent;
  border-right: 3px solid #333;
  border-bottom: 3px solid transparent;
  border-top: 3px solid #333;
}
.bg-primary-gradient {
  background: #007bff;
  background: -webkit-gradient(linear, left bottom, left top, color-stop(0, #007bff), color-stop(1, #3395ff));
  background: -ms-linear-gradient(bottom, #007bff, #3395ff);
  background: -moz-linear-gradient(center bottom, #007bff 0%, #3395ff 100%);
  background: -o-linear-gradient(#3395ff, #007bff);
  color: #ffffff;
}
.bg-success-gradient {
  background: #28a745;
  background: -webkit-gradient(linear, left bottom, left top, color-stop(0, #28a745), color-stop(1, #34ce57));
  background: -ms-linear-gradient(bottom, #28a745, #34ce57);
  background: -moz-linear-gradient(center bottom, #28a745 0%, #34ce57 100%);
  background: -o-linear-gradient(#34ce57, #28a745);
  color: #ffffff;
}
</style>
