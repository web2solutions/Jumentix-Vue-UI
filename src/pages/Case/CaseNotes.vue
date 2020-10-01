<template>
  <div id="CaseNotes">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-card-title primary-title>
              <v-container mt-0 pt-0>
                <v-layout row wrap>
                  <v-flex xs1 md1 pr-0 v-if="this.$router.currentRoute.name !== 'Summary'">
                    <v-speed-dial
                        v-model="fab"
                        absolute
                        direction="bottom"
                        open-on-hover
                        transition="slide-y-transition"
                        class="fab"
                        >
                        <v-btn slot="activator" v-model="fab" color="red" dark fab>
                            <v-icon>add</v-icon>
                            <v-icon>close</v-icon>
                        </v-btn>

                        <v-tooltip right>
                            <v-btn fab dark small color="indigo" slot="activator" to="case-note-create">
                            <v-icon>note_add</v-icon>
                            </v-btn>
                            <span>Create</span>
                        </v-tooltip>
                        <v-tooltip right>
                            <v-btn fab dark small color="green" slot="activator">
                            <v-icon>info</v-icon>
                            </v-btn>
                            <span>Info</span>
                        </v-tooltip>
                        <v-tooltip right>
                            <v-btn fab dark small color="primary" slot="activator">
                            <v-icon>remove_red_eye</v-icon>
                            </v-btn>
                            <span>View</span>
                        </v-tooltip>
                    </v-speed-dial>
                  </v-flex>
                  <v-flex xs3>
                    <b>Case Number:</b> LM-12341234 <br>
                    <b>Case Status:</b> Open <br>
                    <b>Names:</b> Mark Livings / Letty Smith<br>
                    <b>Case Open:</b> 12/13/2018
                  </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs4>
                <v-autocomplete
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
                    class="hidden-sm-and-down mt-0 d-xl-inline-flex"
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
                          <v-list-tile-title><v-icon v-if="item.title === searchType">check</v-icon> <span v-else class="selectorNoIcon"></span>{{ item.title }}</v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>

                  </template>
                </v-autocomplete>
              </v-flex>
                </v-layout> 
              </v-container>
            </v-card-title>
            <vue-perfect-scrollbar class="perfect--scrollbar">
              <v-card-text>
                <v-layout
                  wrap
                  style="height: 200px;"
                >
                  <v-container grid-list-xl fluid>
                    <v-layout row wrap>
                      <v-flex lg12>
                        <v-card>
                          <v-toolbar card color="white">
                            <v-text-field
                              flat
                              solo
                              prepend-icon="search"
                              placeholder="Type something"
                              v-model="search"
                              hide-details
                              clearable
                              class="hidden-sm-and-down"
                              max-width="300px"
                            ></v-text-field>
                            <v-btn small @click.stop="advancedSearch = !advancedSearch">
                              <v-icon small>find_in_page</v-icon>
                              Advanced search
                            </v-btn>
                            <v-btn fab small color="primary mb-2" dark>
                                <v-icon>edit</v-icon>
                            </v-btn>
                            <v-btn fab small color="primary mb-2" dark>
                                <v-icon>visibility</v-icon>
                            </v-btn>
                            <v-btn fab small color="primary mb-2" dark to="case-note-create">
                              <v-icon>note_add</v-icon>
                            </v-btn>
                            <v-dialog v-model="dialog" max-width="600px">
                              
                              <v-card>
                                <v-card-title>
                                  <span class="headline">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                  <v-form ref="formEdit">
                                    <v-container grid-list-md>
                                      <v-layout wrap>
                                        <v-flex xs12>
                                          <v-autocomplete
                                            flat
                                            v-model="editedItem.authorId"
                                            :items="authorItems"
                                            :loading="isLoading"
                                            clearable
                                            hide-no-data
                                            hide-selected
                                            item-text="name"
                                            item-value="id"
                                            :label="'Select Author Name'"
                                            append-outer-icon="search"
                                            return-object
                                            :rules="[v => !!v || 'Item is required']"
                                            required
                                          >
                                          </v-autocomplete>
                                        </v-flex>
                                        <v-flex xs12>
                                          <v-text-field 
                                            v-model="editedItem.subject" 
                                            label="Subject"
                                            :rules="[v => !!v || 'Item is required']"
                                            required
                                          ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                          <v-select
                                            v-model="editedItem.typeId"
                                            :items="typeItems"
                                            :item="editedItem.type"
                                            item-text="type"
                                            item-value="id"
                                            label="Type"
                                            :rules="[v => !!v || 'Item is required']"
                                            required
                                          ></v-select>
                                        </v-flex>
                                        <v-flex xs12 md4>
                                          <v-dialog
                                            ref="dialog"
                                            v-model="modalStartDate"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                          >
                                            <template v-slot:activator="{ on }">
                                              <v-text-field
                                                v-model="editedItem.startDate"
                                                label="Start Date"
                                                prepend-icon="event"
                                                readonly
                                                v-on="on"
                                                :rules="[v => !!v || 'Item is required']"
                                                required
                                              ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="editedItem.startDate" scrollable>
                                              <v-spacer></v-spacer>
                                              <v-btn flat color="primary" @click="modalStartDate = false">Cancel</v-btn>
                                              <v-btn flat color="primary" @click="$refs.dialog.save(editedItem.startDate)">OK</v-btn>
                                            </v-date-picker>
                                          </v-dialog>
                                        </v-flex>
                                        <v-flex xs12 md4>
                                          <v-dialog
                                            ref="dialog"
                                            v-model="modalEndDate"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                          >
                                            <template v-slot:activator="{ on }">
                                              <v-text-field
                                                v-model="editedItem.endDate"
                                                label="End Date"
                                                prepend-icon="event"
                                                readonly
                                                v-on="on"
                                              ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="editedItem.endDate" scrollable>
                                              <v-spacer></v-spacer>
                                              <v-btn flat color="primary" @click="modalEndDate = false">Cancel</v-btn>
                                              <v-btn flat color="primary" @click="$refs.dialog.save(editedItem.endDate)">OK</v-btn>
                                            </v-date-picker>
                                          </v-dialog>
                                        </v-flex>
                                        <v-flex xs12 md4>
                                          <v-dialog
                                            ref="dialogDuration"
                                            v-model="modalDuration"
                                            :return-value.sync="editedItem.duration"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                          >
                                            <template v-slot:activator="{ on }">
                                              <v-text-field
                                                v-model="editedItem.duration"
                                                label="Duration"
                                                prepend-icon="access_time"
                                                readonly
                                                v-on="on"
                                              ></v-text-field>
                                            </template>
                                            <v-time-picker
                                              v-if="modalDuration"
                                              v-model="editedItem.duration"
                                              format="24hr"
                                              scrollable
                                            >
                                              <v-spacer></v-spacer>
                                              <v-btn flat color="primary" @click="modalDuration = false">Cancel</v-btn>
                                              <v-btn flat color="primary" @click="$refs.dialogDuration.save(editedItem.duration)">OK</v-btn>
                                            </v-time-picker>
                                          </v-dialog>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                          <v-select
                                            v-model="editedItem.incident"
                                            :items="incidentItems"
                                            :item="editedItem.incident"
                                            label="Incident"
                                            :rules="[v => !!v || 'Item is required']"
                                            required
                                          ></v-select>
                                        </v-flex>
                                        <v-flex xs12 md6>
                                          <v-select
                                            v-model="editedItem.priority"
                                            :items="priorityItems"
                                            :item="editedItem.priority"
                                            label="Priority"
                                            :rules="[v => !!v || 'Item is required']"
                                            required
                                          ></v-select>
                                        </v-flex>
                                        <v-flex xs12>
                                          <v-textarea
                                            v-model="editedItem.note"
                                            box
                                            label="Note"
                                          ></v-textarea>
                                        </v-flex>
                                      </v-layout>
                                    </v-container>
                                  </v-form>
                                </v-card-text>

                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                                  <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                          </v-toolbar>
                          <v-divider></v-divider>
                          <v-card-text class="pa-0">
                            <v-data-table
                              :loading="loading"
                              :headers="headers"
                              :items="caseItems"
                              :search="search"
                              :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                              class="elevation-1"
                            >
                              <template v-slot:items="props">
                                <td><v-icon v-if="props.item.file" small>folder_open</v-icon> <v-icon v-if="props.item.incident === 'Yes'" small>lock</v-icon><v-icon color="red" v-if="props.item.incident === 'Yes'" small>info</v-icon></td>
                                <td class="text-xs-center">{{ props.item.type }}</td>
                                <td class="text-xs-center">{{ props.item.startDate ? (props.item.startDate).toString().substr(0,10) : '' }}</td>
                                <td class="text-xs-center">{{ props.item.author }}</td>
                                <td class="text-xs-center">{{ props.item.subject }}</td>
                                <td class="text-xs-center">{{ props.item.tag }}</td>
                                <td class="text-xs-center">{{ props.item.version }}</td>
                                <td class="text-xs-center px-0">
                                  <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                                  <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                                </td>
                              </template>
                              <template v-slot:no-data>
                                <v-btn color="primary" @click="initialize">Reset</v-btn>
                              </template>
                            </v-data-table>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-container>

                  <v-navigation-drawer
                    v-model="advancedSearch"
                    absolute
                    temporary
                  >
                    <h4 class="text-xs-center">Advanced Search</h4>
                    <v-list>
                      <v-divider></v-divider>

                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>Billiable</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action class="pt-2 mt-2"> 
                          <v-switch v-model="billiable" mt-2></v-switch>
                        </v-list-tile-action>
                      </v-list-tile>

                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>Author</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action class="pt-2 mt-2"> 
                          <v-switch v-model="authorSelect" mt-2></v-switch>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                    <v-autocomplete
                      v-if="authorSelect"
                      flat
                      v-model="authorModel"
                      :items="authorItems"
                      :loading="isLoading"
                      :search-input.sync="authorSearch"
                      clearable
                      hide-no-data
                      hide-selected
                      item-text="name"
                      item-value="id"
                      :label="'Select Author Name'"
                      append-outer-icon="search"
                      class="mt-0 px-3 d-xl-inline-flex"
                      return-object
                    >
                    </v-autocomplete>
                    <v-list>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>Date Range</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action class="pt-2 mt-2"> 
                          <v-switch v-model="rangeSelect" mt-2></v-switch>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                    <div class="px-3" v-if="rangeSelect">
                     <v-dialog
                      ref="dialog1"
                      v-model="modalStart"
                      :return-value.sync="dateStart"
                      persistent
                      lazy
                      full-width
                      width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="dateStart"
                          label="Start Date"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="dateStart" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialog1.save(dateStart)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>

                    <v-dialog
                      ref="dialog"
                      v-model="modalEnd"
                      :return-value.sync="dateEnd"
                      persistent
                      lazy
                      full-width
                      width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="dateEnd"
                          label="End Date"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="dateEnd" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialog.save(dateEnd)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                    </div>

                    <v-list>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>Type</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action class="pt-2 mt-2"> 
                          <v-switch v-model="typeSelect" mt-2></v-switch>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                    <v-autocomplete
                      v-if="typeSelect"
                      flat
                      v-model="typeModel"
                      :items="typeItems"
                      :loading="isLoading"
                      :search-input.sync="typeSearch"
                      clearable
                      hide-no-data
                      hide-selected
                      item-text="type"
                      item-value="id"
                      :label="'Select Type'"
                      append-outer-icon="search"
                      class="mt-0 px-3 d-xl-inline-flex"
                      return-object
                    >
                    </v-autocomplete>

                    <v-list>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>Incident</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action class="pt-2 mt-2"> 
                          <v-switch v-model="incidentSelect" mt-2></v-switch>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                    <v-select
                      v-if="incidentSelect"
                      v-model="incidentSearch"
                      :items="incidentItems"
                      label="Incident"
                      class="mt-0 px-3 d-xl-inline-flex"
                    ></v-select>

                    <v-list>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>Priority</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action class="pt-2 mt-2"> 
                          <v-switch v-model="prioritySelect" mt-2></v-switch>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                   <v-select
                      v-if="prioritySelect"
                      v-model="prioritySearch"
                      :items="priorityItems"
                      label="Priority"
                      class="mt-0 px-3 d-xl-inline-flex"
                    ></v-select>
                    
                    <v-btn small color="success" class="text-xs-center mr-0" @click="advancedSearch = false; initialize">Search</v-btn>
                    <v-btn small dark color="red" class="text-xs-center mr-0" @click="advancedSearch = false">Cancel</v-btn>
                    <v-btn small class="text-xs-center mr-0" @click="resetSearch">Reset</v-btn>
                  </v-navigation-drawer>
                </v-layout>
              </v-card-text>
            </vue-perfect-scrollbar>  
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import CaseNotes from './CaseNotes.vm.js';
export default CaseNotes;
</script>
<style scoped lang="css">
.perfect--scrollbar {
    height: calc(100vh - 300px);
}
</style>
