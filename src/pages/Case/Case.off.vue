<template>
  <div id="Case">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-toolbar class="elevation-0">
          <v-tooltip top v-if="displayWhat !== 'dashboard'">
            <v-btn 
              fab
              @click="displayWhat = 'dashboard'" 
              slot="activator"
            >
              <v-icon>dashboard</v-icon>
            </v-btn>
            <span>Back to {{entity}} Dashboard</span>
          </v-tooltip>

          <!-- <v-tooltip top v-if="displayWhat === 'dashboard'">
            <v-btn
              color="success" 
              fab
              @click="displayWhat = 'create'" 
              slot="activator"
            >
              <v-icon>add</v-icon>
            </v-btn>
            <span>Create a new {{entity}}</span>
          </v-tooltip> -->

          <v-speed-dial
            v-if="displayWhat === 'dashboard'"
            absolute
            top
            direction="bottom"
            open
            transition="slide-y-transition"
            class="fab"
          >
            <v-btn slot="activator" color="green" dark fab>
              <v-icon>add</v-icon>
              <v-icon>close</v-icon>
            </v-btn>

            <v-tooltip right>
              <v-btn fab dark small hover color="indigo" slot="activator" @click="bus.$emit('createItem')">
                <v-icon>insert_drive_file</v-icon>
              </v-btn>
              <span>Create a new Case</span>
            </v-tooltip>
            <v-tooltip right>
              <v-btn fab dark small color="blue-grey" slot="activator" to="/case-note-create">
                <v-icon>file_copy</v-icon>
              </v-btn>
              <span>Create a new Case Note</span>
            </v-tooltip>
          </v-speed-dial>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            :label="'Search for ' + searchType"
            hide-details
            clearable
            max-width="500px"
            v-on:keyup.enter="doTextSearch(search)"
            @click:clear="bus.$emit('doTextSearch', '')"
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
                    <v-list-tile-title><v-icon v-if="item.title === searchType">check</v-icon> <span v-else class="selectorNoIcon"></span>{{ item.title }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </template>
          </v-text-field>
          <v-spacer class="hidden-sm-and-down"></v-spacer>
        </v-toolbar>
        <v-flex xs12 text-xs-center pt-0>
          <v-btn 
            small
            @click="doTextSearch(search)"
          >
            <span text-color="primary">Search</span>
          </v-btn>
          <v-btn 
            small 
            class="primary"
            @click="bus.$emit('displayWhat', 'search', true)"
          >
            <v-icon small>find_in_page</v-icon>
            <span text-color="primary"> Advanced Search</span>
          </v-btn>
        </v-flex>
      </v-layout>

      <v-layout row wrap v-if="displayWhat !== 'dashboard' && displayWhat !== 'create'">
        <v-flex lg12>
          <v-card>
            <div v-if="displayWhat === 'crud' || displayWhat === 'grid'">
              <xCrudControls
                :entity="entity"
                ref="xCrudControls"
                :bus="bus"
                :displayWhat="displayWhat"
                :currentFormMode="currentFormMode"
                >
              </xCrudControls>
              <v-divider></v-divider>
            </div>
            
            <v-card-text class="pa-0">
              <xGrid
                :dialog="forms.crud.dialog"
                :dialog_loading="dialog_loading"
                :entity="entity"
                :selected="selected"
                :pagination="pagination"
                :totalDocuments="totalDocuments"
                :headers="headers"
                :original_documents="original_documents"
                :documents="documents"
                :loading="loading"
                :forms="forms"
                :itemKey="itemKey"
                :bus="bus"
                ref="xGrid"
                :displayWhat="displayWhat"
                :currentFormMode="currentFormMode"
              ></xGrid>
            </v-card-text>
            <xForm
                :dialog="forms.crud.dialog"
                :dialog_create="dialog_create"
                :dialog_loading="dialog_loading"
                :entity="entity"
                :selected="selected"
                :loading="loading"
                :forms="forms"
                :uploaders="uploaders"
                :form_search="form_search"
                :query_operators="query_operators"
                :bus="bus"
                ref="xForm"
                :displayWhat="displayWhat"
                :currentFormMode="currentFormMode"
                :hideSubFields="hideSubFields"
            ></xForm>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row wrap v-if="displayWhat === 'dashboard'">
        <v-flex xs12>
          <v-container grid-list-xs mx-0 px-0>
            <v-layout wrap>
              <v-flex xs12 sm6 md3>
                <mini-chart
                  title="New Cases"
                  icon="trending_up"
                  :data="dataset.newUsers"
                  chart-color="#2196f3"
                  type="bar"
                  :bus="bus"
                  entity="Case"
                  :query="{createdAt: { $gte: new Date(new Date().toDateString()).toISOString() }}"
                >
                </mini-chart>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <mini-chart
                  title="Completed Cases"
                  icon="trending_up"
                  :data="dataset.onlineUsers"
                  chart-color="green"
                  type="area"
                  :bus="bus"
                  entity="Case"
                  field="active"
                  target="true"
                >
                </mini-chart>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <mini-chart
                  title="Non Active Cases"
                  icon="check"
                  :data="dataset.onlineUsers"
                  chart-color="red"
                  type="circular"
                  :bus="bus"
                  entity="Case"
                  field="active"
                  target="false"
                >
                </mini-chart>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <mini-chart
                  title="Active Cases"
                  icon="check"
                  :data="dataset.onlineUsers"
                  chart-color="green"
                  type="circular"
                  :bus="bus"
                  entity="Case"
                  field="active"
                  target="true"
                >
                </mini-chart>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <mini-chart
                  title="On-hold Cases"
                  icon="trending_up"
                  :data="dataset.newUsers"
                  chart-color="#2196f3"
                  type="bar"
                  :bus="bus"
                  entity="Case"
                  :query="{createdAt: { $gte: new Date(new Date().toDateString()).toISOString() }}"
                >
                </mini-chart>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <mini-chart
                  title="Tasks"
                  icon="trending_up"
                  :data="dataset.newUsers"
                  chart-color="#2196f3"
                  type="bar"
                  entity="Task"
                >
                </mini-chart>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
      <v-layout row wrap v-if="displayWhat === 'create'">
        <v-flex xs12>
            <CasesAdd 
              :entity="entity"
              :bus="bus"
              :displayWhat="displayWhat"
            ></CasesAdd>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar
      v-model="snack"
      :timeout="3000"
      :color="snackColor"
      :top="true"
      >
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import Case from './Case.vm.js';
export default Case;
</script>

<style lang="stylus"> 
.theme--dark .v-table thead th {
  background-color: #424242;
}

.theme--light .v-table thead th {
  background-color: #ffffff;
}

/* Theme */
.fixed-header
  &
      display: flex
      flex-direction: column
      height: 100%

  table
      table-layout: fixed

  th
      position: sticky
      top: 0
      z-index: 5

      &:after
          content: ''
          position: absolute
          left: 0
          bottom: 0
          width: 100%

  tr.v-datatable__progress
      th
          // top: 56px
          height: 1px;

  .v-table__overflow
      flex-grow: 1
      flex-shrink: 1
      overflow-x: auto
      overflow-y: auto
      // overflow: auto
      // height: 100%

  .v-datatable.v-table
      flex-grow: 0
      flex-shrink: 1

      .v-datatable__actions
          flex-wrap: nowrap

          .v-datatable__actions__pagination
              white-space: nowrap

#Case .perfect--scrollbar {
    height: calc(100vh - 500px) !important;
}

#Case .search .perfect--scrollbar {
    height: calc(100vh - 410px) !important;
}

#Case  .fixed-header {
    height: calc(100vh - 330px) !important;
}

.selectorNoIcon {
  width: 20px;
  display: inline-block;
}
</style>
