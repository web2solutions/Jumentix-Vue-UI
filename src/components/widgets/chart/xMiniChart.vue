
<template>
  <v-hover>
    <v-card
      class="card-mini"
      slot-scope="{ hover }" 
      :class="`elevation-${hover ? 6 : 2}`"
      @click.native="cardClick"
      :dark="dark"
    >
      <v-card-text>
        <div class="layout row ma-0 pt-2 align-center justify-space-between">
          <div class="text-box">
            <div class="mini-chart-title">{{title}}</div>
            <span class="display-2">{{subTitleTotal}}</span>
          </div>
          <div class="chart" v-if="type !== 'pie'">
            <e-chart 
              :path-option="computeChartOption"
              height="78px"
              width="100%"
              >
            </e-chart>
          </div>
          <div class="chart" v-else>
            <e-chart 
              :path-option="computeChartOption"
              height="78px"
              width="100%"
              >
            </e-chart>  
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-hover> 
</template>

<script>
import Vue from 'vue';
import EChart from '@/components/chart/echart';
import Material from 'vuetify/es5/util/colors';
import { getFromApi, getLocalCollection, feedGrid } from '../../../helpers/helpers';
export default {
  components: {
    EChart
  },
  props: {
    title: String,
    // subTitle: String,
    // subTitleTotal: String,
    icon: String,
    iconColor: {
      type: String,
      default: 'success',
    },
    type: String,
    dark: Boolean,
    chartColor: String,
    data: Array,
    entity: String,
    query: Object,
    populate: String,
    field: String,
    target: String,
    onlineUsers: Number,
    bus: {
      type: Object,
      default: function () { return {} },
    }
  },
  data () {
    return {
      pagination: {
        sortBy: '_id',
        descending: true,
        page: 1,
        rowsPerPage: 10, // -1 for All
        totalItems: 0
      },
      defaultOption: [
        ['dataset.source', this.data],
        ['xAxis.show', false],
        ['yAxis.show', false],
        ['color', [this.chartColor]],
      ],
      color: Material,
      subTitleTotal: 0,
      subTitle: 0,
      newQuery: null
    };
  },

  computed: {
    swagger () {
      return this.store.state.swagger;
    },
    computeChartOption () {
      switch (this.type) {
        case 'bar':
          this.defaultOption.push(['series[0].type', 'bar']);
          break;
        case 'area':
          this.defaultOption.push(['series[0].type', 'line']);
          this.defaultOption.push(['series[0].areaStyle', {}]);
          break;
        case 'donut':
          // this.defaultOption.push(['series[0].type', 'line']);
          this.defaultOption.push(['color', [this.color.lightBlue.base, this.color.indigo.base, this.color.pink.base, this.color.green.base, this.color.cyan.base, this.color.teal.base, this.color.orange.base]]);
          this.defaultOption.push(['series[0].areaStyle', {}]);
          this.defaultOption.push(['legend.orient', 'vertical']);
          this.defaultOption.push(['legend.left', 5]);
          this.defaultOption.push(['legend.top', 'middle']);
          this.defaultOption.push(['legend.itemHeight', 10]);
          this.defaultOption.push(['legend.itemGap', 2]);
          this.defaultOption.push(['legend.type', 'scroll']);
          this.defaultOption.push(['legend.orient', 'vertical']);
          this.defaultOption.push(['legend.icon', 'roundRect']);
          this.defaultOption.push(['legend.pageIconSize ', [5, 5]]);
          this.defaultOption.push(['legend.textStyle.lineHeight', 2]);
          this.defaultOption.push(['legend.padding', 1]);
          this.defaultOption.push(['xAxis.show', false]);
          this.defaultOption.push(['xAxis.show', false]);
          this.defaultOption.push(['series[0].avoidLabelOverlap', true]); 
          this.defaultOption.push(['series[0].label.show', false]);        
          this.defaultOption.push(['series[0].type', 'pie']);
          this.defaultOption.push(['series[0].hoverOffset', 5]);
          this.defaultOption.push(['series[0].radius', ['50%', '70%']]);
          this.defaultOption.push(['series[0].center', ['80%', '50%']]);
          break;
        default:
          break;
      }
      // console.log('defaultOption', this.defaultOption);
      return this.defaultOption;
    }
  },
  created: function () {
    // if (!this.bus) this.bus = new Vue();
    // console.log('created', this.bus);
  },
  mounted () {
    // console.log('mounted', this.bus);
    this.getData();
  },
  methods: {
    async getData () {
      // let query = this.query ? this.query : {};
      this.newQuery = this.query ? this.query : {};
      
      if (this.field) {
        this.newQuery[this.field] = this.target;
      }

      let { error, data, total } = await getFromApi(this.entity, this, this.newQuery, this.populate);
      if (error) {
        console.log(error, data);
      }
      else
      {
        if (this.entity === 'Task') {
          let casesArray = [];
          total = 0;
          data.forEach(element => {
            element.case.forEach(cases => {
              casesArray.push({ _id: cases });
              total++;
            });
            this.newQuery = casesArray.length !== 0 ? { $or: casesArray } : '';
          });
        }

        if (this.populate) {
          data = data.filter(d => {
            let status = false;
            // console.log('POPULATE', this.populate, d.status, this.target, data);
            if (d.status.status === this.target) {
              status = true;
              this.newQuery[this.populate] = d.status.id;
            }
            return status;
          });
          total = data.length;
        }
        total = total ? total : 520;
        
        this.subTitleTotal = total;
        // this.subTitleTotal = this.onlineUsers ? this.onlineUsers : total;

        let result = await getLocalCollection(this.entity);
        let totalFull = result.data.length;
        this.subTitle = totalFull > 0 ? ((this.subTitleTotal * 100) / totalFull).toFixed(0) : 0;
        // console.log('Result', this.entity, totalFull, this.subTitleTotal, this.subTitle, result.data.length);
      }
    },
    cardClick () {
      // console.log('cardClick', this.newQuery);
      for (let i in this.newQuery) {
        if (this.newQuery.hasOwnProperty(i)) {
          this.bus.$emit('cardClick', this.newQuery);
          return;
        }
      }
    }
  }

};
</script>

<style>
.card-mini {
  cursor: pointer;
}
.chart {
  width: 100%;
  text-align: right;
}
.text-box {
  width: 80px;
  position: relative;
}
.mini-chart-title {
  font-size: 16px !important;
  font-weight: 400;
  padding-bottom: 8px !important;
  position: absolute;
  top: -30px;
  width: 150px;
}
</style>
