<template>
  <div id="Resources">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-card-title primary-title>
              <h4>Resources Title</h4>
            </v-card-title>
            <vue-perfect-scrollbar class="perfect--scrollbar">
              <v-card-text>
                  <h1>Resources Content</h1>
              </v-card-text>
            </vue-perfect-scrollbar>  
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import Resources from './Resources.vm.js';
export default Resources;
</script>
<style scoped lang="css">

</style>
