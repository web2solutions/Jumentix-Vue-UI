<template>
  <v-container id="agencyTop">
    <v-card class="mb-5 elevation-0">
      <v-form ref="agency">
        <v-layout row wrap>
          <v-flex xs12 md6 pr-1>
            <v-text-field 
              v-model="organization.name" 
              label="Name"
              :rules="[rules.required]"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md6 pl-1>
            <v-text-field 
              v-model="organization.feid_number" 
              label="FEID Number"
              :rules="[rules.required]"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md6>
            <v-text-field 
              v-model="organization.license_number" 
              label="License"
              :rules="[rules.required]"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md6>
            <v-menu
              v-model="license_expire_date_picker"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="computedLicenseExpireDate"
                  label="License expiration"
                  prepend-icon="event"
                  readonly
                  clearable
                  v-on="on"
                  :rules="[rules.required]"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="organization.license_expire_date"
                @input="license_expire_date_picker = false"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12 md6 pl-1>
            <v-text-field v-model="organization.referral_source" label="Ref Source"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-select
              :items="servicesItem"
              v-model="organization.services"
              label="Services"
              multiple
              chips
              clearable
              :rules="[rules.required]"
              item-value="_id"
              item-text="name"
            ></v-select>
          </v-flex>
        </v-layout>
      </v-form>

      <v-layout row wrap>
        <v-flex xs12>
          <v-toolbar flat color="white" class="pr-0">
            <v-toolbar-title>Email</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="emailDialog" max-width="650px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" small dark class="mb-2" v-on="on">New Email</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ emailFormTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-form ref="email" lazy-validation>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 md6>
                          <v-text-field
                            v-model="emailSchema.email"
                            label="Email"
                            required
                            :rules="[rules.required, rules.email]"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md3>
                          <v-select
                            :items="['Home', 'Work', 'Vacation', 'Billing']"
                            v-model="emailSchema.type"
                            label="Type"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 md3>
                          <v-switch v-model="emailSchema.isDefault" label="Is Default"></v-switch>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="close('email')">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat @click="save('email')">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-data-table :headers="emailHeaders" :items="organization.email" class="elevation-1" hide-actions>
            <template v-slot:items="props">
              <td>{{ props.item.email }}</td>
              <td>{{ props.item.type }}</td>
              <td class="pt-1">
                <v-checkbox v-model="props.item.isDefault" :value="props.item.isDefault" disabled></v-checkbox>
              </td>
              <td>
                <v-icon small class="mr-2" @click="editItem(props.item, 'email')">edit</v-icon>
                <v-icon small @click="deleteItem(props.item, 'email')">delete</v-icon>
              </td>
            </template>
            <template v-slot:no-data>
              <div class="text-xs-center">
                <v-btn small flat color="primary" @click="emailDialog = true">Add a new email</v-btn>
              </div>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>

      <v-layout row wrap pt-2>
        <v-flex xs12>
          <v-toolbar flat color="white" class="pr-0">
            <v-toolbar-title>Phone</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="phoneDialog" max-width="650px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" small dark class="mb-2" v-on="on">New phone</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ phoneFormTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-form ref="phone" lazy-validation>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs3 py-0>
                          <v-autocomplete
                            v-model="phoneSchema.country_code"
                            label="Country"
                            :items="countrys"
                            item-text="name"
                            item-value="callingCode"
                            clearable
                            :rules="[rules.required]"
                          >
                            <template v-slot:selection="data">
                              <v-avatar size="16" class="pr-1">
                                <img :src="data.item.flag" />
                              </v-avatar>
                              {{ data.item.callingCode }}
                            </template>
                            <template v-slot:item="data">
                              <template v-if="typeof data.item !== 'object'">
                                <v-list-tile-content v-text="data.item"></v-list-tile-content>
                              </template>
                              <template v-else>
                                <v-list-tile-avatar size="26">
                                  <img :src="data.item.flag" />
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                  <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                  <v-list-tile-sub-title
                                    v-html="'Calling Code: ' + data.item.callingCode"
                                  ></v-list-tile-sub-title>
                                </v-list-tile-content>
                              </template>
                            </template>
                          </v-autocomplete>
                        </v-flex>
                        <v-flex xs2 py-0>
                          <v-text-field
                            ref="phone"
                            v-model="phoneSchema.area_number"
                            label="Area"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs4 py-0>
                          <v-text-field
                            ref="phone"
                            v-model="phoneSchema.number"
                            label="Phone"
                            :rules="[rules.required]"
                            maxlength="10"
                            @input="maskPhone(phoneSchema.number)"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md3 py-0>
                          <v-select
                            :items="['Home', 'Work', 'Vacation', 'Billing']"
                            v-model="phoneSchema.type"
                            label="Type"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12>
                          <v-switch v-model="phoneSchema.isDefault" label="Is Default"></v-switch>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="close('phone')">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat @click="save('phone')">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-data-table :headers="phoneHeaders" :items="organization.phone" class="elevation-1" hide-actions>
            <template v-slot:items="props">
              <td>{{ props.item.country_code }} ({{ props.item.area_number }}) {{ props.item.number }}</td>
              <td>{{ props.item.type }}</td>
              <td class="pt-1">
                <v-checkbox v-model="props.item.isDefault" :value="props.item.isDefault" disabled></v-checkbox>
              </td>
              <td>
                <v-icon small class="mr-2" @click="editItem(props.item, 'phone')">edit</v-icon>
                <v-icon small @click="deleteItem(props.item, 'phone')">delete</v-icon>
              </td>
            </template>
            <template v-slot:no-data>
              <div class="text-xs-center">
                <v-btn small flat color="primary" @click="phoneDialog = true">Add a new Phone</v-btn>
              </div>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>

      <v-layout row wrap pt-2>
        <v-flex xs12>
          <v-toolbar flat color="white" class="pr-0">
            <v-toolbar-title>Address</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="addressDialog" max-width="650px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" small dark class="mb-2" v-on="on">New address</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ addressFormTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-form ref="address" lazy-validation>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 md6>
                          <v-select
                            :items="['Home', 'Work', 'Vacation', 'Billing']"
                            v-model="addressSchema.type"
                            label="Type"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-switch v-model="addressSchema.isDefault" label="Is Default"></v-switch>
                        </v-flex>

                        <v-flex xs12 md6>
                          <v-text-field
                            v-model="addressSchema.line_1"
                            label="Address"
                            required
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-text-field v-model="addressSchema.line_2" label="Line 2" required></v-text-field>
                        </v-flex>

                        <v-flex xs12 md6>
                          <v-text-field
                            v-model="addressSchema.city"
                            label="City"
                            required
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-text-field
                            v-model="addressSchema.state"
                            label="State"
                            required
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-flex>

                        <v-flex xs12 md6>
                          <v-autocomplete
                            label="Country"
                            :items="country"
                            v-model="addressSchema.country"
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-text-field
                            v-model="addressSchema.zip"
                            label="ZIP"
                            required
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="close('address')">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat @click="save('address')">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-data-table
            :headers="addressHeaders"
            :items="organization.address"
            class="elevation-1"
            hide-actions
          >
            <template v-slot:items="props">
              <td>{{ props.item.line_1 }} {{ props.item.line_2 }} - {{ props.item.city }}/{{ props.item.state }}</td>
              <td>{{ props.item.type }}</td>
              <td class="pt-1">
                <v-checkbox v-model="props.item.isDefault" :value="props.item.isDefault" disabled></v-checkbox>
              </td>
              <td>
                <v-icon small class="mr-2" @click="editItem(props.item, 'address')">edit</v-icon>
                <v-icon small @click="deleteItem(props.item, 'address')">delete</v-icon>
              </td>
            </template>
            <template v-slot:no-data>
              <div class="text-xs-center">
                <v-btn small flat color="primary" @click="addressDialog = true">Add a new address</v-btn>
              </div>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card>

    <v-btn flat @click="bus.$emit('previewStep')">Preview</v-btn>
    <v-btn color="primary" @click="save('agency')">Continue</v-btn>
    <v-btn flat>Cancel</v-btn>
  </v-container>
</template>
<script>
import Agency from './Agency.vm.js';
export default Agency;
</script>
<style scoped lang="css">

</style>
