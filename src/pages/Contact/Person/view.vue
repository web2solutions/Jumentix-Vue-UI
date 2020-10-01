<template>
  <div id="PersonView" class="pb-5">
    <v-container grid-view-xl fluid>
      <v-layout row wrap>
        <v-flex xs12 pb-2>
          <v-card class="white--text">
            <v-img src="/static/bg/user-panel-bg.png" height="150" class="primary">
              <v-container grid-view-xl fluid>
                <v-layout row wrap>
                  <v-flex xs1>
                    <v-avatar size="64">
                      <img
                        :src="personData.photo"
                        :alt="personData.first_name + ' ' + personData.last_name"
                      />
                    </v-avatar>
                  </v-flex>
                  <v-flex xs6>
                    <h3>{{ personData.first_name }} {{ personData.last_name }}</h3>
                    <span>
                      <b>Address:</b>
                      {{ personData.address[0].line_1 }}, {{ personData.address[0].city }}/{{ personData.address[0].state }} - {{ personData.address[0].country }}
                    </span>
                    <br />
                    <span>
                      <b>Phone:</b>
                      {{ personData.phone[0].country_code }} ({{ personData.phone[0].area_number }}) {{ personData.phone[0].number }}
                    </span>
                    <br />
                    <span>
                      <b>Email:</b>
                      {{ personData.email[0].email }} ({{ personData.email[0].type }})
                    </span>
                  </v-flex>

                  <v-flex xs5 class="pr-0 mr-0">
                    <v-layout pr-0 mr-0 column justify-end align-end fill-height>
                      <span class="online">
                        <i class="fa fa-circle success--text"></i> Online
                      </span>
                      <v-btn small>
                        <v-icon small>edit</v-icon>Edit Account
                      </v-btn>
                      <v-btn small>
                        <v-icon small>edit</v-icon>Edit Personal Information
                      </v-btn>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-img>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout wrap pt-4>
        <v-flex xs12>
          <v-toolbar flat class="pr-0" :dark="$vuetify.dark" color="transparent">
            <v-toolbar-title>Relationships</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn small color="primary">Add family relationship</v-btn>
            <v-btn small color="primary">Add social relationship</v-btn>
            <v-btn small color="primary">Add service relationship</v-btn>
          </v-toolbar>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <template v-for="(item, i) in parentsItems">
          <v-flex xs6 md4 pa-2 :key="i">
            <v-hover>
              <v-card
                class="card-mini"
                slot-scope="{ hover }"
                :class="`elevation-${hover ? 6 : 2}`"
                :dark="$vuetify.dark"
              >
                <v-card-text>
                  <v-layout>
                    <v-flex xs7 pb-0>
                      <v-layout align-start justify-start column fill-height pb-0>
                        <v-flex xs12>
                          <h1
                            :class="item.gender === 'Female' ? 'pink--text' : 'primary--text'"
                            class="title font-weight-light"
                          >{{ item.name }}</h1>
                        </v-flex>
                        <v-flex
                          xs12
                          pb-0
                          :class="item.gender === 'Female' ? 'pink--text text--lighten-3' : 'grey--text'"
                        >
                          <h2 class="body-1 font-weight-light">{{ item.role }}</h2>
                          <h2 class="body-1 font-weight-light">{{ item.gender }}</h2>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs5>
                      <v-img :src="item.photo" :alt="item.name" height="90" class="grey darken-1"></v-img>
                    </v-flex>
                  </v-layout>

                  <v-layout align-center justify-start wrap pt-3 class="toolbar-icons">
                    <v-tooltip top>
                      <v-badge
                        overlap
                        v-model="item.cases"
                        class="ml-2"
                        color="success"
                        slot="activator"
                      >
                        <template v-slot:badge>
                          <span>{{ item.cases }}</span>
                        </template>

                        <v-avatar size="28" color="primary red--after" v-ripple>
                          <v-icon small dark>insert_drive_file</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Cases</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge
                        overlap
                        v-model="item.casesNote"
                        class="ml-2"
                        color="success"
                        slot="activator"
                      >
                        <template v-slot:badge>
                          <span>{{ item.casesNote }}</span>
                        </template>

                        <v-avatar size="28" color="primary red--after" v-ripple>
                          <v-icon small dark>description</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Cases Notes</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge
                        overlap
                        v-model="item.tasks"
                        class="ml-2"
                        color="success"
                        slot="activator"
                      >
                        <template v-slot:badge>
                          <span>{{ item.tasks }}</span>
                        </template>

                        <v-avatar size="28" color="primary red--after" v-ripple>
                          <v-icon small dark>fas fa-tasks</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Tasks</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge
                        overlap
                        v-model="item.surveys"
                        class="ml-2"
                        color="success"
                        slot="activator"
                      >
                        <template v-slot:badge>
                          <span>{{ item.surveys }}</span>
                        </template>

                        <v-avatar size="28" color="primary red--after" v-ripple>
                          <v-icon small dark>poll</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Surveys</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge
                        overlap
                        v-model="item.events"
                        class="ml-2"
                        color="success"
                        slot="activator"
                      >
                        <template v-slot:badge>
                          <span>{{ item.events }}</span>
                        </template>

                        <v-avatar size="28" color="primary red--after" v-ripple>
                          <v-icon small dark>event</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Events</span>
                    </v-tooltip>
                    <v-spacer></v-spacer>
                    <v-btn small flat color="primary" :to="'/contacts/person/123'">See Contact</v-btn>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-flex>
        </template>
      </v-layout>

      <v-layout wrap pt-4>
        <v-flex xs12>
          <v-toolbar flat class="pr-0" :dark="$vuetify.dark" color="transparent">
            <v-toolbar-title>Cases</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn small color="primary">Add Case</v-btn>
          </v-toolbar>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <template v-for="(item, i) in caseItems">
          <v-flex xs6 md4 pa-2 :key="i">
            <v-hover>
              <v-card
                class="card-mini"
                slot-scope="{ hover }"
                :class="`elevation-${hover ? 6 : 2}`"
                :dark="$vuetify.dark"
              >
                <v-card-text>
                  <v-layout>
                    <v-flex xs7 pb-0>
                      <v-layout align-start justify-start column fill-height pb-0>
                        <v-flex xs12>
                          <h1 class="title font-weight-light primary--text">{{ item.case_name }}</h1>
                        </v-flex>
                        <v-flex xs12 pb-0 class="grey--text">
                          <h2 class="body-1 font-weight-light">{{ item.case_number }}</h2>
                          <h2 class="body-1 font-weight-light">{{ item.case_type }}</h2>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs5 text-xs-right>
                      <v-avatar size="80">
                        <v-icon>check</v-icon>
                      </v-avatar>
                    </v-flex>
                  </v-layout>

                  <v-layout align-center justify-start wrap pt-3 class="toolbar-icons">
                    <v-tooltip top>
                      <v-badge
                        overlap
                        v-model="item.casesNote"
                        class="ml-2"
                        color="success"
                        slot="activator"
                      >
                        <template v-slot:badge>
                          <span>{{ item.casesNote }}</span>
                        </template>

                        <v-avatar size="28" color="primary red--after" v-ripple>
                          <v-icon small dark>description</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Cases Notes</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge
                        overlap
                        v-model="item.tasks"
                        class="ml-2"
                        color="success"
                        slot="activator"
                      >
                        <template v-slot:badge>
                          <span>{{ item.tasks }}</span>
                        </template>

                        <v-avatar size="28" color="primary red--after" v-ripple>
                          <v-icon small dark>fas fa-tasks</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Tasks</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge
                        overlap
                        v-model="item.surveys"
                        class="ml-2"
                        color="success"
                        slot="activator"
                      >
                        <template v-slot:badge>
                          <span>{{ item.surveys }}</span>
                        </template>

                        <v-avatar size="28" color="primary red--after" v-ripple>
                          <v-icon small dark>poll</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Surveys</span>
                    </v-tooltip>

                    <v-spacer></v-spacer>
                    <v-btn small flat color="primary">See Case</v-btn>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-flex>
        </template>
      </v-layout>

      <v-layout wrap pt-4>
        <v-flex xs12>
          <v-toolbar flat class="pr-0" :dark="$vuetify.dark" color="transparent">
            <v-toolbar-title>Tasks</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn small color="primary">Add Task</v-btn>
          </v-toolbar>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <v-card :dark="$vuetify.dark" >
            <v-card-title primary-title pb-0>
              Home Study Group
            </v-card-title>
            <v-card-text pt-0>
              <v-layout row wrap>
                <template v-for="(item, i) in taskItems">
                  <v-flex xs6 md4 pa-2 :key="i">
                    <v-hover>
                      <v-card
                        class="card-mini"
                        slot-scope="{ hover }"
                        :class="`elevation-${hover ? 6 : 2}`"
                        :dark="$vuetify.dark"
                      >
                        <v-card-text>
                          <v-layout>
                            <v-flex xs7 pb-0>
                              <v-layout align-start justify-start column fill-height pb-0>
                                <v-flex xs12>
                                  <h1 class="title font-weight-light primary--text">{{ item.name }}</h1>
                                </v-flex>
                                <v-flex xs12 pb-0 class="grey--text">
                                  <h2 class="body-1 font-weight-light">{{ item.stage }}</h2>
                                  <h2 class="body-1 font-weight-light">Total Task: {{ item.total }}</h2>
                                </v-flex>
                              </v-layout>
                            </v-flex>

                            <v-flex xs5 text-xs-right>
                              <v-btn small flat color="primary">See Tasks</v-btn>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-hover>
                  </v-flex>
                </template>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout wrap pt-3>
        <v-flex xs12>
          <v-toolbar flat class="pr-0" :dark="$vuetify.dark" color="transparent">
            <v-toolbar-title>Surveys</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn small color="primary">Add Surveys</v-btn>
          </v-toolbar>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <v-card :dark="$vuetify.dark" >
            <v-card-text pt-0>
              <v-layout row wrap>
                <template v-for="(item, i) in surveysItems">
                  <v-flex xs6 md4 pa-2 :key="i">
                    <v-hover>
                      <v-card
                        class="card-mini"
                        slot-scope="{ hover }"
                        :class="`elevation-${hover ? 6 : 2}`"
                        :dark="$vuetify.dark"
                      >
                        <v-card-text>
                          <v-layout>
                            <v-flex xs8 pb-0>
                              <v-layout align-start justify-start column fill-height pb-0>
                                <v-flex xs12>
                                  <h1 class="title font-weight-light primary--text">{{ item.name }}</h1>
                                </v-flex>
                                <v-flex xs12 pb-0 class="grey--text">
                                  <h2 class="body-1 font-weight-light">{{ item.task }}</h2>
                                  <h2 class="body-1 font-weight-light">Total Questions: {{ item.total }}</h2>
                                </v-flex>
                              </v-layout>
                            </v-flex>

                            <v-flex xs4>
                              <v-btn small color="primary">See Questions</v-btn>
                              <v-btn small color="primary">My answers</v-btn>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-hover>
                  </v-flex>
                </template>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout wrap pt-3>
        <v-flex xs12>
          <v-toolbar flat class="pr-0" :dark="$vuetify.dark" color="transparent">
            <v-toolbar-title>Events</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn small color="primary">Add Event</v-btn>
          </v-toolbar>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <v-card :dark="$vuetify.dark" >
            <v-card-text pt-0>
              <v-layout row wrap>
                <template v-for="(item, i) in eventItems">
                  <v-flex xs6 md4 pa-2 :key="i">
                    <v-hover>
                      <v-card
                        class="card-mini"
                        slot-scope="{ hover }"
                        :class="`elevation-${hover ? 6 : 2}`"
                        :dark="$vuetify.dark"
                      >
                        <v-card-text>
                          <v-layout>
                            <v-flex xs8 pb-0>
                              <v-layout align-start justify-start column fill-height pb-0>
                                <v-flex xs12>
                                  <h1 class="title font-weight-light primary--text">{{ item.name }}</h1>
                                </v-flex>
                                <v-flex xs12 pb-0 class="grey--text">
                                  <h2 class="body-1 font-weight-light">{{ item.description }}</h2>
                                  <h2 class="body-1 font-weight-light">{{ item.status }}</h2>
                                </v-flex>
                              </v-layout>
                            </v-flex>

                            <v-flex xs4>
                              <v-btn small color="primary">Open Event</v-btn>
                              <v-btn small color="primary">Sign In</v-btn>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-hover>
                  </v-flex>
                </template>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout wrap pt-3>
        <v-flex xs12>
          <v-toolbar flat class="pr-0" :dark="$vuetify.dark" color="transparent">
            <v-toolbar-title>Forms</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn small color="primary">Add Form</v-btn>
          </v-toolbar>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <v-card :dark="$vuetify.dark">
            <v-card-text pt-0>
              <v-layout row wrap>
                <template v-for="(item, i) in formItems">
                  <v-flex xs6 md4 pa-2 :key="i">
                    <v-hover>
                      <v-card
                        class="card-mini"
                        slot-scope="{ hover }"
                        :class="`elevation-${hover ? 6 : 2}`"
                        :dark="$vuetify.dark"
                      >
                        <v-card-text>
                          <v-layout>
                            <v-flex xs8 pb-0>
                              <v-layout align-start justify-start column fill-height pb-0>
                                <v-flex xs12>
                                  <h1 class="title font-weight-light primary--text">{{ item.name }}</h1>
                                </v-flex>
                                <v-flex xs12 pb-0 class="grey--text">
                                  <h2 class="body-1 font-weight-light">{{ item.description }}</h2>
                                  <h2 class="body-1 font-weight-light">{{ item.status }}</h2>
                                </v-flex>
                              </v-layout>
                            </v-flex>

                            <v-flex xs4>
                              <v-btn small color="primary">Open Form</v-btn>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-hover>
                  </v-flex>
                </template>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

    </v-container>
  </div>
</template>
<script>
import ContactsPersonView from './view.vm.js';
export default ContactsPersonView;
</script>
<style scoped lang="css">
.person-img img {
  width: 250px;
  border: 1px solid #e6e2e2;
  padding: 6px;
}
.toolbar-icons i {
  cursor: pointer;
}
.online {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: x-small;
}
</style>
