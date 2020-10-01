<template>
  <v-layout wrap id="UserDetails">
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
    <v-container pb-0>
      <v-layout justify-center>
        <v-flex xs2>
          <img class="avatar" src=".../../../static/avatar.png">
        </v-flex>
        <v-flex xs12 md7 order-xs2 order-md1 row align-content-space-between>
          <v-container pt-0 pl-0>
            <v-layout row wrap>
              <v-flex xs6>
                <b>{{ humanData.name }}</b>
                <div v-for="item in humanData.address" :key="item._id">
                  {{ item.line_2 }}, {{ item.line_1 }}
                  <br>
                  {{ item.city }}, {{ item.state }}
                  <br>
                  ZIP: {{ item.zip }} - {{ item.country }}
                </div>
                <div v-for="item in humanData.phone" :key="item._id">
                  {{ item.country_code }} ({{ item.area_number }}) {{ item.number }} - ({{ item.type }})
                </div>
                <div v-for="item in humanData.email" :key="item._id">
                  <v-icon small>email</v-icon> {{ item.email }} - ({{ item.type }})
                </div>
                Account: <span v-if="userData"> {{ userData.roles.toString() }} </span>
                </v-flex>
              <v-flex xs2>
                <v-tooltip left>
                    <v-btn small icon class="mt-0" slot="activator" :to="{ name: 'Contact', params: { action: 'edit', id: humanData.id }}">
                    <v-icon small>edit</v-icon>
                    </v-btn>
                    <span>Edit Contact</span>
                </v-tooltip>
                <v-tooltip left>
                    <v-btn small icon class="mt-0" slot="activator" :to="{ name: 'Contact', params: { action: 'edit', id: humanData.id }}">
                    <v-icon small>list_alt</v-icon>
                    </v-btn>
                    <span>Show Details</span>
                </v-tooltip>
                <template v-if="userData">
                  <v-tooltip left>
                      <v-btn small icon class="mt-0" slot="activator" @click="dialogEnableLogin = true">
                      <v-icon small>{{ userData.portal_access === false ? 'desktop_access_disabled' : 'desktop_windows'}}</v-icon>
                      </v-btn>
                      <span>Enable/Disable Client Portal access</span>
                  </v-tooltip>
                  <v-tooltip left>
                      <v-btn small icon class="mt-0" slot="activator" @click="dialogChangePass = true; person = humanData.name">
                      <v-icon small>vpn_key</v-icon>
                      </v-btn>
                      <span>Reset Password</span>
                  </v-tooltip>
                </template>
                <template v-else>
                  <v-tooltip left>
                      <v-btn small icon class="mt-0" slot="activator" @click="dialogEnableLogin = true">
                      <v-icon small>fas fa-user-alt-slash</v-icon>
                      </v-btn>
                      <span>Add User</span>
                  </v-tooltip>
                </template>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs12 md5 order-xs1 order-md2>
          <v-layout row wrap>
            <v-flex xs8 pr-3>
              <!-- <v-autocomplete
                flat
                v-model="model"
                :loading="isLoading"
                clearable
                hide-no-data
                hide-selected
                :item-text="item_text"
                :item-value="item_value"
                :label="'Search for ' + searchType"
                append-outer-icon="search"
                class="mt-0 d-xl-inline-flex"
                return-object
              >
                <template v-slot:prepend>
                  <v-menu bottom left>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">filter_list</v-icon>
                    </template>

                    <v-list>
                      <v-list-tile
                        v-for="(item, i) in itemsMenu"
                        :key="i"
                        @click="selectFilter(item, i)"
                      >
                        <v-list-tile-title>
                          <v-icon v-if="item.title === searchType">check</v-icon>
                          <span v-else class="selectorNoIcon"></span>
                          {{ item.title }}
                        </v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </template>
              </v-autocomplete> -->
            </v-flex>
            <v-flex row xs4>
              <v-tooltip top>
                <v-btn id="xback" fab small dark color="blue" :to="{ name: 'Contact', params: { query: queryBack }}" slot="activator">
                  <v-icon>keyboard_arrow_left</v-icon>
                </v-btn>
                <span>Back to contact listing</span>
              </v-tooltip>
              <v-speed-dial
                v-model="fab"
                absolute
                direction="bottom"
                open-on-hover
                transition="slide-y-transition"
                class="fab"
              >
                <v-btn slot="activator" v-model="fab" color="green" dark fab>
                    <v-icon>add</v-icon>
                    <v-icon>close</v-icon>
                </v-btn>

                <v-tooltip left>
                    <v-btn fab dark small color="primary" slot="activator">
                    <v-icon>far fa-calendar-plus</v-icon>
                    </v-btn>
                    <span>Add Calendar Event</span>
                </v-tooltip>
                <v-tooltip left>
                    <v-btn fab dark small color="primary" slot="activator">
                    <v-icon>note_add</v-icon>
                    </v-btn>
                    <span>Add File to Contact</span>
                </v-tooltip>
                <v-tooltip left>
                    <v-btn fab dark small color="primary" slot="activator">
                    <v-icon>far fa-edit</v-icon>
                    </v-btn>
                    <span>Add Contact Note</span>
                </v-tooltip>
                <v-tooltip left>
                    <v-btn fab dark small color="primary" slot="activator">
                    <v-icon>fas fa-clipboard-list</v-icon>
                    </v-btn>
                    <span>Add Task</span>
                </v-tooltip>
                <v-tooltip left>
                    <v-btn fab dark small color="primary" slot="activator" @click="dialogAddCase = true">
                    <v-icon>fas fa-briefcase-medical</v-icon>
                    </v-btn>
                    <span>Add Case</span>
                </v-tooltip>
              </v-speed-dial>
              
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <vue-perfect-scrollbar class="perfect--scrollbar">
      <v-container py-1 my-1>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card>
              <v-card-title>
                <h4>Cases</h4>
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn icon slot="activator" v-on="on" @click="dialogAdd('Case')">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </template>
                  <span>Add New Case</span>
                </v-tooltip>
              </v-card-title>
              <v-data-table
                :headers="headersCase"
                :items="caseItems"
                class="elevation-1"
                :hide-actions="caseItems.length < 5 ? true : false"
              >
                <template v-slot:items="props">
                  <td><router-link :to="{ name: 'Cases', params: { id: props.item.id }}">{{ props.item.caseName }}</router-link></td>
                  <td class="text-xs-center">{{ props.item.program }}</td>
                  <td class="text-xs-center">{{ props.item.roleName }}</td>
                  <td class="text-xs-center">{{ props.item.startDate ? new Date(props.item.startDate).toDateString() : ''}}</td>
                  <td class="text-xs-center">{{ props.item.endDate ? new Date(props.item.endDate).toDateString() : '' }}</td>
                  <td class="text-xs-center">{{ props.item.status }}</td>
                  <td class="text-xs-center">
                    <v-tooltip top>
                      <v-btn small icon class="mx-0 mt-2" slot="activator" @click="deleteItem('case', props.item)">
                        <v-icon small>delete</v-icon>
                      </v-btn>
                      <span>Remove {{ props.item.case}}</span>
                    </v-tooltip>
                  </td>
                </template>
              </v-data-table>
            </v-card>
          </v-flex>

          <v-flex xs12 mt-4>
            <v-card>
              <v-card-title pt-1 pb-0>
                <h4>Relationships</h4>
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn icon slot="activator" v-on="on" @click="dialogAdd('Relationship')">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </template>
                  <span>Add New Relationship</span>
                </v-tooltip>
              </v-card-title>
              <v-data-table
                :headers="headersRelations"
                :items="relationshipItems"
                class="elevation-1"
                :hide-actions="relationshipItems.length < 5 ? true : false"
              >
                <template v-slot:items="props">
                  <td><router-link :to="'/contact-details/' + props.item.human_id">{{ props.item.human_name }}</router-link></td>
                  <td class="text-xs-center">{{ props.item.relationship_type_name }}</td>
                  <td class="text-xs-center">
                    <template v-for="{ name, id, index } in props.item.case">
                      <router-link class="d-block" :to="{ name: 'Cases', params: { id: id }}" :key="index +'-'+ id">{{ name }}</router-link>
                    </template>
                  </td>
                  <td class="text-xs-center">{{ props.item.startDate ? new Date(props.item.startDate).toDateString() : ''}}</td>
                  <td class="text-xs-center">{{ props.item.endDate ? new Date(props.item.endDate).toDateString() : '' }}</td>
                  <td class="text-xs-center">
                    <v-tooltip top>
                      <v-btn small icon class="mx-0 mt-2" slot="activator" @click="deleteItem('human_relationship', props.item)">
                        <v-icon small>delete</v-icon>
                      </v-btn>
                      <span>Remove {{ props.item.human_name}}</span>
                    </v-tooltip>
                  </td>
                </template>
              </v-data-table>
            </v-card>
          </v-flex>
          <v-flex xs12 md6>
            <v-flex xs12 mt-4>
              <v-card>
                <v-card-title pt-1 pb-0>
                  <h4>Forms</h4>
                  <v-spacer></v-spacer>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn icon slot="activator" v-on="on">
                        <v-icon>add</v-icon>
                      </v-btn>
                    </template>
                    <span>Add New Form</span>
                  </v-tooltip>
                </v-card-title>
                <v-data-table
                  :headers="headersForm"
                  :items="itemsForm"
                  class="elevation-1"
                  :hide-actions="itemsForm.length < 5 ? true : false"
                >
                  <template v-slot:items="props">
                    <td>{{ props.item.form }}</td>
                    <td class="text-xs-center">{{ props.item.last_update }}</td>
                    <td class="text-xs-center">{{ props.item.author }}</td>
                  </template>
                </v-data-table>
              </v-card>
            </v-flex>

            <v-flex xs12 mt-4>
              <v-card>
                <v-card-title pt-1 pb-0>
                  <h4>Last account activity</h4>
                </v-card-title>
                <v-data-table
                  :headers="headersLogin"
                  :items="userDataAccess"
                  class="elevation-1"
                  :hide-actions="userDataAccess.length < 5 ? true : false"
                >
                  <template v-slot:items="props">
                    <td>{{ new Date(props.item.date).toLocaleString() }}</td>
                    <td class="text-xs-center">{{ props.item.os }}/{{ props.item.browser }}</td>
                    <td class="text-xs-center">{{ props.item.ip }} - {{ props.item.country }}</td>
                  </template>
                </v-data-table>
              </v-card>
            </v-flex>
          </v-flex>
          <v-flex xs12 md6 pt-4 pl-2>
            <v-card>
                <v-card-title pt-1 pb-0>
                  <h4>Notes</h4>
                  <v-spacer></v-spacer>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn icon slot="activator" v-on="on">
                        <v-icon>add</v-icon>
                      </v-btn>
                    </template>
                    <span>Add New Note</span>
                  </v-tooltip>
                </v-card-title>
                <v-data-table
                  :headers="headersNotes"
                  :items="itemsNotes"
                  class="elevation-1"
                  :hide-actions="itemsNotes.length < 5 ? true : false"
                >
                  <template v-slot:items="props">
                    <td>{{ props.item.date }}</td>
                    <td class="text-xs-center">{{ props.item.author }}</td>
                    <td class="text-xs-center">{{ props.item.subject }}</td>
                  </template>
                </v-data-table>
              </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </vue-perfect-scrollbar>
    <v-dialog v-model="dialogEnableLogin" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ userData ? "Enable Portal Login" : "Assign a system user to the contact"}}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout v-if="userData" wrap>
              <v-flex xs12>
                <v-flex xs12>
                  <v-text-field label="Primary Email*" required v-model="userData.username" :disabled="true"></v-text-field>
                </v-flex>
                
                <v-flex xs12>
                  <v-switch
                    v-model="userData.portal_access"
                    label="Enabled" 
                  ></v-switch>
                </v-flex>
              </v-flex>
            </v-layout>
            <v-layout v-else row wrap>
              <v-flex xs12>
                <h4>Contact does not have a related user account.</h4>
                <v-btn class="btn-add" color="primary" small @click="addUserSelect = !addUserSelect && feedSelects('User')">+ Select an User Account</v-btn>
              </v-flex>
              <v-layout row wrap v-if="addUserSelect">
                <v-flex xs12>
                  <v-autocomplete
                      v-model="userSelected"
                      hint="System Account associated to this Human"
                      prepend-icon="person"
                      :items="userItems"
                      :selected="userSelect"
                      clearable
                      label="User"
                      persistent-hint
                      chips
                      item-text="username"
                      item-value="id"
                      >
                      <template v-slot:append-outer>
                      <v-icon
                          @click="addUserDialog = !addUserDialog"
                          v-text="'add'"
                          ></v-icon>
                      </template>
                  </v-autocomplete>
                </v-flex>
              </v-layout>
            </v-layout>
           
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialogEnableLoginClose()">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="updateHuman()" :disabled="!userSelected && !userData">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogChangePass" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Reset password for {{ person }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-switch
                  v-model="switchpass"
                  label="Automaticaly generate a password" 
                ></v-switch>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="switchpassValue"
                  :append-icon="show1 ? 'visibility' : 'visibility_off'"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Password"
                  hint="At least 8 characters"
                  counter
                  @click:append="show1 = !show1"
                  :disabled="switchpass"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-switch
                  v-model="switchAsk"
                  label="Ask for a password change at the next sign-in" 
                ></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialogChangePass = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="dialogChangePass = false">Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="addUserDialog" max-width="500px">
      <v-card>
          <v-card-title>
          <span class="title">Add - System Account associated to this Human</span>
          </v-card-title>
          <v-card-text>
          <v-container grid-list-md py-0>
            <v-form ref="addUser">
              <v-layout wrap>
                <v-flex xs12>
                    <v-text-field 
                        v-model="addUser.username" 
                        label="Username *" 
                        hint="The User's username. Must be an e-mail address." 
                        persistent-hint
                        counter
                        maxlength="255"
                        :rules="[rules.required, rules.email]"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field 
                        v-model="addUser.password" 
                        label="Password *" 
                        hint="The User's password" 
                        persistent-hint
                        counter
                        maxlength="12"
                        minlength="4"
                        :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
                        :type="passwordShow ? 'text' : 'password'"
                        @click:append="passwordShow = !passwordShow"
                        :rules="[rules.required]"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-select
                        :items="userRoleItems"
                        v-model="addUser.roles"
                        hint="The User's role"
                        label="User's role *"
                        persistent-hint
                        multiple
                        clearable
                        attach
                        chips
                        :rules="[rules.required]"
                    ></v-select>
                </v-flex>
                <v-flex xs12>
                    <v-autocomplete
                        v-model="addUser.human"
                        hint="Human associated to this System Account"
                        :items="userItems"
                        clearable
                        label="Account Owner"
                        persistent-hint
                        attach
                        chips
                        item-text="username"
                        item-value="id"
                        >
                    </v-autocomplete>
                </v-flex>
                <v-flex xs12>
                    <v-switch v-model="addUser.portal_access" label="Portal Access"></v-switch>
                </v-flex>
                <v-flex xs12>
                      <small>*indicates required field</small>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
          </v-card-text>

          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeNewUser">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="createNewUser">Save</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogAddCase" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Contact in a Case</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-form ref="case">
              <v-layout wrap>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="caseAdd.case"
                    hint="The cases which this human is joined to"
                    prepend-icon="insert_drive_file"
                    :items="caseItemsSelect"
                    :selected="caseAdd.case"
                    clearable
                    label="Case *"
                    persistent-hint
                    chips
                    item-text="display_name"
                    item-value="id"
                    :rules="[v => !!v || 'Case is required']"
                    required
                  >
                  </v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="caseAdd.role"
                    hint="Role on case"
                    prepend-icon="insert_drive_file"
                    :items="roleItemsSelect"
                    :selected="caseAdd.role"
                    clearable
                    label="Role *"
                    persistent-hint
                    chips
                    item-text="role"
                    item-value="id"
                    :rules="[v => !!v || 'Role is required']"
                    required
                  >
                  </v-autocomplete>
                </v-flex>
                <v-flex xs12 md6>
                  <v-dialog
                    v-model="caseModalStartDate"
                    persistent
                    lazy
                    full-width
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="caseAdd.startDate"
                        label="Start Date"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                        :rules="[v => !!v || 'Item is required']"
                        clearable
                        required
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="caseAdd.startDate" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="caseModalStartDate = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="caseModalStartDate = false">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
                <v-flex xs12 md6>
                  <v-dialog
                    v-model="caseModalEndDate"
                    persistent
                    lazy
                    full-width
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="caseAdd.endDate"
                        label="End Date"
                        prepend-icon="event"
                        readonly
                        clearable
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="caseAdd.endDate" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="caseModalEndDate = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="caseModalEndDate = false">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialogAddCase = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="addItems('case')">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogAddRelationship" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Add relationships of this contact</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-form ref="Relationship">
              <v-layout wrap>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="relationshipAdd.human"
                    hint="The Contact identifier. Points to Human"
                    prepend-icon="toc"
                    :items="humanItemsSelect"
                    :selected="relationshipAdd.human"
                    clearable
                    label="Person *"
                    persistent-hint
                    chips
                    item-text="name"
                    item-value="id"
                    :rules="[v => !!v || 'Person is required']"
                    required
                  >
                  </v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="relationshipAdd.relationship_type"
                    hint="The Contact Relationship type identifier."
                    prepend-icon="toc"
                    :items="relationshipItemsSelect"
                    :selected="relationshipAdd.relationship_type"
                    clearable
                    label="Relationship Type *"
                    persistent-hint
                    chips
                    item-text="name"
                    item-value="id"
                    :rules="[v => !!v || 'Relationship Type is required']"
                    required
                  >
                  </v-autocomplete>
                </v-flex>
                <v-flex xs12 md6>
                  <v-dialog
                    v-model="relationshipModalStartDate"
                    persistent
                    lazy
                    full-width
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="relationshipAdd.startDate"
                        label="Start Date"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                        :rules="[v => !!v || 'Item is required']"
                        clearable
                        required
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="relationshipAdd.startDate" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="relationshipModalStartDate = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="relationshipModalStartDate = false">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
                <v-flex xs12 md6>
                  <v-dialog
                    v-model="relationshipModalEndDate"
                    persistent
                    lazy
                    full-width
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="relationshipAdd.endDate"
                        label="End Date"
                        prepend-icon="event"
                        readonly
                        clearable
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="relationshipAdd.endDate" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="relationshipModalEndDate = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="relationshipModalEndDate = false">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
                <v-flex xs12>
                    <v-textarea
                    v-model="relationshipAdd.memo"
                    prepend-icon="text_fields"
                    hint="Memo field for further information."
                    persistent-hint
                    box
                    label="Memo"
                    value=""
                    ></v-textarea>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialogAddRelationship = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="addItems('Relationship')">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      
    <v-snackbar
      v-model="snack"
      :timeout="3000"
      :color="snackColor"
      :top="true"
      >
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
  </v-layout>
  
</template>
<script>
import UserDetails from './ContactDetails.vm.js';
export default UserDetails;
</script>
<style scoped lang="css">
.perfect--scrollbar {
  height: calc(100vh - 276px);
}
.v-card__title {
  padding-bottom: 0px
}
.v-card__title .v-btn {
    margin: -13px -10px auto !important;
}
.avatar {
  width: 70%;
}
.btn-add{
    width: 90%;
}
#xback {
  margin: 10px 10px 0px 0px !important;
}
</style>
