<template>
  <div id="TaskView">
    <v-container grid-list-xl fluid>
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
          <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                v-on="on"
              >
                <v-icon>fas fa-sort-amount-down</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-tile @click="clickFilterMenu">
                <v-list-tile-title>
                  Open
                </v-list-tile-title>
              </v-list-tile>
              
              <v-list-tile @click="clickFilterMenu">
                <v-list-tile-title>
                  In-Progress
                </v-list-tile-title>
              </v-list-tile>
              
              <v-list-tile @click="clickFilterMenu">
                <v-list-tile-title>
                  Needs Attention
                </v-list-tile-title>
              </v-list-tile>
              
              <v-list-tile @click="clickFilterMenu">
                <v-list-tile-title>
                  Under Review
                </v-list-tile-title>
              </v-list-tile>
              
              <v-list-tile @click="clickFilterMenu">
                <v-list-tile-title>
                  Completed
                </v-list-tile-title>
              </v-list-tile>
              
              <v-list-tile v-if="session.user().role !== 'parent' && session.user().role !== 'child'" @click="clickFilterMenu">
                <v-list-tile-title>
                  Worker Tasks
                </v-list-tile-title>
              </v-list-tile>
              
              <v-list-tile @click="clickFilterMenu">
                <v-list-tile-title>
                  All
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-flex>
      </v-layout>
      <v-layout row wrap >
        <v-flex xs12>
          <v-card class="card-description">
            <v-card-text class="text-xs-center">Task description box</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <vue-perfect-scrollbar class="perfect--scrollbar--tasks-list">
      <v-container py-0>
        <v-layout row wrap >
          <v-flex xs12 class="mx-5">
            <v-alert
              :value="tasks.length === 0"
              type="error"
            >
              No task with this status.
            </v-alert>
          </v-flex>
            <v-flex xs12 v-for="(item, index) in tasks" :key="index">
              <v-hover>
                <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 8 : 1}`" class="mx-5">
                  <v-card-title class="py-1 pl-1">
                    <v-menu bottom left>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          icon
                          class="d-block pl-0"
                          v-on="on"
                        >
                          <v-icon class="d-block">list</v-icon>
                        </v-btn>
                      </template>

                      <template v-if="session.user().role !== 'parent' && session.user().role !== 'child'">
                        <v-list>
                          <v-list-tile @click="clickCardAction">
                            <v-list-tile-title>
                              Approve
                            </v-list-tile-title>
                          </v-list-tile>
                          
                          <v-list-tile @click="clickCardAction">
                            <v-list-tile-title>
                              Reject
                            </v-list-tile-title>
                          </v-list-tile>
                          
                          <v-list-tile @click="clickCardAction">
                            <v-list-tile-title>
                              Override
                            </v-list-tile-title>
                          </v-list-tile>
                          
                          <v-list-tile @click="clickCardAction">
                            <v-list-tile-title>
                              Disable
                            </v-list-tile-title>
                          </v-list-tile>
                          
                          <v-list-tile @click="clickCardAction">
                            <v-list-tile-title>
                              Comment
                            </v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </template>
                      <template v-else>
                        <v-list>
                          <v-list-tile @click="clickCardAction">
                            <v-list-tile-title>
                              Comment
                            </v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </template>
                    </v-menu>
                      
                    <v-spacer></v-spacer>
                    <v-tooltip top v-if="item.status" >
                      <v-icon class="d-block status-icon" :color="item.color" slot="activator">{{ item.icon }}</v-icon>
                      <span>Status: {{ item.status }}</span>
                    </v-tooltip>
                  </v-card-title>
                  <v-card-text class="px-5 pt-0 card-tasks">
                    {{ item.description }}
                  </v-card-text>
                  <v-card-actions class="px-3">
                    <v-tooltip top v-if="item.worker && session.user().role !== 'parent' && session.user().role !== 'child'">
                        <v-icon class="d-block pl-2" slot="activator"> fas fa-male</v-icon>
                        <span>Worker Task</span>
                      </v-tooltip>
                    <v-spacer></v-spacer>
                    <v-tooltip top v-if="item.comments.length > 0">
                      <v-icon class="d-block" slot="activator">comment</v-icon>
                      <span>{{ item.comments ? item.comments.length : '0' }} Comment(s)</span>
                    </v-tooltip>
                  </v-card-actions>
                </v-card>
              </v-hover>
            </v-flex>
        </v-layout>
        
      </v-container>
      </vue-perfect-scrollbar>
      
    </v-container>
  </div>
</template>
<script>
import TaskView from './TaskView.vm.js';
export default TaskView;
</script>
<style scoped lang="css">
  .perfect--scrollbar--tasks-list {
    height: calc(100vh - 289px);
  }
  .card-description {
    border: 2px #ccc dashed !important;
    box-shadow: none !important;
  }
  .card-tasks {
    margin-top: -20px !important;
  }

  .status-icon {
    position: relative;
    top: 22px;
    font-size: 33px;
  }
</style>
