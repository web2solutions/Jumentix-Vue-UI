<template>
<div>
  <h3 class="v-text-field__slot">
    {{ info }} 
    <v-btn
      v-if="editable"
      class="white--text" fab small color="primary" 
      @click="bus.$emit('openSubForm', id)"
    >
      <v-icon>add</v-icon>
    </v-btn>
  </h3>
  <v-data-table
      :headers="forms.crud.headers[ id ]"
      :items="forms.crud.values[ id ]"
      :hide-actions="forms.crud.values[ id ] ? forms.crud.values[ id ].length < 6 ? true : false : true"
    >
      <template slot="headers" slot-scope="props">
        <tr style="cursor: pointer;">
          <th v-if="editable" width="60"></th>
          <template v-for="{ text, align, sortable, id, hide, width, label } in props.headers">
            <th
              align="left"
              :key="id"
              :width="width"
              :style="'overflow: hidden; display:' + getGridDisplay(getProperty(schemaName, id))"
              v-if="! hide"
              >
              <!-- <v-icon small>arrow_upward</v-icon> -->
              {{ label }}
            </th>
          </template>
        </tr>
      </template>
      <template v-slot:items="props">
        <td v-if="editable" class="justify-center layout">
          <v-icon v-if="editable" small class="mr-2" @click="bus.$emit('editSubFormItem', forms.crud.user_values[ id ][props.index], id, props.index)">edit</v-icon>
          <v-icon v-if="editable" small @click="bus.$emit('deleteSubFormItem', props.item, id, props.index)">delete</v-icon>
        </td>
        <template
          v-for="headerName in Object.keys(getHeadersAsObject(forms.crud.headers[ id ]))"
        >
          <td 
            :key="headerName"
            :width="getGridWidth(getProperty(schemaName, headerName))"
            @click="bus.$emit(isUploader ? 'previewUploadedFile' : 'previewSubFormItem', forms.crud.user_values[ id ][props.index], id, props.index)"
            :style="'cursor: pointer; overflow: hidden; width:' + getGridWidthForForm(getProperty(schemaName, headerName)) + '; max-width:' + getGridWidthForForm(getProperty(schemaName, headerName)) + '; display:' + getGridDisplay(getProperty(schemaName, headerName))"
          >
            <template v-if="getFormType(getProperty(schemaName, headerName)) === 'text'">
              {{ props.item[headerName] }}
            </template>
            <template v-else-if="getFormType(getProperty(schemaName, headerName)) === 'select'">
              <template v-if="getFieldCollectionSettings(getProperty(schemaName, headerName))">
                  <div :id="'sel_xform_' + schemaName + '_' + headerName + '_' + props.index">

                      <v-progress-linear :indeterminate="true"></v-progress-linear>
            
                    </div>
                    {{ fillField(getFieldCollectionSettings(getProperty(schemaName, headerName)), props.item[headerName], 'sel_xform_' + schemaName + '_' + headerName + '_' + props.index) }}
                </template>
                <template v-else>
                  {{ props.item[headerName] }}
              </template>
            </template>
            <template v-else-if="getFormType(getProperty(schemaName, headerName)) === 'combobox'">
              <template v-if="getFieldCollectionSettings(getProperty(schemaName, headerName))">
                  <div :id="'sel_xform_' + schemaName + '_' + headerName + '_' + props.index">

                      <v-progress-linear :indeterminate="true"></v-progress-linear>
            
                    </div>
                    {{ fillField(getFieldCollectionSettings(getProperty(schemaName, headerName)), props.item[headerName], 'sel_xform_' + schemaName + '_' + headerName + '_' + props.index) }}
                </template>
                <template v-else>
                  {{ props.item[headerName] }}
              </template>
            </template>
            <template v-else-if="getFormType(getProperty(schemaName, headerName)) === 'autocomplete'">
              <template v-if="getFieldCollectionSettings(getProperty(schemaName, headerName))">
                <div :id="'sel_xform_' + schemaName + '_' + headerName + '_' + props.index">
                  <v-progress-linear :indeterminate="true"></v-progress-linear>
                </div>
                {{ fillField(getFieldCollectionSettings(getProperty(schemaName, headerName)), props.item[headerName], 'sel_xform_' + schemaName + '_' + headerName + '_' + props.index) }}
              </template>
              <template v-else>
                {{ props.item[headerName] }}
              </template>
            </template>

            <template v-else-if="getFormType(getProperty(schemaName, headerName)) === 'date-time'">
              {{ props.item[headerName] }}
            </template>
            <template v-else-if="getFormType(getProperty(schemaName, headerName)) === 'date'">
              {{ props.item[headerName] }}
            </template>
            <template v-else-if="getFormType(getProperty(schemaName, headerName)) === 'currency'">
              {{ props.item[headerName].toLocaleString(session.user().language, { style: 'currency', currency: session.user().currency_code }) }}
              
            </template>
            <template v-else-if="getFormType(getProperty(schemaName, headerName)) === 'number'">
              {{ props.item[headerName].toLocaleString(session.user().language) }}
            </template>
            <template v-else>
              {{ props.item[headerName] }}
             
            </template>
          </td>
        </template>

      </template>
    </v-data-table>
</div>
</template>

<script>
import xFormGrid from './xFormGrid.vm.js';
export default xFormGrid;
</script>
