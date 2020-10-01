<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-toolbar card color="primary">
              <v-dialog v-model="dialog" max-width="500px">
                <v-btn icon slot="activator">
                    <v-icon>person_add</v-icon>
                </v-btn>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                            <v-flex v-for="(value, key) in editedItem" v-if="key !== ''" xs12 :key="key + '-flex'">
                              <v-text-field v-model="editedItem[ key ]" :disabled="key === '_id'" :label="swagger.definitions[entity].properties[key].description" :key="key + '-field'"></v-text-field>
                            </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-btn icon>
                <v-icon>edit</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>delete</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>refresh</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-spacer></v-spacer>

            </v-toolbar>

            <div ref="container"></div>

            <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
          </v-card>

        </v-flex>


      </v-layout>
    </v-container>
    <v-snackbar
      v-model="snack"
      :timeout="3000"
      :color="snackColor"
      :top="true"
      >
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Human from './Human.vm.js';
export default Human;
</script>
