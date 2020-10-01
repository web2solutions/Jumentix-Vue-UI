/* global session */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Mediator from '../../Mediator';
import moment from 'moment-timezone';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'EventsView',
  data: () => ({
    qntTickets: [
      { text: '1', value: '1' },
      { text: '2', value: '2' },
      { text: '3', value: '3' },
      { text: '4', value: '4' },
    ],
    btnBuyNow1: false,
    btnBuyNow2: false,
    btnBuyNow3: false,
    events: {
      
    }
  }),
  computed: {
    session () {
      return this.store.state.session;
    },
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
    // let self = this;
    console.log(this.$route.params.id);
    if (!this.$route.params.id) return;
    (async () => {
      let document = await Mediator.client.store.models.Event.get(this.$route.params.id);
      console.log(document);
      if (document)
      {
        this.events = document;
      }
      // this.events = data;
    })();
  },
  methods: {
    buynow1 () {
      this.btnBuyNow1 = !this.btnBuyNow1;
      this.btnBuyNow2 = false;
      this.btnBuyNow3 = false;
    },
    buynow2 () {
      this.btnBuyNow2 = !this.btnBuyNow2;
      this.btnBuyNow1 = false;
      this.btnBuyNow3 = false;
    },
    buynow3 () {
      this.btnBuyNow3 = !this.btnBuyNow3;
      this.btnBuyNow2 = false;
      this.btnBuyNow1 = false;
    }
    
  }
};
