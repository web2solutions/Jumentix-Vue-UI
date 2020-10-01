<template>
  <v-container id="groupTop">
    <v-card class="elevation-0">
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Groups</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn color="primary" small dark class="mb-2" @click="groupDialog = true">New Group</v-btn>
            </v-toolbar>
            <v-data-table
              :headers="groupHeaders"
              :items="groupItems"
              class="elevation-1"
            >
              <template v-slot:items="props">
                <tr @click="feedGroup(props.item)">
                  <td>{{ props.item.name }}</td>
                  <td class="text-xs-right">
                    <v-icon small class="mr-2" v-on:click.stop.prevent="editItem(props.item, 'group')">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item, 'group')">delete</v-icon>
                  </td>
                </tr>
              </template>
              <template v-slot:no-data>
                <div class="text-xs-center">
                  <v-btn small flat color="primary" @click="groupDialog = true">Add a new Group</v-btn>
                </div>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>

        <v-layout row wrap pt-2>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Programs where the selected group is joined to</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <!-- <v-btn color="primary" small dark class="mb-2" @click="groupServiceInitDialog = true">New Group Services</v-btn> -->
            </v-toolbar>
            <v-data-table
              :headers="programHeaders"
              :items="groupProgramItem"
              class="elevation-1"
              hide-actions
            >
              <template v-slot:items="props">
                <tr>
                  <td>{{ props.item.name }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>

        <v-layout row wrap pt-2>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Service Providers of selected group</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-data-table
              :headers="serviceHeadersGroup"
              :items="groupServicesItem"
              class="elevation-1"
              hide-actions
            >
              <template v-slot:items="props">
                <td :id="'human-group-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('Human', props.item.human, 'human-group-name-' + props.index) }}</td>
                <td :id="'role-group-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('Role', props.item.role, 'role-group-name-' + props.index) }}</td>
                <td>{{ moment(props.item.startDate).format('L') }}</td>
                <td>{{ moment(props.item.endDate).format('L') }}</td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>

        <v-layout row wrap pt-2>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Phases of selected group</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-data-table
              :headers="phaseHeadersGroup"
              :items="groupPhaseItem"
              class="elevation-1"
              hide-actions
            >
              <template v-slot:items="props">
                <tr @click="groupTaskItem = props.item.task">
                  <td width="100px">{{ props.item.name }}</td>
                  <td>{{ props.item.task ? props.item.task.length : 0 }}</td>
                  <td>{{ props.index }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>

        <v-layout row wrap pt-2>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Tasks of selected Phase</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-data-table :headers="tasksHeaders" :items="groupTaskItem" class="elevation-1" hide-actions>
              <template v-slot:items="props">
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.assignment }}</td>
                    <td :id="'role-group-task-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('Role', props.item.role, 'role-group-task-name-' + props.index) }}</td>
                    <td :id="'sub_role-group-task-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('SubRole', props.item.sub_role, 'sub_role-group-task-name-' + props.index) }}</td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions class="mt-5">
        <v-btn flat @click="bus.$emit('previewStep')">Preview</v-btn>
        <v-btn color="primary" @click="bus.$emit('nextStep', 12)">Continue</v-btn>
        <v-btn flat>Cancel</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
    
    <!-- New Group Dialog -->
    <v-dialog v-model="groupDialog" scrollable max-width="750px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ groupFormTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="group" lazy-validation>
            <v-container grid-list-md pb-0>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="groupSchema.name"
                    label="Group Name"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
          <v-container grid-list-md pt-0>
            <v-layout wrap>
              <v-flex xs12 pb-2>
                <v-toolbar flat color="white" class="pr-0">
                  <v-toolbar-title>Select the Programs to join this Group to</v-toolbar-title>
                  <v-divider class="mx-2" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search Program"
                    single-line
                    hide-details
                    clearable
                  ></v-text-field>
                </v-toolbar>
                <v-data-table
                  v-model="selected"
                  :headers="programHeaders"
                  :items="programItem"
                  class="elevation-1"
                  hide-actions
                  select-all
                  :search="search"
                >
                  <template slot="items" slot-scope="props">
                    <tr :active="props.selected">
                      <td>
                        <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
                      </td>
                      <td>{{ props.item.name }}</td>
                    </tr>
                  </template>
                </v-data-table>
              </v-flex>
              <v-flex xs12 pt-2>
                <v-toolbar flat color="white" class="pr-0">
                  <v-toolbar-title>Service Providers for this group</v-toolbar-title>
                  <v-divider class="mx-2" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    small
                    dark
                    class="mb-2"
                    @click="serviceDialog = true"
                  >Add Service</v-btn>
                </v-toolbar>
                <v-data-table
                  :headers="serviceHeaders"
                  :items="servicesItem"
                  class="elevation-1"
                  hide-actions
                  item-key="human"
                  dense
                >
                  <template slot="items" slot-scope="props">
                    <td :id="'human-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('Human', props.item.human, 'human-name-' + props.index) }}</td>
                    <td :id="'role-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('Role', props.item.role, 'role-name-' + props.index) }}</td>
                    <td>{{ moment(props.item.startDate).format('L') }}</td>
                    <td>{{ moment(props.item.endDate).format('L') }}</td>
                    <td class="text-xs-right">
                      <v-icon small class="mr-2" @click="editItem(props.item, 'service')">edit</v-icon>
                      <v-icon small @click="deleteItem(props.item, 'service')">delete</v-icon>
                    </td>
                  </template>

                  <template v-slot:no-data>
                    <div class="text-xs-center">No Group Service Selected</div>
                  </template>
                </v-data-table>
              </v-flex>

              <v-flex xs12 pt-2>
                <v-toolbar flat color="white" class="pr-0">
                  <v-toolbar-title>Phases</v-toolbar-title>
                  <v-divider class="mx-2" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" small dark class @click="phaseDialog = true">Add Phase</v-btn>
                </v-toolbar>
                <v-data-table
                  :headers="phaseHeaders"
                  :items="phasesItemSelected"
                  class="elevation-1"
                  hide-actions
                  dense
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="tasksItem = props.item.task">
                      <td width="100px">{{ props.item.name }}</td>
                      <td>{{ props.item.task ? props.item.task.length : 0 }}</td>
                      <td>{{ props.index }}</td>
                      <td class="text-xs-right">
                        <v-icon small class="mr-2" @click="editItem(props.item, 'phase')">edit</v-icon>
                        <v-icon small @click.stop.prevent="deleteItem(props.item, 'phase')">delete</v-icon>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-flex>

              <v-flex xs12>
                <v-toolbar flat color="white" class="pr-0">
                  <v-toolbar-title>Tasks</v-toolbar-title>
                  <v-divider class="mx-2" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <!-- <v-btn color="primary" small dark class="mb-2" @click="groupServiceInitDialog = true">New Group Services</v-btn> -->
                </v-toolbar>
                <v-data-table
                  :headers="tasksHeaders"
                  :items="tasksItem"
                  class="elevation-1"
                  hide-actions
                >
                  <template v-slot:items="props">
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.assignment }}</td>
                    <td :id="'role-task-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('Role', props.item.role, 'role-task-name-' + props.index) }}</td>
                    <td :id="'sub_role-task-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('SubRole', props.item.sub_role, 'sub_role-task-name-' + props.index) }}</td>
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close('group')">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save('group')">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- New Service Dialog -->
    <v-dialog v-model="serviceDialog" scrollable max-width="450px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ serviceFormTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="service" lazy-validation>
            <v-container grid-list-md pt-0>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-select
                    :items="organizationItem"
                    v-model="serviceSchema.organization"
                    label="Select a Organization"
                    prepend-icon="toc"
                    item-text="name"
                    item-value="_id"
                    @change="fillHumans"
                    return-object
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    :items="organizationHumanItem"
                    v-model="serviceSchema.human"
                    label="Select a worker"
                    prepend-icon="toc"
                    item-text="name"
                    item-value="_id"
                    @change="setHumanRole"
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    :items="roleItems"
                    v-model="serviceSchema.role"
                    label="Role on this Group"
                    prepend-icon="toc"
                    item-text="name"
                    item-value="_id"
                  ></v-select>
                </v-flex>

                <v-flex xs12>
                  <v-checkbox
                    label="Is Outside Worker?"
                    v-model="serviceSchema.isOutside"
                  ></v-checkbox>
                </v-flex>

                <v-flex xs12>
                  <v-menu
                    v-model="serviceStartDatePicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        :value="computedServiceStartDate"
                        label="Start Date"
                        prepend-icon="event"
                        readonly
                        clearable
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="serviceSchema.startDate"
                      @input="serviceStartDatePicker = false"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>

                <v-flex xs12>
                  <v-menu
                    v-model="serviceEndDatePicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        :value="computedServiceEndDate"
                        label="End Date"
                        prepend-icon="event"
                        readonly
                        clearable
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="serviceSchema.endDate"
                      @input="serviceEndDatePicker = false"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close('service')">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save('service')">Save service</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- New Phase Dialog -->
    <v-dialog v-model="phaseDialog" scrollable max-width="450px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ phaseFormTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="phase" lazy-validation>
            <v-container grid-list-md pt-0>
              <v-layout wrap>
                <v-flex xs12>
                  <v-toolbar flat color="white" class="pr-0">
                    <v-toolbar-title>Join Phase to Group</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                  <v-data-table
                    v-model="phaseSelected"
                    :headers="phaseAddHeaders"
                    :items="phaseItems"
                    item-key="name"
                    class="elevation-1"
                    hide-actions
                    select-all
                  >
                    <template v-slot:items="props">
                      <td>
                        <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
                      </td>
                      <td>{{ props.item.name }}</td>
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
  </v-container>
</template>
<script>
import Groups from './Groups.vm.js';
export default Groups;
</script>
<style lang="stylus">
#groups {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  z-index: 0;
}

.scroll-grid {
  max-height: 250px;
  backface-visibility: hidden;
}

.theme--dark.v-table thead th {
  background-color: #424242;
}

.theme--light.v-table thead th {
  background-color: #ffffff;
}

.scroll-grid .theme--light.v-table thead th:first-child {
  width: 60px;
}

table.v-table tbody td, table.v-table tbody th {
  height: 32px;
}

/* Theme */
.fixed-header {
  & {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  table {
    table-layout: fixed;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 5;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
    }
  }

  tr.v-datatable__progress {
    th {
      // top: 56px
      height: 1px;
    }
  }

  .v-table__overflow {
    flex-grow: 1;
    flex-shrink: 1;
    overflow-x: auto;
    overflow-y: auto;
    // overflow: auto
    // height: 100%
  }

  .v-datatable.v-table {
    flex-grow: 0;
    flex-shrink: 1;

    .v-datatable__actions {
      flex-wrap: nowrap;

      .v-datatable__actions__pagination {
        white-space: nowrap;
      }
    }
  }
}
</style>
