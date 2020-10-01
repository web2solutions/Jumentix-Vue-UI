<template>
  <v-container id="programTop">
    <v-card class="elevation-0 mb-5">
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Programs</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                small
                dark
                class="mb-2"
                @click="programDialog = true"
              >New Program</v-btn>
            </v-toolbar>
            <v-data-table
              :headers="programHeaders"
              :items="programItems"
              class="elevation-1"
              hide-actions
            >
              <template v-slot:items="props">
                <tr @click="feedProgramRoles(props.item)">
                  <td>{{ props.item.name }}</td>
                  <td class="text-xs-right">
                    <v-icon small class="mr-2" @click="editItem(props.item, 'role')">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item, 'role')">delete</v-icon>
                  </td>
                </tr>
              </template>
              <template v-slot:no-data>
                <div class="text-xs-center">
                  <v-btn small flat color="primary" @click="programDialog = true">Add a new Program</v-btn>
                </div>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>

        <v-layout row wrap pt-2>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Program Roles</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <!-- <v-btn color="primary" small dark class="mb-2" @click="programRoleInitDialog = true">New Program Roles</v-btn> -->
            </v-toolbar>
            <v-data-table
              :headers="programRoleHeaders"
              :items="programRolesItem"
              class="elevation-1"
              hide-actions
            >
              <template v-slot:items="props">
                <tr @click="feedProgramSubRoles(props.item)">
                  <td>{{ props.item.name }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>

        <v-layout row wrap pt-2>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Program Sub Roles</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              {{ subRoleSelectedTitle }}
            </v-toolbar>
            <v-data-table
              :headers="programRoleHeaders"
              :items="programSubRolesItem"
              class="elevation-1"
              hide-actions
            >
              <template v-slot:items="props">
                <td>{{ props.item.name }}</td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>

    <v-btn flat @click="bus.$emit('previewStep')">Preview</v-btn>
    <v-btn color="primary" @click="bus.$emit('nextStep', 8)">Continue</v-btn>
    <v-btn flat>Cancel</v-btn>

    <!-- New Program Dialog -->
    <v-dialog v-model="programDialog" scrollable max-width="650px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ programFormTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="role" lazy-validation>
            <v-container grid-list-md pb-0>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="programSchema.name"
                    label="Program Name"
                    required
                    :rules="[rules.required, rules.min]"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
          <v-container grid-list-md pt-0>
            <v-layout wrap>
              <v-flex xs12>
                <v-toolbar flat color="white" class="pr-0">
                  <v-toolbar-title>Program Roles</v-toolbar-title>
                  <v-divider class="mx-2" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search Role"
                    single-line
                    hide-details
                    clearable
                  ></v-text-field>
                </v-toolbar>
                <v-data-table
                  v-model="selected"
                  :headers="programRoleHeaders"
                  :items="rolesItem"
                  class="elevation-1 fixed-header v-table__overflow scroll-grid"
                  hide-actions
                  select-all
                  :search="search"
                >
                  <template slot="items" slot-scope="props">
                    <tr :active="props.selected" @select="console.log('select')" @click="feedSubRoles(props.item)">
                      <td>
                        <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
                      </td>
                      <td>{{ props.item.name }}</td>
                    </tr>
                  </template>
                </v-data-table>
              </v-flex>

              <v-flex xs12 pt-2>
                <v-toolbar flat color="white" class="pr-0">
                  <v-toolbar-title>Program Sub Roles</v-toolbar-title>
                  <v-divider class="mx-2" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  {{ subRoleSelectedTitle }}
                </v-toolbar>
                <v-data-table
                  v-model="selectedSubRoles"
                  :headers="programRoleHeaders"
                  :items="subRolesItem"
                  class="elevation-1 fixed-header v-table__overflow scroll-grid"
                  hide-actions
                  item-key="name"
                  select-all
                  dense
                >
                  <template slot="items" slot-scope="props">
                    <td>
                      <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
                    </td>
                    <td>{{ props.item.name }}</td>
                  </template>

                  <template v-slot:no-data>
                    <div class="text-xs-center">No Program Role Selected</div>
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close('role')">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save('role')">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import Programs from './Programs.vm.js';
export default Programs;
</script>
<style lang="stylus">
#programs {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  z-index: 0;
}

.scroll-grid {
  max-height: 250px;
  backface-visibility: hidden;
}

.theme--dark.v-table thead th {
  background-color: #424242;
}

.theme--light.v-table thead th {
  background-color: #ffffff;
}

.scroll-grid .theme--light.v-table thead th:first-child {
  width: 60px;
}

table.v-table tbody td, table.v-table tbody th {
  height: 32px;
}

/* Theme */
.fixed-header {
  & {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  table {
    table-layout: fixed;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 5;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
    }
  }

  tr.v-datatable__progress {
    th {
      // top: 56px
      height: 1px;
    }
  }

  .v-table__overflow {
    flex-grow: 1;
    flex-shrink: 1;
    overflow-x: auto;
    overflow-y: auto;
    // overflow: auto
    // height: 100%
  }

  .v-datatable.v-table {
    flex-grow: 0;
    flex-shrink: 1;

    .v-datatable__actions {
      flex-wrap: nowrap;

      .v-datatable__actions__pagination {
        white-space: nowrap;
      }
    }
  }
}
</style>
