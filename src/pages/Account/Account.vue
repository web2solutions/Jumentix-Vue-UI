<template>
  <vue-perfect-scrollbar class="perfect--scrollbar" id="Account">
    <v-container grid-list-xl fluid>
      <v-layout row wrap v-sortable-card @sorted="cardSortOccurred">
        <v-flex xs12 md6 lg4>
          <v-hover>
            <v-card 
              class="sortHandle" 
              slot-scope="{ hover }" 
              :class="`elevation-${hover ? 6 : 2}`"
            >
              <v-container grid-list-xs py-1 pr-0 mr-0>
                <v-layout row justify-space-between>
                  <v-flex xs8 class="card-title">
                    <h3>Account Information</h3>
                  </v-flex>
                  <v-flex xs4 pl-0>
                    <v-icon color="grey lighten-2" :class="`hover-icon-${hover ? 2 : 1}`">fas fa-info-circle</v-icon>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-card-actions>
                <v-btn dense to="/account-info">
                  <v-icon>list_alt</v-icon>
                  <span>View Topic</span>
                </v-btn>
              </v-card-actions> 
            </v-card>
          </v-hover>
        </v-flex>

        <v-flex xs12 md6 lg4>
          <v-hover>
            <v-card 
              class="sortHandle" 
              slot-scope="{ hover }" 
              :class="`elevation-${hover ? 6 : 2}`"
            >
              <v-container grid-list-xs py-1 pr-0 mr-0>
                <v-layout row justify-space-between>
                  <v-flex xs8 class="card-title">
                    <h3>Account Preferences</h3>
                  </v-flex>
                  <v-flex xs4 pl-0>
                    <v-icon color="grey lighten-2" :class="`hover-icon-${hover ? 2 : 1}`">fas fa-cogs</v-icon>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-card-actions>
                <v-btn dense to="/account-preference">
                  <v-icon>list_alt</v-icon>
                  <span>View Topic</span>
                </v-btn>
              </v-card-actions> 
            </v-card>
          </v-hover>
        </v-flex>

        <v-flex xs12 md6 lg4>
          <v-hover>
            <v-card 
              class="sortHandle" 
              slot-scope="{ hover }" 
              :class="`elevation-${hover ? 6 : 2}`"
            >
              <v-container grid-list-xs py-1 pr-0 mr-0>
                <v-layout row justify-space-between>
                  <v-flex xs8 class="card-title">
                    <h3>Dashboard</h3>
                  </v-flex>
                  <v-flex xs4 pl-0>
                    <v-icon color="grey lighten-2" :class="`hover-icon-${hover ? 2 : 1}`">fas fa-tachometer-alt</v-icon>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-card-actions>
                <v-btn dense to="/account-dashboard">
                  <v-icon>list_alt</v-icon>
                  <span>View Topic</span>
                </v-btn>
              </v-card-actions> 
            </v-card>
          </v-hover>
        </v-flex>

        <v-flex xs12 md6 lg4>
          <v-hover>
            <v-card 
              class="sortHandle" 
              slot-scope="{ hover }" 
              :class="`elevation-${hover ? 6 : 2}`"
            >
              <v-container grid-list-xs py-1 pr-0 mr-0>
                <v-layout row justify-space-between>
                  <v-flex xs8 class="card-title">
                    <h3>Relationships</h3>
                  </v-flex>
                  <v-flex xs4 pl-0>
                    <v-icon color="grey lighten-2" :class="`hover-icon-${hover ? 2 : 1}`">fas fa-tachometer-alt</v-icon>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-card-actions>
                <v-btn dense to="/account-relationships">
                  <v-icon>list_alt</v-icon>
                  <span>View Topic</span>
                </v-btn>
              </v-card-actions> 
            </v-card>
          </v-hover>
        </v-flex>

        <v-flex xs12 md6 lg4>
          <v-hover>
            <v-card 
              class="sortHandle" 
              slot-scope="{ hover }" 
              :class="`elevation-${hover ? 6 : 2}`"
            >
              <v-container grid-list-xs py-1 pr-0 mr-0>
                <v-layout row justify-space-between>
                  <v-flex xs8 class="card-title">
                    <h3>Security</h3>
                  </v-flex>
                  <v-flex xs4 pl-0>
                    <v-icon color="grey lighten-2" :class="`hover-icon-${hover ? 2 : 1}`">fas fa-lock</v-icon>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-card-actions>
                <v-btn dense to="/account-security">
                  <v-icon>list_alt</v-icon>
                  <span>View Topic</span>
                </v-btn>
              </v-card-actions> 
            </v-card>
          </v-hover>
        </v-flex>

        <v-flex xs12 md6 lg4>
          <v-hover>
            <v-card 
              class="sortHandle" 
              slot-scope="{ hover }" 
              :class="`elevation-${hover ? 6 : 2}`"
            >
              <v-container grid-list-xs py-1 pr-0 mr-0>
                <v-layout row justify-space-between>
                  <v-flex xs8 class="card-title">
                    <h3>References</h3>
                  </v-flex>
                  <v-flex xs4 pl-0>
                    <v-icon color="grey lighten-2" :class="`hover-icon-${hover ? 2 : 1}`">fas fa-lock</v-icon>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-card-actions>
                <v-btn dense to="/account-references">
                  <v-icon>list_alt</v-icon>
                  <span>View Topic</span>
                </v-btn>
              </v-card-actions> 
            </v-card>
          </v-hover>
        </v-flex>

      </v-layout>
    </v-container>
  </vue-perfect-scrollbar>
</template>
<script>
import Account from './Account.vm.js';
export default Account;
</script>
<style scoped lang="css">
.v-card__actions {
  display: block !important;
  text-align: center;
  height: 60px;
}
.card-title {
  height: 80px;
  padding-right: 0px !important;
}
.hover-icon-1 {
  font-size: 90px;
  position: absolute;
}
.hover-icon-2 {
  font-size: 95px;
  position: absolute;
}
</style>
