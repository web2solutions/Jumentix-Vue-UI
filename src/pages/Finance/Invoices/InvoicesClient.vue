<template>
    <v-container id="InvoicesClient">
      <component-menu-nav></component-menu-nav>
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
                          :class="['column sortable', pagination.descending ? 'desc' : 'asc', 'invoice_number' === pagination.sortBy ? 'active' : '']"
                          @click="changeSort('invoice_number')"
                        >
                          <v-icon small>arrow_upward</v-icon>
                          Invoice#
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
                          v-if="!props.hide"
                          :class="['column sortable', pagination.descending ? 'desc' : 'asc', 'status' === pagination.sortBy ? 'active' : '']"
                          @click="changeSort('status')"
                        >
                          <v-icon small>arrow_upward</v-icon>
                         Status
                        </th>
                        <th
                          align="center"
                          v-if="!props.hide"
                          :class="['column sortable', pagination.descending ? 'desc' : 'asc', 'due_date' === pagination.sortBy ? 'active' : '']"
                          @click="changeSort('due_date')"
                        >
                          <v-icon small>arrow_upward</v-icon>
                          Due Date
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
                      <td class="text-xs-center px-0" width="140px">{{ moment(props.item.createdAt).format('LL') }}</td>
                      <td class="text-xs-center"><router-link :to="'/invoice/'+ props.item._id">{{props.item.invoice_number}}</router-link></td>
                      <td class="text-xs-center">{{ props.item.order_number }}</td>
                      <td class="text-xs-center px-0" :class="props.item.statusColor">{{ props.item.status }}</td>
                      <td class="text-xs-center px-0">{{ moment(new Date(props.item.due_date).toISOString().substr(0, 10)).format('LL') }}</td>
                      <td class="text-xs-center">$ {{ props.item.amount != null ? props.item.amount : 0 }}</td>
                      <td class="text-xs-center px-0">
                        <v-tooltip top>
                          <v-icon small slot="activator" @click="goTo('/invoice-edit/' + props.item._id)">edit</v-icon>
                          <span>Edit Invoice</span>
                        </v-tooltip>
                        <v-tooltip top>
                          <v-icon small slot="activator" @click="deleteItem(props.item)">delete</v-icon>
                          <span>Delete Invoice</span>
                        </v-tooltip>
                        <v-tooltip top v-if="props.item.status !== 'Paid'">
                          <v-icon small slot="activator" @click="goTo('/invoice-payment/' + props.item._id)">fas fa-file-invoice-dollar</v-icon>
                          <span>Pay Invoice</span>
                        </v-tooltip>
                      </td>
                    </tr>
                  </template>

                  <template v-slot:no-data>
                    <span class="text-xs-center d-block">No invoices created</span>
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
import InvoicesClient from './InvoicesClient.vm.js';
export default InvoicesClient;
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
