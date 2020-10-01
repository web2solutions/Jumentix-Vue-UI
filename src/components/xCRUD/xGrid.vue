<template>
  <v-data-table v-if="displayWhat === 'grid'"
    :headers="headers"
    :items="documents"
    :expand="expand"
    :pagination.sync="pagination"
    :total-items="totalDocuments"
    :hide-actions="totalDocuments < 11 ? true : false"
    :loading="loading"
    :item-key="itemKey"
    :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
    select-all
    v-model="selected"
    class="elevation-1 fixed-header v-table__overflow"
    style="max-height: calc(74vh - 10px);backface-visibility: hidden;"
    id="grid_data"
    >
    <template slot="headers" slot-scope="props">
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
        <th width="70"></th>
        <template v-for="{ text, align, sortable, id, hide, width, label } in props.headers">
          <th
            :align="align"
            :key="id"
            :width="width"
            v-if="! hide"
            :class="['column sortable', pagination.descending ? 'desc' : 'asc', id === pagination.sortBy ? 'active' : '']"
            @click="changeSort(id)"
            >
            <v-icon small>arrow_upward</v-icon>
            {{ label }}
          </th>
        </template>
        
      </tr>
    </template>
    <template slot="items" slot-scope="props">
      <tr 
        :active="props.selected" 
        :class="(original_documents[ props.index ].deleted ? 'deleted' : '')"
        
      >
        <td>
          <v-checkbox
            :input-value="props.selected"
            primary
            hide-details
            @click.stop="toggleOne(props.item)"
            ></v-checkbox>
        </td>
        <td 
          class="justify-center layout ma-0">
          <!-- <v-icon small class="mr-2" @click="previewItem(props.index); props.expanded = !props.expanded">launch</v-icon> -->

          <!-- <template
            v-if="! original_documents[ props.index ].deleted"
          > -->
          <template>
          <v-icon
           small 
           class="mr-2" 
           @click="editItem(props.index)"
          >edit</v-icon>

          <v-icon 
          small 
          @click="deleteItem(props.item)"
        >delete</v-icon>
          </template>
           <template
            v-if="original_documents[ props.index ].deleted"
          >
          <v-icon
           small 
           class="mr-2" 
          >edit</v-icon>

          <v-icon 
          small 
        >delete</v-icon>
          </template>
        </td>
        <template v-for="{ text, align, sortable, id, hide, width, label, $collection } in headers">
          
          <template v-if=" ! (!!swagger.definitions[entity].properties[id]['x-ui'].grid.hide) ">
            <td 
              :key="id" 
              :width="getGridWidth(swagger.definitions[entity].properties[id])"
              style="overflow: hidden;"
              :align="getGridColAlign(swagger.definitions[entity].properties[id])"
            >
              <template>
                <template v-if="getFormType(swagger.definitions[entity].properties[id]) === 'currency'">
                  {{ props.item[id].toLocaleString(session.user().language, { style: 'currency', currency: session.user().currency_code }) }}
                </template>
                <template v-else-if="getFormType(swagger.definitions[entity].properties[id]) === 'number'">
                  {{ props.item[id].toLocaleString(session.user().language) }}
                </template>
                <template v-else-if="getFormType(swagger.definitions[entity].properties[id]) === 'autocomplete'">
                  <template v-if="$collection">
                    <div :id="'sel_' + id + '_' + props.index">

                      <v-progress-linear :indeterminate="true"></v-progress-linear>

                    </div>
                    {{ fillField($collection, props.item[id], 'sel_' + id + '_' + props.index) }}
                  </template>
                  <template v-else>
                    {{ props.item[id] }}
                  </template>
                </template>
                <template v-else-if="getFormType(swagger.definitions[entity].properties[id]) === 'select'">
                  <template v-if="$collection">
                    <div :id="'sel_' + id + '_' + props.index">

                      <v-progress-linear :indeterminate="true"></v-progress-linear>
            
                    </div>
                    {{ fillField($collection, props.item[id], 'sel_' + id + '_' + props.index) }}
                  </template>
                  <template v-else>
                    {{ props.item[id] }}
                  </template>
                </template>
                <template v-else>
                  {{ props.item[id] }}
                </template>
              </template>
            </td>
          </template>

        </template>

        <!--<template
           v-for="(value, key) in props.item"
        >
          <td 
            :key="key" 
            :width="getGridWidth(swagger.definitions[entity].properties[key])"
            style="overflow: hidden;"
            :align="getGridColAlign(swagger.definitions[entity].properties[key])"
          >
          <template>

            <template v-if="getFormType(swagger.definitions[entity].properties[key]) === 'currency'">
              {{ parseFloat(value).toFixed(2) }}
            </template>
            <template v-else-if="getFormType(swagger.definitions[entity].properties[key]) === 'autocomplete'">
              {{ key }} - {{ forms.crud.fields }}
            </template>
            <template v-else-if="getFormType(swagger.definitions[entity].properties[key]) === 'select'">
              {{ key }} - {{ forms.crud.fields }}
            </template>


            <template v-else>
              {{ value }}
            </template>
          </template>
          
          </td>
        </template>-->
      </tr>
    </template>
    <template slot="expand" slot-scope="props">
      <v-card flat>
        <v-container grid-list-md>
          <v-layout wrap>
            <!-- <template v-for="(value, key) in original_documents[ props.index ]" >
              <template>
                <v-flex xs12 md6 :key="key + '-flex-detail'">
                  <v-text-field 
                  persistent-hint 
                  :readonly="true"
                  :label="String(key)"
                  :key="key"
                  :value="value"
                  :disabled="true"
                  prepend-icon="text_fields"
                  >
                  </v-text-field>
                </v-flex>
              </template>
          </template> -->
          
          </v-layout>
        </v-container>
        
      </v-card>
    </template>
    <template slot="no-data" :value="true" color="error" icon="warning">
      <v-alert :value="true" color="error" icon="warning">
        Sorry, nothing to display here :(
      </v-alert>
    </template>
    <template slot="no-results" :value="true" color="error" icon="warning">
      <v-alert :value="true" color="error" icon="warning">
        Sorry, nothing to display here :(
      </v-alert>
    </template>
  </v-data-table>
</template>

<script>
import xGrid from './xGrid.vm.js';
export default xGrid;
</script>

<style lang="stylus">
.theme--dark .v-table thead th {
background-color: #424242;
}

.theme--light .v-table thead th {
background-color: #ffffff;
}

.deleted {
  background-color: #ffcdd2 !important;
}

.deleted:hover { 
  background-color: red !important;
  color: white;
}

/* Theme */
.fixed-header
  &
      display: flex
      flex-direction: column
      height: 100%

  table
      table-layout: fixed

  th
      position: sticky
      top: 0
      z-index: 5

      &:after
          content: ''
          position: absolute
          left: 0
          bottom: 0
          width: 100%

  tr.v-datatable__progress
      th
          // top: 56px
          height: 1px;

  .v-table__overflow
      flex-grow: 1
      flex-shrink: 1
      overflow-x: auto
      overflow-y: auto
      // overflow: auto
      // height: 100%

  .v-datatable.v-table
      flex-grow: 0
      flex-shrink: 1

      .v-datatable__actions
          flex-wrap: nowrap

          .v-datatable__actions__pagination
              white-space: nowrap

</style>
