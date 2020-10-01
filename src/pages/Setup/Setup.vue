<template>
  <v-app id="setup" class="primary">
    <v-content>
      <v-container fluid fill-height id="setupTop">
        <v-layout align-center justify-center>
          <v-flex xs12 sm8>
            <v-card class="elevation-1 pa-3">
              <v-card-title class="pa-0 title font-weight-light">
                <v-spacer></v-spacer>
                JumentiX SETUP
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text>
                <div class="layout column align-center pb-4">
                  <img src="/static/logo.png" alt="JumentiX" height="100">
                </div>

                <v-stepper v-model="setupStep" vertical class="elevation-0">

                  <v-stepper-step editable :complete="setupStep > 1" step="1">Welcome to My Adoption Portal Setup</v-stepper-step>

                  <v-stepper-content step="1">
                    <div class="layout column align-center ma-5">
                      <p class="font-weight-light pb-3">This wizard will guide you through all setup steps</p>
                      <v-btn color="primary" @click="setupStep = 2">Start</v-btn>
                    </div>
                  </v-stepper-content>

                  <v-stepper-step editable :complete="setupStep > 2" step="2">
                    Setup Agency configuration
                    <small>Create the owner Organization</small>
                  </v-stepper-step>

                  <v-stepper-content step="2">
                    <setup-agency :bus="bus"></setup-agency>
                  </v-stepper-content>

                  <v-stepper-step editable :complete="setupStep > 3" step="3">Setup Roles Configuration</v-stepper-step>

                  <v-stepper-content step="3">
                    <setup-roles :bus="bus"></setup-roles>
                  </v-stepper-content>

                  <v-stepper-step editable :complete="setupStep > 4" step="4">Setup Portal Configuration</v-stepper-step>

                  <v-stepper-content step="4">
                    <setup-portal-config :bus="bus"></setup-portal-config>
                  </v-stepper-content>

                  <v-stepper-step editable :complete="setupStep > 5" step="5">Setup Users Configuration</v-stepper-step>
                  
                  <v-stepper-content step="5">
                    <setup-users :bus="bus"></setup-users>
                  </v-stepper-content>

                  <v-stepper-step editable :complete="setupStep > 6" step="6">Setup Outiside Organization</v-stepper-step>
                  
                  <v-stepper-content step="6" class="mr-0 pr-0">
                    <setup-organization :bus="bus"></setup-organization>
                  </v-stepper-content>

                  <v-stepper-step editable :complete="setupStep > 7" step="7">Setup Program configuration</v-stepper-step>
                  
                  <v-stepper-content step="7">
                    <setup-programs :bus="bus"></setup-programs>
                  </v-stepper-content>

                  <v-stepper-step editable :complete="setupStep > 8" step="8">Setup Task Status configuration</v-stepper-step>
                  
                  <v-stepper-content step="8">
                    <setup-task-status :bus="bus"></setup-task-status>
                  </v-stepper-content>

                  <v-stepper-step editable :complete="setupStep > 9" step="9">Setup Task configuration</v-stepper-step>
                  
                  <v-stepper-content step="9" class=" mr-0 pr-0">
                    <setup-task-config :bus="bus"></setup-task-config>
                  </v-stepper-content>

                  <v-stepper-step editable :complete="setupStep > 10" step="10">Setup Phases configuration</v-stepper-step>
                  
                  <v-stepper-content step="10" class="mr-0 pr-0">
                    <setup-phases :bus="bus"></setup-phases>
                  </v-stepper-content>

                  <v-stepper-step editable :complete="setupStep > 11" step="11">Setup Groups configuration</v-stepper-step>
                  
                  <v-stepper-content step="11" class="mr-0 pr-0">
                    <setup-groups :bus="bus"></setup-groups>
                  </v-stepper-content>

                  <v-stepper-step editable step="12">Setup Finish</v-stepper-step>
                  
                  <v-stepper-content step="12">
                    <v-card class="mb-5 elevation-0">
                      <v-card-text>
                        <v-alert
                          :value="true"
                          type="success"
                          outline
                        >
                          <h1 class="title">Congratulations!</h1>
                          <h2 class="subheading">The system has been configured correctly</h2>
                        </v-alert>
                      </v-card-text>  
                    </v-card>
                    <v-btn flat @click="bus.$emit('previewStep')">Preview</v-btn>
                    <v-btn color="primary" to="/">Finish!</v-btn>
                  </v-stepper-content>
                </v-stepper>
              </v-card-text>
              <!-- <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small>Cancel</v-btn>
                <v-btn small color="primary" :loading="loading" @click="goToUrl('Agency')">Next</v-btn>
              </v-card-actions> -->
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import Setup from './Setup.vm.js';
export default Setup;
</script>
<style scoped lang="css">
  #setup {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>
