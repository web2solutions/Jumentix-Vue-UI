/* global session store */
import Vue from 'vue';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { getFromApi } from '../../helpers/helpers';
import setupAgency from './Agency';
import setupRoles from './Roles';
import setupPortalConfig from './PortalConfig';
import setupUsers from './Users';
import setupOrganization from './outsideOrganization';
import setupPrograms from './Programs';
import setupTaskStatus from './TaskStatus';
import setupTaskConfig from './TaskConfig';
import setupPhases from './Phases';
import setupGroups from './Groups';
export default {
  components: {
    VuePerfectScrollbar,
    setupAgency,
    setupRoles,
    setupPortalConfig,
    setupUsers,
    setupOrganization,
    setupPrograms,
    setupTaskStatus,
    setupTaskConfig,
    setupPhases,
    setupGroups
  },
  name: 'Setup',
  data: () => ({
    setupStep: 1,
    loading: false,
    selected: [],
    step: 0,
    headers: [
      {
        text: 'STEP',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'STATUS', sortable: false, align: 'right', value: 'status' }
    ],
    statusItem: [
      {
        id: 0,
        name: 'Setup Agency',
        status: 'Done',
        step: 'Agency'
      },
      {
        id: 1,
        name: 'Setup Roles',
        status: 'Done',
        step: 'Roles'
      },
      {
        id: 3,
        name: 'Setup Portal Configuration',
        status: 'Not Done',
        step: 'Portal'
      },
      {
        id: 3,
        name: 'Setup Users',
        status: 'Not Done',
        step: 'Users'
      },
      {
        id: 4,
        name: 'Setup Outiside Organization',
        status: 'Not Done',
        step: 'Outiside'
      },
      {
        id: 5,
        name: 'Setup Program',
        status: 'Not Done',
        step: 'Program'
      },
      {
        id: 6,
        name: 'Setup Task Statuses',
        status: 'Not Done',
        step: 'TaskStatuses'
      },
      {
        id: 7,
        name: 'Setup Tasks',
        status: 'Not Done',
        step: 'Tasks'
      },
      {
        id: 8,
        name: 'Setup Statges',
        status: 'Not Done',
        step: 'Statges'
      },
      {
        id: 9,
        name: 'Setup Groups',
        status: 'Not Done',
        step: 'Groups'
      },
      {
        id: 10,
        name: 'Setup Surveys',
        status: 'Not Done',
        step: 'Surveys'
      },
      {
        id: 11,
        name: 'Setup Reference',
        status: 'Not Done',
        step: 'Reference'
      },
      {
        id: 12,
        name: 'Setup Goodies',
        status: 'Not Done',
        step: 'Goodies'
      },
      {
        id: 13,
        name: 'Setup Portal configration',
        status: 'Not Done',
        step: 'Portal'
      },
      {
        id: 14,
        name: 'Setup Entity Permissions configration',
        status: 'Not Done',
        step: 'Entity Permissions'
      }
    ],
    selectedId: -1,
  }),
  computed: {

  },
  watch: {

  },
  created: function () {
    this.bus = new Vue();
  },
  mounted () {
    // this.$vuetify.goTo('#setupTop');
    if (!this.bus) this.bus = new Vue();

    this.bus.$on('nextStep', (e) => {
      this.setupStep = e;
    });
    
    this.bus.$on('previewStep', () => {
      this.setupStep = this.setupStep - 1
    });
    
    console.log('this.store', this.store);
  },
  methods: {
    goToUrl (e) {
      this.$router.push({ path: '/setup/' + e });
    },
    nextStep (n) {
      console.log(n, this.step);
      if (n === this.statusItem.length - 1) {
        this.step = 0;
      } else {
        this.step = n + 1;
      }
    },
    rowClick (item) {  
      this.selected = [item];
    }
  }
};
