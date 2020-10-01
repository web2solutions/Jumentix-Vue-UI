/* global session */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'Caseworker',
  data: () => ({

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

  }
};
