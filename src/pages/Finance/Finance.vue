<template>
    <v-container id="Finance">
      <v-layout row>
        <component-menu-nav></component-menu-nav>
      </v-layout>

      <vue-perfect-scrollbar class="perfect--scrollbar">

      <v-container grid-list-xs py-0>
        <v-layout row class="d-block" :class="$vuetify.dark ? 'darkColor' : ''">
          <div class="title">
            Total Receivables
          </div>
          <div class="subheading">
            Total Receivables {{ this.amount.toLocaleString(session.user().language, { style: 'currency', currency: session.user().currency_code }) }}
          </div>
          <v-progress-linear
            color="info"
            height="6"
            value="81"
            class="progress"
          ></v-progress-linear>
        </v-layout>

        <v-container grid-list-xl pa-0>
          <v-layout row wrap>
            <v-flex>
              <v-card v-ripple :dark="$vuetify.dark">
                <v-card-text>
                  <div class="subheading font-weight-thin">CURRENT</div>
                  <div class="title">$0.00</div>
                  <div class="subheading font-weight-thin">&nbsp;</div>
                </v-card-text>          
              </v-card>
            </v-flex>
            <v-flex>
              <v-card v-ripple :dark="$vuetify.dark">
                <v-card-text>
                  <div class="subheading font-weight-thin">1-15 Days</div>
                  <div class="title">$5,000.00</div>
                  <div class="subheading font-weight-thin">&nbsp;</div>
                </v-card-text>          
              </v-card>
            </v-flex>
            <v-flex>
              <v-card v-ripple :dark="$vuetify.dark">
                <v-card-text>
                  <div class="subheading font-weight-thin">16-30 Days</div>
                  <div class="title">$5,000.00</div>
                  <div class="subheading font-weight-thin">&nbsp;</div>
                </v-card-text>          
              </v-card>
            </v-flex>
            <v-flex >
              <v-card v-ripple :dark="$vuetify.dark">
                <v-card-text>
                  <div class="subheading font-weight-thin">31-45 Days</div>
                  <div class="title">$0.00</div>
                  <div class="subheading font-weight-thin">&nbsp;</div>
                </v-card-text>          
              </v-card>
            </v-flex>
            <v-flex>
              <v-card v-ripple :dark="$vuetify.dark">
                <v-card-text>
                  <div class="subheading font-weight-thin">Above 45 days</div>
                  <div class="title">$0.00</div>
                  <div class="subheading font-weight-thin">&nbsp;</div>
                </v-card-text>          
              </v-card>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex>
              <v-widget title="Sales and Expenses" :dark="$vuetify.dark">
                <v-btn icon slot="widget-header-action" :dark="$vuetify.dark">
                  <v-icon class="text--secondary">refresh</v-icon>
                </v-btn>
                <div slot="widget-content" :class="$vuetify.dark ? 'darkColor' : ''">
                    <e-chart 
                    :path-option="[
                      ['dataset.source', siteTrafficData],
                      ['color', [color.lightBlue.base, color.green.lighten1]],
                      ['legend.show', true],
                      ['xAxis.axisLabel.show', true],
                      ['yAxis.axisLabel.show', true],
                      ['grid.left', '2%'],
                      ['grid.bottom', '5%'],
                      ['grid.right', '3%'],
                      ['series[0].type', 'bar'],
                      ['series[0].areaStyle', {}],
                      ['series[0].smooth', true],
                      ['series[1].smooth', true],
                      ['series[1].type', 'bar'],
                      ['series[1].areaStyle', {}],
                      ['series[2].smooth', true],
                      ['series[2].type', 'bar'],
                      ['series[2].areaStyle', {}],
                    ]"
                    height="300px"
                    width="100%"
                    :class="$vuetify.dark ? 'darkColor' : ''"
                    >
                    </e-chart>     
                </div>
              </v-widget>  
            </v-flex>
          </v-layout>
        </v-container>

        
      </v-container>
      </vue-perfect-scrollbar>
    </v-container>
</template>

<script>
import Finance from './Finance.vm.js';
export default Finance;
</script>

<style scoped lang="css">
.progress{
  z-index: 0;
}
.perfect--scrollbar {
  height: calc(100vh - 230px);
}
.darkColor {
  background-color: #4D4D4D !important;
  color: #ffffff !important;
}
</style>
