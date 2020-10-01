<template>
  <div id="TaskView">
    <v-container grid-list-xl fluid>
      <v-layout row wrap justify-space-between>
        <v-flex xs2>
          <v-tooltip top>
            <v-btn
              fab
              small
              dark
              color="blue"
              :to="{ name: 'TaskView', params: { group: groupID, case: caseID }}"
              slot="activator"
            >
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
            <span>Back to Tasks Dashboard</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs8 text-xs-center>
          <h1 class="display-1 font-weight-light text-uppercase">{{ caseItem.display_name }}</h1>
          <h2 class="subheading font-weight-light text-uppercase">{{ groupItem.name }}</h2>
        </v-flex>
        <v-flex xs2 text-xs-right>
          <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>fas fa-sort-amount-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-tile
                v-for="(item, index) in statusItems"
                :key="index"
                @click="clickFilterMenu(item.id)"
              >
                <v-list-tile-title>{{ item.label }}</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="clickFilterMenu(false)">
                <v-list-tile-title>All</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-flex>
      </v-layout>
      <vue-perfect-scrollbar class="perfect--scrollbar--tasks-list">
        <v-layout row wrap ma-0>
          <v-flex xs12>
            <v-card :dark="$vuetify.dark">
              <v-card-title
                primary-title
                pb-0
              >{{ phaseItem.name }} - Listing Sub Tasks of “{{ taskItem.name }}”</v-card-title>
              <v-card-text pt-0>
                <v-data-iterator
                  :items="taskItem.task"
                  :pagination.sync="pagination"
                  content-tag="v-layout"
                  row
                  wrap
                >
                  <template v-slot:item="props">
                    <v-flex xs6 md4 pa-2>
                      <v-hover>
                        <v-card
                          class="card-mini"
                          slot-scope="{ hover }"
                          :class="`elevation-${hover ? 6 : 2}`"
                          :dark="$vuetify.dark"
                        >
                          <v-card-text>
                            <v-layout>
                              <v-flex xs12>
                                <h1
                                  class="title font-weight-light primary--text"
                                >{{ props.item.name }}</h1>
                              </v-flex>
                            </v-layout>
                            <v-layout>
                              <v-flex xs8>
                                <v-layout align-start justify-start column fill-height>
                                  <v-flex xs12 pt-0 class="grey--text">
                                    <h2 class="body-1 font-weight-light">
                                      <span
                                        :id="'role-' + props.index"
                                      >{{ _fillField('Role', props.item.role, 'role-' + props.index) }}</span>
                                      <span
                                        :id="'sub_role-' + props.index"
                                      >{{ props.item.sub_role ? _fillField('SubRole', props.item.sub_role, 'sub_role-' + props.index) : '' }}</span>
                                      - {{ props.item.assignment }}
                                    </h2>
                                  </v-flex>
                                </v-layout>
                              </v-flex>

                              <v-flex xs4 pb-0 mb-0>
                                <v-layout align-center justify-end column fill-height>
                                  <v-tooltip top>
                                    <v-icon
                                      class="d-block status-icon"
                                      :color="props.item.status.color"
                                      slot="activator"
                                    >{{ props.item.status.icon }}</v-icon>
                                    <span>Status: {{ props.item.status.label }}</span>
                                  </v-tooltip>
                                  <v-btn small color="primary">See Task</v-btn>
                                </v-layout>
                              </v-flex>
                            </v-layout>
                          </v-card-text>
                        </v-card>
                      </v-hover>
                    </v-flex>
                  </template>
                </v-data-iterator>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </vue-perfect-scrollbar>
    </v-container>
  </div>
</template>
<script>
import TaskView from './SubTaskView.vm.js';
export default TaskView;
</script>
<style scoped lang="css">
.perfect--scrollbar--tasks-list {
  height: calc(100vh - 230px);
}
.status-icon {
  position: relative;
  font-size: 33px;
}
</style>
