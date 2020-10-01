/* global session */
import {
  getFromApi,
} from '../../../helpers/helpers';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'TaskSubGroup',
  props: {
    groupid: String,
    bus: {
      type: Object,
      default: function () { return {} },
    }
  },
  data: () => ({
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    groups: '',
    messageNoSubGroup: false
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
    this.group_id = this.groupid ? this.groupid : this.$route.params.id; // fix props
    this.getData('TaskSubGroup');
  },
  methods: {
    async getData (entity) {
      console.log('getData >>>>>>>>>>>');
      let where = { 'task_group': this.group_id };
      let { data, total, error } = await getFromApi(entity, this, where, 'task');
      if (data.length > 0) {
        this.groups = data;
        this.groups.forEach(group => {
          group.taskTotal = group.task.length;
          group.taskValue = group.taskTotal > 0 ? ((group.task.length * 100) / group.taskTotal).toFixed(0) : 0;
        });
      }
      else
      {
        this.messageNoSubGroup = true;
      }
    }
  }
};
