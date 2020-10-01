<template>
  <div id="Configuration">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-card-title primary-title>
              <h4>Configuration Title</h4>
            </v-card-title>
            <vue-perfect-scrollbar class="perfect--scrollbar">
              <v-card-text>
                  <h1>Configuration Content</h1>
              </v-card-text>
            </vue-perfect-scrollbar>  
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import Configuration from './Configuration.vm.js';
export default Configuration;
</script>
<style scoped lang="css">

</style>
