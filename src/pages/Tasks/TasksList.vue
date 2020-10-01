<template>
  <v-container grid-list-xl fluid py-0>
    <v-layout row wrap justify-space-between>
        <v-flex xs2>
          <v-tooltip top>
            <v-btn fab small dark color="blue" :to="{ name: 'Tasks', params: { }}" slot="activator">
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
            <span>Back to Tasks Dashboard</span>
          </v-tooltip>

          <template v-if="session.user().role !== 'parent' && session.user().role !== 'child'">
            <v-tooltip top>
              <v-btn fab dark color="green" slot="activator">
                <v-icon>add</v-icon>
              </v-btn>
              <span>Add a new Task</span>
            </v-tooltip>
          </template>
        </v-flex>
        <v-flex xs8 text-xs-center>
          <span class="display-1 font-weight-light text-uppercase">{{ TaskGroup.name }}</span>
        </v-flex>
        <v-flex xs2 text-xs-right>
          
        </v-flex>
      </v-layout>
    <vue-perfect-scrollbar :class="[ session.user().role !== 'parent' && session.user().role !== 'child' ? 'perfect--scrollbar--task' : 'perfect--scrollbar--task--parent']">
      <v-layout row wrap ma-0>
        <v-flex xs12>
          <v-card :dark="$vuetify.dark" >
            <v-card-title primary-title pb-0>
              {{ TaskGroup.name }}
            </v-card-title>
            <v-card-text pt-0>
                <v-data-iterator
                  :items="caseItems"
                  :rows-per-page-items="rowsPerPageItems"
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
                            <v-flex xs7>
                              <v-layout align-start justify-start column fill-height>
                                <v-flex xs12>
                                  <h1 class="title font-weight-light primary--text">{{ props.item.display_name }}</h1>
                                </v-flex>
                                <v-flex xs12 pt-0 class="grey--text">
                                  <template v-for="(item, index) in props.item.phase">
                                    <h2 v-if="item.phase" class="body-1 font-weight-light" :key="index + 'phase'">{{ item.phase.name }}</h2>
                                    <h2 v-else class="body-1 font-weight-light" :key="index + 'phase'">. </h2>
                                  </template>
                                  <h2 class="body-1 font-weight-light">Total Task: {{ props.item.totalTasks }}</h2>
                                </v-flex>
                              </v-layout>
                            </v-flex>

                            <v-flex xs5 pb-0 mb-0>
                              <v-layout align-end justify-end row fill-height>
                                <v-btn small color="primary" :to="{ name: 'TaskView', params: { group: groupID, case: props.item.id }}">See Tasks</v-btn>
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
</template>

<script>
import Tasks from './TasksList.vm.js';
export default Tasks;
</script>
<style scoped lang="css">
.task-cards .v-card__text {
  max-height: 240px;
  height: 235px;
  text-align: center;
}
.task-cards .v-card__actions {
  display: block !important;
  text-align: center;
  height: 52px;
}
.perfect--scrollbar--task {
  height: calc(100vh - 200px);
}
.perfect--scrollbar--task--parent {
  height: calc(100vh - 105px);
}
.toolbar--task {
  z-index: 1;
}
.v-step {
  z-index: 2 !important;
}
.case-info {
  margin-left: -100px;
}
.darkColor {
  background-color: #4D4D4D !important;
  color: #ffffff !important;
}
</style>
