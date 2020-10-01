<template>
  <v-layout wrap id="CaseNotesCreate">
    <v-container pb-0>
      <v-layout align-space-between justify-space-between row>
        <v-flex xs12 md4 order-xs2 order-md1>
          <v-autocomplete
            flat
            v-model="caseData.case"
            :items="caseItems"
            :loading="isLoading"
            clearable
            item-text="case_number"
            item-value="id"
            :label="'Select Associated Case'"
            append-outer-icon="search"
            class="mt-0"
            @input="caseChange"
            return-object
            :rules="[v => !!v || 'Item is required']"
            required
          >
          </v-autocomplete>
          <v-expand-transition>
            <div v-show="caseData.case">
              <b>Case Number:</b> {{ caseSelected.case_number }}
              <v-btn flat small icon class="ml-5 py-0 my-0">
                <v-icon>remove_red_eye</v-icon>
              </v-btn>
              <br>
              <b>Case Status:</b> {{ caseSelected.status }}
              <br>
              <b>Names:</b> {{ caseSelected.human.toString() }}
              <br>
              <b>Case Open:</b> {{ caseSelected.startDate }}
            </div>
          </v-expand-transition>          
        </v-flex>
        <v-flex xs12 md5 order-xs1 order-md2>
          <v-autocomplete
            flat
            v-model="model"
            :loading="isLoading"
            clearable
            hide-no-data
            hide-selected
            :item-text="item_text"
            :item-value="item_value"
            :label="'Search for ' + searchType"
            append-outer-icon="search"
            class="mt-0 d-xl-inline-flex"
            return-object
          >
            <template v-slot:prepend>
              <v-menu bottom left>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">filter_list</v-icon>
                </template>

                <v-list>
                  <v-list-tile
                    v-for="(item, i) in itemsMenu"
                    :key="i"
                    @click="selectFilter(item, i)"
                  >
                    <v-list-tile-title>
                      <v-icon v-if="item.title === searchType">check</v-icon>
                      <span v-else class="selectorNoIcon"></span>
                      {{ item.title }}
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </template>
          </v-autocomplete>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container grid-list-xs>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-layout row wrap>
          <v-flex xs6 md3 d-flex order-md1 order-xs2>
            <v-btn color="primary" @click="save">
              <v-icon>save</v-icon>Save
            </v-btn>
            <v-btn color="red" dark to="case-notes">
              <v-icon>cancel</v-icon>Cancel
            </v-btn>
          </v-flex>
          <v-flex xs12 md8 order-md2 order-xs1>
            <v-text-field 
              v-model="caseData.subject" 
              name="subject" 
              :label="caseData.case ? 'Subject' : 'Select a Case above'" 
              solo
              :rules="[v => !!v || 'Item is required']"
              :disabled="!caseData.case"
              required>
            </v-text-field>
          </v-flex>
          <v-flex xs6 md1 class="actions" order-md3 order-xs3>
            <v-btn flat icon>
              <v-icon>attach_file</v-icon>
            </v-btn>
            <v-btn flat icon @click="advancedSearch = !advancedSearch">
              <v-icon>settings</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 order-xs4>
            <v-card>
              <vue-perfect-scrollbar class="perfect--scrollbar">
                <v-card-text>
                  <wysiwyg 
                    v-model="caseData.note" 
                    :rules="[v => !!v || 'Item is required']"
                    required
                  />
                  <v-navigation-drawer v-model="advancedSearch" absolute temporary>
                    <h4 class="text-xs-center">Options</h4>
                    <v-divider></v-divider>
                    <v-autocomplete
                      flat
                      v-model="caseData.author"
                      :items="authorItems"
                      :loading="isLoading"
                      clearable
                      item-text="name"
                      item-value="id"
                      :label="'Select Author Name'"
                      class="mt-0 px-3 d-xl-inline-flex"
                      append-outer-icon="search"
                      :rules="[v => !!v || 'Item is required']"
                      required
                      prepend-icon="toc"
                    ></v-autocomplete>

                    <div class="px-3">
                      <v-dialog
                        ref="dialog1"
                        v-model="modalStart"
                        persistent
                        lazy
                        full-width
                        width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="startDate"
                            label="Start Date"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                            :rules="[v => !!v || 'Item is required']"
                            required
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="startDate" scrollable>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="modalStart = false">Cancel</v-btn>
                          <v-btn
                            flat
                            color="primary"
                            @click="$refs.dialog1.save(startDate)"
                          >OK</v-btn>
                        </v-date-picker>
                      </v-dialog>

                      <v-dialog
                        ref="dialog"
                        v-model="modalEnd"
                        :return-value.sync="endDate"
                        persistent
                        lazy
                        full-width
                        width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="endDate"
                            label="End Date"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                            required
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="endDate"
                          :min="startDate"
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="modalEnd = false">Cancel</v-btn>
                          <v-btn
                            flat
                            color="primary"
                            @click="$refs.dialog.save(endDate)"
                          >OK</v-btn>
                        </v-date-picker>
                      </v-dialog>

                      <v-dialog
                        ref="dialogDuration"
                        v-model="modalDuration"
                        :return-value.sync="caseDataDuration"
                        persistent
                        lazy
                        full-width
                        width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="caseDataDuration"
                            label="Duration"
                            prepend-icon="access_time"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="modalDuration"
                          v-model="caseDataDuration"
                          format="24hr"
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="modalDuration = false">Cancel</v-btn>
                          <v-btn flat color="primary" @click="$refs.dialogDuration.save(caseDataDuration)">OK</v-btn>
                        </v-time-picker>
                      </v-dialog>
                    </div>

                    <v-autocomplete
                      flat
                      v-model="caseData.type"
                      :items="typeItems"
                      :loading="isLoading"
                      clearable
                      hide-no-data
                      hide-selected
                      item-text="type"
                      item-value="id"
                      :label="'Select Type'"
                      class="mt-0 px-3 d-xl-inline-flex"
                      :rules="[v => !!v || 'Item is required']"
                      required
                      prepend-icon="toc"
                    ></v-autocomplete>

                    <v-select
                      v-model="caseData.incident"
                      :items="incidentItems"
                      label="Incident"
                      class="mt-0 px-3 d-xl-inline-flex"
                      :rules="[v => !!v || 'Item is required']"
                      required
                      prepend-icon="toc"
                    ></v-select>

                    <v-select
                      v-model="caseData.priority"
                      :items="priorityItems"
                      label="Priority"
                      class="mt-0 px-3 d-xl-inline-flex"
                      :rules="[v => !!v || 'Item is required']"
                      required
                      prepend-icon="toc"
                    ></v-select>
                    <v-autocomplete
                      flat
                      v-model="caseData.form_id"
                      :items="formItems"
                      :loading="isLoading"
                      clearable
                      item-text="name"
                      item-value="id"
                      :label="'Form Associated to this Case Note'"
                      class="mt-0 px-3 d-xl-inline-flex"
                      prepend-icon="toc"
                    ></v-autocomplete>
                    <v-list>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>Billiable</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action class="pt-2 mt-2"> 
                          <v-switch v-model="billiable" mt-2></v-switch>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                    <div v-if="billiable">
                      <v-autocomplete
                        flat
                        v-model="caseData.drawee"
                        :items="walletItems"
                        :loading="isLoading"
                        clearable
                        hide-no-data
                        hide-selected
                        item-text="name"
                        item-value="id"
                        :label="'Select Associated Wallet'"
                        append-outer-icon="search"
                        class="mt-0 px-3 d-xl-inline-flex"
                        prepend-icon="toc"
                      >
                      </v-autocomplete>
                      <v-text-field 
                        label="Bill Code" 
                        v-model="caseData.bill_code"
                        class="mt-0 px-3 d-xl-inline-flex"
                        prepend-icon="text_fields"
                      ></v-text-field>
                    </div>

                    <div class="painelAction">
                      <v-btn 
                        small 
                        class="primary text-xs-center mr-0" 
                        @click="closeTest"
                      >
                        OK
                      </v-btn>
                      <v-btn
                        small
                        dark
                        color="red"
                        class="text-xs-center mr-0"
                        @click="advancedSearch = false"
                      >Cancel</v-btn>
                      <v-btn small class="text-xs-center mr-0" @click="resetSearch">Reset</v-btn>
                    </div>
                  </v-navigation-drawer>
                </v-card-text>
              </vue-perfect-scrollbar>
            </v-card>
          </v-flex>
        </v-layout>
      </v-form>
    </v-container>
  </v-layout>
</template>
<script>
import CaseNotesCreate from './CaseNotesCreate.vm.js';
export default CaseNotesCreate;
</script>
<style scoped lang="css">
.perfect--scrollbar {
  height: calc(100vh - 410px);
}
.actions {
  display: inherit !important;
}
.editr {
  border: 0px solid #e4e4e4;
  border-top: 1px solid #e4e4e4;
}
.painelAction {
  position: absolute;
}
</style>
