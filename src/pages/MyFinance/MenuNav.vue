<template>
  <v-container fluid grid-list-xl class="ma-0 pa-0 mb-3">
    <v-layout row>
             
      <v-flex xs8 md7 px-0 :class="{'pl-3': this.$router.currentRoute.name === 'Summary' || session.user().role === 'parent' || session.user().role !== 'child'}">
        <div v-if="this.$router.currentRoute.name !== 'Summary'" class="hidden-sm-and-down">
          <v-btn flat to="/my-finance/invoices">Invoices</v-btn>
          <v-btn flat to="/my-finance/payments">Payments</v-btn>
          <v-btn flat to="/my-finance/statements">Statements</v-btn>
        </div>
        <div v-else class="hidden-sm-and-down">
          <v-btn flat :to="'/my-finance/invoices-client/'+this.$router.currentRoute.params.id">Invoices</v-btn>
          <v-btn flat :to="'/my-finance/payments-client/'+this.$router.currentRoute.params.id">Payments</v-btn>
          <v-btn flat :to="'/my-finance/statements-client/'+this.$router.currentRoute.params.id">Statements</v-btn>
        </div>
      </v-flex>

      <v-flex v-if="this.$router.currentRoute.fullPath === '/my-finance/finance' ||
                    this.$router.currentRoute.fullPath === '/my-finance/invoices' || 
                    this.$router.currentRoute.fullPath === '/my-finance/payments' && 
                    session.user().role !== 'parent' && 
                    session.user().role !== 'child'"
                    xs2 md4 pl-0
                    class="text-xs-right" 
      > 
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import MenuNav from './MenuNav.vm.js';
export default MenuNav;
</script>

<style scoped lang="css">
.fab {
  z-index: 2;
}
.selectorNoIcon {
  width: 20px;
  display: inline-block;
}
.v-btn {
    padding: 0px;
    margin: 10px 0px;
}
</style>
