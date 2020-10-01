/* global session */
import { Tasks, getTaskByStatus, getTaskWorker } from './API/tasks';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import {
  getOne,
} from '../../helpers/helpers';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'TaskView',
  data: () => ({
    tasks: Tasks,
    TaskGroup: []

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
  mounted () {  
    this.groupID = this.$route.params.id;
    this.getGroup(this.groupID);
  },
  created () {
    // let self = this;
    console.log(session.user().role, this.tasks, getTaskByStatus('In-Progress'));
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
        // if (this.TaskGroup.task.length > 0) this.feedItems('Task', this.TaskGroup.task, 'status');
        // this.dialog_loading = false;
      }
    },
    clickFilterMenu (e) {
      if (e.target.innerText === 'Worker Tasks') {
        this.tasks = getTaskWorker(e.target.innerText);
      } else {
        this.tasks = getTaskByStatus(e.target.innerText);
      }
      console.log(e.target.innerText, 'Clicked: ', this.tasks);
    },
    clickCardAction (e) {
      console.log(e);
    }
  }
};
