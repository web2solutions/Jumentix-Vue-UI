<template>
  <v-container id="TaskStatusTop">
    <v-card class="elevation-0 mb-5">
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Task Statuses and labels</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-data-table :headers="headers" :items="items" hide-actions>
              <template v-slot:items="props">
                <td>{{ props.item.status }}</td>
                <td>
                  <v-edit-dialog
                    :return-value.sync="props.item.label"
                    lazy
                    @save="save(props.item)"
                    @cancel="cancel"
                    @open="open"
                    @close="close"
                  >
                    {{ props.item.label }}
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.label"
                        :rules="[max25chars]"
                        label="Edit"
                        single-line
                        counter
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </td>
              </template>
            </v-data-table>

            <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
              {{ snackText }}
              <v-btn flat @click="snack = false">Close</v-btn>
            </v-snackbar>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-btn flat @click="bus.$emit('previewStep')">Preview</v-btn>
    <v-btn color="primary" @click="bus.$emit('nextStep', 9)">Continue</v-btn>
    <v-btn flat>Cancel</v-btn>
  </v-container>
</template>
<script>
import TaskStatus from './TaskStatus.vm.js';
export default TaskStatus;
</script>
<style scoped lang="css">

</style>
