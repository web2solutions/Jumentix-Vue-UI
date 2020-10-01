<template>
<div>
<v-dialog
  v-model="dialog_loading"
  hide-overlay
  persistent
  width="300"
  >
  <v-card
    color="primary"
    dark
    >
    <v-card-text>
      Please stand by
      <v-progress-linear
        indeterminate
        color="white"
        class="mb-0"
        ></v-progress-linear>
    </v-card-text>
  </v-card>
</v-dialog>

<!-- START MAIN CRUD FORM -->
<v-dialog 
  v-model="forms.crud.dialog" 
  max-width="800px" 
  persistent
  scrollable
>
  <v-card>
    <v-card-title>
      <span class="headline">{{ forms.crud.editedIndex === -1 ? 'Add ' + entity : 'Edit ' + entity }}</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form_crud" lazy-validation v-model="forms.crud.valid">
      <v-container grid-list-md>
        <v-layout wrap>
          
          <!-- START MAIN CRUD FORM FIELDS -->
          <template v-for="{ 
            id, type, hide, label, info, 
            multiple, required, mask, placeholder, 
            vrules, maxlength, minlength, schema, collection, schemaName, $collection
            } in forms.crud.fields" >
            
            <template v-if="! hide" >
              <template v-if="type === 'text'" >
                <v-flex xs12 :key="id + '-flex'">
                  <v-text-field 
                  v-model="forms.crud.user_values[ id ]" 
                  persistent-hint 
                  clearable
                  counter
                  :hint="info"
                  :label="label + '' + ( required ? ' *' : '' )"
                  :required="required"
                  :rules="vrules"
                  :placeholder="placeholder"
                  :key="id"
                  :maxlength="maxlength"
                  :minlength="minlength"
                  :mask="mask ? mask : undefined"
                  prepend-icon="text_fields"
                  >
                  </v-text-field>
                </v-flex>
              </template>
              <template v-if="type === 'select'" >
                <v-flex :key="id + '-flex'">
                  <v-select
                    v-model="forms.crud.user_values[ id ]"
                    :items="forms.crud.values[ id ]"
                    :hint="info"
                    :label="label + '' + ( required ? ' *' : '' )"
                    :required="required"
                    :rules="vrules"
                    clearable
                    :key="id"
                    :multiple="multiple"
                    persistent-hint
                    menu-props="auto"
                    single-line
                    attach
                    chips
                    prepend-icon="toc"
                    >
                    <template v-if="schema || collection" v-slot:append-outer>
                      <v-icon
                          @click="bus().$emit('setSubFormDialog', id)"
                          v-text="'add'"
                          ></v-icon>
                    </template>
                  </v-select>
                </v-flex>
              </template>
              <template v-if="type === 'switch'" >
                <v-flex :key="id + '-flex'">
                  <v-switch
                    v-model="forms.crud.user_values[ id ]"
                    :label="label + '' + ( required ? ' *' : '' )"
                    prepend-icon="done"
                  ></v-switch>
                </v-flex>
              </template>
              <template v-if="type === 'autocomplete'" >
                <v-flex :key="id + '-flex'">
                  <v-autocomplete
                    v-model="forms.crud.user_values[ id ]"
                    :hint="info"
                    :items="forms.crud.values[ id ]"
                    :required="required"
                    :rules="vrules"
                    clearable
                    :label="label + '' + ( required ? ' *' : '' )"
                    :multiple="multiple"
                    :key="id"
                    persistent-hint
                    attach
                    chips
                    prepend-icon="toc"
                    >
                    <template v-if="schema || collection" v-slot:append-outer>
                      <v-icon
                          @click="bus().$emit('setSubFormDialog', id)"
                          v-text="'add'"
                          ></v-icon>
                    </template>
                  </v-autocomplete>
                </v-flex>
              </template>
              <template v-if="type === 'date' || type === 'date-time'" >
                <v-flex xs12 :key="id + '-flex'">
                  <v-text-field 
                  v-model="forms.crud.user_values[ id ]" 
                  persistent-hint 
                  clearable
                  counter
                  :hint="info"
                  :label="label + '' + ( required ? ' *' : '' )"
                  :required="required"
                  :rules="vrules"
                  :placeholder="placeholder"
                  :key="id"
                  :maxlength="maxlength"
                  :minlength="minlength"
                  :id="'crud_picker_' + id"
                  :append-icon="'date_range'"
                  @click:append="toggleCalendar('#crud_picker_' + id)"
                  @click:prepend="toggleCalendar('#crud_picker_' + id)"
                  prepend-icon="date_range"
                  >
                  </v-text-field>
                  <!-- <flat-pickr v-model="forms.crud.user_values[ id ]" @on-change="onPickerChange" @on-close="onPickerChange"></flat-pickr> --> 
                </v-flex>
              </template>
              <template v-if="type === 'grid'" >
                <v-flex xs12 :key="id + '-flex'">
                  <xFormGrid
                    :label="label"
                    :id="id"
                    :forms="forms"
                    :schema="schema"
                    :schemaName="schemaName"
                    :collection="collection"
                    :$collection="$collection"
                    :ref="id + '-xFormGrid'"
                    prepend-icon="grid_on"
                  ></xFormGrid>
                </v-flex>
              </template>
            </template>
          </template>
          <!-- END MAIN CRUD FORM FIELDS --> 
          
        </v-layout>
      </v-container>
      <small>*indicates required field</small>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-tooltip top>
                <v-btn
                  class="white--text"
                  
                  small
                  color="red"
                  @click="bus().$emit('close')"
                  slot="activator"
                >
                  Close
                  <v-icon right dark>cancel</v-icon>
                </v-btn>
                <span>Close</span>
      </v-tooltip>
      <v-tooltip top>
                <v-btn
                  class="white--text"

                  small
                  color="blue"
                  @click="bus().$emit('save')"
                  slot="activator"
                >
                  Save
                  <v-icon right dark>save</v-icon>
                </v-btn>
                <span>Save</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</v-dialog>
