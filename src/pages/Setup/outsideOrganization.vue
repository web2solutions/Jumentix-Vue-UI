<template>
  <v-container id="outsideOrganizationTop">
    <v-card class="elevation-0 mb-5">
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Organizations</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="organizationDialog" scrollable max-width="650px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" small dark class="mb-2" v-on="on">New Organization</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ organizationFormTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-form ref="organization" lazy-validation>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12>
                            <v-text-field
                              v-model="organizationSchema.name"
                              label="Name"
                              required
                              :rules="[rules.required]"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 md6>
                            <v-text-field
                              v-model="organizationSchema.feid_number"
                              label="FEID Number"
                              required
                              :rules="[rules.required]"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 md6>
                            <v-text-field
                              v-model="organizationSchema.referral_source"
                              label="Referral Source"
                              required
                              :rules="[rules.required]"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12>
                            <v-select
                              :items="servicesItem"
                              v-model="organizationSchema.services"
                              multiple
                              chips
                              clearable
                              label="Services"
                              item-value="_id"
                              item-text="name"
                            ></v-select>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-form>

                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-toolbar flat color="white" class="pr-0">
                          <v-toolbar-title>Email</v-toolbar-title>
                          <v-divider class="mx-2" inset vertical></v-divider>
                          <v-spacer></v-spacer>
                          <v-dialog v-model="emailOrgDialog" max-width="650px">
                            <template v-slot:activator="{ on }">
                              <v-btn color="primary" small dark class="mb-2" v-on="on">New Email</v-btn>
                            </template>
                            <v-card>
                              <v-card-title>
                                <span class="headline">{{ emailFormTitle }}</span>
                              </v-card-title>
                              <v-card-text>
                                <v-form ref="emailOrg" lazy-validation>
                                  <v-container grid-list-md>
                                    <v-layout wrap>
                                      <v-flex xs12 md6>
                                        <v-text-field
                                          prepend-icon="mail"
                                          v-model="emailSchema.email"
                                          label="Email"
                                          required
                                          :rules="[rules.required, rules.email]"
                                        ></v-text-field>
                                      </v-flex>
                                      <v-flex xs12 md3>
                                        <v-select
                                          prepend-icon="toc"
                                          :items="['Home', 'Work', 'Vacation', 'Billing']"
                                          v-model="emailSchema.type"
                                          label="Type"
                                        ></v-select>
                                      </v-flex>
                                      <v-flex xs12 md3>
                                        <v-switch
                                          v-model="emailSchema.isDefault"
                                          label="Is Default"
                                        ></v-switch>
                                      </v-flex>
                                    </v-layout>
                                  </v-container>
                                </v-form>
                              </v-card-text>

                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click="close('emailOrg')">Cancel</v-btn>
                                <v-btn color="blue darken-1" flat @click="save('emailOrg')">Save</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-toolbar>

                        <v-data-table
                          :headers="emailHeaders"
                          :items="this.organizationSchema.email"
                          class="elevation-1"
                          hide-actions
                        >
                          <template v-slot:items="props">
                            <td>{{ props.item.email }}</td>
                            <td>{{ props.item.type }}</td>
                            <td class="pt-1">
                              <v-checkbox
                                v-model="props.item.isDefault"
                                :value="props.item.isDefault"
                                disabled
                              ></v-checkbox>
                            </td>
                            <td>
                              <v-icon
                                small
                                class="mr-2"
                                @click="editItem(props.item, 'emailOrg')"
                              >edit</v-icon>
                              <v-icon small @click="deleteItem(props.item, 'emailOrg')">delete</v-icon>
                            </td>
                          </template>
                          <template v-slot:no-data>
                            <div class="text-xs-center">
                              <v-btn
                                small
                                flat
                                color="primary"
                                @click="emailOrgDialog = true"
                              >Add a new email</v-btn>
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
                          <v-dialog v-model="phoneOrgDialog" max-width="650px">
                            <template v-slot:activator="{ on }">
                              <v-btn color="primary" small dark class="mb-2" v-on="on">New phone</v-btn>
                            </template>
                            <v-card>
                              <v-card-title>
                                <span class="headline">{{ phoneFormTitle }}</span>
                              </v-card-title>
                              <v-card-text>
                                <v-form ref="phoneOrg" lazy-validation>
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
                                          prepend-icon="toc"
                                          :items="['Home', 'Work', 'Vacation', 'Billing']"
                                          v-model="phoneSchema.type"
                                          label="Type"
                                        ></v-select>
                                      </v-flex>
                                      <v-flex xs12>
                                        <v-switch
                                          v-model="phoneSchema.isDefault"
                                          label="Is Default"
                                        ></v-switch>
                                      </v-flex>
                                    </v-layout>
                                  </v-container>
                                </v-form>
                              </v-card-text>

                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click="close('phoneOrg')">Cancel</v-btn>
                                <v-btn color="blue darken-1" flat @click="save('phoneOrg')">Save</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-toolbar>
                        <v-data-table
                          :headers="phoneHeaders"
                          :items="organizationSchema.phone"
                          class="elevation-1"
                          hide-actions
                        >
                          <template v-slot:items="props">
                            <td>{{ props.item.country_code }} ({{ props.item.area_number }}) {{ props.item.number }}</td>
                            <td>{{ props.item.type }}</td>
                            <td class="pt-1">
                              <v-checkbox
                                v-model="props.item.isDefault"
                                :value="props.item.isDefault"
                                disabled
                              ></v-checkbox>
                            </td>
                            <td>
                              <v-icon
                                small
                                class="mr-2"
                                @click="editItem(props.item, 'phoneOrg')"
                              >edit</v-icon>
                              <v-icon small @click="deleteItem(props.item, 'phoneOrg')">delete</v-icon>
                            </td>
                          </template>
                          <template v-slot:no-data>
                            <div class="text-xs-center">
                              <v-btn
                                small
                                flat
                                color="primary"
                                @click="phoneOrgDialog = true"
                              >Add a new Phone</v-btn>
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
                          <v-dialog v-model="addressOrgDialog" max-width="650px">
                            <template v-slot:activator="{ on }">
                              <v-btn color="primary" small dark class="mb-2" v-on="on">New address</v-btn>
                            </template>
                            <v-card>
                              <v-card-title>
                                <span class="headline">{{ addressFormTitle }}</span>
                              </v-card-title>
                              <v-card-text>
                                <v-form ref="addressOrg" lazy-validation>
                                  <v-container grid-list-md>
                                    <v-layout wrap>
                                      <v-flex xs12 md6>
                                        <v-select
                                          prepend-icon="toc"
                                          :items="['Home', 'Work', 'Vacation', 'Billing']"
                                          v-model="addressSchema.type"
                                          label="Type"
                                        ></v-select>
                                      </v-flex>
                                      <v-flex xs12 md6>
                                        <v-switch
                                          v-model="addressSchema.isDefault"
                                          label="Is Default"
                                        ></v-switch>
                                      </v-flex>

                                      <v-flex xs12 md6>
                                        <v-text-field
                                          prepend-icon="text_fields"
                                          v-model="addressSchema.line_1"
                                          label="Address"
                                          required
                                          :rules="[rules.required]"
                                        ></v-text-field>
                                      </v-flex>
                                      <v-flex xs12 md6>
                                        <v-text-field
                                          prepend-icon="text_fields"
                                          v-model="addressSchema.line_2"
                                          label="Line 2"
                                          required
                                        ></v-text-field>
                                      </v-flex>

                                      <v-flex xs12 md6>
                                        <v-text-field
                                          prepend-icon="text_fields"
                                          v-model="addressSchema.city"
                                          label="City"
                                          required
                                          :rules="[rules.required]"
                                        ></v-text-field>
                                      </v-flex>
                                      <v-flex xs12 md6>
                                        <v-text-field
                                          prepend-icon="text_fields"
                                          v-model="addressSchema.state"
                                          label="State"
                                          required
                                          :rules="[rules.required]"
                                        ></v-text-field>
                                      </v-flex>

                                      <v-flex xs12 md6>
                                        <v-autocomplete
                                          prepend-icon="toc"
                                          label="Country"
                                          :items="country"
                                          v-model="addressSchema.country"
                                        ></v-autocomplete>
                                      </v-flex>
                                      <v-flex xs12 md6>
                                        <v-text-field
                                          prepend-icon="text_fields"
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
                                <v-btn
                                  color="blue darken-1"
                                  flat
                                  @click="close('addressOrg')"
                                >Cancel</v-btn>
                                <v-btn color="blue darken-1" flat @click="save('addressOrg')">Save</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-toolbar>
                        <v-data-table
                          :headers="addressHeaders"
                          :items="organizationSchema.address"
                          class="elevation-1"
                          hide-actions
                        >
                          <template v-slot:items="props">
                            <td>{{ props.item.line_1 }} {{ props.item.line_2 }} - {{ props.item.city }}/{{ props.item.state }}</td>
                            <td>{{ props.item.type }}</td>
                            <td class="pt-1">
                              <v-checkbox
                                v-model="props.item.isDefault"
                                :value="props.item.isDefault"
                                disabled
                              ></v-checkbox>
                            </td>
                            <td>
                              <v-icon
                                small
                                class="mr-2"
                                @click="editItem(props.item, 'addressOrg')"
                              >edit</v-icon>
                              <v-icon small @click="deleteItem(props.item, 'addressOrg')">delete</v-icon>
                            </td>
                          </template>
                          <template v-slot:no-data>
                            <div class="text-xs-center">
                              <v-btn
                                small
                                flat
                                color="primary"
                                @click="addressOrgDialog = true"
                              >Add a new address</v-btn>
                            </div>
                          </template>
                        </v-data-table>
                      </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                      <v-flex xs12 pt-2>
                        <v-card class="elevation-1">
                          <v-card-text>
                            <v-layout row wrap>
                              <v-flex xs12>
                                <v-toolbar flat color="white" class="pr-0">
                                  <v-toolbar-title>Members</v-toolbar-title>
                                  <v-divider class="mx-2" inset vertical></v-divider>
                                  <v-spacer></v-spacer>
                                  <v-dialog v-model="usersDialog" scrollable max-width="650px">
                                    <template v-slot:activator="{ on }">
                                      <v-btn
                                        color="primary"
                                        small
                                        dark
                                        class="mb-2"
                                        v-on="on"
                                      >New users</v-btn>
                                    </template>
                                    <v-card>
                                      <v-card-title>
                                        <span class="headline">{{ usersFormTitle }}</span>
                                      </v-card-title>
                                      <v-card-text>
                                        <v-form ref="users" lazy-validation>
                                          <v-container grid-list-md id="usersTop">
                                            <v-layout wrap>
                                              <v-flex xs12 md6>
                                                <v-select
                                                  prepend-icon="toc"
                                                  :items="['staff']"
                                                  v-model="user.roles"
                                                  label="System Role"
                                                ></v-select>
                                              </v-flex>
                                              <v-flex xs12 md6>
                                                <v-text-field
                                                  prepend-icon="text_fields"
                                                  v-model="human.ssn"
                                                  label="SSN"
                                                  required
                                                  :rules="[rules.required, rules.ssn_is]"
                                                  mask="social"
                                                  return-masked-value
                                                  :append-icon="SSNShow ? 'visibility' : 'visibility_off'"
                                                  :type="SSNShow ? 'text' : 'password'"
                                                  @click:append="SSNShow = !SSNShow"
                                                ></v-text-field>
                                              </v-flex>
                                              <v-flex xs12 md6>
                                                <v-text-field
                                                  prepend-icon="text_fields"
                                                  v-model="human.first_name"
                                                  label="First Name"
                                                  required
                                                  :rules="[rules.required]"
                                                ></v-text-field>
                                              </v-flex>
                                              <v-flex xs12 md6>
                                                <v-text-field
                                                  prepend-icon="text_fields"
                                                  v-model="human.last_name"
                                                  label="Last Name"
                                                  required
                                                  :rules="[rules.required]"
                                                ></v-text-field>
                                              </v-flex>
                                              <v-flex xs12 md6>
                                                <v-autocomplete
                                                  prepend-icon="fas fa-globe"
                                                  :items="countryItems"
                                                  v-model="human.nationality"
                                                  name="nationality"
                                                  label="Nationality *"
                                                  :rules="[rules.required]"
                                                  clearable
                                                ></v-autocomplete>
                                              </v-flex>
                                              <v-flex xs12 md6>
                                                <v-menu
                                                  v-model="humanPicker"
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
                                                      class="px-3"
                                                      :value="computedBirthDate"
                                                      label="Birthday date"
                                                      prepend-icon="cake"
                                                      readonly
                                                      clearable
                                                      v-on="on"
                                                    ></v-text-field>
                                                  </template>
                                                  <v-date-picker
                                                    v-model="human.birthDate"
                                                    @input="humanPicker = false"
                                                  ></v-date-picker>
                                                </v-menu>
                                              </v-flex>

                                              <v-flex xs12 md6>
                                                <v-select
                                                  prepend-icon="fas fa-venus-mars"
                                                  :items="genderTypeItems"
                                                  v-model="human.gender"
                                                  label="Gender * "
                                                  name="gender"
                                                  width="100%"
                                                  :rules="[rules.required]"
                                                ></v-select>
                                              </v-flex>
                                              <v-flex xs12 md6>
                                                <v-select
                                                  prepend-icon="people_outline"
                                                  :items="sexualPrefTypeItems"
                                                  v-model="human.sexual_orientation"
                                                  label="Sexual Preference *"
                                                  width="100%"
                                                  :rules="[rules.required]"
                                                ></v-select>
                                              </v-flex>
                                            </v-layout>
                                          </v-container>
                                        </v-form>

                                        <v-layout row wrap>
                                          <v-flex xs12>
                                            <v-toolbar flat color="white" class="pr-0">
                                              <v-toolbar-title>Email</v-toolbar-title>
                                              <v-divider class="mx-2" inset vertical></v-divider>
                                              <v-spacer></v-spacer>
                                              <v-dialog v-model="emailDialog" max-width="650px">
                                                <template v-slot:activator="{ on }">
                                                  <v-btn
                                                    color="primary"
                                                    small
                                                    dark
                                                    class="mb-2"
                                                    v-on="on"
                                                  >New Email</v-btn>
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
                                                              prepend-icon="mail"
                                                              v-model="emailSchema.email"
                                                              label="Email"
                                                              required
                                                              :rules="[rules.required, rules.email]"
                                                            ></v-text-field>
                                                          </v-flex>
                                                          <v-flex xs12 md3>
                                                            <v-select
                                                              prepend-icon="toc"
                                                              :items="['Home', 'Work', 'Vacation', 'Billing']"
                                                              v-model="emailSchema.type"
                                                              label="Type"
                                                            ></v-select>
                                                          </v-flex>
                                                          <v-flex xs12 md3>
                                                            <v-switch
                                                              v-model="emailSchema.isDefault"
                                                              label="Is Default"
                                                            ></v-switch>
                                                          </v-flex>
                                                        </v-layout>
                                                      </v-container>
                                                    </v-form>
                                                  </v-card-text>

                                                  <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                      color="blue darken-1"
                                                      flat
                                                      @click="close('email')"
                                                    >Cancel</v-btn>
                                                    <v-btn
                                                      color="blue darken-1"
                                                      flat
                                                      @click="save('email')"
                                                    >Save</v-btn>
                                                  </v-card-actions>
                                                </v-card>
                                              </v-dialog>
                                            </v-toolbar>

                                            <v-data-table
                                              :headers="emailHeaders"
                                              :items="emails"
                                              class="elevation-1"
                                              hide-actions
                                            >
                                              <template v-slot:items="props">
                                                <td>{{ props.item.email }}</td>
                                                <td>{{ props.item.type }}</td>
                                                <td class="pt-1">
                                                  <v-checkbox
                                                    v-model="props.item.isDefault"
                                                    :value="props.item.isDefault"
                                                    disabled
                                                  ></v-checkbox>
                                                </td>
                                                <td>
                                                  <v-icon
                                                    small
                                                    class="mr-2"
                                                    @click="editItem(props.item, 'email')"
                                                  >edit</v-icon>
                                                  <v-icon
                                                    small
                                                    @click="deleteItem(props.item, 'email')"
                                                  >delete</v-icon>
                                                </td>
                                              </template>
                                              <template v-slot:no-data>
                                                <div class="text-xs-center">
                                                  <v-btn
                                                    small
                                                    flat
                                                    color="primary"
                                                    @click="emailDialog = true"
                                                  >Add a new email</v-btn>
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
                                                  <v-btn
                                                    color="primary"
                                                    small
                                                    dark
                                                    class="mb-2"
                                                    v-on="on"
                                                  >New phone</v-btn>
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
                                                                <template
                                                                  v-if="typeof data.item !== 'object'"
                                                                >
                                                                  <v-list-tile-content
                                                                    v-text="data.item"
                                                                  ></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                  <v-list-tile-avatar size="26">
                                                                    <img :src="data.item.flag" />
                                                                  </v-list-tile-avatar>
                                                                  <v-list-tile-content>
                                                                    <v-list-tile-title
                                                                      v-html="data.item.name"
                                                                    ></v-list-tile-title>
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
                                                              prepend-icon="toc"
                                                              :items="['Home', 'Work', 'Vacation', 'Billing']"
                                                              v-model="phoneSchema.type"
                                                              label="Type"
                                                            ></v-select>
                                                          </v-flex>
                                                          <v-flex xs12>
                                                            <v-switch
                                                              v-model="phoneSchema.isDefault"
                                                              label="Is Default"
                                                            ></v-switch>
                                                          </v-flex>
                                                        </v-layout>
                                                      </v-container>
                                                    </v-form>
                                                  </v-card-text>

                                                  <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                      color="blue darken-1"
                                                      flat
                                                      @click="close('phone')"
                                                    >Cancel</v-btn>
                                                    <v-btn
                                                      color="blue darken-1"
                                                      flat
                                                      @click="save('phone')"
                                                    >Save</v-btn>
                                                  </v-card-actions>
                                                </v-card>
                                              </v-dialog>
                                            </v-toolbar>
                                            <v-data-table
                                              :headers="phoneHeaders"
                                              :items="phones"
                                              class="elevation-1"
                                              hide-actions
                                            >
                                              <template v-slot:items="props">
                                                <td>{{ props.item.country_code }} ({{ props.item.area_number }}) {{ props.item.number }}</td>
                                                <td>{{ props.item.type }}</td>
                                                <td class="pt-1">
                                                  <v-checkbox
                                                    v-model="props.item.isDefault"
                                                    :value="props.item.isDefault"
                                                    disabled
                                                  ></v-checkbox>
                                                </td>
                                                <td>
                                                  <v-icon
                                                    small
                                                    class="mr-2"
                                                    @click="editItem(props.item, 'phone')"
                                                  >edit</v-icon>
                                                  <v-icon
                                                    small
                                                    @click="deleteItem(props.item, 'phone')"
                                                  >delete</v-icon>
                                                </td>
                                              </template>
                                              <template v-slot:no-data>
                                                <div class="text-xs-center">
                                                  <v-btn
                                                    small
                                                    flat
                                                    color="primary"
                                                    @click="phoneDialog = true"
                                                  >Add a new Phone</v-btn>
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
                                                  <v-btn
                                                    color="primary"
                                                    small
                                                    dark
                                                    class="mb-2"
                                                    v-on="on"
                                                  >New address</v-btn>
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
                                                              prepend-icon="toc"
                                                              :items="['Home', 'Work', 'Vacation', 'Billing']"
                                                              v-model="addressSchema.type"
                                                              label="Type"
                                                            ></v-select>
                                                          </v-flex>
                                                          <v-flex xs12 md6>
                                                            <v-switch
                                                              v-model="addressSchema.isDefault"
                                                              label="Is Default"
                                                            ></v-switch>
                                                          </v-flex>

                                                          <v-flex xs12 md6>
                                                            <v-text-field
                                                              prepend-icon="text_fields"
                                                              v-model="addressSchema.line_1"
                                                              label="Address"
                                                              required
                                                              :rules="[rules.required]"
                                                            ></v-text-field>
                                                          </v-flex>
                                                          <v-flex xs12 md6>
                                                            <v-text-field
                                                              prepend-icon="text_fields"
                                                              v-model="addressSchema.line_2"
                                                              label="Line 2"
                                                              required
                                                            ></v-text-field>
                                                          </v-flex>

                                                          <v-flex xs12 md6>
                                                            <v-text-field
                                                              prepend-icon="text_fields"
                                                              v-model="addressSchema.city"
                                                              label="City"
                                                              required
                                                              :rules="[rules.required]"
                                                            ></v-text-field>
                                                          </v-flex>
                                                          <v-flex xs12 md6>
                                                            <v-text-field
                                                              prepend-icon="text_fields"
                                                              v-model="addressSchema.state"
                                                              label="State"
                                                              required
                                                              :rules="[rules.required]"
                                                            ></v-text-field>
                                                          </v-flex>

                                                          <v-flex xs12 md6>
                                                            <v-autocomplete
                                                              prepend-icon="toc"
                                                              label="Country"
                                                              :items="country"
                                                              v-model="addressSchema.country"
                                                            ></v-autocomplete>
                                                          </v-flex>
                                                          <v-flex xs12 md6>
                                                            <v-text-field
                                                              prepend-icon="text_fields"
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
                                                    <v-btn
                                                      color="blue darken-1"
                                                      flat
                                                      @click="close('address')"
                                                    >Cancel</v-btn>
                                                    <v-btn
                                                      color="blue darken-1"
                                                      flat
                                                      @click="save('address')"
                                                    >Save</v-btn>
                                                  </v-card-actions>
                                                </v-card>
                                              </v-dialog>
                                            </v-toolbar>
                                            <v-data-table
                                              :headers="addressHeaders"
                                              :items="addresss"
                                              class="elevation-1"
                                              hide-actions
                                            >
                                              <template v-slot:items="props">
                                                <td>{{ props.item.line_1 }} {{ props.item.line_2 }} - {{ props.item.city }}/{{ props.item.state }}</td>
                                                <td>{{ props.item.type }}</td>
                                                <td class="pt-1">
                                                  <v-checkbox
                                                    v-model="props.item.isDefault"
                                                    :value="props.item.isDefault"
                                                    disabled
                                                  ></v-checkbox>
                                                </td>
                                                <td>
                                                  <v-icon
                                                    small
                                                    class="mr-2"
                                                    @click="editItem(props.item, 'address')"
                                                  >edit</v-icon>
                                                  <v-icon
                                                    small
                                                    @click="deleteItem(props.item, 'address')"
                                                  >delete</v-icon>
                                                </td>
                                              </template>
                                              <template v-slot:no-data>
                                                <div class="text-xs-center">
                                                  <v-btn
                                                    small
                                                    flat
                                                    color="primary"
                                                    @click="addressDialog = true"
                                                  >Add a new address</v-btn>
                                                </div>
                                              </template>
                                            </v-data-table>
                                          </v-flex>
                                        </v-layout>

                                        <v-layout row wrap py-3>
                                          <v-flex xs6>
                                            <v-toolbar flat color="white" class="pr-0">
                                              <v-toolbar-title>Member Of</v-toolbar-title>
                                              <v-divider class="mx-2" inset vertical></v-divider>
                                              <v-spacer></v-spacer>
                                            </v-toolbar>

                                            <v-data-table
                                              v-model="selected"
                                              :headers="organizationHeaders"
                                              :items="organizationItem"
                                              item-key="name"
                                              hide-actions
                                              class="elevation-1"
                                            >
                                              <template v-slot:items="props">
                                                <tr
                                                  :active="props.selected"
                                                  @click="rowClick(props.item)"
                                                >
                                                  <td>{{ props.item.name }}</td>
                                                </tr>
                                              </template>
                                            </v-data-table>
                                          </v-flex>

                                          <v-flex xs6>
                                            <v-toolbar flat color="white" class="pr-0">
                                              <v-toolbar-title>Role into Organization</v-toolbar-title>
                                              <v-divider class="mx-2" inset vertical></v-divider>
                                              <v-spacer></v-spacer>
                                            </v-toolbar>
                                            <v-select
                                              prepend-icon="toc"
                                              class="px-3"
                                              :items="roleItems"
                                              v-model="organizationHumanRelationSchema.role"
                                              label="Select a role"
                                              item-value="_id"
                                              item-text="label"
                                            ></v-select>

                                            <v-menu
                                              v-model="organizationPicker"
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
                                                  class="px-3"
                                                  :value="computedOrganizationStartDate"
                                                  label="Start Date"
                                                  prepend-icon="event"
                                                  readonly
                                                  clearable
                                                  v-on="on"
                                                ></v-text-field>
                                              </template>
                                              <v-date-picker
                                                v-model="organizationHumanRelationSchema.startDate"
                                                @input="organizationPicker = false"
                                              ></v-date-picker>
                                            </v-menu>
                                          </v-flex>
                                        </v-layout>
                                        <v-layout row wrap py-3>
                                          <v-flex xs12 elevation-1>
                                            <v-toolbar flat color="white" class="pr-0">
                                              <v-toolbar-title>Portal Access</v-toolbar-title>
                                              <v-divider class="mx-2" inset vertical></v-divider>
                                              <v-spacer></v-spacer>
                                            </v-toolbar>

                                            <v-flex xs7 mx-4>
                                              <v-text-field
                                                prepend-icon="person"
                                                v-model="user.username"
                                                label="Username *"
                                                hint="Defined by default email address."
                                                persistent-hint
                                                counter
                                                maxlength="255"
                                                :rules="[rules.required, rules.email]"
                                                disabled
                                              ></v-text-field>
                                            </v-flex>
                                            <v-flex xs7 mx-4 mb-3>
                                              <v-text-field
                                                prepend-icon="lock"
                                                v-model="user.password"
                                                label="Password *"
                                                hint="The User's password"
                                                persistent-hint
                                                counter
                                                maxlength="12"
                                                minlength="4"
                                                :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
                                                :type="passwordShow ? 'text' : 'password'"
                                                @click:append="passwordShow = !passwordShow"
                                                :rules="[rules.required]"
                                              ></v-text-field>
                                            </v-flex>
                                          </v-flex>
                                        </v-layout>
                                      </v-card-text>

                                      <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                          color="blue darken-1"
                                          flat
                                          @click="close('users')"
                                        >Cancel</v-btn>
                                        <v-btn
                                          color="blue darken-1"
                                          flat
                                          @click="save('users')"
                                        >Save</v-btn>
                                      </v-card-actions>
                                    </v-card>
                                  </v-dialog>
                                </v-toolbar>
                                <v-data-table
                                  :headers="usersHeaders"
                                  :items="members"
                                  class="elevation-1"
                                  hide-actions
                                >
                                  <template v-slot:items="props">
                                    <td>{{ props.item.first_name }}</td>
                                    <td>{{ props.item.user ? props.item.user.username : '' }}</td>
                                    <td>{{ props.item.user ? props.item.user.roles : '' }}</td>
                                    <td>
                                      <v-icon
                                        small
                                        class="mr-2"
                                        @click="editItem(props.item, 'users')"
                                      >edit</v-icon>
                                      <v-icon small @click="deleteItem(props.item, 'users')">delete</v-icon>
                                    </td>
                                  </template>
                                  <template v-slot:no-data>
                                    <div class="text-xs-center">
                                      <v-btn
                                        small
                                        flat
                                        color="primary"
                                        @click="usersDialog = true"
                                      >Add a new users</v-btn>
                                    </div>
                                  </template>
                                </v-data-table>
                              </v-flex>
                            </v-layout>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close('organization')">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click="save('organization')">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
            <v-data-table
              :headers="outOrganizationHeaders"
              :items="organizations"
              class="elevation-1"
              hide-actions
            >
              <template v-slot:items="props">
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.feid_number }}</td>
                <td>{{ props.item.phone.length > 0 ? props.item.phone[0].number : '' }}</td>
                <td>{{ props.item.email.length > 0 ? props.item.email[0].email : '' }}</td>
                <td>
                  <v-icon small class="mr-2" @click="editItem(props.item, 'organization')">edit</v-icon>
                  <v-icon small @click="deleteItem(props.item, 'organization')">delete</v-icon>
                </td>
              </template>
              <template v-slot:no-data>
                <div class="text-xs-center">
                  <v-btn
                    small
                    flat
                    color="primary"
                    @click="organizationDialog = true"
                  >Add a new Organization</v-btn>
                </div>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>

    <v-btn flat @click="bus.$emit('previewStep')">Preview</v-btn>
    <v-btn color="primary" @click="bus.$emit('nextStep', 7)">Continue</v-btn>
    <v-btn flat>Cancel</v-btn>
  </v-container>
</template>
<script>
import outsideOrganization from './outsideOrganization.vm.js';
export default outsideOrganization;
</script>
<style scoped lang="css">
</style>
