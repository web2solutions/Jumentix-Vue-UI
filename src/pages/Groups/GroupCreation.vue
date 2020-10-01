<template>
  <div id="GroupCreation">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <v-stepper v-model="step" vertical>
            <v-stepper-step :complete="step > 1" step="1">
              Group Name
              <small>* Mandatory</small>
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-card class="mb-5 elevation-0">
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="groupName"
                    label="Group Name *"
                    hint="The group name"
                    clearable
                    persistent-hint
                    prepend-icon="text_fields"
                    counter="225"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-flex>
              </v-card>
              <v-btn color="primary" :disabled="groupName === null" @click="step = 2">Continue</v-btn>
              <v-btn flat>Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="step > 2" step="2">Add who the group is for</v-stepper-step>

            <v-stepper-content step="2">
              <v-card class="mb-5 elevation-0">
                <v-flex xs12 md6>
                  <v-select
                    :items="['Adoptive Parent', 'Caseworker', 'Birthmother Attorney']"
                    v-model="personType"
                    hint="Select a type"
                    label="Person type"
                    persistent-hint
                    attach
                    clearable
                    chips
                    multiple
                  ></v-select>
                </v-flex>
              </v-card>
              <v-btn flat @click="step = step -1">Previous</v-btn>
              <v-btn flat>Cancel</v-btn>
              <v-btn color="primary" @click="step = 3">Continue</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="step > 3" step="3">Assign Task List</v-stepper-step>

            <v-stepper-content step="3">
              <v-flex xs12 md8>
                <v-data-table
                  :headers="headers"
                  :items="tasksItems"
                  hide-actions
                  v-sortable-table
                  @sorted="saveOrder"
                >
                  <template v-slot:items="props">
                    <td class="px-1" style="width: 0.1%">
                      <v-btn style="cursor: move" icon class="sortHandle">
                        <v-icon>drag_handle</v-icon>
                      </v-btn>
                    </td>
                    <td>{{ props.item.name }}</td>
                    <td class="text-xs-center">{{ props.item.numTasks }}</td>
                    <td class="justify-center">
                      <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                      <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                    </td>
                  </template>

                  <template v-slot:footer>
                    <td :colspan="headers.length">
                      <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                          <v-btn color="primary" dark class="mt-3 btn-add" v-on="on">New Item</v-btn>
                        </template>
                        <v-card>
                          <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                          </v-card-title>

                          <v-card-text>
                            <v-container grid-list-md>
                              <v-layout wrap>
                                <v-flex xs12>
                                  <v-autocomplete
                                    v-model="itemSelected"
                                    :items="entriesItem"
                                    :loading="isLoading"
                                    hide-selected
                                    item-text="name"
                                    item-value="_id"
                                    label="Item"
                                    placeholder="Start typing to Search"
                                    return-object
                                    @input="changeItem"
                                    :disabled="itemDisabled"
                                  ></v-autocomplete>
                                </v-flex>
                                <v-flex xs7>
                                  <v-text-field
                                    v-model="editedItem.type"
                                    label="Good Type"
                                    :disabled="true"
                                  ></v-text-field>
                                </v-flex>
                                <v-flex xs5>
                                  <v-text-field
                                    v-model="editedItem.unity"
                                    label="Unity"
                                    :disabled="true"
                                  ></v-text-field>
                                </v-flex>
                                <v-flex xs4>
                                  <v-text-field
                                    v-model="editedItem.unity_price"
                                    type="number"
                                    prefix="$"
                                    label="Unity Price"
                                    :disabled="true"
                                  ></v-text-field>
                                </v-flex>
                                <v-flex xs4>
                                  <v-text-field
                                    v-model="editedItem.quantity"
                                    type="number"
                                    label="Quantity"
                                    @input="amountQnt()"
                                  ></v-text-field>
                                </v-flex>
                                <v-flex xs4>
                                  <v-text-field
                                    v-model="editedItem.amount"
                                    type="number"
                                    prefix="$"
                                    label="Amount"
                                    :disabled="true"
                                  ></v-text-field>
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
                    </td>
                  </template>
                </v-data-table>
                <!-- <v-card>
                    <v-card-title>
                      Select Tasks
                      <v-spacer></v-spacer>
                      <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-card-title>
                    <v-data-table
                      v-model="selected"
                      :headers="headers"
                      :items="tasksItems"
                      item-key="id"
                      :search="search"
                      select-all
                    >
                      <template v-slot:items="props">
                        <td>
                          <v-checkbox
                            v-model="props.selected"
                            primary
                            hide-details
                          ></v-checkbox>
                        </td>
                        <td>{{ props.item.name }}</td>
                        <td class="text-xs-right">{{ props.item.numTasks }}</td>
                      </template>
                      <template v-slot:no-results>
                        <v-alert :value="true" color="error" icon="warning">
                          Your search for "{{ search }}" found no results.
                        </v-alert>
                      </template>
                    </v-data-table>
                </v-card>-->
              </v-flex>
              <v-btn flat @click="step = step -1">Previous</v-btn>
              <v-btn flat>Cancel</v-btn>
              <v-btn color="primary" @click="creategroup">Create</v-btn>
            </v-stepper-content>
          </v-stepper>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import GroupCreation from './GroupCreation.vm.js';
export default GroupCreation;
</script>
<style scoped lang="css">
</style>
