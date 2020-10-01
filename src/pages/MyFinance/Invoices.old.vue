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
                  <v-icon class="d-block">fas fa-file-invoice</v-icon>
                  <span class="display-1 font-weight-medium d-block">Create a New Invoice</span>
                  <span class="subheading mt-4">Click the + button to create a new invoice or <br>open invoice from the list.</span>

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

</style>
