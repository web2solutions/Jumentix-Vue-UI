<template>

      <v-card color="transpatent" class="transpatent elevation-0">
        <v-card-title primary-title class="mt-0 pt-0 mb-0 pb-0">
            <v-text-field
                v-model="search"
                label="Search by invoice..."
                clearable
                @input="searchOnTable"
            ></v-text-field>
        </v-card-title>

        <vue-perfect-scrollbar class="invoice-list--scrollbar">
        <v-list two-line>
          <template v-for="(item) in searched">
            <v-list-tile
              :key="item.title"
              ripple
              dense
              :to="'/payment/' + item.InvoiceNumber"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.InvoiceNumber }}</v-list-tile-title>
                <v-list-tile-sub-title class="text--primary">{{ item.InvoiceTotal }}</v-list-tile-sub-title>
                <v-list-tile-sub-title>{{moment.tz((new Date(item.InvoiceDate)).toISOString(), moment.tz.guess()).fromNow()}}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                  <v-chip small label text-color="white" :color=" (item.InvoiceStatus).indexOf('Paid') > -1 ? 'green lighten-2' : 'red lighten-2' ">{{ item.InvoiceStatus }}</v-chip>
              </v-list-tile-action>

            </v-list-tile>
          </template>
        </v-list>
          </vue-perfect-scrollbar>
      </v-card>
      
</template>

<script>
import PaymentsList from './PaymentsList.vm';
export default PaymentsList;

</script>

<style scoped>

.v-card, .v-list{
    background-color: transparent !important;
}
.v-list:hover {
    background-color: #333;
}
.theme--light.v-list .v-list__tile--link:hover,
.theme--light.v-list .v-list__group__header:hover, 
.theme--light.v-list .v-list__tile--link:hover {
    background: rgba(0,0,0,0.04) !important;
}
</style>