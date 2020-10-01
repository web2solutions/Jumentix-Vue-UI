/* global session */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { getOnLocalCollection } from '../../../helpers/helpers';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'ContactsFamilyView',
  data: () => ({
    familyID: null,
    familie: {
      id: 123, 
      name: 'Livings, Mark and Letty',
      address_line_1: '1120 N Street',
      address_line_2: '',
      address_state: 'Florida',
      address_country: 'USA',
      address_city: 'Seminole',
      photo: '/static/families/family.jpg',
      address_zip: 942873,
      phone_country_code: '+1',
      phone_area_number: '1234',
      phone_number: '9428739999',
      email: 'marklivings@web2solutions.com',
      member: [
        { 
          _id: '5c78a060c15bca840749e44a', 
          who: '5c78a060c15bca840749e44b', 
          role: '5c78a060c15bca840749e44b', 
          sub_role: '5c78a060c15bca840749e44b', 
          type: 'Biological', 
          whose: '5c78a060c15bca840749e44b', 
          startDate: '2017-07-21T17:32:28Z', 
          endDate: '2017-07-22T17:32:28Z'
        }
      ],
      members: 8,
      relations: 4,
      social: 3,
      service: 2,
      wallet: 1,
      invoices: 0,
      cases: 1,
      casesNote: 3,
      tasks: 2,
      surveys: 0,
      messages: 2,
      events: 0
    },
    parentsItems: [
      {
        id: 1, 
        name: 'Mark Livings',
        photo: '/static/users/mark.png',
        role: 'Husband - Applicant 1',
        gender: 'Male',
        cases: 1,
        casesNote: 3,
        tasks: 2,
        surveys: 0,
        messages: 2,
        events: 0
      },
      {
        id: 2, 
        name: 'Letty Livings',
        photo: '/static/users/letty.jpg',
        role: 'Wife - Applicant 2',
        gender: 'Female',
        cases: 1,
        casesNote: 3,
        tasks: 2,
        surveys: 0,
        messages: 2,
        events: 0
      },
      {
        id: 3, 
        name: 'Demi Moore',
        photo: '/static/users/ex-wife.jpg',
        role: 'Ex-Wife',
        gender: 'Female',
        cases: 0,
        casesNote: 0,
        tasks: 3,
        surveys: 1,
        messages: 2,
        events: 0
      }
    ],
    childrenItems: [
      {
        id: 1, 
        name: 'Mathew Livings',
        photo: '/static/users/son.jpg',
        role: 'Son',
        gender: 'Male',
        cases: 1,
        casesNote: 3,
        tasks: 2,
        surveys: 0,
        messages: 2,
        events: 0
      },
      {
        id: 2, 
        name: 'Lisa Livings',
        photo: '/static/users/daughter.jpg',
        role: 'Daughter',
        gender: 'Female',
        cases: 1,
        casesNote: 3,
        tasks: 2,
        surveys: 0,
        messages: 2,
        events: 0
      },
    ],
    servicesItems: [
      {
        id: 1, 
        name: 'Chuck Norris',
        photo: '/static/users/chucknorris.jpg',
        role: 'Counselor',
        gender: 'Male',
        whose: 'Mark Livings',
        cases: 1,
        casesNote: 3,
        tasks: 2,
        surveys: 0,
        messages: 2,
        events: 0
      },
      {
        id: 2, 
        name: 'Bidisha Ghosh',
        photo: '/static/users/bidisha.png',
        role: 'Case Worker Manager',
        gender: 'Female',
        whose: 'Mathew Livings',
        cases: 1,
        casesNote: 3,
        tasks: 2,
        surveys: 0,
        messages: 2,
        events: 0
      },
      {
        id: 3, 
        name: 'Robert Ray',
        photo: '/static/users/dr-ray.png',
        role: 'Doctor',
        gender: 'Male',
        whose: 'Mark Livings',
        cases: 0,
        casesNote: 0,
        tasks: 2,
        surveys: 0,
        messages: 2,
        events: 0
      }
    ],
    socialItems: [
      {
        id: 2, 
        name: 'Bidisha Ghosh',
        photo: '/static/users/bidisha.png',
        role: 'Friend',
        gender: 'Female',
        whose: 'Letty Livings',
        cases: 1,
        casesNote: 3,
        tasks: 2,
        surveys: 0,
        messages: 2,
        events: 0
      },
      {
        id: 1, 
        name: 'Chuck Norris',
        photo: '/static/users/chucknorris.jpg',
        role: 'Friend',
        gender: 'Male',
        whose: 'Mark Livings',
        cases: 1,
        casesNote: 3,
        tasks: 2,
        surveys: 0,
        messages: 2,
        events: 0
      },
      {
        id: 3, 
        name: 'John Travolta',
        photo: '/static/users/john.jpg',
        role: 'Neighbor',
        gender: 'Male',
        whose: 'Mark Livings',
        cases: 0,
        casesNote: 0,
        tasks: 2,
        surveys: 0,
        messages: 2,
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
  },
  mounted () {
    this.familyID = this.$route.params.id;
    console.log('familyID', this.familyID);
    this.getFamily(this.familyID);
  },
  methods: {
    async getFamily (id) {
      let { data, error } = await getOnLocalCollection('Family', id);
      if (error)
      {
        console.error('error on create', error);
        this.snackbar = {
          show: true,
          color: 'red',
          text: error
        };
        return { data, error };
      } 
      else
      {
        Object.assign(this.familie, data)
        console.error('Family loaded successfully', this.familie, data);
        
      }
    }

  }
};
