/* global session */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'EventsPurchase',
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
    qtdValue1: 0,
    qtdValue2: 1,
    qtdValue3: 1,

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
