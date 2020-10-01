<template>
  <v-container id="InvoicePayment">
    <component-menu-nav></component-menu-nav>
    <v-container fluid class="ma-0 pa-0">
      <v-layout row>
        <v-flex>
          <v-card class="relative">
            <div class="ribbon">
              <span v-if="invoice.status ==='Paid'" class="bg-success-gradient">Paid</span>
            </div>
            <v-card-title class="pb-0">
              <h3>Payment for INV #{{ invoice.invoice_number }}</h3>
            </v-card-title>
            <vue-perfect-scrollbar class="perfect--scrollbar">
              <v-card-text>
                  <v-container fluid >
                    <v-layout row wrap>
                      <v-flex xs12 ma-0 pa-0 mb-2>
                        <v-alert
                        :value="amount === 0"
                        type="warning"
                      >
                        This invoice contains no items, please select at least 1 item.
                        <v-btn small color="primary" :to="'/invoice-edit/' + invoice.id">Click to edit Invoice</v-btn>
                      </v-alert>
                        
                      </v-flex>
                      
                    </v-layout>
                    
                    <v-layout row justify-space-between>
                        <v-flex xs12 ma-0 pa-0>
                            <v-card dark color="green lighten-3" class="elevation-3 pa-3">
                            <v-card-text>
                                <v-layout row wrap>
                                    <v-flex xs12 md8 text-xs-center text-md-left>
                                        <h4>Balance Due</h4>
                                        <h2>{{ amount }}</h2>
                                    </v-flex>
                                    <v-flex xs12 md4 text-xs-center text-md-left>
                                        <h2>INV #{{ invoice.invoice_number }}</h2>
                                       <h4>Due Date: {{ new Date(invoice.due_date).toUTCString().substr(0, 16) }}</h4>
                                    </v-flex>
                                </v-layout>
                                
                            </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap mt-4>
                      <v-flex xs12>
                        <h2>Select your payment</h2>
                      </v-flex>
                      <v-flex xs12>
                        <v-expansion-panel>


                          <v-expansion-panel-content :disabled="disable_options_stripe">
                            <template v-slot:header>
                              <v-layout row wrap pt-1>
                                <v-flex xs1 pt-2>
                                  <v-icon color="grey lighten-1">fas fa-credit-card fa-5x</v-icon>
                                </v-flex>
                                <v-flex xs11 pt-0>
                                  <h3>Pay via Card</h3>
                                  <span v-if="disable_options_stripe">Payment option disabled</span>
                                  <span v-if="!disable_options_stripe">Make Fast and secure payments through Stripe</span>
                                </v-flex>
                              </v-layout>
                            </template>
                            <v-card>
                              <v-card-text class="px-5">
                                <h4>CARD DETAILS</h4>
                                <p>Your card details are sent to Stripe via secure SSL connectio for payment processing. We do no store your card information in our servers.</p>
                                <form action="/charge" method="post" id="payment-form">
                                  <div class="form-row">
                                    <label for="card-element">
                                      Credit or debit card
                                    </label>
                                    <div id="card-element">
                                      <!-- A Stripe Element will be inserted here. -->
                                    </div>

                                    <!-- Used to display Element errors. -->
                                    <div id="card-errors" role="alert"></div>
                                  </div>

                                  <button>Submit Payment</button>
                                </form>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>



                          <v-expansion-panel-content :disabled="disable_options_card">
                            <template v-slot:header>
                              <v-layout row wrap pt-1>
                                <v-flex xs1 pt-2>
                                  <v-icon color="grey lighten-1">fas fa-credit-card fa-5x</v-icon>
                                </v-flex>
                                <v-flex xs11 pt-0>
                                  <h3>Pay via Card</h3>
                                  <span v-if="disable_options_card">Payment option disabled</span>
                                  <span v-if="!disable_options_card">Make Fast and secure payments through your card</span>
                                </v-flex>
                              </v-layout>
                            </template>
                            <v-card>
                              <v-card-text class="px-5">
                                <h4>CARD DETAILS</h4>
                                <p>Your card details are sent to Authorize.Net via secure SSL connectio for payment processing. We do no store your card information in our servers.</p>
                                <v-form v-model="valid" ref="Credit Card">
                                  <div class="d-flex my-2">
                                    <v-text-field
                                      label="Card Number"
                                      v-model="form.cardNumber"
                                      :rules="[() => !!form.cardNumber || 'This field is required']"
                                      required
                                      mask="credit-card"
                                    ></v-text-field>
                                  </div>
                                  <div class="d-flex my-2">
                                    <v-text-field
                                      label="Card Name"
                                      v-model="form.cardName"
                                      v-validate="'required'"
                                      data-vv-name="cardName"      
                                      :error-messages="errors.collect('cardName')"  
                                      required
                                    ></v-text-field>
                                  </div>
                                  <div class="d-flex">
                                    
                                    <v-text-field
                                      class="mr-2"
                                      label="Expire Date"
                                      v-validate="'required'"
                                      data-vv-name="expireDate"
                                      :error-messages="errors.collect('expireDate')"       
                                      append-icon="today"
                                      v-model="form.expireDate"
                                      required
                                      mask="##/####"
                                    ></v-text-field>
                                    <v-text-field
                                        label="CVV"
                                        v-validate="'required'"
                                        data-vv-name="cvv"
                                        :error-messages="errors.collect('cvv')"  
                                        v-model="form.cvv"
                                        mask="###"
                                        suffix="CVV"
                                        required
                                      ></v-text-field>           
                                  </div>
                                  <div>
                                    <h4>BILLING ADDRESS</h4>
                                    <p>The billing address entered here must match the billing address of de card holder.</p>
                                  </div>
                                  <div>
                                    <v-text-field
                                      label="Address"
                                      v-validate="'required'"
                                      data-vv-name="address"     
                                      :error-messages="errors.collect('address')"  
                                      v-model="form.address"
                                      required
                                    ></v-text-field>
                                    <div class="d-flex"> 
                                      <v-text-field pl-1
                                        class="mr-2"  
                                        label="City"
                                        v-validate="'required'"
                                        data-vv-name="city"     
                                        :error-messages="errors.collect('city')"  
                                        v-model="form.city"
                                        required
                                      ></v-text-field>
                                      <v-text-field
                                        label="State"
                                        v-validate="'required'"
                                        data-vv-name="state"     
                                        :error-messages="errors.collect('state')"  
                                        v-model="form.state"
                                        required
                                      ></v-text-field>
                                    </div>
                                    <div class="d-flex"> 
                                      <v-text-field
                                        class="mr-2"
                                        label="Country"
                                        v-validate="'required'"
                                        data-vv-name="country"     
                                        :error-messages="errors.collect('country')"  
                                        v-model="form.country"
                                        required
                                      ></v-text-field>
                                      <v-text-field
                                        label="Zip Code"
                                        type="number"
                                        v-validate="'required'"
                                        data-vv-name="zip"     
                                        :error-messages="errors.collect('zip')"  
                                        v-model="form.zip"
                                        required
                                      ></v-text-field>
                                    </div>
                                  
                                  </div>
                                  <div class="d-flex">
                                    <v-switch
                                      label="I authorize WEB2 SOLUTIONS LLC to charge this credit card automatically for future transactions."
                                      v-model="saveCard"
                                    ></v-switch>    
                                  </div>
                                  <div class="form-btn">
                                    <v-btn outline @click="submit('Credit Card')" color="primary">Submit</v-btn>
                                    <v-btn outline @click="clear">Clear</v-btn>
                                  </div>

                                </v-form>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>

                          <v-expansion-panel-content :disabled="disable_options_echeck">
                            <template v-slot:header>
                              <v-layout row wrap pt-3>
                                <v-flex xs1 pt-2>
                                  <v-icon color="grey lighten-1">fas fa-money-check-alt fa-5x</v-icon>
                                </v-flex>
                                <v-flex xs11 pt-0>
                                  <h3>Pay via eCheck</h3>
                                  <span v-if="disable_options_echeck">Payment option disabled</span>
                                  <span v-if="!disable_options_echeck">Make Fast and secure payments through your eCheck</span>
                                </v-flex>
                              </v-layout>
                            </template>
                            <v-card>
                              <v-card-text class="px-5">
                                <v-form v-model="valid" ref="eCheck">
                                  <v-text-field
                                    label="Bank Routing Number:"
                                    type="number"
                                    v-validate="'required'"
                                    data-vv-name="bankRoutingNumber"
                                    :error-messages="errors.collect('bankRoutingNumber')"
                                    v-model="form.bankRoutingNumber"
                                    required
                                  ></v-text-field>

                                  <v-text-field
                                    label="Account Number:"
                                    type="number"
                                    v-validate="'required'"
                                    data-vv-name="accountNumber"
                                    :error-messages="errors.collect('accountNumber')"
                                    v-model="form.accountNumber"
                                    required
                                  ></v-text-field>

                                  <v-text-field
                                    label="Signature:"
                                    required
                                  ></v-text-field>
                                  <div class="d-flex">
                                    <v-switch
                                      label="I authorize WEB2 SOLUTIONS LLC to make payment for the amount of $0.10 from de account information I have provided."
                                      v-model="saveCard"
                                    ></v-switch>    
                                  </div>
                                  <div class="form-btn">
                                    <v-btn outline @click="submit('eCheck')" color="primary">MAKE PAYMENT</v-btn>
                                    <v-btn outline @click="clear">CLEAR</v-btn>
                                  </div>
                                </v-form>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>

                          <v-expansion-panel-content :disabled="disable_options_check">
                            <template v-slot:header>
                              <v-layout row wrap pt-3>
                                <v-flex xs1 pt-2>
                                  <v-icon color="grey lighten-1">fas fa-money-check fa-3x</v-icon>
                                </v-flex>
                                <v-flex xs11 pt-0>
                                  <h3>Pay via Check</h3>
                                  <span v-if="disable_options_check">Payment option disabled</span>
                                  <span v-if="!disable_options_check">Make Fast and secure payments through your Check</span>
                                </v-flex>
                              </v-layout>
                            </template>
                            <v-card>
                              <v-card-text class="px-5">
                                <p>Please make your check out to WEB2 SOLUTIONS LLC and include the Invoice Number on the memo space.</p>
                                <h5>Mail to:</h5>
                                <p><b>WEB2 SOLUTIONS LLC</b><br>
                                    11125 Park Blvd Ste 104-136<br>
                                    Seminole, FL 33772</p>
                              </v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                          
                        </v-expansion-panel>
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
import InvoicesPayment from './InvoicePayment.vm.js';
export default InvoicesPayment;
</script>

<style scoped lang="css">
h2, .v-expansion-panel h3 {
  font-weight: 400;
}
.v-icon{
  font-size: 3rem;
}
.perfect--scrollbar {
    height: calc(100vh - 270px) !important;
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
.relative{
  position: relative;
}
</style>
