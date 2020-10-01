<template>
    <v-container id="Invoices">
      <component-menu-nav></component-menu-nav>
      <v-container fluid class="ma-0 pa-0">
        <v-layout row>
          <v-flex xs12>
            <v-card class="relative">
              <div class="ribbon">
                  <span v-if="invoice.status ==='Paid'" class="bg-success-gradient">Paid</span>
                  <span v-else class="bg-primary-gradient">{{invoice.status}}</span>
              </div>
              <v-card-title>
                  <h4>Invoice {{invoice.invoice_number}}</h4>
                  <div v-if="invoice.status !=='Paid'" class="title-action">
                    <v-btn color="primary" small dark :to="'/invoice-edit/' + invoice._id">
                      <span>Edit Invoice</span>
                      <v-icon small right>edit</v-icon>
                    </v-btn>
                    <v-btn color="red" small dark :to="'/invoice-payment/' + invoice._id">
                      <span>Pay Now</span>
                      <v-icon small right>fas fa-hand-holding-usd</v-icon>
                    </v-btn>
                  </div>
              </v-card-title>
              <vue-perfect-scrollbar class="invoice--scrollbar">
                <v-card-text>
                  <v-container fluid grid-list-xl pt-0>
                    <v-layout class="header-invoice" row justify-space-between>
                      <v-flex xs12 md4>
                        <img class="logo" src=".../../../static/logo.png">                      
                      </v-flex>
                      <v-flex xs12 md4>
                        <div class="header-address">
                          <strong>WEB2 SOLUTIONS LLC</strong><br />
                          11125 Park Blvd Ste 104-136<br />
                          Seminole, FL 33772<br />
                        </div>
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
                                  <td style="height: 130px">{{ billTo }}</td>
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
                                      <td>{{invoice.invoice_number}}</td>
                                  </tr>
                                  <tr>
                                      <td class="grey lighten-4">Invoice Date</td>
                                      <td>{{ new Date(invoice.createdAt).toDateString() }}</td>
                                  </tr>
                                  <tr>
                                      <td class="grey lighten-4">Terms</td>
                                      <td>{{ termsConditions }}</td>
                                  </tr>
                                  <tr>
                                      <td class="grey lighten-4">Due Date</td>
                                      <td>{{ new Date(invoice.due_date).toDateString() }}</td>
                                  </tr>
                                  
                              </tbody>
                          </table>
                      </v-flex>
                      <v-flex xs12>
                        <v-data-table
                          :headers="headers"
                          :items="invoiceItems"
                          class="elevation-0"
                          hide-actions
                        >
                          <template slot="items" slot-scope="props">
                            <td :id="'good-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('Good', props.item.good, 'good-name-' + props.index) }}</td>
                            <td class="text-xs-center">{{ props.item.type }}</td>
                            <td class="text-xs-center">{{ props.item.unity }}</td>
                            <td class="text-xs-center">{{ props.item.unity_price.toLocaleString(session.user.language, { style: 'currency', currency: session.user.currency_code }) }}</td>
                            <td class="text-xs-center">{{ props.item.quantity }}</td>
                            <td class="text-xs-center">{{ (props.item.quantity * props.item.unity_price).toLocaleString(session.user.language, { style: 'currency', currency: session.user.currency_code }) }}</td>
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
                            <td class="text-right">${{invoice.amount}}</td>
                            </tr>
                            <tr>
                            <th>Total</th>
                            <td class="text-right">${{invoice.amount}}</td>
                            </tr>
                            <tr>
                            <th>Balance Due:</th>
                            <td class="text-right">$0.00</td>
                            </tr>
                        </table>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex class="pdf-footer">
                        <p>User: {{ session.user.name }} | User type: {{ session.user.role }} | Agency: {{ session.user.agency_id }}</p>
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
import InvoiceView from './InvoiceView.vm.js';
export default InvoiceView;
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
.title-action{
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
.logo{
    width: 60%;
}
.header-address{
    vertical-align: bottom;
    margin-top: 33px;
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
