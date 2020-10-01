<template>
  <div id="Reports">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-card-title primary-title>
              <h4>Reports Title</h4>
            </v-card-title>
            <vue-perfect-scrollbar class="perfect--scrollbar">
              <v-card-text>
                  <h1>Reports Content</h1>
              </v-card-text>
            </vue-perfect-scrollbar>  
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import Reports from './Reports.vm.js';
export default Reports;
</script>
<style scoped lang="css">

</style>
