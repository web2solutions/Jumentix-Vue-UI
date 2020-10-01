/* global session */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Sortable from 'sortablejs';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'AccountDashboard',
  data: () => ({
    widgetList: [
      { title: 'Announcements', active: true },
      { title: 'Messages', active: true },
      { title: 'Finance', active: true },
      { title: 'Get Help', active: true },
      { title: 'Search', active: true },
      { title: 'Task', active: true },
      { title: 'Upcomming Events', active: true },
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
  directives: {
    sortableList: {
      bind (el, binding, vnode) {
        // console.log(el, vnode);
        const options = {
          handle: '.sortHandle',
          animation: 150,
          onUpdate: function (event) {
            vnode.child.$emit('sorted', event);
          },
        };
        Sortable.create(el, options);
      },
    }
  },
  watch: {

  },
  created () {
    // let self = this;
  },
  methods: {
    objectSortOccurred ({ oldIndex, newIndex }) {
      const moved = this.widgetList.splice(oldIndex, 1)[0];
      this.widgetList.splice(newIndex, 0, moved);
      console.log(this.widgetList);
    }
  }
};
