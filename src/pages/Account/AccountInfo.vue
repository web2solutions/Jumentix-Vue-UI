<template>
  <div id="AccountInfo">
    <v-container grid-list-md>
      <v-layout wrap>
        <v-flex
        xs12
        md8
        >
          <name-card
            :cardBgImage="cardBgImage"
            :role="role"
            :name="name"
            :avatar="avatar"
            :dark="dark"
            :mini="false"
            :topNav="false"
            :bottomNav="false"
            :color="color"
          >
            <a color="green darken-4" href="#"><i color="green darken-4" class="fa fa-circle text-success"></i> Online</a>
          </name-card>
          
          <v-card
            title="Edit Profile"
            text="Complete your profile"
          >
            <v-tabs
              v-model="defaultTab"
              
              center-active
              centered
              
            >
              <v-tab @click="showTab('overview')">
                Overview
              </v-tab>
              <v-tab @click="showTab('account_information')">
                Account Information
              </v-tab>
              <v-tab @click="showTab('personal_information')">
                Personal Information
              </v-tab>
              <v-tab @click="showTab('relationships')">
                Relationships
              </v-tab>
              <v-tab @click="showTab('credit_card_stripe')">
                Credit Card
              </v-tab>
              <v-tab @click="showTab('access')">
                Access Info
              </v-tab>
            </v-tabs>
          </v-card>
          <v-card key="overview" v-show="currentTab === 'overview'">
            <!-- start Case -->
              <v-card>
                <v-toolbar card dense color="primary">
                  <v-toolbar-title><h4>Cases</h4></v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text class="pa-0">
                  <v-list two-line class="pa-0">
                    <template v-for="(item, index) in caselist">
                      <template v-if="item.deleted !== true">
                        <v-list-tile :key="item._id" @click="handleClick(item, 'case', index)">
                          <v-list-tile-content>
                            <v-list-tile-title>
                              <b :id="'profile_case_' + item._id">
                                <v-progress-linear stream buffer-value="0" :indeterminate="true"></v-progress-linear>
                              </b>
                            </v-list-tile-title>
                            <v-list-tile-sub-title>
                              My role on case: 
                              <b :id="'profile_case_role_' + item._id">
                                <v-progress-linear stream buffer-value="0" :indeterminate="true"></v-progress-linear>
                              </b>
                            </v-list-tile-sub-title>
                            <v-list-tile-sub-title>
                              Started at: {{moment.tz(item.startDate, session.user.timezone).format('llll')}}. 
                              {{typeof item.endDate !== 'undefined' ? 'Ended at: '+ moment.tz(item.endDate, session.user.timezone).format('llll') : ''}}
                            </v-list-tile-sub-title>
                            {{ xfillField ({collection: 'Case', labelKey: 'display_name, case_number' }, item.case, 'profile_case_' + item._id) }}
                            {{ xfillField ({collection: 'CaseHumanRole', labelKey: 'role' }, item.role, 'profile_case_role_' + item._id) }}
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-divider :key="index"></v-divider>
                      </template>
                      
                    </template>
                  </v-list>
                  <!-- <v-divider></v-divider>
                  <v-btn block flat class="ma-0">All</v-btn>
                  <v-divider></v-divider> -->
                </v-card-text>
              </v-card>
            <!-- end Case -->
            <!-- start CaseNote -->
              <v-card>
                <v-toolbar card dense color="primary">
                  <v-toolbar-title><h4>Case Notes</h4></v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text class="pa-0">
                  <v-list two-line class="pa-0">
                    <template v-for="(item, index) in casenotelist">
                      <v-list-tile :key="item._id" @click="handleClickGeneric(item, 'CaseNote', index)">
                        <v-list-tile-content>
                          <v-list-tile-title>
                            <b>{{item.subject}}</b>. 
                          </v-list-tile-title>
                          <v-list-tile-sub-title>
                            Case: 
                            <b :id="'profile_case_note_' + item._id">
                              <v-progress-linear stream buffer-value="0" :indeterminate="true"></v-progress-linear>
                            </b>
                          </v-list-tile-sub-title>
                          <v-list-tile-sub-title>
                            Note type: 
                            <b :id="'profile_case_note_type_' + item._id">
                              <v-progress-linear stream buffer-value="0" :indeterminate="true"></v-progress-linear>
                            </b>
                          </v-list-tile-sub-title>
                          <v-list-tile-sub-title>
                            Start date: {{moment.tz(item.startDate, session.user.timezone).format('llll')}}. 
                            {{typeof item.endDate !== 'undefined' ? 'End date: '+ moment.tz(item.endDate, session.user.timezone).format('llll') : ''}}
                          </v-list-tile-sub-title>
                          {{ xfillField ({collection: 'Case', labelKey: 'display_name, case_number' }, item.case, 'profile_case_note_' + item._id) }}
                          {{ xfillField ({collection: 'CaseNoteType', labelKey: 'type' }, item.type, 'profile_case_note_type_' + item._id) }}
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-divider :key="index"></v-divider>
                    </template>
                  </v-list>
                  <!-- <v-divider></v-divider>
                  <v-btn block flat class="ma-0">All</v-btn>
                  <v-divider></v-divider> -->
                </v-card-text>
              </v-card>
            <!-- end CaseNote -->
            <!-- start Group -->
              <v-card>
                <v-toolbar card dense color="primary">
                  <v-toolbar-title><h4>Groups</h4></v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text class="pa-0">
                  <v-list two-line class="pa-0">
                    <template v-for="(item, index) in grouplist">
                      <v-list-tile :key="item._id" @click="handleClick(item, 'group', index)">
                        <v-list-tile-content>
                          <v-list-tile-title>
                            <b :id="'profile_group_' + item._id"><v-progress-linear buffer-value="0" stream :indeterminate="true"></v-progress-linear></b>
                          </v-list-tile-title>
                          
                          <v-list-tile-sub-title>My role on group: <b :id="'profile_group_role_' + item._id"><v-progress-linear buffer-value="0" stream :indeterminate="true"></v-progress-linear></b></v-list-tile-sub-title>
                          <v-list-tile-sub-title>Joined at: {{moment.tz(item.startDate, session.user.timezone).format('llll')}}. {{typeof item.endDate !== 'undefined' ? 'Left at: '+ moment.tz(item.endDate, session.user.timezone).format('llll') : ''}}</v-list-tile-sub-title>
                          {{ xfillField ({collection: 'Group', labelKey: 'name' }, item.group, 'profile_group_' + item._id) }}
                          {{ xfillField ({collection: 'GroupRole', labelKey: 'name' }, item.role, 'profile_group_role_' + item._id) }}
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-divider :key="index"></v-divider>
                    </template>
                  </v-list>
                  <!-- <v-divider></v-divider>
                  <v-btn block flat class="ma-0">All</v-btn>
                  <v-divider></v-divider> -->
                </v-card-text>
              </v-card>
            <!-- end Group -->
            
            
            
            <v-card-actions>
              <v-spacer></v-spacer>
              actions
            </v-card-actions>
          </v-card>
          <v-card key="account_information" v-show="currentTab === 'account_information'">
            <xSimpleForm
              :entity="'User'"
              :bus="bus"
              key="User"
              :hideFields="['human', 'roles', 'portal_access', 'active', 'access']"
              :formData="session.user"
            ></xSimpleForm>
          </v-card>
          <v-card key="personal_information" v-show="currentTab === 'personal_information'">
            <xSimpleForm v-if="session.user.role === 'parent' || session.user.role === 'child' || session.user.role === 'staff'"
              :entity="'Human'"
              :bus="bus"
              key="Human"
              :hideFields="['user', 'program', 'case', 'group', 'active']"
              :formData="session.user.human"
            ></xSimpleForm>
            <xSimpleForm v-else
              :entity="'Human'"
              :bus="bus"
              key="Human"
              :hideFields="['user', 'active']"
              :formData="session.user.human"
            ></xSimpleForm>
          </v-card>
          <v-card key="relationships" v-show="currentTab === 'relationships'">
           <!-- start relationships -->
              <v-card>
                <v-toolbar card dense color="primary">
                  <v-toolbar-title><h4>Relationships</h4></v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text class="pa-0">
                  <v-list two-line class="pa-0">
                    <template v-for="(item, index) in relationshiplist">
                      <v-list-tile :key="item._id" @click="handleClick(item, 'human_relationship', index)">
                        <v-list-tile-content>
                          <v-list-tile-title>
                            <b :id="'profile_human_' + item._id">
                              <v-progress-linear stream buffer-value="0" :indeterminate="true"></v-progress-linear>
                            </b>
                          </v-list-tile-title>
                          <v-list-tile-sub-title>
                            Relationship type: 
                            <b :id="'profile_relationship_type_' + item._id">
                              <v-progress-linear stream buffer-value="0" :indeterminate="true"></v-progress-linear>
                            </b>
                          </v-list-tile-sub-title>
                          <v-list-tile-sub-title>
                            Started at: {{moment.tz(item.startDate, session.user.timezone).format('llll')}}. 
                            {{typeof item.endDate !== 'undefined' ? 'Ended at: '+ moment.tz(item.endDate, session.user.timezone).format('llll') : ''}}
                          </v-list-tile-sub-title>
                          {{ xfillField ({collection: 'Human', labelKey: 'first_name, last_name' }, item.human, 'profile_human_' + item._id) }}
                          {{ xfillField ({collection: 'HumanRelationship', labelKey: 'label' }, item.relationship_type, 'profile_relationship_type_' + item._id) }}
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-divider :key="index"></v-divider>
                    </template>
                  </v-list>
                </v-card-text>
              </v-card>
            <!-- end relationships -->
          </v-card>

          <v-card key="access" v-show="currentTab === 'access'">
            <!-- start tracking -->
              <v-card>
                <v-toolbar card dense color="primary">
                  <v-toolbar-title><h4>Access Information</h4></v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text style="max-height: 100%;" class="pa-0">
                  <v-list two-line class="pa-0">
                    <template v-for="(item, index) in accesslist">
                      <v-list-tile :key="item._id" @click="handleClick(item, 'access', index)">
                        <v-list-tile-content>
                          <v-list-tile-title>{{moment.tz(item.date, session.user.timezone).format('llll')}} - {{moment.tz(item.date, session.user.timezone).fromNow()}}</v-list-tile-title>
                          <v-list-tile-sub-title>Device: {{item.device}}. Browser: {{item.browser}}. Operational System: {{item.os}}.</v-list-tile-sub-title>
                          <v-list-tile-sub-title>From: {{item.city}}, {{item.state}}. {{item.country}}.</v-list-tile-sub-title>
                          <v-list-tile-sub-title>IP: {{item.ip}}. Session ID: {{item.session_id}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-divider :key="index"></v-divider>
                    </template>
                  </v-list>
                </v-card-text>
              </v-card>
            <!-- end tracking -->
          </v-card>

          <v-card key="credit_card_stripe" v-show="currentTab === 'credit_card_stripe'">
            <!-- start tracking -->
              <v-card>
                <v-toolbar card dense color="primary">
                  <v-toolbar-title><h4>Save credit card</h4></v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text style="max-height: 100%;" class="pa-0">
                  <form action="/charge" method="post" id="payment-form">
                    <div class="form-row">
                      <label for="card-element">Card</label>
                      <div id="card-element">
                        <!-- A Stripe Element will be inserted here. -->
                      </div>

                      <!-- Used to display Element errors. -->
                      <div id="card-errors" role="alert"></div>
                    </div>

                    <button>Save credit card</button>
                  </form>
                </v-card-text>
              </v-card>
            <!-- end tracking -->
          </v-card>
        </v-flex>
        

      <v-flex
        xs12
        md4
      >
        <v-card class="v-card-profile">
          <v-avatar
            slot="offset"
            class="mx-auto d-block"
            size="130"
          >
            <img
              v-bind:src="avatar.src" v-bind:alt="name"
            >
          </v-avatar>
          <v-card-text class="text-xs-center">
            <h6 class="category text-gray font-weight-thin mb-3">CEO / CO-FOUNDER</h6>
            <h4 class="card-title font-weight-light">{{name}}</h4>
            <p class="card-description font-weight-light">Don't be scared of the truth because we need to restart the human foundation in truth And I love you like Kanye loves Kanye I love Rick Owens’ bed design but the back is...</p>
            <v-btn
              color="success"
              round
              class="font-weight-light"
            >Follow</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        xs12
        md8
        >
          
        </v-flex>
      </v-layout>
    </v-container>
    
  </div>
</template>
<script>
import AccountInfo from './AccountInfo.vm.js';
export default AccountInfo;
</script>
<style scoped lang="css">
.v-card__text {
  max-height: 280px;
  
  text-align: center;
  position: relative;
  overflow: scroll;
}

</style>
