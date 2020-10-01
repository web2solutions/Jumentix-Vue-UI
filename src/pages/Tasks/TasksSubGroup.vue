<template>
  <v-container id="TaskSubGroup" grid-list-xl fluid py-0>
    <v-layout row wrap>
      <v-flex xs12>
        <v-toolbar flat class="toolbar--task">
          <v-tooltip top>
            <v-btn fab dark color="blue" :to="'/tasks-group/'+TaskGroup.task_group" slot="activator">
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
            <span>Back to Group {{ TaskGroup.name }}</span>
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
                color="light-blue"
                slot="activator"
                @click="bus.$emit('createItem')"
              >
                <v-icon>list</v-icon>
              </v-btn>
              <span>Create a new Task</span>
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
              <span>Delete SubGroup</span>
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
                    <task-add></task-add>
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
            
            <v-expansion-panel-content>
              <template v-slot:header>
              <div @click.prevent="() => fillUngrouped()"><span class="text-uppercase">Ungrouped Taks</span></div>
              </template>
              <v-card>
                <v-card-text>
                  <v-data-table
                    :headers="taskHeaders"
                    :items="taskItems"
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
import TasksSubGroup from './TasksSubGroup.vm.js';
export default TasksSubGroup;
</script>
<style lang="css">
  @import './components/xKanban/assets/xkanban.css';
  .perfect--scrollbar--task {
      height: calc(100vh - 310px);
  }
  .toolbar--task {
    z-index: 1;
  }
  #TaskSubGroup .drag-inner-list {
    max-height: calc(100vh - 435px);
  }
</style>
