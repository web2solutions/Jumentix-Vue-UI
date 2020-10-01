<template>
  <v-container id="roleTop">
    <v-card class="elevation-0 mb-5">
      <v-card-text id="subRoleInitTop">
        <v-layout row wrap>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Program Roles</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn color="primary" small dark class="mb-2" @click="addNewRole">New role</v-btn>
              <v-dialog v-model="roleDialog" max-width="650px">
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ roleFormTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-form ref="role" lazy-validation>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 md6>
                            <v-text-field
                              v-model="roleSchema.name"
                              label="Role Name"
                              required
                              :rules="[rules.required]"
                            ></v-text-field>
                          </v-flex>

                          <v-flex xs12 md6>
                            <v-text-field
                              v-model="roleSchema.label"
                              label="Role Label"
                              required
                              :rules="[rules.required]"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 md6>
                            <v-select
                              :items="['Family', 'Couple', 'Service', 'Social', 'Other']"
                              v-model="roleSchema.type"
                              label="type"
                            ></v-select>
                          </v-flex>
                          <v-flex xs12 md6>
                            <v-checkbox label="Can delete?" v-model="roleSchema.canDelete"></v-checkbox>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-form>

                    <v-toolbar flat color="white" class="pr-0">
                      <v-toolbar-title>subRole</v-toolbar-title>
                      <v-divider class="mx-2" inset vertical></v-divider>
                      <v-spacer></v-spacer>
                      <v-dialog v-model="subRoleDialog" max-width="650px">
                        <template v-slot:activator="{ on }">
                          <v-btn color="primary" small dark class="mb-2" v-on="on">New subRole</v-btn>
                        </template>
                        <v-card>
                          <v-card-title>
                            <span class="headline">{{ subRoleFormTitle }}</span>
                          </v-card-title>
                          <v-card-text>
                            <v-form ref="subRole" lazy-validation>
                              <v-container grid-list-md>
                                <v-layout wrap>
                                  <v-flex xs12 md6>
                                    <v-text-field
                                      :disabled="this.editedSubRoleIndex > -1"
                                      v-model="subRoleSchema.name"
                                      label="Sub Role Name"
                                      required
                                      :rules="[rules.required]"
                                    ></v-text-field>
                                  </v-flex>
                                  <v-flex xs12 md6>
                                    <v-text-field
                                      v-model="subRoleSchema.label"
                                      label="Sub Role Label"
                                      required
                                      :rules="[rules.required]"
                                    ></v-text-field>
                                  </v-flex>
                                  <v-flex xs12 md3>
                                    <v-checkbox
                                      label="Can delete?"
                                      v-model="subRoleSchema.canDelete"
                                    ></v-checkbox>
                                  </v-flex>
                                </v-layout>
                              </v-container>
                            </v-form>
                          </v-card-text>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="close('subRole')">Cancel</v-btn>
                            <v-btn color="blue darken-1" flat @click="save('subRole')">Save</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-toolbar>
                    <v-data-table
                      :headers="subRoleHeaders"
                      :items="subRoles"
                      class="elevation-1"
                      hide-actions
                    >
                      <template v-slot:items="props">
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.label }}</td>
                        <td class="pt-1">
                          <v-checkbox
                            v-model="props.item.canDelete"
                            :value="props.item.canDelete"
                            disabled
                          ></v-checkbox>
                        </td>
                        <td>
                          <v-icon small class="mr-2" @click="editItem(props.item, 'subRole')">edit</v-icon>
                          <v-icon small @click="deleteItem(props.item, 'subRole')">delete</v-icon>
                        </td>
                      </template>
                      <template v-slot:no-data>
                        <div class="text-xs-center">
                          <v-btn
                            small
                            flat
                            color="primary"
                            @click="subRoleDialog = true"
                          >Add a new role</v-btn>
                        </div>
                      </template>
                    </v-data-table>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close('role')">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click="save('role')">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>

            <v-data-table
              :headers="roleHeaders"
              :items="roles"
              class="elevation-1 fixed-header v-table__overflow"
              style="max-height: calc(60vh - 250px);backface-visibility: hidden;"
              hide-actions
            >
              <template slot="items" slot-scope="props">
                <tr @click="feedSubRoles(props.item)">
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.label }}</td>
                  <td>{{ props.item.type }}</td>
                  <td class="pt-1">
                    <v-checkbox
                      v-model="props.item.canDelete"
                      :value="props.item.canDelete"
                      disabled
                    ></v-checkbox>
                  </td>
                  <td>
                    <v-icon small class="mr-2" @click="editItem(props.item, 'role')">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item, 'role')">delete</v-icon>
                  </td>
                </tr>
              </template>
              <template v-slot:no-data>
                <div class="text-xs-center">
                  <v-btn small flat color="primary" @click="addNewRole">Add a new role</v-btn>
                </div>
              </template>
            </v-data-table>

            <!-- <v-data-table
                          :headers="roleHeaders"
                          :items="roles"
                          class="elevation-1"
                        >
                          <template v-slot:items="props">
                            <tr @click="feedSubRoles(props.item)">
                              <td>{{ props.item.name }}</td>
                              <td>{{ props.item.label }}</td>
                              <td>{{ props.item.type }}</td>
                              <td class="pt-1"><v-checkbox v-model="props.item.canDelete" :value="props.item.canDelete" disabled></v-checkbox></td>
                              <td>
                                <v-icon
                                  small
                                  class="mr-2"
                                  @click="editItem(props.item, 'role')"
                                >
                                  edit
                                </v-icon>
                                <v-icon
                                  small
                                  @click="deleteItem(props.item, 'role')"
                                >
                                  delete
                                </v-icon>
                              </td>
                            </tr>
                          </template>
                          <template v-slot:no-data>
                            <div class="text-xs-center">
                              <v-btn small flat color="primary" @click="roleDialog = true">Add a new role</v-btn>
                            </div>
                          </template>
            </v-data-table>-->
          </v-flex>
        </v-layout>

        <v-layout row wrap pt-2>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Sub Role</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="subRoleInitDialog" max-width="650px">
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="primary"
                    :disabled="btnAddSubRoleInit"
                    small
                    dark
                    class="mb-2"
                    v-on="on"
                  >New Sub Role Init</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ subRoleFormTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-form ref="subRoleInit" lazy-validation>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 md6>
                            <v-text-field
                              :disabled="this.editedSubRoleIndex > -1"
                              v-model="subRoleSchema.name"
                              label="Sub Role Name"
                              required
                              :rules="[rules.required]"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 md6>
                            <v-text-field
                              v-model="subRoleSchema.label"
                              label="Sub Role Label"
                              required
                              :rules="[rules.required]"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 md3>
                            <v-checkbox
                              label="Can delete?"
                              v-model="subRoleSchema.canDelete"
                              :disabled="true"
                            ></v-checkbox>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-form>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close('subRoleInit')">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click="save('subRoleInit')">Save subRoleInit</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
            <v-data-table
              :headers="subRoleHeaders"
              :items="subRolesInit"
              class="elevation-1 fixed-header v-table__overflow"
              style="max-height: calc(60vh - 250px);backface-visibility: hidden;"
              hide-actions
            >
              <template v-slot:items="props">
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.label }}</td>
                <td class="pt-1">
                  <v-checkbox v-model="props.item.canDelete" :value="props.item.canDelete" disabled></v-checkbox>
                </td>
                <td>
                  <v-icon small class="mr-2" @click="editItem(props.item, 'subRoleInit')">edit</v-icon>
                  <v-icon small @click="deleteItem(props.item, 'subRole')">delete</v-icon>
                </td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-btn flat @click="bus.$emit('previewStep')">Preview</v-btn>
    <v-btn color="primary" @click="save('roles')">Continue</v-btn>
    <v-btn flat>Cancel</v-btn>
  </v-container>
</template>
<script>
import Roles from './Roles.vm.js';
export default Roles;
</script>
<style lang="stylus">
.theme--dark.v-table thead th {
  background-color: #424242;
}

.theme--light.v-table thead th {
  background-color: #ffffff;
}

.v-table__overflow {
  flex-grow: 1;
  flex-shrink: 1;
  overflow-x: auto;
  overflow-y: auto;
  // overflow: auto
  // height: 100%
}

/* Theme */
.fixed-header {
  & {
    display: flex;
    flex-direction: column;
    // height: 100%
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
