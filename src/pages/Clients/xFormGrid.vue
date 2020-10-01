<template>
<div>
  <h3 class="v-text-field__slot">
    {{ label }}
    <v-btn 
      class="white--text" fab small color="green" 
      @click="bus().$emit('setSubFormDialog', id)"
    >
      <v-icon>add</v-icon>
    </v-btn>
  </h3>
  <v-data-table
      :headers="forms.crud.headers[ id ]"
      :items="forms.crud.values[ id ]"
      
    >
      <template slot="headers" slot-scope="props">
        <tr>
          <th width="60"></th>
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
        <td class="justify-center layout">
          <v-icon small class="mr-2" @click="bus().$emit('editSubFormItem', props.item, id)">edit</v-icon>
          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
        </td>
        <template
          v-for="headerName in Object.keys(getHeadersAsObject(forms.crud.headers[ id ]))"
        >
          <td 
            :key="headerName"
            :width="getGridWidth(getProperty(schemaName, headerName))"
            :style="'overflow: hidden; width:' + getGridWidthForForm(getProperty(schemaName, headerName)) + '; max-width:' + getGridWidthForForm(getProperty(schemaName, headerName)) + '; display:' + getGridDisplay(getProperty(schemaName, headerName))"
          >
            <template v-if="getFormType(getProperty(schemaName, headerName)) === 'text'">
              {{ props.item[headerName] }}
            </template>
            <template v-else-if="getFormType(getProperty(schemaName, headerName)) === 'select'">
              {{ props.item[headerName] }}
            </template>
            <template v-else-if="getFormType(getProperty(schemaName, headerName)) === 'autocomplete'">
              {{ props.item[headerName] }}
            </template>
          <!-- {{headerName}} {{props.item}} 
            <v-edit-dialog
              :return-value.sync="props.item[headerName]"
              large
              lazy
              persistent
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
            >
              <div>
                <template v-if="getFormType(getProperty(schemaName, headerName)) === 'text'">
                  {{ props.item[headerName] }}
                </template>
                <template v-else-if="getFormType(getProperty(schemaName, headerName)) === 'select'">
                  {{ props.item[headerName] }}
                </template>
                <template v-else-if="getFormType(getProperty(schemaName, headerName)) === 'autocomplete'">
                  {{ props.item[headerName] }}
                </template>
              </div>
              <template v-slot:input>
                <div class="mt-3 title">Update {{ headerName }}</div>
              </template>
              <template v-slot:input>
                <template v-if="getFormType(getProperty(schemaName, headerName)) === 'text'">
                  <v-text-field
                    v-model="props.item[headerName]"
                    :rules="[max25chars]"
                    :key="headerName"
                    label="Edit"
                    single-line
                    counter
                    autofocus
                  ></v-text-field>
                </template>
                <template v-else-if="getFormType(getProperty(schemaName, headerName)) === 'select'">
                  <v-select
                    v-model="props.item[headerName]"
                    :items="forms[id].values[ headerName ]"
                    :hint="getFormInfo(getProperty(schemaName, headerName))"
                    :label="getFormLabel(getProperty(schemaName, headerName)) + '' + ( getFormRequired(getEntity(schemaName), headerName) ? ' *' : '' )"
                    :required="getFormRequired(getEntity(schemaName), headerName)"
                    :rules="getFormRules(getEntity(schemaName), headerName, getProperty(schemaName, headerName))"
                    clearable
                    :key="headerName"
                    :multiple="isFormMultiple(getProperty(schemaName, headerName))"
                    persistent-hint
                    menu-props="auto"
                    single-line
                    attach
                    chips
                    >
                    </v-select>
                </template>
                <template v-else-if="getFormType(getProperty(schemaName, headerName)) === 'autocomplete'">
                  <v-autocomplete
                      v-model="props.item[headerName]"
                      :hint="getFormInfo(getProperty(schemaName, headerName))"
                      :items="forms[id].values[ headerName ]"
                      :required="getFormRequired(getEntity(schemaName), headerName)"
                      :rules="getFormRules(getEntity(schemaName), headerName, getProperty(schemaName, headerName))"
                      clearable
                      :label="getFormLabel(getProperty(schemaName, headerName)) + '' + ( getFormRequired(getEntity(schemaName), headerName) ? ' *' : '' )"
                      :multiple="isFormMultiple(getProperty(schemaName, headerName))"
                      :key="headerName"
                      persistent-hint
                      attach
                      chips
                  >
                  </v-autocomplete>
                </template>
                
              </template>
            </v-edit-dialog> -->
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
