
/* global session */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Sortable from 'sortablejs';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'Account',
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
    },
    sortableCard: {
      bind (el, binding, vnode) {
        // console.log(el, vnode);
        let sortableElement = el.getElementsByTagName('tbody')[0];
        const options = {
          handle: '.sortHandle',
          animation: 150,
          onUpdate: function (event) {
            // vnode.child.$emit('sorted', event);
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
    cardSortOccurred ({ oldIndex, newIndex }) {
      const moved = this.cardSort.splice(oldIndex, 1)[0];
      this.cardSort.splice(newIndex, 0, moved);
    }
  }
};
