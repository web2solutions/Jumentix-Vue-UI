/* global session */
export default {
  name: 'Sample',
  data: () => ({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    tab: 0,
    tabs: null,
    tabsContent: null,
    headers: [
      {
        text: 'ID',
        align: 'left',
        value: 'id',
        width: '10'
      },
      { text: 'Status', value: 'status', align: 'center', width: '10' },
      { text: 'Description', value: 'description' },
      { text: 'info', value: 'info', align: 'center', width: '30' }
    ],
    tasks: [
      {
        id: 1,
        status: 51,
        description: 'Consider delegating Vivek`s tasks',
        info: true,
      },
      {
        id: 2,
        status: 50,
        description: 'Consider delegating Vivek`s tasks',
        info: false,
      },
      {
        id: 3,
        status: 1,
        description: 'Consider delegating Vivek`s tasks',
        info: false,
      },
      {
        id: 4,
        status: 71,
        description: 'Consider delegating Vivek`s tasks',
        info: true,
      },
      {
        id: 5,
        status: 61,
        description: 'Consider delegating Vivek`s tasks',
        info: false,
      },
      {
        id: 6,
        status: 1,
        description: 'Consider delegating Vivek`s tasks',
        info: false,
      },
      {
        id: 7,
        status: 1,
        description: 'Consider delegating Vivek`s tasks',
        info: false,
      },
      {
        id: 8,
        status: 71,
        description: 'Consider delegating Vivek`s tasks',
        info: true,
      },
      {
        id: 9,
        status: 1,
        description: 'Consider delegating Vivek`s tasks',
        info: true,
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
    this.tabs = [{ name: 'Application' }, { name: 'Home Study' }, { name: 'Profile Creation' }];
    this.tabsContent = ['Application', 'Home Study', 'Profile Creation'];
  },
  methods: {
    showAlert (e) {
      console.log(e);
      this.$router.push('/tasks-details/' + e);
    }

  },
  components: {

  }
};
