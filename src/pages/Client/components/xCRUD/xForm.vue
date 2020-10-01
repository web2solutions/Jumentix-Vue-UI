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
<!-- <v-dialog 
  v-model="forms.crud.dialog" 
  max-width="800px" 
  persistent
  scrollable
> -->
  <v-card v-if="displayWhat === 'crud'">
    <v-card-title v-if="showHeadline" :key="displayWhat">
      <span class="headline">{{ forms.crud.editedIndex === -1 ? 'Add ' + $route.meta.title : 'Edit ' + $route.meta.title }}</span>
    </v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-tooltip top v-if="!hideCloseButton">
                <v-btn
                  class="white--text"
                  
                  small
                  color="red"
                  @click="bus.$emit($route.params.action === 'edit' ? 'closeEdit' : 'close', $route.params.id)"
                  slot="activator"
                  :id="entity + '_bt_close'"
                  :key="entity + '_bt_close'"
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
                  color="primary"
                  @click="bus.$emit('save', isFormSimple, isHideOnFormSimpleSave)"
                  slot="activator"
                  :id="entity + '_bt_save'"
                  :key="entity + '_bt_save'"
                >
                  Save
                  <v-icon right dark>save</v-icon>
                </v-btn>
                <span>Save</span>
      </v-tooltip>
    </v-card-actions>
    <v-card-text>
      
        <v-form :ref="'form_crud_'+entity" lazy-validation v-model="forms.crud.valid">
        <v-container grid-list-md>
          <v-layout wrap>
            
            <!-- START MAIN CRUD FORM FIELDS -->
            <template v-for="{ 
              id, type, hide, label, info, 
              multiple, required, mask, placeholder, isUploader,
              vrules, maxlength, minlength, schema, collection, schemaName, $collection, accept, size, formFileType, editable
              } in forms.crud.fields" >
              
              <template v-if="! hide" >
                <template v-if="type === 'text'" >
                  <v-flex xs12 md6 :key="id + '-flex'">
                    <v-text-field 
                    v-model="forms.crud.user_values[ id ]" 
                    persistent-hint 
                    :clearable="editable"
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
                    :readonly="(!editable) && (currentFormMode !=='create')"
                    prepend-icon="text_fields"
                    :validate-on-blur="true"
                    >
                    </v-text-field>
                  </v-flex>
                </template>
                <template v-if="type === 'currency'" >
                  <v-flex xs12 md6 :key="id + '-flex'">
                    <v-currency-field 
                      v-bind="currency_config" 
                      v-model="forms.crud.user_values[ id ]" 
                      persistent-hint 
                      counter
                      :hint="info"
                      :label="label + '' + ( required ? ' *' : '' )"
                      :required="required"
                      :rules="vrules"
                      :placeholder="placeholder"
                      :key="id"
                      :readonly="(!editable) && (currentFormMode !=='create')"
                      prepend-icon="text_fields"
                      :validate-on-blur="true"
                    >
                    </v-currency-field>
                  </v-flex>
                </template>
                <template v-if="type === 'number'" >
                  <v-flex xs12 md6 :key="id + '-flex'">
                    <v-text-field
                    type="number"
                    v-model="forms.crud.user_values[ id ]" 
                    persistent-hint 
                    :clearable="editable"
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
                    :readonly="(!editable) && (currentFormMode !=='create')"
                    prepend-icon="text_fields"
                    :validate-on-blur="true"
                    >
                    </v-text-field>
                  </v-flex>
                </template>
                <template v-if="type === 'integer'" >
                  <v-flex xs12 md6 :key="id + '-flex'">
                    <v-text-field
                    type="number"
                    v-model="forms.crud.user_values[ id ]" 
                    persistent-hint 
                    :clearable="editable"
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
                    :readonly="(!editable) && (currentFormMode !=='create')"
                    prepend-icon="text_fields"
                    :validate-on-blur="true"
                    >
                    </v-text-field>
                  </v-flex>
                </template>
                <template v-if="type === 'password'" >
                  <v-flex xs12 md6 :key="id + '-flex'">
                    <v-text-field
                    type="password"
                    v-model="forms.crud.user_values[ id ]" 
                    persistent-hint 
                    :clearable="editable"
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
                    :readonly="(!editable) && (currentFormMode !=='create')"
                    prepend-icon="text_fields"
                    :validate-on-blur="true"
                    >
                    </v-text-field>
                  </v-flex>
                </template>
                <template v-if="type === 'textarea'" >
                  <v-flex xs12 :key="id + '-flex'">
                    <v-textarea 
                    v-model="forms.crud.user_values[ id ]" 
                    persistent-hint 
                    :clearable="editable"
                    counter
                    :hint="info"
                    :label="label + '' + ( required ? ' *' : '' )"
                    :required="required"
                    :rules="vrules"
                    :placeholder="placeholder"
                    :key="id"
                    :readonly="(!editable) && (currentFormMode !=='create')"
                    prepend-icon="text_fields"
                    :validate-on-blur="true"
                    >
                    </v-textarea>
                  </v-flex>
                </template>
                <template v-if="type === 'editor'" >
                  <v-flex xs12 :key="id + '-flex'">
                    <ckeditor 
                      :editor="editor" 
                      v-model="forms.crud.user_values[ id ]" 
                      :config="editorConfig"
                      :key="id"
                      :hint="info"
                      :label="label + '' + ( required ? ' *' : '' )"
                      :required="required"
                      style="height:200px"
                    >
                    </ckeditor>
                  </v-flex>
                </template>
                
                <template v-if="type === 'base64'" >
                  
                  <v-flex xs12 md6 :key="id + '-flex'">
                    <div>
                      <h3 class="v-text-field__slot">
                        {{ label }}
                      </h3>
                      
                      <template v-if="formFileType === 'avatar'" >
                        <v-avatar
                          :tile="false"
                          :size="128"
                          color="grey lighten-4"
                        >
                          <img class="preview" v-if="!!forms.crud.user_values[ id ]" v-bind:src="forms.crud.user_values[ id ]" :alt="label">
                          <img class="preview" v-if="! !!forms.crud.user_values[ id ]" src="/static/avatar.png" :alt="label">
                        </v-avatar>
                      </template>
                      <template v-if="formFileType === 'image'" >
                        <img class="preview" v-if="!!forms.crud.user_values[ id ]" height="128" v-bind:src="forms.crud.user_values[ id ]" :alt="label">
                        <img class="preview" v-if="! !!forms.crud.user_values[ id ]" height="128" src="/static/image.png" :alt="label">
                      </template>
                      <template v-if="formFileType === 'document'" >
                      </template>
                      <upload-btn
                        title=""
                        :noTitleUpdate="true"
                        :key="id"
                        :name="id+ '-file'"
                        :parentFieldName="id"
                        :accept="accept"
                        :size="size"
                        :readonly="(!editable) && (currentFormMode !=='create')"
                        @file-update="uploadBase64"
                      >
                        <template slot="icon-left">
                          <v-icon left>add</v-icon>
                        </template>
                      </upload-btn>
                      <p><small>{{ info }}</small></p>
                      <p><small><b>max ({{ size / 1024 }}) KB</b></small></p>
                    </div>
                    <!--
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
                    </v-text-field> -->
                  </v-flex>
                </template>
                <template v-if="type === 'select'" >
                  <v-flex xs12 md6 :key="id + '-flex'">
                    <v-select
                      v-model="forms.crud.user_values[ id ]"
                      :items="forms.crud.values[ id ]"
                      :hint="info"
                      :label="label + '' + ( required ? ' *' : '' )"
                      :required="required"
                      :rules="vrules"
                      :clearable="editable"
                      :validate-on-blur="true"
                      :key="id"
                      :multiple="multiple"
                      :readonly="(!editable) && (currentFormMode !=='create')"
                      persistent-hint
                      menu-props="auto"
                      single-line
                      attach
                      chips
                      prepend-icon="toc"
                      >
                      <template v-if="schema || collection" v-slot:append-outer>
                        <v-icon
                            @click="bus.$emit('openSubForm', id)"
                            v-text="'add'"
                            ></v-icon>
                      </template>
                    </v-select>
                  </v-flex>
                </template>
                <template v-if="type === 'combobox'" >
                  <v-flex xs12 md6 :key="id + '-flex'">
                    
                    <v-select
                      v-model="forms.crud.user_values[ id ]"
                      :items="forms.crud.values[ id ]"
                      :hint="info"
                      :label="label + '' + ( required ? ' *' : '' )"
                      :required="required"
                      :rules="vrules"
                      :clearable="editable"
                      :validate-on-blur="true"
                      :key="id"
                      :multiple="multiple"
                      :readonly="(!editable) && (currentFormMode !=='create')"
                      persistent-hint
                      menu-props="auto"
                      single-line
                      attach
                      chips
                      prepend-icon="toc"
                      >
                      <template v-if="schema || collection" v-slot:append-outer>
                        <v-icon
                            @click="bus.$emit('openSubForm', id)"
                            v-text="'add'"
                            ></v-icon>
                      </template>
                    </v-select>
                  <!-- <v-combobox
                      v-model="forms.crud.user_values[ id ]"
                      :items="forms.crud.values[ id ]"
                      :hint="info"
                      :label="label + '' + ( required ? ' *' : '' )"
                      :required="required"
                      :rules="vrules"
                      :clearable="editable"
                      :validate-on-blur="true"
                      :key="id"
                      :multiple="multiple"
                      :readonly="(!editable) && (currentFormMode !=='create')"
                      persistent-hint
                      menu-props="auto"
                      single-line
                      attach
                      chips
                      prepend-icon="toc"
                    >
                      <template v-if="schema || collection" v-slot:append-outer>
                        <v-icon
                            @click="bus.$emit('openSubForm', id)"
                            v-text="'add'"
                            ></v-icon>
                      </template>
                    </v-combobox> -->
                    
                  </v-flex>
                </template>
                <template v-if="type === 'switch'" >
                  <v-flex xs12 md6 :key="id + '-flex'">
                    <v-switch
                      v-model="forms.crud.user_values[ id ]"
                      :label="label + '' + ( required ? ' *' : '' )"
                      :readonly="(!editable) && (currentFormMode !=='create')"
                      prepend-icon="done"
                    ></v-switch>
                  </v-flex>
                </template>
                <template xs12 v-if="type === 'autocomplete'" >
                  <v-flex :key="id + '-flex'">
                    <v-autocomplete
                      v-model="forms.crud.user_values[ id ]"
                      :hint="info"
                      :items="forms.crud.values[ id ]"
                      :required="required"
                      :rules="vrules"
                      :clearable="editable"
                      :validate-on-blur="true"
                      :label="label + '' + ( required ? ' *' : '' )"
                      :multiple="multiple"
                      :key="id"
                      :readonly="(!editable) && (currentFormMode !=='create')"
                      persistent-hint
                      attach
                      chips
                      prepend-icon="toc"
                      >
                      <template v-if="schema || collection" v-slot:append-outer>
                        <v-icon
                            @click="bus.$emit('openSubForm', id)"
                            v-text="'add'"
                            ></v-icon>
                      </template>
                    </v-autocomplete>
                  </v-flex>
                </template>
                <template v-if="type === 'date' || type === 'date-time'" >
                  <v-flex xs12 md6 :key="id + '-flex'">
                    <v-text-field 
                    v-model="forms.crud.user_values[ id ]" 
                    persistent-hint 
                    :clearable="editable"
                    :validate-on-blur="true"
                    counter
                    :hint="info"
                    :label="label + '' + ( required ? ' *' : '' )"
                    :required="required"
                    :rules="vrules"
                    :placeholder="placeholder"
                    :key="id"
                    :maxlength="maxlength"
                    :minlength="minlength"
                    :id=" entity + '_picker_' + id"
                    :readonly="(!editable) && (currentFormMode !=='create')"
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
                  
                    <xFormGrid v-if="currentFormMode === 'create' ? (isUploader ? false : true) : true"
                      :label="label"
                      :id="id"
                      :forms="forms"
                      :schema="schema"
                      :schemaName="schemaName"
                      :collection="collection"
                      :$collection="$collection"
                      :ref="id + '-xFormGrid'"
                      :bus="bus"
                      :info="info"
                      :editable="editable"
                      :isUploader="isUploader"
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
      <v-tooltip top v-if="!hideCloseButton">
                <v-btn
                  class="white--text"
                  
                  small
                  color="red"
                  @click="bus.$emit($route.params.action === 'edit' ? 'closeEdit' : 'close', $route.params.id)"
                  slot="activator"
                  :id="entity + '_bt_close_2'"
                  :key="entity + '_bt_close_2'"
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
                  color="primary"
                  @click="bus.$emit('save', isFormSimple, isHideOnFormSimpleSave)"
                  slot="activator"
                  :id="entity + '_bt_save_2'"
                  :key="entity + '_bt_save_2'"
                >
                  Save
                  <v-icon right dark>save</v-icon>
                </v-btn>
                <span>Save</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
