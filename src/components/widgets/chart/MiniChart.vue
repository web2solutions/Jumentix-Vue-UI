
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
        <div class="layout row ma-0 pt-3 align-center justify-space-between">
          <div class="text-box">
            <div class="mini-chart-title">{{title}}</div>
            <span class="display-2">{{subTitleTotal}}</span>
            <span class="grey--text">{{subTitle}}% <v-icon small :color="iconColor">{{icon}}</v-icon></span>
          </div>
          <div class="chart" v-if="type !== 'circular'">
            <e-chart 
              :path-option="computeChartOption"
              height="60px"
              width="100%"
              >
            </e-chart>
          </div>
          <div class="chart" v-else>
            <v-progress-circular
              :size="60"
              :width="6"
              :rotate="360"
              :value="subTitle"
              :color="chartColor"
            >
            </v-progress-circular>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-hover> 
</template>

<script>
import Vue from 'vue';
import EChart from '@/components/chart/echart';
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
        rowsPerPage: 1000, // -1 for All
        totalItems: 0
      },
      defaultOption: [
        ['dataset.source', this.data],
        ['xAxis.show', false],
        ['yAxis.show', false],
        ['color', [this.chartColor]],
      ],
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
        default:
          break;
      }
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

      let { error, data, total, count } = await getFromApi(this.entity, this, this.newQuery, this.populate);
      if (error) {
        console.log(error, data);
      }
      else
      {
        if (this.populate === 'phase.phase') {
          let tasksArray = [];
          total = 0;
          data.forEach(element => {
            element.phase.forEach(phase => {
              if (phase.phase !== null) {
                phase.phase.task.forEach(task => {
                  tasksArray.push({ _id: task });
                  total++;
                });
              }
            });
            this.newQuery = tasksArray.length !== 0 ? { $or: tasksArray } : '';
          });
          // console.log(this.title, this.target, this.newQuery);
          if (this.target) {
            count = total;
            total = 0;
            let taskstatus = await getFromApi('TaskTemplate', this, this.newQuery, 'status');
            taskstatus.data.forEach(d => {
              if (d.status.status === this.target) {
                this.newQuery[this.populate] = d.status.id;
                total++;
              }
            });
          } 
          else
          {
            let tasks = await getLocalCollection('TaskTemplate');
            count = tasks.data.length;
          }
          
        } 
        else
        {
          total = 0;
          if (this.target !== 'Notes') {
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
          } else {
            data.forEach(element => {
              total += element.notes.length;
            });

          }
        }

        total = total ? total : 0;
        
        // this.subTitleTotal = total;
        this.subTitleTotal = this.onlineUsers ? this.onlineUsers : total;

        // let result = await getLocalCollection(this.entity);
        // let totalFull = result.data.length;
        let totalFull = count;
        this.subTitle = totalFull > 0 ? ((this.subTitleTotal * 100) / totalFull).toFixed(0) : 0;
        // console.log('Result', this.title, this.entity, this.target, totalFull, this.subTitleTotal, this.subTitle, data.length);
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
  height: 60px;
}
.text-box {
  width: 110px;
  position: relative;
}
.mini-chart-title {
  font-size: 16px !important;
  font-weight: 400;
  padding-bottom: 8px !important;
  position: absolute;
  top: -30px;
  width: 185px !important;
}
</style>
