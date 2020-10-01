<template>
  <v-container grid-list-xl fluid py-0>
    <v-layout row wrap>
      <v-flex xs12>
        <v-toolbar flat class="toolbar--task">
          <v-tooltip top>
            <v-btn fab dark color="blue" to="/tasks" slot="activator">
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
            <span>Back to Group listing</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-toolbar-title class="display-1 font-weight-light text-uppercase">{{ TaskGroup.name }}</v-toolbar-title>
            
          <v-spacer></v-spacer>

          <v-speed-dial
            v-model="fab"
            absolute
            right
            direction="bottom"
            open
            transition="slide-y-transition"
            class="fab btn-add"
          >
            
            <template v-slot:activator>
              <v-btn
                v-model="fab"
                color="grey darken-2"
                dark
                fab
                flat
              >
                <v-icon>more_vert</v-icon>
                <v-icon>close</v-icon>
              </v-btn>
            </template>
            <v-tooltip left>
              <v-btn
                fab
                dark
                small
                color="light-blue darken-2"
                slot="activator"
                @click="openAddDialog('subGroup')"
              >
                <v-icon>fas fa-layer-group</v-icon>
              </v-btn>
              <span>Create a new SubGroup</span>
            </v-tooltip>
            <v-tooltip left>
              <v-btn
                fab
                dark
                small
                color="red darken-4"
                slot="activator"
                @click="bus.$emit('createItem')"
              >
                <v-icon>delete</v-icon>
              </v-btn>
              <span>Delete Group</span>
            </v-tooltip>
          </v-speed-dial>
        </v-toolbar>
      </v-flex>
    </v-layout>
    
    <v-layout row wrap>
      <v-flex lg12>
        <v-expansion-panel
          :value="0"
        >
          <v-expansion-panel-content>
            <template v-slot:header>
              <span class="text-uppercase">Tasks</span>
            </template>
            <v-card>
              <template v-if="blocks.length <= 0">
                <v-flex xs12 class="text-xs-center">
                  <h3>No Related Tasks</h3>
                  <task-add :bus="bus" :groupID="groupID"></task-add>
                </v-flex>
              </template>
              <template v-else>
                <vue-perfect-scrollbar class="perfect--scrollbar--task">
                  <v-card-text class="pt-0 card-kanban">
                    <x-kanban :stages="stages" :blocks="blocks" :bus="bus">
                      <div v-for="stage in stages" :key="stage.name" :slot="`footer-${stage.label}`">
                        <task-add :status="stage.label" :bus="bus" :groupID="groupID"></task-add>
                      </div>
                    </x-kanban>
                  </v-card-text>
                </vue-perfect-scrollbar>  
              </template>
            </v-card>
          </v-expansion-panel-content>
          
          <v-expansion-panel-content @click.prevent="() => fillUngrouped()">
            <template v-slot:header>
              <span class="text-uppercase">{{ TaskGroup.name }} Subgroups</span>
            </template>
            <v-card>
              <v-card-text>
                <task-sub-group :groupid="groupID" :bus="bus"></task-sub-group>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div @click.prevent="() => fillUngrouped()"><span class="text-uppercase">Ungrouped Taks</span></div>
            </template>
            <v-card>
              <v-card-text>
                <v-data-table
                  :headers="taskHeaders"
                  :items="taskUngroupedItems"
                  class="elevation-1"
                  :loading="loading"
                >
                  <template v-slot:items="props">
                    <td>{{ props.item.name }}</td>
                    <td class="text-xs-center">{{ props.item.type }}</td>
                    <td class="text-xs-center">{{ props.item.notification_type }}</td>
                    <td class="text-xs-center">{{ props.item.status }}</td>
                    <td class="text-xs-center">
                      <v-tooltip top>
                        <v-btn small icon class="mx-0 mt-2" slot="activator">
                          <v-icon small>layers</v-icon>
                        </v-btn>
                        <span>Add to Group</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <v-btn small icon class="mx-0 mt-2" slot="activator">
                          <v-icon small>fas fa-layer-group</v-icon>
                        </v-btn>
                        <span>Add to Subgroup</span>
                      </v-tooltip>
                    </td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>

    <v-dialog v-model="addSubGroupDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Create a new TaskSubGroup</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md py-0>
            <v-form ref="addSubGroup">
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="addSubGroup.name"
                    prepend-icon="text_fields"
                    label="Task SubGroup Name *"
                    hint="The Task SubGroup Name."
                    persistent-hint
                    counter
                    maxlength="255"
                    :validate-on-blur="true"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="addSubGroup.task_group"
                    label="TaskGroup *"
                    hint="TasksGroup associated to this Task SubGroup"
                    prepend-icon="toc"
                    :items="groups"
                    :selected="addSubGroup.task_group"
                    clearable
                    persistent-hint
                    chips
                    item-text="name"
                    item-value="id"
                    :rules="[rules.required]"
                    required
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="addSubGroup.task"
                    label="Tasks *"
                    hint="The tasks of this Task SubGroup"
                    prepend-icon="toc"
                    :items="taskItems"
                    :selected="addSubGroup.task"
                    clearable
                    persistent-hint
                    chips
                    item-text="name"
                    item-value="id"
                    :rules="[rules.required]"
                    required
                    multiple
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="addSubGroup.group"
                    label="Groups *"
                    hint="Message Groups"
                    prepend-icon="toc"
                    :items="groupsItems"
                    clearable
                    persistent-hint
                    chips
                    item-text="name"
                    item-value="id"
                    :rules="[rules.required]"
                    required
                    multiple
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 pt-2>
                  <small>*indicates required field</small>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeNew()">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="addNew('TaskSubGroup', 'addSubGroup', addSubGroup)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_loading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
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
  </v-container>
</template>
<script>
import TasksGroup from './TasksGroup.vm.js';
export default TasksGroup;
</script>
<style lang="css">
  @import './components/xKanban/assets/xkanban.css';
  .perfect--scrollbar--task {
      height: calc(100vh - 370px);
  }
  .toolbar--task {
    z-index: 1;
  }
  .drag-column-footer {
    text-align: center !important;
  }
</style>
