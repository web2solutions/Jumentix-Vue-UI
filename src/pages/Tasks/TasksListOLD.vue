<template>
  <div id="TasksList">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-card-text>
              <v-tabs
                show-arrows
              >

                <v-tab href="#tab-1">
                  Application
                </v-tab>

                <v-tab href="#tab-2">
                  Home Study
                </v-tab>

                <v-tab href="#tab-3">
                  Profile Creation
                </v-tab>

                <v-tab-item
                  v-for="i in 3"
                  :key="i"
                  :value="'tab-' + i"
                >
                  <v-card flat>
                    <v-card-text>
                      <v-data-table
                        :headers="headers"
                        :items="tasks"
                      >
                        <template v-slot:items="props">
                          <tr @click="showAlert(props.item.id)">
                          <td>{{ props.item.id }}</td>
                          <td class="text-xs-center">
                            <v-icon :color="props.item.status <= 50 ? 'red' : 'green'" small>fas fa-check-circle</v-icon>
                          </td>
                          <td>{{ props.item.description }}</td>
                          <td class="text-xs-center">
                            <v-icon v-if="props.item.info === true" small color="primary">fas fa-info-circle</v-icon>
                          </td></tr>
                        </template>
                      </v-data-table>

                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import TasksList from './TasksList.vm.js';
export default TasksList;
</script>
<style scoped lang="css">

</style>