<!-- </v-dialog> -->
<!-- END MAIN CRUD FORM -->


<!-- START SEARCH FORM -->
<!-- <v-dialog 
  v-model="form_search.dialog"
  max-width="800px" 
  persistent
  scrollable
> -->
  <v-card v-if="displayWhat === 'search' && form_search">
    <v-card-title>
      <span class="headline">{{ 'Advanced Search for ' + entity }}</span>
    </v-card-title>
    <v-card-text class="body-1 search">
      
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
            
            <!-- START SEARCH FORM FIELDS -->
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
          @click="bus.$emit($route.params.action === 'edit' ? 'closeEdit' : 'close', forms.crud.fields.id)"
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
          color="primary"
          @click="bus.$emit('doAdvancedSearch')"
          slot="activator"
        >
          Search and Close
          <v-icon right dark>find_in_page</v-icon>
        </v-btn>
        <span>Search and Close</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
<!-- </v-dialog> -->
<!-- END SEARCH FORM -->


<template v-for="form in forms" > 
  <template v-if="form.name !== 'crud' && displayWhat === form.name">
     
      <div :key="'sub_form_wrapper_'+ form.name">
        <!-- <v-dialog v-model="form.dialog" persistent max-width="800px"> -->
          <v-card>
            <v-card-title>
              <span class="headline">{{ forms[form.name].editedIndex === -1 ? 'Add' : 'Edit' }} - {{form.title}}</span>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <v-btn
                  class="white--text"
                  
                  small
                  color="red"
                  @click="bus.$emit('closeSubForm', form.name)"
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
                  color="primary"
                  @click="bus.$emit(uploaders.indexOf(form.name) === -1 ? 'saveSubForm' : 'uploadSubForm', form.name)"
                  slot="activator"
                >
                  Save
                  <v-icon right dark>save</v-icon>
                </v-btn>
                <span>Save</span>
              </v-tooltip>
            </v-card-actions>
            <v-card-text>
              
                <v-form lazy-validation :ref="'form_'+form.name" v-model="form.valid" :id="'sub_form_'+ form.name" :key="'sub_form_'+ form.name">
                <v-container grid-list-md>
                  <v-layout wrap>
                    
                    <!-- START Auxiliar FORM FIELDS -->
                    <template v-for="{ 
                      id, type, hide, label, info, 
                      multiple, required, mask, 
                      placeholder, vrules, maxlength, isUploader,
                      minlength, schema, collection, schemaName, $collection, accept, size, formFileType, editable
                      } in form.fields" >
                      <template v-if="! hide" >
                        <template v-if="type === 'text'" >
                          <v-flex xs12 md6 :key="id + '-flex'">
                            <v-text-field
                            v-model="form.user_values[ id ]" 
                            :readonly="(!editable) && (forms[form.name].editedIndex !== -1)"
                            :clearable="editable"
                            :validate-on-blur="true"
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
                            :id="form.name + '_' + id"
                            prepend-icon="text_fields"
                            ></v-text-field>
                          </v-flex>
                        </template>
                        <template v-if="type === 'number'" >
                          <v-flex xs12 md6 :key="id + '-flex'">
                            <v-text-field
                            type="number"
                            v-model="form.user_values[ id ]" 
                            :readonly="(!editable) && (forms[form.name].editedIndex !== -1)"
                            :clearable="editable"
                            :validate-on-blur="true"
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
                            :id="form.name + '_' + id"
                            prepend-icon="text_fields"
                            ></v-text-field>
                          </v-flex>
                        </template>
                        <template v-if="type === 'integer'" >
                          <v-flex xs12 md6 :key="id + '-flex'">
                            <v-text-field
                            type="number"
                            v-model="form.user_values[ id ]" 
                            :readonly="(!editable) && (forms[form.name].editedIndex !== -1)"
                            :clearable="editable"
                            :validate-on-blur="true"
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
                            :id="form.name + '_' + id"
                            prepend-icon="text_fields"
                            ></v-text-field>
                          </v-flex>
                        </template>
                        <template v-if="type === 'file'" >
                          <v-flex xs12 md6 :key="id + '-flex'">
                          <div>
                            <h3 class="v-text-field__slot">
                              {{ label }}
                            </h3>
                            
                            <v-progress-linear
                              :value="progressValue"
                              :buffer-value="progressBuffer"
                              :indeterminate="indeterminate"
                              color="purple"
                              :id="'progress_' + form.schemaName + '_' + id"
                            ></v-progress-linear><br>
                            
                            <p><upload-btn
                              title="select"
                              :noTitleUpdate="false"
                              :key="id"
                              :id="'btn_' + form.schemaName + '_' + id"
                              :name="form.schemaName + '_' + id"
                              :parentFieldName="form.schemaName + '_' + id"
                              :accept="accept"
                              :size="size"
                              :readonly="(!editable) && (forms[form.name].editedIndex !== -1)"
                              @file-update="uploadBase64"
                            >
                              <template slot="icon-left">
                                <v-icon left>add</v-icon>
                              </template>
                            </upload-btn></p>
                            <p><small>{{ info }}</small></p>
                            <p><small><b>max ({{ size / 1024 / 1024 }}) MB</b></small></p>
                          </div>
                        </v-flex>
                        </template>
                        <template v-if="type === 'password'" >
                          <v-flex xs12 md6 :key="id + '-flex'">
                            <v-text-field
                            type="password"
                            v-model="form.user_values[ id ]" 
                            :readonly="(!editable) && (forms[form.name].editedIndex !== -1)"
                            :clearable="editable"
                            :validate-on-blur="true"
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
                            :id="form.name + '_' + id"
                            prepend-icon="text_fields"
                            ></v-text-field>
                          </v-flex>
                        </template>
                        <template v-if="type === 'currency'" >
                          <v-flex xs12 md6 :key="id + '-flex'">
                            <v-currency-field 
                              v-bind="currency_config" 
                              v-model="form.user_values[ id ]" 
                              :readonly="(!editable) && (forms[form.name].editedIndex !== -1)"
                              :clearable="editable"
                              :validate-on-blur="true"
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
                              :id="form.name + '_' + id"
                            >
                            </v-currency-field>
                          </v-flex>
                        </template>
                        <template v-if="type === 'editor'" >
                          <v-flex xs12 :key="id + '-flex'">
                            <ckeditor 
                              :editor="editor" 
                              v-model="form.user_values[ id ]" 
                              :config="editorConfig"
                              :key="id"
                              :hint="info"
                              :label="label + '' + ( required ? ' *' : '' )"
                              :required="required"
                              style="height:200px"
                            >
                            </ckeditor>
                          </v-flex>
                        </template>
                        <template v-if="type === 'textarea'" >
                          <v-flex xs12 :key="id + '-flex'">
                            <v-textarea
                            v-model="form.user_values[ id ]" 
                            :readonly="(!editable) && (forms[form.name].editedIndex !== -1)"
                            :clearable="editable"
                            :validate-on-blur="true"
                            persistent-hint 
                            counter
                            box
                            :hint="info" 
                            :required="required" 
                            :rules="vrules"
                            :placeholder="placeholder"
                            :label="label + '' + ( required ? ' *' : '' )"
                            :key="id"
                            :id="form.name + '_' + id"
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
                              :readonly="(!editable) && (forms[form.name].editedIndex !== -1)"
                              :clearable="editable"
                              :validate-on-blur="true"
                              :id="form.name + '_' + id"
                              persistent-hint
                              single-line
                              attach
                              chips
                              prepend-icon="toc"
                              ></v-select>
                          </v-flex>
                        </template>
                        <template v-if="type === 'combobox'" >
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
                              :readonly="(!editable) && (forms[form.name].editedIndex !== -1)"
                              :clearable="editable"
                              :id="form.name + '_' + id"
                              :validate-on-blur="true"
                              persistent-hint
                              single-line
                              attach
                              chips
                              prepend-icon="toc"
                              ></v-select>
                            <!-- <v-combobox
                              v-model="form.user_values[ id ]" 
                              :items="form.values[ id ]"
                              :hint="info"
                              :label="label + '' + ( required ? ' *' : '' )"
                              :key="id"
                              :multiple="multiple"
                              :required="required" 
                              :rules="vrules"
                              :readonly="(!editable) && (forms[form.name].editedIndex !== -1)"
                              :clearable="editable"
                              :validate-on-blur="true"
                              persistent-hint
                              single-line
                              attach
                              chips
                              prepend-icon="toc"
                            ></v-combobox> -->
                            
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
                              :readonly="(!editable) && (forms[form.name].editedIndex !== -1)"
                              :clearable="editable"
                              :id="form.name + '_' + id"
                              :validate-on-blur="true"
                              persistent-hint
                              attach
                              chips
                              prepend-icon="toc"
                              >
                            </v-autocomplete>
                          </v-flex>
                        </template>
                        <template v-if="type === 'switch'" >
                          <v-flex xs12 md6 :key="id + '-flex'">
                            <v-switch
                              v-model="form.user_values[ id ]"
                              :label="`${label}`"
                              :readonly="(!editable) && (forms[form.name].editedIndex !== -1)"
                              prepend-icon="done"
                            ></v-switch>
                          </v-flex>
                        </template>
                        <template v-if="type === 'grid'" >
                          <v-flex xs12 :key="id + '-flex'">
                            <xFormGrid
                              :label="label"
                              :id="form.name + '_' + id"
                              :forms="forms"
                              :schema="schema"
                              :schemaName="schemaName"
                              :collection="collection"
                              :$collection="$collection"
                              :ref="id + '-xFormGrid'"
                              :bus="bus"
                              :info="info"
                              :editable="editable"
                              :isUploader="uploaders.indexOf(form.name) > -1"
                              prepend-icon="grid_on"
                            ></xFormGrid>
                          </v-flex>
                        </template>
                        <template v-if="type === 'date' || type === 'date-time'" >
                          <v-flex xs12 md6 :key="id + '-flex'">
                            <v-text-field 
                            v-model="form.user_values[id]" 
                            persistent-hint 
                            :clearable="editable"
                            :validate-on-blur="true"
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
                            :readonly="(!editable) && (forms[form.name].editedIndex !== -1)"
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
                  @click="bus.$emit('closeSubForm', form.name)"
                  slot="activator"
                  :id="form.name + '_bt_close'"
                  :key="form.name + '_bt_close'"
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
                  color="primary"
                  @click="bus.$emit(uploaders.indexOf(form.name) === -1 ? 'saveSubForm' : 'uploadSubForm', form.name)"
                  slot="activator"
                  :id="form.name + '_bt_save'"
                  :key="form.name + '_bt_save'"
                >
                  Save
                  <v-icon right dark>save</v-icon>
                </v-btn>
                <span>Save</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        <!-- </v-dialog> -->


      </div>
    
  </template>
</template>

<v-tour class="primary" name="gridTour" :steps="steps"></v-tour>
<v-tour class="primary" name="formTour" :steps="steps"></v-tour>
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

.ck-content{
    height: 250px !important;
}
.v-step{
  z-index: 9999;
  background: inherit !important;
}
</style>
