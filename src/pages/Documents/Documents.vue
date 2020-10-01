<template>
  <div id="Documents">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-card-title primary-title>
                <v-btn class="hidden-sm-and-down" color="primary" @click="onUploadBtn">
                  <v-icon left>cloud_upload</v-icon>
                  Upload
                </v-btn>
                <v-btn class="hidden-sm-and-down" flat @click="downloadDoc" :disabled="btnDisabled">
                  <v-icon left>cloud_download</v-icon>
                  Download</v-btn>
                <v-btn class="hidden-sm-and-down" flat @click="deleteDoc" :disabled="btnDisabled">
                  <v-icon left>delete</v-icon>
                  Delete</v-btn>
                <v-btn class="hidden-sm-and-down" flat @click="searchDoc" :disabled="btnDisabled">
                   <v-icon left>search</v-icon>
                   Search</v-btn>
                <v-spacer></v-spacer>
                <v-menu bottom left>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      fab
                      v-on="on"
                      class="hidden-md-and-up" 
                    >
                      <v-icon>menu</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-tile>
                      <v-list-tile-title @click="onUploadBtn">
                        <v-icon left>cloud_upload</v-icon>
                        Upload
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-title @click="downloadDoc" :disabled="btnDisabled">
                        <v-icon left>cloud_download</v-icon>
                        Download
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-title @click="deleteDoc" :disabled="btnDisabled">
                        <v-icon left>delete</v-icon>
                        Delete
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-title @click="searchDoc" :disabled="btnDisabled">
                        <v-icon left>search</v-icon>
                        Search
                      </v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
            </v-card-title>
            <vue-perfect-scrollbar class="perfect--scrollbar">
              <v-card-text>
                <v-expand-transition>
                  <div class="upload px-4 pb-4" v-show="expandUpload">
                    <file-container 
                      :media="media"
                      @uploaded="onUploaded"
                      @deleted="onFileDeleted"
                      label="Choose document in proper format e.g. doc,docx,pdf etc">
                    </file-container>
                  </div>
                </v-expand-transition>
                <v-expand-transition>
                  <v-card v-show="expandUploadInfo">
                    <v-card-text>
                      <v-container grid-list-xs>
                        <v-layout row wrap>
                          <v-flex xs12>
                            <v-textarea
                              label="Description"
                              name="name"
                              hint="Please add some information about the document"
                              persistent-hint
                            ></v-textarea>
                          </v-flex>

                          <v-flex xs12 md6>
                            <v-autocomplete
                              v-model="fileTypeItemsSelected"
                              :items="fileTypeData"
                              chips
                              color="blue-grey lighten-2"
                              label="File Type"
                              item-text="text"
                              item-value="text"
                              multiple
                              >
                              <template v-slot:selection="data">
                                  <v-chip
                                  :selected="data.selected"
                                  small
                                  close
                                  class="chip--select-multi"
                                  >
                                  {{ data.item.text }}
                                  </v-chip>
                              </template>
                              <template v-slot:item="data">
                                  <template v-if="typeof data.item !== 'object'">
                                  <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                  </template>
                                  <template v-else>
                                  <v-list-tile-content>
                                      <v-list-tile-title v-html="data.item.text"></v-list-tile-title>
                                  </v-list-tile-content>
                                  </template>
                              </template>
                            </v-autocomplete>
                          </v-flex>

                          <v-flex xs12 md6>
                            <v-autocomplete
                            v-model="groupItemsSelected"
                            :items="groupItems"
                            chips
                            color="blue-grey lighten-2"
                            label="Groups"
                            item-text="name"
                            item-value="name"
                            multiple
                            >
                            <template v-slot:selection="data">
                                <v-chip
                                :selected="data.selected"
                                small
                                close
                                class="chip--select-multi"
                                >
                                {{ data.item.name }}
                                </v-chip>
                            </template>
                            <template v-slot:item="data">
                                <template v-if="typeof data.item !== 'object'">
                                <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                </template>
                                <template v-else>
                                <v-list-tile-content>
                                    <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                </v-list-tile-content>
                                </template>
                            </template>
                            </v-autocomplete>
                          </v-flex>

                          <v-flex xs12 md6>
                            <v-autocomplete
                            v-model="phaseItemsSelected"
                            :items="phaseData"
                            chips
                            color="blue-grey lighten-2"
                            label="Phases"
                            item-text="text"
                            item-value="value"
                            multiple
                            >
                            <template v-slot:selection="data">
                                <v-chip
                                :selected="data.selected"
                                small
                                close
                                class="chip--select-multi"
                                >
                                {{ data.item.text }}
                                </v-chip>
                            </template>
                            <template v-slot:item="data">
                                <template v-if="typeof data.item !== 'object'">
                                <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                </template>
                                <template v-else>
                                <v-list-tile-content>
                                    <v-list-tile-title v-html="data.item.text"></v-list-tile-title>
                                </v-list-tile-content>
                                </template>
                            </template>
                            </v-autocomplete>
                          </v-flex>

                          <v-flex xs12 md6>
                            <v-autocomplete
                            v-model="userItemsSelected"
                            :items="userData"
                            chips
                            color="blue-grey lighten-2"
                            label="Post to Users"
                            item-text="text"
                            item-value="value"
                            multiple
                            >
                            <template v-slot:selection="data">
                                <v-chip
                                :selected="data.selected"
                                small
                                close
                                class="chip--select-multi"
                                >
                                {{ data.item.text }}
                                </v-chip>
                            </template>
                            <template v-slot:item="data">
                                <template v-if="typeof data.item !== 'object'">
                                <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                </template>
                                <template v-else>
                                <v-list-tile-content>
                                    <v-list-tile-title v-html="data.item.text"></v-list-tile-title>
                                </v-list-tile-content>
                                </template>
                            </template>
                            </v-autocomplete>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red" dark @click="onUploadBtn">Cancel</v-btn>
                      <v-btn color="success" @click="onUploadBtn">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-expand-transition>
                <v-expand-transition>
                  <v-container fluid mt-0 pt-0 v-show="expandSearch">
                    <v-radio-group 
                      row
                      @change="onRadioChange"
                    >
                      <v-radio label="Search by Group" value="group"></v-radio>
                      <v-radio label="Search by User" value="user"></v-radio>
                    </v-radio-group>
                    
                    <v-expand-transition>
                      <v-flex xs12 sm6 d-flex v-if="searchGroup">
                        <v-select
                          :items="groupItems"
                          label="Groups"
                          clearable
                          item-text="name"
                          item-value="name"
                          append-outer-icon="search"
                          @click:append-outer="openSelect"
                        ></v-select>
                      </v-flex>
                    </v-expand-transition>

                    <v-expand-transition>
                      <v-container grid-list-xs pa-0>
                        <v-layout row wrap v-if="searchUser">
                          <v-flex xs12 sm4 d-flex>
                            <v-autocomplete
                              :items="lastNameData"
                              clearable
                              color="blue-grey lighten-2"
                              label="Last Name"
                              item-text="name"
                              item-value="name"
                            >
                              <template v-slot:item="data">
                                  <template v-if="typeof data.item !== 'object'">
                                  <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                  </template>
                                  <template v-else>
                                  <v-list-tile-content>
                                      <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                  </v-list-tile-content>
                                  </template>
                              </template>
                            </v-autocomplete>
                          </v-flex>

                          <v-flex xs12 sm4 d-flex>
                            <v-autocomplete
                              :items="caseNumberData"
                              clearable
                              color="blue-grey lighten-2"
                              label="Case Number"
                              item-text="name"
                              item-value="name"
                            >
                              <template v-slot:item="data">
                                  <template v-if="typeof data.item !== 'object'">
                                  <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                  </template>
                                  <template v-else>
                                  <v-list-tile-content>
                                      <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                  </v-list-tile-content>
                                  </template>
                              </template>
                            </v-autocomplete>
                          </v-flex>

                          <v-flex xs12 sm4 d-flex>
                            <v-autocomplete
                              :items="caseStatusData"
                              clearable
                              color="blue-grey lighten-2"
                              label="Case Status"
                              item-text="name"
                              item-value="name"
                            >
                              <template v-slot:item="data">
                                  <template v-if="typeof data.item !== 'object'">
                                  <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                  </template>
                                  <template v-else>
                                  <v-list-tile-content>
                                      <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                  </v-list-tile-content>
                                  </template>
                              </template>
                            </v-autocomplete>
                          </v-flex>
                          <v-flex xs12>
                            <v-btn block color="primary" @click="openSelect">Select</v-btn>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-expand-transition>

                  </v-container>
                </v-expand-transition>

                <v-expand-transition>
                  <v-card v-if="expandDataTable">
                    <v-expand-transition>
                      <v-card-title>
                        <v-spacer></v-spacer>
                        <v-text-field
                          v-model="search"
                          append-icon="search"
                          label="Search"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-card-title>
                    </v-expand-transition>
                    <v-data-table
                      v-model="selected"
                      :headers="headers"
                      :items="documents"
                      :search="search"
                      item-key="document"
                      select-all
                    >
                      <template v-slot:items="props">
                        <td width="20">
                          <v-checkbox
                            v-model="props.selected"
                            primary
                            hide-details
                          ></v-checkbox>
                        </td>
                        <td>{{ props.item.document }}</td>
                        <td class="text-xs-center">{{ props.item.date }}</td>
                        <td class="text-xs-center">{{ props.item.type }}</td>
                        <td class="text-xs-center">{{ props.item.source }}</td>
                      </template>
                      <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                        Your search for "{{ search }}" found no results.
                      </v-alert>
                    </v-data-table>
                  </v-card>
                </v-expand-transition>

                <v-expand-transition>
                  <v-card v-show="expandDataTableSearch">
                    <v-data-table
                      v-model="selected"
                      :headers="headersSearch"
                      :items="documentsSearch"
                      item-key="last_name"
                      select-all
                    >
                      <template v-slot:items="props">
                        <td width="20">
                          <v-checkbox
                            v-model="props.selected"
                            primary
                            hide-details
                          ></v-checkbox>
                        </td>
                        <td>{{ props.item.last_name }}</td>
                        <td class="text-xs-center">{{ props.item.caseNumber }}</td>
                        <td class="text-xs-center">{{ props.item.caseStatus }}</td>
                      </template>
                      <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                        Your search for "{{ search }}" found no results.
                      </v-alert>
                    </v-data-table>
                  </v-card>
                </v-expand-transition>
              </v-card-text>
            </vue-perfect-scrollbar> 
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import Documents from './Documents.vm.js';
export default Documents;
</script>
<style scoped lang="css">
.perfect--scrollbar {
  height: calc(100vh - 240px) !important;
}
</style>
