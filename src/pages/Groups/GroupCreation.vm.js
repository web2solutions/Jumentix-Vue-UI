/* global session */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Swal from 'sweetalert2/dist/sweetalert2.js';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'GroupCreation',
  data: () => ({
    step: 0,
    rules: {
      required: value => !!value || 'Required.',
    },
    groupName: null,
    personType: null,
    search: '',
    selected: [],
    headers: [
      {
        text: 'Task List Name',
        align: 'left',
        value: 'name'
      },
      { 
        text: '# of Tasks', 
        value: 'numTasks',
        align: 'left', 
      }
    ],
    tasksItems: [
      {
        id: 1,
        name: 'Send notarized document to circuit court.',
        numTasks: 3,
      },
      {
        id: 2,
        name: 'Upload a copy of the notorized child abuse document.',
        numTasks: 1,
      },
      {
        id: 3,
        name: 'Please complete the financial statement.',
        numTasks: 5,
      },
      {
        id: 4,
        name: 'Send notarized document to circuit court.',
        numTasks: 5,
      },
      {
        id: 5,
        name: 'Please print and download the child abuse document and get it notorized by a local notary.',
        numTasks: 5,
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
  methods: {
    creategroup () {
      Swal.fire(
        'Success!',
        'Group Successfully created.',
        'success'
      );
      this.groupName = '';
      this.personType = null;
      this.search = '';
      this.selected = [];
      this.step = 1;
    },
    deleteItem (item) {
      const index = this.items.indexOf(item);
      confirm('Are you sure you want to delete this item?') && this.items.splice(index, 1);
    },
  }
};
