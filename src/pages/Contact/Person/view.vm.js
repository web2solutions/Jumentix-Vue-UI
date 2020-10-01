/* global session */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'ContactsPersonView',
  data: () => ({
    personID: null,
    personData: {
      id: 1,
      first_name: 'Mark',
      last_name: 'Livings',
      user: '5c78a060c15bca840749e44b',
      nationality: 'American',
      gender: 'Male',
      sexual_orientation: 'Heterosexual/Straight',
      birthDate: '2017-07-21',
      photo: '/static/users/mark.png',
      ssn: '000-00-0000',
      cases: 1,
      casesNote: 3,
      tasks: 2,
      surveys: 0,
      messages: 2,
      events: 0,
      email: [
        {
          type: 'Work',
          email: 'myname@mycompany.com'
        }
      ],
      address: [
        {
          type: 'Home',
          line_1: '1120 N Street',
          line_2: 'string',
          city: 'Los Angeles',
          state: 'California',
          country: 'USA',
          zip: '942873',
          geolocation: '-20.6523942 -40.485365',
          isDefault: false
        }
      ],
      phone: [
        {
          type: 'Home',
          country_code: '+1',
          area_number: '1234',
          number: '9428739999',
          isDefault: false
        }
      ],
    },
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
      }, 
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
    caseItems: [
      {
        id: 1, 
        case_name: 'Case Name',
        case_number: 'CAS-768767',
        case_type: 'CaseType',
        case_status: 'Open',
        casesNote: 3,
        tasks: 2,
        surveys: 0,
      },
      {
        id: 2, 
        case_name: 'Case Name',
        case_number: 'CAS-768767',
        case_type: 'CaseType',
        case_status: 'Open',
        casesNote: 3,
        tasks: 2,
        surveys: 0,
      },
    ],
    taskItems: [
      {
        id: 1, 
        name: 'Case FL3476',
        stage: 'Stage 01',
        total: '35',
      },
      {
        id: 2, 
        name: 'Case FL3476',
        stage: 'Stage 05',
        total: '20',
      },
    ],
    surveysItems: [
      {
        id: 1, 
        name: 'Survey name 1',
        task: 'Task name',
        total: '35',
      },
      {
        id: 2, 
        name: 'Survey name 2',
        task: 'Task name',
        total: '35',
      },
      {
        id: 3, 
        name: 'Survey name 3',
        task: 'Task name',
        total: '35',
      }
    ],
    formItems: [
      {
        id: 1, 
        name: 'Form name 1',
        description: 'Form Description',
        status: 'Form Status',
      },
      {
        id: 2, 
        name: 'Form name 2',
        description: 'Form Description',
        status: 'Form Status',
      },
      {
        id: 3, 
        name: 'Form name 3',
        description: 'Form Description',
        status: 'Form Status',
      },
      {
        id: 4, 
        name: 'Form name 4',
        description: 'Form Description',
        status: 'Form Status',
      }
    ],
    eventItems: [
      {
        id: 1, 
        name: 'Event name 1',
        description: 'Event Description',
        status: 'Not signed yet',
      },
      {
        id: 2, 
        name: 'Event name 2',
        description: 'Event Description',
        status: 'Completed',
      },
      {
        id: 3, 
        name: 'Event name 3',
        description: 'Event Description',
        status: 'Not signed yet',
      },
      {
        id: 4, 
        name: 'Event name 4',
        description: 'Event Description',
        status: 'Signed',
      },
      {
        id: 4, 
        name: 'Event name 5',
        description: 'Event Description',
        status: 'Not Completed',
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
    this.personID = this.$route.params.id;
    console.log('personID', this.personID);
  },
  methods: {

  }
};