<!-- END MAIN CRUD FORM -->


<!-- START SEARCH FORM -->
<v-dialog 
  v-model="form_search.dialog"
  max-width="800px" 
  persistent
  scrollable
>
  <v-card class="body-1">
    <v-card-title>
      <span class="headline">{{ 'Advanced Search for ' + entity }}</span>
    </v-card-title>
    <v-card-text class="body-1">
      <v-container fluid>
        <v-radio-group v-model="form_search.matching_operator">
          <template v-slot:label> 
            <div>Your search result must contains records based in <strong>one</strong> or <strong>all</strong> set filters</div>
          </template>
          <v-radio value="or">
            <template v-slot:label>
              <div>Must contains <strong class="success--text">One</strong></div>
            </template>
          </v-radio>
          <v-radio value="and">
            <template v-slot:label>
              <div>Must contains <strong class="success--text">All</strong></div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-container>
      <v-form ref="form_search">
      <v-container fluid>
        <v-layout wrap justify-space-between class="body-1">
          
          <!-- START MAIN CRUD FORM FIELDS -->
          <template v-for="{ 
            id, type, hide, label, info, 
            multiple, required, mask, placeholder, 
            vrules, maxlength, minlength, schema, collection, schemaName, $collection, swaggerProperty
            } in forms.crud.fields" >
            
              <template v-if="id !== '_id'" >

                
                <!-- start string fields -->
                <template v-if="swaggerProperty.type === 'string'" >
                  <template v-if="type === 'text'" >
                    <!-- start string formated fields -->
                    <template v-if="swaggerProperty.format" >
                      <template v-if="swaggerProperty.format === 'ssn'" >
                        <v-flex xs12 md6 :key="id + '-flex_query'">
                          <v-select
                            v-model="form_search.operators[ id ]" 
                            :items="query_operators.text"
                            label="Data operator"
                            :key="id + '-operator'"
                            :multiple="false"
                            :required="true" 
                            single-line
                            attach
                            chips
                            
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 md6 :key="id + '-flex'">
                          <v-text-field 
                            v-model="form_search.user_values[ id ]" 
                            clearable
                            :label="label"
                            :key="id"
                            :maxlength="10"
                            :minlength="0"
                            persistent-hint
                            hint="###-##-#### format"
                            mask="###-##-####"
                          >
                          </v-text-field>
                        </v-flex>
                      </template>
                    </template>
                    <!-- end string formated fields -->
                    <!-- start string not formated fields -->
                    <template v-else>
                      <v-flex xs12 md6 :key="id + '-flex_query'">
                        <v-select
                          v-model="form_search.operators[ id ]" 
                          :items="query_operators.text"
                          label="Data operator"
                          :key="id + '-operator'"
                          :multiple="false"
                          :required="true" 
                          single-line
                          attach
                          chips
                          
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 md6 :key="id + '-flex'">
                        <v-text-field 
                        v-model="form_search.user_values[ id ]" 
                        clearable
                        :label="label"
                        :key="id"
                        :maxlength="maxlength"
                        :minlength="minlength"
                        persistent-hint
                        :hint="label"
                        >
                        </v-text-field>
                      </v-flex>
                      
                    </template>
                    <!-- end string not formated fields -->
                  </template>
                  <!-- start string select fields -->
                  <template v-if="type === 'date' || type === 'date-time'" >
                    <v-flex xs12 md6 :key="id + '-flex_query'">
                      <v-select
                        v-model="form_search.operators[ id ]" 
                        :items="query_operators.date_number"
                        label="Data operator"
                        :key="id + '-operator'"
                        :multiple="false"
                        :required="true" 
                        single-line
                        attach
                        chips
                        v-on:change="selectSearchOperator(id, form_search.operators[ id ])"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 md6 :key="id + '-flex'">
                      <v-text-field 
                        v-model="form_search.user_values[ id ]" 
                        clearable
                        :label="label"
                        :key="id+ '_1'"
                        :maxlength="10"
                        :minlength="0"
                        persistent-hint
                        :id="'search_picker_' + id"
                        :append-icon="'date_range'"
                        @click:append="toggleCalendar('#search_picker_' + id)"
                      >
                      </v-text-field>
                    </v-flex>
                    
                  </template>
                  <!-- end string select fields -->
                  <!-- start string select fields -->
                  <template v-if="type === 'select'" >
                    <v-flex xs12 md6 :key="id + '-flex_query'">
                      <v-select
                          v-model="form_search.operators[ id ]" 
                          :items="query_operators.text"
                          label="Data operator"
                          :key="id + '-operator'"
                          :multiple="false"
                          :required="true" 
                          single-line
                          attach
                          chips
                          
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 md6 :key="id + '-flex'">
                      <v-select
                        v-model="form_search.user_values[ id ]"
                        :items="forms.crud.values[ id ]"
                        :hint="label"
                        :label="label"
                        persistent-hint
                        :required="true" 
                        clearable
                        :key="id"
                        :multiple="multiple"
                        menu-props="auto"
                        single-line
                        attach
                        chips
                        >
                      </v-select>
                    </v-flex>
                    
                  </template>
                  <!-- end string select fields -->
                  <!-- start string autocomplete fields -->
                  <template v-if="type === 'autocomplete'" >
                    <v-flex xs12 md6 :key="id + '-flex_query'">
                      <v-select
                          v-model="form_search.operators[ id ]" 
                          :items="query_operators.text"
                          label="Data operator"
                          :key="id + '-operator'"
                          :multiple="false"
                          :required="true"
                          
                          single-line
                          attach
                          chips
                          readonly
                          
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 md6 :key="id + '-flex'">
                      <v-select
                        v-model="form_search.user_values[ id ]"
                        :items="forms.crud.values[ id ]"
                        :hint="label"
                        :label="label"
                        persistent-hint
                        :required="true" 
                        clearable
                        :key="id"
                        :multiple="multiple"
                        menu-props="auto"
                        single-line
                        attach
                        chips
                        >
                      </v-select>
                    </v-flex>
                    
                  </template>
                  <!-- end string autocomplete fields -->
                </template>
                <!-- end string fields -->


                <!-- start number fields -->
                <template v-if="swaggerProperty.type === 'number' || swaggerProperty.type === 'integer'" >
                      <v-flex xs12 md6 :key="id + '-flex_query'">
                          <v-select
                            v-model="form_search.operators[ id ]" 
                            :items="query_operators.date_number"
                            label="Data operator"
                            :key="id + '-operator'"
                            :multiple="false"
                            :required="true" 
                            single-line
                            attach
                            chips
                            
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 md6 :key="id + '-flex'">
                          <v-text-field 
                            v-model="form_search.user_values[ id ]" 
                            clearable
                            :label="label"
                            :key="id"
                            :maxlength="10"
                            :minlength="0"
                            persistent-hint
                            hint="only numbers"
                            mask="###############"
                          >
                          </v-text-field>
                        </v-flex>
                        <v-flex v-if="form_search.operators[ id ] === 'between' || form_search.operators[ id ] === 'notBetween'" xs12 md6 :key="id + '-flex'">
                          <v-text-field 
                            v-model="form_search.user_values[ id + '_2' ]" 
                            clearable
                            label="Up to"
                            :key="id"
                            :maxlength="10"
                            :minlength="0"
                            persistent-hint
                            hint="only numbers"
                            mask="###############"
                          >
                          </v-text-field>
                        </v-flex>
                </template>
                <!-- end number fields -->


                <!-- start array fields -->
                <template v-if="swaggerProperty.type === 'array'" >
                  
                </template>
                <!-- end array fields -->


                <!-- start object fields -->
                <template v-if="swaggerProperty.type === 'object'" >
                  <template v-if="type === 'select'" >
                    <v-flex xs12 md6 :key="id + '-flex_query'">
                      <v-select
                          v-model="form_search.operators[ id ]" 
                          :items="query_operators.text"
                          label="Data operator"
                          
                          :key="id + '-operator'"
                          :multiple="false"
                          :required="true" 
                          single-line
                          attach
                          chips
                          
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 md6 :key="id + '-flex'">
                      <v-select
                        v-model="form_search.user_values[ id ]"
                        :items="forms.crud.values[ id ]"
                        :label="label"
                        :hint="label"
                        persistent-hint
                        :required="true" 
                        clearable
                        :key="id"
                        :multiple="true"
                        menu-props="auto"
                        single-line
                        attach
                        chips
                        >
                      </v-select>
                    </v-flex>
                    
                  </template>

                </template>
                <!-- end object fields -->

                <!-- start boolean fields -->
                <template v-if="swaggerProperty.type === 'boolean'" >
                  
                </template>
                <!-- end boolean fields -->


              </template>
          </template>
          <!-- <template>
            <v-flex xs12 sm6 md6>
              <v-select
                :items="query_operators.date_number"
                v-model="form_search.operators.createdAt" 
                label="Data operator"
                :multiple="false"
                :required="true" 
                single-line
                attach
                chips
                
              ></v-select>
            </v-flex>
            <v-flex xs12 md3>
              <v-text-field 
                v-model="form_search.user_values.createdAt" 
                clearable
                label="Created at"
                :maxlength="10"
                :minlength="0"
                persistent-hint
                hint="yyyy-mm-dd hh:mm format"
                mask="####-##-## ##:##"
              >
            </v-text-field>
            </v-flex>
            <v-flex xs12 md3 v-if="form_search.operators.createdAt === 'between' || form_search.operators.createdAt === 'notBetween'" >
              <v-text-field 
                v-model="form_search.user_values.createdAt_2" 
                clearable
                label="Up to"
                :maxlength="10"
                :minlength="0"
                persistent-hint
                hint="yyyy-mm-dd hh:mm format"
                mask="####-##-## ##:##"
              >
            </v-text-field>
            </v-flex>
          </template> -->
          <!-- <template>
            <v-flex xs12 sm6 md6>
              <v-select
                :items="query_operators.date_number"
                v-model="form_search.operators.updatedAt" 
                label="Data operator"
                :multiple="false"
                :required="true" 
                single-line
                attach
                chips
                
              ></v-select>
            </v-flex>
            <v-flex xs12 md3>
              <v-text-field 
                v-model="form_search.user_values.updatedAt" 
                clearable
                label="Updated at"
                :maxlength="10"
                :minlength="0"
                persistent-hint
                hint="yyyy-mm-dd hh:mm format"
                mask="####-##-## ##:##"
              >
            </v-text-field>
            </v-flex>
            <v-flex xs12 md3 v-if="form_search.operators.updatedAt === 'between' || form_search.operators.updatedAt === 'notBetween'" >
              <v-text-field 
                v-model="form_search.user_values.updatedAt_2" 
                clearable
                label="Up to"
                :maxlength="10"
                :minlength="0"
                persistent-hint
                hint="yyyy-mm-dd hh:mm format"
                mask="####-##-## ##:##"
              >
            </v-text-field>
            </v-flex>
          </template>-->
          <!-- END MAIN CRUD FORM FIELDS --> 
          
        </v-layout>
      </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <v-btn
          class="white--text"
          
          small
          color="red"
          @click="bus().$emit('setDialogSearch')"
          slot="activator"
        >
          Cancel
          <v-icon right dark>cancel</v-icon>
        </v-btn>
        <span>Cancel and Close</span>
      </v-tooltip>
      <v-tooltip top>
        <v-btn
          class="white--text"

          small
          color="blue"
          @click="bus().$emit('doAdvancedSearch')"
          slot="activator"
        >
          Search and Close
          <v-icon right dark>find_in_page</v-icon>
        </v-btn>
        <span>Search and Close</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</v-dialog>
