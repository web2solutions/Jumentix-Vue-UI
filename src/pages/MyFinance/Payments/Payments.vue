<template>
    <v-container id="Payments">
      <component-menu-nav
        :bus="bus"  
      ></component-menu-nav>
      <v-container fluid class="ma-0 pa-0">
        <v-layout row>
          <v-flex xs12>
            <v-card>
                <v-card-text class="pa-0">
                  <v-data-table 
                    :headers="headers" 
                    :items="invoiceItems" 
                    :search="search"
                    :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                    v-model="selected"
                    class="elevation-1"
                    item-key="_id"
                    :loading="loading"
                  >
                    <template v-slot:headers="props">
                      <tr>
                        <th width="20">
                          <v-checkbox
                            :input-value="props.all"
                            :indeterminate="props.indeterminate"
                            primary
                            hide-details
                            @click.stop="toggleAll"
                          ></v-checkbox>
                        </th>
                        <th
                          align="center"
                          v-if="!props.hide"
                          :class="['column sortable', pagination.descending ? 'desc' : 'asc', 'createdAt' === pagination.sortBy ? 'active' : '']"
                          @click="changeSort('createdAt')"
                        >
                          <v-icon small>arrow_upward</v-icon>
                          Date
                        </th>
                        <th
                          align="center"
                          v-if="!props.hide"
                          :class="['column sortable', pagination.descending ? 'desc' : 'asc', 'payment_number' === pagination.sortBy ? 'active' : '']"
                          @click="changeSort('payment_number')"
                        >
                          <v-icon small>arrow_upward</v-icon>
                          Payment#
                        </th>
                        <th
                          align="center"
                          v-if="!props.hide"
                          :class="['column sortable', pagination.descending ? 'desc' : 'asc', 'order_number' === pagination.sortBy ? 'active' : '']"
                          @click="changeSort('order_number')"
                        >
                          <v-icon small>arrow_upward</v-icon>
                          Order Number
                        </th>
                        <th
                          align="center"
                          v-if="!props.hide && session.user().role !== 'parent' && session.user().role !== 'child'"
                          :class="['column sortable', pagination.descending ? 'desc' : 'asc', 'drawee_human' === pagination.sortBy ? 'active' : '']"
                          
                        >
                          <v-icon small>arrow_upward</v-icon>
                          Custome Name
                        </th>
                        <th
                          align="center"
                          v-if="!props.hide"
                          :class="['column sortable', pagination.descending ? 'desc' : 'asc', 'invoice_number' === pagination.sortBy ? 'active' : '']"
                          @click="changeSort('invoice_number')"
                        >
                          <v-icon small>arrow_upward</v-icon>
                          Invoice#
                        </th>
                        <th
                          align="center"
                          v-if="!props.hide"
                          :class="['column sortable', pagination.descending ? 'desc' : 'asc', 'transaction_type' === pagination.sortBy ? 'active' : '']"
                          @click="changeSort('transaction_type')"
                        >
                          <v-icon small>arrow_upward</v-icon>
                        Mode
                        </th>
                        <th
                          align="center"
                          v-if="!props.hide"
                          :class="['column sortable', pagination.descending ? 'desc' : 'asc', 'amount' === pagination.sortBy ? 'active' : '']"
                          @click="changeSort('amount')"
                        >
                          <v-icon small>arrow_upward</v-icon>
                          Amount
                        </th>
                        <th
                          align="center"
                        >
                          Action
                        </th>
                    </tr>
                  </template>

                  <template v-slot:items="props">
                    <tr :active="props.selected" @click="props.selected = !props.selected">
                      <td>
                        <v-checkbox
                          :input-value="props.selected"
                          primary
                          hide-details
                        ></v-checkbox>
                      </td>
                      <td class="text-xs-center px-0" width="140px">{{ moment(props.item.createdAt).format('L') }}</td>
                      <td class="text-xs-center">{{ props.item.transaction_name }}</td>
                      <td class="text-xs-center">{{ props.item.order_number }}</td>
                      <td v-if="session.user().role !== 'parent' && session.user().role !== 'child'" class="text-xs-center px-0"><router-link :to="'/summary/'+ props.item.customer_id"><span :id="'human-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('Human', props.item.customer_id, 'human-name-' + props.index) }}</span></router-link></td>
                      <td class="text-xs-center"><router-link :to="'/invoice/'+ props.item._id">{{props.item.invoice_number}}</router-link></td>
                      <td class="text-xs-center px-0">{{ props.item.transaction_type }}</td>
                      <td class="text-xs-center">{{ props.item.amount != null ? props.item.amount : 0 }}</td>
                      <td class="text-xs-center px-0">
                        <v-tooltip top>
                          <v-icon small slot="activator" @click="goTo('invoice/'+props.item._id)">remove_red_eye</v-icon>
                          <span>View Invoice</span>
                        </v-tooltip>
                        <v-tooltip top>
                          <v-icon small slot="activator" @click="deleteItem(props.item)">delete</v-icon>
                          <span>Delete Invoice</span>
                        </v-tooltip>
                      </td>
                    </tr>
                  </template>
S
                  <template v-slot:no-data>
                    <div class="text-xs-center">
                      <v-btn color="primary" @click="bus.$emit('doTextSearch', '')">Reset</v-btn>
                    </div>
                  </template>
                </v-data-table>

              </v-card-text>         
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
</template>

<script>
import Payments from './Payments.vm.js';
export default Payments;
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
