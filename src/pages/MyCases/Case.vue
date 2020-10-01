<template>
  <div id="Case">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card :key="id">
            <v-card-title class="d-block text-xs-center text-uppercase title">
                Case Overview
            </v-card-title>
            <vue-perfect-scrollbar class="perfect--scrollbar">
              <v-card-text>
                <v-container grid-list-xs>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <b>Display Name</b>: {{ caseSchema.display_name}}
                    </v-flex>
                    <v-flex xs12 md6>
                      <b>Type</b>: <span :id="'case_type_' + caseSchema.type"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'CaseType', labelKey: 'type' }, caseSchema.type, 'case_type_' + caseSchema.type) }}</span>
                    </v-flex>
                    <v-flex xs12 md6>
                      <b>Case Number</b>: {{ caseSchema.case_number}}
                    </v-flex>
                    <v-flex xs12 md6>
                      <b>Status</b>: <span :id="'case_status_' + caseSchema.status"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'CaseStatus', labelKey: 'label' }, caseSchema.status, 'case_status_' + caseSchema.status) }}</span>
                    </v-flex>
                    <v-flex xs12 md6>
                      <b>Family</b>: <span :id="'case_family_' + caseSchema.family"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Family', labelKey: 'name' }, caseSchema.family, 'case_family_' + caseSchema.family) }}</span>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-layout row wrap>
                        <v-flex xs6>
                          <b>Start Date</b>: {{moment.tz(caseSchema.startDate, session.user.timezone).format('llll')}}
                        </v-flex>
                        <v-flex xs12 md6>
                          <b>End Date</b>: {{typeof caseSchema.endDate !== 'undefined' ? moment.tz(caseSchema.endDate, session.user.timezone).format('llll') : ''}}
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12 md6>
                      <b>Is Placement</b>: {{ caseSchema.is_placement === true ? 'Yes' : 'No'}}
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-toolbar flat color="white" class="pr-0">
                        <v-toolbar-title>Clients</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-data-table
                        :headers="clientsHeaders"
                        :items="caseSchema.client"
                        class="elevation-1"
                        hide-actions
                      >
                        <template v-slot:items="props">
                          <tr>
                            <td :id="'case_client_who_' + props.item._id" @click="$router.push({ path: '/contacts/person/' + props.item.who })"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Human', labelKey: 'name' }, props.item.who, 'case_client_who_' + props.item._id) }}</td>
                            <td :id="'case_client_role_' + props.item._id" ><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Role', labelKey: 'name' }, props.item.role, 'case_client_role_' + props.item._id) }}</td>
                            <td :id="'case_client_sub_role_' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'SubRole', labelKey: 'name' }, props.item.sub_role, 'case_client_sub_role_' + props.item._id) }}</td>
                            <td>{{ props.item.type }}</td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-toolbar flat color="white" class="pr-0">
                        <v-toolbar-title>Related Cases</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-data-table
                        :headers="casesHeaders"
                        :items="caseSchema.cases"
                        class="elevation-1"
                        hide-actions
                      >
                        <template v-slot:items="props">
                          <tr>
                            <td :id="'case_case_name_' + props.item" @click.stop.prevent="$router.push({ name: 'MyCaseView', params: { id: props.item }}).catch(()=>{})"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Case', labelKey: 'display_name, case_number' }, props.item, 'case_case_name_' + props.item) }}</td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-toolbar flat color="white" class="pr-0">
                        <v-toolbar-title>Notes</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn
                          small
                        >Delete</v-btn>
                        <v-btn
                          color="primary"
                          small
                          :disabled="noteSelected.length === 0"
                        >Edit Note</v-btn>
                        <v-btn
                          color="primary"
                          small
                          :disabled="noteSelected.length === 0"
                        >Add Note</v-btn>
                      </v-toolbar>
                      <v-data-table
                        v-model="noteSelected"
                        :headers="notesHeaders"
                        :items="caseSchema.notes"
                        class="elevation-1"
                        hide-actions
                      >
                        <template v-slot:items="props">
                          <tr :active="props.selected" @click="noteSelected = [props.item]">
                            <td>{{ props.item.subject }}</td>
                            <td :id="'case_notes_type_' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'CaseNoteType', labelKey: 'type' }, props.item.type, 'case_notes_type_' + props.item._id) }}</td>
                            <td :id="'case_notes_author_' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Human', labelKey: 'name' }, props.item.author, 'case_notes_author_' + props.item._id) }}</td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-toolbar flat color="white" class="pr-0">
                        <v-toolbar-title>Service Providers</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-data-table
                        :headers="serviceHeaders"
                        :items="caseSchema.service"
                        class="elevation-1"
                        hide-actions
                      >
                        <template v-slot:items="props">
                          <tr>
                            <td :id="'case_service_who' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Human', labelKey: 'name' }, props.item.who, 'case_service_who' + props.item._id) }}</td>
                            <td :id="'case_service_role_' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Role', labelKey: 'name' }, props.item.role, 'case_service_role_' + props.item._id) }}</td>
                            <td :id="'case_service_whose' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Human', labelKey: 'name' }, props.item.whose, 'case_service_whose' + props.item._id) }}</td>
                            <td>{{ props.item.isOutside === true ? 'Yes' : 'No' }}</td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-toolbar flat color="white" class="pr-0">
                        <v-toolbar-title>Groups</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-data-table
                        :headers="groupsHeaders"
                        :items="caseSchema.group"
                        class="elevation-1"
                        hide-actions
                      >
                        <template v-slot:items="props">
                          <tr>
                            <td :id="'case_group_name_' + props.item"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Group', labelKey: 'name' }, props.item, 'case_group_name_' + props.item) }}</td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-toolbar flat color="white" class="pr-0">
                        <v-toolbar-title>Phases</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-data-table
                        :headers="phasesHeaders"
                        :items="caseSchema.phase"
                        class="elevation-1"
                        hide-actions
                      >
                        <template v-slot:items="props">
                          <tr @click="feedTasks(props.item.phase)">
                            <td :id="'case_phase_name_' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Phase', labelKey: 'name' }, props.item.phase, 'case_phase_name_' + props.item._id) }}</td>
                            <td>{{ props.item.tasksTotal}}</td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-toolbar flat color="white" class="pr-0">
                        <v-toolbar-title>Tasks</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          small
                          :disabled="taskSelected.length === 0"
                        >Execute selected Task</v-btn>
                        <v-btn
                          color="primary"
                          small
                        >Go to my Tasks</v-btn>
                      </v-toolbar>
                      <v-data-table
                        v-model="taskSelected"
                        :headers="tasksHeaders"
                        :items="tasksItems"
                        class="elevation-1"
                        hide-actions
                      >
                        <template v-slot:items="props">
                          <tr :active="props.selected" @click="taskSelected = [props.item]; subTasksItems = props.item.task">
                          <!-- <tr @click="subTasksItems = props.item.task"> -->
                            <td>{{ props.item.name}}</td>
                            <td>{{ props.item.assignment}}</td>
                            <td :id="'case_task_role_' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Role', labelKey: 'name' }, props.item.role, 'case_task_role_' + props.item._id) }}</td>
                            <td :id="'case_task_sub_role_' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'SubRole', labelKey: 'name' }, props.item.sub_role, 'case_task_sub_role_' + props.item._id) }}</td>
                            <td :id="'case_task_who' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Human', labelKey: 'name' }, props.item.createdBy, 'case_task_who' + props.item._id) }}</td>
                            <td :id="'case_task_status' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'TaskStatus', labelKey: 'label' }, props.item.status, 'case_task_status' + props.item._id) }}</td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap v-if="subTasksItems.length > 0">
                    <v-flex xs12>
                      <v-toolbar flat color="white" class="pr-0">
                        <v-toolbar-title>Sub Tasks Level 1</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          small
                          :disabled="subTaskSelected.length === 0"
                        >Execute selected Task</v-btn>
                        <v-btn
                          color="primary"
                          small
                        >Go to my Tasks</v-btn>
                      </v-toolbar>
                      <v-data-table
                        v-model="subTaskSelected"
                        :headers="tasksHeaders"
                        :items="subTasksItems"
                        class="elevation-1"
                        hide-actions
                      >
                        <template v-slot:items="props">
                          <tr :active="props.selected" @click="subTaskSelected = [props.item]">
                            <td>{{ props.item.name}}</td>
                            <td>{{ props.item.assignment}}</td>
                            <td :id="'case_sub_task_role_' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Role', labelKey: 'name' }, props.item.role, 'case_sub_task_role_' + props.item._id) }}</td>
                            <td :id="'case_sub_task_sub_role_' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'SubRole', labelKey: 'name' }, props.item.sub_role, 'case_sub_task_sub_role_' + props.item._id) }}</td>
                            <td :id="'case_sub_task_who' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Human', labelKey: 'name' }, props.item.createdBy, 'case_sub_task_who' + props.item._id) }}</td>
                            <td :id="'case_sub_task_status' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'TaskStatus', labelKey: 'label' }, props.item.status, 'case_sub_task_status' + props.item._id) }}</td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>
                  
                </v-container>
              </v-card-text>
            </vue-perfect-scrollbar>  
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import Case from './Case.vm.js';
export default Case;
</script>
<style scoped lang="css">

</style>
