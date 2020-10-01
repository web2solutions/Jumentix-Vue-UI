/* global session store $route moment */
import { getOnLocalCollection, create, getLocalCollection } from '../../helpers/helpers';
import API from '@/api';
import EChart from '@/components/chart/echart';
import Material from 'vuetify/es5/util/colors';
import VWidget from '@/components/VWidget';
import MenuNav from './MenuNav';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    'component-menu-nav': MenuNav,
    VWidget,
    EChart,
    VuePerfectScrollbar
  },
  data: () => ({
    color: Material,
    amount: 0
  }),
  computed: {
    siteTrafficData () {
      return API.getMonthVisit;
    }
  },
  mounted () {
    this.initialize();
  },
  beforeRouteEnter (to, from, next) {
    if (!session.isOnline())
    {
      // return;
      next({ path: '/login' });
    }
    else
    {
      next();
    }
  },
  methods: {
    async initialize () {
      let { data, total, error } = await getLocalCollection('Invoice', false);
      if (error) {
        console.log(error);
      } else {
        let invoices = data;
        // console.log('Invoices: ', data);
        for (const key in invoices) {
          if (invoices.hasOwnProperty(key)) {
            const invoice = invoices[key];
            const today = new Date().toISOString();
            const today15 = new Date(moment(today).add(15, 'day')._d).toISOString();
            invoice.good.forEach(async items => {
              // console.log('Items: ', items);
              let { data, total, error } = await getOnLocalCollection('Good', items.good);
              if (error) {
                console.log(error);
              } else {
                console.log('Items: ', data);
                if (invoice.status === 'Overdue' || invoice.status === 'Open') {
                  if (invoice.due_date < today) {
                    console.log('invoice.due_date >= today');
                  }
                  if (invoice.due_date >= today && invoice.due_date <= today15) {
                    console.log('TODAY15');
                  }
                  console.log('due_date', invoice.due_date, today, today15);
                  this.amount += data.unity_price * data.quantity;
                }
                
              }
            }); 
          }
        }
        console.log('this.amount', this.amount);
       
      }
    }
    
  }

};