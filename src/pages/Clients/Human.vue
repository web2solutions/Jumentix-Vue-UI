<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <xCrudControls
            :entity="entity"
             ref="xCrudControls"></xCrudControls>
            <v-divider></v-divider>
            
            <v-card-text class="pa-0">
              <xGrid
                :dialog="forms.crud.dialog"
                :dialog_loading="dialog_loading"
                :entity="entity"
                :selected="selected"
                :pagination="pagination"
                :totalDocuments="totalDocuments"
                :headers="headers"
                :original_documents="original_documents"
                :documents="documents"
                :loading="loading"
                :forms="forms"
                :itemKey="itemKey"
                ref="xGrid"
              ></xGrid>
            </v-card-text>
            <xForm
                :dialog="forms.crud.dialog"
                :dialog_create="dialog_create"
                :dialog_loading="dialog_loading"
                :entity="entity"
                :selected="selected"
                :loading="loading"
                :forms="forms"
                :form_search="form_search"
                :query_operators="query_operators"
                :close="close"
                ref="xForm"
            ></xForm>
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
<style lang="stylus">
.theme--dark .v-table thead th {
  background-color: #424242;
}

.theme--light .v-table thead th {
  background-color: #ffffff;
}

/* Theme */
.fixed-header
  &
      display: flex
      flex-direction: column
      height: 100%

  table
      table-layout: fixed

  th
      position: sticky
      top: 0
      z-index: 5

      &:after
          content: ''
          position: absolute
          left: 0
          bottom: 0
          width: 100%

  tr.v-datatable__progress
      th
          // top: 56px
          height: 1px;

  .v-table__overflow
      flex-grow: 1
      flex-shrink: 1
      overflow-x: auto
      overflow-y: auto
      // overflow: auto
      // height: 100%

  .v-datatable.v-table
      flex-grow: 0
      flex-shrink: 1

      .v-datatable__actions
          flex-wrap: nowrap

          .v-datatable__actions__pagination
              white-space: nowrap

</style>
