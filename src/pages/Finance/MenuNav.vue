<template>
  <v-container fluid grid-list-xl class="ma-0 pa-0 mb-3">
    <v-layout row>
      <v-flex xs2 md1 pt-0 pr-0 v-if="this.$router.currentRoute.name !== 'Summary' && session.user().role !== 'parent' && session.user().role !== 'child'">
        <v-speed-dial
            v-model="fab"
            absolute
            direction="bottom"
            open-on-hover
            transition="slide-y-transition"
            class="fab"
            >
            <v-btn slot="activator" v-model="fab" color="red" dark fab>
                <v-icon>add</v-icon>
                <v-icon>close</v-icon>
            </v-btn>

            <v-tooltip right>
                <v-btn fab dark small color="indigo" slot="activator" to="/invoice-create">
                <v-icon>description</v-icon>
                </v-btn>
                <span>Add Invoice</span>
            </v-tooltip>
            <v-tooltip right>
                <v-btn fab dark small color="green" slot="activator">
                <v-icon>attach_money</v-icon>
                </v-btn>
                <span>Add Expenses</span>
            </v-tooltip>
            <v-tooltip right v-if="this.$router.currentRoute.fullPath !== '/finance'">
                <v-btn fab dark small color="primary" slot="activator">
                <v-icon>remove_red_eye</v-icon>
                </v-btn>
                <span>View</span>
            </v-tooltip>
            <v-tooltip right v-if="this.$router.currentRoute.fullPath !== '/finance'">
                <v-btn fab dark small color="primary" slot="activator">
                <v-icon>get_app</v-icon>
                </v-btn>
                <span>Download</span>
            </v-tooltip>
            <v-tooltip right v-if="this.$router.currentRoute.fullPath !== '/finance'">
                <v-btn fab dark small color="primary" slot="activator">
                <v-icon>print</v-icon>
                </v-btn>
                <span>Print</span>
            </v-tooltip>
        </v-speed-dial>
      </v-flex>
        
      <v-flex xs8 md7 px-0 :class="{'pl-3': this.$router.currentRoute.name === 'Summary' || session.user().role === 'parent' || session.user().role !== 'child'}">
        <div v-if="this.$router.currentRoute.name !== 'Summary'" class="hidden-sm-and-down" :class="$vuetify.dark ? 'darkColor' : ''">
          <v-btn flat :dark="$vuetify.dark" to="/invoices">Invoices</v-btn>
          <v-btn :dark="$vuetify.dark" flat to="/payments">Payments</v-btn>
          <v-btn :dark="$vuetify.dark" v-if="session.user().role !== 'parent' && session.user().role !== 'child'" flat to="/expenses">Expenses</v-btn>
          <v-btn :dark="$vuetify.dark" v-if="session.user().role !== 'parent' && session.user().role !== 'child' && this.$router.currentRoute.name !== 'Summary' && this.$router.currentRoute.name !== 'ClientInvoices'" flat to="/items">Items</v-btn>
          <v-btn :dark="$vuetify.dark" flat to="/statements">Statements</v-btn>
        </div>
        <div v-else class="hidden-sm-and-down" :class="$vuetify.dark ? 'darkColor' : ''">
          <v-btn :dark="$vuetify.dark" flat :to="'/invoices-client/'+this.$router.currentRoute.params.id">Invoices</v-btn>
          <v-btn :dark="$vuetify.dark" flat :to="'/payments-client/'+this.$router.currentRoute.params.id">Payments</v-btn>
          <v-btn :dark="$vuetify.dark" flat :to="'/statements-client/'+this.$router.currentRoute.params.id">Statements</v-btn>
        </div>
        <v-autocomplete
          v-if="session.user().role !== 'parent' && session.user().role !== 'child'"
          flat
          v-model="model"
          :items="items"
          :loading="isLoading"
          :search-input.sync="search"
          clearable
          hide-no-data
          hide-selected
          :item-text="item_text"
          :item-value="item_value"
          :label="'Search for ' + searchType"
          append-outer-icon="search"
          class="hidden-md-and-up mt-0 d-xl-inline-flex"
          return-object
          @click:clear="bus.$emit('doTextSearch', '')"
          :class="$vuetify.dark ? 'darkColor' : ''"
          :dark="$vuetify.dark"
        >
        <template v-slot:prepend>

          <v-menu bottom left>
            <template v-slot:activator="{ on }">
                <v-icon v-on="on">filter_list</v-icon>
            </template>

            <v-list>
              <v-list-tile
                v-for="(item, i) in itemsMenu"
                :key="i"
                @click="selectFilter(item, i)"
              >
                <v-list-tile-title><v-icon v-if="item.title === searchType">check</v-icon> <span v-else class="selectorNoIcon"></span>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>

        </template>
        </v-autocomplete>
      </v-flex>

      <v-flex v-if="this.$router.currentRoute.fullPath === '/finance' ||
                    this.$router.currentRoute.fullPath === '/invoices' || 
                    this.$router.currentRoute.fullPath === '/payments' && 
                    session.user().role !== 'parent' && 
                    session.user().role !== 'child'"
                    xs2 md4 pl-0
                    class="text-xs-right" 
      >
          <v-autocomplete
            v-if="session.user().role !== 'parent' && session.user().role !== 'child'"
            flat
            v-model="model"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            clearable
            hide-no-data
            hide-selected
            :item-text="item_text"
            :item-value="item_value"
            :label="'Search for ' + searchType"
            append-outer-icon="search"
            class="hidden-sm-and-down mt-0 d-xl-inline-flex"
            return-object
            @click:clear="bus.$emit('doTextSearch', '')"
            v-on:keyup.enter="bus.$emit('doTextSearch', search)"
            >
            <template v-slot:prepend>

              <v-menu bottom left>
                <template v-slot:activator="{ on }">
                    <v-icon v-on="on">filter_list</v-icon>
                </template>

                <v-list>
                  <v-list-tile
                    v-for="(item, i) in itemsMenu"
                    :key="i"
                    @click="selectFilter(item, i)"
                  >
                    <v-list-tile-title><v-icon v-if="item.title === searchType">check</v-icon> <span v-else class="selectorNoIcon"></span>{{ item.title }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>

            </template>
          </v-autocomplete>

          <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                v-on="on"
                class="hidden-md-and-up fab" 
              >
                <v-icon>menu</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-tile to="/invoices">
                <v-list-tile-title>Invoices
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile to="/payments">
                <v-list-tile-title>
                  Payments
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile v-if="session.user().role !== 'parent' && session.user().role !== 'child'" to="/expenses">
                <v-list-tile-title>
                  Expenses
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile v-if="session.user().role !== 'parent' && session.user().role !== 'child' && this.$router.currentRoute.name !== 'Summary'" to="/items">
                <v-list-tile-title>
                  Items
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile to="/statements">
                <v-list-tile-title>
                  Statements
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>

        
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
.darkColor {
  background-color: #4D4D4D !important;
  color: #ffffff !important;
}
</style>
