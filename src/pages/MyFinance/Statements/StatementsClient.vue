<template>
    <v-container id="StatementsClient">
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
                          Statement Date
                        </th>
                        <th
                          align="center"
                          v-if="!props.hide"
                          :class="['column sortable', pagination.descending ? 'desc' : 'asc', 'order_number' === pagination.sortBy ? 'active' : '']"
                          @click="changeSort('order_number')"
                        >
                          <v-icon small>arrow_upward</v-icon>
                          Case Number
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
                      <td class="text-xs-center px-0" width="140px"><router-link :to="'/statement/'+ props.item.drawee_human">{{ moment(props.item.createdAt).format('LL') }}</router-link></td>
                      <td class="text-xs-center px-0">Adopt{{ new Date(props.item.due_date).getTime() }}-AP</td>
                    </tr>
                  </template>

                    
                    
                    <template v-slot:no-data>
                      <v-btn color="primary">Reset</v-btn>
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
import StatementsClient from './StatementsClient.vm.js';
export default StatementsClient;
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
