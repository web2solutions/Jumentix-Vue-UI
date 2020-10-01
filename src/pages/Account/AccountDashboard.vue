<template>
  <div id="AccountDashboard">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-card-title primary-title>
              <h4>Display Option</h4>
            </v-card-title>
            <vue-perfect-scrollbar class="perfect--scrollbar">
              <v-card-text>
                <v-list
                  v-sortable-list
                  @sorted="objectSortOccurred"
                >
                  <v-list-tile
                    v-for="item in widgetList"
                    :key="item.title"
                    v-ripple
                  >
                    <v-list-tile-action class="sortHandle">
                      <v-icon style="cursor: row-resize">
                        drag_handle
                      </v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                      <v-list-tile-title class="subheading">{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action class="d-block">
                      <v-switch value :input-value="item.active"></v-switch>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-card-text>
            </vue-perfect-scrollbar>  
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import AccountDashboard from './AccountDashboard.vm.js';
export default AccountDashboard;
</script>
<style scoped lang="css">

</style>
