<template>
    <v-container id="Invoices">
      <component-menu-nav></component-menu-nav>
      <v-container fluid class="ma-0 pa-0">
        <v-layout row>
          <v-flex xs9>

            <v-card>
              <v-card-title>
              </v-card-title>
              <vue-perfect-scrollbar class="invoice--scrollbar">
                <v-card-text class="mt-5 pt-5">
                  <v-icon class="d-block">fas fa-hand-holding-usd</v-icon>
                  <span class="display-1 font-weight-medium d-block">Create a New Expense</span>
                  <span class="subheading mt-4">Click the + button to create a new Expense or <br>open Expense from the list.</span>

                </v-card-text>
              </vue-perfect-scrollbar>           
            </v-card>
          </v-flex>
          <v-flex xs4>
              <componet-invoices-list></componet-invoices-list>
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
</template>

<script>
/* global session */
import API from '@/api';
import Material from 'vuetify/es5/util/colors';
import MenuNav from './MenuNav';
import InvoicesList from './Invoices/InvoicesList.vue';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    'component-menu-nav': MenuNav,
    'componet-invoices-list': InvoicesList,
    VuePerfectScrollbar
  },
  data: () => ({
    color: Material,
  }),
  computed: {
    
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

};
</script>

<style scoped>

.v-card__text, .v-card__title h4 {
  width: 100%;
  text-align: center;
}
.v-card__text >>> .v-icon{
  font-size: 150px !important;
  color: rgba(0,0,0,.26);
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
    margin: 0 20px;
    padding-bottom: 10px;
}
.invoice-number{
    text-align: right;
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
