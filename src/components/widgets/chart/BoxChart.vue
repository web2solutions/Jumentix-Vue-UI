<template>
  <v-card :color="cardColor" :dark="dark">
    <v-card-title>
      <div class="layout row ma-0">
        <div class="subheading">{{title}}</div>
        <v-spacer></v-spacer>
        <!-- <div class="caption"> <v-icon>trending_up</v-icon>  {{subTitle}}</div> -->
      </div>
    </v-card-title>
    <v-card-text class="white--text">
      <e-chart 
      ref="pie"
      :path-option="computeChartOption"
      height="308px"
      width="100%"
      >
      </e-chart>
    </v-card-text>    
  </v-card>    
</template>

<script>
import EChart from '@/components/chart/echart';
import Material from 'vuetify/es5/util/colors';
import { getFromApi, getLocalCollection, feedGrid } from '../../../helpers/helpers';

export default {
  components: {
    EChart
  },
  props: {
    title: String,
    gradient: {
      type: Boolean,
      default: false,
    },
    subTitle: String,
    icon: String,
    cardColor: {
      type: String,
    },
    iconColor: {
      type: String,
      default: 'success',
    },
    type: String,
    chartColor: Array,
    data: Array,
    entity: String,
    dark: Boolean
  },
  data () {
    return {
      pagination: {
        sortBy: '_id',
        descending: true,
        page: 1,
        rowsPerPage: 100, // -1 for All
        totalItems: 0
      },
      defaultOption: [
        ['dataset.source', this.data],
        ['xAxis.show', false],
        ['yAxis.show', false],
        ['grid.top', '15%'],
        ['grid.left', '0'],
        ['grid.bottom', '0'],
        ['grid.right', '0'],        
        ['color', this.chartColor],
      ],
      color: Material,
      dataList: [],
      pie: null,
    };
  },

  computed: {
    computeCardDark () {
      return this.$vuetify.dark;
    },
    computeChartOption () {
      switch (this.type) {
        case 'bar':
          this.defaultOption.push(['series[0].type', 'bar']);
          this.defaultOption.push(['series[0].barWidth', '50%']);
          // add shadow series
          // this.defaultOption.push(['series[1].type', 'bar']);
          break;
        case 'stack-bar':
          // set stacked bar
          // this.defaultOption.push(['series[0].data', StackBarData]);
          this.defaultOption.push(['series[0].type', 'bar']);
          this.defaultOption.push(['series[0].itemStyle.normar.color', 'rgba(0,0,0,0.05)']);
          this.defaultOption.push(['series[0].barGap', '-100%']);
          // set main series
          // this.defaultOption.push(['series[1].data', StackData]);
          this.defaultOption.push(['series[1].type', 'bar']);
          break;  
        case 'area':
          this.defaultOption.push(['series[0].type', 'line']);
          this.defaultOption.push(['series[0].smooth', true]);
          this.defaultOption.push(['xAxis.boundaryGap', false]);          
          this.defaultOption.push(['series[0].areaStyle', {}]); 
          if (this.gradient) {
            this.defaultOption.push(['series[0].areaStyle', {
              normal: {
                color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: this.chartColor[0],
                  }, 
                  {
                    offset: 1,
                    color: this.chartColor[1],
                  }
                ])
              }            
            }]);
          }

          break;
        case 'pie':
          // this.defaultOption.push(['dataset.source', this.data]);
          this.defaultOption.push(['color', [this.color.lightBlue.base, this.color.indigo.base, this.color.pink.base, this.color.green.base, this.color.cyan.base, this.color.teal.base, this.color.orange.base]]);
          // this.defaultOption.push(['legend.orient', 'vertical']);
          // this.defaultOption.push(['legend.x', 'left']);
          this.defaultOption.push(['xAxis.show', false]);
          this.defaultOption.push(['yAxis.show', false]);
          this.defaultOption.push(['series[0].type', 'pie']);
          
          // this.defaultOption.push(['dataset.source', this.dataList]);    
          break;
        default:
          // line
          this.defaultOption.push(['series[0].smooth', true]);
          this.defaultOption.push(['xAxis.boundaryGap', false]);
          break;
      }

      return this.defaultOption;
    }
  },
  watch: {
    dataList: function (newData, oldData) {
      this.pie.pathOption[0][1] = newData;
      this.pie.init();
      // console.log('PIE >>>>>>>>>>>: ', this.pie.pathOption[0][1]);
    }
  },
  mounted () {
    this.pie = this.$refs.pie;
  },
  created () {
    this.getData(this.entity);
  },
  methods: {
    async getData (entity) {
      if (entity === 'Human') {
        let { data, total, error } = await getFromApi(entity, this, null, 'user');
        // console.log('this.data>>>>>>>>>>>>>>', data);
        if (data.length > 0) {
          data.forEach(human => {
            if (human.user) {
              let role = `${human.user.roles.toString()[0].toUpperCase()}${human.user.roles.toString().slice(1)}`;
              if (this.dataList.length > 0) {
                this.dataList.forEach((element, i) => {
                  if (element.name === role) {
                    this.dataList[i].value += 1;
                  } else {
                    let hasItem = false;
                    this.dataList.forEach((element2, j) => {
                      if (role === element2.name) {
                        hasItem = true;
                        // return;
                      }
                    });
                    if (!hasItem) this.dataList.push({ name: role, value: 1 });
                  }
                });
              }
              else 
              {
                this.dataList.push({ name: role, value: 1 });
              }
            }
          });
        }
      }
    }
  }

};
</script>

<style>

</style>
