<template>
  <div id="CaseEdit">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-toolbar color="elevation-0 transparent">
              <v-btn fab small dark class="green" :to="'/case-view/' + caseID">
                <v-icon>arrow_back</v-icon>
              </v-btn>
              <v-spacer></v-spacer>

              <v-toolbar-title class="text-uppercase title"> Edit Case: {{ caseSchema.display_name }} - {{ caseSchema.case_number }}</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn fab small dark class="primary" :to="'/case-edit/' + caseID">
                <v-icon>save</v-icon>
              </v-btn>
            </v-toolbar>
            <vue-perfect-scrollbar class="perfect--scrollbar">
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
                      ></v-select>
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
                        v-model="selected"
                        :headers="clientsHeaders"
                        :items="clientItems"
                        item-key="who"
                        class="elevation-1"
                        hide-actions
                      >
                        <template v-slot:items="props">
                          <td :id="'case_client_who_' + props.item._id" @click="$router.push({ path: '/contacts/person/' + props.item.who })"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Human', labelKey: 'name' }, props.item.who, 'case_client_who_' + props.item._id) }}</td>
                          <td :id="'case_client_role_' + props.item._id" ><v-progress-linear :indeterminate="true"></v-progress-linear>{{ xfillField ({collection: 'Role', labelKey: 'name' }, props.item.role, 'case_client_role_' + props.item._id) }}</td>
                          <td>
                            <v-edit-dialog
                              lazy
                              @open="open(props.item.role)"
                              @save="save"
                              @cancel="cancel"
                              @close="close"
                            > 
                             <div :id="'case_client_sub_role_' + props.item._id"><v-progress-linear :indeterminate="true">.</v-progress-linear>{{ xfillField ({collection: 'SubRole', labelKey: 'name' }, props.item.sub_role, 'case_client_sub_role_' + props.item._id) }}</div>
                              <template v-slot:input>
                                <v-select
                                  :items="subRoleItems[props.item.role]"
                                  v-model="props.item.sub_role"
                                  label="Select a Sub Role"
                                  item-text="label" 
                                  item-value="id"
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
                            > {{ props.item.type }}
                              <template v-slot:input>
                                <v-select
                                  :items="['Biological','Adoptive','Step', 'Couple']"
                                  v-model="props.item.type"
                                  label="Select a Relationship type"
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
                        
                          <v-autocomplete
                            :items="caseGroupItem"
                            v-model="caseSchema.group"
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
                                  <v-icon :color="caseSchema.group.length > 0 ? 'indigo darken-4' : ''">{{ groupSelectionIcon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                  <v-list-tile-title>Select All Groups</v-list-tile-title>
                                </v-list-tile-content>
                              </v-list-tile>
                              <v-divider class="mt-2"></v-divider>
                            </template>
                            <template v-slot:selection="{ item, index }">
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
                              >(+{{ caseSchema.group.length - 1 }} others groups)</span>
                            </template>
                          </v-autocomplete>
                      </v-toolbar>
                      <v-data-table
                        :headers="groupsHeaders"
                        v-model="groupSelected"
                        :items="caseSchema.group"
                        class="elevation-1"
                        hide-actions
                        no-data-text="No Group selected"
                        no-results-text="No Result Group"
                        item-key="name"
                      >
                        <template v-slot:items="props">
                          <tr :active="props.selected" @click="groupClicked(props.item)">
                            <!-- <td :id="'case_group_name_' + props.item"><v-progress-linear :indeterminate="true"></v-progress-linear>a {{ xfillField ({collection: 'Group', labelKey: 'name' }, props.item, 'case_group_name_' + props.item) }}</td> -->
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
                          </tr>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>
                  {{ caseSchema.group }} - {{ groupSelected }}
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-toolbar flat color="transparent" class="pr-0">
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
import CaseEdit from './CaseEdit.vm.js';
export default CaseEdit;
</script>
<style scoped lang="css">
.groupSelect {
  max-width: 350px !important;
}
.actionIcon {
  min-width: 24px !important;
}
</style>
