/* global session */
import Vue from 'vue';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { getLocalCollection } from '../../helpers/helpers';

import MiniChart from '@/components/widgets/chart/xMiniChart';
export default {
  components: {
    VuePerfectScrollbar,
    MiniChart
  },
  name: 'ContactsDashboard',
  data: () => ({
    fab: false,
    search: null,
    v: false,
    dataset: {
      family: [
        { value: 2, name: 'Child' },
        { value: 6, name: 'Parent' }
      ],
      people: [
        { value: 2, name: 'Male' },
        { value: 6, name: 'Female' },
        { value: 6, name: 'Gay/Lesbian' },
        { value: 6, name: 'Straight' },
        { value: 5, name: 'Other' }
      ],
      users: [
        { value: 2, name: 'Parent' },
        { value: 6, name: 'Child' },
        { value: 6, name: 'Caseworker' },
        { value: 6, name: 'Manager' },
        { value: 5, name: 'Agency' }
      ],
      organizations: [
        { value: 2, name: 'Agency' },
        { value: 6, name: 'Hospital' },
        { value: 6, name: 'Law Firm' },
        { value: 6, name: 'Orphanage' },
        { value: 5, name: 'Insurance Company' }
      ]
    },
    familiesItem: [],
    familiesItemOff: [
      {
        id: 1, 
        name: 'Livings, Mark',
        address_state: 'Florida',
        address_country: 'USA',
        address_city: 'Seminole',
        photo: '/static/families/family.jpg',
        cases: 1,
        casesNote: 3,
        tasks: 2,
        surveys: 0,
        messages: 2,
        events: 0
      },
      {
        id: 2,
        name: 'de Andrade, Alvaro and  Michelle', 
        address_state: 'Federal District',
        address_country: 'Brazil',
        address_city: 'Brasília',
        photo: '/static/families/family-2.jpg',
        cases: 2,
        casesNote: 3,
        tasks: 7,
        surveys: 0,
        messages: 2,
        events: 0
      },
      {
        id: 3,
        name: 'Perotta, Eduardo and  Daiane', 
        address_state: 'Espirito Santo',
        address_country: 'Brazil',
        address_city: 'Guarapari',
        photo: '/static/families/family-3.jpg',
        cases: 2,
        casesNote: 3,
        tasks: 7,
        surveys: 0,
        messages: 2,
        events: 0
      },
      {
        id: 4, 
        name: 'Jobs, Steve and  Laurene',
        address_state: 'Florida',
        address_country: 'USA',
        address_city: 'Seminole',
        photo: '/static/families/family-4.jpg',
        cases: 1,
        casesNote: 3,
        tasks: 2,
        surveys: 0,
        messages: 2,
        events: 0
      },
      {
        id: 5,
        name: 'Livings, Mark and Letty', 
        address_state: 'Federal District',
        address_country: 'Brazil',
        address_city: 'Brasília',
        photo: '/static/families/family-5.jpg',
        cases: 2,
        casesNote: 3,
        tasks: 7,
        surveys: 0,
        messages: 2,
        events: 0
      },
      {
        id: 6,
        name: 'Perotta, Eduardo and  Daiane', 
        address_state: 'Espirito Santo',
        address_country: 'Brazil',
        address_city: 'Guarapari',
        photo: '/static/families/family-6.jpg',
        cases: 0,
        casesNote: 0,
        tasks: 1,
        surveys: 2,
        messages: 5,
        events: 0
      }
    ]
  }),
  computed: {

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
  watch: {

  },
  created () {
    // let self = this;
    this.bus = new Vue();
  },
  mounted () {
    if (!this.bus) this.bus = new Vue();
    this.getFamilies();
  },
  methods: {
    async getFamilies (id) {
      let { data, error } = await getLocalCollection('Family');
      if (error)
      {
        console.error('error on load', error);
        this.snackbar = {
          show: true,
          color: 'red',
          text: error
        };
        return { data, error };
      } 
      else
      {
        this.familiesItem = data;

        this.familiesItem.forEach((item, index) => {
          this.familiesItem[index].cases = 0;
          this.familiesItem[index].casesNote = 0;
          this.familiesItem[index].tasks = 1;
          this.familiesItem[index].surveys = 2;
          this.familiesItem[index].messages = 5;
          this.familiesItem[index].events = 0;
        });
        // Object.assign(this.families, data)
        console.error('Families loaded successfully', this.familiesItem);
        
      }
    },
    cardClick (e) {
      console.log('cardClick', e);
    },
    goTo (path, id) {
      // console.log(path, id);
      this.$router.push({ 
        path: path,
        // params: { id }
      });
    }
  }
};
