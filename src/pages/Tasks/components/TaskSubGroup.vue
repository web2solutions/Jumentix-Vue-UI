<template>
  <vue-perfect-scrollbar class="perfect--scrollbar">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <template v-if="messageNoSubGroup">
          <v-flex xs12 class="text-xs-center">
          <h3>No Related Subgroups</h3>
          <v-tooltip top>
            <v-btn flat small color="primary" slot="activator" @click.prevent="() => bus.$emit('openAddDialog', ('subGroup'))">
              <v-icon left>fas fa-layer-group</v-icon>
              <span>Add or Create a new Subgroups to this Group</span>
            </v-btn>
            <span>Add or Create a new Subgroups to this Group</span>
          </v-tooltip>
          </v-flex>
        </template>
        <template v-for="(item, index) in groups">
          <v-flex lg4 sm6 xs12 :key="index + 'group'">
            <v-hover>
              <v-card
                slot-scope="{ hover }"
                :class="`elevation-${hover ? 8 : 1}`"
              >
                <v-card-title class="pb-0">
                  <div class="layout row ma-0 justify-space-between pb-1">
                    <h4>{{ item.name }}</h4>
                    <div class="icon">
                      <v-icon left>format_list_bulleted</v-icon>
                    </div>
                  </div>
                </v-card-title>
                <v-card-text>
                  <v-progress-circular
                      :rotate="360"
                      :size="200"
                      :width="15"
                      :value="item.taskValue"
                      color="primary"
                      >
                    <span class="display-1">{{ item.taskValue }}%</span>
                  </v-progress-circular>
                </v-card-text>
                <v-card-actions>
                  <v-btn flat color="primary" dense :to="'/tasks-sub-group/' + item.id">
                    <v-icon left>fas fa-tasks</v-icon>
                    <span>VIEW TASKS</span>
                  </v-btn>
                </v-card-actions>            
              </v-card>
            </v-hover>
          </v-flex>
        </template>
      </v-layout>
    </v-container>
  </vue-perfect-scrollbar>
</template>

<script>
import TaskSubGroup from './TaskSubGroup.vm.js';
export default TaskSubGroup;
</script>
<style scoped lang="css">
.v-card__text {
  max-height: 240px;
  height: 235px;
  text-align: center;
  position: relative;
}
.v-card__actions{
  display: block !important;
  text-align: center;
  height: 52px;
}
.perfect--scrollbar {
    height: calc(100vh - 450px);
}
</style>
