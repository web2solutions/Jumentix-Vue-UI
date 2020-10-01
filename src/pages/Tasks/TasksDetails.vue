<template>
  <div id="TasksDetails">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-card-title primary-title>
                <h3>Flintstone, Wilma and Fred (3)</h3>
            </v-card-title>
            <v-card-text>
                <v-tabs
                show-arrows
              >

                <v-tab href="#tab-1">
                  Task
                </v-tab>

                <v-tab href="#tab-2">
                  Task Assignment
                </v-tab>

                <v-tab href="#tab-3">
                  Comments
                </v-tab>

                <v-tab href="#tab-4">
                  History

                </v-tab>
                <v-tabs-items>
                    <v-tab-item value="tab-1">
                        <v-card flat>
                        <v-card-text>
                            <v-container grid-list-xs>
                                <v-layout row wrap>
                                    <v-flex xs12 md6>
                                        <v-select
                                        :items="priorityItems"
                                        label="Priotity"
                                        ></v-select>
                                    </v-flex>
                                    <v-flex xs12 md6>
                                        <v-select
                                        :items="contextTask"
                                        label="Context"
                                        ></v-select>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 md6>
                                         <v-dialog
                                        ref="dialog"
                                        v-model="date_issue_pick"
                                        :return-value.sync="date"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="date"
                                            prepend-icon="event"
                                            readonly
                                            v-on="on"
                                            label="End Date"
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="date" @input="date_issue_pick = false" scrollable></v-date-picker>
                                    </v-dialog>
                                    </v-flex>
                                    <v-flex xs12 md6>
                                        <v-range-slider
                                            :tick-labels="seasons"
                                            :value="[0, 1]"
                                            always-dirty
                                            min="0"
                                            max="3"
                                            thumb-label
                                            thumb-size="64"
                                            ticks="always"
                                            label="% Complete (0 to 100)"
                                            class="d-block"
                                        >
                                            <template v-slot:thumb-label="props">
                                            <span>
                                                {{ season(props.value) }}
                                            </span>
                                            </template>
                                        </v-range-slider>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field
                                            name="title"
                                            label="Title"
                                            id="id"
                                            value="Consider delegating Vivek's tasks"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                            <v-subheader>Description</v-subheader>
                                        <quill-editor 
                                            class="quill"
                                            :content="content"
                                            :options="editorOption"
                                        >
                                        </quill-editor>   
                                    </v-flex>
                                </v-layout>
                                
                            </v-container>
                        </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item value="tab-2">
                        <v-card>
                        <v-card-text ma-4>
                            <v-icon>mdi-folder</v-icon>
                          <v-list>
          <v-list-group
            v-for="item in items"
            :key="item.title"
            v-model="item.active"
            :prepend-icon="item.action"
            no-action
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>
                      {{ item.title }}
                    </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>

            <v-list-tile
              v-for="subItem in item.items"
              :key="subItem.title"
              @click="null"
            >
              <v-list-tile-content>
                  <v-checkbox :label="subItem.title" v-model="subItem.check" value="value"></v-checkbox>
                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon>{{ subItem.action }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
                        </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item value="tab-3">
                        <v-card flat>
                        <v-card-text>
                            
                            <v-toolbar flat color="white">
        
                                <v-dialog v-model="dialog" max-width="500px">
                                    <template v-slot:activator="{ on }">
                                    <v-btn color="primary" dark class="mb-2" v-on="on">New Comment</v-btn>
                                    </template>
                                    <v-card>
                                    <v-card-title>
                                        <span class="headline">{{ formTitle }}</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container grid-list-md>
                                        <v-layout wrap>
                                            <v-flex xs12>
                                            <v-text-field v-model="editedItem.comments" label="Comments"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12>
                                            <v-text-field v-model="editedItem.by" label="By"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12>
                                            <v-text-field v-model="editedItem.date" label="Date"></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                                        <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                                    </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                </v-toolbar>
                                <v-data-table
                                :headers="headersComments"
                                :items="CommentTasks"
                                class="elevation-1"
                                >
                                <template v-slot:items="props">
                                    <td class="text-xs-left">{{ props.item.comments }}</td>
                                    <td class="text-xs-left">{{ props.item.by }}</td>
                                    <td class="">{{ props.item.date }}</td>
                                    <td class="justify-center layout px-0">
                                    <v-icon
                                        small
                                        class="mr-2"
                                        @click="editItem(props.item)"
                                    >
                                        edit
                                    </v-icon>
                                    <v-icon
                                        small
                                        @click="deleteItem(props.item)"
                                    >
                                        delete
                                    </v-icon>
                                    </td>
                                </template>
                                <template v-slot:no-data>
                                    <v-btn color="primary" @click="initialize">Reset</v-btn>
                                </template>
                                </v-data-table>

                        </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item value="tab-4">
                        <v-card flat>
                        <v-card-text>
                            
                            <v-data-table
                                :headers="headersHistory"
                                :items="HistoryTasks"
                                class="elevation-1"
                            >
                                <template v-slot:items="props">
                                <td>{{ props.item.date }}</td>
                                <td>{{ props.item.user }}</td>
                                <td>{{ props.item.action }}</td>
                                </template>
                            </v-data-table>
                        </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>

                
              </v-tabs>
              <v-card-actions text-xs-center>
                  <v-btn color="success">Save</v-btn>
                  <v-btn color="primary">Cancel</v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import TasksDetails from './TasksDetails.vm.js';
export default TasksDetails;
</script>
<style scoped>
.v-input__slot{
    display: block !important;
}

</style>
