<template>
  <div id="Program">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <!-- <v-card>
            <v-card-title primary-title>
                Program Creation
            </v-card-title>
            <vue-perfect-scrollbar class="perfect--scrollbar">
          <v-card-text>-->
          <v-stepper v-model="step" vertical :dark="$vuetify.dark">
            <v-stepper-step :complete="step > 1" step="1">
              Program Name
              <small>* Mandatory</small>
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-card class="mb-5 elevation-0">
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="program.name"
                    label="Program Name *"
                    hint="The program name"
                    clearable
                    persistent-hint
                    prepend-icon="text_fields"
                    counter="225"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-flex>
              </v-card>
              <v-btn color="primary" :disabled="program.name === null" @click="step = 2">Continue</v-btn>
              <v-btn flat>Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="step > 2" step="2">Types and Sub Types</v-stepper-step>

            <v-stepper-content step="2">
              <v-card class="mb-5 elevation-0">
                <v-flex xs12>
                  <v-layout>
                    <v-flex>
                      <v-card-text>
                        <v-treeview
                          v-model="tree"
                          :items="itemsRoles"
                          activatable
                          active-class="grey lighten-4 indigo--text"
                          selected-color="indigo"
                          open-on-click
                          selectable
                        >
                        </v-treeview>
                      </v-card-text>
                    </v-flex>

                    <v-divider vertical></v-divider>

                    <v-flex
                      xs12
                      md6
                    >
                      <v-card-text>
                        {{ tree }} - {{ selections }} - {{ breweries }}
                        <div
                          v-if="selections.length === 0"
                          key="title"
                          class="title font-weight-light grey--text pa-1 text-xs-center"
                        >
                          Selected Types
                        </div>

                        <v-scroll-x-transition
                          group
                          hide-on-leave
                        >
                          <v-chip
                            v-for="(selection, i) in selections"
                            :key="i"
                            color="grey"
                            dark
                            small
                          >
                            <v-icon left small>mdi-beer</v-icon>
                            {{ selection.name }}
                          </v-chip>
                        </v-scroll-x-transition>
                      </v-card-text>
                    </v-flex>
                  </v-layout>
                  <!-- <v-select
                          :items="programType"
                          v-model="programTypeSelected"
                          hint="Program Type"
                          label="Program Type"
                          item-text="name"
                          persistent-hint
                          return-object
                          clearable
                          attach
                          chips
                      >
                        <template v-slot:append-outer>
                          <v-tooltip
                              bottom
                          >
                              <template v-slot:activator="{ on }">
                                  <v-btn flat icon @click="addNew('programType')">
                                      <v-icon v-on="on">add</v-icon>
                                  </v-btn>
                              </template>
                              Create e new Program Type
                          </v-tooltip>
                        </template>
                      </v-select>
                      </v-flex>
                      <v-flex xs12 md6>
                        <v-select
                          :items="programSubType"
                          v-model="programSubTypeSelected"
                          hint="Program Sub Type"
                          label="Program Sub Type"
                          persistent-hint
                          clearable
                          attach
                          chips
                          :disabled="programSubType.length === 0"
                      >
                        <template v-slot:append-outer>
                          <v-tooltip
                              bottom
                          >
                              <template v-slot:activator="{ on }">
                                  <v-btn flat icon @click="addNew('programSubType')">
                                      <v-icon v-on="on">add</v-icon>
                                  </v-btn>
                              </template>
                              Create e new Program Type
                          </v-tooltip>
                        </template>
                  </v-select>-->
                </v-flex>
              </v-card>
              <v-btn flat @click="step = step -1">Previous</v-btn>
              <v-btn flat>Cancel</v-btn>
              <v-btn color="primary" @click="step = 3">Continue</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="step > 3" step="3">Groups</v-stepper-step>

            <v-stepper-content step="3">
              <v-flex xs12 md6>
                <v-select
                  :items="groupItems"
                  v-model="groupSelected"
                  hint="Select a Group"
                  label="Group Name"
                  item-text="name"
                  persistent-hint
                  return-object
                  clearable
                  chips
                  multiple
                >
                  <template v-slot:append-outer>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn flat icon @click="addNew('Group')">
                          <v-icon v-on="on">add</v-icon>
                        </v-btn>
                      </template>
                      Create e new Program Type
                    </v-tooltip>
                  </template>
                </v-select>
              </v-flex>
              <v-btn flat @click="step = step -1">Previous</v-btn>
              <v-btn flat>Cancel</v-btn>
              <v-btn color="primary" @click="createProgram">Create</v-btn>
            </v-stepper-content>
          </v-stepper>
          <!-- </v-card-text>
            </vue-perfect-scrollbar>  
          </v-card>-->
        </v-flex>
      </v-layout>

      <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Create e new {{ dialogTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      :label="programType === 'programType' ? 'Program Type Name*' : 'Program Sub Type Name*'"
                      required
                      v-model="newForm.name"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 v-if="editItem === 'programType'">
                    <v-autocomplete
                      v-model="newForm.type"
                      :items="['Adoptive Parent', 'Caseworker', 'Hospital']"
                      label="Type"
                    ></v-autocomplete>
                  </v-flex>
                </v-layout>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click="dialog = false">Close</v-btn>
              <v-btn color="primary" @click="saveNew(editItem)">Create</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>

      <v-layout row justify-center>
        <v-dialog v-model="dialogGroup" persistent max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Create e new {{ dialogTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field label="Group Name*'" required v-model="newForm.name"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-autocomplete
                      v-model="newForm.type"
                      :items="groupTypeItems"
                      item-text="name"
                      label="Group Type"
                      clearable
                      chips
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12>
                    <v-autocomplete
                      v-model="humanSelected"
                      :items="humanItems"
                      item-text="name"
                      label="People in this Group"
                      clearable
                      chips
                      multiple
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12>
                    <v-switch v-model="defaultGroup" label="Default Group"></v-switch>
                  </v-flex>
                </v-layout>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click="dialogGroup = false">Close</v-btn>
              <v-btn color="primary" @click="saveNew(editItem)">Create</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import ProgramAdd from './ProgramAdd.vm.js';
export default ProgramAdd;
</script>
<style scoped lang="css">
</style>