<!-- END SEARCH FORM -->


<template v-for="form in forms" > 
  <template v-if="form.name !== 'crud'" >
     
      <div :key="'sub_form_wrapper_'+ form.name">
        <v-dialog v-model="form.dialog" persistent max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ forms[form.name].editedIndex === -1 ? 'Add' : 'Edit' }} - {{form.title}}</span>
            </v-card-title>
            <v-card-text>
              <v-form lazy-validation :ref="'form_'+form.name" v-model="form.valid" :key="'sub_form_'+ form.name">
              <v-container grid-list-md>
                <v-layout wrap>
                  
                  <!-- START Auxiliar FORM FIELDS -->
                  <!-- schema: {{form.schema}} <br>
                  schema name: {{form.schemaName}} <br>
                  isSchema: {{form.isSchema}} <br>
                  collection: {{form.collection}} <br> -->
                  <template v-for="{ 
                    id, type, hide, label, info, 
                    multiple, required, mask, 
                    placeholder, vrules, maxlength, 
                    minlength
                    } in form.fields" >
                    
                    <template v-if="! hide" >
                      <template v-if="type === 'text'" >
                        <v-flex xs12 :key="id + '-flex'">
                          <v-text-field
                          v-model="form.user_values[ id ]" 
                          clearable
                          persistent-hint 
                          counter
                          :hint="info" 
                          :required="required" 
                          :rules="vrules"
                          :placeholder="placeholder"
                          :label="label + '' + ( required ? ' *' : '' )"
                          :key="id"
                          :maxlength="maxlength"
                          :minlength="minlength"
                          :mask="mask ? mask : undefined"
                          prepend-icon="text_fields"
                          ></v-text-field>
                        </v-flex>
                      </template>
                      <template v-if="type === 'textarea'" >
                        <v-flex xs12 :key="id + '-flex'">
                          <v-textarea
                          v-model="form.user_values[ id ]" 
                          clearable
                          persistent-hint 
                          counter
                          box
                          :hint="info" 
                          :required="required" 
                          :rules="vrules"
                          :placeholder="placeholder"
                          :label="label + '' + ( required ? ' *' : '' )"
                          :key="id"
                          prepend-icon="text_fields"
                          ></v-textarea>
                        </v-flex>
                      </template>
                      <template v-if="type === 'select'" >
                        <v-flex :key="id + '-flex'">
                          <v-select
                            v-model="form.user_values[ id ]" 
                            :items="form.values[ id ]"
                            :hint="info"
                            :label="label + '' + ( required ? ' *' : '' )"
                            :key="id"
                            :multiple="multiple"
                            :required="required" 
                            :rules="vrules"
                            clearable
                            persistent-hint
                            single-line
                            attach
                            chips
                            prepend-icon="toc"
                            ></v-select>
                        </v-flex>
                      </template>
                      <template v-if="type === 'autocomplete'" >
                        <v-flex :key="id + '-flex'">
                          <v-autocomplete
                            v-model="form.user_values[ id ]"
                            :hint="info"
                            :items="form.values[ id ]"
                            :label="label + '' + ( required ? ' *' : '' )"
                            :multiple="multiple"
                            :key="id"
                            :required="required" 
                            :rules="vrules"
                            clearable
                            persistent-hint
                            attach
                            chips
                            prepend-icon="toc"
                            >
                          </v-autocomplete>
                        </v-flex>
                      </template>
                      
                      <template v-if="type === 'switch'" >
                        <v-flex xs12 :key="id + '-flex'">
                          <v-switch
                            v-model="form.user_values[ id ]"
                            :label="`${label}: ${form.user_values[ id ].toString()}`"
                            prepend-icon="done"
                          ></v-switch>
                        </v-flex>
                      </template>
                      <template v-if="type === 'date' || type === 'date-time'" >
                        <v-flex xs12 :key="id + '-flex'">
                          <v-text-field 
                          v-model="form.user_values[id]" 
                          persistent-hint 
                          clearable
                          counter
                          :hint="info"
                          :label="label + '' + ( required ? ' *' : '' )"
                          :required="required"
                          :rules="vrules"
                          :placeholder="placeholder"
                          :key="id"
                          :maxlength="maxlength"
                          :minlength="minlength"
                          :id="form.name + '_picker_' + id"
                          :append-icon="'date_range'"
                          @click:append="toggleCalendar('#' + form.name + '_picker_' + id)"
                          @click:prepend="toggleCalendar('#' + form.name + '_picker_' + id)"
                          prepend-icon="date_range"
                          >
                          
                          </v-text-field>
                          <!-- <flat-pickr v-model="forms.crud.user_values[ id ]" @on-change="onPickerChange" @on-close="onPickerChange"></flat-pickr> --> 
                        </v-flex>
                      </template>
                    </template>
                  </template>
                  <!-- END Auxiliar FORM FIELDS -->
                   
                </v-layout>
              </v-container>
              </v-form>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <v-btn
                  class="white--text"
                  
                  small
                  color="red"
                  @click="bus().$emit('setSubFormDialog', form.name)"
                  slot="activator"
                >
                  Close
                  <v-icon right dark>cancel</v-icon>
                </v-btn>
                <span>Close</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn
                  class="white--text"

                  small
                  color="blue"
                  @click="bus().$emit('saveSubForm', form.name)"
                  slot="activator"
                >
                  Save
                  <v-icon right dark>save</v-icon>
                </v-btn>
                <span>Save</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-dialog>


      </div>
    
  </template>
</template>



</div>
</template>

<script>
import xForm from './xForm.vm.js';
export default xForm;
</script>
<style lang="css">

.flatpickr-input{
    width: 100%;
}
.flatpickr-wrapper{
    width: 100% !important;
}
</style>
