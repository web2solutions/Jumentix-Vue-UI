<template>
  <div id="CaseCreate">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-toolbar color="elevation-0 transparent">
              <v-btn fab small dark class="green" :to="'/case'">
                <v-icon>arrow_back</v-icon>
              </v-btn>
              <v-spacer></v-spacer>

              <v-toolbar-title class="text-uppercase title"> Create a new Case</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn fab small dark class="primary" @click="createCase">
                <v-icon>save</v-icon>
              </v-btn>
            </v-toolbar>
            <vue-perfect-scrollbar class="perfect--scrollbar" ref="scroll">
              <v-card-text>
                <v-container grid-list-xs>
                  <v-layout row wrap>
                    <v-flex xs12 md6 pt-0>
                      <v-text-field
                        prepend-icon="text_fields"
                        v-model="caseSchema.display_name"
                        label="Display Name *"
                        clearable
                        required
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6 pt-0>
                      <v-select
                        prepend-icon="toc"
                        :items="caseTypeItem"
                        v-model="caseSchema.type"
                        label="Type *"
                        item-value="_id"
                        item-text="type"
                        clearable
                        required
                        :rules="[rules.required]"
                      >
                        <template v-slot:append-outer>
                          <v-icon
                            
                            v-text="'add'"
                            ></v-icon>
                        </template>
                      </v-select>
                    </v-flex>
                    <v-flex xs12 md6 pt-0>
                      <v-text-field
                        prepend-icon="text_fields"
                        v-model="caseSchema.case_number"
                        label="Case Number *"
                        clearable
                        required
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md6 pt-0>
                      <v-select
                        prepend-icon="toc"
                        :items="caseStatusItem"
                        v-model="caseSchema.status"
                        label="Status *"
                        item-value="_id"
                        item-text="status"
                        clearable
                        required
                        :rules="[rules.required]"
                        append-outer-icon="add"
                        @click:append-outer="addNewItem"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 md6 pt-0>
                      <v-autocomplete
                        prepend-icon="toc"
                        :items="caseFamilyItem"
                        v-model="caseSchema.family"
                        label="Family *"
                        item-value="_id"
                        item-text="name"
                        clearable
                        required
                        :rules="[rules.required]"
                        @change="getItem('Family', caseSchema.family)"
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 md6 pt-0>
                      <v-layout row wrap>
                        <v-flex xs12 md6>
                          <v-menu
                            v-model="startDatePicker"
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
                                class="px-3"
                                :value="computedCaseStartDate"
                                label="Start Date *"
                                prepend-icon="event"
                                readonly
                                clearable
                                v-on="on"
                                required
                                :rules="[rules.required]"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="caseSchema.startDate"
                              @input="startDatePicker = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-menu
                            v-model="endDatePicker"
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
                                class="px-3"
                                :value="computedCaseEndDate"
                                label="End Date"
                                prepend-icon="event"
                                readonly
                                clearable
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="caseSchema.endDate"
                              @input="endDatePicker = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12 md6 pt-0>
                      <v-switch label="Is Placement" v-model="caseSchema.is_placement"></v-switch>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-toolbar flat color="transparent" class="pr-0">
                        <v-toolbar-title>Join Clients to Case</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-data-table
                        v-model="caseSchema.client"
                        :headers="clientsHeaders"
                        :items="clientItems"
                        item-key="who"
                        class="elevation-1"
                        hide-actions
                      >
                        <template v-slot:items="props">
                          <td class="link-style">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <div :id="'case_client_who_' + props.item._id" @click="$router.push({ path: '/contacts/person/' + props.item.who })" v-on="on">
                                  <v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Human', labelKey: 'name' }, props.item.who, 'case_client_who_' + props.item._id) }}
                                </div>
                              </template>
                              <span>Click to see contact details</span>
                            </v-tooltip>
                          </td>
                          <td :id="'case_client_role_' + props.item._id" ><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Role', labelKey: 'name' }, props.item.role, 'case_client_role_' + props.item._id) }}</td>
                          <td>
                            <v-edit-dialog
                              lazy
                              @save="save"
                              @cancel="cancel"
                              @close="close"
                              @click="clicked"
                            > 
                             <div :id="'case_client_sub_role_' + props.item._id" :class="[ props.item.sub_role ? '' : 'empty-field']">{{ props.item.sub_role ? xfillField ({collection: 'SubRole', labelKey: 'name' }, props.item.sub_role, 'case_client_sub_role_' + props.item._id) : 'Select a Sub Role'}}</div>
                              <template v-slot:input>
                                <v-select
                                  :key="props.item.role + props.index"
                                  :items="subRoleItems[props.item.role]"
                                  v-model="props.item.sub_role"
                                  label="Select a Sub Role"
                                  item-text="label" 
                                  item-value="id"
                                  class="mt-3"
                                ></v-select>
                              </template>
                              
                             <!--   {{ props.item.sub_role }}
                              <template v-slot:default>
                                <v-select
                                  :key="props.item._id"
                                  :items="subRoleItems[props.item.role]"
                                  v-model="props.item.sub_role"
                                  auto-select-first
                                  autofocus
                                  item-text="label" 
                                  item-value="_id"
                                ></v-select>
                              </template> -->
                            </v-edit-dialog>
                          </td>
                          <!-- 
                            @change="xfillField ({collection: 'SubRole', labelKey: 'name' }, 'offff', 'case_client_sub_role_' + props.item._id)"
                            <td :id="'case_client_sub_role_' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'SubRole', labelKey: 'name' }, props.item.sub_role, 'case_client_sub_role_' + props.item._id) }}</td> -->
                          <td> 
                            <v-edit-dialog
                              lazy
                              @save="save"
                              @cancel="cancel"
                              @close="close"
                            > <div :class="[ props.item.type ? '' : 'empty-field']">{{ props.item.type ? props.item.type : 'Select a Client Type'}}</div>
                              <template v-slot:input>
                                <v-select
                                  :items="['Biological','Adoptive','Step', 'Couple']"
                                  v-model="props.item.type"
                                  label="Select a Relationship type"
                                  class="mt-4"
                                ></v-select>
                              </template>
                            </v-edit-dialog>
                          </td>
                          <td class="text-xs-center">
                            <v-checkbox
                              v-model="props.selected"
                              primary
                              hide-details
                              class="d-inline-block"
                              :disabled="!props.item.type || !props.item.sub_role"
                            ></v-checkbox>
                          </td>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-toolbar flat color="transparent" class="pr-0">
                        <v-toolbar-title>Join Groups to Case</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        
                          <v-select
                            :items="caseGroupItem"
                            v-model="groupSelectedItems"
                            label="Select Group"
                            item-text="name" 
                            item-value="id"
                            clearable
                            multiple
                            class="groupSelect"
                            return-object
                          >
                            <template v-slot:prepend-item>
                              <v-list-tile
                                ripple
                                @click="toggleGroupSelection"
                              >
                                <v-list-tile-action>
                                  <v-icon :color="groupSelectedItems.length > 0 ? 'indigo darken-4' : ''">{{ groupSelectionIcon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                  <v-list-tile-title>Select All Groups</v-list-tile-title>
                                </v-list-tile-content>
                              </v-list-tile>
                              <v-divider class="mt-2"></v-divider>
                            </template>
                            <template v-slot:selection="{ item, index }">
                              <span
                                :key="item.id"
                                v-if="index === 0"
                                class="grey--text caption"
                              >
                                {{ groupSelectedItems.length }} {{ groupSelectedItems.length > 1 ? 'Groups' : 'Group' }} selected
                              </span>
                              
                            </template>
                            <!-- <template v-slot:selection="{ item, index }">
                              <v-chip v-if="index === 0"
                                :selected="item.selected"
                                close
                                class="chip--select-multi"
                                @input="removeChip(item)"
                              >
                                <span>{{ item.name }}</span>
                              </v-chip>
                              <span
                                v-if="index === 1"
                                class="grey--text caption"
                              >(+{{ groupSelectedItems.length - 1 }} others groups)</span>
                            </template> -->
                          </v-select>
                      </v-toolbar>
                      <v-data-table
                        v-model="groupSelected"
                        :headers="groupsHeaders"
                        :items="groupSelectedItems"
                        class="elevation-1"
                        :hide-actions="groupSelectedItems.length < 5"
                        no-data-text="No Group selected"
                        no-results-text="No Result Group"
                        item-key="name"
                        :pagination.sync="paginationName"
                      >
                        <template v-slot:items="props">
                          <tr :active="props.selected" @click="groupClicked(props.item)">
                          <!-- 
                          <tr :active="props.selected" @click="groupSelected = [props.item]; caseSchema.service = props.item.service">
                            <td :id="'case_group_name_' + props.item"><v-progress-linear :indeterminate="true"></v-progress-linear>a {{ xfillField ({collection: 'Group', labelKey: 'name' }, props.item, 'case_group_name_' + props.item) }}</td> -->
                            <td>{{ props.item.name }}</td>
                            <!-- <td>
                              <v-menu>
                                <template #activator="{ on: menu }">
                                  <v-tooltip top>
                                    <template #activator="{ on: tooltip }">
                                      <v-btn icon v-on="{ ...tooltip, ...menu }">
                                          <v-icon>more_vert</v-icon>
                                      </v-btn>
                                    </template>
                                    <span>Actions</span>
                                  </v-tooltip>
                                </template>
                                <v-list class="pa-0" dense>
                                  <v-list-tile
                                    v-for="action in actions"
                                    :key="action.text"
                                    @click="action.click(props.item)"
                                  >
                                    <v-list-tile-action class="actionIcon">  
                                      <v-icon small>{{ action.icon }}</v-icon>
                                    </v-list-tile-action>
                                    <v-list-tile-title>{{ action.text }}</v-list-tile-title>
                                  </v-list-tile>
                                </v-list>
                              </v-menu>
                            </td> -->
                            <td class="text-xs-center">
                              <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                  <v-btn flat icon color="primary" dark v-on="on">
                                    <v-icon small @click="removeChip(props.item)">delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Remove Group</span>
                              </v-tooltip>
                              
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>
                  
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-toolbar flat color="transparent" class="pr-0">
                        <v-toolbar-title>Join Workers from Group to Case</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn v-if="groupSelected.length > 0 && groupSelectedItems.length > 1 && showAll === true" small color="primary" @click="caseGroupServiceItem = groupSelected[0].service; showAll = false">Show only members of the selected group</v-btn>
                        <v-btn v-if="showAll === false" small color="primary" @click="showAllSevicesGroup()">Show all members</v-btn>
                      </v-toolbar>
                      <v-data-table
                        v-model="caseSchema.service"
                        :headers="serviceHeaders"
                        :items="caseGroupServiceItem"
                        :pagination.sync="paginationName"
                        class="elevation-1"
                        :hide-actions="caseGroupServiceItem.length < 5"
                        item-key="_id"
                      >
                        <template v-slot:items="props">
                          <tr>
                            <td :id="'case_service_who' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Human', labelKey: 'name' }, props.item.human, 'case_service_who' + props.item._id) }}</td>
                            <td :id="'case_service_role_' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Role', labelKey: 'name' }, props.item.role, 'case_service_role_' + props.item._id) }}</td>
                            <!-- <td :id="'case_service_whose' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Human', labelKey: 'name' }, props.item.whose, 'case_service_whose' + props.item._id) }}</td> -->
                            <td>
                              <v-edit-dialog
                                lazy
                                @save="save"
                                @cancel="cancel"
                                @close="close"
                              > <div :id="'case_service_whose' + props.item._id" :class="[ props.item.whose ? '' : 'empty-field']">{{ props.item.whose ? xfillField ({collection: 'Human', labelKey: 'name' }, props.item.whose, 'case_service_whose' + props.item._id) : 'Select a Client whose'}}</div>
                                <template v-slot:input>
                                  <v-autocomplete
                                    :items="caseSchema.client"
                                    v-model="props.item.whose"
                                    label="Select a Relationship whose"
                                    class="mt-4"
                                    item-text="who"
                                    item-value="who"
                                  >
                                  <template v-slot:item="{ item }">
                                    <v-list-tile-title :id="'case_select_whose_select_' + props.index + '_' + item.who">{{ xfillField ({collection: 'Human', labelKey: 'name' }, item.who, 'case_select_whose_select_' + props.index + '_' + item.who) }}</v-list-tile-title>
                                  </template>

                                  <template v-slot:selection="{ item }">
                                    <div :id="'case_select_whose_selected_' + props.index + '_' + item.who">{{ xfillField ({collection: 'Human', labelKey: 'name' }, item.who, 'case_select_whose_selected_' + props.index + '_' + item.who) }}</div>
                                  </template>
                                  </v-autocomplete>
                                </template>
                              </v-edit-dialog>
                            </td>
                            <td :id="'case_service_group_' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Group', labelKey: 'name' }, props.item.group, 'case_service_group_' + props.item._id) }}</td>
                            <td class="text-xs-center">
                              <v-checkbox
                                v-model="props.selected"
                                primary
                                hide-details
                                class="d-inline-block"
                                :disabled="!props.item.whose"
                              ></v-checkbox>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-toolbar flat color="transparent" class="pr-0">
                        <v-toolbar-title>Phases</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-data-table
                        v-model="phaseSelected"
                        :headers="phasesHeaders"
                        :items="caseSchema.phase"
                        :pagination.sync="paginationPhase"
                        class="elevation-1"
                        :hide-actions="caseSchema.phase.length < 5"
                        item-key="_id"
                        ref="sortablePhases"
                      >
                        <template v-slot:items="props">
                          <tr :active="props.item.isSelected" @click="feedTasks(props.item, props.item)" :key="props.item.phase + '_' + props.index">
                            <!-- <td :id="'case_phase_name_' + props.item"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Phase', labelKey: 'name' }, props.item, 'case_phase_name_' + props.item) }}</td> -->
                            <td class="px-1" style="width: 0.1%">
                              <v-btn style="cursor: move" icon class="sortHandle"><v-icon>drag_handle</v-icon></v-btn>
                            </td>
                            <td>{{ props.item.name }}</td>
                            <td class="text-xs-center">{{ props.item.task.length }}</td>
                            <td class="text-xs-center" scope="row">{{ props.item.order }}</td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-toolbar flat color="transparent" class="pr-0">
                        <v-toolbar-title>Tasks</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-data-table
                        v-model="taskSelected"
                        :headers="tasksHeaders"
                        :items="tasksItems"
                        class="elevation-1"
                        hide-actions
                      >
                        <template v-slot:items="props">
                          <!-- <tr :active="props.selected" @click="taskSelected = [props.item]; subTasksItems = props.item.task"> -->
                          <tr @click="feedSubTasks('tasksItems', props.item)" :active="props.item.isSelected">

                            <td>{{ props.item.name}}</td>
                            <td>{{ props.item.assignment}}</td>
                            <td :id="'case_task_role_' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Role', labelKey: 'name' }, props.item.role, 'case_task_role_' + props.item._id) }}</td>
                            <!-- <td :id="'case_task_sub_role_' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'SubRole', labelKey: 'name' }, props.item.sub_role, 'case_task_sub_role_' + props.item._id) }}</td> -->
                            <td>
                              <v-edit-dialog
                                v-if="props.item.assignment === 'One'"
                                lazy
                                @save="save"
                                @cancel="cancel"
                                @close="close"
                              > <div :id="'case_task_who' + props.item._id" :class="[ props.item.who ? '' : 'empty-field']">{{ props.item.who ? xfillField ({collection: 'Human', labelKey: 'name' }, props.item.who, 'case_task_who' + props.item._id) : 'Select a Client who'}}</div>
                                <template v-slot:input>
                                  <v-autocomplete
                                    :items="caseSchema.client"
                                    v-model="props.item.who"
                                    label="Select a Relationship who"
                                    class="mt-4"
                                    item-text="who"
                                    item-value="who"
                                  >
                                  <template v-slot:item="{ item }">
                                    <v-list-tile-title :id="'case_task_select_who_select_' + props.index + '_' + item.who">{{ xfillField ({collection: 'Human', labelKey: 'name' }, item.who, 'case_task_select_who_select_' + props.index + '_' + item.who) }}</v-list-tile-title>
                                  </template>

                                  <template v-slot:selection="{ item }">
                                    <div :id="'case_task_select_who_selected_' + props.index + '_' + item.who">{{ xfillField ({collection: 'Human', labelKey: 'name' }, item.who, 'case_task_select_who_selected_' + props.index + '_' + item.who) }}</div>
                                  </template>
                                  </v-autocomplete>
                                </template>
                              </v-edit-dialog>
                            </td>
                            <td class="text-xs-center" >{{ props.index }}</td>
                            <td class="text-xs-center">
                              <v-checkbox
                                v-model="props.selected"
                                primary
                                hide-details
                                class="d-inline-block"
                              ></v-checkbox>
                            </td>
                            <!-- <td :id="'case_task_who' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Human', labelKey: 'name' }, props.item.createdBy, 'case_task_who' + props.item._id) }}</td>
                            <td :id="'case_task_status' + props.item._id"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'TaskStatus', labelKey: 'label' }, props.item.status, 'case_task_status' + props.item._id) }}</td> -->
                          </tr>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>

                  <v-slide-y-transition leave-absolute>
                    <v-layout row wrap v-if="subTasksItems.length > 0" ref="sub-tasks">
                      <v-flex xs12>
                        <v-toolbar flat color="transparent" class="pr-0">
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
                  </v-slide-y-transition>

                </v-container>
              </v-card-text>
            </vue-perfect-scrollbar>  
            <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
              {{ snackText }}
              <v-btn flat @click="snack = false">Close</v-btn>
            </v-snackbar>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import CaseCreate from './CaseCreate.vm.js';
export default CaseCreate;
</script>
<style scoped lang="css">
.groupSelect {
  max-width: 350px !important;
}
.actionIcon {
  min-width: 24px !important;
}
.empty-field {
  color: red !important;
}
.link-style {
  cursor: pointer;
}
</style>
