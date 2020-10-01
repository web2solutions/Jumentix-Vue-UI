<template>
  <v-container fluid fill-height id="PhasesTop">
    <v-card class="elevation-0">
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Phases</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn color="primary" small dark class="mb-2" @click="phaseDialog = true">New Phase</v-btn>
            </v-toolbar>

            <v-data-table :headers="headers" :items="phasesItems">
              <template v-slot:items="props">
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.task ? props.item.task.length : 0 }}</td>
                <td class="text-xs-right">
                  <v-icon small class="mr-2" @click="editItem(props.item, 'phase')">edit</v-icon>
                  <v-icon small @click="deleteItem(props.item, 'phase')">delete</v-icon>
                </td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions class="mt-5">
        <v-btn flat @click="bus.$emit('previewStep')">Preview</v-btn>
        <v-btn color="primary" @click="bus.$emit('nextStep', 11)">Continue</v-btn>
        <v-btn flat>Cancel</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>

    <!-- New Phase Dialog -->
    <v-dialog v-model="phaseDialog" scrollable max-width="650px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ phaseFormTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="phase" lazy-validation>
            <v-container grid-list-md pt-0>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="phaseSchema.name"
                    label="Phase Name"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12>
                  <v-toolbar flat color="white" class="pr-0">
                    <v-toolbar-title>Assign Task to Phase</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      small
                      dark
                      class="mb-2"
                      @click="tasksDialog = true"
                    >Select Tasks</v-btn>
                  </v-toolbar>

                  <v-data-table :headers="phaseHeaders" :items="phaseTasksItem">
                    <template v-slot:items="props">
                      <td>{{ props.item.name }}</td>
                      <td>{{ props.item.assignment }}</td>
                      <td :id="'role-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('Role', props.item.role, 'role-name-' + props.index) }}</td>
                      <td :id="'sub_role-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('SubRole', props.item.sub_role, 'sub_role-name-' + props.index) }}</td>
                      <td>{{ props.index + 1}}</td>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close('phase')">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save('phase')">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- New Task Phase Dialog -->
    <v-dialog v-model="tasksDialog" scrollable max-width="650px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ taskPhaseFormTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="task" lazy-validation>
            <v-container grid-list-md pt-0>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-toolbar flat color="white" class="pr-0">
                    <v-toolbar-title>Tasks</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                  </v-toolbar>

                  <v-data-table
                    v-model="selected"
                    :headers="tasksHeaders"
                    :items="tasksItem"
                    item-key="name"
                    select-all
                  >
                    <template v-slot:items="props">
                      <td>
                        <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
                      </td>
                      <td>{{ props.item.name }}</td>
                      <td>{{ props.item.assignment }}</td> 
                      <td :id="'task-role-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('Role', props.item.role, 'task-role-name-' + props.index) }}</td> 
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close('task')">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save('task')">Save task</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import Phases from './Phases.vm.js';
export default Phases;
</script>
<style scoped lang="css">
</style>
