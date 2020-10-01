<template>
  <div id="Client">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-toolbar class="elevation-0">
          <v-tooltip top v-if="displayWhat !== 'dashboard'">
            <v-btn 
              fab
              @click="displayWhat = 'dashboard'" 
              slot="activator"
            >
              <v-icon>dashboard</v-icon>
            </v-btn>
            <span>Back to Contact Dashboard</span>
          </v-tooltip>

          <!-- <v-tooltip top v-if="displayWhat === 'dashboard'">
            <v-btn
              color="success" 
              fab
              @click="displayWhat = 'create'" 
              slot="activator"
            >
              <v-icon>add</v-icon>
            </v-btn>
            <span>Create a new {{entity}}</span>
          </v-tooltip> -->

          <v-speed-dial
            v-if="displayWhat === 'dashboard'"
            absolute
            top
            direction="bottom"
            open
            transition="slide-y-transition"
            class="fab"
          >
            <v-btn slot="activator" color="green" dark fab>
              <v-icon>add</v-icon>
              <v-icon>close</v-icon>
            </v-btn>

            <v-tooltip right>
              <v-btn fab dark small hover color="indigo" slot="activator" @click="createNew('Person')">
                <v-icon>person</v-icon>
              </v-btn>
              <span>Create a new Person</span>
            </v-tooltip>
            <v-tooltip right>
              <v-btn fab dark small color="green" slot="activator" @click="createNew('Family')">
                <v-icon small>group</v-icon>
              </v-btn>
              <span>Create a new Family</span>
            </v-tooltip>
            <v-tooltip right>
              <v-btn fab dark small color="orange" slot="activator" @click="createNew('User')">
                <v-icon small>fas fa-user-cog</v-icon>
              </v-btn>
              <span>Create a new User</span>
            </v-tooltip>
            <v-tooltip right>
              <v-btn fab dark small color="blue-grey" slot="activator" @click="createNew('Organization')">
                <v-icon>business</v-icon>
              </v-btn>
              <span>Create a new Organization</span>
            </v-tooltip>
          </v-speed-dial>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            placeholder="Search"
            hide-details
            clearable
            max-width="500px"
            v-on:keyup.enter="bus.$emit('doTextSearch', search)"
            @click:clear="bus.$emit('doTextSearch', '')"
          >
          </v-text-field>
          <v-spacer class="hidden-sm-and-down"></v-spacer>
        </v-toolbar>
        <v-flex xs12 text-xs-center pt-0>
          <v-btn 
            small
            @click="bus.$emit('doTextSearch', search)"
          >
            <span text-color="primary">Search</span>
          </v-btn>
          <v-btn 
            small 
            class="primary"
            @click="bus.$emit('displayWhat', 'search', true)"
          >
            <v-icon small>find_in_page</v-icon>
            <span text-color="primary"> Advanced Search</span>
          </v-btn>
          <v-btn
            v-if="advancedSearch"
            small
            dark
            class="green"
            @click="saveSearchDialog = true"
          >
            <v-icon small>save</v-icon>
            <span text-color="primary"> Save Search</span>
          </v-btn>
        </v-flex>
      </v-layout>

      <v-layout row wrap v-if="displayWhat !== 'dashboard' && displayWhat !== 'create' && displayWhat !== 'search'">
        <v-flex lg12>
          <v-card>
            <div v-if="displayWhat === 'crud' || displayWhat === 'grid'">
              <xCrudControls
                :entity="entity"
                ref="xCrudControls"
                :bus="bus"
                :displayWhat="displayWhat"
                :currentFormMode="currentFormMode"
                :editID="$route.params.id"
                >
              </xCrudControls>
              <v-divider></v-divider>
            </div>
            
            <v-card-text class="pa-0">
              <xGrid
                :dialog="forms.crud.dialog"
                :dialog_loading="dialog_loading"
                :entity="entity"
                :selected="selected"
                :pagination="pagination"
                :totalDocuments="totalDocuments"
                :headers="headers"
                :original_documents="original_documents"
                :documents="documents"
                :loading="loading"
                :forms="forms"
                :itemKey="itemKey"
                :bus="bus"
                ref="xGrid"
                :query="where"
                :displayWhat="displayWhat"
                :currentFormMode="currentFormMode"
                :key="componentKey"
              ></xGrid>
            </v-card-text>
            <xForm
                :dialog="forms.crud.dialog"
                :dialog_create="dialog_create"
                :dialog_loading="dialog_loading"
                :entity="entity"
                :selected="selected"
                :loading="loading"
                :forms="forms"
                :uploaders="uploaders"
                :form_search="form_search"
                :query_operators="query_operators"
                :bus="bus"
                ref="xForm"
                :displayWhat="displayWhat"
                :currentFormMode="currentFormMode"
                :hideSubFields="hideSubFields"
            ></xForm>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row wrap v-if="displayWhat === 'dashboard'">
        <v-flex xs12>
          <v-container grid-list-xs mx-0 px-0>
            <v-layout row wrap>
              <v-flex xs12 sm6 md3>
                <mini-chart
                  title="Daily New Clients"
                  icon="trending_up"
                  :data="dataset.newUsers"
                  chart-color="#2196f3"
                  type="bar"
                  :bus="bus"
                  entity="Human"
                  :query="{createdAt: { $gte: new Date(new Date().toDateString()).toISOString() }}"
                >
                </mini-chart>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <mini-chart
                  :key="'online_users' + online_users.length"
                  title="Online Clients"
                  icon="trending_up"
                  :data="dataset.onlineUsers"
                  chart-color="green"
                  type="area"
                  :bus="bus"
                  entity="Human"
                  :online-users="online_users.length"
                >
                </mini-chart>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <mini-chart
                  :key="dataset.onlineUsers.length"
                  title="Non Active clients"
                  icon="check"
                  :data="dataset.onlineUsers"
                  chart-color="red"
                  type="circular"
                  :bus="bus"
                  entity="Human"
                  field="active"
                  target="false"
                >
                </mini-chart>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <mini-chart
                  title="Active clients"
                  icon="check"
                  :data="dataset.onlineUsers"
                  chart-color="green"
                  type="circular"
                  :bus="bus"
                  entity="Human"
                  field="active"
                  target="true"
                >
                </mini-chart>
              </v-flex>
              <template v-for="(item) in searchClientItems">
                <v-flex xs12 sm6 md3 :key="item.id">
                  <v-hover>
                    <v-card
                      class="card-mini"
                      slot-scope="{ hover }" 
                      :class="`elevation-${hover ? 6 : 2}`"
                    >
                    <v-card-title primary-title class="pt-2 pb-1">
                     <div class="layout row ma-0">
                      <div class="subheading">Searches</div>
                      <v-spacer></v-spacer>
                      <div class="caption"> <v-icon>youtube_searched_for</v-icon></div>
                    </div>
                    </v-card-title>
                      <v-card-text>
                        <table width="100%">
                          <tr>
                            <td class="text-xs-center pr-1">
                              <v-avatar size="24" tile>
                                <img :src="'../../' + item.file[0].webPath" alt="alt">
                              </v-avatar>
                            </td>
                            <td class="text-xs-left">{{ item.name }}</td>
                            <td class="text-xs-right mx-0 px-0" width="65px">
                              <v-btn flat small icon color="primary" class="mx-0" @click="bus.$emit('doAdvancedSearcha', item.settings)">
                                <v-icon small>directions_run</v-icon>
                              </v-btn>
                              <v-btn flat icon small class="mx-0 px-0" color="red" @click="deleteSearch(item)">
                                <v-icon small>delete_sweep</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </table>
                      </v-card-text>
                    </v-card>
                  </v-hover> 
                </v-flex>
              </template>
            </v-layout>
          </v-container>
          <v-container mx-0 px-0>
            <v-layout row wrap>
              <!-- <v-flex xs12 md6>
                <v-card>
                  <v-card-title>
                    <div class="layout row ma-0">
                      <div class="subheading">Searches</div>
                      <v-spacer></v-spacer>
                      <div class="caption"> <v-icon>youtube_searched_for</v-icon></div>
                    </div>
                  </v-card-title>
                  <v-card-text>
                    <v-data-table
                      :items="searchClientItems"
                      class="elevation-1"
                      hide-actions
                      hide-headers
                    >
                      <template v-slot:items="props">

                        <td width="50px" class="text-xs-center mx-1 px-1">
                          <v-avatar size="24" tile>
                            <img :src="'../../' + props.item.file[0].webPath" alt="alt">
                          </v-avatar>
                        </td>
                        <td class="text-xs-left">{{ props.item.name }}</td>
                        <td class="text-xs-right mx-0 px-0" width="110px">
                          <v-btn flat icon color="primary" @click="bus.$emit('doAdvancedSearcha', props.item.settings)">
                            <v-icon>directions_run</v-icon>
                          </v-btn>
                          <v-btn flat icon color="red" @click="deleteSearch(props.item)">
                            <v-icon>delete_sweep</v-icon>
                          </v-btn>
                        </td>
                      </template>
                    </v-data-table>
                  </v-card-text>  
                </v-card>
              </v-flex> -->

              <v-flex sm6 xs12>
                <box-chart
                  title="Contact types"
                  sub-title="10%"
                  icon="trending_up"
                  entity="Human"
                  :data="dataset.humanTypes"
                  :chart-color="[color.blue]"
                  type="pie"
                  ref="contactChart"
                >
                </box-chart>
              </v-flex>        
            </v-layout>
            
          </v-container>
        </v-flex>
      </v-layout>
      <v-layout row wrap v-if="displayWhat === 'create'">
        <v-flex xs12>
            <ClientsAdd 
              :entity="entity"
              :bus="bus"
              :displayWhat="displayWhat"
            ></ClientsAdd>
        </v-flex>
      </v-layout>

      <!-- START ADVANCED SEARCH FORM -->
      <v-layout v-if="displayWhat === 'search' && form_search">
        <v-flex xs12>
          <v-card>
            <v-card-title>
              <span class="headline">{{ 'Advanced Search for Person' }}</span>
            </v-card-title>
            <v-card-text class="body-1 search">
                <v-container fluid>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-card outline>
                        <v-card-text>
                          <v-layout row wrap>
                            <v-flex xs12 md6>
                              <v-select
                                v-model="programModel" 
                                :items="programItems"
                                label="Select a Program Name"
                                :multiple="false"
                                item-text="name" 
                                item-value="id"
                                hint="Program Name"
                                persistent-hint
                                clearable
                                single-line
                                attach
                                chips
                              ></v-select>
                            </v-flex>
                            <v-flex xs12 md6>
                              <v-select
                                v-model="caseStatusModel" 
                                :items="caseStatusItems"
                                label="Select a Case Status"
                                :multiple="false"
                                item-text="label" 
                                item-value="id"
                                hint="Case Status"
                                persistent-hint
                                clearable
                                single-line
                                attach
                                chips
                              ></v-select>
                            </v-flex>
                            <v-flex xs12 md6>
                              <v-select
                                v-model="groupModel" 
                                :items="groupItems"
                                label="Select a Group Name"
                                :multiple="false"
                                item-text="name" 
                                item-value="id"
                                hint="Groups Name"
                                persistent-hint
                                clearable
                                single-line
                                attach
                                chips
                              ></v-select>
                            </v-flex>
                            <v-flex xs12 md6>
                              <v-select
                                v-model="assignToModel" 
                                :items="assignToItems"
                                label="Select a Assign To"
                                :multiple="false"
                                item-text="name" 
                                item-value="id"
                                hint="Assigned To"
                                persistent-hint
                                clearable
                                single-line
                                attach
                                chips
                              ></v-select>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                  
                </v-container>              
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
                                  <v-flex x12 md6 :key="id + '-input'">
                                    <v-layout>
                                      <v-flex xs4 :key="id + '-flex_query'">
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
                                      <v-flex xs8 :key="id + '-flex'">
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
                                    </v-layout>
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
                  @click="bus.$emit('close', true)"
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
                  @click="doAdvancedSearch()"
                  slot="activator"
                >
                  Search and Close
                  <v-icon right dark>find_in_page</v-icon>
                </v-btn>
                <span>Search and Close</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>  
      <!-- END ADVANCED SEARCH FORM -->

      <v-dialog v-model="saveSearchDialog" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Save Search</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md pt-0>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="searchName" label="Search Name*" required></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
            <v-container grid-list-sm fluid>
              <v-layout row wrap>
                <v-flex
                  v-for="n in searchesSaveList"
                  :key="n.title"
                  xs2
                  d-flex
                >
                    <v-card 
                      flat 
                      tile
                      class="thumb"
                      @click="thumbSelect"
                    >
                      <img :src="n.icon" :alt="n.title"/>
                    </v-card>
                </v-flex>
              </v-layout>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="saveSearchDialog = false">Close</v-btn>
            <v-btn color="blue darken-1" flat @click="saveSearch" :disabled="searchName === '' || imgName === ''">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    <v-snackbar
      v-model="snack"
      :timeout="3000"
      :color="snackColor"
      :top="true"
      >
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import Client from './Client.vm.js';
export default Client;
</script>

<style lang="stylus"> 
.theme--dark .v-table thead th {
  background-color: #424242;
}

.theme--light .v-table thead th {
  background-color: #ffffff;
}

.selected {
  border: gray 1px solid !important;
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

#Client .perfect--scrollbar {
    height: calc(100vh - 500px) !important;
}

#Client .search .perfect--scrollbar {
    height: calc(100vh - 410px) !important;
}

#Client  .fixed-header {
    height: calc(100vh - 355px) !important;
}
</style>
