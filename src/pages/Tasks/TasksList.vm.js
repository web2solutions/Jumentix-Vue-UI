/* global session */
import {
  getFromApi,
  create,
  getLocalCollection,
  getCollection,
  getOne
} from '../../helpers/helpers';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'Sample',
  data: () => ({
    groupID: '',
    TaskGroup: '',
    caseItems: [],
    rowsPerPageItems: [4, 8, 12],
    pagination: {
      sortBy: '_id',
      descending: false,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    }
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
    //
  },
  created () {
    // console.log('created');
  },
  mounted () {
    // console.log('mounted');
    this.groupID = this.$route.params.id;
    this.getGroup(this.groupID);
    this.getCases(this.groupID);
  },
  methods: {
    async getGroup (groupID) {
      let { data, total, error } = await getOne('Group', groupID);
      if (error) {
        if (error === 'getById TaskGroup') this.$router.push({ path: '/tasks' });
      }
      else 
      {
        this.TaskGroup = data;
      }
    },
    async getCases (groupID) {
      let { data, total, error } = await getFromApi('Case', this, { group: groupID }, 'phase.phase');
      if (error) {
        if (error === 'getById TaskGroup') this.$router.push({ path: '/tasks' });
      }
      else 
      {
        this.caseItems = data;
        this.caseItems.forEach((element, index) => {
          this.caseItems[index].totalTasks = 0;
          element.phase.forEach(phase => {
            this.caseItems[index].totalTasks += phase.phase ? phase.phase.task.length : 0;
          });
          
        });
        // console.log('caseItems', this.caseItems);
      }
    }
  }
};
