<template>
  <div id="ClientsAdd">
    <v-container grid-list-xl fluid mx-0 px-0>
      <v-layout row wrap>
        <v-flex xs12>
            <v-card>
                <v-stepper v-model="step" vertical class="elevation-0">
                    <v-stepper-step :complete="step > 1" step="1">
                        Create a new Contact
                        <small>Choose person or organization</small>
                    </v-stepper-step>

                    <v-stepper-content step="1">
                        <v-card class="ma-3 elevation-0">
                            <h4>Choosen a contact type</h4>

                            <v-radio-group class="pl-3" v-model="contactType" row>
                                <v-radio value="Person">
                                    <template v-slot:label>
                                    <div><v-icon>person</v-icon> Person</div>
                                    </template>
                                </v-radio>
                                <v-radio value="Family">
                                    <template v-slot:label>
                                    <div><v-icon>group</v-icon> Family</div>
                                    </template>
                                </v-radio><!-- 
                                <v-radio value="User">
                                    <template v-slot:label>
                                    <div><v-icon small>fas fa-user-cog</v-icon> User</div>
                                    </template>
                                </v-radio> -->
                                <v-radio value="Organization">
                                    <template v-slot:label>
                                    <div><v-icon>business</v-icon> Organization</div>
                                    </template>
                                </v-radio>
                            </v-radio-group>

                            <div v-show="contactType === 'Person'">
                                <v-flex xs12 md6>
                                    <v-select
                                      :items="userRoleItems"
                                      v-model="addUserRoles[1]"
                                      hint="The Person role"
                                      label="Person role *"
                                      clearable
                                      chips
                                      :rules="[rules.required]"
                                      width="100px"
                                    ></v-select>
                                </v-flex>
                            </div>

                            <div v-show="contactType === 'Family'">
                              <h4>How many people in the family?</h4>
                              <v-flex xs6>
                                  <v-slider
                                      width="300"
                                      v-model="personQnt"
                                      min="1"
                                      max="10"
                                      thumb-label="always"
                                      :thumb-size="24"
                                      ticks
                                      tick-size="2"
                                      class="pt-3"
                                      xs6
                                  >
                                      <template v-slot:prepend>
                                          <v-icon
                                              @click="decrement"
                                          >
                                              remove
                                          </v-icon>
                                          </template>

                                          <template v-slot:append>
                                          <v-icon
                                              @click="increment"
                                          >
                                              add
                                          </v-icon>
                                      </template>
                                  </v-slider>
                              </v-flex>
                            </div>
                          </v-card>
                        <v-btn color="primary" :disabled="!contactType || (contactType === 'Person' && !addUserRoles[1])" @click="step = step + 1">Continue</v-btn>
                        <v-btn flat @click="bus.$emit('displayWhat', 'dashboard')">Cancel</v-btn>
                    </v-stepper-content>

                    <template v-if="contactType === 'User'">
                        <v-stepper-step :complete="step > 2" step="2">Create a System Account</v-stepper-step>

                        <v-stepper-content step="2">
                            <v-card class="ma-3 elevation-0">
                                <v-card-text>
                                    <v-container grid-list-md py-0>
                                        <v-layout wrap>
                                        <v-flex xs12 md7 py-0>
                                            <v-text-field 
                                                v-model="addUser.username" 
                                                label="Username *" 
                                                hint="The User's username. Must be an e-mail address." 
                                                persistent-hint
                                                counter
                                                maxlength="255"
                                                :rules="[rules.required, rules.email]"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md7 py-0>
                                            <v-text-field 
                                                v-model="addUser.password" 
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
                                        <v-flex xs12 md7 py-0>
                                            <v-select
                                                :items="userRoleItems"
                                                v-model="addUser.roles"
                                                hint="The User's role"
                                                label="User's role *"
                                                persistent-hint
                                                clearable
                                                attach
                                                chips
                                                :rules="[rules.required]"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 md7 py-0>
                                            <v-autocomplete
                                                v-model="addUser.human"
                                                hint="Person associated to this System Account"
                                                :items="userItems"
                                                clearable
                                                label="Account Owner"
                                                persistent-hint
                                                attach
                                                chips
                                                item-text="username"
                                                item-value="id"
                                                >
                                            </v-autocomplete>
                                        </v-flex>
                                        <v-flex xs12 md7 py-0>
                                            <v-switch v-model="addUser.portal_access" label="Portal Access"></v-switch>
                                        </v-flex>
                                        <v-flex xs12 md7 py-0>
                                            <v-switch v-model="addUser.changePasswordNextLogin" label="Force user to change password on next login"></v-switch>
                                        </v-flex>
                                        <v-flex xs12 md7 py-0>
                                            <v-switch v-model="addUser.active" label="Active"></v-switch>
                                        </v-flex>
                                        <v-flex xs12 md7 py-0>
                                            <v-select
                                                :items="timezoneItems"
                                                v-model="addUser.timezone"
                                                hint="Timezone"
                                                label="User's timezone"
                                                persistent-hint
                                                clearable
                                                attach
                                                chips
                                                :rules="[rules.required]"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 md7 py-0>
                                            <v-select
                                                :items="currencycodeItems"
                                                v-model="addUser.currency_code"
                                                hint="User preferred currency code"
                                                label="Currency Code"
                                                persistent-hint
                                                clearable
                                                attach
                                                chips
                                                :rules="[rules.required]"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 md7 py-0>
                                            <v-text-field 
                                                v-model="addUser.currency_symbol" 
                                                label="Currency symbol" 
                                                hint="User preferred currency symbol" 
                                                persistent-hint
                                                counter
                                                maxlength="255"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 md7 py-0>
                                            <v-select
                                                :items="currencydecimalItems"
                                                v-model="addUser.currency_decimal"
                                                hint="User preferred currency decimal"
                                                label="Currency Decimal"
                                                persistent-hint
                                                clearable
                                                attach
                                                chips
                                                :rules="[rules.required]"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 md7 py-0>
                                            <v-select
                                                :items="currencydecimalItems"
                                                v-model="addUser.currency_thousands"
                                                hint="User preferred currency thousands"
                                                label="Currency Thousands"
                                                persistent-hint
                                                clearable
                                                attach
                                                chips
                                                :rules="[rules.required]"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 md7 py-0>
                                            <v-select
                                                :items="languageItems"
                                                v-model="addUser.language"
                                                hint="User preferred Language"
                                                label="Language"
                                                persistent-hint
                                                clearable
                                                attach
                                                chips
                                                :rules="[rules.required]"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 md7 py-0>
                                            <v-select
                                                :items="portalColorItems"
                                                v-model="addUser.portal_color"
                                                hint="User preferred portal color"
                                                label="portal color"
                                                persistent-hint
                                                clearable
                                                attach
                                                chips
                                                :rules="[rules.required]"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 md7 py-0>
                                            <v-switch v-model="addUser.portal_isDark" label="Is Portal Dark?"></v-switch>
                                        </v-flex>
                                        <v-flex xs12 md7 py-0>
                                            <small>*indicates required field</small>
                                        </v-flex>
                                        </v-layout>
                                    </v-container>
                                    </v-card-text>
                            </v-card>
                            <v-btn flat @click="step = step - 1">Previous</v-btn>
                            <v-btn flat @click="bus.$emit('displayWhat', 'dashboard')">Cancel</v-btn>
                            <v-btn color="blue darken-1" flat @click="createNewUser">Create</v-btn>
                            <v-btn color="primary" @click="createNewUser('addPerson')">Save and create a person</v-btn>
                        </v-stepper-content>
                    </template>

                    <template v-else-if="contactType === 'Organization'">
                        <v-stepper-step :complete="step > 2" step="2">Create a Organization</v-stepper-step>

                        <v-stepper-content step="2">
                            <v-card class="ma-3 elevation-0">
                                <v-card-text>
                                    <v-container grid-list-md py-0>
                                        <v-layout row wrap>
                                            <v-flex xs12 md8 mx-0 id="organization">
                                                <v-form ref="organization">
                                                    <v-layout>
                                                        <v-flex xs1 mr-3>
                                                            <v-avatar
                                                                color="grey lighten-2"
                                                            >
                                                            <v-icon dark large>account_circle</v-icon>
                                                            </v-avatar>
                                                        </v-flex>
                                                        <v-flex xs11 md11 py-0>
                                                            <v-text-field
                                                                v-model="addOrganization.name"
                                                                label="Name *"
                                                                hint="Organization Name" 
                                                                persistent-hint
                                                                :rules="[rules.required]"
                                                            ></v-text-field>
                                                        </v-flex>
                                                    </v-layout>
                                                    <v-layout>
                                                        <v-flex xs12 py-0>
                                                            <v-select
                                                                :items="organizationTypeItems"
                                                                v-model="addOrganization.type"
                                                                label="Type"
                                                                hint="Organization type" 
                                                                persistent-hint
                                                                clearable
                                                                attach
                                                                chips
                                                                :rules="[rules.required]"
                                                                prepend-icon="toc"
                                                                item-text="type"
                                                                item-value="id"
                                                            ></v-select>
                                                        </v-flex>
                                                    </v-layout>
                                                    <v-layout>
                                                        <v-flex xs11 md11 py-0>
                                                            <v-text-field
                                                                v-model="addOrganization.feid_number"
                                                                label="FEID"
                                                                hint="FEID Number" 
                                                                persistent-hint
                                                                mask="##-#######"
                                                                prepend-icon="text_fields"
                                                            ></v-text-field>
                                                        </v-flex>
                                                    </v-layout>
                                                    <v-layout>
                                                        <v-flex xs12 py-0>
                                                            <v-text-field
                                                              v-model="addOrganization.referral_source"
                                                              label="Referral"
                                                              hint="Referral Source" 
                                                              persistent-hint
                                                              prepend-icon="text_fields"
                                                            ></v-text-field>
                                                        </v-flex>
                                                    </v-layout>
                                                    <v-layout>
                                                      <v-flex xs12 py-0>
                                                        <v-text-field
                                                          v-model="addOrganization.license_number"
                                                          label="License"
                                                          hint="License Number" 
                                                          persistent-hint
                                                          prepend-icon="text_fields"
                                                        ></v-text-field>
                                                      </v-flex>
                                                    </v-layout>
                                                    <v-layout>
                                                        <v-flex xs12 py-0>
                                                            <v-menu
                                                                :v-model="menuStartDateNewCase"
                                                                :close-on-content-click="false"
                                                                :nudge-right="40"
                                                                lazy
                                                                transition="scale-transition"
                                                                offset-y
                                                                full-width
                                                                min-width="290px"
                                                                :rules="[rules.required]"
                                                            >
                                                                <template v-slot:activator="{ on }">
                                                                    <v-text-field
                                                                        v-model="addOrganization.license_expire_date"
                                                                        label="Expire Date"
                                                                        hint="License Expire Date" 
                                                                        persistent-hint
                                                                        prepend-icon="date_range"
                                                                        readonly
                                                                        clearable
                                                                        v-on="on"
                                                                    ></v-text-field>
                                                                </template>
                                                                <v-date-picker
                                                                    v-model="addOrganization.license_expire_date"
                                                                ></v-date-picker>
                                                            </v-menu>
                                                        </v-flex>
                                                    </v-layout>
                                                    <v-layout>
                                                        <v-flex xs12 py-0>
                                                            <v-select
                                                                :items="organizationServicesItems"
                                                                v-model="addOrganization.services"
                                                                label="Services"
                                                                hint="Organization services"
                                                                persistent-hint
                                                                multiple
                                                                clearable
                                                                attach
                                                                chips
                                                                item-text="service"
                                                                item-value="id"
                                                                prepend-icon="toc"
                                                                :rules="[rules.required]"
                                                            ></v-select>
                                                        </v-flex>
                                                    </v-layout>
                                                    <template v-for="e in emailQntOrg">
                                                        <v-layout :key="e + '-organization_mail_input'">
                                                            <v-flex xs18 py-0>
                                                              <v-text-field
                                                                  v-model="email[e]"
                                                                  ref="mail"
                                                                  prepend-icon="email"
                                                                  label="Email *"
                                                                  :rules="[rules.required, rules.email]"
                                                                  :success="successEmail[e] ? successEmail[e] : false"
                                                                  :success-messages="successEmailMsg[e]"
                                                                  :error="errorEmail[e]"
                                                                  :error-messages="errorEmailMsg[e]"
                                                                  @input="blurEmail(email[e], e)"
                                                              ></v-text-field>
                                                            </v-flex>
                                                            <v-flex xs4 py-0>
                                                                <v-select
                                                                    ref="mail"
                                                                    :items="phoneMailTypeItems"
                                                                    v-model="emailType[e]"
                                                                    label="Type *"
                                                                >
                                                                    <template v-slot:append-outer>
                                                                        <v-tooltip
                                                                            bottom
                                                                        >
                                                                            <template v-slot:activator="{ on }">
                                                                                <v-btn flat icon @click="e === 1 ? addEmail(null, e) : delEmail(null) ">
                                                                                    <v-icon v-on="on">{{ e === 1 ? 'add' : 'delete' }}</v-icon>
                                                                                </v-btn>
                                                                            </template>
                                                                            {{ e === 1 ? 'Add Email' : 'Delete Email' }}
                                                                        </v-tooltip>
                                                                    </template>
                                                                </v-select>
                                                            </v-flex>
                                                        </v-layout>
                                                    </template>
                                                    
                                                    <template v-for="(p) in phoneQntOrg">
                                                        <v-layout :key="p + '-organization_phone_input'">
                                                            
                                                            <v-flex xs3 py-0>
                                                                <v-autocomplete
                                                                  ref="phone"
                                                                  v-model="phoneCC[p]"
                                                                  prepend-icon="phone"
                                                                  label="Country"
                                                                  :items="countrys"
                                                                  item-text="name"
                                                                  item-value="callingCode"
                                                                  clearable
                                                                  :rules="[rules.required]"
                                                                >
                                                                  <template v-slot:selection="data">
                                                                    <v-avatar size="16" class="pr-1">
                                                                        <img :src="data.item.flag">
                                                                    </v-avatar> {{ data.item.callingCode }}
                                                                  </template>
                                                                  <template v-slot:item="data">
                                                                    <template v-if="typeof data.item !== 'object'">
                                                                      <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                    </template>
                                                                    <template v-else>
                                                                      <v-list-tile-avatar size="26">
                                                                        <img :src="data.item.flag">
                                                                      </v-list-tile-avatar>
                                                                      <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                                        <v-list-tile-sub-title v-html="'Calling Code: ' + data.item.callingCode"></v-list-tile-sub-title>
                                                                      </v-list-tile-content>
                                                                    </template>
                                                                  </template>
                                                                </v-autocomplete>
                                                            </v-flex>
                                                            <v-flex xs2 py-0>
                                                                <v-text-field
                                                                    ref="phone"
                                                                    v-model="phoneA[p]"
                                                                    label="Area"
                                                                    :rules="[rules.required]"
                                                                ></v-text-field>
                                                            </v-flex>
                                                            <v-flex xs3 py-0>
                                                                <v-text-field
                                                                    ref="phone"
                                                                    v-model="phone[p]"
                                                                    label="Phone"
                                                                    :rules="[rules.required]"
                                                                ></v-text-field>
                                                            </v-flex>
                                                            <v-flex xs4 py-0>
                                                                <v-select
                                                                    ref="phone"
                                                                    :items="phoneMailTypeItems"
                                                                    v-model="phoneType[p]"
                                                                    label="Type"
                                                                >
                                                                    <template v-slot:append-outer>
                                                                        <v-tooltip
                                                                            bottom
                                                                        >
                                                                            <template v-slot:activator="{ on }">
                                                                                <v-btn flat icon small @click="p === 1 ? addPhone() : delPhone() ">
                                                                                    <v-icon v-on="on">{{ p === 1 ? 'add' : 'delete' }}</v-icon>
                                                                                </v-btn>
                                                                            </template>
                                                                            {{ p === 1 ? 'Add Phone' : 'Delete Phone' }}
                                                                        </v-tooltip>
                                                                    </template>
                                                                </v-select>
                                                            </v-flex>
                                                        </v-layout>
                                                    </template>

                                                    
                                                   <!--  <template v-for="e in fileQnt">
                                                        <v-layout :key="e + '-fileinput'">
                                                            <v-flex xs18 py-0>
                                                                <v-text-field
                                                                    v-model="organizationFile[e]"
                                                                    prepend-icon="insert_drive_file"
                                                                    label="Files"
                                                                    hint="File Name"
                                                                    persistent-hint
                                                                >
                                                                <template v-slot:append-outer>
                                                                        <v-tooltip
                                                                            bottom
                                                                        >
                                                                            <template v-slot:activator="{ on }">
                                                                                <v-btn flat icon @click="e === 1 ? addFile() : delFile() ">
                                                                                    <v-icon v-on="on">{{ e === 1 ? 'add' : 'delete' }}</v-icon>
                                                                                </v-btn>
                                                                            </template>
                                                                            {{ e === 1 ? 'Add File' : 'Delete File' }}
                                                                        </v-tooltip>
                                                                    </template>
                                                                </v-text-field>
                                                            </v-flex>

                                                        </v-layout>
                                                    </template> -->

                                                    <v-layout >
                                                        <v-flex xs12 py-0>
                                                            <v-switch label="ADDRESS" v-model="showAddress"></v-switch>
                                                        </v-flex>
                                                    </v-layout>
                                                    <template v-if="showAddress === true">
                                                        <v-layout>
                                                            <v-flex xs12 py-0>
                                                                <v-select
                                                                    prepend-icon="toc"
                                                                    :items="phoneMailTypeItems"
                                                                    v-model="organizationAddress.type"
                                                                    label="Type *"
                                                                    hint="Address Type."
                                                                    persistent-hint
                                                                    :rules="[rules.required]"
                                                                >
                                                                </v-select>
                                                            </v-flex>
                                                        </v-layout>
                                                        
                                                        <v-layout>
                                                            <v-flex xs12 py-0>
                                                                <v-text-field
                                                                    v-model="organizationAddress.line_1"
                                                                    label="Address Line 1 *"
                                                                    hint="Address Line 1" 
                                                                    persistent-hint
                                                                    prepend-icon="text_fields"
                                                                    :rules="[rules.required]"
                                                                ></v-text-field>
                                                            </v-flex>
                                                        </v-layout>
                                                        
                                                        <v-layout>
                                                            <v-flex xs12 py-0>
                                                                <v-text-field
                                                                    v-model="organizationAddress.line_2"
                                                                    label="Address Line 2"
                                                                    hint="Address Line 2" 
                                                                    persistent-hint
                                                                    prepend-icon="text_fields"
                                                                ></v-text-field>
                                                            </v-flex>
                                                        </v-layout>
                                                        
                                                        <v-layout>
                                                            <v-flex xs6 py-0>
                                                                <v-text-field
                                                                    v-model="organizationAddress.city"
                                                                    label="City"
                                                                    hint="City Name" 
                                                                    persistent-hint
                                                                    prepend-icon="text_fields"
                                                                    :rules="[rules.required]"
                                                                ></v-text-field>
                                                            </v-flex>
                                                            <v-flex xs6 py-0>
                                                                <v-text-field
                                                                    v-model="organizationAddress.state"
                                                                    label="State"
                                                                    hint="State Name" 
                                                                    persistent-hint
                                                                    prepend-icon="text_fields"
                                                                    :rules="[rules.required]"
                                                                ></v-text-field>
                                                            </v-flex>
                                                        </v-layout>
                                                        
                                                        <v-layout>
                                                            <v-flex xs6 py-0>
                                                              <v-autocomplete
                                                                  prepend-icon="text_fields"
                                                                  :items="countryItems"
                                                                  v-model="organizationAddress.country"
                                                                  label="Country"
                                                                  hint="Country Name" 
                                                                  persistent-hint
                                                                  :rules="[rules.required]"
                                                                  clearable
                                                              ></v-autocomplete>
                                                            </v-flex>
                                                            <v-flex xs6 py-0>
                                                                <v-text-field
                                                                    v-model="organizationAddress.zip"
                                                                    label="Zip"
                                                                    hint="Zip Name" 
                                                                    persistent-hint
                                                                    prepend-icon="text_fields"
                                                                    :rules="[rules.required]"
                                                                ></v-text-field>
                                                            </v-flex>
                                                        </v-layout>
                                                    
                                                    </template>

                                                    <v-layout >
                                                        <v-flex xs12 py-0>
                                                            <v-switch label="PEOPLE" v-model="showPeople"></v-switch>
                                                        </v-flex>
                                                    </v-layout>
                                                    <template v-if="showPeople === true">
                                                        <v-layout>
                                                            <v-flex xs12 py-0>
                                                                <v-autocomplete
                                                                    v-model="organizationHuman_"
                                                                    :items="humanItems"
                                                                    prepend-icon="toc"
                                                                    chips
                                                                    clearable
                                                                    label="People *" 
                                                                    hint="People"
                                                                    persistent-hint
                                                                    item-text="name"
                                                                    item-value="_id"
                                                                    :rules="[rules.required]"
                                                                >
                                                                    <template v-slot:selection="data">
                                                                        <v-chip
                                                                        :selected="data.selected"
                                                                        small
                                                                        class="chip--select-multi"
                                                                        >
                                                                        {{ data.item.name }}
                                                                        </v-chip>
                                                                    </template>
                                                                    <template v-slot:item="data">
                                                                        <template v-if="typeof data.item !== 'object'">
                                                                            <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                        </template>
                                                                        <template v-else>
                                                                            <v-list-tile-content>
                                                                                <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                                            </v-list-tile-content>
                                                                        </template>
                                                                    </template>
                                                                </v-autocomplete>
                                                            </v-flex>
                                                        </v-layout>
                                                        <v-layout>
                                                            <v-flex xs12 py-0>
                                                                <v-autocomplete
                                                                    v-model="organizationRoleSelected_"
                                                                    :items="organizationRoleItems"
                                                                    prepend-icon="toc"
                                                                    chips
                                                                    clearable
                                                                    label="Role *" 
                                                                    hint="Associated Role ID."
                                                                    persistent-hint
                                                                    item-text="role"
                                                                    item-value="_id"
                                                                    :rules="[rules.required]"
                                                                >
                                                                    <template v-slot:selection="data">
                                                                        <v-chip
                                                                        :selected="data.selected"
                                                                        small
                                                                        class="chip--select-multi"
                                                                        >
                                                                        {{ data.item.role }}
                                                                        </v-chip>
                                                                    </template>
                                                                    <template v-slot:item="data">
                                                                        <template v-if="typeof data.item !== 'object'">
                                                                            <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                        </template>
                                                                        <template v-else>
                                                                            <v-list-tile-content>
                                                                                <v-list-tile-title v-html="data.item.role"></v-list-tile-title>
                                                                            </v-list-tile-content>
                                                                        </template>
                                                                    </template>
                                                                </v-autocomplete>
                                                            </v-flex>
                                                        </v-layout>
                                                        <v-layout>
                                                            <v-flex xs12 py-0>
                                                                <v-text-field
                                                                    v-model="boss_level"
                                                                    label="Boss Level"
                                                                    hint="Boss Level" 
                                                                    persistent-hint
                                                                    prepend-icon="text_fields"
                                                                    mask="##"
                                                                ></v-text-field>
                                                            </v-flex>
                                                        </v-layout>
                                                        <v-layout row wrap>
                                                            <v-flex xs6 py-0>
                                                                <v-menu
                                                                    :v-model="menuStartDateOrganization_"
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
                                                                            v-model="organizationStartDate_"
                                                                            label="Start Date *" 
                                                                            hint="Date when the relationship Started"
                                                                            persistent-hint
                                                                            prepend-icon="date_range"
                                                                            clearable
                                                                            readonly
                                                                            v-on="on"
                                                                            :rules="[rules.required]"
                                                                        ></v-text-field>
                                                                    </template>
                                                                    <v-date-picker
                                                                        v-model="organizationStartDate_"
                                                                        min="1930-01-01"
                                                                    ></v-date-picker>
                                                                </v-menu>
                                                            </v-flex>
                                                            <v-flex xs6 py-0>
                                                                <v-menu
                                                                    :v-model="menuEndDateOrganization_"
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
                                                                            v-model="organizationEndDate_"
                                                                            label="End Date *" 
                                                                            hint="Date when the relationship ended"
                                                                            persistent-hint
                                                                            prepend-icon="date_range"
                                                                            clearable
                                                                            readonly
                                                                            v-on="on"
                                                                        ></v-text-field>
                                                                    </template>
                                                                    <v-date-picker
                                                                        v-model="organizationEndDate_"
                                                                        :min="organizationStartDate_"
                                                                    ></v-date-picker>
                                                                </v-menu>
                                                            </v-flex>
                                                        </v-layout>
                                                    </template>
                                                </v-form>    
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                    </v-card-text>
                            </v-card>
                            <v-btn flat @click="step = step - 1">Previous</v-btn>
                            <v-btn flat @click="bus.$emit('displayWhat', 'dashboard')">Cancel</v-btn>
                            <v-btn color="primary" @click="createNewOrganization('addPerson')">Create Organization</v-btn>
                        </v-stepper-content>
                    </template>
                    <template v-else>
                      <template v-for="n in personQnt">
                            <v-stepper-step 
                                :step="1 + n"
                                :key="`${n}-step`"
                                :complete="step > n+1"
                            >
                                {{ contactType }} Information {{ n }}
                            </v-stepper-step>
                            <v-stepper-content
                                :key="`${n}-content`"
                                :step="1 + n"
                            >
                            <v-flex xs12 md8 mx-0>
                                <v-form
                                    ref="form"
                                >
                                <v-card class="elevation-0">
                                    <v-card-title class="py-0" :id="'person_'+n">
                                        <h4>
                                            Create new contact
                                        </h4>
                                        <v-spacer></v-spacer>
                                        <v-switch
                                          class="active"
                                          :name="'active_'+n"
                                          :id="'active_'+n"
                                          prepend-icon="check"
                                          v-model="active[n]" 
                                          label="Active">
                                        </v-switch>
                                    </v-card-title>
                                    <v-divider pt-0 ></v-divider>
                                    <v-card-text>
                                        <v-container grid-list-xs pa-1>
                                          <v-layout row wrap v-show="contactType === 'Family'">
                                                <v-flex xs12>
                                                  <v-select
                                                    :items="userRoleItems"
                                                    v-model="addUserRoles[n]"
                                                    prepend-icon="toc"
                                                    hint="The Person role"
                                                    label="Contact role *"
                                                    clearable
                                                    chips
                                                    :rules="[rules.required]"
                                                    width="100px"
                                                  ></v-select>
                                                </v-flex>
                                          </v-layout>
                                            <v-layout>
                                                <v-flex xs1 mr-3>
                                                    <v-avatar
                                                        color="grey lighten-2"
                                                    >
                                                    <v-icon dark large>account_circle</v-icon>
                                                    </v-avatar>
                                                </v-flex>
                                                <v-flex xs11 md5 py-0>
                                                    <v-text-field
                                                        v-model="first_name[n]"
                                                        name="name"
                                                        label="First Name *"
                                                        :id="'first_name' + n"
                                                        :rules="[rules.required]"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs12 md6 mr-0 py-0>
                                                    <v-text-field
                                                        name="last_name"
                                                        v-model="last_name[n]"
                                                        label="Last Name *"
                                                        :id="'last_name' + n"
                                                        :rules="[rules.required]"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                              <v-flex xs12 py-0>
                                                <v-autocomplete
                                                  prepend-icon="fas fa-globe"
                                                  :items="countryItems"
                                                  v-model="nationality[n]"
                                                  name="nationality"
                                                  label="Nationality *"
                                                  :id="'nationality_' + n"
                                                  value=""
                                                  :rules="[rules.required]"
                                                  clearable
                                                ></v-autocomplete>
                                              </v-flex>
                                            </v-layout>
                                            <v-layout row>
                                                <v-flex xs6 py-0>
                                                    <v-menu
                                                        ref="menuBirth"
                                                        v-model="menuBirthday[n]"
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
                                                                v-model="birthDateFormatted[n]"
                                                                name="birthDate"
                                                                :id="'birthDate' + n"
                                                                label="Birthday date"
                                                                prepend-icon="cake"
                                                                clearable
                                                                v-on="on"
                                                                mask="##/##/####"
                                                                @blur="parseDate(birthDateFormatted[n])"
                                                                @click:clear="age[n] = ''"
                                                                :error="birthError"
                                                                :error-messages="birthErrorMsg"                                                  
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            ref="pickerB"
                                                            v-model="birthDate[n]"
                                                            :max="new Date().toISOString().substr(0, 10)"
                                                            min="1930-01-01"
                                                            no-title 
                                                            @input="menuBirthday[n] = false"
                                                        ></v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                                <v-flex xs6 py-0>
                                                    <v-text-field
                                                        ref="age"
                                                        name="age"
                                                        label="Age"
                                                        :id="'age' + n"
                                                        :key="'age' + age[n]"
                                                        disabled
                                                        v-model="age[n]"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row>
                                                <v-flex xs6 py-0>
                                                    <v-menu
                                                        ref="menuDeath"
                                                        v-model="menuDeathday[n]"
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
                                                                v-model="deathDateFormatted[n]"
                                                                name="deathDate"
                                                                :id="'deathDate' + n"
                                                                label="Death date"
                                                                prepend-icon="fas fa-skull"
                                                                clearable
                                                                mask="##/##/####"
                                                                v-on="on"
                                                                @blur="parseDeathDate(deathDateFormatted[n])"
                                                                :error="deathError"
                                                                :error-messages="deathErrorMsg"  
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            ref="pickerD"
                                                            v-model="deathDate[n]"
                                                            :max="new Date().toISOString().substr(0, 10)"
                                                            :min="birthDate[n]"
                                                            no-title 
                                                            @input="menuDeathday[n] = false"
                                                        ></v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                            </v-layout>
                                            <template v-for="e in emailQnt[n -1]">
                                                <v-layout :key="e + '-mail_input'">
                                                    <v-flex xs18 py-0>
                                                        <v-text-field
                                                            v-model="email[n+''+e]"
                                                            ref="mail"
                                                            prepend-icon="email"
                                                            label="Email *"
                                                            :rules="[rules.required, rules.email]"
                                                            :success="successEmail[n+''+e] ? successEmail[n+''+e] : false"
                                                            :success-messages="successEmailMsg[n+''+e]"
                                                            :error="errorEmail[n+''+e]"
                                                            :error-messages="errorEmailMsg[n+''+e]"
                                                            @input="blurEmail(email[n+''+e], n+''+e)"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs4 py-0>
                                                        <v-select
                                                            ref="mail"
                                                            :items="phoneMailTypeItems"
                                                            v-model="emailType[n+''+e]"
                                                            label="Type *"
                                                            :rules="[rules.required]"
                                                        >
                                                            <template v-slot:append-outer>
                                                                <v-tooltip
                                                                    bottom
                                                                >
                                                                    <template v-slot:activator="{ on }">
                                                                        <v-btn flat icon @click="e === 1 ? addEmail(n, e) : delEmail(n) ">
                                                                            <v-icon v-on="on">{{ e === 1 ? 'add' : 'delete' }}</v-icon>
                                                                        </v-btn>
                                                                    </template>
                                                                    {{ e === 1 ? 'Add Email' : 'Delete Email' }}
                                                                </v-tooltip>
                                                            </template>
                                                        </v-select>
                                                    </v-flex>
                                                </v-layout>
                                            </template>
                                                    
                                            <template v-for="(p, index) in phoneQnt[n -1]">
                                                <v-layout :key="p + '-input'">
                                                    <v-flex xs3 py-0>
                                                      <v-autocomplete
                                                        ref="phone"
                                                        v-model="phoneCC[n+''+p]"
                                                        prepend-icon="phone"
                                                        label="Country"
                                                        :items="countrys"
                                                        item-text="name"
                                                        item-value="callingCode"
                                                        clearable
                                                        :rules="[rules.required]"
                                                      >
                                                        <template v-slot:selection="data">
                                                          <v-avatar size="16" class="pr-1">
                                                              <img :src="data.item.flag">
                                                          </v-avatar> {{ data.item.callingCode }}
                                                        </template>
                                                        <template v-slot:item="data">
                                                          <template v-if="typeof data.item !== 'object'">
                                                            <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                          </template>
                                                          <template v-else>
                                                            <v-list-tile-avatar size="26">
                                                              <img :src="data.item.flag">
                                                            </v-list-tile-avatar>
                                                            <v-list-tile-content>
                                                              <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                              <v-list-tile-sub-title v-html="'Calling Code: ' + data.item.callingCode"></v-list-tile-sub-title>
                                                            </v-list-tile-content>
                                                          </template>
                                                        </template>
                                                      </v-autocomplete>
                                                    </v-flex>
                                                    <v-flex xs2 py-0>
                                                        <v-text-field
                                                            v-model="phoneA[n+''+p]"
                                                            label="Area"
                                                            :rules="[rules.required]"
                                                            mask="###"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs3 py-0>
                                                        <v-text-field
                                                            v-model="phone[n+''+p]"
                                                            label="Phone"
                                                            :rules="[rules.required]"
                                                            maxlength="10"
                                                            @input="maskPhone(phone[n+''+p], n+''+p)"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs4 py-0>
                                                        <v-select
                                                            :items="phoneMailTypeItems"
                                                            v-model="phoneType[n+''+p]"
                                                            :rules="[rules.required]"
                                                            label="Type"
                                                        >
                                                            <template v-slot:append-outer>
                                                                <v-tooltip
                                                                    bottom
                                                                >
                                                                    <template v-slot:activator="{ on }">
                                                                        <v-btn flat icon small @click="p === 1 ? addPhone(n, index) : delPhone(n) ">
                                                                            <v-icon v-on="on">{{ p === 1 ? 'add' : 'delete' }}</v-icon>
                                                                        </v-btn>
                                                                    </template>
                                                                    {{ p === 1 ? 'Add Phone' : 'Delete Phone' }}
                                                                </v-tooltip>
                                                            </template>
                                                        </v-select>
                                                    </v-flex>
                                                </v-layout>
                                            </template>
                                            <v-layout>
                                                <v-flex xs12 py-0>
                                                    <v-select
                                                        prepend-icon="fas fa-venus-mars"
                                                        :items="genderTypeItems"
                                                        v-model="genderType[n]"
                                                        label="Gender * "
                                                        name="gender"
                                                        :id="'gender' + n"
                                                        width="100%"
                                                        :rules="[rules.required]"
                                                    ></v-select>
                                                </v-flex>
                                                <v-flex xs12 py-0>
                                                    <v-select
                                                        prepend-icon="people_outline"
                                                        :items="sexualPrefTypeItems"
                                                        v-model="sexualPrefType[n]"
                                                        label="Sexual Preference *"
                                                        name="sexualPref"
                                                        :id="'sexualPref' + n"
                                                        width="100%"
                                                        :rules="[rules.required]"
                                                    ></v-select>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs12 py-0>
                                                    <v-text-field
                                                        v-model="ssn[n]"
                                                        autocomplete="off"
                                                        prepend-icon="far fa-id-card"
                                                        name="ssn"
                                                        label="SSN"
                                                        :id="'ssn' + n"
                                                        mask="###-##-####"
                                                        return-masked-value
                                                        :append-icon="SSNShow ? 'visibility' : 'visibility_off'"
                                                        :type="SSNShow ? 'text' : 'password'"
                                                        @click:append="SSNShow = !SSNShow"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>

                                            <!-- <template v-for="e in fileQnt">
                                                <v-layout :key="e + '-fileinput'">
                                                    <v-flex xs12 py-0>
                                                        <v-text-field
                                                            v-model="organizationFile[e]"
                                                            prepend-icon="insert_drive_file"
                                                            label="Files"
                                                            hint="File Name"
                                                            persistent-hint
                                                        >
                                                        <template v-slot:append-outer>
                                                                <v-tooltip
                                                                    bottom
                                                                >
                                                                    <template v-slot:activator="{ on }">
                                                                        <v-btn flat icon @click="e === 1 ? addFile() : delFile() ">
                                                                            <v-icon v-on="on">{{ e === 1 ? 'add' : 'delete' }}</v-icon>
                                                                        </v-btn>
                                                                    </template>
                                                                    {{ e === 1 ? 'Add File' : 'Delete File' }}
                                                                </v-tooltip>
                                                            </template>
                                                        </v-text-field>
                                                    </v-flex>

                                                </v-layout>
                                            </template> -->

                                            <v-layout row wrap>
                                              <v-flex xs12>
                                                <v-card-title class="py-0 px-0" :id="'portal_'+n">
                                                  <h4>
                                                      Portal Access
                                                  </h4>
                                                  <v-spacer></v-spacer>
                                                  <v-switch
                                                    class="active"
                                                    :name="'active_portal_'+n"
                                                    :id="'active_portal_'+n"
                                                    prepend-icon="check"
                                                    v-model="portal[n]" 
                                                    label="Active">
                                                  </v-switch>
                                                </v-card-title>
                                                <v-divider pt-0 ></v-divider>
                                              </v-flex>
                                                <!--  <v-flex xs12 pt-3>
                                                  <h4><v-switch :name="'portalSwitch_'+n" :id="'portalSwitch_'+n" label="Portal Access" v-model="portal[n]"></v-switch> {{ userExistis[n] }}</h4>
                                                  
                                                  <v-divider pt-0 ></v-divider>
                                                </v-flex>
                                                <v-flex xs12>
                                                    
                                                </v-flex> -->
                                            </v-layout>

                                            <template>
                                              <v-layout v-if="userExistis[n] === true">
                                                <v-flex xs12 py-0>
                                                    <v-autocomplete
                                                        v-model="userSelected[n]"
                                                        hint="System Account associated to this Person"
                                                        prepend-icon="person"
                                                        append-outer-icon="add"
                                                        :items="userItems"
                                                        :selected="userSelect"
                                                        clearable
                                                        label="User"
                                                        :key="`user-${n}`"
                                                        persistent-hint
                                                        chips
                                                        item-text="username"
                                                        item-value="id"
                                                        @click:append-outer="cleanPortal(n)"
                                                        >
                                                        <!-- <template v-slot:append-outer>
                                                            <v-tooltip
                                                                bottom
                                                            >
                                                                <template v-slot:activator="{ on }">
                                                                    <v-btn flat icon @click="userExistis[n] = false">
                                                                        <v-icon v-on="on">add</v-icon>
                                                                    </v-btn>
                                                                </template>
                                                                'Add Email'
                                                            </v-tooltip>
                                                        </template>
                                                        <template v-slot:append-outer>
                                                          <v-icon
                                                            @click="userExistis[n] = false"
                                                            v-text="'add'"
                                                            ></v-icon>
                                                        </template> -->
                                                    </v-autocomplete>
                                                  </v-flex>
                                              </v-layout>
                                              <v-layout row wrap v-else>
                                                 <v-flex xs12>
                                                    <v-text-field 
                                                        v-model="addUserUsername[n]"
                                                        prepend-icon="person"
                                                        label="Username *" 
                                                        hint="The User's username. Must be an e-mail address." 
                                                        persistent-hint
                                                        counter
                                                        maxlength="255"
                                                        :rules="[rules.required, rules.email]"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-text-field 
                                                        v-model="addUserPassword[n]"
                                                        prepend-icon="lock"
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
                                              </v-layout>
                                            </template>

                                            <v-layout>
                                                <v-flex xs12>
                                                    <v-switch :name="'wallet'+n" :id="'wallet'+n" label="Create a Wallet?" v-model="wallet[n]" value=""></v-switch>
                                                </v-flex>
                                            </v-layout>

                                            <v-layout >
                                                <v-flex xs12 py-0>
                                                    <v-switch label="ADDRESS" v-model="showAddress"></v-switch>
                                                </v-flex>
                                            </v-layout>
                                            <template v-if="showAddress === true">
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-select
                                                            prepend-icon="toc"
                                                            :items="phoneMailTypeItems"
                                                            v-model="organizationAddress.type"
                                                            label="Type *"
                                                            hint="Address Type."
                                                            persistent-hint
                                                            :rules="[rules.required]"
                                                        >
                                                        </v-select>
                                                    </v-flex>
                                                </v-layout>
                                                
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-text-field
                                                            v-model="organizationAddress.line_1"
                                                            label="Address Line 1 *"
                                                            hint="Address Line 1" 
                                                            persistent-hint
                                                            prepend-icon="text_fields"
                                                            :rules="[rules.required]"
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-text-field
                                                            v-model="organizationAddress.line_2"
                                                            label="Address Line 2"
                                                            hint="Address Line 2" 
                                                            persistent-hint
                                                            prepend-icon="text_fields"
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                
                                                <v-layout>
                                                    <v-flex xs6 py-0>
                                                        <v-text-field
                                                            v-model="organizationAddress.city"
                                                            label="City"
                                                            hint="City Name" 
                                                            persistent-hint
                                                            prepend-icon="text_fields"
                                                            :rules="[rules.required]"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs6 py-0>
                                                        <v-text-field
                                                            v-model="organizationAddress.state"
                                                            label="State"
                                                            hint="State Name" 
                                                            persistent-hint
                                                            prepend-icon="text_fields"
                                                            :rules="[rules.required]"
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                
                                                <v-layout>
                                                    <v-flex xs6 py-0>
                                                      <v-autocomplete
                                                          prepend-icon="text_fields"
                                                          :items="countryItems"
                                                          v-model="organizationAddress.country"
                                                          label="Country"
                                                          hint="Country Name" 
                                                          persistent-hint
                                                          :rules="[rules.required]"
                                                          clearable
                                                      ></v-autocomplete>
                                                    </v-flex>
                                                    <v-flex xs6 py-0>
                                                        <v-text-field
                                                            v-model="organizationAddress.zip"
                                                            label="Zip"
                                                            hint="Zip Name" 
                                                            persistent-hint
                                                            prepend-icon="text_fields"
                                                            :rules="[rules.required]"
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            
                                            </template>
                                            <!-- 
                                            <template v-if="selectCase">
                                                <v-layout >
                                                    <v-flex xs12 py-0>
                                                        <v-subheader class="pa-0 mt-3">CASE</v-subheader>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="roleSelected[n]"
                                                            :items="roleItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Case Role"
                                                            item-text="role"
                                                            item-value="_id"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.role }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.role"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row wrap>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuStartDate[n]"
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
                                                                    v-model="caseStartDate[n]"
                                                                    label="Start Date"
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="caseStartDate[n]"
                                                                :max="new Date().toISOString().substr(0, 10)"
                                                                min="1930-01-01"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuEndDate[n]"
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
                                                                    :v-model="caseEndDate[n]"
                                                                    label="End Date"
                                                                    prepend-icon="date_range"
                                                                    readonly
                                                                    clearable
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="caseEndDate[n]"
                                                                :min="caseStartDate[n]"
                                                                @input="menuEndDate[n] = false"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                </v-layout>
                                            </template> -->
                                            <v-layout >
                                                <v-flex xs12 py-0>
                                                    <v-switch label="ORGANIZATION" v-model="showOrganization[n]"></v-switch>
                                                </v-flex>
                                            </v-layout>
                                            <template v-if="showOrganization[n] === true">
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="organizationSelected[n]"
                                                            :items="organizationItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Organization *" 
                                                            hint="The Organization."
                                                            item-text="name"
                                                            item-value="_id"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.name }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="organizationRoleSelected[n]"
                                                            :items="organizationRoleItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Role *" 
                                                            hint="Associated Role ID."
                                                            persistent-hint
                                                            item-text="role"
                                                            item-value="_id"
                                                            :rules="[rules.required]"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.role }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.role"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-text-field
                                                            v-model="boss_level"
                                                            label="Boss Level"
                                                            hint="Boss Level" 
                                                            persistent-hint
                                                            prepend-icon="text_fields"
                                                            mask="##"
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                
                                                <v-layout row wrap>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuStartDateOrganization[n]"
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
                                                                    v-model="organizationStartDate[n]"
                                                                    label="Start Date *" 
                                                                    hint="Date when the organization Started"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="organizationStartDate[n]"
                                                                :max="new Date().toISOString().substr(0, 10)"
                                                                min="1930-01-01"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuEndDateOrganization[n]"
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
                                                                    v-model="organizationEndDate[n]"
                                                                    label="End Date *" 
                                                                    hint="Date when the organization ended"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="organizationEndDate[n]"
                                                                :min="organizationStartDate[n]"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                </v-layout>
                                            </template>


                                            <v-layout >
                                                <v-flex xs12 py-0>
                                                    <v-switch label="RELATIONSHIPS" v-model="showRelationship[n]"></v-switch>
                                                </v-flex>
                                            </v-layout>
                                            <template v-if="showRelationship[n] === true">
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="humanSelected[n]"
                                                            :items="humanItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Person *" 
                                                            hint="The Person identifier. Points to Person"
                                                            item-text="name"
                                                            item-value="_id"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.name }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="relationshipSelected[n]"
                                                            :items="relationshipItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Relationship Type *" 
                                                            hint="The Person Relationship type identifier."
                                                            persistent-hint
                                                            item-text="name"
                                                            item-value="_id"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.name }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row wrap>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuStartDateRelationship[n]"
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
                                                                    v-model="relationshipStartDate[n]"
                                                                    label="Start Date *" 
                                                                    hint="Date when the relationship Started"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="relationshipStartDate[n]"
                                                                :max="new Date().toISOString().substr(0, 10)"
                                                                min="1930-01-01"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuEndDateRelationship[n]"
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
                                                                    v-model="relationshipEndDate[n]"
                                                                    label="End Date *" 
                                                                    hint="Date when the relationship ended"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="relationshipEndDate[n]"
                                                                :min="relationshipStartDate[n]"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs12>
                                                        <v-textarea
                                                        v-model="relationshipMemo[n]"
                                                        prepend-icon="text_fields"
                                                        box
                                                        label="Memo"
                                                        value=""
                                                        ></v-textarea>
                                                    </v-flex>
                                                </v-layout>
                                            </template>

                                            <v-layout >
                                                <v-flex xs12 py-0>
                                                    <v-switch label="GROUPS" v-model="showGroup[n]"></v-switch>
                                                </v-flex>
                                            </v-layout>
                                            <template v-if="showGroup[n] === true">
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="groupSelected[n]"
                                                            :items="groupItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Group *" 
                                                            hint="Associated Group ID."
                                                            persistent-hint
                                                            item-text="name"
                                                            item-value="_id"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.name }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="groupRoleSelected[n]"
                                                            :items="groupRoleItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Group Role *" 
                                                            hint="Associated Group Role ID."
                                                            persistent-hint
                                                            item-text="name"
                                                            item-value="_id"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.name }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row wrap>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuStartDateGroup[n]"
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
                                                                    v-model="groupStartDate[n]"
                                                                    label="Start Date *" 
                                                                    hint="Date when the group Started"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="groupStartDate[n]"
                                                                :max="new Date().toISOString().substr(0, 10)"
                                                                min="1930-01-01"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuEndDateGroup[n]"
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
                                                                    v-model="groupEndDate[n]"
                                                                    label="End Date *" 
                                                                    hint="Date when the group ended"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="groupEndDate[n]"
                                                                :min="groupStartDate[n]"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                </v-layout>
                                            </template>

                                            <v-layout >
                                                <v-flex xs12 py-0>
                                                    <v-switch label="PROGRAMS" v-model="showPrograms[n]"></v-switch>
                                                </v-flex>
                                            </v-layout>
                                            <template v-if="showPrograms[n] === true">
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="programsSelected[n]"
                                                            :items="programsItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Programs *" 
                                                            hint="Associated programs ID."
                                                            persistent-hint
                                                            item-text="name"
                                                            item-value="_id"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.name }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                <v-flex xs12 py-0>
                                                    <v-autocomplete
                                                        v-model="programsRoleSelected[n]"
                                                        :items="programsRoleItems"
                                                        prepend-icon="toc"
                                                        chips
                                                        clearable
                                                        label="Role *" 
                                                        hint="Associated Program Role."
                                                        persistent-hint
                                                        item-text="role"
                                                        item-value="_id"
                                                        :rules="[rules.required]"
                                                    >
                                                        <template v-slot:selection="data">
                                                            <v-chip
                                                            :selected="data.selected"
                                                            small
                                                            class="chip--select-multi"
                                                            >
                                                            {{ data.item.role }}
                                                            </v-chip>
                                                        </template>
                                                        <template v-slot:item="data">
                                                            <template v-if="typeof data.item !== 'object'">
                                                                <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                            </template>
                                                            <template v-else>
                                                                <v-list-tile-content>
                                                                    <v-list-tile-title v-html="data.item.role"></v-list-tile-title>
                                                                </v-list-tile-content>
                                                            </template>
                                                        </template>
                                                    </v-autocomplete>
                                                </v-flex>
                                            </v-layout>
                                                <v-layout row wrap>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuStartDatePrograms[n]"
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
                                                                    v-model="programsStartDate[n]"
                                                                    label="Start Date *" 
                                                                    hint="Date when the programs Started"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="programsStartDate[n]"
                                                                :max="new Date().toISOString().substr(0, 10)"
                                                                min="1930-01-01"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuEndDatePrograms[n]"
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
                                                                    v-model="programsEndDate[n]"
                                                                    label="End Date" 
                                                                    hint="Date when the programs ended"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="programsEndDate[n]"
                                                                :min="programsStartDate[n]"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                </v-layout>
                                            </template>
                                        </v-container>
                                    </v-card-text>
                                    
                                </v-card>
                                </v-form>
                            </v-flex>
                                <v-btn flat @click="step = step - 1">Previous</v-btn>
                                <v-btn flat @click="bus.$emit('displayWhat', 'dashboard')">Cancel</v-btn><!-- 
                                <v-btn color="primary" v-if="personQnt === n" @click="create('a', n)">Create</v-btn>
                                <v-btn color="primary" v-else @click="create('a', n)">Continue</v-btn>
                                <v-btn color="primary" @click="step = step + 1">Continue</v-btn> -->
                                <v-btn color="primary" @click="test()">Continue</v-btn>
                       
                            </v-stepper-content>
                      </template>
                    <!-- <template v-else>
                        <v-stepper-step :complete="step > 2" step="2">Configure {{ contactType }}</v-stepper-step>

                        <v-stepper-content step="2">
                            <v-card class="ma-3 elevation-0">
                                <div v-if="contactType === 'Person'">
                                    <h4>Is this a family or single?</h4>
                                    <v-radio-group class="pl-3" v-model="personType" row>
                                        <v-radio value="Single">
                                            <template v-slot:label>
                                            <div><v-icon>person</v-icon> Single</div>
                                            </template>
                                        </v-radio>
                                        <v-radio value="Family">
                                            <template v-slot:label>
                                            <div><v-icon>group</v-icon> Family</div>
                                            </template>
                                        </v-radio>
                                    </v-radio-group>
                                    <div v-show="personType === 'Family'">
                                        <h4>How many people in the family?</h4>
                                        <v-flex xs6>
                                            <v-slider
                                                width="300"
                                                v-model="personQnt"
                                                min="1"
                                                max="10"
                                                thumb-label="always"
                                                :thumb-size="24"
                                                ticks
                                                tick-size="2"
                                                class="pt-3"
                                                xs6
                                            >
                                                <template v-slot:prepend>
                                                    <v-icon
                                                        @click="decrement"
                                                    >
                                                        remove
                                                    </v-icon>
                                                    </template>

                                                    <template v-slot:append>
                                                    <v-icon
                                                        @click="increment"
                                                    >
                                                        add
                                                    </v-icon>
                                                </template>
                                            </v-slider>
                                        </v-flex>
                                    </div>
                                </div>
                                <div v-else>
                                    <v-flex xs12 md6>
                                        <v-select
                                            :items="organizationTypeItems"
                                            v-model="organizationType"
                                            label="Organization Type"
                                            width="100px"
                                        ></v-select>
                                    </v-flex>
                                </div>
                            </v-card>
                            <v-btn flat @click="step = step - 1">Previous</v-btn>
                            <v-btn flat @click="bus.$emit('displayWhat', 'dashboard')">Cancel</v-btn>
                            <v-btn color="primary" :disabled="!personType && !organizationType" @click="step = step + 1">Continue</v-btn>
                        </v-stepper-content> -->

                        <v-stepper-step :step="2 + personQnt"
                                :key="`${personQnt}-case-step`"
                                :complete="step > personQnt+2">
                            Case
                            <small>Create or Add to Existing Case</small>
                        </v-stepper-step>

                        <v-stepper-content :key="`${personQnt}-case-content`"
                            :step="2 + personQnt">
                            <v-flex xs12 md8>
                                <v-card class="ma-3 elevation-0">
                                    <v-radio-group class="pl-3" v-model="selectCase" row id="caseAdd">
                                        <v-radio value="AddContactOnly">
                                            <template v-slot:label>
                                            <div>Add contact only</div>
                                            </template>
                                        </v-radio>
                                        <v-radio value="CreateCase">
                                            <template v-slot:label>
                                            <div>Create Case</div>
                                            </template>
                                        </v-radio>
                                        <v-radio value="AddCase">
                                            <template v-slot:label>
                                            <div>Add to Existing Case</div>
                                            </template>
                                        </v-radio>
                                    </v-radio-group>

                                    <template v-if="selectCase === 'CreateCase'">
                                        <v-form
                                            ref="case"
                                            v-model="valid"
                                            lazy-validation
                                        >
                                            <v-layout>
                                                <v-flex xs12 py-0>
                                                    <v-text-field
                                                        v-model="display_name"
                                                        prepend-icon="text_fields"
                                                        label="The Case Display Name"
                                                        :rules="[v => !!v || 'Display Name is required']"
                                                        required
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex py-0>
                                                    <v-text-field
                                                        v-model="case_number"
                                                        prepend-icon="text_fields"
                                                        label="The Case Number"
                                                        :rules="[v => !!v || 'Case Number is required']"
                                                        required
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>

                                            <v-layout>
                                                <v-flex py-0>
                                                    <v-autocomplete
                                                        v-model="programSelected"
                                                        :items="programsItems"
                                                        prepend-icon="toc"
                                                        chips
                                                        clearable
                                                        label="Program Name "
                                                        item-text="name"
                                                        item-value="_id"
                                                        :rules="[rules.required]"
                                                    >
                                                        <template v-slot:selection="data">
                                                            <v-chip
                                                            :selected="data.selected"
                                                            small
                                                            class="chip--select-multi"
                                                            :rules="[rules.required]"
                                                            >
                                                            {{ data.item.name }}
                                                            </v-chip>
                                                        </template>
                                                        <template v-slot:item="data">
                                                            <template v-if="typeof data.item !== 'object'">
                                                            <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                            </template>
                                                            <template v-else>
                                                            <v-list-tile-content>
                                                                <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                            </v-list-tile-content>
                                                            </template>
                                                        </template>
                                                    </v-autocomplete>
                                                </v-flex>
                                            </v-layout>
                                        
                                            <v-layout>
                                                <v-flex xs12 md6 py-0>
                                                    <v-menu
                                                        :v-model="menuStartDateNewCase"
                                                        :close-on-content-click="false"
                                                        :nudge-right="40"
                                                        lazy
                                                        transition="scale-transition"
                                                        offset-y
                                                        full-width
                                                        min-width="290px"
                                                        :rules="[rules.required]"
                                                    >
                                                        <template v-slot:activator="{ on }">
                                                            <v-text-field
                                                                :value="computedStartDateNewCase"
                                                                label="Start Date"
                                                                prepend-icon="date_range"
                                                                readonly
                                                                clearable
                                                                v-on="on"
                                                                :rules="[rules.required]"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            v-model="caseStartDateNew"
                                                            :max="new Date().toISOString().substr(0, 10)"
                                                            min="1930-01-01"
                                                            @change="menuStartDateNewCase = false"
                                                            :rules="[rules.required]"
                                                        ></v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                                <v-flex xs12 md6 py-0>
                                                    <v-menu
                                                        :v-model="menuEndDateNewCase"
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
                                                                :value="computedEndDateNewCase"
                                                                label="End Date"
                                                                prepend-icon="date_range"
                                                                readonly
                                                                clearable
                                                                v-on="on"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            v-model="caseEndDateNew"
                                                            :min="caseStartDateNew"
                                                            :rules="[rules.required]"
                                                            @input="menuEndDateNewCase = false"
                                                        ></v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs12 py-0>
                                                    <v-autocomplete
                                                        v-model="caseType"
                                                        :items="caseTypeItems"
                                                        prepend-icon="toc"
                                                        chips
                                                        clearable
                                                        label="Case Type "
                                                        item-text="Type"
                                                        item-value="_id"
                                                        :rules="[rules.required]"
                                                    >
                                                        <template v-slot:selection="data">
                                                            <v-chip
                                                            :selected="data.selected"
                                                            small
                                                            class="chip--select-multi"
                                                            >
                                                            {{ data.item.type }}
                                                            </v-chip>
                                                        </template>
                                                        <template v-slot:item="data">
                                                            <template v-if="typeof data.item !== 'object'">
                                                            <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                            </template>
                                                            <template v-else>
                                                            <v-list-tile-content>
                                                                <v-list-tile-title v-html="data.item.type"></v-list-tile-title>
                                                            </v-list-tile-content>
                                                            </template>
                                                        </template>
                                                    </v-autocomplete>
                                                </v-flex>
                                            </v-layout>

                                            <v-layout row wrap>
                                                <v-flex xs12>
                                                    <v-autocomplete
                                                        v-model="caseSelected"
                                                        prepend-icon="toc"
                                                        :items="caseItems"
                                                        chips
                                                        clearable
                                                        required
                                                        multiple
                                                        label="Related Cases"
                                                        item-text="case_number"
                                                        item-value="_id"
                                                        :rules="[rules.required]"
                                                    >
                                                        <template v-slot:selection="data">
                                                            <v-chip
                                                            :selected="data.selected"
                                                            small
                                                            class="chip--select-multi"
                                                            >
                                                            {{ data.item.case_number }}
                                                            </v-chip>
                                                        </template>
                                                        <template v-slot:item="data">
                                                            <template v-if="typeof data.item !== 'object'">
                                                            <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                            </template>
                                                            <template v-else>
                                                            <v-list-tile-content>
                                                                <v-list-tile-title v-html="data.item.case_number"></v-list-tile-title>
                                                            </v-list-tile-content>
                                                            </template>
                                                        </template>
                                                    </v-autocomplete>
                                                </v-flex>
                                            </v-layout>
      
                                            <v-layout>
                                                <v-flex xs9 py-0>
                                                    <v-autocomplete
                                                        v-model="caseStatus"
                                                        :items="caseStatusItems"
                                                        prepend-icon="toc"
                                                        chips
                                                        clearable
                                                        label="Case Status "
                                                        item-text="status"
                                                        item-value="_id"
                                                        :rules="[rules.required]"
                                                    >
                                                        <template v-slot:selection="data">
                                                            <v-chip
                                                            :selected="data.selected"
                                                            small
                                                            class="chip--select-multi"
                                                            >
                                                            {{ data.item.status }}
                                                            </v-chip>
                                                        </template>
                                                        <template v-slot:item="data">
                                                            <template v-if="typeof data.item !== 'object'">
                                                            <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                            </template>
                                                            <template v-else>
                                                            <v-list-tile-content>
                                                                <v-list-tile-title v-html="data.item.status"></v-list-tile-title>
                                                            </v-list-tile-content>
                                                            </template>
                                                        </template>
                                                    </v-autocomplete>
                                                </v-flex>
                                                
                                                <v-flex xs3 py-0>
                                                    <v-switch label="Placement" v-model="is_placement"></v-switch>
                                                </v-flex>
                                            </v-layout>
                                        </v-form>
                                    </template>

                                    <template v-else-if="selectCase === 'AddCase'">
                                        <v-flex xs12 md8>
                                            <v-autocomplete
                                                v-model="caseSelected"
                                                :items="caseItems"
                                                chips
                                                clearable
                                                required
                                                label="Select a Case "
                                                item-text="case_number"
                                                item-value="id"
                                                :rules="[rules.required]"
                                            >
                                                <template v-slot:selection="data">
                                                    <v-chip
                                                    :selected="data.selected"
                                                    small
                                                    class="chip--select-multi"
                                                    >
                                                    {{ data.item.case_number }}
                                                    </v-chip>
                                                </template>
                                                <template v-slot:item="data">
                                                    <template v-if="typeof data.item !== 'object'">
                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                    </template>
                                                    <template v-else>
                                                    <v-list-tile-content>
                                                        <v-list-tile-title v-html="data.item.case_number"></v-list-tile-title>
                                                    </v-list-tile-content>
                                                    </template>
                                                </template>
                                            </v-autocomplete>
                                        </v-flex>
                                    </template>
                                    <template v-if="selectCase !== 'AddContactOnly'">

                                        <template v-for="n in personQnt">
                                          <v-layout :key="`${n}-step`">
                                            <v-flex xs4 py-0>
                                              <v-text-field
                                                prepend-icon="person"
                                                label="Contact"
                                                :key="'Contact' + age[n]"
                                                disabled
                                                :value="first_name[n] +' '+ last_name[n]"
                                              ></v-text-field>
                                            </v-flex>
                                            <v-flex xs8 py-0>
                                                <v-autocomplete
                                                    v-model="roleSelected[n]"
                                                    :items="roleItems"
                                                    prepend-icon="toc"
                                                    chips
                                                    clearable
                                                    label="Case Role"
                                                    item-text="role"
                                                    item-value="_id"
                                                >
                                                    <template v-slot:selection="data">
                                                        <v-chip
                                                        :selected="data.selected"
                                                        small
                                                        class="chip--select-multi"
                                                        >
                                                        {{ data.item.role }}
                                                        </v-chip>
                                                    </template>
                                                    <template v-slot:item="data">
                                                        <template v-if="typeof data.item !== 'object'">
                                                            <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                        </template>
                                                        <template v-else>
                                                            <v-list-tile-content>
                                                                <v-list-tile-title v-html="data.item.role"></v-list-tile-title>
                                                            </v-list-tile-content>
                                                        </template>
                                                    </template>
                                                </v-autocomplete>
                                            </v-flex>
                                        </v-layout>
                                      </template>
                                    </template>
                                </v-card>
                            </v-flex>
                            <v-btn flat @click="step = step - 1">Previous</v-btn>
                            <v-btn flat @click="bus.$emit('displayWhat', 'dashboard')">Cancel</v-btn><!-- 
                            <v-btn v-if="selectCase === 'AddContactOnly'" color="primary" :disabled="!selectCase" @click="step = step + 1; selectCase = null">Continue</v-btn>
                            <v-btn v-else color="primary" :disabled="!selectCase || !valid" @click="step = step + 1">Continue</v-btn> -->

                            <v-btn color="primary" :disabled="!selectCase" @click="testCase()">Create</v-btn>
                        </v-stepper-content>

                        <!-- <template v-for="n in personQnt">
                            <v-stepper-step 
                                :step="3 + n"
                                :key="`${n}-step`"
                                :complete="step > n+3"
                            >
                                {{ contactType }} Information {{ n }}
                            </v-stepper-step>
                            <v-stepper-content
                                :key="`${n}-content`"
                                :step="3 + n"
                            >
                            <v-flex xs12 md8 mx-0>
                                <v-form
                                    ref="form"
                                >
                                <v-card class="elevation-0">
                                    <v-card-title class="py-0" :id="'person_'+n">
                                        <h4>
                                            Create new contact
                                        </h4>
                                        <v-spacer></v-spacer>
                                        <v-switch
                                          class="active"
                                          :name="'active_'+n"
                                          :id="'active_'+n"
                                          prepend-icon="check"
                                          v-model="active[n]" 
                                          label="Active">
                                        </v-switch>
                                    </v-card-title>
                                    <v-divider pt-0 ></v-divider>
                                    <v-card-text>
                                        <v-container grid-list-xs pa-1>
                                            <v-layout>
                                                <v-flex xs1 mr-3>
                                                    <v-avatar
                                                        color="grey lighten-2"
                                                    >
                                                    <v-icon dark large>account_circle</v-icon>
                                                    </v-avatar>
                                                </v-flex>
                                                <v-flex xs11 md5 py-0>
                                                    <v-text-field
                                                        v-model="first_name[n]"
                                                        name="name"
                                                        label="First Name *"
                                                        id="first_name"
                                                        :rules="[rules.required]"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs12 md6 mr-0 py-0>
                                                    <v-text-field
                                                        name="last_name"
                                                        v-model="last_name[n]"
                                                        label="Last Name *"
                                                        id="last_name"
                                                        :rules="[rules.required]"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                              <v-flex xs12 py-0>
                                                <v-autocomplete
                                                  prepend-icon="fas fa-globe"
                                                  :items="countryItems"
                                                  v-model="nationality[n]"
                                                  name="nationality"
                                                  label="Nationality *"
                                                  id="nationality"
                                                  value=""
                                                  :rules="[rules.required]"
                                                  clearable
                                                ></v-autocomplete>
                                              </v-flex>
                                            </v-layout>
                                            <v-layout row>
                                                <v-flex xs6 py-0>
                                                    <v-menu
                                                        ref="menuBirth"
                                                        v-model="menuBirthday[n]"
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
                                                                v-model="birthDate[n]"
                                                                name="birthDate"
                                                                id="birthDate"
                                                                label="Birthday date"
                                                                prepend-icon="cake"
                                                                clearable
                                                                readonly
                                                                v-on="on"
                                                                @focus="setYear(n, 'b')"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            ref="pickerB"
                                                            v-model="birthDate[n]"
                                                            :max="new Date().toISOString().substr(0, 10)"
                                                            min="1930-01-01"
                                                        ></v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                                <v-flex xs6 py-0>
                                                    <v-text-field
                                                        name="age"
                                                        label="Age"
                                                        id="age"
                                                        disabled
                                                        :value="age[n]"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row>
                                                <v-flex xs6 py-0>
                                                    <v-menu
                                                        ref="menuDeath"
                                                        v-model="menuDeathday[n]"
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
                                                                v-model="deathDate[n]"
                                                                name="deathDate"
                                                                id="deathDate"
                                                                label="Death date"
                                                                prepend-icon="fas fa-skull"
                                                                clearable
                                                                readonly
                                                                v-on="on"
                                                                @focus="setYear(n, 'd')"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            ref="pickerD"
                                                            v-model="deathDate[n]"
                                                            :max="new Date().toISOString().substr(0, 10)"
                                                            :min="birthDate[n]"
                                                            @change="saveDeath(deathDate[n], n)"
                                                        ></v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                            </v-layout>
                                            <template v-for="e in emailQnt[n -1]">
                                                <v-layout :key="e + '-mail_input'">
                                                    <v-flex xs18 py-0>
                                                        <v-text-field
                                                            v-model="email[n+''+e]"
                                                            ref="mail"
                                                            prepend-icon="email"
                                                            label="Email *"
                                                            :rules="[rules.required, rules.email]"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs4 py-0>
                                                        <v-select
                                                            ref="mail"
                                                            :items="phoneMailTypeItems"
                                                            v-model="emailType[n+''+e]"
                                                            label="Type *"
                                                            :rules="[rules.required]"
                                                        >
                                                            <template v-slot:append-outer>
                                                                <v-tooltip
                                                                    bottom
                                                                >
                                                                    <template v-slot:activator="{ on }">
                                                                        <v-btn flat icon @click="e === 1 ? addEmail(n, e) : delEmail(n) ">
                                                                            <v-icon v-on="on">{{ e === 1 ? 'add' : 'delete' }}</v-icon>
                                                                        </v-btn>
                                                                    </template>
                                                                    {{ e === 1 ? 'Add Email' : 'Delete Email' }}
                                                                </v-tooltip>
                                                            </template>
                                                        </v-select>
                                                    </v-flex>
                                                </v-layout>
                                            </template>
                                            <template v-for="(p) in phoneQnt[n -1]">
                                                <v-layout :key="p + '-input'">
                                                    <v-flex xs3 py-0>
                                                        <v-text-field
                                                            ref="phone"
                                                            v-model="phoneCC[n+''+p]"
                                                            prepend-icon="phone"
                                                            label="Country"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs2 py-0>
                                                        <v-text-field
                                                            ref="phone"
                                                            v-model="phoneA[n+''+p]"
                                                            label="Area"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs3 py-0>
                                                        <v-text-field
                                                            ref="phone"
                                                            v-model="phone[n+''+p]"
                                                            label="Phone"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs4 py-0>
                                                        <v-select
                                                            ref="phone"
                                                            :items="phoneMailTypeItems"
                                                            v-model="phoneType[n+''+p]"
                                                            label="Type"
                                                        >
                                                            <template v-slot:append-outer>
                                                                <v-tooltip
                                                                    bottom
                                                                >
                                                                    <template v-slot:activator="{ on }">
                                                                        <v-btn flat icon small @click="p === 1 ? addPhone(n) : delPhone(n) ">
                                                                            <v-icon v-on="on">{{ p === 1 ? 'add' : 'delete' }}</v-icon>
                                                                        </v-btn>
                                                                    </template>
                                                                    {{ p === 1 ? 'Add Phone' : 'Delete Phone' }}
                                                                </v-tooltip>
                                                            </template>
                                                        </v-select>
                                                    </v-flex>
                                                </v-layout>
                                            </template>
                                            <v-layout>
                                                <v-flex xs12 py-0>
                                                    <v-select
                                                        prepend-icon="fas fa-venus-mars"
                                                        :items="genderTypeItems"
                                                        v-model="genderType[n]"
                                                        :label="'Gender * ' + genderType[n]"
                                                        name="gender"
                                                        id="gender"
                                                        width="100%"
                                                        :rules="[rules.required]"
                                                    ></v-select>
                                                </v-flex>
                                                <v-flex xs12 py-0>
                                                    <v-select
                                                        prepend-icon="people_outline"
                                                        :items="sexualPrefTypeItems"
                                                        v-model="sexualPrefType[n]"
                                                        label="Sexual Preference *"
                                                        name="sexualPref"
                                                        id="sexualPref"
                                                        width="100%"
                                                        :rules="[rules.required]"
                                                    ></v-select>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs12 py-0>
                                                    <v-text-field
                                                        v-model="ssn[n]"
                                                        prepend-icon="far fa-id-card"
                                                        name="ssn"
                                                        label="SSN"
                                                        id="ssn"
                                                        mask="###-##-####"
                                                        :append-icon="SSNShow ? 'visibility' : 'visibility_off'"
                                                        :type="SSNShow ? 'text' : 'password'"
                                                        @click:append="SSNShow = !SSNShow"
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>

                                            <template v-for="e in fileQnt">
                                                <v-layout :key="e + '-fileinput'">
                                                    <v-flex xs12 py-0>
                                                        <v-text-field
                                                            v-model="organizationFile[e]"
                                                            prepend-icon="insert_drive_file"
                                                            label="Files"
                                                            hint="File Name"
                                                            persistent-hint
                                                        >
                                                        <template v-slot:append-outer>
                                                                <v-tooltip
                                                                    bottom
                                                                >
                                                                    <template v-slot:activator="{ on }">
                                                                        <v-btn flat icon @click="e === 1 ? addFile() : delFile() ">
                                                                            <v-icon v-on="on">{{ e === 1 ? 'add' : 'delete' }}</v-icon>
                                                                        </v-btn>
                                                                    </template>
                                                                    {{ e === 1 ? 'Add File' : 'Delete File' }}
                                                                </v-tooltip>
                                                            </template>
                                                        </v-text-field>
                                                    </v-flex>

                                                </v-layout>
                                            </template>

                                            <v-layout>
                                                <v-flex xs12>
                                                    <v-switch :name="'portalSwitch_'+n" :id="'portalSwitch_'+n" label="Portal Access" v-model="portal[n]" value=""></v-switch>
                                                </v-flex>
                                            </v-layout>

                                            <template v-if="portal[n] === true">
                                              <v-layout>
                                                <v-flex xs12 py-0>
                                                    <v-autocomplete
                                                        v-model="userSelected[ n ]"
                                                        hint="System Account associated to this Person"
                                                        prepend-icon="person"
                                                        :items="userItems"
                                                        :selected="userSelect"
                                                        clearable
                                                        label="User"
                                                        :key="`user-${n}`"
                                                        persistent-hint
                                                        chips
                                                        item-text="username"
                                                        item-value="id"
                                                        >
                                                        <template v-slot:append-outer>
                                                        <v-icon
                                                            @click="addUserDialog = !addUserDialog"
                                                            v-text="'add'"
                                                            ></v-icon>
                                                        </template>
                                                    </v-autocomplete>
                                                  </v-flex>
                                              </v-layout>
                                            </template>

                                            <v-layout>
                                                <v-flex xs12>
                                                    <v-switch :name="'wallet'+n" :id="'wallet'+n" label="Create a Wallet?" v-model="wallet[n]" value=""></v-switch>
                                                </v-flex>
                                            </v-layout>

                                            <v-layout >
                                                <v-flex xs12 py-0>
                                                    <v-switch label="ADDRESS" v-model="showAddress"></v-switch>
                                                </v-flex>
                                            </v-layout>
                                            <template v-if="showAddress === true">
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-select
                                                            prepend-icon="toc"
                                                            :items="phoneMailTypeItems"
                                                            v-model="organizationAddress.type"
                                                            label="Type *"
                                                            hint="Address Type."
                                                            persistent-hint
                                                            :rules="[rules.required]"
                                                        >
                                                        </v-select>
                                                    </v-flex>
                                                </v-layout>
                                                
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-text-field
                                                            v-model="organizationAddress.line_1"
                                                            label="Address Line 1 *"
                                                            hint="Address Line 1" 
                                                            persistent-hint
                                                            prepend-icon="text_fields"
                                                            :rules="[rules.required]"
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-text-field
                                                            v-model="organizationAddress.line_2"
                                                            label="Address Line 2"
                                                            hint="Address Line 2" 
                                                            persistent-hint
                                                            prepend-icon="text_fields"
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                
                                                <v-layout>
                                                    <v-flex xs6 py-0>
                                                        <v-text-field
                                                            v-model="organizationAddress.city"
                                                            label="City"
                                                            hint="City Name" 
                                                            persistent-hint
                                                            prepend-icon="text_fields"
                                                            :rules="[rules.required]"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs6 py-0>
                                                        <v-text-field
                                                            v-model="organizationAddress.state"
                                                            label="State"
                                                            hint="State Name" 
                                                            persistent-hint
                                                            prepend-icon="text_fields"
                                                            :rules="[rules.required]"
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                
                                                <v-layout>
                                                    <v-flex xs6 py-0>
                                                      <v-select
                                                          prepend-icon="text_fields"
                                                          :items="countryItems"
                                                          v-model="organizationAddress.country"
                                                          label="Country"
                                                          hint="Country Name" 
                                                          persistent-hint
                                                          :rules="[rules.required]"
                                                          clearable
                                                      ></v-select>
                                                    </v-flex>
                                                    <v-flex xs6 py-0>
                                                        <v-text-field
                                                            v-model="organizationAddress.zip"
                                                            label="Zip"
                                                            hint="Zip Name" 
                                                            persistent-hint
                                                            prepend-icon="text_fields"
                                                            :rules="[rules.required]"
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            
                                            </template>

                                            <template v-if="selectCase">
                                                <v-layout >
                                                    <v-flex xs12 py-0>
                                                        <v-subheader class="pa-0 mt-3">CASE</v-subheader>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="roleSelected[n]"
                                                            :items="roleItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Case Role"
                                                            item-text="role"
                                                            item-value="_id"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.role }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.role"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row wrap>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuStartDate[n]"
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
                                                                    v-model="caseStartDate[n]"
                                                                    label="Start Date"
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="caseStartDate[n]"
                                                                :max="new Date().toISOString().substr(0, 10)"
                                                                min="1930-01-01"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuEndDate[n]"
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
                                                                    :v-model="caseEndDate[n]"
                                                                    label="End Date"
                                                                    prepend-icon="date_range"
                                                                    readonly
                                                                    clearable
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="caseEndDate[n]"
                                                                :min="caseStartDate[n]"
                                                                @input="menuEndDate[n] = false"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                </v-layout>
                                            </template>
                                            <v-layout >
                                                <v-flex xs12 py-0>
                                                    <v-switch label="ORGANIZATION" v-model="showOrganization[n]"></v-switch>
                                                </v-flex>
                                            </v-layout>
                                            <template v-if="showOrganization[n] === true">
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="organizationSelected[n]"
                                                            :items="organizationItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Organization *" 
                                                            hint="The Organization."
                                                            item-text="name"
                                                            item-value="_id"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.name }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="organizationRoleSelected[n]"
                                                            :items="organizationRoleItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Role *" 
                                                            hint="Associated Role ID."
                                                            persistent-hint
                                                            item-text="role"
                                                            item-value="_id"
                                                            :rules="[rules.required]"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.role }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.role"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-text-field
                                                            v-model="boss_level"
                                                            label="Boss Level"
                                                            hint="Boss Level" 
                                                            persistent-hint
                                                            prepend-icon="text_fields"
                                                            mask="##"
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                
                                                <v-layout row wrap>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuStartDateOrganization[n]"
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
                                                                    v-model="organizationStartDate[n]"
                                                                    label="Start Date *" 
                                                                    hint="Date when the organization Started"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="organizationStartDate[n]"
                                                                :max="new Date().toISOString().substr(0, 10)"
                                                                min="1930-01-01"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuEndDateOrganization[n]"
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
                                                                    v-model="organizationEndDate[n]"
                                                                    label="End Date *" 
                                                                    hint="Date when the organization ended"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="organizationEndDate[n]"
                                                                :min="organizationStartDate[n]"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                </v-layout>
                                            </template>


                                            <v-layout >
                                                <v-flex xs12 py-0>
                                                    <v-switch label="RELATIONSHIPS" v-model="showRelationship[n]"></v-switch>
                                                </v-flex>
                                            </v-layout>
                                            <template v-if="showRelationship[n] === true">
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="humanSelected[n]"
                                                            :items="humanItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Person *" 
                                                            hint="The Person identifier. Points to Person"
                                                            item-text="name"
                                                            item-value="_id"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.name }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="relationshipSelected[n]"
                                                            :items="relationshipItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Relationship Type *" 
                                                            hint="The Person Relationship type identifier."
                                                            persistent-hint
                                                            item-text="name"
                                                            item-value="_id"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.name }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row wrap>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuStartDateRelationship[n]"
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
                                                                    v-model="relationshipStartDate[n]"
                                                                    label="Start Date *" 
                                                                    hint="Date when the relationship Started"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="relationshipStartDate[n]"
                                                                :max="new Date().toISOString().substr(0, 10)"
                                                                min="1930-01-01"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuEndDateRelationship[n]"
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
                                                                    v-model="relationshipEndDate[n]"
                                                                    label="End Date *" 
                                                                    hint="Date when the relationship ended"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="relationshipEndDate[n]"
                                                                :min="relationshipStartDate[n]"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs12>
                                                        <v-textarea
                                                        v-model="relationshipMemo[n]"
                                                        prepend-icon="text_fields"
                                                        box
                                                        label="Memo"
                                                        value=""
                                                        ></v-textarea>
                                                    </v-flex>
                                                </v-layout>
                                            </template>

                                            <v-layout >
                                                <v-flex xs12 py-0>
                                                    <v-switch label="GROUPS" v-model="showGroup[n]"></v-switch>
                                                </v-flex>
                                            </v-layout>
                                            <template v-if="showGroup[n] === true">
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="groupSelected[n]"
                                                            :items="groupItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Group *" 
                                                            hint="Associated Group ID."
                                                            persistent-hint
                                                            item-text="name"
                                                            item-value="_id"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.name }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="groupRoleSelected[n]"
                                                            :items="groupRoleItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Group Role *" 
                                                            hint="Associated Group Role ID."
                                                            persistent-hint
                                                            item-text="name"
                                                            item-value="_id"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.name }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row wrap>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuStartDateGroup[n]"
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
                                                                    v-model="groupStartDate[n]"
                                                                    label="Start Date *" 
                                                                    hint="Date when the group Started"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="groupStartDate[n]"
                                                                :max="new Date().toISOString().substr(0, 10)"
                                                                min="1930-01-01"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuEndDateGroup[n]"
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
                                                                    v-model="groupEndDate[n]"
                                                                    label="End Date *" 
                                                                    hint="Date when the group ended"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="groupEndDate[n]"
                                                                :min="groupStartDate[n]"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                </v-layout>
                                            </template>

                                            <v-layout >
                                                <v-flex xs12 py-0>
                                                    <v-switch label="PROGRAMS" v-model="showPrograms[n]"></v-switch>
                                                </v-flex>
                                            </v-layout>
                                            <template v-if="showPrograms[n] === true">
                                                <v-layout>
                                                    <v-flex xs12 py-0>
                                                        <v-autocomplete
                                                            v-model="programsSelected[n]"
                                                            :items="programsItems"
                                                            prepend-icon="toc"
                                                            chips
                                                            clearable
                                                            label="Programs *" 
                                                            hint="Associated programs ID."
                                                            persistent-hint
                                                            item-text="name"
                                                            item-value="_id"
                                                        >
                                                            <template v-slot:selection="data">
                                                                <v-chip
                                                                :selected="data.selected"
                                                                small
                                                                class="chip--select-multi"
                                                                >
                                                                {{ data.item.name }}
                                                                </v-chip>
                                                            </template>
                                                            <template v-slot:item="data">
                                                                <template v-if="typeof data.item !== 'object'">
                                                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                                </template>
                                                                <template v-else>
                                                                    <v-list-tile-content>
                                                                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                                                    </v-list-tile-content>
                                                                </template>
                                                            </template>
                                                        </v-autocomplete>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                <v-flex xs12 py-0>
                                                    <v-autocomplete
                                                        v-model="programsRoleSelected[n]"
                                                        :items="programsRoleItems"
                                                        prepend-icon="toc"
                                                        chips
                                                        clearable
                                                        label="Role *" 
                                                        hint="Associated Program Role."
                                                        persistent-hint
                                                        item-text="role"
                                                        item-value="_id"
                                                        :rules="[rules.required]"
                                                    >
                                                        <template v-slot:selection="data">
                                                            <v-chip
                                                            :selected="data.selected"
                                                            small
                                                            class="chip--select-multi"
                                                            >
                                                            {{ data.item.role }}
                                                            </v-chip>
                                                        </template>
                                                        <template v-slot:item="data">
                                                            <template v-if="typeof data.item !== 'object'">
                                                                <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                                            </template>
                                                            <template v-else>
                                                                <v-list-tile-content>
                                                                    <v-list-tile-title v-html="data.item.role"></v-list-tile-title>
                                                                </v-list-tile-content>
                                                            </template>
                                                        </template>
                                                    </v-autocomplete>
                                                </v-flex>
                                            </v-layout>
                                                <v-layout row wrap>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuStartDatePrograms[n]"
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
                                                                    v-model="programsStartDate[n]"
                                                                    label="Start Date *" 
                                                                    hint="Date when the programs Started"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="programsStartDate[n]"
                                                                :max="new Date().toISOString().substr(0, 10)"
                                                                min="1930-01-01"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                    <v-flex xs6 py-0>
                                                        <v-menu
                                                            :v-model="menuEndDatePrograms[n]"
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
                                                                    v-model="programsEndDate[n]"
                                                                    label="End Date" 
                                                                    hint="Date when the programs ended"
                                                                    persistent-hint
                                                                    prepend-icon="date_range"
                                                                    clearable
                                                                    readonly
                                                                    v-on="on"
                                                                ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="programsEndDate[n]"
                                                                :min="programsStartDate[n]"
                                                            ></v-date-picker>
                                                        </v-menu>
                                                    </v-flex>
                                                </v-layout>
                                            </template>
                                        </v-container>
                                    </v-card-text>
                                    
                                </v-card>
                                </v-form>
                            </v-flex>
                                <v-btn flat @click="step = step - 1">Previous</v-btn>
                                <v-btn flat @click="bus.$emit('displayWhat', 'dashboard')">Cancel</v-btn>
                                <v-btn color="primary" v-if="personQnt === n" @click="create('a', n)">Create</v-btn>
                                <v-btn color="primary" v-else @click="create('a', n)">Continue</v-btn>
                            </v-stepper-content>
                        </template>    -->    
                    </template>
                    </v-stepper>
                </v-card>
        </v-flex>
           
      </v-layout>

      <v-dialog v-model="addUserDialog" max-width="500px">
        <v-card>
            <v-card-title>
            <span class="title">Add - System Account associated to this Person</span>
            </v-card-title>
            <v-card-text>
            <v-container grid-list-md py-0>
                <v-layout wrap>
                <v-flex xs12>
                    <v-text-field 
                        v-model="addUser.username" 
                        label="Username *" 
                        hint="The User's username. Must be an e-mail address." 
                        persistent-hint
                        counter
                        maxlength="255"
                        :rules="[rules.required, rules.email]"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field 
                        v-model="addUser.password" 
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
                <v-flex xs12>
                    <v-select
                        :items="userRoleItems"
                        v-model="addUser.roles"
                        hint="The User's role"
                        label="User's role *"
                        persistent-hint
                        clearable
                        attach
                        chips
                        :rules="[rules.required]"
                    ></v-select>
                </v-flex>
                <!-- <v-flex xs12>
                    <v-autocomplete
                        v-model="addUser.human"
                        hint="Person associated to this System Account"
                        :items="userItems"
                        clearable
                        label="Account Owner"
                        persistent-hint
                        attach
                        chips
                        item-text="username"
                        item-value="id"
                        >
                    </v-autocomplete>
                </v-flex>
                <v-flex xs12>
                    <v-switch v-model="addUser.portal_access" label="Portal Access"></v-switch>
                </v-flex> -->
                <v-flex xs12 py-0>
                    <v-switch v-model="addUser.changePasswordNextLogin" label="Force user to change password on next login"></v-switch>
                </v-flex>
                <v-flex xs12 py-0>
                    <v-switch v-model="addUser.active" label="Active"></v-switch>
                </v-flex>
                <v-flex xs12 py-0>
                    <v-select
                        :items="timezoneItems"
                        v-model="addUser.timezone"
                        hint="Timezone"
                        label="User's timezone"
                        persistent-hint
                        clearable
                        attach
                        chips
                        :rules="[rules.required]"
                    ></v-select>
                </v-flex>
                <v-flex xs12 py-0>
                    <v-select
                        :items="currencycodeItems"
                        v-model="addUser.currency_code"
                        hint="User preferred currency code"
                        label="Currency Code"
                        persistent-hint
                        clearable
                        attach
                        chips
                        :rules="[rules.required]"
                    ></v-select>
                </v-flex>
                <v-flex xs12 py-0>
                    <v-text-field 
                        v-model="addUser.currency_symbol" 
                        label="Currency symbol" 
                        hint="User preferred currency symbol" 
                        persistent-hint
                        counter
                        maxlength="255"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12 py-0>
                    <v-select
                        :items="currencydecimalItems"
                        v-model="addUser.currency_decimal"
                        hint="User preferred currency decimal"
                        label="Currency Decimal"
                        persistent-hint
                        clearable
                        attach
                        chips
                        :rules="[rules.required]"
                    ></v-select>
                </v-flex>
                <v-flex xs12 py-0>
                    <v-select
                        :items="currencydecimalItems"
                        v-model="addUser.currency_thousands"
                        hint="User preferred currency thousands"
                        label="Currency Thousands"
                        persistent-hint
                        clearable
                        attach
                        chips
                        :rules="[rules.required]"
                    ></v-select>
                </v-flex>
                <v-flex xs12 py-0>
                    <v-select
                        :items="languageItems"
                        v-model="addUser.language"
                        hint="User preferred Language"
                        label="Language"
                        persistent-hint
                        clearable
                        attach
                        chips
                        :rules="[rules.required]"
                    ></v-select>
                </v-flex>
                <v-flex xs12 py-0>
                    <v-select
                        :items="portalColorItems"
                        v-model="addUser.portal_color"
                        hint="User preferred portal color"
                        label="portal color"
                        persistent-hint
                        clearable
                        attach
                        chips
                        :rules="[rules.required]"
                    ></v-select>
                </v-flex>
                <v-flex xs12 py-0>
                    <v-switch v-model="addUser.portal_isDark" label="Is Portal Dark?"></v-switch>
                </v-flex>
                <v-flex xs12>
                     <small>*indicates required field</small>
                </v-flex>
                </v-layout>
            </v-container>
            </v-card-text>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="closeNewUser">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="createNewUser">Save</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
        <v-snackbar
            :timeout="4500"
            bottom
            right
            auto-height
            :color="snackbar.color"
            v-model="snackbar.show"
        >
            {{ snackbar.text }}
            <v-btn dark flat @click.native="snackbar.show = false" icon>
                <v-icon>close</v-icon>
            </v-btn>
        </v-snackbar>
    </v-container>
  </div>
</template>
<script>
import ClientsAdd from './ClientsAdd.vm.js';
export default ClientsAdd;
</script>
<style scoped lang="css">
.perfect--scrollbar {
  height: calc(100vh - 170px) !important;
}
.active {
  flex: none !important;
}
</style>
