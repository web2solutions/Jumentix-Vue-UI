
<template>
  <span>
    <v-tooltip top>
      <v-btn flat small color="primary" slot="activator" @click.prevent="() => dialog = true">
        <v-icon left>playlist_add</v-icon>
        <span>Add new Task</span>
      </v-btn>
      <span>Create a new Task</span>
    </v-tooltip>

   <!--  <v-tooltip top>
      <v-btn fab dark small color="light-blue" slot="activator" @click="dialog = true">
        <v-icon>playlist_add</v-icon>
      </v-btn>
      <span>Create a new Task</span>
    </v-tooltip>
    <a href="" @click.prevent="() => dialog = true">+ Add new Task</a> -->

    <v-dialog v-model="dialog" scrollable transition="dialog-transition" max-width="700px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{ taskEdit === false ? 'Create New Task' : 'Edit Task' }} <span v-show="status"> with <b>{{ status }}</b> status</span></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="cancelNewTask()">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="formTaskAdd" lazy-validation v-model="valid">
            <v-stepper v-model="step" vertical class="elevation-0">
              <v-stepper-step :complete="step > 1" step="1">
                Task information
                <small>Set description, type and status</small>
              </v-stepper-step>

              <v-stepper-content step="1">
                <v-card class="elevation-0 mb-3">
                  <v-card-text>
                    <v-container grid-list-xs pa-1>
                      <v-layout wrap>
                        <v-flex xs12 py-0 mx-0>
                          <v-text-field
                            v-model="taskAdd.name"
                            prepend-icon="text_fields"
                            label="Task Name *"
                            hint="The Task Name."
                            persistent-hint
                            counter
                            maxlength="255"
                            :validate-on-blur="true"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-autocomplete
                            v-model="taskAdd.status"
                            prepend-icon="toc"
                            label="Task Status *"
                            hint="Task Status"
                            :items="taskStatusItems"
                            clearable
                            persistent-hint
                            chips
                            item-text="label"
                            item-value="id"
                            :rules="[rules.required]"
                            required
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-autocomplete
                            v-model="taskAdd.type"
                            prepend-icon="toc"
                            label="Task Type *"
                            hint="Task Type"
                            :items="taskTypeItems"
                            clearable
                            persistent-hint
                            chips
                            :rules="[rules.required]"
                            required
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12>
                          <v-textarea
                            v-model="taskAdd.description"
                            prepend-icon="text_fields"
                            label="Description *"
                            hint="The Task Description."
                            persistent-hint
                            counter
                            maxlength="1024"
                            :validate-on-blur="true"
                            :rules="[rules.required]"
                            auto-grow
                          ></v-textarea>
                        </v-flex>
                        <v-flex xs12 md7 pt-5>
                          <small>*indicates required field</small>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                </v-card>
                <v-btn color="primary" @click="$refs.formTaskAdd.validate() === true ? step = 2 : step = 1">Continue</v-btn>
              </v-stepper-content>

              <v-stepper-step :complete="step > 2" step="2">
                Group & Subgroup
                <small>Insert this Task into a Group or Subgroup</small>
              </v-stepper-step>

              <v-stepper-content step="2">
                <v-card class="elevation-0 mb-3">
                  <v-card-text>
                    <v-container grid-list-xs pa-1>
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-radio-group class="pl-3" v-model="selectGroup" row>
                            <v-radio value="AddTaskOnly">
                              <template v-slot:label>
                                <div>Create Task only</div>
                              </template>
                            </v-radio>
                            <v-radio value="InsertInGroup">
                              <template v-slot:label>
                                <div>Insert to a Group</div>
                              </template>
                            </v-radio>
                            <v-radio value="InsertInSubGroup">
                              <template v-slot:label>
                                <div>Insert to a SubGroup</div>
                              </template>
                            </v-radio>
                          </v-radio-group>
                        </v-flex>
                      </v-layout>
                      <v-expand-transition>
                        <template v-if="selectGroup === 'InsertInGroup'">
                          <v-layout wrap>
                            <v-flex xs12 py-0 mx-0>
                              <v-autocomplete
                                v-model="taskGroup"
                                prepend-icon="toc"
                                label="Task Group *"
                                hint="Task Group Name"
                                :items="taskGroupItems"
                                clearable
                                persistent-hint
                                chips
                                item-text="name"
                                item-value="id"
                              >
                                <template v-slot:append-outer>
                                  <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                      <v-icon
                                        v-on="on"
                                        @click="addUserDialog = !addUserDialog"
                                        v-text="'add'"
                                      ></v-icon>
                                    </template>
                                    <span>Create a new Group</span>
                                  </v-tooltip>
                                </template>
                              </v-autocomplete>
                            </v-flex>
                          </v-layout>
                        </template>
                      </v-expand-transition>

                      <v-expand-transition>
                        <template v-if="selectGroup === 'InsertInSubGroup'">
                          <v-layout wrap>
                            <v-flex xs12 py-0 mx-0>
                              <v-autocomplete
                                v-model="taskGroup"
                                prepend-icon="toc"
                                label="Task Group *"
                                hint="Task Group Name"
                                :items="taskGroupItems"
                                clearable
                                persistent-hint
                                chips
                                item-text="name"
                                item-value="id"
                              >
                                <template v-slot:append-outer>
                                  <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                      <v-icon
                                        v-on="on"
                                        @click="openAddDialog('group')"
                                        v-text="'add'"
                                      ></v-icon>
                                    </template>
                                    <span>Create a new Group</span>
                                  </v-tooltip>
                                </template>
                              </v-autocomplete>
                            </v-flex>
                            <v-flex xs12 py-0 mx-0>
                              <v-autocomplete
                                v-model="taskSubGroup"
                                prepend-icon="toc"
                                label="Task SubGroup *"
                                hint="Task SubGroup Name"
                                :items="taskSubGroupItems"
                                clearable
                                persistent-hint
                                chips
                                item-text="name"
                                item-value="id"
                                :disabled="subGroupDisabled"
                              >
                                <template v-slot:append-outer>
                                  <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                      <v-icon
                                        v-on="on"
                                        @click="openAddDialog('subGroup')"
                                        v-text="'add'"
                                      ></v-icon>
                                    </template>
                                    <span>Create a new SubGroup</span>
                                  </v-tooltip>
                                </template>
                              </v-autocomplete>
                            </v-flex>
                          </v-layout>
                        </template>
                      </v-expand-transition>
                    </v-container>
                  </v-card-text>
                </v-card>
                <v-btn flat @click="step = step - 1">Previous</v-btn>
                <v-btn color="primary" @click="step = 3">Continue</v-btn>
              </v-stepper-content>

              <v-stepper-step :complete="step > 3" step="3">
                Cases & Caseworkers
                <small>Select the Caseworkers and Cases for this Task</small>
              </v-stepper-step>

              <v-stepper-content step="3">
                <v-card class="elevation-0 mb-3">
                  <v-card-text>
                    <v-container grid-list-xs pa-1>
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-autocomplete
                                v-model="taskAdd.caseworker"
                                prepend-icon="toc"
                                label="Caseworkers"
                                hint="The Associated Caseworkers IDs"
                                :items="taskCaseworkersItems"
                                clearable
                                persistent-hint
                                chips
                                multiple
                                item-text="first_name"
                                item-value="_id"
                              >
                                <template v-slot:append-outer>
                                  <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                      <v-icon
                                        v-on="on"
                                        @click="openAddDialog('Caseworkers')"
                                        v-text="'add'"
                                      ></v-icon>
                                    </template>
                                    <span>Create a new Caseworker</span>
                                  </v-tooltip>
                                </template>
                              </v-autocomplete>
                        </v-flex>
                        <v-flex xs12>
                          <v-autocomplete
                            v-model="taskAdd.case"
                            prepend-icon="toc"
                            label="Cases"
                            hint="The Associated Cases IDs"
                            :items="taskCasesItems"
                            clearable
                            persistent-hint
                            chips
                            multiple
                            item-text="display_name"
                            item-value="_id"
                          >
                            <template v-slot:append-outer>
                              <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    v-on="on"
                                    @click="openAddDialog('Cases')"
                                    v-text="'add'"
                                  ></v-icon>
                                </template>
                                <span>Create a new Case</span>
                              </v-tooltip>
                            </template>
                          </v-autocomplete>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                </v-card>
                <v-btn flat @click="step = step - 1">Previous</v-btn>
                <v-btn color="primary" @click="step = 4">Continue</v-btn>
              </v-stepper-content>

              <v-stepper-step :complete="step > 4" step="4">
                Notification & Message Groups
                <small>Select the Notification type and Message Groups for this Task</small>
              </v-stepper-step>

              <v-stepper-content step="4">
                <v-card class="elevation-0 mb-3">
                  <v-card-text>
                    <v-container grid-list-xs pa-1>
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-autocomplete
                            v-model="taskAdd.notification_type"
                            prepend-icon="toc"
                            label="Notification"
                            hint="Notification Type"
                            :items="notificationTypeItems"
                            clearable
                            persistent-hint
                            chips
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12>
                          <v-autocomplete
                            v-model="taskAdd.group"
                            prepend-icon="toc"
                            label="Groups"
                            hint="Message groups"
                            :items="groupsItems"
                            clearable
                            persistent-hint
                            chips
                            multiple
                            item-text="name"
                            item-value="_id"
                          ></v-autocomplete>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                </v-card>
                <v-btn flat @click="step = step - 1">Previous</v-btn>
                <v-btn color="primary" @click="step = 5">Continue</v-btn>
              </v-stepper-content>

              <v-stepper-step step="5">
                Other Settings
                <small>Expire Time, Associated Event/Survey/Refetence Type, URL, etc</small>
              </v-stepper-step>

              <v-stepper-content step="5">
                <v-card class="elevation-0 mb-3">
                  <v-card-text>
                    <v-container grid-list-xs pa-1>
                      <v-layout row wrap>
                        <v-flex xs12 md6>
                          <datetime-picker label="Expire Date" hint="Expire time for task if is public?" v-model="taskAdd.expire"> </datetime-picker>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-autocomplete
                            v-model="taskAdd.event"
                            prepend-icon="toc"
                            label="Event"
                            hint="The associated Event ID"
                            :items="eventItems"
                            clearable
                            persistent-hint
                            chips
                            item-text="name"
                            item-value="_id"
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-autocomplete
                            v-model="taskAdd.survey"
                            prepend-icon="toc"
                            label="Survey"
                            hint="The associated Survey ID"
                            :items="surveyItems"
                            clearable
                            persistent-hint
                            chips
                            item-text="name"
                            item-value="_id"
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-autocomplete
                            v-model="taskAdd.reference_type"
                            prepend-icon="toc"
                            label="Reference Type"
                            hint="Task reference type"
                            :items="referenceTypeItems"
                            clearable
                            persistent-hint
                            chips
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field
                            v-model="taskAdd.URL"
                            prepend-icon="text_fields"
                            label="URL"
                            hint="The Task URL."
                            persistent-hint
                            counter
                            maxlength="255"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-switch
                            v-model="taskAdd.auto_approve"
                            label="Auto Approve"
                            prepend-icon="done"
                          ></v-switch>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-switch
                            v-model="taskAdd.disable"
                            label="Disable"
                            prepend-icon="done"
                          ></v-switch>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-switch
                            v-model="taskAdd.ispublic"
                            label="Is Public"
                            prepend-icon="done"
                          ></v-switch>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                </v-card>
                <v-btn flat @click="step = step - 1">Previous</v-btn>
                <v-btn color="primary" @click="createNewTask()">{{ taskEdit === false ? 'Create' : 'Save Task' }}</v-btn>
              </v-stepper-content>
            </v-stepper>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="cancelNewTask()">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="createNewTask()">{{ taskEdit === false ? 'Create' : 'Save Task' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialogs Create Groups/SubGroups -->

    <v-snackbar
      v-model="snack"
      :timeout="3000"
      :color="snackColor"
      :top="true"
      >
        {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
  </span>
</template>

<script>
import TaskAdd from './TaskAdd.vm.js';
export default TaskAdd;
</script>
