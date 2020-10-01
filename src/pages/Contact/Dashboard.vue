<template>
  <div id="ContactsDashboard">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-toolbar :class="$vuetify.dark ? 'darkColor' : ''" class="elevation-0">
          <v-speed-dial
            v-model="fab"
            absolute
            top
            direction="bottom"
            open
            transition="slide-y-transition"
            class="fab fabAdd"
          >
            <v-btn slot="activator" v-model="fab" color="green" dark fab>
              <v-icon>add</v-icon>
              <v-icon>close</v-icon>
            </v-btn>

            <v-tooltip right>
              <v-btn fab dark small color="blue" slot="activator" to="/contacts/family/add">
                <v-icon small>fas fa-users</v-icon>
              </v-btn>
              <span>Create a new Family</span>
            </v-tooltip>
            <v-tooltip right>
              <v-btn fab dark small hover color="indigo" slot="activator">
                <v-icon>fas fa-users-cog</v-icon>
              </v-btn>
              <span>Manager Families</span>
            </v-tooltip>
          </v-speed-dial>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            placeholder="Search"
            hide-details
            clearable
            max-width="500px"
            :dark="$vuetify.dark"
          >
          </v-text-field>
          <v-spacer class="hidden-sm-and-down"></v-spacer>
        </v-toolbar>
        
        <v-flex xs12 text-xs-center pt-0>
          <v-btn 
            small
          >
            <span text-color="primary">Search</span>
          </v-btn>
          <v-btn 
            small 
            class="primary"
          >
            <v-icon small>find_in_page</v-icon>
            <span text-color="primary"> Advanced Search</span>
          </v-btn>
        </v-flex>

      </v-layout>

      <v-layout row wrap>
        <v-flex xs12 sm6 md3>
          <mini-chart
            :dark="$vuetify.dark"
            title="Families"
            icon="trending_up"
            :data="dataset.family"
            chart-color="#2196f3"
            type="donut"
            :bus="bus"
            entity="Family"
            :query="{}"
          >
          </mini-chart>
        </v-flex>
        <v-flex xs12 sm6 md3>
          <mini-chart
            :dark="$vuetify.dark"
            title="People"
            icon="trending_up"
            :data="dataset.people"
            chart-color="#2196f3"
            type="donut"
            :bus="bus"
            entity="Human"
          >
          </mini-chart>
        </v-flex>
        <v-flex xs12 sm6 md3>
          <mini-chart
            :dark="$vuetify.dark"
            title="System Users"
            icon="trending_up"
            :data="dataset.users"
            chart-color="#2196f3"
            type="donut"
            :bus="bus"
            entity="User"
          >
          </mini-chart>
        </v-flex>
        <v-flex xs12 sm6 md3>
          <mini-chart
            :dark="$vuetify.dark"
            title="Organizations"
            icon="trending_up"
            :data="dataset.organizations"
            chart-color="#2196f3"
            type="donut"
            :bus="bus"
            entity="Organization"
          >
          </mini-chart>
        </v-flex>
      </v-layout>

      <v-layout wrap>
        <v-flex xs12>
          <v-toolbar flat class="pr-0" :class="$vuetify.dark ? 'darkColor' : ''" :dark="$vuetify.dark">
            <v-toolbar-title>Families (Fake Data)</v-toolbar-title>
            <v-divider
              class="mx-2"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <template v-for="(item, i) in familiesItemOff">
          <v-flex xs6 md4 :key="i">
            <v-hover>
              <v-card
                class="card-mini"
                slot-scope="{ hover }" 
                :class="`elevation-${hover ? 6 : 2}`"
                @click.native="cardClick"
                :dark="$vuetify.dark"
              >
                <v-card-text>
                  <v-layout>
                    <v-flex xs7 pb-0>
                      <v-layout align-start justify-space-between column fill-height pb-0>
                        <v-flex xs12>
                          <h1 class="title font-weight-light primary--text">{{ item.name }}</h1>
                        </v-flex>
                        <v-flex xs12 pb-0>
                          <h2 class="body-1 font-weight-light grey--text">{{ item.address_city }}, {{ item.address_state }} - {{ item.address_country }}</h2>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs5>
                      <img class="family-img" :src="item.photo" :alt="item.name">
                    </v-flex>
                  </v-layout>

                  <v-layout
                    align-center
                    justify-start
                    wrap
                  >
                    <v-tooltip top>
                      <v-badge overlap v-model="item.cases" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.cases }}</span>
                        </template>

                        <v-avatar
                          size="32"
                          color="primary red--after"
                          v-ripple
                        >
                          <v-icon small dark>insert_drive_file</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Cases</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge overlap v-model="item.casesNote" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.casesNote }}</span>
                        </template>

                        <v-avatar
                          size="32"
                          color="primary red--after"
                          v-ripple
                        >
                          <v-icon small dark>description</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Cases Notes</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge overlap v-model="item.tasks" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.tasks }}</span>
                        </template>

                        <v-avatar
                          size="32"
                          color="primary red--after"
                          v-ripple
                        >
                          <v-icon small dark>fas fa-tasks</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Tasks</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge overlap v-model="item.surveys" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.surveys }}</span>
                        </template>

                        <v-avatar
                          size="32"
                          color="primary red--after"
                          v-ripple
                        >
                          <v-icon small dark>poll</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Surveys</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge overlap v-model="item.messages" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.messages }}</span>
                        </template>

                        <v-avatar
                          size="32"
                          color="primary red--after"
                          v-ripple
                        >
                          <v-icon small dark>email</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Messages</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge overlap v-model="item.events" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.events }}</span>
                        </template>

                        <v-avatar
                          size="32"
                          color="primary red--after"
                          v-ripple
                        >
                          <v-icon small dark>event</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Events</span>
                    </v-tooltip>
                    <v-spacer></v-spacer>
                    <v-btn small flat color="primary" :to="'/contacts/family/view/123'">See Family</v-btn>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-flex>
        </template>
      </v-layout>

      <v-layout wrap>
        <v-flex xs12>
          <v-toolbar flat class="pr-0" :class="$vuetify.dark ? 'darkColor' : ''" :dark="$vuetify.dark">
            <v-toolbar-title>Families (Data from API)</v-toolbar-title>
            <v-divider
              class="mx-2"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <template v-for="(item, i) in familiesItem">
          <v-flex xs6 md4 :key="i">
            <v-hover>
              <v-card
                class="card-mini"
                slot-scope="{ hover }" 
                :class="`elevation-${hover ? 6 : 2}`"
                @click.native="cardClick"
                :dark="$vuetify.dark"
              >
                <v-card-text>
                  <v-layout>
                    <v-flex xs7 pb-0>
                      <v-layout align-start justify-space-between column fill-height pb-0>
                        <v-flex xs12>
                          <h1 class="title font-weight-light primary--text">{{ item.name }}</h1>
                        </v-flex>
                        <v-flex xs12 pb-0>
                          <h2 class="body-1 font-weight-light grey--text">{{ item.address_city }}, {{ item.address_state }} - {{ item.address_country }}</h2>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs5>
                      <img class="family-img" :src="item.photo" :alt="item.name">
                    </v-flex>
                  </v-layout>

                  <v-layout
                    align-center
                    justify-start
                    wrap
                  >
                    <v-tooltip top>
                      <v-badge overlap v-model="item.cases" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.cases }}</span>
                        </template>

                        <v-avatar
                          size="32"
                          color="primary red--after"
                          v-ripple
                        >
                          <v-icon small dark>insert_drive_file</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Cases</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge overlap v-model="item.casesNote" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.casesNote }}</span>
                        </template>

                        <v-avatar
                          size="32"
                          color="primary red--after"
                          v-ripple
                        >
                          <v-icon small dark>description</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Cases Notes</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge overlap v-model="item.tasks" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.tasks }}</span>
                        </template>

                        <v-avatar
                          size="32"
                          color="primary red--after"
                          v-ripple
                        >
                          <v-icon small dark>fas fa-tasks</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Tasks</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge overlap v-model="item.surveys" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.surveys }}</span>
                        </template>

                        <v-avatar
                          size="32"
                          color="primary red--after"
                          v-ripple
                        >
                          <v-icon small dark>poll</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Surveys</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge overlap v-model="item.messages" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.messages }}</span>
                        </template>

                        <v-avatar
                          size="32"
                          color="primary red--after"
                          v-ripple
                        >
                          <v-icon small dark>email</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Messages</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge overlap v-model="item.events" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.events }}</span>
                        </template>

                        <v-avatar
                          size="32"
                          color="primary red--after"
                          v-ripple
                        >
                          <v-icon small dark>event</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Events</span>
                    </v-tooltip>
                    <v-spacer></v-spacer>
                    <v-btn small flat color="primary" :to="'/contacts/family/view/123'">See Family</v-btn>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-flex>
        </template>
      </v-layout>

    </v-container>
  </div>
</template>
<script>
import ContactsDashboard from './Dashboard.vm.js';
export default ContactsDashboard;
</script>
<style scoped lang="css">
.fabAdd {
  z-index: 2 !important;
}
.family-img {
  width: 100%;
  border: 1px solid #e6e2e2;
  padding: 3px;
}
.darkColor {
  background-color: #4D4D4D !important;
}
</style>
