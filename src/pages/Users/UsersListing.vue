<template>
  <v-layout wrap id="UsersListing">
    <v-container>
      <v-layout justify-center>
        <v-spacer></v-spacer>
        <v-flex xs11 md5 pr-4>
          <v-autocomplete
            flat
            v-model="model"
            :loading="isLoading"
            clearable
            hide-no-data
            hide-selected
            :item-text="item_text"
            :item-value="item_value"
            :label="'Search for ' + searchType"
            append-outer-icon="search"
            class="mt-0 d-xl-inline-flex"
            return-object
          >
            <template v-slot:prepend>
              <v-menu bottom left>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">filter_list</v-icon>
                </template>

                <v-list>
                  <v-list-tile
                    v-for="(item, i) in itemsMenu"
                    :key="i"
                    @click="selectFilter(item, i)"
                  >
                    <v-list-tile-title>
                      <v-icon v-if="item.title === searchType">check</v-icon>
                      <span v-else class="selectorNoIcon"></span>
                      {{ item.title }}
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </template>
          </v-autocomplete>
        </v-flex>
        <v-flex xs1>
          <v-speed-dial
            v-model="fab"
            absolute
            direction="bottom"
            open-on-hover
            transition="slide-y-transition"
            class="fab"
          >
            <v-btn slot="activator" v-model="fab" color="green" dark fab>
              <v-icon>add</v-icon>
              <v-icon>close</v-icon>
            </v-btn>

            <v-tooltip left>
              <v-btn fab dark small color="indigo" slot="activator" to="clients-add">
                <v-icon>person_add</v-icon>
              </v-btn>
              <span>Add Client</span>
            </v-tooltip>
            <v-tooltip left>
              <v-btn fab dark small color="blue-grey" slot="activator" to="clients-add">
                <v-icon>home</v-icon>
              </v-btn>
              <span>Add Organization</span>
            </v-tooltip>
            <v-tooltip left v-if="this.$router.currentRoute.fullPath !== '/finance'">
              <v-btn fab dark small color="orange" slot="activator">
                <v-icon>work_outline</v-icon>
              </v-btn>
              <span>Add Case</span>
            </v-tooltip>
          </v-speed-dial>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-toolbar card color="white">
              <v-text-field
                flat
                solo
                prepend-icon="search"
                placeholder="Type something"
                v-model="search"
                hide-details
                class="hidden-sm-and-down"
              ></v-text-field>
              <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>

                        <v-flex xs12>
                          <v-text-field v-model="usersData.roles" label="Type"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field v-model="usersData.username" label="Username"></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-text-field v-model="usersData.status" label="Status"></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                          <v-text-field v-model="usersData.last_login" label="Last Login"></v-text-field>
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
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="headers"
                :items="usersItems"
                :search="search"
                :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                class="elevation-1"
              >
                <template v-slot:items="props">
                  <td><router-link :to="'/user-details/'+ props.item._id">{{ props.item.name }}</router-link></td>
                  <td class="text-xs-center">{{ props.item.user.roles[0] }}</td>
                  <td class="text-xs-center">{{ props.item.active = props.item.active ? 'Active' : 'Suspended' }}</td>
                  <td class="text-xs-center">{{ moment(props.item.lastLogin).format('MM/DD/YYYY') }}</td>
                  <td class="text-xs-center px-0">
                    <v-tooltip top>
                      <v-btn small icon class="ma-0" slot="activator" @click="dialogEnableLogin = true">
                      <v-icon small>desktop_access_disabled</v-icon>
                      </v-btn>
                      <span>Enable/Disable Client Portal access</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <v-btn small icon class="ma-0" slot="activator" @click="dialogChangePass = true; person = props.item.name">
                      <v-icon small>vpn_key</v-icon>
                      </v-btn>
                      <span>Reset Password</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <v-btn small icon class="ma-0" slot="activator">
                      <v-icon small>list_alt</v-icon>
                      </v-btn>
                      <span>Show Details</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <v-btn small icon class="ma-0" slot="activator" @click="editItem(props.item)">
                      <v-icon small>edit</v-icon>
                      </v-btn>
                      <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <v-btn small icon class="ma-0" slot="activator" @click="deleteItem(props.item)">
                      <v-icon small>delete</v-icon>
                      </v-btn>
                      <span>Delete</span>
                    </v-tooltip>
                    <v-menu bottom left>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          small
                          icon
                          class="ma-0"
                          v-on="on"
                        >
                          <v-icon small>more_vert</v-icon>
                        </v-btn>
                      </template>

                      <v-list>
                        <v-list-tile
                          v-for="(item, i) in actionItems"
                          :key="i"
                          @click="selectAction"
                        >
                          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </td>
                </template>
                <template v-slot:no-data>
                  <v-btn color="primary" @click="initialize">Reset</v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="dialogEnableLogin" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Enable Portal Login</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
              <v-flex xs12>
                <v-text-field label="Primary Email*" required></v-text-field>
              </v-flex>
                <v-text-field label="Phone number" type="phone" name="phone"></v-text-field>
              </v-flex>
              <small>*indicates required field</small>
              <v-flex xs12>
                <v-switch
                  v-model="switchpass"
                  label="Automaticaly generate a password" 
                ></v-switch>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  :append-icon="show1 ? 'visibility' : 'visibility_off'"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Password"
                  hint="At least 8 characters"
                  counter
                  @click:append="show1 = !show1"
                  :disabled="switchpass"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-switch
                  v-model="switchAsk"
                  label="Ask for a password change at the next sign-in" 
                ></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialogEnableLogin = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="dialogEnableLogin = false">Enable</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogChangePass" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Reset password for {{ person }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-switch
                  v-model="switchpass"
                  label="Automaticaly generate a password" 
                ></v-switch>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  :append-icon="show1 ? 'visibility' : 'visibility_off'"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Password"
                  hint="At least 8 characters"
                  counter
                  @click:append="show1 = !show1"
                  :disabled="switchpass"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-switch
                  v-model="switchAsk"
                  label="Ask for a password change at the next sign-in" 
                ></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialogChangePass = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="dialogChangePass = false">Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import UsersListing from './UsersListing.vm.js';
export default UsersListing;
</script>
<style scoped lang="css">
.perfect--scrollbar {
  height: calc(100vh - 370px);
}
.actions {
  display: inherit !important;
}
.editr {
  border: 0px solid #e4e4e4;
  border-top: 1px solid #e4e4e4;
}
</style>
