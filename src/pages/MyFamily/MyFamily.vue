<template>
  <div id="MyFamily" class="pb-5">
    <v-container grid-view-xl fluid>
      <v-layout wrap>
        <v-toolbar flat color="transparent" :dark="$vuetify.dark" class="pr-0">
          <v-toolbar-title>{{ familie.name }}</v-toolbar-title>
          <v-divider
            class="mx-2"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-layout
            align-right
            justify-end
            wrap
            class="toolbar-icons"
          >
            <v-tooltip top>
              <v-badge overlap v-model="familie.members" class="ml-2" color="success" slot="activator">
                <template v-slot:badge>
                  <span>{{ familie.members }}</span>
                </template>

                <v-avatar
                  size="28"
                  color="primary red--after"
                  v-ripple
                >
                  <v-icon small dark>family_restroom</v-icon>
                </v-avatar>
              </v-badge>
              <span>Members</span>
            </v-tooltip>

            <v-tooltip top>
              <v-badge overlap v-model="familie.relations" class="ml-2" color="success" slot="activator">
                <template v-slot:badge>
                  <span>{{ familie.relations }}</span>
                </template>

                <v-avatar
                  size="28"
                  color="primary red--after"
                  v-ripple
                >
                  <v-icon small dark>fas fa-people-arrows</v-icon>
                </v-avatar>
              </v-badge>
              <span>Family Relations</span>
            </v-tooltip>

            <v-tooltip top>
              <v-badge overlap v-model="familie.social" class="ml-2" color="success" slot="activator">
                <template v-slot:badge>
                  <span>{{ familie.social }}</span>
                </template>

                <v-avatar
                  size="28"
                  color="primary red--after"
                  v-ripple
                >
                  <v-icon small dark>fas fa-project-diagram</v-icon>
                </v-avatar>
              </v-badge>
              <span>Social Relations</span>
            </v-tooltip>

            <v-tooltip top>
              <v-badge overlap v-model="familie.service" class="ml-2" color="success" slot="activator">
                <template v-slot:badge>
                  <span>{{ familie.service }}</span>
                </template>

                <v-avatar
                  size="28"
                  color="primary red--after"
                  v-ripple
                >
                  <v-icon small dark>engineering</v-icon>
                </v-avatar>
              </v-badge>
              <span>Service Providers</span>
            </v-tooltip>

            <v-tooltip top>
              <v-badge overlap v-model="familie.wallet" class="ml-2" color="success" slot="activator">
                <template v-slot:badge>
                  <span>{{ familie.wallet }}</span>
                </template>

                <v-avatar
                  size="28"
                  color="primary red--after"
                  v-ripple
                >
                  <v-icon small dark>account_balance_wallet</v-icon>
                </v-avatar>
              </v-badge>
              <span>Wallet</span>
            </v-tooltip>

            <v-tooltip top>
              <v-badge overlap v-model="familie.invoices" class="ml-2" color="success" slot="activator">
                <template v-slot:badge>
                  <span>{{ familie.invoices }}</span>
                </template>

                <v-avatar
                  size="28"
                  color="primary red--after"
                  v-ripple
                >
                  <v-icon small dark>fas fa-file-invoice-dollar</v-icon>
                </v-avatar>
              </v-badge>
              <span>Invoices</span>
            </v-tooltip>

            <v-tooltip top>
              <v-badge overlap v-model="familie.cases" class="ml-2" color="success" slot="activator">
                <template v-slot:badge>
                  <span>{{ familie.cases }}</span>
                </template>

                <v-avatar
                  size="28"
                  color="primary red--after"
                  v-ripple
                >
                  <v-icon small dark>insert_drive_file</v-icon>
                </v-avatar>
              </v-badge>
              <span>Cases</span>
            </v-tooltip>

            <v-tooltip top>
              <v-badge overlap v-model="familie.casesNote" class="ml-2" color="success" slot="activator">
                <template v-slot:badge>
                  <span>{{ familie.casesNote }}</span>
                </template>

                <v-avatar
                  size="28"
                  color="primary red--after"
                  v-ripple
                >
                  <v-icon small dark>description</v-icon>
                </v-avatar>
              </v-badge>
              <span>Cases Notes</span>
            </v-tooltip>

            <v-tooltip top>
              <v-badge overlap v-model="familie.tasks" class="ml-2" color="success" slot="activator">
                <template v-slot:badge>
                  <span>{{ familie.tasks }}</span>
                </template>

                <v-avatar
                  size="28"
                  color="primary red--after"
                  v-ripple
                >
                  <v-icon small dark>fas fa-tasks</v-icon>
                </v-avatar>
              </v-badge>
              <span>Tasks</span>
            </v-tooltip>

            <v-tooltip top>
              <v-badge overlap v-model="familie.surveys" class="ml-2" color="success" slot="activator">
                <template v-slot:badge>
                  <span>{{ familie.surveys }}</span>
                </template>

                <v-avatar
                  size="28"
                  color="primary red--after"
                  v-ripple
                >
                  <v-icon small dark>poll</v-icon>
                </v-avatar>
              </v-badge>
              <span>Surveys</span>
            </v-tooltip>

            <v-tooltip top>
              <v-badge overlap v-model="familie.messages" class="ml-2" color="success" slot="activator">
                <template v-slot:badge>
                  <span>{{ familie.messages }}</span>
                </template>

                <v-avatar
                  size="28"
                  color="primary red--after"
                  v-ripple
                >
                  <v-icon small dark>email</v-icon>
                </v-avatar>
              </v-badge>
              <span>Messages</span>
            </v-tooltip>

            <v-tooltip top>
              <v-badge overlap v-model="familie.events" class="ml-2" color="success" slot="activator">
                <template v-slot:badge>
                  <span>{{ familie.events }}</span>
                </template>

                <v-avatar
                  size="28"
                  color="primary red--after"
                  v-ripple
                >
                  <v-icon small dark>event</v-icon>
                </v-avatar>
              </v-badge>
              <span>Events</span>
            </v-tooltip>
          </v-layout>
        </v-toolbar>
      </v-layout>

      <v-layout align-space-between justify-space-between row pa-4>
        <v-flex xs12 md6 :class="$vuetify.dark ? 'darkColor' : ''">
          <span><b>Address: </b> {{ familie.address_line_1 }}, {{ familie.address_city }}/{{ familie.address_state }} - {{ familie.address_country }}</span><br />
          <span><b>Phone: </b> {{ familie.phone_country_code }} ({{ familie.phone_area_number }}) {{ familie.phone_number }}</span><br />
          <span><b>Email: </b> {{ familie.email }}</span>
        </v-flex>
        <v-flex xs12 md6 text-xs-right class="family-img">
          <img :src="familie.photo" :alt="familie.name">
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs6 md4 pa-2>
          <v-hover>
            <v-card
              class="card-mini"
              slot-scope="{ hover }" 
              :class="`elevation-${hover ? 6 : 2}`"
              :dark="$vuetify.dark"
            >
              <v-card-text>
                <h4>Actual Couple</h4>
                <v-layout>
                  <v-flex xs6 pa-1>
                    <v-card>
                      <v-img
                        src="/static/users/mark.png"
                        height="90"
                        class="grey darken-1"
                      ></v-img>
                      <v-card-title dense class="subheading py-1 grey--text">Mark Livings</v-card-title>
                    </v-card>
                  </v-flex>
                  <v-flex xs6 pa-1>
                    <v-card>
                      <v-img
                        src="/static/users/letty.jpg"
                        height="90"
                        class="grey darken-1"
                      ></v-img>
                      <v-card-title dense class="subheading py-1 grey--text">Letty Livings</v-card-title>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex sm12 py-3>
          <h3>Parents</h3>
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
                          <h1 :class="item.gender === 'Female' ? 'pink--text' : 'primary--text'" class="title font-weight-light">{{ item.name }}</h1>
                        </v-flex>
                        <v-flex xs12 pb-0 :class="item.gender === 'Female' ? 'pink--text text--lighten-3' : 'grey--text'">
                          <h2 class="body-1 font-weight-light">{{ item.role }}</h2>
                          <h2 class="body-1 font-weight-light">{{ item.gender }}</h2>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs5>
                      <v-img
                        :src="item.photo"
                        :alt="item.name"
                        height="90"
                        class="grey darken-1"
                      ></v-img>
                    </v-flex>

                  </v-layout>

                  <v-layout
                    align-center
                    justify-start
                    wrap
                    pt-3
                    class="toolbar-icons"
                  >
                    <v-tooltip top>
                      <v-badge overlap v-model="item.cases" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.cases }}</span>
                        </template>

                        <v-avatar
                          size="28"
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
                          size="28"
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
                          size="28"
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
                          size="28"
                          color="primary red--after"
                          v-ripple
                        >
                          <v-icon small dark>poll</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Surveys</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge overlap v-model="item.events" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.events }}</span>
                        </template>

                        <v-avatar
                          size="28"
                          color="primary red--after"
                          v-ripple
                        >
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

      <v-layout row wrap>
        <v-flex sm12 py-3>
          <h3>Children</h3>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <template v-for="(item, i) in childrenItems">
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
                          <h1 :class="item.gender === 'Female' ? 'pink--text' : 'primary--text'" class="title font-weight-light">{{ item.name }}</h1>
                        </v-flex>
                        <v-flex xs12 pb-0 :class="item.gender === 'Female' ? 'pink--text text--lighten-3' : 'grey--text'">
                          <h2 class="body-1 font-weight-light">{{ item.role }}</h2>
                          <h2 class="body-1 font-weight-light">{{ item.gender }}</h2>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs5>
                      <v-img
                        :src="item.photo"
                        :alt="item.name"
                        height="90"
                        class="grey darken-1"
                      ></v-img>
                    </v-flex>

                  </v-layout>

                  <v-layout
                    align-center
                    justify-start
                    wrap
                    pt-3
                    class="toolbar-icons"
                  >
                    <v-tooltip top>
                      <v-badge overlap v-model="item.cases" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.cases }}</span>
                        </template>

                        <v-avatar
                          size="28"
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
                          size="28"
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
                          size="28"
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
                          size="28"
                          color="primary red--after"
                          v-ripple
                        >
                          <v-icon small dark>poll</v-icon>
                        </v-avatar>
                      </v-badge>
                      <span>Surveys</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <v-badge overlap v-model="item.events" class="ml-2" color="success" slot="activator">
                        <template v-slot:badge>
                          <span>{{ item.events }}</span>
                        </template>

                        <v-avatar
                          size="28"
                          color="primary red--after"
                          v-ripple
                        >
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

      <v-layout row wrap>
        <v-flex sm12 py-3>
          <h3>Service Relationships</h3>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <template v-for="(item, i) in servicesItems">
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
                          <h1 :class="item.gender === 'Female' ? 'pink--text' : 'primary--text'" class="title font-weight-light">{{ item.name }}</h1>
                        </v-flex>
                        <v-flex xs12 pb-0 :class="item.gender === 'Female' ? 'pink--text text--lighten-3' : 'grey--text'">
                          <h2 class="body-1 font-weight-light">{{ item.role }} of</h2>
                          <h2 class="body-1 font-weight-light">{{ item.whose }}</h2>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs5>
                      <v-img
                        :src="item.photo"
                        :alt="item.name"
                        height="90"
                        class="grey darken-1"
                      ></v-img>
                    </v-flex>

                  </v-layout>

                  <v-layout
                    align-center
                    justify-start
                    wrap
                    pt-3
                    class="toolbar-icons"
                  >
                    <v-spacer></v-spacer>
                    <v-btn small flat color="primary" :to="'/contacts/person/123'">See Contact</v-btn>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-flex>
        </template>
      </v-layout>

      <v-layout row wrap>
        <v-flex sm12 py-3>
          <h3>Social Relationships</h3>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <template v-for="(item, i) in socialItems">
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
                          <h1 :class="item.gender === 'Female' ? 'pink--text' : 'primary--text'" class="title font-weight-light">{{ item.name }}</h1>
                        </v-flex>
                        <v-flex xs12 pb-0 :class="item.gender === 'Female' ? 'pink--text text--lighten-3' : 'grey--text'">
                          <h2 class="body-1 font-weight-light">{{ item.role }} of</h2>
                          <h2 class="body-1 font-weight-light">{{ item.whose }}</h2>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs5>
                      <v-img
                        :src="item.photo"
                        :alt="item.name"
                        height="90"
                        class="grey darken-1"
                      ></v-img>
                    </v-flex>

                  </v-layout>

                  <v-layout
                    align-center
                    justify-start
                    wrap
                    pt-3
                    class="toolbar-icons"
                  >
                    <v-spacer></v-spacer>
                    <v-btn small flat color="primary" :to="'/contacts/person/123'">See Contact</v-btn>
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
import MyFamily from './MyFamily.vm.js';
export default MyFamily;
</script>
<style scoped lang="css">
.family-img img {
  width: 250px;
  border: 1px solid #e6e2e2;
  padding: 6px;
}
.toolbar-icons i {
  cursor: pointer;
}
.darkColor {
  background-color: #4D4D4D !important;
  color: #ffffff !important;
}

</style>
