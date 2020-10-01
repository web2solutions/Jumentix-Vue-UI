<template>
  <div id="TasksReference">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-card-title primary-title>
                <h3>Flintstone, Wilma and Fred (3)</h3>
                <v-spacer></v-spacer>
                <v-btn fab dark @click="cloneCard">
                    <v-icon dark>add</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-xs>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <quill-editor 
                                class="quill"
                                :content="content"
                                :options="editorOption"
                            >
                            </quill-editor>   
                        </v-flex>
                        <v-flex xs12>
                            <h3>Status: 0/6 References completed</h3>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-container grid-list-xs id="card">
                    <v-layout row wrap id="cardItem">
                        <v-flex xs12>
                            <v-card>
                                <v-card-title primary-title>
                                    <v-spacer></v-spacer>
                                    <v-btn flat icon color="primary" @click="closeCard">
                                        <v-icon>close</v-icon>
                                    </v-btn>
                                </v-card-title>
                                <v-card-text>
                                    <v-container grid-list-xs>
                                        <v-layout row wrap>
                                            <v-flex xs12>
                                                <v-select
                                                    :items="referenceType"
                                                    label="Reference Type"
                                                ></v-select>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-select
                                                    :items="contact"
                                                    label="Contact Method"
                                                ></v-select>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-text-field
                                                    name="Organization"
                                                    label="Organization"
                                                    id="Organization"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-text-field
                                                    name="ContactName"
                                                    label="Contact Name"
                                                    id="ContactName"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-text-field
                                                    name="Address 1"
                                                    label="Address 1"
                                                    id="Address 1"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-text-field
                                                    name="Address2"
                                                    label="Address 2"
                                                    id="Address2"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 lg6>
                                                <v-text-field
                                                    name="City"
                                                    label="City"
                                                    id="City"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 lg6>
                                                <v-text-field
                                                    name="State"
                                                    label="State"
                                                    id="State"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-text-field
                                                    name="ZIP"
                                                    label="ZIP"
                                                    id="ZIP"
                                                ></v-text-field>
                                            </v-flex>
                                             <v-flex xs12 lg6>
                                                <v-text-field
                                                    name="Country"
                                                    label="Country"
                                                    id="Country"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 lg6>
                                                <v-text-field
                                                    name="Phone"
                                                    label="Phone"
                                                    id="Phone"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-select
                                                    label="Email Address"
                                                    chips
                                                    tags
                                                    clearable
                                                    v-model="chips"
                                                >
                                                    <template slot="selection" slot-scope="data">
                                                    <v-chip
                                                        close
                                                        @input="remove(data.item)"
                                                        :selected="data.selected"
                                                    >
                                                        <strong>{{ data.item }}</strong>&nbsp;
                                                    </v-chip>
                                                    </template>
                                                </v-select>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                    
                                </v-card-text>
                                <v-card-actions>
                                    
                                    <v-spacer></v-spacer>
                                    <v-btn color="success">Save</v-btn>
                                    <v-btn color="warn">Cancel</v-btn>
                                </v-card-actions>
                            </v-card>
                    </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import TasksReference from './TasksReference.vm.js';
export default TasksReference;
</script>
<style scoped>

</style>
